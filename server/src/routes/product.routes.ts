import { Router } from 'express';
import ProductController from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const productController = new ProductController();

// Public routes - must be defined before parameterized routes
router.get('/search/suggestions', productController.getSearchSuggestions.bind(productController));
router.get('/featured', productController.getFeaturedProducts.bind(productController));
router.get('/filters/available', productController.getAvailableFilters.bind(productController));
router.get('/stats/category-count', productController.getProductCountByCategory.bind(productController));
router.get('/category/:category', productController.getProductsByCategory.bind(productController));

// Admin inventory routes
router.get(
  '/inventory/low-stock',
  authenticate,
  authorize('admin'),
  productController.getLowStockProducts.bind(productController)
);

router.get(
  '/inventory/out-of-stock',
  authenticate,
  authorize('admin'),
  productController.getOutOfStockProducts.bind(productController)
);

// Main product routes
router.get('/', productController.getProducts.bind(productController));
router.get('/:id', productController.getProduct.bind(productController));
router.get('/:id/related', productController.getRelatedProducts.bind(productController));

// Protected routes (Admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  productController.createProduct.bind(productController)
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  productController.updateProduct.bind(productController)
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  productController.deleteProduct.bind(productController)
);

export default router;