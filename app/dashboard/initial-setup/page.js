import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import InitialSetup from "@/components/InitialSetup";

export const dynamic = "force-dynamic";

export default async function InitialSetupPage() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          Initial Setup
        </h1>
        <InitialSetup userId={user.id} />
      </section>
    </main>
  );
}
