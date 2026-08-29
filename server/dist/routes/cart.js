import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { carts, cartItems, products } from '../db/schema.js';
import { cartItemSchema } from '../validation/schemas.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth);
async function getCart(userId) {
    let [cart] = await db
        .select()
        .from(carts)
        .where(eq(carts.userId, userId))
        .limit(1);
    if (!cart)
        [cart] = await db.insert(carts).values({ userId }).returning();
    const items = await db
        .select({ item: cartItems, product: products })
        .from(cartItems)
        .innerJoin(products, eq(products.id, cartItems.productId))
        .where(eq(cartItems.cartId, cart.id));
    return {
        id: cart.id,
        items: items.map(({ item, product }) => ({ ...item, product })),
    };
}
router.get('/', async (req, res, next) => {
    try {
        res.json({ cart: await getCart(req.user.id) });
    }
    catch (error) {
        next(error);
    }
});
router.post('/items', async (req, res, next) => {
    try {
        const parsed = cartItemSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Choose a valid quantity.' });
        const cart = await getCart(req.user.id);
        const [product] = await db
            .select()
            .from(products)
            .where(eq(products.id, parsed.data.productId))
            .limit(1);
        if (!product)
            return res.status(404).json({ error: 'Product not found.' });
        if (product.stock < parsed.data.quantity)
            return res
                .status(409)
                .json({ error: `Only ${product.stock} available.` });
        const existing = cart.items.find((item) => item.productId === product.id);
        if (existing)
            await db
                .update(cartItems)
                .set({ quantity: existing.quantity + parsed.data.quantity })
                .where(eq(cartItems.id, existing.id));
        else
            await db.insert(cartItems).values({
                cartId: cart.id,
                productId: product.id,
                quantity: parsed.data.quantity,
            });
        res.status(201).json({ cart: await getCart(req.user.id) });
    }
    catch (error) {
        next(error);
    }
});
router.patch('/items/:productId', async (req, res, next) => {
    try {
        const quantity = Number(req.body.quantity);
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20)
            return res
                .status(400)
                .json({ error: 'Quantity must be between 1 and 20.' });
        const cart = await getCart(req.user.id);
        const item = cart.items.find((entry) => entry.productId === Number(req.params.productId));
        if (!item)
            return res.status(404).json({ error: 'Cart item not found.' });
        if (item.product.stock < quantity)
            return res
                .status(409)
                .json({ error: `Only ${item.product.stock} available.` });
        await db
            .update(cartItems)
            .set({ quantity })
            .where(eq(cartItems.id, item.id));
        res.json({ cart: await getCart(req.user.id) });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/items/:productId', async (req, res, next) => {
    try {
        const cart = await getCart(req.user.id);
        const item = cart.items.find((entry) => entry.productId === Number(req.params.productId));
        if (item)
            await db.delete(cartItems).where(eq(cartItems.id, item.id));
        res.json({ cart: await getCart(req.user.id) });
    }
    catch (error) {
        next(error);
    }
});
export default router;
