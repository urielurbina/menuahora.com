import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import configFile from "@/config";
import User from "@/models/User";
import { findCheckoutSession } from "@/libs/stripe";
import { connectToDatabase } from "@/libs/mongodb";
import { sendServerEvent, generateEventId, FB_EVENTS } from "@/libs/facebook-pixel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const REFERRAL_REWARD = 3500; // $35.00 en centavos

// Función para procesar el pago de referido
async function processReferralPayout(user, paymentAmount) {
  try {
    if (!user.referredBy) {
      console.log("User has no referrer");
      return;
    }

    const { db } = await connectToDatabase();

    // Buscar el negocio del referidor por username
    const referrerBusiness = await db.collection('businesses').findOne({
      username: user.referredBy.toLowerCase()
    });

    if (!referrerBusiness) {
      console.log("Referrer business not found:", user.referredBy);
      return;
    }

    // Buscar el usuario referidor
    const referrer = await db.collection('users').findOne({
      _id: referrerBusiness.userId
    }) || await db.collection('users').findOne({
      email: referrerBusiness.userId
    });

    if (!referrer) {
      console.log("Referrer user not found");
      return;
    }

    // Verificar que el referidor tenga suscripción activa
    if (referrer.hasAccess !== true) {
      console.log("Referrer does not have active subscription, skipping payout");
      return;
    }

    // Verificar si el referidor tiene Stripe Connect configurado y onboarded
    if (!referrer.stripeConnectId || !referrer.stripeConnectOnboarded) {
      console.log("Referrer not connected to Stripe, accumulating earnings");
      // Acumular ganancias aunque no tenga Stripe Connect
      await db.collection('users').updateOne(
        { _id: referrer._id },
        { $inc: { referralEarnings: REFERRAL_REWARD / 100 } }
      );
      return;
    }

    // Crear transfer a la cuenta Connect del referidor
    try {
      const transfer = await stripe.transfers.create({
        amount: REFERRAL_REWARD,
        currency: 'mxn',
        destination: referrer.stripeConnectId,
        description: `Referral reward for ${user.email}`,
        metadata: {
          referredUserId: user._id?.toString(),
          referredEmail: user.email,
          referrerId: referrer._id?.toString(),
        },
      });

      console.log("Transfer created:", transfer.id);

      // Actualizar ganancias del referidor
      await db.collection('users').updateOne(
        { _id: referrer._id },
        {
          $inc: {
            referralEarnings: REFERRAL_REWARD / 100,
            referralPaidOut: REFERRAL_REWARD / 100,
          }
        }
      );

      // Registrar el payout en una colección separada para historial
      await db.collection('referralPayouts').insertOne({
        referrerId: referrer._id,
        referrerEmail: referrer.email,
        referredUserId: user._id,
        referredEmail: user.email,
        amount: REFERRAL_REWARD / 100,
        stripeTransferId: transfer.id,
        createdAt: new Date(),
      });

      console.log("Referral payout processed successfully");

    } catch (transferError) {
      console.error("Error creating transfer:", transferError.message);
      // Aún así acumular ganancias para pago manual
      await db.collection('users').updateOne(
        { _id: referrer._id },
        { $inc: { referralEarnings: REFERRAL_REWARD / 100 } }
      );
    }

  } catch (error) {
    console.error("Error processing referral payout:", error);
  }
}

