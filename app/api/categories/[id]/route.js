import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { ObjectId } from 'mongodb';

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'El nombre de la categoría es requerido' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const categoryId = params.id;

    // Obtener el negocio y la categoría antes de actualizarla
    const business = await db.collection('businesses').findOne({ userId: session.user.id });
    const categoryToUpdate = business.categories.find(cat => cat._id.toString() === categoryId);

    if (!categoryToUpdate) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    const oldName = categoryToUpdate.name;
    const newName = name.trim();

    // Verificar si ya existe una categoría con el nuevo nombre
    const existingCategory = business.categories.find(cat => 
      cat.name.toLowerCase() === newName.toLowerCase() && cat._id.toString() !== categoryId
    );

    if (existingCategory) {
      return NextResponse.json({ error: 'Ya existe una categoría con ese nombre' }, { status: 400 });
    }

    // Actualizar la categoría
    const result = await db.collection('businesses').updateOne(
      { userId: session.user.id, "categories._id": new ObjectId(categoryId) },
      { $set: { "categories.$.name": newName } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No se pudo actualizar la categoría' }, { status: 400 });
    }

    // Actualizar los productos que usan esta categoría
    await db.collection('businesses').updateOne(
      { userId: session.user.id },
      { 
        $set: { 
          "products.$[].categorias.$[elem]": newName 
        } 
      },
      { 
        arrayFilters: [{ "elem": oldName }] 
      }
    );

    return NextResponse.json({ message: 'Categoría actualizada con éxito', category: { _id: categoryId, name: newName } });
  } catch (error) {
    console.error('Error en PUT categories:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
