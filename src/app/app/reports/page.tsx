import { redirect } from "next/navigation";
import { isFacilities, requireUser } from "@/lib/session";
import { utilizationReport } from "@/services/report.service";
import { EmptyState } from "@/components/ui";

export default async function ReportsPage() {
  const user = await requireUser();
  if (!isFacilities(user.role)) redirect("/app");

  const to = new Date();
  const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
  const rows = await utilizationReport(user.orgId, from, to);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Utilization</h1>
        <p className="text-[var(--ink-soft)]">
          Confirmed minutes over the last seven days, by resource.
        </p>
      </div>
      {rows.length === 0 ? (
        <EmptyState title="No catalog yet" body="Add sites and resources to see occupancy." />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[var(--line)] text-[var(--ink-soft)]">
              <tr>
                <th className="px-4 py-3 font-medium">Resource</th>
                <th className="px-4 py-3 font-medium">Site</th>
                <th className="px-4 py-3 font-medium">Kind</th>
                <th className="px-4 py-3 font-medium">Bookings</th>
                <th className="px-4 py-3 font-medium">Minutes</th>
                <th className="px-4 py-3 font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.resourceId} className="border-b border-[var(--line)] last:border-0">
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3 text-[var(--ink-soft)]">{row.siteName}</td>
                  <td className="px-4 py-3 capitalize">{row.kind}</td>
                  <td className="px-4 py-3">{row.bookingCount}</td>
                  <td className="px-4 py-3">{row.bookedMinutes}</td>
                  <td className="px-4 py-3">{row.utilizationPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
