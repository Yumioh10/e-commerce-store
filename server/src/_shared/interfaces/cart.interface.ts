import { ObjectId } from 'mongoose'
// Import the Product interface to use for populated types
import { Product } from './product.interface.ts'

// Interface for a single item within the cart
export interface ICartItem {
  // 💡 FIX: product can be an ObjectId (unpopulated) OR the full Product interface (populated)
  product: ObjectId | string | Product
  quantity: number
}

// Main Cart interface
export interface ICart {
  user: ObjectId | string
  items: ICartItem[]
}
