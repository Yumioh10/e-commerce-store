import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const orderService = new OrderService();

export default class OrderController {
  /**
   * Create a new order
   * POST /api/v1/orders
   */
  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const { items, shippingAddress, paymentMethod } = req.body;

      // Validate required fields
      if (!items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Order must contain at least one item'
        });
      }

      if (!shippingAddress) {
        return res.status(400).json({
          success: false,
          message: 'Shipping address is required'
        });
      }

      if (!paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Payment method is required'
        });
      }

      const order = await orderService.createOrder(
        userId,
        items,
        shippingAddress,
        paymentMethod
      );

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error: any) {
      if (error.message.includes('out of stock') || error.message.includes('not found')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Get all orders (admin gets all, users get their own)
   * GET /api/v1/orders
   */
  async getOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const userRole = req.user.role;
      const { status, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

      let orders;
      let total;

      if (userRole === 'admin') {
        // Admin can see all orders
        const result = await orderService.getAllOrders({
          status: status as string,
          page: Number(page),
          limit: Number(limit),
          sortBy: sortBy as string,
          order: order as string
        });
        orders = result.orders;
        total = result.total;
      } else {
        // Regular users can only see their own orders
        const result = await orderService.getUserOrders(userId, {
          status: status as string,
          page: Number(page),
          limit: Number(limit),
          sortBy: sortBy as string,
          order: order as string
        });
        orders = result.orders;
        total = result.total;
      }

      res.status(200).json({
        success: true,
        count: orders.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single order by ID
   * GET /api/v1/orders/:id
   */
  async getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;
      const userId = req.user._id;
      const userRole = req.user.role;

      const order = await orderService.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check if user has permission to view this order
      if (userRole !== 'admin' && order.userId.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own orders'
        });
      }

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update order status (admin only)
   * PUT /api/v1/orders/:id/status
   */
  async updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      const order = await orderService.updateOrderStatus(orderId, status);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: order
      });
    } catch (error: any) {
      if (error.message.includes('cannot be updated')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Cancel an order
   * PUT /api/v1/orders/:id/cancel
   */
  async cancelOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;
      const userId = req.user._id;
      const userRole = req.user.role;

      const order = await orderService.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check if user has permission to cancel this order
      if (userRole !== 'admin' && order.userId.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only cancel your own orders'
        });
      }

      const cancelledOrder = await orderService.cancelOrder(orderId);

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: cancelledOrder
      });
    } catch (error: any) {
      if (error.message.includes('cannot be cancelled')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Delete an order (admin only)
   * DELETE /api/v1/orders/:id
   */
  async deleteOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;

      const order = await orderService.deleteOrder(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all orders for a specific user (admin only)
   * GET /api/v1/orders/user/:userId
   */
  async getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { status, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

      const result = await orderService.getUserOrders(userId, {
        status: status as string,
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        order: order as string
      });

      res.status(200).json({
        success: true,
        count: result.orders.length,
        total: result.total,
        page: Number(page),
        pages: Math.ceil(result.total / Number(limit)),
        data: result.orders
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order invoice/receipt
   * GET /api/v1/orders/:id/invoice
   */
  async getOrderInvoice(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;
      const userId = req.user._id;
      const userRole = req.user.role;

      const order = await orderService.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check if user has permission to view this invoice
      if (userRole !== 'admin' && order.userId.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own invoices'
        });
      }

      const invoice = await orderService.generateInvoice(orderId);

      res.status(200).json({
        success: true,
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }
}