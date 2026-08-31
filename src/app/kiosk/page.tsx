import { PairForm } from "@/components/pair-form";
import { getKioskSession } from "@/services/kiosk.service";
import { redirect } from "next/navigation";

export default async function KioskPairPage() {
  const kiosk = await getKioskSession();
  if (kiosk) redirect("/kiosk/board");

  return (
    <main className="mx-auto grid min-h-screen max-w-lg content-center px-4">
      <p className="text-xs uppercase tracking-[0.28em] text-[var(--copper)]">Atelier kiosk</p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">
        Pair this floor screen
      </h1>
      <p className="mt-3 text-[var(--ink-soft)]">
        Facilities generates a one-time code. Enter it here; this device stays bound to one site.
      </p>
      <div className="mt-8">
        <PairForm />
      </div>
    </main>
  );
}
