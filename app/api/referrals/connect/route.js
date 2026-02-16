import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Crear o recuperar cuenta de Stripe Connect
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    let stripeConnectId = user.stripeConnectId;

    // Crear cuenta Connect si no existe
    if (!stripeConnectId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: user.country === 'MX' ? 'MX' : 'US', // Ajustar según país
        email: session.user.email,
        capabilities: {
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          userId: session.user.id,
          email: session.user.email,
        },
      });

      stripeConnectId = account.id;

      // Guardar en la base de datos
      await db.collection('users').updateOne(
        { email: session.user.email },
        { $set: { stripeConnectId: stripeConnectId } }
      );
    }

    // Crear link de onboarding
    const accountLink = await stripe.accountLinks.create({
      account: stripeConnectId,
      refresh_url: `${process.env.NEXTAUTH_URL}/dashboard/referidos?refresh=true`,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard/referidos?success=true`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });

  } catch (error) {
    console.error('Error creating Stripe Connect:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Verificar estado de la cuenta Connect
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email: session.user.email });

    if (!user?.stripeConnectId) {
      return NextResponse.json({ connected: false, onboarded: false });
    }

    // Verificar estado en Stripe
    const account = await stripe.accounts.retrieve(user.stripeConnectId);

    const isOnboarded = account.details_submitted && account.payouts_enabled;

    // Actualizar estado en DB si cambió
    if (isOnboarded !== user.stripeConnectOnboarded) {
      await db.collection('users').updateOne(
        { email: session.user.email },
        { $set: { stripeConnectOnboarded: isOnboarded } }
      );
    }

    return NextResponse.json({
      connected: true,
      onboarded: isOnboarded,
      payoutsEnabled: account.payouts_enabled,
      chargesEnabled: account.charges_enabled,
    });

  } catch (error) {
    console.error('Error checking Stripe Connect:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
