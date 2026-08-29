import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";

type OrderInput = {
  customerName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  items: Array<{ productId: number; quantity: number }>;
};

export function createOrder(input: OrderInput) {
  const ids = input.items.map((item) => item.productId);
  const catalog = db.select().from(products).where(inArray(products.id, ids)).all();
  const byId = new Map(catalog.map((product) => [product.id, product]));

  if (catalog.length !== new Set(ids).size) {
    throw new Error("One or more products are unavailable");
  }

  const lineItems = input.items.map((item) => {
    const product = byId.get(item.productId);
    if (!product) throw new Error("One or more products are unavailable");
    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPriceCents: product.priceCents,
    };
  });
  const totalCents = lineItems.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  );
  const reference = `CK-${Date.now().toString(36).toUpperCase()}`;

  return db.transaction((tx) => {
    const order = tx
      .insert(orders)
      .values({
        reference,
        customerName: input.customerName,
        email: input.email,
        address: input.address,
        city: input.city,
        postalCode: input.postalCode,
        totalCents,
        status: "confirmed",
        createdAt: new Date(),
      })
      .returning()
      .get();

    tx.insert(orderItems)
      .values(lineItems.map((item) => ({ ...item, orderId: order.id })))
      .run();

    return order;
  });
}

export function getOrder(id: number) {
  const order = db.select().from(orders).where(eq(orders.id, id)).get();
  if (!order) return null;
  const items = db
    .select({ item: orderItems, product: products })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id))
    .all();
  return { ...order, items };
}
