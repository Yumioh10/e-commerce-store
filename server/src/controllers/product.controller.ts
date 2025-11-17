import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export default class ProductController {
  /**
   * Get all products with search, filter, and pagination
   * GET /api/v1/products?search=moisturizer&category=skincare&minPrice=10&maxPrice=50&page=1&limit=12&sortBy=price&order=asc
   */
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getProducts(req.query);

      res.status(200).json({
        success: true,
        data: result.products,
        pagination: result.pagination,
        filters: result.filters
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single product by ID
   * GET /api/v1/products/:id
   */
  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found' 
        });
      }

      res.status(200).json({ 
        success: true, 
        data: product 
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new product (Admin only)
   * POST /api/v1/products
   */
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);
      
      res.status(201).json({ 
        success: true, 
        message: 'Product created successfully',
        data: product 
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product (Admin only)
   * PUT /api/v1/products/:id
   */
  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found' 
        });
      }

      res.status(200).json({ 
        success: true,
        message: 'Product updated successfully',
        data: product 
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete product (Admin only)
   * DELETE /api/v1/products/:id
   */
  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.deleteProduct(req.params.id);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found' 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Product deleted successfully' 
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search suggestions for autocomplete
   * GET /api/v1/products/search/suggestions?q=moist
   */
  async getSearchSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, limit } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const suggestions = await productService.searchSuggestions(
        q,
        limit ? Number(limit) : 5
      );

      res.status(200).json({
        success: true,
        count: suggestions.length,
        data: suggestions
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get featured/popular products
   * GET /api/v1/products/featured
   */
  async getFeaturedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit } = req.query;
      const products = await productService.getFeaturedProducts(
        limit ? Number(limit) : 8
      );

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get products by category
   * GET /api/v1/products/category/:category
   */
  async getProductsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.params;
      const { page, limit } = req.query;

      const result = await productService.getProductsByCategory(
        category,
        page ? Number(page) : 1,
        limit ? Number(limit) : 12
      );

      res.status(200).json({
        success: true,
        data: result.products,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get related products
   * GET /api/v1/products/:id/related
   */
  async getRelatedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { limit } = req.query;

      const products = await productService.getRelatedProducts(
        id,
        limit ? Number(limit) : 4
      );

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error: any) {
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Get available filters
   * GET /api/v1/products/filters/available
   */
  async getAvailableFilters(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = await productService.getAvailableFilters();

      res.status(200).json({
        success: true,
        data: filters
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get products count by category
   * GET /api/v1/products/stats/category-count
   */
  async getProductCountByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await productService.getProductCountByCategory();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get low stock products (Admin only)
   * GET /api/v1/products/inventory/low-stock?threshold=10
   */
  async getLowStockProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { threshold } = req.query;
      const products = await productService.getLowStockProducts(
        threshold ? Number(threshold) : 10
      );

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get out of stock products (Admin only)
   * GET /api/v1/products/inventory/out-of-stock
   */
  async getOutOfStockProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getOutOfStockProducts();

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }
}