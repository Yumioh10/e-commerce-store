import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { CreateProductDto } from '../_shared/dtos/create-product.dto';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();
const productController = new ProductController();

// Public routes (anyone can see)
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin-only routes (must be logged in AND be an admin)
router.post(
  '/',
  authMiddleware,      // 1. Is user logged in?
  adminMiddleware,     // 2. Is user an admin?
  validateMiddleware(CreateProductDto), // 3. Is req.body valid?
  productController.createProduct
);

// ... other routes like PUT /:id and DELETE /:id

export const productRoutes = router;