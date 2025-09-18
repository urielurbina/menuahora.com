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

    // Obtener las categorías válidas
    const validCategories = business.categories ? business.categories.map(cat => cat.name) : [];

    // Filtrar las categorías de los productos
    const updatedProducts = business.products.map(product => ({
      ...product,
      categorias: product.categorias ? product.categorias.filter(cat => validCategories.includes(cat)) : []
    }));

    console.log('Productos encontrados:', updatedProducts);
    return NextResponse.json(updatedProducts);
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
    
    // Asegúrate de que categorias sea un array y tenga máximo 2 elementos
    if (!Array.isArray(product.categorias)) {
      product.categorias = product.categorias ? [product.categorias] : [];
    }
    product.categorias = product.categorias.slice(0, 2);

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

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const product = await req.json();
    
    if (!product._id) {
      return NextResponse.json({ error: 'ID de producto no proporcionado' }, { status: 400 });
    }

    // Asegúrate de que categorias sea un array y tenga máximo 2 elementos
    if (!Array.isArray(product.categorias)) {
      product.categorias = product.categorias ? [product.categorias] : [];
    }
    product.categorias = product.categorias.slice(0, 2);

    // Eliminar el campo _id del objeto product para evitar errores de MongoDB
    const { _id, ...updateData } = product;

    const result = await db.collection('businesses').updateOne(
      { 
        userId: session.user.id,
        "products._id": new ObjectId(product._id)
      },
      { 
        $set: { 
          "products.$": { ...updateData, _id: new ObjectId(product._id) }
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Cambiamos esta condición para verificar si se encontró el documento
    if (result.matchedCount > 0) {
      return NextResponse.json({ message: 'Producto actualizado con éxito' });
    } else {
      return NextResponse.json({ error: 'No se pudo actualizar el producto' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error en PUT products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de producto no proporcionado' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection('businesses').updateOne(
      { userId: session.user.id },
      { $pull: { products: { _id: new ObjectId(id) } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No se pudo eliminar el producto' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    console.error('Error en DELETE products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
