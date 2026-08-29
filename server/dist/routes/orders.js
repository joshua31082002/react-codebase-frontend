import { Router } from 'express';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { carts, cartItems, orderItems, orders, products, } from '../db/schema.js';
import { checkoutSchema } from '../validation/schemas.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth);
router.post('/', async (req, res, next) => {
    try {
        const parsed = checkoutSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Complete every delivery field.' });
        const result = await db.transaction(async (tx) => {
            const [cart] = await tx
                .select()
                .from(carts)
                .where(eq(carts.userId, req.user.id))
                .limit(1);
            if (!cart)
                throw Object.assign(new Error('Your cart is empty.'), { status: 400 });
            const items = await tx
                .select({ item: cartItems, product: products })
                .from(cartItems)
                .innerJoin(products, eq(products.id, cartItems.productId))
                .where(eq(cartItems.cartId, cart.id));
            if (!items.length)
                throw Object.assign(new Error('Your cart is empty.'), { status: 400 });
            if (items.some(({ item, product }) => product.stock < item.quantity))
                throw Object.assign(new Error('One or more items no longer have enough stock.'), { status: 409 });
            const totalCents = items.reduce((sum, { item, product }) => sum + product.priceCents * item.quantity, 0);
            const [order] = await tx
                .insert(orders)
                .values({ userId: req.user.id, totalCents, ...parsed.data })
                .returning();
            for (const { item, product } of items) {
                await tx.insert(orderItems).values({
                    orderId: order.id,
                    productId: product.id,
                    productName: product.name,
                    priceCents: product.priceCents,
                    quantity: item.quantity,
                });
                await tx
                    .update(products)
                    .set({ stock: product.stock - item.quantity })
                    .where(eq(products.id, product.id));
            }
            await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));
            return order;
        });
        res.status(201).json({ order: result });
    }
    catch (error) {
        if (error.status)
            return res.status(error.status).json({ error: error.message });
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        res.json({
            orders: await db
                .select()
                .from(orders)
                .where(eq(orders.userId, req.user.id))
                .orderBy(desc(orders.createdAt))
                .limit(50),
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const [order] = await db
            .select()
            .from(orders)
            .where(and(eq(orders.id, Number(req.params.id)), eq(orders.userId, req.user.id)))
            .limit(1);
        if (!order)
            return res.status(404).json({ error: 'Order not found.' });
        const items = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, order.id));
        res.json({ order: { ...order, items } });
    }
    catch (error) {
        next(error);
    }
});
export default router;
