import { Order, IOrderDocument } from '../models/order.model.ts';
import { Cart } from '../models/cart.model.ts';
import { Product } from '../models/product.model.ts';
import { ApiError } from '../utils/ApiError.ts';
import { CreateOrderDto }from '../_shared/dtos/create-order.dto.ts'; // Contains shippingAddress

export class OrderService {
  
  // 1. CREATE Order (Complex Business Logic)
  public async createOrder(userId: string, orderData: CreateOrderDto): Promise<IOrderDocument> {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, 'Cannot place order: Cart is empty.');
    }

    let totalAmount = 0;
    const orderItems: any[] = [];
    
    // Process items, calculate total, and check stock
    for (const item of cart.items) {
      // @ts-ignore: Mongoose population ensures item.product is a document
      const product = item.product; 
      
      if (!product || product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for product: ${product?.name || item.product}.`);
      }

      totalAmount += product.price * item.quantity;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price, // Snapshot price
        quantity: item.quantity,
      });

      // Optional: Decrement stock here (for a complete implementation)
      // product.stock -= item.quantity;
      // await product.save();
    }
    
    // 2. Create the order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress: orderData.shippingAddress,
      // Status is 'paid' or 'pending' depending on payment gateway integration
      status: 'pending', 
      // paymentToken: orderData.paymentToken,
    });

    await order.save();
    
    // 3. Clear the cart only after successful order creation
    await Cart.updateOne({ user: userId }, { $set: { items: [] } });
    
    return order;
  }

  // 2. READ Single Order (The missing method)
  public async getOrderById(orderId: string): Promise<IOrderDocument> {
    // Populate the user reference for security checks in the controller
    const order = await Order.findById(orderId).populate('user'); 
    
    if (!order) {
      throw new ApiError(404, 'Order not found.');
    }
    
    return order;
  }
  
  // 3. READ User Orders
  public async getOrdersForUser(userId: string): Promise<IOrderDocument[]> {
    return Order.find({ user: userId }).sort({ createdAt: -1 });
  }

  // 4. UPDATE Order Status (Admin action)
  public async updateOrderStatus(orderId: string, status: string): Promise<IOrderDocument> {
    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status: ${status}.`);
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { status }, 
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      throw new ApiError(404, 'Order not found for status update.');
    }
    
    return updatedOrder;
  }
}