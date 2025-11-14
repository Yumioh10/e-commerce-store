import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.ts';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { AddToCartDto } from '../_shared/dtos/add-to-cart.dto';
import { authMiddleware } from '../middlewares/auth.middleware'; // Assumes you built this

const router = Router();
const cartController = new CartController(); // You create this

// ALL cart routes are protected
router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post(
  '/item',
  validateMiddleware(AddToCartDto),
  cartController.addItemToCart
);
// router.put('/item/:productId', ...);
// router.delete('/item/:productId', ...);

export const cartRoutes = router;