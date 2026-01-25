export interface Product {
  id: string;
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

export type Page = 'home' | 'products' | 'product-detail' | 'cart' | 'checkout' | 'success';

export interface props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onCartOpen: () => void;
  product: Product;
  onViewDetails: (product: Product) => void;
  products: Product[];
};