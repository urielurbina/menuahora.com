import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username no proporcionado' }, { status: 400 });
    }

    const result = await db.collection('businesses').updateOne(
      { userId: session.user.id },
      { $set: { username: username } },
      { upsert: true }
    );

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      return NextResponse.json({ error: 'No se pudo guardar el username' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Username guardado con éxito' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const business = await db.collection('businesses').findOne({ userId: session.user.id });

    if (!business || !business.username) {
      return NextResponse.json({ hasUsername: false });
    }

    return NextResponse.json({ hasUsername: true, username: business.username });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
