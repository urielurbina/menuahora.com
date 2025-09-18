import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    console.log('Iniciando GET request para información básica');
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('No hay sesión de usuario');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    console.log('Usuario autenticado:', session.user.email);
    const { db } = await connectToDatabase();

    const email = session.user.email;
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      console.log('Usuario no encontrado en la base de datos');
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const userId = user._id.toString();
    console.log('ID de usuario:', userId);

    const business = await db.collection('businesses').findOne({ userId: userId });
    console.log('Negocio encontrado:', business ? 'Sí' : 'No');

    if (business && business['basic-info']) {
      console.log('Información básica encontrada:', business['basic-info']);
      return NextResponse.json({ 'basic-info': business['basic-info'] });
    } else {
      console.log('No se encontró información básica, devolviendo objeto vacío');
      return NextResponse.json({ 'basic-info': {} });
    }
  } catch (error) {
    console.error('Error detallado en get-basic-info:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
