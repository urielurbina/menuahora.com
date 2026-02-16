import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import { isAdmin } from "@/libs/admin";
import { ObjectId } from 'mongodb';

// Actualizar usuario (extender trial, dar acceso, etc)
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { db } = await connectToDatabase();

    const updateFields = {};

    // Extender trial
    if (body.extendTrial) {
      const days = parseInt(body.extendTrial);
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

      if (user) {
        const currentEnd = user.trialEndDate ? new Date(user.trialEndDate) : new Date();
        const newEnd = new Date(Math.max(currentEnd.getTime(), Date.now()) + days * 24 * 60 * 60 * 1000);

        updateFields.trialEndDate = newEnd;
        updateFields.isOnTrial = true;
      }
    }

    // Dar/quitar acceso
    if (body.hasAccess !== undefined) {
      updateFields.hasAccess = body.hasAccess;
      if (body.hasAccess) {
        updateFields.isOnTrial = false;
      }
    }

    // Reiniciar trial
    if (body.resetTrial) {
      const now = new Date();
      updateFields.trialStartDate = now;
      updateFields.trialEndDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      updateFields.isOnTrial = true;
      updateFields.hasAccess = false;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Usuario actualizado', updates: updateFields });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
