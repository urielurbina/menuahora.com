import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

const DEFAULT_DELIVERY_SETTINGS = {
  locationType: "single",
  mainLocation: {
    address: "",
    reference: "",
    coordinates: null,
    schedule: null
  },
  branches: [],
  methods: {
    pickup: { enabled: true },
    meetingPoint: { enabled: false, points: [] },
    delivery: {
      enabled: false,
      costType: "pending",
      fixedCost: 0,
      zones: [],
      freeAbove: null,
      minimumOrder: null
    },
    shipping: {
      enabled: false,
      costType: "pending",
      fixedCost: 0
    }
  }
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const business = await db.collection('businesses').findOne({ userId: session.user.id });

    if (!business || !business.deliverySettings) {
      return NextResponse.json({
        deliverySettings: DEFAULT_DELIVERY_SETTINGS
      });
    }

    return NextResponse.json({ deliverySettings: business.deliverySettings });
  } catch (error) {
    console.error('Error al obtener la configuracion de entregas:', error);
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
    const deliverySettings = await req.json();

    const result = await db.collection('businesses').updateOne(
      { userId: session.user.id },
      { $set: { deliverySettings: deliverySettings } },
      { upsert: true }
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      return NextResponse.json({ error: 'No se pudo actualizar la configuracion' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Configuracion de entregas actualizada con exito' });
  } catch (error) {
    console.error('Error al actualizar la configuracion de entregas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
