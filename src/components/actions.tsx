"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonClass, ghostButtonClass } from "@/components/ui";

async function post(url: string, body?: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Request failed.");
  }
}

export function BookingActions({
  id,
  canCancel,
  canCheckIn,
  canDecide,
}: {
  id: string;
  canCancel?: boolean;
  canCheckIn?: boolean;
  canDecide?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function run(task: () => Promise<void>) {
    setPending(true);
    setError(null);
    try {
      await task();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canCheckIn ? (
        <button
          className={buttonClass}
          disabled={pending}
          onClick={() => run(() => post(`/api/v1/bookings/${id}/check-in`))}
        >
          Check in
        </button>
      ) : null}
      {canCancel ? (
        <button
          className={ghostButtonClass}
          disabled={pending}
          onClick={() =>
            run(async () => {
              const response = await fetch(`/api/v1/bookings/${id}`, { method: "DELETE" });
              const data = await response.json().catch(() => ({}));
              if (!response.ok) throw new Error(data?.error?.message ?? "Could not cancel.");
            })
          }
        >
          Cancel
        </button>
      ) : null}
      {canDecide ? (
        <>
          <button
            className={buttonClass}
            disabled={pending}
            onClick={() =>
              run(() => post(`/api/v1/approvals/${id}`, { decision: "approved" }))
            }
          >
            Approve
          </button>
          <button
            className={ghostButtonClass}
            disabled={pending}
            onClick={() =>
              run(() =>
                post(`/api/v1/approvals/${id}`, {
                  decision: "declined",
                  reason: "Does not meet policy.",
                }),
              )
            }
          >
            Decline
          </button>
        </>
      ) : null}
      {error ? <span className="text-sm text-[var(--danger)]">{error}</span> : null}
    </div>
  );
}

export function FulfillmentActions({ id, fulfillment }: { id: string; fulfillment: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function setNext(next: "confirmed" | "delivered") {
    setError(null);
    try {
      await post(`/api/v1/addons/lines/${id}/fulfillment`, { fulfillment: next });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed.");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {fulfillment === "requested" ? (
        <button className={buttonClass} onClick={() => setNext("confirmed")}>
          Confirm
        </button>
      ) : null}
      {fulfillment === "confirmed" ? (
        <button className={buttonClass} onClick={() => setNext("delivered")}>
          Mark delivered
        </button>
      ) : null}
      {error ? <span className="text-sm text-[var(--danger)]">{error}</span> : null}
    </div>
  );
}

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      className={ghostButtonClass}
      onClick={async () => {
        await fetch("/api/v1/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
