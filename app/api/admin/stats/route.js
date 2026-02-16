import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import { isAdmin } from "@/libs/admin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // Obtener estadísticas
    const now = new Date();

    // Total de usuarios
    const totalUsers = await db.collection('users').countDocuments();

    // Usuarios con trial activo
    const usersOnTrial = await db.collection('users').countDocuments({
      isOnTrial: true,
      trialEndDate: { $gt: now }
    });

    // Usuarios con trial expirado (sin pago)
    const usersTrialExpired = await db.collection('users').countDocuments({
      isOnTrial: true,
      trialEndDate: { $lt: now },
      hasAccess: { $ne: true }
    });

    // Usuarios pagados
    const usersPaid = await db.collection('users').countDocuments({
      hasAccess: true
    });

    // Usuarios pendientes de onboarding
    const usersPendingOnboarding = await db.collection('users').countDocuments({
      $or: [
        { onboardingCompleted: { $ne: true } },
        { onboardingCompleted: { $exists: false } }
      ]
    });

    // Total de comercios (businesses)
    const totalBusinesses = await db.collection('businesses').countDocuments();

    // Comercios con productos
    const businessesWithProducts = await db.collection('businesses').countDocuments({
      'products.0': { $exists: true }
    });

    // Total de productos
    const productsAgg = await db.collection('businesses').aggregate([
      { $project: { productCount: { $size: { $ifNull: ['$products', []] } } } },
      { $group: { _id: null, total: { $sum: '$productCount' } } }
    ]).toArray();
    const totalProducts = productsAgg[0]?.total || 0;

    // Usuarios registrados en los últimos 7 días
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newUsersLast7Days = await db.collection('users').countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Usuarios cuyo trial expira en los próximos 3 días
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const trialsExpiringIn3Days = await db.collection('users').countDocuments({
      isOnTrial: true,
      trialEndDate: { $gt: now, $lt: threeDaysFromNow },
      hasAccess: { $ne: true }
    });

    return NextResponse.json({
      totalUsers,
      usersOnTrial,
      usersTrialExpired,
      usersPaid,
      usersPendingOnboarding,
      totalBusinesses,
      businessesWithProducts,
      totalProducts,
      newUsersLast7Days,
      trialsExpiringIn3Days,
    });

  } catch (error) {
    console.error('Error getting admin stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
