import { Schema, model, Document } from 'mongoose';
import { IPromotion } from '../_shared/interfaces/promotion.interface';

export interface IPromotionDocument extends IPromotion, Document {}

const promotionSchema = new Schema<IPromotionDocument>({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export const Promotion = model<IPromotionDocument>('Promotion', promotionSchema);