import { Promotion, IPromotionDocument } from '../models/promotion.model.ts'; // Assuming promotion model path
import { Cart, ICartDocument } from '../models/cart.model.ts'; 
import { ApiError } from '../utils/ApiError';
import { CreatePromotionDto } from '../_shared/dtos/create-promotion.dto';

export class PromotionService {
  
  // 1. CREATE Promotion (The missing method - Admin action)
  public async createPromotion(promotionData: CreatePromotionDto): Promise<IPromotionDocument> {
    // Check if a code with the same name already exists
    const existingPromo = await Promotion.findOne({ code: promotionData.code.toUpperCase() });
    if (existingPromo) {
        throw new ApiError(409, `Promotion code '${promotionData.code}' already exists.`);
    }

    const newPromotion = new Promotion({
        ...promotionData,
        code: promotionData.code.toUpperCase() // Store codes in uppercase for consistency
    });

    await newPromotion.save();
    return newPromotion;
  }

  // 2. APPLY Promotion to Cart (Customer action)
  public async applyPromotionToCart(userId: string, code: string): Promise<ICartDocument> {
    // --- Step 1: Validate the promotion code ---
    const promo = await Promotion.findOne({ 
        code: code.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() } // Check if not expired
    });
    
    if (!promo) {
        throw new ApiError(404, 'Invalid or expired promotion code.');
    }
    
    // --- Step 2: Get and update the user's cart ---
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
        throw new ApiError(404, 'Cart not found.');
    }

    // 💡 Business Logic Placeholder: 
    // This is where you would calculate the discount based on promo.discountType and promo.discountValue, 
    // apply it to the cart's total, and save the applied promotion code to the cart document itself 
    // (requires adding a promoCode field to the ICart interface/Cart model).
    
    // Example: Save the applied code to the cart for future reference
    // cart.appliedCoupon = promo.code; // You would need to add this field to your Cart model
    // await cart.save();

    // For simplicity, we just return the cart after validating the code.
    return cart; 
  }
}