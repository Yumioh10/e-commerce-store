import { Schema, model, Document } from 'mongoose';
import { IOrder } from '../_shared/interfaces/order.interface.ts';

export interface IOrderDocument extends IOrder, Document {}

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true }, // Snapshot of product name
  price: { type: Number, required: true }, // Snapshot of price
  quantity: { type: Number, required: true },
}, { _id: false });

const orderSchema = new Schema<IOrderDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type:String, required: true },
    zipCode: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentResult: { // For Stripe, etc.
    id: String,
    status: String,
  },
}, {
  timestamps: true,
});

export const Order = model<IOrderDocument>('Order', orderSchema);