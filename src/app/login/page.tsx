import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getSessionUser } from "@/lib/session";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/app");

  return (
    <main className="mx-auto grid min-h-screen max-w-md content-center px-4 py-12">
      <p className="text-xs uppercase tracking-[0.28em] text-[var(--copper)]">Atelier</p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">Sign in</h1>
      <p className="mt-2 text-[var(--ink-soft)]">
        Use your work email. Visitors do not self-serve.
      </p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
      <p className="mt-6 text-sm text-[var(--ink-soft)]">
        New workplace?{" "}
        <Link href="/register" className="underline">
          Create one
        </Link>
      </p>
    </main>
  );
}
