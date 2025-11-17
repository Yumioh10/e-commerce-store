import { Types } from 'mongoose';

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface IOrderItem {
  productId: string | Types.ObjectId;  // Changed from just string
  quantity: number;
  price: number;
}

export interface IOrder {
  userId: string | Types.ObjectId;  // Also update this
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: IAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: Date;
}
