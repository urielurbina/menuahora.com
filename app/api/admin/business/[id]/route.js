import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import { isAdmin } from "@/libs/admin";
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    const { db } = await connectToDatabase();

    // Buscar el negocio
    let business;
    try {
      business = await db.collection('businesses').findOne({ _id: new ObjectId(id) });
    } catch {
      // Si falla, intentar buscar por username
      business = await db.collection('businesses').findOne({ username: id });
    }

    if (!business) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
    }

    // Buscar el usuario asociado
    const user = await db.collection('users').findOne({ _id: business.userId }) ||
                 await db.collection('users').findOne({ email: business.userId });

    // Calcular estado
    const now = new Date();
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
      }
    }

    return NextResponse.json({
      business: {
        _id: business._id,
        userId: business.userId,
        username: business.username,
        businessName: business['basic-info']?.businessName || '',
        businessCategory: business.businessCategory || '',
        description: business['basic-info']?.description || '',
        whatsappNumber: business['basic-info']?.contact?.whatsappNumber || '',
        logoUrl: business['basic-info']?.logoUrl || '',
        coverPhotoUrl: business['basic-info']?.coverPhotoUrl || '',
        schedule: business['basic-info']?.schedule || {},
        appearance: business.appearance || {},
        buttons: business.buttons || {},
        categories: business.categories || [],
        products: business.products || [],
        deliverySettings: business.deliverySettings || {},
        createdAt: business.createdAt,
        updatedAt: business.updatedAt,
      },
      user: user ? {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        personalWhatsapp: user.personalWhatsapp || '',
        country: user.country || '',
        createdAt: user.createdAt,
        trialStartDate: user.trialStartDate,
        trialEndDate: user.trialEndDate,
        hasAccess: user.hasAccess,
        isOnTrial: user.isOnTrial,
        onboardingCompleted: user.onboardingCompleted,
        customerId: user.customerId,
        priceId: user.priceId,
      } : null,
      status,
      daysLeft,
    });

  } catch (error) {
    console.error('Error getting business:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Actualizar datos del negocio (como admin)
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { db } = await connectToDatabase();

    // Construir objeto de actualización
    const updateFields = {};

    if (body.businessName !== undefined) {
      updateFields['basic-info.businessName'] = body.businessName;
    }
    if (body.description !== undefined) {
      updateFields['basic-info.description'] = body.description;
    }
    if (body.whatsappNumber !== undefined) {
      updateFields['basic-info.contact.whatsappNumber'] = body.whatsappNumber;
    }
    if (body.businessCategory !== undefined) {
      updateFields.businessCategory = body.businessCategory;
    }

    updateFields.updatedAt = new Date();

    const result = await db.collection('businesses').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Negocio actualizado' });

  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Eliminar un producto específico
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'ID de producto requerido' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('businesses').updateOne(
      { _id: new ObjectId(id) },
      { $pull: { products: { _id: new ObjectId(productId) } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Producto eliminado' });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
