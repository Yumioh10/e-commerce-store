import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type {
  ApiResponse,
  PaginationParams,
  SearchParams,
  ProductSearchParams,
  ProductResponse,
  LoginData,
  RegisterData,
  AuthResponse,
  AddToCartData,
  UpdateCartItemData,
  CreateOrderData
} from '../types/index';
import {
  mockProducts,
  mockCategories,
  mockBrands,
  mockReviews,
  mockUser,
  mockOrders
} from './mockData';


// Environment configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const ENABLE_MOCK_DATA = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

class ApiClient {
  private frontend: AxiosInstance;
  private enableMockData: boolean;

  constructor() {
    this.enableMockData = ENABLE_MOCK_DATA;

    this.frontend = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.frontend.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.frontend.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    params?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.frontend.request({
        method,
        url: endpoint,
        data,
        params,
      });

      return {
        success: true,
        data: response.data,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'An error occurred',
      };
    }
  }

  // Authentication endpoints
  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    if (this.enableMockData) {
      // Mock login logic
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (data.email === 'sarah.johnson@example.com' && data.password === 'password123') {
        return {
          success: true,
          data: {
            user: mockUser,
            token: 'mock_jwt_token_12345',
            refreshToken: 'mock_refresh_token_67890',
            expiresIn: 3600,
          },
        };
      }

      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    return this.request<AuthResponse>('POST', '/auth/login', data);
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock registration logic
      const newUser = {
        ...mockUser,
        id: `user_${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      return {
        success: true,
        data: {
          user: newUser,
          token: 'mock_jwt_token_new_user',
          refreshToken: 'mock_refresh_token_new_user',
          expiresIn: 3600,
        },
      };
    }

    return this.request<AuthResponse>('POST', '/auth/register', data);
  }

  async logout(): Promise<ApiResponse<void>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }

    return this.request<void>('POST', '/auth/logout');
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: { token: 'mock_refreshed_jwt_token' },
      };
    }

    return this.request<{ token: string }>('POST', '/auth/refresh');
  }

  // Product endpoints
  async getProducts(params?: ProductSearchParams): Promise<ApiResponse<ProductResponse>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 800));

      let filteredProducts = [...mockProducts];

      // Apply search filters
      if (params?.query) {
        const query = params.query.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      if (params?.category) {
        filteredProducts = filteredProducts.filter(product =>
          product.category === params.category
        );
      }

      if (params?.subcategory) {
        filteredProducts = filteredProducts.filter(product =>
          product.subcategory === params.subcategory
        );
      }

      if (params?.brand) {
        filteredProducts = filteredProducts.filter(product =>
          product.brand === params.brand
        );
      }

      if (params?.filters?.priceRange) {
        filteredProducts = filteredProducts.filter(product => {
          const price = product.salePrice || product.price;
          return price >= params.filters!.priceRange.min &&
                 price <= params.filters!.priceRange.max;
        });
      }

      if (params?.filters?.rating) {
        filteredProducts = filteredProducts.filter(product =>
          product.rating >= params.filters!.rating
        );
      }

      if (params?.filters?.inStock) {
        filteredProducts = filteredProducts.filter(product => product.inStock);
      }

      // Apply sorting
      if (params?.sort) {
        filteredProducts.sort((a, b) => {
          const { field, direction } = params.sort!;
          let aValue: any, bValue: any;

          switch (field) {
            case 'price':
              aValue = a.salePrice || a.price;
              bValue = b.salePrice || b.price;
              break;
            case 'rating':
              aValue = a.rating;
              bValue = b.rating;
              break;
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'reviewCount':
              aValue = a.reviewCount;
              bValue = b.reviewCount;
              break;
            case 'createdAt':
              aValue = new Date(a.createdAt).getTime();
              bValue = new Date(b.createdAt).getTime();
              break;
            default:
              return 0;
          }

          if (direction === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }

      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          products: paginatedProducts,
          totalCount: filteredProducts.length,
          currentPage: page,
          totalPages: Math.ceil(filteredProducts.length / limit),
          hasNextPage: endIndex < filteredProducts.length,
          hasPreviousPage: page > 1,
        },
      };
    }

    return this.request<ProductResponse>('GET', '/products', undefined, params);
  }

  async getProduct(id: string): Promise<ApiResponse<any>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));

      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        return {
          success: false,
          error: 'Product not found',
        };
      }

      return {
        success: true,
        data: product,
      };
    }

    return this.request<any>(`GET`, `/products/${id}`);
  }

  async getCategories(): Promise<ApiResponse<any[]>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        success: true,
        data: mockCategories,
      };
    }

    return this.request<any[]>('GET', '/categories');
  }

  async getBrands(): Promise<ApiResponse<any[]>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        success: true,
        data: mockBrands,
      };
    }

    return this.request<any[]>('GET', '/brands');
  }

  async getProductReviews(productId: string, params?: PaginationParams): Promise<ApiResponse<any>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 600));

      const reviews = mockReviews.filter(review => review.productId === productId);

      return {
        success: true,
        data: {
          reviews,
          totalCount: reviews.length,
          averageRating: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
        },
      };
    }

    return this.request<any>('GET', `/products/${productId}/reviews`, undefined, params);
  }

  // Cart endpoints
  async getCart(): Promise<ApiResponse<any>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return empty cart for now
      return {
        success: true,
        data: {
          id: 'cart-1',
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 0,
        },
      };
    }

    return this.request<any>('GET', '/cart');
  }

  async addToCart(data: AddToCartData): Promise<ApiResponse<any>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        success: true,
        data: { message: 'Item added to cart successfully' },
      };
    }

    return this.request<any>('POST', '/cart/items', data);
  }

  async updateCartItem(itemId: string, data: UpdateCartItemData): Promise<ApiResponse<any>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: { message: 'Cart item updated successfully' },
      };
    }

    return this.request<any>('PUT', `/cart/items/${itemId}`, data);
  }

  async removeFromCart(itemId: string): Promise<ApiResponse<any>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: { message: 'Item removed from cart successfully' },
      };
    }

    return this.request<any>('DELETE', `/cart/items/${itemId}`);
  }

  async clearCart(): Promise<ApiResponse<any>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: { message: 'Cart cleared successfully' },
      };
    }

    return this.request<any>('DELETE', '/cart');
  }

  // Order endpoints
  async getOrders(params?: SearchParams): Promise<ApiResponse<any>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        success: true,
        data: {
          orders: mockOrders,
          totalCount: mockOrders.length,
        },
      };
    }

    return this.request<any>('GET', '/orders', undefined, params);
  }

  async getOrder(id: string): Promise<ApiResponse<any>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));

      const order = mockOrders.find(o => o.id === id);
      if (!order) {
        return {
          success: false,
          error: 'Order not found',
        };
      }

      return {
        success: true,
        data: order,
      };
    }

    return this.request<any>('GET', `/orders/${id}`);
  }

  async createOrder(data: CreateOrderData): Promise<ApiResponse<any>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newOrder = {
        id: `order_${Date.now()}`,
        orderNumber: `ORD-2024-${Math.floor(Math.random() * 1000)}`,
        ...data,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: newOrder,
      };
    }

    return this.request<any>('POST', '/orders', data);
  }

  // Wishlist endpoints
  async getWishlist(): Promise<ApiResponse<any>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: { items: [] },
      };
    }

    return this.request<any>('GET', '/wishlist');
  }

  async addToWishlist(productId: string): Promise<ApiResponse<any>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        success: true,
        data: { message: 'Item added to wishlist successfully' },
      };
    }

    return this.request<any>('POST', '/wishlist', { productId });
  }

  async removeFromWishlist(itemId: string): Promise<ApiResponse<any>> {
    if (this.enableMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: { message: 'Item removed from wishlist successfully' },
      };
    }

    return this.request<any>('DELETE', `/wishlist/${itemId}`);
  }
}

// Create and export the API frontend instance
export const apiClient = new ApiClient();
export default apiClient;

