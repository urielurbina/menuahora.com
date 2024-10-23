import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  console.log("Session:", session);
  console.log("Params ID:", params.id);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = params;

  if (session.user.id !== id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  try {
    const { db } = await connectToDatabase();
    
    // Buscar en la tabla de businesses
    const business = await db.collection("businesses").findOne({ userId: id });

    console.log("Business found:", business);

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Devolver el username del negocio
    return NextResponse.json({ 
      username: business.username,
      id: business._id.toString(),
      userId: business.userId,
      allFields: Object.keys(business)
    });
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
