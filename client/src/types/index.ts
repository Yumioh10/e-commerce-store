import { z } from 'zod'

export const ProductId = z.string().brand<'ProductId'>();
export type ProductId = z.infer<typeof ProductId>;

export const OrderId = z.string().brand<'OrderId'>();
export type OrderId = z.infer<typeof OrderId>;

export interface Product {
  id: ProductId;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  ingredients?: string[];
  benefits?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface Order {
  id: OrderId;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface CheckoutForm {
  shipping: {
    firstName: string;
    lastName: string;
    phone: number;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  payment: {
    method: 'card' | 'paypal';
    cardNumber?: string;
    expiry?: string;
    cvv?: string;
  };
}

export type Page = 'home' | 'products' | 'product-detail' | 'cart' | 'checkout' | 'success';

export interface props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onCartOpen: () => void;
  product: Product;
  onViewDetails: (product: Product) => void;
  products: Product[];
};

