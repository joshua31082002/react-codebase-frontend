"use client";

import { useRouter } from "next/navigation";
import { buttonClass } from "@/components/ui";
import { useState } from "react";

export function KioskCheckIn({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div>
      <button
        className={buttonClass}
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError(null);
          const response = await fetch("/api/v1/kiosk/board", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ bookingId }),
          });
          const data = await response.json().catch(() => ({}));
          setPending(false);
          if (!response.ok) {
            setError(data?.error?.message ?? "Could not check in.");
            return;
          }
          router.refresh();
        }}
      >
        {pending ? "Checking in…" : "Check in"}
      </button>
      {error ? <p className="mt-2 text-sm text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}
