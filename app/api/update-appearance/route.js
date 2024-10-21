import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const data = await req.json();

    // Obtener el userId del usuario logueado
    const email = session.user.email;
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const userId = user._id.toString();

    // Actualizar o insertar los datos de apariencia
    const result = await db.collection('businesses').updateOne(
      { userId: userId },
      { 
        $set: { 
          appearance: data.appearance,
          userId: userId // Asegurarse de que el userId esté guardado
        } 
      },
      { upsert: true }
    );

    if (result.acknowledged) {
      return NextResponse.json({ success: true, message: 'Apariencia guardada exitosamente' });
    } else {
      throw new Error('Error al guardar en la base de datos');
    }
  } catch (error) {
    console.error('Error en update-appearance:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
