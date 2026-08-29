import type { Metadata } from "next";
import Storefront from "@/components/Storefront";
import { getProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Crumb & Kettle — Eat a little brighter",
  description: "Small-batch drinks, bowls, and pantry favorites for your most delicious days.",
};

export default function Home() {
  return <Storefront products={getProducts()} />;
}
