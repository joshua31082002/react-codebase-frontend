import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  stock: number;
  category: string;
  categorySlug: string;
  featured: boolean;
  rating: number;
};
type User = { id: number; name: string; email: string };
type Cart = {
  items: {
    id: number;
    productId: number;
    quantity: number;
    product: Product;
  }[];
};
const money = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    cents / 100,
  );
async function api<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${url}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(body?.error ?? 'Something went wrong.');
  return body as T;
}

function Header({
  user,
  cartCount,
  onNavigate,
  onLogout,
}: {
  user: User | null;
  cartCount: number;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}) {
  return (
    <header className="site-header">
      <a
        className="brand"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('/');
        }}
      >
        <span className="brand-mark">V</span>
        <span>volt house</span>
      </a>
      <nav>
        <a href="#shop" onClick={() => onNavigate('/')}>
          Shop
        </a>
        <a
          href="#orders"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/orders');
          }}
        >
          Orders
        </a>
      </nav>
      <div className="header-actions">
        {user ? (
          <button className="user-chip" onClick={onLogout} title="Sign out">
            Hi, {user.name.split(' ')[0]}
          </button>
        ) : (
          <button className="text-button" onClick={() => onNavigate('/login')}>
            Sign in
          </button>
        )}
        <button
          className="cart-button"
          onClick={() => onNavigate('/cart')}
          aria-label={`Cart with ${cartCount} items`}
        >
          <span>Bag</span>
          <b>{cartCount}</b>
        </button>
      </div>
    </header>
  );
}
function ProductCard({
  product,
  onOpen,
  onAdd,
}: {
  product: Product;
  onOpen: () => void;
  onAdd: () => void;
}) {
  return (
    <article className="product-card">
      <button className="product-image" onClick={onOpen}>
        <img src={product.imageUrl} alt={product.name} />
        <span className="category-tag">{product.category}</span>
      </button>
      <div className="product-info">
        <div>
          <button className="product-name" onClick={onOpen}>
            {product.name}
          </button>
          <p>{product.description}</p>
        </div>
        <div className="product-footer">
          <strong>{money(product.priceCents)}</strong>
          <button
            className="add-button"
            onClick={onAdd}
            disabled={product.stock === 0}
          >
            {product.stock ? 'Add to bag' : 'Sold out'}
          </button>
        </div>
      </div>
    </article>
  );
}
function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        required
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function Auth({
  mode,
  onSuccess,
  onNavigate,
}: {
  mode: 'login' | 'register';
  onSuccess: (user: User) => void;
  onNavigate: (path: string) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const register = mode === 'register';
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api<{ user: User }>(
        `/auth/${register ? 'register' : 'login'}`,
        {
          method: 'POST',
          body: JSON.stringify({
            name: register ? name : undefined,
            email,
            password,
          }),
        },
      );
      onSuccess(data.user);
      onNavigate('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="center-page">
      <div className="auth-panel">
        <p className="eyebrow">YOUR BETTER SETUP</p>
        <h1>{register ? 'Make room for better tech.' : 'Welcome back.'}</h1>
        <p className="lead">
          {register
            ? 'Create an account to keep your bag and orders close.'
            : 'Sign in to pick up where you left off.'}
        </p>
        <form onSubmit={submit}>
          {register && (
            <FormField
              label="Full name"
              value={name}
              onChange={setName}
              placeholder="Alex Morgan"
            />
          )}
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
          />
          <FormField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="8 characters minimum"
          />
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <button className="primary-button full" disabled={busy}>
            {busy ? 'Working…' : register ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <p className="switch-copy">
          {register ? 'Already have an account?' : 'New to Volt House?'}{' '}
          <button
            className="link-button"
            onClick={() => onNavigate(register ? '/login' : '/register')}
          >
            {register ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </div>
    </main>
  );
}
function Home({
  products,
  categories,
  onNavigate,
  onAdd,
}: {
  products: Product[];
  categories: { slug: string; name: string }[];
  onNavigate: (p: string) => void;
  onAdd: (p: Product) => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (!query ||
            `${p.name} ${p.description}`
              .toLowerCase()
              .includes(query.toLowerCase())) &&
          (!category || p.categorySlug === category),
      ),
    [products, query, category],
  );
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">TECH THAT EARNS ITS PLACE</p>
          <h1>
            Good choices.
            <br />
            <em>Better living.</em>
          </h1>
          <p className="hero-text">
            Thoughtful electronics for work, rest, and everything in between. No
            noise, just the things worth bringing home.
          </p>
          <a className="primary-button" href="#catalog">
            Explore the collection <span>↘</span>
          </a>
        </div>
        <div className="hero-art">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>
          <div className="hero-device">◒</div>
          <span className="art-note">
            EST. 2024
            <br />
            CURATED DAILY
          </span>
        </div>
      </section>
      <section className="catalog" id="catalog">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE COLLECTION</p>
            <h2>Find your next favorite.</h2>
          </div>
          <span className="result-count">{filtered.length} pieces</span>
        </div>
        <div className="filters">
          <div className="search-wrap">
            <span>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the collection"
              aria-label="Search products"
            />
          </div>
          <div className="category-filters">
            <button
              className={!category ? 'active' : ''}
              onClick={() => setCategory('')}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                className={category === c.slug ? 'active' : ''}
                onClick={() => setCategory(c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        {!filtered.length ? (
          <div className="empty-state">
            <h3>Nothing matches that search.</h3>
            <p>Try another phrase or browse every piece.</p>
            <button
              className="text-button"
              onClick={() => {
                setQuery('');
                setCategory('');
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpen={() => onNavigate(`/products/${p.slug}`)}
                onAdd={() => onAdd(p)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
function ProductDetail({
  slug,
  onNavigate,
  onAdd,
}: {
  slug: string;
  onNavigate: (p: string) => void;
  onAdd: (p: Product) => void;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api<{ product: Product }>(`/products/${slug}`)
      .then((d) => setProduct(d.product))
      .catch((err) => setError((err as Error).message));
  }, [slug]);
  if (error)
    return (
      <main className="center-page">
        <div className="empty-state">
          <h3>{error}</h3>
          <button className="primary-button" onClick={() => onNavigate('/')}>
            Back to collection
          </button>
        </div>
      </main>
    );
  if (!product)
    return (
      <main className="center-page">
        <div className="loading-state">Loading product…</div>
      </main>
    );
  return (
    <main className="content-page">
      <button className="text-button" onClick={() => onNavigate('/')}>
        ← Back to collection
      </button>
      <div className="detail-layout">
        <img
          className="detail-image"
          src={product.imageUrl}
          alt={product.name}
        />
        <div className="detail-copy">
          <p className="eyebrow">{product.category.toUpperCase()}</p>
          <h1>{product.name}</h1>
          <strong className="detail-price">{money(product.priceCents)}</strong>
          <p className="detail-description">{product.description}</p>
          <p className="stock-note">
            {product.stock > 0
              ? `${product.stock} available · Ships today`
              : 'Currently sold out'}
          </p>
          <button
            className="primary-button"
            disabled={!product.stock}
            onClick={() => onAdd(product)}
          >
            {product.stock ? 'Add to bag' : 'Sold out'}
          </button>
        </div>
      </div>
    </main>
  );
}
function CartPage({
  cart,
  onNavigate,
  onUpdate,
  onRemove,
}: {
  cart: Cart | null;
  onNavigate: (p: string) => void;
  onUpdate: (id: number, q: number) => void;
  onRemove: (id: number) => void;
}) {
  const total =
    cart?.items.reduce((s, i) => s + i.product.priceCents * i.quantity, 0) ?? 0;
  if (!cart?.items.length)
    return (
      <main className="center-page">
        <div className="empty-state large">
          <p className="eyebrow">YOUR BAG</p>
          <h1>It’s waiting for something good.</h1>
          <p>
            Add a few pieces from the collection and they’ll stay here until
            you’re ready.
          </p>
          <button className="primary-button" onClick={() => onNavigate('/')}>
            Browse collection
          </button>
        </div>
      </main>
    );
  return (
    <main className="content-page">
      <div className="page-heading">
        <p className="eyebrow">YOUR BAG</p>
        <h1>Worth bringing home.</h1>
      </div>
      <div className="cart-layout">
        <section className="cart-list">
          {cart.items.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.product.imageUrl} alt="" />
              <div className="cart-item-copy">
                <h3>{item.product.name}</h3>
                <p>{money(item.product.priceCents)}</p>
                <div className="quantity">
                  <button
                    onClick={() =>
                      onUpdate(item.productId, Math.max(1, item.quantity - 1))
                    }
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => onUpdate(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <strong>{money(item.product.priceCents * item.quantity)}</strong>
              <button
                className="remove"
                onClick={() => onRemove(item.productId)}
              >
                Remove
              </button>
            </article>
          ))}
        </section>
        <aside className="summary">
          <p className="eyebrow">ORDER SUMMARY</p>
          <div>
            <span>Subtotal</span>
            <strong>{money(total)}</strong>
          </div>
          <div>
            <span>Delivery</span>
            <strong>Pay on delivery</strong>
          </div>
          <hr />
          <div className="summary-total">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          <button
            className="primary-button full"
            onClick={() => onNavigate('/checkout')}
          >
            Continue to checkout
          </button>
          <p className="fine-print">
            Free delivery on every order. Pay when it arrives.
          </p>
        </aside>
      </div>
    </main>
  );
}
function Checkout({
  user,
  onNavigate,
  onComplete,
}: {
  user: User;
  onNavigate: (p: string) => void;
  onComplete: (id: number) => void;
}) {
  const [form, setForm] = useState({
    fullName: user.name,
    email: user.email,
    phone: '',
    address: '',
    city: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key: string) => (value: string) =>
    setForm({ ...form, [key]: value });
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await api<{ order: { id: number } }>('/orders', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      onComplete(data.order.id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="content-page narrow">
      <div className="page-heading">
        <p className="eyebrow">CHECKOUT</p>
        <h1>Almost yours.</h1>
        <p className="lead">
          Tell us where to deliver it. You’ll pay when it arrives.
        </p>
      </div>
      <form className="checkout-form" onSubmit={submit}>
        <div className="form-section">
          <h3>Delivery details</h3>
          <FormField
            label="Full name"
            value={form.fullName}
            onChange={set('fullName')}
          />
          <FormField
            label="Email"
            type="email"
            value={form.email}
            onChange={set('email')}
          />
          <FormField
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder="+1 555 000 0000"
          />
          <FormField
            label="Address"
            value={form.address}
            onChange={set('address')}
            placeholder="12 Willow Street"
          />
          <FormField
            label="City"
            value={form.city}
            onChange={set('city')}
            placeholder="Brooklyn"
          />
        </div>
        <div className="payment-note">
          <span>◉</span>
          <div>
            <strong>Cash on delivery</strong>
            <p>Pay safely when your order reaches your door.</p>
          </div>
        </div>
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
        <button className="primary-button full" disabled={busy}>
          {busy ? 'Placing your order…' : 'Place order'}
        </button>
      </form>
    </main>
  );
}
function Orders({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [orders, setOrders] = useState<any[] | null>(null);
  useEffect(() => {
    api<{ orders: any[] }>('/orders')
      .then((d) => setOrders(d.orders))
      .catch(() => setOrders([]));
  }, []);
  return (
    <main className="content-page narrow">
      <div className="page-heading">
        <p className="eyebrow">YOUR ORDERS</p>
        <h1>Everything in one place.</h1>
      </div>
      {orders === null ? (
        <div className="loading-state">Loading your orders…</div>
      ) : !orders.length ? (
        <div className="empty-state">
          <h3>No orders yet.</h3>
          <p>Your first great choice is just around the corner.</p>
          <button className="primary-button" onClick={() => onNavigate('/')}>
            Shop the collection
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((o) => (
            <article className="order-row" key={o.id}>
              <div>
                <span>ORDER #{String(o.id).padStart(4, '0')}</span>
                <h3>{new Date(o.createdAt).toLocaleDateString()}</h3>
              </div>
              <span className="status">{o.status}</span>
              <strong>{money(o.totalCents)}</strong>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [toast, setToast] = useState('');
  const navigate = (p: string) => {
    window.history.pushState({}, '', p);
    setPath(p);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    api<{ user: User }>('/auth/me')
      .then((d) => {
        setUser(d.user);
        return api<{ cart: Cart }>('/cart');
      })
      .then((d) => setCart(d.cart))
      .catch(() => {});
    api<{ products: Product[] }>('/products')
      .then((d) => setProducts(d.products))
      .catch(() => {});
    api<{ categories: any[] }>('/products/categories')
      .then((d) => setCategories(d.categories))
      .catch(() => {});
    const pop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  const add = async (p: Product) => {
    if (!user) return navigate('/login');
    try {
      const d = await api<{ cart: Cart }>('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId: p.id, quantity: 1 }),
      });
      setCart(d.cart);
      setToast(`${p.name} added to your bag`);
      setTimeout(() => setToast(''), 3000);
    } catch (e) {
      setToast((e as Error).message);
    }
  };
  const update = async (id: number, q: number) => {
    try {
      const d = await api<{ cart: Cart }>(`/cart/items/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: q }),
      });
      setCart(d.cart);
    } catch (e) {
      setToast((e as Error).message);
    }
  };
  const remove = async (id: number) => {
    const d = await api<{ cart: Cart }>(`/cart/items/${id}`, {
      method: 'DELETE',
    });
    setCart(d.cart);
  };
  const logout = async () => {
    await api('/auth/logout', { method: 'POST' });
    setUser(null);
    setCart(null);
    navigate('/');
  };
  let view =
    path === '/' ? (
      <Home
        products={products}
        categories={categories}
        onNavigate={navigate}
        onAdd={add}
      />
    ) : path === '/login' ? (
      <Auth mode="login" onSuccess={setUser} onNavigate={navigate} />
    ) : path === '/register' ? (
      <Auth mode="register" onSuccess={setUser} onNavigate={navigate} />
    ) : path.startsWith('/products/') ? (
      <ProductDetail
        slug={path.replace('/products/', '')}
        onNavigate={navigate}
        onAdd={add}
      />
    ) : path === '/cart' ? (
      <CartPage
        cart={cart}
        onNavigate={navigate}
        onUpdate={update}
        onRemove={remove}
      />
    ) : path === '/checkout' && user ? (
      <Checkout
        user={user}
        onNavigate={navigate}
        onComplete={(id) => navigate(`/order-confirmation/${id}`)}
      />
    ) : path === '/orders' && user ? (
      <Orders onNavigate={navigate} />
    ) : path.startsWith('/order-confirmation/') ? (
      <main className="center-page">
        <div className="confirmation">
          <span className="success-mark">✓</span>
          <p className="eyebrow">ORDER PLACED</p>
          <h1>A very good choice.</h1>
          <p>
            Your order is on its way to becoming part of your everyday. We’ll
            collect payment at the door.
          </p>
          <button
            className="primary-button"
            onClick={() => navigate('/orders')}
          >
            View your orders
          </button>
        </div>
      </main>
    ) : (
      <Home
        products={products}
        categories={categories}
        onNavigate={navigate}
        onAdd={add}
      />
    );
  return (
    <>
      <Header
        user={user}
        cartCount={cart?.items.reduce((s, i) => s + i.quantity, 0) ?? 0}
        onNavigate={navigate}
        onLogout={logout}
      />
      {view}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      <footer>
        <span>volt house</span>
        <span>Better tech, thoughtfully chosen.</span>
        <span>© 2024</span>
      </footer>
    </>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
