"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, buttonClass, fieldClass } from "@/components/ui";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const payload =
      mode === "register"
        ? {
            orgName: String(form.get("orgName") ?? ""),
            adminName: String(form.get("adminName") ?? ""),
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? ""),
          }
        : {
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? ""),
          };

    const response = await fetch(
      mode === "register" ? "/api/v1/auth/register" : "/api/v1/auth/login",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setError(data?.error?.message ?? "Could not continue.");
      return;
    }
    router.push("/app");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {mode === "register" ? (
        <>
          <Field label="Workplace name">
            <input
              required
              name="orgName"
              className={fieldClass}
              placeholder="Northline Partners"
            />
          </Field>
          <Field label="Your name">
            <input
              required
              name="adminName"
              className={fieldClass}
              placeholder="Maya Chen"
            />
          </Field>
        </>
      ) : null}
      <Field label="Work email">
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className={fieldClass}
          placeholder="you@company.com"
        />
      </Field>
      <Field
        label="Password"
        hint={mode === "register" ? "At least 10 characters." : undefined}
      >
        <input
          required
          type="password"
          name="password"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          minLength={mode === "register" ? 10 : 1}
          className={fieldClass}
        />
      </Field>
      {error ? (
        <p role="alert" className="rounded-[var(--radius-sm)] bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : null}
      <button className={buttonClass} disabled={pending}>
        {pending ? "Working…" : mode === "register" ? "Create workplace" : "Sign in"}
      </button>
    </form>
  );
}
