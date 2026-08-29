import Link from "next/link";

export default function AddToCart({ productId }: { productId: number }) {
  return <Link href={`/checkout?items=${productId}:1`} className="inline-flex min-h-12 items-center rounded-full bg-[var(--tomato)] px-6 font-bold text-white transition hover:bg-[var(--tomato-dark)]">Add to bag →</Link>;
}
