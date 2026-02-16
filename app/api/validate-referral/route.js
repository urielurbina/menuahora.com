import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/libs/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code || code.length < 3) {
      return NextResponse.json({ valid: false });
    }

    const session = await getServerSession(authOptions);
    const { db } = await connectToDatabase();

    // Buscar el negocio con ese username
    const business = await db.collection('businesses').findOne({
      username: code.toLowerCase()
    });

    if (!business) {
      return NextResponse.json({ valid: false });
    }

    // Verificar que no se esté refiriendo a sí mismo
    if (session && business.userId === session.user.id) {
      return NextResponse.json({ valid: false, reason: 'self_referral' });
    }

    // Buscar el usuario dueño del negocio referidor
    const referrerUser = await db.collection('users').findOne({
      _id: business.userId
    });

    // Verificar que el referidor tenga suscripción activa
    if (!referrerUser || referrerUser.hasAccess !== true) {
      return NextResponse.json({ valid: false, reason: 'referrer_no_subscription' });
    }

    return NextResponse.json({
      valid: true,
      referrer: {
        businessName: business['basic-info']?.businessName || 'Un negocio',
        username: business.username,
      }
    });

  } catch (error) {
    console.error('Error validating referral:', error);
    return NextResponse.json({ valid: false, error: error.message });
  }
}
