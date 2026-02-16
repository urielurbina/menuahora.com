import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import { isAdmin } from "@/libs/admin";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all'; // all, trial, trial_expired, paid, pending
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();
    const now = new Date();

    // Construir query para usuarios
    let userQuery = {};

    switch (filter) {
      case 'trial':
        userQuery = {
          isOnTrial: true,
          trialEndDate: { $gt: now }
        };
        break;
      case 'trial_expired':
        userQuery = {
          isOnTrial: true,
          trialEndDate: { $lt: now },
          hasAccess: { $ne: true }
        };
        break;
      case 'paid':
        userQuery = {
          hasAccess: true
        };
        break;
      case 'pending':
        userQuery = {
          $or: [
            { onboardingCompleted: { $ne: true } },
            { onboardingCompleted: { $exists: false } }
          ]
        };
        break;
      default:
        userQuery = {};
    }

    // Obtener todos los usuarios que coinciden con el filtro
    const users = await db.collection('users')
      .find(userQuery)
      .sort({ createdAt: -1 })
      .toArray();

    // Crear un map de userId -> user
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    // Obtener businesses para estos usuarios
    let businessQuery = {};

    if (filter !== 'all') {
      const userIds = users.map(u => u._id.toString());
      businessQuery.userId = { $in: userIds };
    }

    // Agregar búsqueda si existe
    if (search) {
      businessQuery.$or = [
        { username: { $regex: search, $options: 'i' } },
        { 'basic-info.businessName': { $regex: search, $options: 'i' } }
      ];
    }

    const totalCount = await db.collection('businesses').countDocuments(businessQuery);

    const businesses = await db.collection('businesses')
      .find(businessQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Combinar datos de business con user
    const result = await Promise.all(businesses.map(async (business) => {
      let user = userMap[business.userId];

      // Si no está en el map (por el filtro), buscarlo directamente
      if (!user) {
        user = await db.collection('users').findOne({ _id: business.userId }) ||
               await db.collection('users').findOne({ email: business.userId });
      }

      // Calcular estado
      let status = 'pending';
      let daysLeft = null;

      if (user) {
        if (user.hasAccess) {
          status = 'paid';
        } else if (user.isOnTrial && user.trialEndDate) {
          const trialEnd = new Date(user.trialEndDate);
          if (now < trialEnd) {
            status = 'trial';
            daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
          } else {
            status = 'trial_expired';
          }
        } else if (!user.onboardingCompleted) {
          status = 'pending';
        }
      }

      return {
        _id: business._id,
        userId: business.userId,
        username: business.username,
        businessName: business['basic-info']?.businessName || '',
        businessCategory: business.businessCategory || '',
        whatsappNumber: business['basic-info']?.contact?.whatsappNumber || '',
        logoUrl: business['basic-info']?.logoUrl || '',
        productsCount: business.products?.length || 0,
        categoriesCount: business.categories?.length || 0,
        createdAt: business.createdAt,
        user: user ? {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          personalWhatsapp: user.personalWhatsapp || '',
          country: user.country || '',
          createdAt: user.createdAt,
          trialEndDate: user.trialEndDate,
          hasAccess: user.hasAccess,
          isOnTrial: user.isOnTrial,
          onboardingCompleted: user.onboardingCompleted,
        } : null,
        status,
        daysLeft,
      };
    }));

    // Si el filtro no es 'all' y hay búsqueda, necesitamos filtrar de nuevo
    let filteredResult = result;
    if (filter !== 'all' && !businessQuery.userId) {
      filteredResult = result.filter(item => {
        if (!item.user) return false;
        switch (filter) {
          case 'trial':
            return item.status === 'trial';
          case 'trial_expired':
            return item.status === 'trial_expired';
          case 'paid':
            return item.status === 'paid';
          case 'pending':
            return item.status === 'pending';
          default:
            return true;
        }
      });
    }

    return NextResponse.json({
      businesses: filteredResult,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error getting businesses:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
