import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectToDatabase } from '../../lib/mongodb';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { userId, 'basic-info': basicInfo } = await req.json();

  try {
    const { db } = await connectToDatabase();
    
    // Actualizar o insertar la información del negocio
    const result = await db.collection('businesses').updateOne(
      { userId: userId },
      { $set: { 'basic-info': basicInfo } },
      { upsert: true }
    );

    return new Response(JSON.stringify({ success: true, message: 'Información guardada exitosamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al guardar la información:', error);
    return new Response(JSON.stringify({ success: false, message: 'Error al guardar la información' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
