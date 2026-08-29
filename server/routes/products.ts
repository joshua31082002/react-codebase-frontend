import { Router } from 'express';
import { and, asc, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '../db/client.js';
import { categories, products } from '../db/schema.js';
const router = Router();
router.get('/categories', async (_req, res, next) => {
  try {
    res.json({
      categories: await db
        .select()
        .from(categories)
        .orderBy(asc(categories.name)),
    });
  } catch (error) {
    next(error);
  }
});
router.get('/', async (req, res, next) => {
  try {
    const query = String(req.query.query ?? '').trim();
    const category = String(req.query.category ?? '');
    const sort = String(req.query.sort ?? 'featured');
    const filters = [];
    if (query)
      filters.push(
        or(
          ilike(products.name, `%${query}%`),
          ilike(products.description, `%${query}%`),
        ),
      );
    if (category) filters.push(eq(categories.slug, category));
    const order =
      sort === 'price-low'
        ? asc(products.priceCents)
        : sort === 'price-high'
          ? desc(products.priceCents)
          : desc(products.featured);
    const rows = await db
      .select({ product: products, category: categories })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(order)
      .limit(40);
    res.json({
      products: rows.map(({ product, category: cat }) => ({
        ...product,
        category: cat.name,
        categorySlug: cat.slug,
      })),
    });
  } catch (error) {
    next(error);
  }
});
router.get('/:slug', async (req, res, next) => {
  try {
    const [row] = await db
      .select({ product: products, category: categories })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.slug, req.params.slug))
      .limit(1);
    if (!row) return res.status(404).json({ error: 'Product not found.' });
    res.json({
      product: {
        ...row.product,
        category: row.category.name,
        categorySlug: row.category.slug,
      },
    });
  } catch (error) {
    next(error);
  }
});
export default router;
