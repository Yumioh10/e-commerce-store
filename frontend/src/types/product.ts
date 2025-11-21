export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: ProductImage[];
  category: string;
  subcategory: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  features: string[];
  ingredients: string[];
  howToUse: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'scent' | 'other';
  value: string;
  sku: string;
  price: number;
  salePrice?: number;
  inStock: boolean;
  stockQuantity: number;
  image?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  subcategories: ProductSubcategory[];
  productCount: number;
}

export interface ProductSubcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  productCount: number;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  website?: string;
  productCount: number;
}

export interface ProductFilter {
  categories: string[];
  subcategories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  inStock: boolean;
  features: string[];
  tags: string[];
}

export interface ProductSort {
  field: 'name' | 'price' | 'rating' | 'createdAt' | 'reviewCount';
  direction: 'asc' | 'desc';
}

export interface ProductSearchParams {
  query?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  page?: number;
  limit?: number;
  sort?: ProductSort;
  filters?: ProductFilter;
}

export interface ProductResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  title: string;
  content: string;
  images: string[];
  helpful: number;
  verified: boolean;
  createdAt: string;
}