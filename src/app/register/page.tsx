import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getSessionUser } from "@/lib/session";

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect("/app");

  return (
    <main className="mx-auto grid min-h-screen max-w-md content-center px-4 py-12">
      <p className="text-xs uppercase tracking-[0.28em] text-[var(--copper)]">Atelier</p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">
        Open a workplace
      </h1>
      <p className="mt-2 text-[var(--ink-soft)]">
        You become the organization admin. Invite employees after you sign in.
      </p>
      <div className="mt-8">
        <AuthForm mode="register" />
      </div>
      <p className="mt-6 text-sm text-[var(--ink-soft)]">
        Already have access?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
