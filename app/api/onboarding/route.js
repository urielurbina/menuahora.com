import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/libs/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    const user = await db.collection('users').findOne({ email: session.user.email });
    const business = await db.collection('businesses').findOne({ userId: session.user.id });

    return NextResponse.json({
      onboardingCompleted: user?.onboardingCompleted || false,
      hasUsername: !!business?.username,
      isOnTrial: user?.isOnTrial || false,
      trialEndDate: user?.trialEndDate || null,
      currentData: {
        user: {
          personalWhatsapp: user?.personalWhatsapp || '',
          country: user?.country || 'MX',
        },
        business: {
          username: business?.username || '',
          businessName: business?.['basic-info']?.businessName || '',
          category: business?.businessCategory || '',
          orderWhatsapp: business?.['basic-info']?.contact?.whatsappNumber || '',
          logoUrl: business?.['basic-info']?.logoUrl || '',
          coverPhotoUrl: business?.['basic-info']?.coverPhotoUrl || '',
          description: business?.['basic-info']?.description || '',
          schedule: business?.['basic-info']?.schedule || {},
        }
      }
    });
  } catch (error) {
    console.error('Error getting onboarding status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const data = await req.json();
    const { step, ...stepData } = data;

    if (step === 1) {
      // Guardar datos del negocio
      const { businessName, username, category, orderWhatsapp, personalWhatsapp, country } = stepData;

      // Validaciones
      if (!businessName || !username || !category || !orderWhatsapp) {
        return NextResponse.json({ error: 'Todos los campos obligatorios deben estar llenos' }, { status: 400 });
      }

      // Validar formato de username
      const usernameRegex = /^[a-z0-9-]+$/;
      if (!usernameRegex.test(username) || username.length < 3) {
        return NextResponse.json({ error: 'Username inválido' }, { status: 400 });
      }

      // Verificar username único
      const existing = await db.collection('businesses').findOne({
        username,
        userId: { $ne: session.user.id }
      });

      if (existing) {
        return NextResponse.json({ error: 'Username no disponible' }, { status: 400 });
      }

      // Guardar en businesses
      await db.collection('businesses').updateOne(
        { userId: session.user.id },
        {
          $set: {
            username,
            businessCategory: category,
            'basic-info.businessName': businessName,
            'basic-info.contact.whatsappNumber': orderWhatsapp,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            userId: session.user.id,
            createdAt: new Date(),
          }
        },
        { upsert: true }
      );

      // Guardar en users
      await db.collection('users').updateOne(
        { email: session.user.email },
        {
          $set: {
            personalWhatsapp: personalWhatsapp || '',
            country: country || 'MX',
          }
        }
      );

      return NextResponse.json({ success: true });
    }

    if (step === 2) {
      // Guardar personalización (opcional)
      const { logoUrl, coverPhotoUrl, description, schedule } = stepData;

      const updateFields = {};
      if (logoUrl) updateFields['basic-info.logoUrl'] = logoUrl;
      if (coverPhotoUrl) updateFields['basic-info.coverPhotoUrl'] = coverPhotoUrl;
      if (description) updateFields['basic-info.description'] = description;
      if (schedule) updateFields['basic-info.schedule'] = schedule;

      if (Object.keys(updateFields).length > 0) {
        updateFields.updatedAt = new Date();
        await db.collection('businesses').updateOne(
          { userId: session.user.id },
          { $set: updateFields }
        );
      }

      return NextResponse.json({ success: true });
    }

    if (step === 3) {
      // Completar onboarding e iniciar trial
      const { referredBy } = stepData;
      const now = new Date();
      const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const updateData = {
        onboardingCompleted: true,
        trialStartDate: now,
        trialEndDate: trialEnd,
        isOnTrial: true,
      };

      // Verificar que el código de referido es válido (existe un negocio con ese username)
      if (referredBy) {
        const referrerBusiness = await db.collection('businesses').findOne({
          username: referredBy.toLowerCase()
        });

        if (referrerBusiness) {
          // Verificar que no se esté refiriendo a sí mismo
          if (referrerBusiness.userId !== session.user.id) {
            updateData.referredBy = referredBy.toLowerCase();
            console.log('User referred by:', referredBy);
          }
        }
      }

      await db.collection('users').updateOne(
        { email: session.user.email },
        { $set: updateData }
      );

      return NextResponse.json({
        success: true,
        trialEndDate: trialEnd,
        message: 'Tu prueba gratuita de 7 días ha comenzado'
      });
    }

    return NextResponse.json({ error: 'Paso inválido' }, { status: 400 });

  } catch (error) {
    console.error('Error in onboarding:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
