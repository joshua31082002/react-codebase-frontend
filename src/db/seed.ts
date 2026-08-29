import { db } from "./index";
import { products } from "./schema";

const catalog = [
  { slug: "citrus-sunrise", name: "Citrus Sunrise", category: "Cold-pressed juice", description: "Bright orange, ruby grapefruit, and a little ginger for a clean, sunny start.", priceCents: 850, imageUrl: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=85", accent: "sun" },
  { slug: "green-glow", name: "Green Glow", category: "Cold-pressed juice", description: "Cucumber, green apple, lime, and mint. Crisp, cooling, and never too sweet.", priceCents: 900, imageUrl: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=1200&q=85", accent: "leaf" },
  { slug: "cocoa-cloud", name: "Cocoa Cloud", category: "Oat latte", description: "Velvety oat milk, single-origin cocoa, and a whisper of sea salt.", priceCents: 720, imageUrl: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=1200&q=85", accent: "cocoa" },
  { slug: "berry-bloom", name: "Berry Bloom", category: "Yogurt bowl", description: "Thick coconut yogurt layered with berries, toasted oats, and wildflower honey.", priceCents: 1100, imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=85", accent: "berry" },
  { slug: "golden-hour", name: "Golden Hour", category: "Wellness tonic", description: "Pineapple, turmeric, lemon, and black pepper with a warm, golden finish.", priceCents: 680, imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=85", accent: "gold" },
  { slug: "morning-mix", name: "Morning Mix", category: "Granola", description: "Small-batch oats, roasted almonds, cacao nibs, and maple in every crunchy handful.", priceCents: 1250, imageUrl: "https://images.unsplash.com/photo-1517093728432-a0440f8d45af?auto=format&fit=crop&w=1200&q=85", accent: "oat" },
];

db.insert(products).values(catalog.map((product) => ({ ...product, createdAt: new Date() }))).onConflictDoNothing().run();
console.log(`Seeded ${catalog.length} products`);
