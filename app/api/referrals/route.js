import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";

const REFERRAL_REWARD = 35; // $35 por referido activo

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

    // Obtener business para el código de referido (username)
    const business = await db.collection('businesses').findOne({ userId: session.user.id });
    const referralCode = business?.username?.toUpperCase() || null;

    // Contar referidos activos (usuarios que fueron referidos por este usuario y tienen hasAccess)
    const activeReferrals = await db.collection('users').countDocuments({
      referredBy: business?.username,
      hasAccess: true,
    });

    // Contar referidos en trial
    const trialReferrals = await db.collection('users').countDocuments({
      referredBy: business?.username,
      isOnTrial: true,
      hasAccess: { $ne: true },
    });

    // Contar total de referidos (incluye expirados)
    const totalReferrals = await db.collection('users').countDocuments({
      referredBy: business?.username,
    });

    // Obtener lista de referidos con más detalles
    const referralsList = await db.collection('users').aggregate([
      { $match: { referredBy: business?.username } },
      {
        $lookup: {
          from: 'businesses',
          localField: '_id',
          foreignField: 'userId',
          as: 'business'
        }
      },
      { $unwind: { path: '$business', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: 1,
          image: 1,
          hasAccess: 1,
          isOnTrial: 1,
          createdAt: 1,
          businessName: '$business.basic-info.businessName',
          username: '$business.username',
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 50 }
    ]).toArray();

    // Calcular ganancias
    const monthlyEarnings = activeReferrals * REFERRAL_REWARD;
    const totalEarnings = user.referralEarnings || 0;
    const pendingPayout = totalEarnings - (user.referralPaidOut || 0);

    // Calcular nivel basado en referidos activos
    let level = 1;
    let levelName = 'Novato';
    let nextLevelAt = 3;

    if (activeReferrals >= 20) {
      level = 5;
      levelName = 'Leyenda';
      nextLevelAt = null;
    } else if (activeReferrals >= 10) {
      level = 4;
      levelName = 'Experto';
      nextLevelAt = 20;
    } else if (activeReferrals >= 6) {
      level = 3;
      levelName = 'Pro';
      nextLevelAt = 10;
    } else if (activeReferrals >= 3) {
      level = 2;
      levelName = 'Activo';
      nextLevelAt = 6;
    }

    return NextResponse.json({
      referralCode,
      referralLink: referralCode ? `https://menuahora.com/?ref=${referralCode.toLowerCase()}` : null,
      // Estado de suscripción del usuario actual
      subscription: {
        hasAccess: user.hasAccess || false,
        isOnTrial: user.isOnTrial || false,
        trialEndDate: user.trialEndDate || null,
      },
      stats: {
        activeReferrals,
        trialReferrals,
        totalReferrals,
        monthlyEarnings,
        totalEarnings,
        pendingPayout,
        rewardPerReferral: REFERRAL_REWARD,
      },
      level: {
        current: level,
        name: levelName,
        nextLevelAt,
        progress: nextLevelAt ? (activeReferrals / nextLevelAt) * 100 : 100,
      },
      stripeConnect: {
        connected: !!user.stripeConnectId,
        onboarded: user.stripeConnectOnboarded || false,
      },
      referrals: referralsList,
    });

  } catch (error) {
    console.error('Error getting referrals:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
