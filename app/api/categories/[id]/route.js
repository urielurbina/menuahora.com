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

    const { db } = await connectToDatabase();
    const categoryId = params.id;

    // Obtener el negocio y la categoría antes de eliminarla
    const business = await db.collection('businesses').findOne({ userId: session.user.id });
    const categoryToDelete = business.categories.find(cat => cat._id.toString() === categoryId);

    if (!categoryToDelete) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    // Eliminar la categoría
    const result = await db.collection('businesses').updateOne(
      { userId: session.user.id },
      { $pull: { categories: { _id: new ObjectId(categoryId) } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No se pudo eliminar la categoría' }, { status: 400 });
    }

    // Actualizar los productos que usan esta categoría
    await db.collection('businesses').updateOne(
      { userId: session.user.id },
      { $pull: { "products.$[].categorias": categoryToDelete.name } }
    );

    return NextResponse.json({ message: 'Categoría eliminada con éxito y productos actualizados' });
  } catch (error) {
    console.error('Error en DELETE categories:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
