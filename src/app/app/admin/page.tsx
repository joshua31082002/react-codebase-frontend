import { redirect } from "next/navigation";
import { isFacilities, requireUser } from "@/lib/session";
import { listAddons, listAudit, listPeople, listResources, listSites } from "@/services/catalog.service";
import { listKiosks } from "@/services/kiosk.service";
import { StatusPill } from "@/components/ui";

export default async function AdminPage() {
  const user = await requireUser();
  if (!isFacilities(user.role)) redirect("/app");
  const [sites, catalog, addons, people, kiosks, events] = await Promise.all([
    listSites(user.orgId),
    listResources(user.orgId),
    listAddons(user.orgId),
    listPeople(user.orgId),
    listKiosks(user.orgId),
    listAudit(user.orgId),
  ]);

  return (
    <div className="grid gap-10">
      <div>
        <p className="text-sm text-[var(--ink-soft)]">Catalog, people, kiosks, and the audit trail.</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Admin</h1>
      </div>

      <section className="grid gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Sites</h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {sites.map((site) => (
            <li
              key={site.id}
              className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] p-4"
            >
              <p className="font-medium">{site.name}</p>
              <p className="text-sm text-[var(--ink-soft)]">
                {site.timezone}
                {site.address ? ` · ${site.address}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Spaces</h2>
        <ul className="grid gap-2">
          {catalog.map(({ resource, site }) => (
            <li
              key={resource.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] px-4 py-3"
            >
              <span>
                {resource.name} · {site.name}
              </span>
              <span className="text-sm capitalize text-[var(--ink-soft)]">
                {resource.kind} · {resource.capacity}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Add-ons</h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {addons.map((addon) => (
            <li
              key={addon.id}
              className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] p-4"
            >
              <p className="font-medium">{addon.name}</p>
              <p className="text-sm text-[var(--ink-soft)]">{addon.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">People</h2>
        <ul className="grid gap-2">
          {people.map((person) => (
            <li
              key={person.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] px-4 py-3"
            >
              <span>
                {person.name} · {person.email}
              </span>
              <span className="text-sm capitalize text-[var(--ink-soft)]">
                {person.role.replaceAll("_", " ")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Kiosks</h2>
        <ul className="grid gap-2">
          {kiosks.length === 0 ? (
            <li className="text-sm text-[var(--ink-soft)]">
              No paired devices yet. Start pairing from the API, then open /kiosk.
            </li>
          ) : (
            kiosks.map(({ device, site }) => (
              <li
                key={device.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] px-4 py-3"
              >
                <span>
                  {device.name} · {site.name}
                </span>
                <StatusPill status={device.revokedAt ? "cancelled" : "confirmed"} />
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="grid gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Audit</h2>
        <ul className="grid gap-2">
          {events.slice(0, 20).map((event) => (
            <li
              key={event.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] py-2 text-sm"
            >
              <span>{event.action}</span>
              <span className="text-[var(--ink-soft)]">
                {event.createdAt.toISOString().slice(0, 16).replace("T", " ")}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
