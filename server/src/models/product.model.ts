import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '../types/product.types';

export interface IProductDocument extends IProduct, Document {}

const productSchema = new Schema<IProductDocument>({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['skincare', 'makeup', 'fragrance', 'haircare']
  },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  ingredients: [{ type: String }],
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, min: 0, max: 5 },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  sku: { type: String, unique: true, sparse: true }
}, { timestamps: true });

// Add indexes for search optimization
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

export const Product = mongoose.model<IProductDocument>('Product', productSchema);