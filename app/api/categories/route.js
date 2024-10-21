import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const business = await db.collection('businesses').findOne({ userId: session.user.id });
    
    if (!business || !business.categories) {
      return NextResponse.json([]);
    }

    return NextResponse.json(business.categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
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
    const { name } = await req.json();
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Nombre de categoría inválido' }, { status: 400 });
    }

    const newCategory = { _id: new ObjectId(), name: name.trim() };

    const result = await db.collection('businesses').updateOne(
      { userId: session.user.id },
      { $push: { categories: newCategory } },
      { upsert: true }
    );

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      return NextResponse.json({ error: 'No se pudo agregar la categoría' }, { status: 400 });
    }

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
