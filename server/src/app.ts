import express from 'express';
import helmet from 'helmet'; // For security headers
import cors from 'cors';       // For cross-origin requests
import "reflect-metadata";
import { errorMiddleware } from './middlewares/error.middleware';
import { productRoutes } from './routes/product.routes.ts';
import { userRoutes } from './routes/user.routes.ts'
import { orderRoutes } from './routes/order.routes.ts'
import { cartRoutes } from './routes/cart.routes.ts'
import { promotionRoutes } from './routes/promotion.routes.ts'

const app = express();

// Parse JSON bodies (like request.body)
app.use(express.json())

// --- Core Middleware ---
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Custom middleware
app.use((req, _, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// --- API Routes ---
// Health check
app.get('/health', (req, res) => res.status(200).send('OK'));

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/carts', cartRoutes);
app.use('api/v1/promotions', promotionRoutes);


// --- Error Handling ---
// This must be LAST
app.use(errorMiddleware);

export default app;