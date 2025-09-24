import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { ObjectId } from 'mongodb';

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { products } = await req.json();
    
    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Los productos deben ser un array' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Convertir los _id de string a ObjectId para mantener consistencia
    const productsWithObjectIds = products.map(product => ({
      ...product,
      _id: new ObjectId(product._id)
    }));
    
    // Actualizar todo el array de productos con el nuevo orden
    const result = await db.collection('businesses').updateOne(
      { userId: session.user.id },
      { $set: { products: productsWithObjectIds } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Orden de productos actualizado con éxito' });
  } catch (error) {
    console.error('Error en PUT products/reorder:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
