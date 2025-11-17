import { Product } from '../models/product.model'
import { IProduct } from '../types/product.types'

interface ProductQueryParams {
  // Search
  search?: string

  // Filters
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStock?: boolean | string

  // Pagination
  page?: number
  limit?: number

  // Sorting
  sortBy?: string
  order?: 'asc' | 'desc'
}

interface ProductResponse {
  products: any[]
  pagination: {
    currentPage: number
    totalPages: number
    totalProducts: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  filters: {
    appliedFilters: any
    availableFilters: {
      categories: string[]
      brands: string[]
      priceRange: { min: number; max: number }
    }
  }
}

export class ProductService {
  /**
   * Get products with advanced search, filtering, and pagination
   */
  async getProducts(queryParams: ProductQueryParams): Promise<ProductResponse> {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      order = 'desc',
    } = queryParams

    // Build query object
    const query: any = {}

    // Text search
    if (search) {
      query.$text = { $search: search }
    }

    // Category filter
    if (category) {
      query.category = category
    }

    // Brand filter
    if (brand) {
      // Support multiple brands separated by comma
      const brands = brand.split(',').map((b) => b.trim())
      if (brands.length > 1) {
        query.brand = { $in: brands }
      } else {
        query.brand = brand
      }
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {}
      if (minPrice !== undefined) query.price.$gte = Number(minPrice)
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice)
    }

    // Rating filter
    if (minRating !== undefined) {
      query.rating = { $gte: Number(minRating) }
    }

    // Stock filter
    if (inStock !== undefined) {
      const isInStock = inStock === true || inStock === 'true'
      if (isInStock) {
        query.stock = { $gt: 0 }
      }
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit)
    const sortOrder = order === 'desc' ? -1 : 1

    // Build sort object
    let sortObject: any = {}
    if (search) {
      // If searching, sort by text score first
      sortObject = { score: { $meta: 'textScore' }, [sortBy]: sortOrder }
    } else {
      sortObject = { [sortBy]: sortOrder }
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sortObject)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v')

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query)
    const totalPages = Math.ceil(totalProducts / Number(limit))

    // Get available filters (for client filter UI)
    const availableFilters = await this.getAvailableFilters()

    return {
      products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalProducts,
        limit: Number(limit),
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
      filters: {
        appliedFilters: {
          search,
          category,
          brand,
          minPrice,
          maxPrice,
          minRating,
          inStock,
        },
        availableFilters,
      },
    }
  }

  /**
   * Get available filter options
   */
  async getAvailableFilters() {
    // Get unique categories
    const categories = await Product.distinct('category')

    // Get unique brands
    const brands = await Product.distinct('brand')

    // Get price range
    const priceRange = await Product.aggregate([
      {
        $group: {
          _id: null,
          min: { $min: '$price' },
          max: { $max: '$price' },
        },
      },
    ])

    return {
      categories: categories.sort(),
      brands: brands.sort(),
      priceRange:
        priceRange.length > 0
          ? { min: priceRange[0].min, max: priceRange[0].max }
          : { min: 0, max: 0 },
    }
  }

  /**
   * Search products with autocomplete suggestions
   */
  async searchSuggestions(searchTerm: string, limit: number = 5) {
    if (!searchTerm || searchTerm.length < 2) {
      return []
    }

    const suggestions = await Product.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
    })
      .select('name brand category price images')
      .limit(limit)

    return suggestions
  }

  /**
   * Get featured/popular products
   */
  async getFeaturedProducts(limit: number = 8) {
    return await Product.find({ stock: { $gt: 0 } })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .select('-__v')
  }

  /**
   * Get products by category with pagination
   */
  async getProductsByCategory(
    category: string,
    page: number = 1,
    limit: number = 12
  ) {
    const skip = (page - 1) * limit

    const products = await Product.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v')

    const totalProducts = await Product.countDocuments({ category })

    return {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        limit,
      },
    }
  }

  /**
   * Get related products (same category, excluding current product)
   */
  async getRelatedProducts(productId: string, limit: number = 4) {
    const product = await Product.findById(productId)

    if (!product) {
      throw new Error('Product not found')
    }

    return await Product.find({
      category: product.category,
      _id: { $ne: productId },
    })
      .sort({ rating: -1 })
      .limit(limit)
      .select('-__v')
  }

  /**
   * Create a new product
   */
  async createProduct(productData: IProduct) {
    const product = new Product(productData)
    return await product.save()
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string) {
    return await Product.findById(id)
  }

  /**
   * Update product
   */
  async updateProduct(id: string, updates: Partial<IProduct>) {
    return await Product.findByIdAndUpdate(id, updates, { new: true })
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    return await Product.findByIdAndDelete(id)
  }

  /**
   * Update product stock
   */
  async updateStock(id: string, quantity: number) {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { stock: -quantity } },
      { new: true }
    )
  }

  /**
   * Get products count by category
   */
  async getProductCountByCategory() {
    return await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])
  }

  /**
   * Get low stock products (for admin dashboard)
   */
  async getLowStockProducts(threshold: number = 10) {
    return await Product.find({ stock: { $lte: threshold, $gt: 0 } })
      .sort({ stock: 1 })
      .select('name brand stock category')
  }

  /**
   * Get out of stock products
   */
  async getOutOfStockProducts() {
    return await Product.find({ stock: 0 })
      .sort({ updatedAt: -1 })
      .select('name brand category')
  }
}

export default ProductService
