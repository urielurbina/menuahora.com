import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { ObjectId } from 'mongodb';

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'ID de categoría no proporcionado' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection('businesses').updateOne(
      { userId: session.user.id },
      { $pull: { categories: { _id: new ObjectId(id) } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No se pudo eliminar la categoría' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Categoría eliminada con éxito' });
  } catch (error) {
    console.error('Error en DELETE category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
