import type { Product } from '@/types';

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'serums', name: 'Serums' },
  { id: 'moisturizers', name: 'Moisturizers' },
  { id: 'cleansers', name: 'Cleansers' },
  { id: 'toners', name: 'Toners' },
  { id: 'eye-care', name: 'Eye Care' },
  { id: 'sunscreen', name: 'Sunscreen' },
]
export const getProductsByCategory = (categoryId: string, products: Product[]) => {
  return products.filter((p) => p.category === categoryId);
};