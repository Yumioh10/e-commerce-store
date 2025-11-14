import { Router } from 'express';
import { PromotionController } from '../controllers/promotion.controller.ts';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();
const promoController = new PromotionController(); // You create this

// User route to validate a code
router.post(
  '/apply',
  authMiddleware,
  promoController.applyPromotion
);

// Admin routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  promoController.createPromotion
);

export const promotionRoutes = router;