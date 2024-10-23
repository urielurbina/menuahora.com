import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import configFile from "@/config";
import User from "@/models/User";
import { findCheckoutSession } from "@/libs/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// This is where we receive Stripe webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
// See more: https://shipfa.st/docs/features/payments
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

        await user.save();
        console.log("User saved successfully:", user);

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Cancel soon" badge for instance
        break;
      }

      case "customer.subscription.deleted": {
        // The customer subscription stopped
        // ❌ Revoke access to the product
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        const subscription = await stripe.subscriptions.retrieve(
          data.object.id
        );
        const user = await User.findOne({ customerId: subscription.customer });

        // Revoke access to your product
        user.hasAccess = false;
        await user.save();

        break;
      }

      case "invoice.paid": {
        console.log("Invoice paid:", data.object.id);
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product
        const priceId = data.object.lines.data[0].price.id;
        const customerId = data.object.customer;

        const user = await User.findOne({ customerId });

        if (!user) {
          console.error("No user found for customerId:", customerId);
          // You might want to create a new user here or handle this case differently
          break;
        }

        // Make sure the invoice is for the same plan (priceId) the user subscribed to
        if (user.priceId !== priceId) break;

        // Grant user access to your product. It's a boolean in the database, but could be a number of credits, etc...
        user.hasAccess = true;
        await user.save();

        break;
      }

      case "invoice.payment_failed":
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        break;

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("Stripe webhook error:", e.message, "| EVENT TYPE:", type);
  }

  return NextResponse.json({ received: true });
}
