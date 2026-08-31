"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, buttonClass, fieldClass, ghostButtonClass } from "@/components/ui";

type Resource = {
  id: string;
  name: string;
  kind: string;
  capacity: number;
  siteName: string;
  amenities: string[];
};

type Addon = {
  id: string;
  name: string;
  requiresApproval: boolean;
};

function defaultWindow() {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 2);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const toLocal = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };
  return { start: toLocal(start), end: toLocal(end) };
}

export function BookForm({
  sites,
  addons,
}: {
  sites: { id: string; name: string }[];
  addons: Addon[];
}) {
  const router = useRouter();
  const initial = useMemo(defaultWindow, []);
  const [resources, setResources] = useState<Resource[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  async function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams({
      start: new Date(String(form.get("start"))).toISOString(),
      end: new Date(String(form.get("end"))).toISOString(),
    });
    const siteId = String(form.get("siteId") ?? "");
    const kind = String(form.get("kind") ?? "");
    if (siteId) params.set("siteId", siteId);
    if (kind) params.set("kind", kind);
    const response = await fetch(`/api/v1/availability?${params}`);
    const data = await response.json();
    if (!response.ok) {
      setError(data?.error?.message ?? "Could not search.");
      return;
    }
    setResources(data.resources ?? []);
    setSearched(true);
  }

  async function book(resourceId: string, form: HTMLFormElement) {
    setPending(true);
    setError(null);
    const data = new FormData(form);
    const addonLines = addons
      .map((addon) => ({
        addonId: addon.id,
        quantity: Number(data.get(`addon-${addon.id}`) ?? 0),
      }))
      .filter((line) => line.quantity > 0);
    const recurrenceCount = Number(data.get("count") ?? 1);
    const payload = {
      resourceId,
      title: String(data.get("title") ?? "Hold"),
      start: new Date(String(data.get("start"))).toISOString(),
      end: new Date(String(data.get("end"))).toISOString(),
      chargeCode: String(data.get("chargeCode") ?? "") || undefined,
      addonLines,
      recurrence:
        recurrenceCount > 1
          ? {
              freq: String(data.get("freq") ?? "weekly"),
              count: recurrenceCount,
            }
          : undefined,
    };
    const response = await fetch("/api/v1/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(body?.error?.message ?? "Could not book.");
      return;
    }
    setSuccess("Hold placed. Check My bookings for status.");
    router.refresh();
  }

  return (
    <form onSubmit={search} className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Site">
          <select name="siteId" className={fieldClass} defaultValue="">
            <option value="">All sites</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Type">
          <select name="kind" className={fieldClass} defaultValue="">
            <option value="">Any</option>
            <option value="room">Room</option>
            <option value="desk">Desk</option>
            <option value="parking">Parking</option>
            <option value="locker">Locker</option>
          </select>
        </Field>
        <Field label="Starts">
          <input
            required
            type="datetime-local"
            name="start"
            defaultValue={initial.start}
            className={fieldClass}
          />
        </Field>
        <Field label="Ends">
          <input
            required
            type="datetime-local"
            name="end"
            defaultValue={initial.end}
            className={fieldClass}
          />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <input
            required
            name="title"
            defaultValue="Working session"
            className={fieldClass}
          />
        </Field>
        <Field label="Charge code">
          <input name="chargeCode" className={fieldClass} placeholder="CC-1042" />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Repeat" hint="Rooms only, 13 occurrences max.">
          <select name="freq" className={fieldClass} defaultValue="weekly">
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </Field>
        <Field label="Occurrences">
          <input
            type="number"
            min={1}
            max={13}
            name="count"
            defaultValue={1}
            className={fieldClass}
          />
        </Field>
      </div>
      {addons.length > 0 ? (
        <fieldset className="grid gap-3 rounded-[var(--radius)] border border-[var(--line)] p-4">
          <legend className="px-2 text-sm font-medium text-[var(--ink-soft)]">
            Add-ons
          </legend>
          {addons.map((addon) => (
            <label key={addon.id} className="flex min-h-11 items-center justify-between gap-4">
              <span>
                {addon.name}
                {addon.requiresApproval ? (
                  <span className="ml-2 text-xs text-[var(--warn)]">needs approval</span>
                ) : null}
              </span>
              <input
                type="number"
                min={0}
                max={99}
                name={`addon-${addon.id}`}
                defaultValue={0}
                className="h-11 w-20 rounded-[var(--radius-sm)] border border-[var(--line)] px-2"
              />
            </label>
          ))}
        </fieldset>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button className={buttonClass} type="submit">
          Find open spaces
        </button>
        <button className={ghostButtonClass} type="reset">
          Reset
        </button>
      </div>
      {error ? (
        <p role="alert" className="rounded-[var(--radius-sm)] bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-[var(--radius-sm)] bg-[var(--ok-soft)] px-3 py-2 text-sm text-[var(--ok)]">
          {success}
        </p>
      ) : null}
      {searched && resources.length === 0 ? (
        <p className="text-[var(--ink-soft)]">Nothing free in that window. Try another time.</p>
      ) : null}
      <ul className="grid gap-3">
        {resources.map((resource) => (
          <li
            key={resource.id}
            className="flex flex-col gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-medium">{resource.name}</p>
              <p className="text-sm text-[var(--ink-soft)]">
                {resource.siteName} · {resource.kind} · seats {resource.capacity}
              </p>
            </div>
            <button
              type="button"
              className={buttonClass}
              disabled={pending}
              onClick={(event) => {
                const form = event.currentTarget.form;
                if (form) void book(resource.id, form);
              }}
            >
              Hold this
            </button>
          </li>
        ))}
      </ul>
    </form>
  );
}
