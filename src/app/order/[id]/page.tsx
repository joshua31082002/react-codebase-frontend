import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/services/order.service";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";
export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(Number(id));
  if (!order) notFound();
  return <main className="grid min-h-screen place-items-center px-5 py-12"><div className="w-full max-w-xl text-center"><div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--sage)] text-3xl text-[var(--tomato)]">✓</div><p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-[var(--tomato)]">Order confirmed</p><h1 className="mt-3 text-6xl">You chose well.</h1><p className="mx-auto mt-5 max-w-md text-[var(--muted)]">Thanks, {order.customerName.split(" ")[0]}. We’re getting your good things ready now.</p><div className="my-10 rounded-[2rem] bg-[var(--paper)] p-7 text-left"><div className="flex justify-between border-b border-[var(--line)] pb-5"><span className="text-sm text-[var(--muted)]">Order reference</span><strong>{order.reference}</strong></div>{order.items.map(({ item, product }) => <div key={item.id} className="flex justify-between py-4 text-sm"><span>{product.name} × {item.quantity}</span><strong>{formatPrice(item.unitPriceCents * item.quantity)}</strong></div>)}<div className="flex justify-between border-t border-[var(--line)] pt-5 text-lg"><span>Total</span><strong>{formatPrice(order.totalCents)}</strong></div></div><Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-[var(--tomato)] px-6 font-bold text-white">Back to Crumb & Kettle</Link></div></main>;
}
