import { create } from 'zustand';
import type { Product, ProductCategory, ProductBrand, ProductSearchParams, ProductResponse, ProductReview } from '../types/product';
import { apiClient } from '@lib/api';

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  categories: ProductCategory[];
  brands: ProductBrand[];
  currentProduct: Product | null;
  productReviews: ProductReview[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  searchQuery: string;
  filters: any;
  sort: any;
}

interface ProductStore extends ProductState {
  // Actions
  fetchProducts: (params?: ProductSearchParams) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  fetchProductReviews: (productId: string) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  setFilters: (filters: any) => void;
  setSort: (sort: any) => void;
  clearSearch: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCurrentProduct: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  // Initial state
  products: [],
  featuredProducts: [],
  categories: [],
  brands: [],
  currentProduct: null,
  productReviews: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  isSearching: false,
  error: null,
  searchQuery: '',
  filters: {},
  sort: { field: 'createdAt', direction: 'desc' },

  // Fetch products
  fetchProducts: async (params?: ProductSearchParams) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.getProducts(params);

      if (response.success && response.data) {
        const { products, totalCount, currentPage, totalPages } = response.data;

        set({
          products,
          totalCount,
          currentPage,
          totalPages,
          isLoading: false,
          error: null,
        });

        // If no filters are applied, store as featured products
        if (!params?.query && !params?.category && !params?.brand) {
          set({ featuredProducts: products.slice(0, 8) });
        }
      } else {
        set({
          products: [],
          featuredProducts: [],
          totalCount: 0,
          isLoading: false,
          error: response.error || 'Failed to fetch products',
        });
      }
    } catch (error: any) {
      set({
        products: [],
        featuredProducts: [],
        totalCount: 0,
        isLoading: false,
        error: error.message || 'Failed to fetch products',
      });
    }
  },

  // Fetch single product
  fetchProduct: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.getProduct(id);

      if (response.success && response.data) {
        set({
          currentProduct: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          currentProduct: null,
          isLoading: false,
          error: response.error || 'Product not found',
        });
      }
    } catch (error: any) {
      set({
        currentProduct: null,
        isLoading: false,
        error: error.message || 'Failed to fetch product',
      });
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    try {
      const response = await apiClient.getCategories();

      if (response.success && response.data) {
        set({ categories: response.data });
      }
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
    }
  },

  // Fetch brands
  fetchBrands: async () => {
    try {
      const response = await apiClient.getBrands();

      if (response.success && response.data) {
        set({ brands: response.data });
      }
    } catch (error: any) {
      console.error('Failed to fetch brands:', error);
    }
  },

  // Fetch product reviews
  fetchProductReviews: async (productId: string) => {
    try {
      const response = await apiClient.getProductReviews(productId);

      if (response.success && response.data) {
        set({ productReviews: response.data.reviews });
      }
    } catch (error: any) {
      console.error('Failed to fetch product reviews:', error);
    }
  },

  // Search products
  searchProducts: async (query: string) => {
    set({ isSearching: true, searchQuery: query });

    try {
      const searchParams: ProductSearchParams = {
        query,
        page: 1,
        limit: 12,
        sort: { field: 'relevance', direction: 'desc' },
      };

      await get().fetchProducts(searchParams);
    } finally {
      set({ isSearching: false });
    }
  },

  // Set filters
  setFilters: (filters: any) => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, ...filters };
    set({ filters: newFilters });

    // Trigger new search with filters
    const searchParams: ProductSearchParams = {
      query: get().searchQuery || undefined,
      filters: newFilters,
      sort: get().sort,
      page: 1,
    };

    get().fetchProducts(searchParams);
  },

  // Set sort
  setSort: (sort: any) => {
    set({ sort });

    // Trigger new search with sort
    const searchParams: ProductSearchParams = {
      query: get().searchQuery || undefined,
      filters: get().filters,
      sort,
      page: 1,
    };

    get().fetchProducts(searchParams);
  },

  // Clear search
  clearSearch: () => {
    set({
      searchQuery: '',
      filters: {},
      sort: { field: 'createdAt', direction: 'desc' },
    });

    // Fetch all products again
    get().fetchProducts();
  },

  // Set loading state
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Set error
  setError: (error: string | null) => {
    set({ error });
  },

  // Clear current product
  clearCurrentProduct: () => {
    set({ currentProduct: null, productReviews: [] });
  },
}));
