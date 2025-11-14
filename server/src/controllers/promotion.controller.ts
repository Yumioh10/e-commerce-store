import { Request, Response, NextFunction } from 'express';
import { PromotionService } from '../services/promotion.service';
import { IUserDocument } from '../modules/auth/model/auth.model'; // Used for req.user type
import { CreatePromotionDto } from '../_shared/dtos/create-promotion.dto.ts'; 
import { ApplyPromotionDto } from '../_shared/dtos/apply-promotion.dto.ts'; 
import { ApiError } from '../utils/ApiError';

// Define a type for the request after authentication
interface AuthRequest extends Request {
  user?: IUserDocument;
}

const promotionService = new PromotionService();

export class PromotionController {
  
  // -------------------------------------------------------------------
  // ADMIN ACTIONS (Requires adminMiddleware)
  // -------------------------------------------------------------------

  /**
   * 1. Create a new promotion code (Admin action).
   * POST /api/v1/promotions
   */
  public async createPromotion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // DTO validation is handled by middleware
      const promotionData: CreatePromotionDto = req.body;
      
      const newPromotion = await promotionService.createPromotion(promotionData);
      
      // 201 Created
      res.status(201).json({ 
        message: 'Promotion created successfully', 
        promotion: newPromotion 
      });
    } catch (error) {
      next(error);
    }
  }

  // ... (Other admin methods like get all, update, delete)

  // -------------------------------------------------------------------
  // CUSTOMER ACTIONS (Requires authMiddleware)
  // -------------------------------------------------------------------

  /**
   * 2. Apply a promotion code to the authenticated user's cart (or checkout session).
   * POST /api/v1/promotions/apply
   */
  public async applyPromotion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required to apply coupon.');
      }
      
      // DTO validation ensures the couponCode property exists
      const { couponCode }: ApplyPromotionDto = req.body;
      const userId = req.user.id; 

      // Business logic: validate code, calculate discount, update cart/session
      const result = await promotionService.applyPromotionToCart(userId, couponCode);
      
      // 200 OK
      res.status(200).json({ 
        message: `Coupon code '${couponCode}' applied successfully.`, 
        // This result would include the new cart total or applied discount details
        updatedCart: result 
      });
    } catch (error) {
      next(error);
    }
  }
}