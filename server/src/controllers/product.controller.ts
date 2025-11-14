import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../_shared/dtos/create-product.dto';

// We instantiate the service
const productService = new ProductService();

export class ProductController {
  
  public async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // The req.body is already validated by our middleware
      const productData: CreateProductDto = req.body;
      const newProduct = await productService.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  }

  public async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getAllProducts(req.query);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  public async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
}