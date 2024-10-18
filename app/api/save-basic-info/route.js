import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const data = await req.json();

    // Asumiendo que tienes un campo userId en tu sesión
    const userId = session.user.id;

    const result = await db.collection('businesses').updateOne(
      { userId: userId },
      { $set: data },
      { upsert: true }
    );

    if (result.acknowledged) {
      return NextResponse.json({ success: true, message: 'Información guardada exitosamente' });
    } else {
      throw new Error('Error al guardar en la base de datos');
    }
  } catch (error) {
    console.error('Error en save-basic-info:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
