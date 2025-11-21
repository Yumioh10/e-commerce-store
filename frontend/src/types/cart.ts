import { Product } from './product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: {
    id: string;
    name: string;
    type: 'color' | 'size' | 'scent' | 'other';
    value: string;
    price: number;
    salePrice?: number;
  };
  addedAt: string;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  coupon?: Coupon;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  variantId?: string;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  coupon?: Coupon;
  isLoading: boolean;
  error: string | null;
}