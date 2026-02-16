import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // Obtener datos del usuario
    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Determinar estado de suscripción
    let status = 'none';
    let daysLeft = null;
    let trialEndDate = null;
    let subscriptionEndDate = null;
    let stripeSubscription = null;

    if (user.hasAccess === true) {
      status = 'active';

      // Si tiene customerId, obtener detalles de Stripe
      if (user.customerId) {
        try {
          const subscriptions = await stripe.subscriptions.list({
            customer: user.customerId,
            status: 'active',
            limit: 1,
          });

          if (subscriptions.data.length > 0) {
            const sub = subscriptions.data[0];
            stripeSubscription = {
              id: sub.id,
              status: sub.status,
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
              plan: {
                interval: sub.items.data[0]?.price?.recurring?.interval,
                amount: sub.items.data[0]?.price?.unit_amount,
              }
            };
            subscriptionEndDate = stripeSubscription.currentPeriodEnd;
          }
        } catch (stripeError) {
          console.error('Error fetching Stripe subscription:', stripeError);
        }
      }
    } else if (user.isOnTrial && user.trialEndDate) {
      const now = new Date();
      const trialEnd = new Date(user.trialEndDate);

      if (now < trialEnd) {
        status = 'trial';
        daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
        trialEndDate = user.trialEndDate;
      } else {
        status = 'expired';
        trialEndDate = user.trialEndDate;
      }
    } else if (user.trialEndDate) {
      status = 'expired';
      trialEndDate = user.trialEndDate;
    }

    return NextResponse.json({
      status,
      plan: user.plan || 'Plan Esencial',
      daysLeft,
      trialEndDate,
      trialStartDate: user.trialStartDate || null,
      subscriptionEndDate,
      stripeSubscription,
      hasCustomerId: !!user.customerId,
      user: {
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      }
    });

  } catch (error) {
    console.error('Error getting subscription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
