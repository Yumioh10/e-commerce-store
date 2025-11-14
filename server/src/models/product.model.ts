import { Schema, model, Document } from 'mongoose';
import { IProduct } from '../_shared/interfaces/product.interface';

// This merges the Mongoose Document interface with our custom IProduct
export interface IProductDocument extends IProduct, Document {}

const productSchema = new Schema<IProductDocument>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  sku: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  category: { type: String, required: true, index: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  images: [{ type: String }], // Array of image URLs
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

export const Product = model<IProductDocument>('Product', productSchema);