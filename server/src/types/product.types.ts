export interface IProduct {
  name: string;
  brand: string;
  category: 'skincare' | 'makeup' | 'fragrance' | 'haircare';
  price: number;
  description: string;
  ingredients: string[];
  images: string[];
  stock: number;
  rating?: number;
  reviews?: string[];
  sku?: string;
}