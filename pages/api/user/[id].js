import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { id } = req.query;

  if (session.user.id !== id) {
    return res.status(403).json({ error: "Not authorized" });
  }

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
