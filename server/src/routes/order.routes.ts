import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validateOrder, validate } from '../middlewares/validation.middleware';

const router = Router();
const orderController = new OrderController();

/**
 * @route   POST /api/v1/orders
 * @desc    Create a new order
 * @access  Private (authenticated users)
 */
router.post(
  '/',
  authenticate,
  validateOrder,
  validate,
  orderController.createOrder.bind(orderController)
);

/**
 * @route   GET /api/v1/orders
 * @desc    Get all orders (admin gets all, users get their own)
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  orderController.getOrders.bind(orderController)
);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get single order by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  orderController.getOrderById.bind(orderController)
);

/**
 * @route   PUT /api/v1/orders/:id/status
 * @desc    Update order status
 * @access  Private (Admin only)
 */
router.put(
  '/:id/status',
  authenticate,
  authorize('admin'),
  orderController.updateOrderStatus.bind(orderController)
);

/**
 * @route   PUT /api/v1/orders/:id/cancel
 * @desc    Cancel an order
 * @access  Private (Users can cancel their own orders)
 */
router.put(
  '/:id/cancel',
  authenticate,
  orderController.cancelOrder.bind(orderController)
);

/**
 * @route   DELETE /api/v1/orders/:id
 * @desc    Delete an order
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  orderController.deleteOrder.bind(orderController)
);

/**
 * @route   GET /api/v1/orders/user/:userId
 * @desc    Get all orders for a specific user
 * @access  Private (Admin only)
 */
router.get(
  '/user/:userId',
  authenticate,
  authorize('admin'),
  orderController.getUserOrders.bind(orderController)
);

/**
 * @route   GET /api/v1/orders/:id/invoice
 * @desc    Get order invoice/receipt
 * @access  Private
 */
router.get(
  '/:id/invoice',
  authenticate,
  orderController.getOrderInvoice.bind(orderController)
);

export default router;