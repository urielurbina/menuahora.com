import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    console.log('Iniciando GET request para productos');
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('No hay sesión de usuario');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    console.log('ID de usuario:', session.user.id);

    const { db } = await connectToDatabase();
    const business = await db.collection('businesses').findOne({ userId: session.user.id });
    
    if (!business) {
      console.log('No se encontró el negocio para el usuario');
      return NextResponse.json([]);
    }

    if (!business.products) {
      console.log('El negocio no tiene productos');
      return NextResponse.json([]);
    }

    console.log('Productos encontrados:', business.products);
    return NextResponse.json(business.products);
  } catch (error) {
    console.error('Error detallado en GET products:', error);
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
    const product = await req.json();
    
    const result = await db.collection('businesses').updateOne(
      { userId: session.user.id },
      { $push: { products: { ...product, _id: new ObjectId() } } },
      { upsert: true }
    );

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      return NextResponse.json({ error: 'No se pudo agregar el producto' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Producto agregado con éxito' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
