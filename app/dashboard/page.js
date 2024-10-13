import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import ButtonAccount from "@/components/ButtonAccount";
import InitialSetup from "@/components/InitialSetup";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server component which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  if (!user.username) {
    return <InitialSetup userId={user.id} />;
  }

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <ButtonAccount />
        <h1 className="text-3xl md:text-4xl font-extrabold">
          User Dashboard
        </h1>
        <p>Welcome {user.name} 👋</p>
        <p>Your email is {user.email}</p>
      </section>
    </main>
  );
}
