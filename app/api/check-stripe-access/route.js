import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/next-auth"
import { connectToDatabase } from "@/libs/mongodb"

export async function GET(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { db } = await connectToDatabase()
  const user = await db.collection("users").findOne({ email: session.user.email })

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const hasAccess = user.hasAccess === true

  return new Response(JSON.stringify({ hasAccess }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
