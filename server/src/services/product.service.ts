import { Product, IProductDocument } from '../models/product.model.ts'
import { CreateProductDto } from '../_shared/dtos/create-product.dto.ts'
import { ApiError } from '../utils/ApiError.ts'
import { Product } from '../_shared/interfaces/product.interface.ts'

export class ProductService {
  /**
   * Create a new product
   * @param productData - The product data from the DTO
   */
  public async createProduct(
    productData: CreateProductDto
  ): Promise<IProductDocument> {
    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: productData.sku })
    if (existingProduct) {
      throw new ApiError(409, 'Conflict: SKU already exists.')
    }

    const newProduct = new Product(productData)
    await newProduct.save()
    return newProduct
  }

  /**
   * Get all products with basic filtering
   * @param query - Filter query (e.g., { category: 'skincare' })
   */
  public async getAllProducts(query: any): Promise<IProductDocument[]> {
    // Here you would add logic for filtering, pagination, sorting
    const products = await Product.find(query)
    return products
  }

  /**
   * Get a single product by its ID
   * @param id - The product ID
   */
  public async getProductById(id: string): Promise<IProductDocument> {
    const product = await Product.findById(id)
    if (!product) {
      throw new ApiError(404, 'Product not found.')
    }
    return product
  }

  // ... other methods like updateProduct, deleteProduct, etc.
}
