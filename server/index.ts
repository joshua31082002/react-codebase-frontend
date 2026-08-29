import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());
app.use((_, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
const root = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(root, '../../client/dist')));
app.get(/.*/, (_, res) =>
  res.sendFile(path.resolve(root, '../../client/dist/index.html')),
);
app.use(errorHandler);
const port = Number(process.env.PORT ?? 4173);
app.listen(port, '0.0.0.0', () =>
  console.log(`Volt House listening on ${port}`),
);
