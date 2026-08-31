"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, buttonClass, fieldClass, ghostButtonClass } from "@/components/ui";

async function post(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Request failed.");
  }
  return data;
}

export function SiteForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        const form = new FormData(event.currentTarget);
        try {
          await post("/api/v1/sites", {
            name: String(form.get("name") ?? ""),
            timezone: String(form.get("timezone") ?? "Europe/London"),
            address: String(form.get("address") ?? "") || undefined,
          });
          event.currentTarget.reset();
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not create site.");
        }
      }}
    >
      <Field label="Site name">
        <input required name="name" className={fieldClass} placeholder="Canary Wharf" />
      </Field>
      <Field label="Timezone">
        <input required name="timezone" className={fieldClass} defaultValue="Europe/London" />
      </Field>
      <Field label="Address">
        <input name="address" className={fieldClass} />
      </Field>
      <button className={buttonClass} type="submit">
        Add site
      </button>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
    </form>
  );
}

export function ResourceForm({ sites }: { sites: { id: string; name: string }[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        const form = new FormData(event.currentTarget);
        try {
          await post("/api/v1/resources", {
            siteId: String(form.get("siteId") ?? ""),
            kind: String(form.get("kind") ?? "room"),
            name: String(form.get("name") ?? ""),
            capacity: Number(form.get("capacity") ?? 1),
            requiresCheckin: form.get("kind") === "room",
          });
          event.currentTarget.reset();
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not create resource.");
        }
      }}
    >
      <Field label="Site">
        <select required name="siteId" className={fieldClass} defaultValue={sites[0]?.id ?? ""}>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Kind">
        <select name="kind" className={fieldClass} defaultValue="room">
          <option value="room">Room</option>
          <option value="desk">Desk</option>
          <option value="parking">Parking</option>
          <option value="locker">Locker</option>
        </select>
      </Field>
      <Field label="Name">
        <input required name="name" className={fieldClass} placeholder="Studio Cedar" />
      </Field>
      <Field label="Capacity">
        <input required type="number" min={1} name="capacity" defaultValue={4} className={fieldClass} />
      </Field>
      <button className={buttonClass} type="submit">
        Add space
      </button>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
    </form>
  );
}

export function AddonForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        const form = new FormData(event.currentTarget);
        try {
          await post("/api/v1/addons", {
            name: String(form.get("name") ?? ""),
            description: String(form.get("description") ?? "") || undefined,
            requiresApproval: form.get("requiresApproval") === "on",
          });
          event.currentTarget.reset();
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not create add-on.");
        }
      }}
    >
      <Field label="Add-on">
        <input required name="name" className={fieldClass} placeholder="Whiteboard markers" />
      </Field>
      <Field label="Description">
        <input name="description" className={fieldClass} />
      </Field>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" name="requiresApproval" />
        Needs facilities approval
      </label>
      <button className={buttonClass} type="submit">
        Add catalog item
      </button>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
    </form>
  );
}

export function InviteForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        const form = new FormData(event.currentTarget);
        try {
          await post("/api/v1/people", {
            name: String(form.get("name") ?? ""),
            email: String(form.get("email") ?? ""),
            role: String(form.get("role") ?? "employee"),
            password: String(form.get("password") ?? ""),
          });
          event.currentTarget.reset();
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not invite.");
        }
      }}
    >
      <Field label="Name">
        <input required name="name" className={fieldClass} />
      </Field>
      <Field label="Email">
        <input required type="email" name="email" className={fieldClass} />
      </Field>
      <Field label="Role">
        <select name="role" className={fieldClass} defaultValue="employee">
          <option value="employee">Employee</option>
          <option value="facilities_admin">Facilities</option>
          <option value="org_admin">Org admin</option>
        </select>
      </Field>
      <Field label="Temporary password" hint="Minimum 10 characters.">
        <input required type="password" name="password" minLength={10} className={fieldClass} />
      </Field>
      <button className={buttonClass} type="submit">
        Invite person
      </button>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
    </form>
  );
}

export function PairKioskForm({ sites }: { sites: { id: string; name: string }[] }) {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        const form = new FormData(event.currentTarget);
        try {
          const data = await post("/api/v1/kiosks", {
            siteId: String(form.get("siteId") ?? ""),
            name: String(form.get("name") ?? ""),
          });
          setCode(data.pairingCode);
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not start pairing.");
        }
      }}
    >
      <Field label="Site">
        <select required name="siteId" className={fieldClass} defaultValue={sites[0]?.id ?? ""}>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Kiosk name">
        <input required name="name" className={fieldClass} placeholder="Lobby board" />
      </Field>
      <button className={buttonClass} type="submit">
        Generate pairing code
      </button>
      {code ? (
        <p className="rounded-[var(--radius-sm)] bg-[var(--moss)] px-3 py-2 text-sm">
          Enter this code on the kiosk: <strong className="tracking-[0.2em]">{code}</strong>
        </p>
      ) : null}
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
    </form>
  );
}

export function RevokeKioskButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      className={ghostButtonClass}
      onClick={async () => {
        await fetch(`/api/v1/kiosks/${id}`, { method: "DELETE" });
        router.refresh();
      }}
    >
      Revoke
    </button>
  );
}
