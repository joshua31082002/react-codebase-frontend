import { useMemo, useState } from 'react'

type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  badge?: string
}

const products: Product[] = [
  {
    id: 'sea-salt',
    name: 'Sea Salt Caramels',
    description: 'Buttery caramel, dark chocolate & flaky sea salt.',
    price: 18,
    category: 'Best sellers',
    image: 'https://images.unsplash.com/photo-1548907040-4d42a42a68b7?auto=format&fit=crop&w=900&q=85',
    badge: 'Bestseller',
  },
  {
    id: 'dark-truffle',
    name: 'Dark Chocolate Truffles',
    description: 'Silky ganache finished with a rich cocoa dusting.',
    price: 24,
    category: 'Truffles',
    image: 'https://images.unsplash.com/photo-1575377427642-087cf684f29d?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'hazelnut',
    name: 'Hazelnut Praline Bar',
    description: 'Roasted Piedmont hazelnuts in 64% dark chocolate.',
    price: 12,
    category: 'Bars',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=85',
    badge: 'New',
  },
  {
    id: 'gift-box',
    name: 'The Tasting Collection',
    description: 'Nine signature bonbons, made for sharing.',
    price: 36,
    category: 'Gifting',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85',
  },
]

const categories = ['All chocolates', 'Best sellers', 'Truffles', 'Bars', 'Gifting']

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 5 5" /></svg>
}

function BagIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 8.5h13l1 12h-15l1-12Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All chocolates')
  const [cartCount, setCartCount] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)

  const filteredProducts = useMemo(
    () => selectedCategory === 'All chocolates' ? products : products.filter((product) => product.category === selectedCategory),
    [selectedCategory],
  )

  return (
    <main>
      <div className="announcement">Free shipping on orders over $50 <span>·</span> Made fresh in small batches</div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Cocoa & Co. home"><span className="brand-mark">C</span><span>COCOA <i>&</i> CO.</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#shop">Shop</a><a href="#story">Our story</a><a href="#journal">Journal</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" type="button" aria-label="Toggle search" onClick={() => setSearchOpen(!searchOpen)}><SearchIcon /></button>
          <button className="bag-button" type="button" aria-label={`Shopping bag, ${cartCount} items`}><BagIcon /><span>{cartCount}</span></button>
        </div>
      </header>
      {searchOpen && <div className="search-bar"><label htmlFor="product-search">Search our chocolates</label><input id="product-search" autoFocus placeholder="Try “truffles”" /><button type="button" onClick={() => setSearchOpen(false)}>Close</button></div>}

      <section className="hero" id="top">
        <div className="hero-copy"><p className="eyebrow">Handcrafted confections · Est. 2012</p><h1>A little <em>luxury</em><br />for every day.</h1><p className="hero-description">Thoughtfully made chocolate for slow mornings, sweet celebrations, and everything in between.</p><a className="primary-button" href="#shop">Shop chocolates <ArrowIcon /></a></div>
        <div className="hero-image"><img src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1400&q=90" alt="A selection of beautifully wrapped artisan chocolate bars" /><div className="image-caption">Small batch<br /><strong>No. 04</strong></div></div>
      </section>

      <section className="values" aria-label="Our promise"><div><strong>01</strong><span>Thoughtfully sourced</span></div><div><strong>02</strong><span>Made by hand</span></div><div><strong>03</strong><span>Joyfully shared</span></div></section>

      <section className="shop-section" id="shop"><div className="section-heading"><div><p className="eyebrow">Find your favorite</p><h2>Something <em>sweet</em> awaits.</h2></div><a className="text-link" href="#shop">View all chocolates <ArrowIcon /></a></div><div className="category-tabs" role="tablist" aria-label="Chocolate categories">{categories.map((category) => <button key={category} className={selectedCategory === category ? 'active' : ''} type="button" role="tab" aria-selected={selectedCategory === category} onClick={() => setSelectedCategory(category)}>{category}</button>)}</div><div className="product-grid">{filteredProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt={product.name} />{product.badge && <span className="badge">{product.badge}</span>}<button className="quick-add" type="button" onClick={() => setCartCount((count) => count + 1)}>Add to bag <span>+</span></button></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.description}</p></div><strong>${product.price}</strong></div></article>)}</div></section>

      <section className="story-banner" id="story"><div className="story-image"><img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1100&q=85" alt="Chocolate cake with glossy ganache" /></div><div className="story-copy"><p className="eyebrow">The Cocoa & Co. way</p><h2>Make room for<br /><em>good things.</em></h2><p>We believe the best chocolate starts with the best ingredients, a little patience, and a lot of care. Every piece is made in our tiny kitchen in Brooklyn.</p><a className="text-link" href="#story">Read our story <ArrowIcon /></a></div></section>

      <footer id="journal"><div className="footer-brand"><a className="brand" href="#top"><span className="brand-mark">C</span><span>COCOA <i>&</i> CO.</span></a><p>Beautiful chocolate,<br />made for sharing.</p></div><div className="footer-links"><div><strong>Explore</strong><a href="#shop">Shop all</a><a href="#story">Our story</a><a href="#journal">Journal</a></div><div><strong>Help</strong><a href="#shop">Contact</a><a href="#shop">Shipping & returns</a><a href="#shop">FAQs</a></div></div><div className="newsletter"><strong>Stay in the know</strong><p>New drops, sweet stories, no spam.</p><form onSubmit={(event) => event.preventDefault()}><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="Your email address" /><button type="submit" aria-label="Subscribe"><ArrowIcon /></button></form></div><div className="footer-bottom"><span>© 2024 Cocoa & Co.</span><span>Made with intention in Brooklyn, NY</span></div></footer>
    </main>
  )
}

export default App
