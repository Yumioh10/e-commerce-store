import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();
const orderController = new OrderController(); // You create this

// All order routes are protected
router.use(authMiddleware);

router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);

// Admin-only route to update status
router.put('/:id/status', adminMiddleware, orderController.updateOrderStatus);

export const orderRoutes = router;