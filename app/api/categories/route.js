import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    console.log('Iniciando GET request para categorías');
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('No hay sesión de usuario');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    console.log('ID de usuario:', session.user.id);

    const { db } = await connectToDatabase();
    console.log('Conexión a la base de datos establecida');

    const business = await db.collection('businesses').findOne({ userId: session.user.id });
    
    if (!business) {
      console.log('No se encontró el negocio para el usuario');
      return NextResponse.json([]);
    }

    if (!business.categories) {
      console.log('El negocio no tiene categorías');
      return NextResponse.json([]);
    }

    console.log('Categorías encontradas:', business.categories);
    return NextResponse.json(business.categories);
  } catch (error) {
    console.error('Error detallado en GET categories:', error);
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
    const category = await req.json();
    
    const result = await db.collection('businesses').updateOne(
      { userId: session.user.id },
      { $push: { categories: { ...category, _id: new ObjectId() } } },
      { upsert: true }
    );

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      return NextResponse.json({ error: 'No se pudo agregar la categoría' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Categoría agregada con éxito' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
