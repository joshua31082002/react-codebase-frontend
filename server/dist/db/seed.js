import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db, pool } from './client.js';
import { categories, products, users } from './schema.js';
const categoryRows = [
    { name: 'Phones', slug: 'phones' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Audio', slug: 'audio' },
    { name: 'Accessories', slug: 'accessories' },
];
await db.insert(categories).values(categoryRows).onConflictDoNothing();
const cats = await db.select().from(categories);
const categoryId = Object.fromEntries(cats.map((category) => [category.slug, category.id]));
const catalog = [
    [
        'Aster One 5G',
        'aster-one-5g',
        'Bright, balanced and built for a full day. A clean 6.4-inch display, all-day battery, and camera that keeps up.',
        69900,
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85',
        18,
        'phones',
        true,
    ],
    [
        'Northstar Pro 14',
        'northstar-pro-14',
        'A precise everyday laptop with a vivid display, quiet performance, and enough power for creative work.',
        129900,
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85',
        9,
        'laptops',
        true,
    ],
    [
        'Halo ANC Headphones',
        'halo-anc-headphones',
        'Immersive sound with adaptive noise control and a comfortable fit for long listening sessions.',
        24900,
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
        26,
        'audio',
        true,
    ],
    [
        'Orbit Mechanical Keyboard',
        'orbit-mechanical-keyboard',
        'A tactile, low-profile keyboard that makes every workspace feel considered.',
        12900,
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
        42,
        'accessories',
        false,
    ],
    [
        'Coda Mini Speaker',
        'coda-mini-speaker',
        'Room-filling sound in a compact shell, with 12 hours of wireless listening.',
        8900,
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85',
        31,
        'audio',
        false,
    ],
    [
        'Aster Charge Dock',
        'aster-charge-dock',
        'A calm home for your phone, earbuds, and watch with one neat cable.',
        5900,
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=85',
        60,
        'accessories',
        false,
    ],
    [
        'Fieldnote Air 13',
        'fieldnote-air-13',
        'Light enough to carry everywhere, capable enough to stay with you all day.',
        99900,
        'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
        14,
        'laptops',
        false,
    ],
    [
        'Morrow Pixel Buds',
        'morrow-pixel-buds',
        'Pocket-sized wireless earbuds with rich bass and a pocket-friendly charging case.',
        7900,
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85',
        37,
        'audio',
        false,
    ],
];
for (const [name, slug, description, priceCents, imageUrl, stock, category, featured,] of catalog) {
    await db
        .insert(products)
        .values({
        name: String(name),
        slug: String(slug),
        description: String(description),
        priceCents: Number(priceCents),
        imageUrl: String(imageUrl),
        stock: Number(stock),
        categoryId: categoryId[String(category)],
        featured: Boolean(featured),
        rating: 5,
    })
        .onConflictDoNothing();
}
const hash = await bcrypt.hash('DemoPass123!', 12);
await db
    .insert(users)
    .values({
    name: 'Demo Shopper',
    email: 'demo@volthouse.test',
    passwordHash: hash,
})
    .onConflictDoNothing();
console.log('Seeded Volt House catalog and demo shopper.');
await pool.end();
