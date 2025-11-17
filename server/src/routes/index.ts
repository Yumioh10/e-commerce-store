import { Router } from 'express';
import productRoutes from './product.routes';
import authRoutes from './auth.routes';
import orderRoutes from './order.routes';

const router = Router();

router.use('/products', productRoutes);
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);

export default router;