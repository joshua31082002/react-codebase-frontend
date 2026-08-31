import { requireUser } from "@/lib/session";
import { listAddons, listSites } from "@/services/catalog.service";
import { BookForm } from "@/components/book-form";

export default async function BookPage() {
  const user = await requireUser();
  const [sites, addons] = await Promise.all([
    listSites(user.orgId),
    listAddons(user.orgId),
  ]);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm text-[var(--ink-soft)]">Find a hold that survives the calendar.</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Book a space</h1>
      </div>
      <BookForm
        sites={sites.map((site) => ({ id: site.id, name: site.name }))}
        addons={addons.map((addon) => ({
          id: addon.id,
          name: addon.name,
          requiresApproval: addon.requiresApproval,
        }))}
      />
    </div>
  );
}
