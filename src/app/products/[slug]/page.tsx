import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/product.service";
import { formatPrice } from "@/lib/format";
import AddToCart from "@/components/AddToCart";

export const dynamic = "force-dynamic";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return <main className="min-h-screen px-5 py-6 md:px-8"><header className="mx-auto flex max-w-6xl items-center justify-between"><Link href="/" className="font-display text-xl font-bold">crumb <span className="text-[var(--tomato)]">&</span> kettle</Link><Link href="/cart" className="min-h-11 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm font-bold">Bag →</Link></header><div className="mx-auto grid max-w-6xl gap-10 py-12 md:grid-cols-2 md:items-center md:py-20"><div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-[var(--sage)]"><Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority /></div><div className="max-w-lg"><Link href="/" className="text-sm font-bold text-[var(--tomato-dark)]">← Back to the good stuff</Link><p className="mt-10 text-xs font-bold uppercase tracking-[.18em] text-[var(--tomato)]">{product.category}</p><h1 className="mt-3 text-6xl md:text-7xl">{product.name}</h1><p className="mt-6 text-lg leading-8 text-[var(--muted)]">{product.description}</p><div className="mt-9 flex items-center gap-6"><span className="text-2xl font-bold">{formatPrice(product.priceCents)}</span><AddToCart productId={product.id} /></div><p className="mt-5 text-xs text-[var(--muted)]">Packed fresh · Ships next business day</p></div></div></main>;
}
