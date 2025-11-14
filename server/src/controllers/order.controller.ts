import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { IUserDocument } from '../modules/auth/model/auth.model'; // Assuming the User Model is used for typing req.user
import { CreateOrderDto } from '../_shared/dtos/create-order.dto.ts'; 
import { ApiError } from '../utils/ApiError';

// Define a type for the request after authentication
interface AuthRequest extends Request {
  user?: IUserDocument;
}

const orderService = new OrderService();

export class OrderController {
  
  /**
   * 1. Create a new Order from the current cart. (Customer action)
   * POST /api/v1/orders
   */
  public async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication failed. User information missing.');
      }
      
      // DTO validation (e.g., checking shipping address) handled by middleware
      const orderData: CreateOrderDto = req.body;
      const userId = req.user.id; 
      
      // Business logic (cart clearing, payment, stock check) is handled by the service
      const newOrder = await orderService.createOrder(userId, orderData);
      
      // 201 Created
      res.status(201).json({ 
        message: 'Order placed successfully', 
        order: newOrder 
      });
    } catch (error) {
      next(error);
    }
  }

  // -------------------------------------------------------------------
  // CUSTOMER READ ACTIONS
  // -------------------------------------------------------------------

  /**
   * 2. Get all orders for the authenticated user.
   * GET /api/v1/orders
   */
  public async getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication failed.');
      }
      
      const orders = await orderService.getOrdersForUser(req.user.id);
      
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 3. Get a specific order by ID (ensuring it belongs to the user or if user is admin).
   * GET /api/v1/orders/:orderId
   */
  public async getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication failed.');
      }

      const { orderId } = req.params;
      
      const order = await orderService.getOrderById(orderId);
      
      // Security check: Only return order if user is the owner or an admin
      if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
          throw new ApiError(403, 'Access denied. You do not own this order.');
      }

      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  // -------------------------------------------------------------------
  // ADMIN UPDATE ACTIONS (REQUIRES adminMiddleware)
  // -------------------------------------------------------------------

  /**
   * 4. Update the status of an order (Admin action).
   * PUT /api/v1/orders/:orderId/status
   */
  public async updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // AdminMiddleware already verified user is admin
      const { orderId } = req.params;
      const { status } = req.body; // Expects { status: 'shipped' | 'delivered' | ... }
      
      if (!status) {
          throw new ApiError(400, 'Order status is required in the request body.');
      }

      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      
      res.status(200).json({ 
        message: `Order ${orderId} updated to status: ${status}`,
        order: updatedOrder 
      });
    } catch (error) {
      next(error);
    }
  }
}