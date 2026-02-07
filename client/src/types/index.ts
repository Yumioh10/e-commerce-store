import { z } from 'zod';

// Branded types for type safety
export const ProductId = z.string().brand<'ProductId'>();
export type ProductId = z.infer<typeof ProductId>;

export const OrderId = z.string().brand<'OrderId'>();
export type OrderId = z.infer<typeof OrderId>;

export const Currency = z.enum(['Dh']);
export type Currency = z.infer<typeof Currency>;

export interface Product {
  id: ProductId;
  name: string;
  category: 'visage' | 'maquillage' | 'dermocosmetique' | 'hygiene&soins-quotidiens' | 'soins-corps' | 'soins-capillaires' | 'naturel-bio' | 'maman-bebe' | 'complement-alimentaire' | 'accessoires' |'soins-hommes' |'hiver-deals' ;
  price: number;
  currency: Currency;
  images: string[]; // External Unsplash URLs
  description: string;
  medicalClaims: string[];
  ingredients: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  volume?: string;
  applicationArea?: string;
}

export interface CartItem extends Product {
  quantity: number;
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