import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // Obtener el userId del usuario logueado
    const email = session.user.email;
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const userId = user._id.toString();

    // Obtener los datos de los botones
    const business = await db.collection('businesses').findOne({ userId: userId });

    if (business && business.buttons) {
      return NextResponse.json({ buttons: business.buttons });
    } else {
      return NextResponse.json({ buttons: [] });
    }
  } catch (error) {
    console.error('Error en get-buttons:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
