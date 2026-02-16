import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/libs/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username || username.length < 3) {
      return NextResponse.json({ available: false, error: 'Username debe tener al menos 3 caracteres' });
    }

    // Validar formato de username (solo letras, números y guiones)
    const usernameRegex = /^[a-z0-9-]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({ available: false, error: 'Username solo puede contener letras, números y guiones' });
    }

    const { db } = await connectToDatabase();

    // Obtener sesión para excluir el negocio del usuario actual
    const session = await getServerSession(authOptions);

    const query = { username };

    // Si hay sesión, excluir el negocio del usuario actual
    if (session?.user?.id) {
      query.userId = { $ne: session.user.id };
    }

    const existing = await db.collection('businesses').findOne(query);

    return NextResponse.json({ available: !existing });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