// This is where we receive Stripe webhook events
export async function POST(req) {
  await connectMongo();

  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const { type, data } = event;

  try {
    console.log("Processing event:", type);

    switch (type) {
      case "checkout.session.completed": {
        console.log("Checkout session completed:", data.object.id);

        const session = await findCheckoutSession(data.object.id);
        console.log("Session details:", session);

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price.id;
        const userId = data.object.client_reference_id;

        console.log("Customer ID:", customerId);
        console.log("Price ID:", priceId);
        console.log("User ID:", userId);

        const plan = configFile.stripe.plans.find(p =>
          p.priceId.monthly === priceId || p.priceId.yearly === priceId
        );

        if (!plan) {
          console.error("No plan found for priceId:", priceId);
          break;
        }

        console.log("Plan found:", plan.name);

        const customer = await stripe.customers.retrieve(customerId);
        console.log("Customer details:", customer);

        let user;

        if (userId) {
          user = await User.findById(userId);
          console.log("Existing user found by ID:", user);
        } else if (customer.email) {
          user = await User.findOne({ email: customer.email });
          console.log("Existing user found by email:", user);

          if (!user) {
            user = new User({
              email: customer.email,
              name: customer.name,
              customerId: customerId,
              priceId: priceId,
              hasAccess: true,
              plan: plan.name,
            });
            console.log("New user created:", user);
          }
        } else {
          console.error("No user information found");
          throw new Error("No user information found");
        }

        // Update user data
        user.priceId = priceId;
        user.customerId = customerId;
        user.hasAccess = true;
        user.plan = plan.name;

        // Desactivar trial cuando el usuario paga
        if (user.isOnTrial) {
          user.isOnTrial = false;
          console.log("Trial deactivated for user:", user.email);
        }

        await user.save();
        console.log("User saved successfully:", user);

        // Track Purchase event with Facebook Conversions API
        try {
          const purchaseAmount = session.amount_total / 100; // Convert from cents
          await sendServerEvent({
            eventName: FB_EVENTS.PURCHASE,
            eventId: generateEventId(),
            eventSourceUrl: 'https://www.repisa.co/onboarding',
            userData: {
              email: user.email,
              firstName: user.name?.split(' ')[0],
              lastName: user.name?.split(' ').slice(1).join(' '),
              externalId: user._id?.toString(),
              subscriptionId: customerId,
            },
            customData: {
              value: purchaseAmount,
              currency: 'MXN',
              content_name: plan.name,
              content_type: 'subscription',
              content_ids: [priceId],
              num_items: 1,
            },
          });
          console.log("FB Purchase event sent for:", user.email);
        } catch (fbError) {
          console.error("FB Purchase event failed:", fbError);
        }

        // Procesar pago de referido (primer pago)
        await processReferralPayout(user, session.amount_total);

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan
        break;
      }

      case "customer.subscription.deleted": {
        // The customer subscription stopped
        const subscription = await stripe.subscriptions.retrieve(
          data.object.id
        );
        const user = await User.findOne({ customerId: subscription.customer });

        if (user) {
          user.hasAccess = false;
          await user.save();
        }

        break;
      }

      case "invoice.paid": {
        console.log("Invoice paid:", data.object.id);
        const invoice = data.object;

        // Solo procesar si no es el primer invoice (billing_reason !== 'subscription_create')
        // porque el primer pago ya se procesa en checkout.session.completed
        if (invoice.billing_reason === 'subscription_cycle') {
          const customerId = invoice.customer;
          const user = await User.findOne({ customerId });

          if (user) {
            // Grant access
            user.hasAccess = true;
            await user.save();

            // Procesar pago de referido para pagos recurrentes
            await processReferralPayout(user, invoice.amount_paid);
            console.log("Recurring payment processed for:", user.email);
          }
        }

        break;
      }

      case "invoice.payment_failed":
        // A payment failed
        break;

      case "account.updated": {
        // Stripe Connect account was updated
        const account = data.object;

        if (account.details_submitted && account.payouts_enabled) {
          const { db } = await connectToDatabase();
          await db.collection('users').updateOne(
            { stripeConnectId: account.id },
            { $set: { stripeConnectOnboarded: true } }
          );
          console.log("Stripe Connect onboarding completed for:", account.id);
        }
        break;
      }

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("Stripe webhook error:", e.message, "| EVENT TYPE:", type);
  }

  return NextResponse.json({ received: true });
}
