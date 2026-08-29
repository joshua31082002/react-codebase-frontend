"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const [productId, setProductId] = useState(1);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("items")?.split(":")[0];
    if (value) setProductId(Number(value));
  }, []);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerName: data.get("customerName"), email: data.get("email"), address: data.get("address"), city: data.get("city"), postalCode: data.get("postalCode"), items: [{ productId, quantity: 1 }] }) });
    const result = await response.json();
    if (!response.ok) { setStatus("error"); setMessage(result.error); return; }
    router.push(`/order/${result.orderId}`);
  }
  return <main className="min-h-screen px-5 py-6 md:px-8"><header className="mx-auto flex max-w-5xl justify-between"><Link href="/" className="font-display text-xl font-bold">crumb <span className="text-[var(--tomato)]">&</span> kettle</Link><Link href="/" className="text-sm font-bold">← Keep shopping</Link></header><div className="mx-auto grid max-w-5xl gap-12 py-14 md:grid-cols-[1fr_330px] md:py-24"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--tomato)]">Almost there</p><h1 className="mt-3 text-6xl">Your details.</h1><p className="mt-4 text-[var(--muted)]">A simple, secure checkout. Your card details are never stored.</p><form onSubmit={submit} className="mt-10 grid gap-5"><label>Full name<input name="customerName" required minLength={2} placeholder="Alex Morgan" /></label><label>Email address<input name="email" type="email" required placeholder="alex@example.com" /></label><label>Delivery address<input name="address" required placeholder="14 Orchard Lane" /></label><div className="grid gap-5 sm:grid-cols-2"><label>City<input name="city" required placeholder="Brooklyn" /></label><label>Postal code<input name="postalCode" required placeholder="11211" /></label></div><fieldset><legend>Payment</legend><div className="payment-note">Sandbox checkout · no charge will be made</div><label>Card number<input inputMode="numeric" required minLength={12} placeholder="4242 4242 4242 4242" /></label></fieldset>{status === "error" && <p role="alert" className="rounded-2xl bg-[#fbe3dc] p-4 text-sm font-bold text-[var(--tomato-dark)]">{message}</p>}<button disabled={status === "loading"} className="min-h-14 rounded-full bg-[var(--tomato)] px-6 font-bold text-white transition hover:bg-[var(--tomato-dark)] disabled:cursor-wait disabled:opacity-60">{status === "loading" ? "Placing your order…" : "Place order →"}</button></form></div><aside className="h-fit rounded-[2rem] bg-[var(--sage)] p-7"><p className="text-xs font-bold uppercase tracking-[.18em]">Order summary</p><div className="my-7 flex justify-between"><span>Good things</span><strong>$8.50</strong></div><div className="flex justify-between border-t border-[var(--ink)]/15 pt-5 text-lg"><span>Total</span><strong>$8.50</strong></div></aside></div></main>;
}
