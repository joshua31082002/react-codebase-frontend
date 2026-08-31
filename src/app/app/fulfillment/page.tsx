import { redirect } from "next/navigation";
import { isFacilities, requireUser } from "@/lib/session";
import { listFulfillment } from "@/services/booking.service";
import { EmptyState, StatusPill } from "@/components/ui";
import { FulfillmentActions } from "@/components/actions";
import { formatInTimeZone } from "@/lib/datetime";

export default async function FulfillmentPage() {
  const user = await requireUser();
  if (!isFacilities(user.role)) redirect("/app");
  const rows = await listFulfillment(user.orgId);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Fulfillment</h1>
        <p className="text-[var(--ink-soft)]">
          Confirm catering and AV, then mark them delivered on the floor.
        </p>
      </div>
      {rows.length === 0 ? (
        <EmptyState title="Nothing to fulfill" body="Add-on lines appear here once someone books them." />
      ) : (
        <ul className="grid gap-3">
          {rows.map(({ line, addon, booking, resource }) => (
            <li
              key={line.id}
              className="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] p-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium">
                  {addon.name} × {line.quantity}
                </p>
                <p className="text-sm text-[var(--ink-soft)]">
                  {booking.title} · {resource.name}
                </p>
                {line.chargeCode ? (
                  <p className="text-sm text-[var(--ink-soft)]">Charge {line.chargeCode}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={line.fulfillment} />
                <FulfillmentActions id={line.id} fulfillment={line.fulfillment} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
