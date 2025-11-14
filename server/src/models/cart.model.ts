import { Schema, model, Document } from 'mongoose';
import { ICart } from '../_shared/interfaces/cart.interface.ts';

export interface ICartDocument extends ICart, Document {}

const cartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
}, { _id: false });

const cartSchema = new Schema<ICartDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  // We can add a virtual for total price later
}, {
  timestamps: true,
});

export const Cart = model<ICartDocument>('Cart', cartSchema);