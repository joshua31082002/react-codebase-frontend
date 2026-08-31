"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, buttonClass, fieldClass } from "@/components/ui";

export function PairForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/v1/kiosks/pair", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pairingCode: String(form.get("pairingCode") ?? "") }),
    });
    const data = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setError(data?.error?.message ?? "Could not pair.");
      return;
    }
    router.push("/kiosk/board");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-sm gap-4">
      <Field label="Pairing code">
        <input
          required
          name="pairingCode"
          className={`${fieldClass} uppercase tracking-[0.2em]`}
          placeholder="ABCD1234"
        />
      </Field>
      {error ? (
        <p role="alert" className="text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : null}
      <button className={buttonClass} disabled={pending}>
        {pending ? "Pairing…" : "Pair this screen"}
      </button>
    </form>
  );
}
