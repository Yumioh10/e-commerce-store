import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { IOrderItem } from '../types/order.types';

interface QueryOptions {
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
}

export class OrderService {
  /**
   * Create a new order
   */
  async createOrder(
    userId: string,
    items: IOrderItem[],
    shippingAddress: any,
    paymentMethod: string
  ) {
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate and calculate order details
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Product "${product.name}" is out of stock. Available: ${product.stock}`);
      }

      // Calculate item total
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });

      // Decrease product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create the order
    const order = new Order({
      userId,
      items: validatedItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });

    await order.save();

    // Populate product details in the response
    await order.populate('items.productId', 'name brand images');
    await order.populate('userId', 'firstName lastName email');

    return order;
  }

  /**
   * Get all orders with pagination and filtering
   */
  async getAllOrders(options: QueryOptions = {}) {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = options;

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('items.productId', 'name brand images price')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    return { orders, total };
  }

  /**
   * Get orders for a specific user
   */
  async getUserOrders(userId: string, options: QueryOptions = {}) {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = options;

    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .populate('items.productId', 'name brand images price')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    return { orders, total };
  }

  /**
   * Get single order by ID
   */
  async getOrderById(orderId: string) {
    const order = await Order.findById(orderId)
      .populate('userId', 'firstName lastName email')
      .populate('items.productId', 'name brand images price category');

    return order;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Prevent updating cancelled or delivered orders
    if (order.status === 'cancelled') {
      throw new Error('Cancelled orders cannot be updated');
    }

    if (order.status === 'delivered' && status !== 'delivered') {
      throw new Error('Delivered orders cannot be changed to another status');
    }

    order.status = status as any;
    await order.save();

    await order.populate('userId', 'firstName lastName email');
    await order.populate('items.productId', 'name brand images price');

    return order;
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Only pending and processing orders can be cancelled
    if (!['pending', 'processing'].includes(order.status)) {
      throw new Error(`Orders with status "${order.status}" cannot be cancelled`);
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    await order.populate('userId', 'firstName lastName email');
    await order.populate('items.productId', 'name brand images price');

    return order;
  }

  /**
   * Delete an order
   */
  async deleteOrder(orderId: string) {
    const order = await Order.findById(orderId);

    if (!order) {
      return null;
    }

    // If order is not cancelled, restore stock before deleting
    if (order.status !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    await Order.findByIdAndDelete(orderId);
    return order;
  }

  /**
   * Generate invoice for an order
   */
  async generateInvoice(orderId: string) {
    const order = await Order.findById(orderId)
      .populate('userId', 'firstName lastName email')
      .populate('items.productId', 'name brand price');

    if (!order) {
      throw new Error('Order not found');
    }

    // Calculate subtotal, tax, and shipping
    const subtotal = order.totalAmount;
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    const invoice = {
      orderId: order._id,
      orderNumber: `ORD-${(order._id as any).toString().slice(-8).toUpperCase()}`,
      orderDate: order.createdAt,
      status: order.status,
      customer: {
        name: `${(order.userId as any).firstName} ${(order.userId as any).lastName}`,
        email: (order.userId as any).email
      },
      shippingAddress: order.shippingAddress,
      items: order.items.map((item: any) => ({
        name: item.productId.name,
        brand: item.productId.brand,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      pricing: {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2)
      },
      paymentMethod: order.paymentMethod
    };

    return invoice;
  }

  /**
   * Get order statistics (for admin dashboard)
   */
  async getOrderStatistics() {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    // Calculate total revenue (from delivered orders)
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('userId', 'firstName lastName')
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      totalOrders,
      ordersByStatus: {
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },
      totalRevenue: totalRevenue.toFixed(2),
      recentOrders
    };
  }
}