import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const business = await db.collection('businesses').findOne({ userId: session.user.id });

    if (!business || !business.cardInfoSettings) {
      // Si no hay configuración, devolver los valores por defecto
      return NextResponse.json({
        cardInfoSettings: {
          nombre: true,
          descripcion: true,
          precio: true,
          categoria: true,
          imagen: true,
          detailedView: true,
        }
      });
    }

    return NextResponse.json({ cardInfoSettings: business.cardInfoSettings });
  } catch (error) {
    console.error('Error al obtener la configuración de la tarjeta:', error);
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
    const cardInfoSettings = await req.json();

    const result = await db.collection('businesses').updateOne(
      { userId: session.user.id },
      { $set: { cardInfoSettings: cardInfoSettings } },
      { upsert: true }
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      return NextResponse.json({ error: 'No se pudo actualizar la configuración' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Configuración actualizada con éxito' });
  } catch (error) {
    console.error('Error al actualizar la configuración de la tarjeta:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
