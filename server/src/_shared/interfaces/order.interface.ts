import { ObjectId } from 'mongoose'
import { IUser } from './user.interface.ts' // Import the base user interface
import { Product } from './product.interface.ts'

// Interface for a single item in the Order (snapshot data)
export interface IOrderItem {
  product: ObjectId | string
  name: string
  price: number
  quantity: number
}

// Interface for the Shipping Address snapshot
export interface IOrderAddress {
  street: string
  city: string
  zipCode: string
}

// Main Order interface
export interface IOrder {
  // 💡 FIX: Add the 'user' property. It can be the ID or the full document.
  user: ObjectId | string | IUser
  items: IOrderItem[]
  totalAmount: number
  shippingAddress: IOrderAddress
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  paymentResult?: {
    id: string
    status: string
  }
}
