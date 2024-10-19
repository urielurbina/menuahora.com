import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    const email = session.user.email;
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const userId = user._id.toString();

    const business = await db.collection('businesses').findOne({ userId: userId });

    if (business && business['basic-info']) {
      return NextResponse.json({ 'basic-info': business['basic-info'] });
    } else {
      return NextResponse.json({ 'basic-info': {} });
    }
  } catch (error) {
    console.error('Error en get-basic-info:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
