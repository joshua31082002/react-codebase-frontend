import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";

export function getProducts() {
  return db.select().from(products).orderBy(asc(products.id)).limit(24).all();
}

export function getProductBySlug(slug: string) {
  return db.select().from(products).where(eq(products.slug, slug)).get();
}
