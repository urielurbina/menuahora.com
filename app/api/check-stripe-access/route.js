import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ hasAccess: false, reason: 'not_authenticated' });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ hasAccess: false, reason: 'no_user' });
    }

    // 1. Verificar si completó onboarding
    if (!user.onboardingCompleted) {
      return NextResponse.json({
        hasAccess: false,
        reason: 'onboarding_incomplete',
        needsOnboarding: true
      });
    }

    // 2. Si tiene suscripción pagada activa
    if (user.hasAccess === true) {
      return NextResponse.json({
        hasAccess: true,
        type: 'paid'
      });
    }

    // 3. Si está en trial
    if (user.isOnTrial && user.trialEndDate) {
      const now = new Date();
      const trialEnd = new Date(user.trialEndDate);

      if (now < trialEnd) {
        const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
        return NextResponse.json({
          hasAccess: true,
          type: 'trial',
          daysLeft,
          trialEndDate: user.trialEndDate
        });
      } else {
        // Trial expirado
        return NextResponse.json({
          hasAccess: false,
          type: 'trial_expired',
          trialEndDate: user.trialEndDate
        });
      }
    }

    // 4. Sin trial ni pago (no debería pasar si completó onboarding)
    return NextResponse.json({
      hasAccess: false,
      type: 'no_subscription'
    });

  } catch (error) {
    console.error('Error checking access:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
