import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartState, CartItem, AddToCartData, UpdateCartItemData, Coupon } from '../types/cart';
import { apiClient } from '@lib/api';
import { storage } from '@lib/utils';
import toast from 'react-hot-toast';

interface CartStore extends CartState {
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (data: AddToCartData) => Promise<boolean>;
  updateCartItem: (itemId: string, data: UpdateCartItemData) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  recalculateTotals: () => void;
  setLoading: (loading: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      coupon: undefined,
      isLoading: false,
      error: null,

      // Fetch cart from server
      fetchCart: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.getCart();

          if (response.success && response.data) {
            const cart = response.data;
            set({
              items: cart.items || [],
              subtotal: cart.subtotal || 0,
              tax: cart.tax || 0,
              shipping: cart.shipping || 0,
              discount: cart.discount || 0,
              total: cart.total || 0,
              coupon: cart.coupon,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              items: [],
              subtotal: 0,
              tax: 0,
              shipping: 0,
              discount: 0,
              total: 0,
              coupon: undefined,
              isLoading: false,
              error: response.error || 'Failed to fetch cart',
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch cart',
          });
        }
      },

      // Add item to cart
      addToCart: async (data: AddToCartData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.addToCart(data);

          if (response.success) {
            // For now, we'll update the cart locally
            // In a real app, you'd fetch the updated cart from the server
            const { items } = get();

            // Check if item already exists
            const existingItemIndex = items.findIndex(item =>
              item.product.id === data.productId &&
              item.selectedVariant?.id === data.variantId
            );

            let updatedItems: CartItem[];

            if (existingItemIndex >= 0) {
              // Update existing item quantity
              updatedItems = items.map((item, index) =>
                index === existingItemIndex
                  ? { ...item, quantity: item.quantity + data.quantity }
                  : item
              );
              toast.success('Cart updated successfully');
            } else {
              // Add new item (for demo, we'll create a mock cart item)
              const mockCartItem: CartItem = {
                id: `cart_item_${Date.now()}`,
                product: {
                  id: data.productId,
                  name: 'Product Name', // This would come from the API
                  description: 'Product description',
                  price: 50.00,
                  images: [{ id: '1', url: '/placeholder.jpg', alt: 'Product', isPrimary: true, order: 1 }],
                  category: 'makeup',
                  subcategory: 'lips',
                  brand: 'Brand',
                  rating: 4.5,
                  reviewCount: 100,
                  inStock: true,
                  stockQuantity: 50,
                  features: [],
                  ingredients: [],
                  howToUse: '',
                  weight: 10,
                  dimensions: { length: 1, width: 1, height: 1 },
                  tags: [],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                quantity: data.quantity,
                selectedVariant: data.variantId ? {
                  id: data.variantId,
                  name: 'Variant',
                  type: 'color',
                  value: 'red',
                  price: 50.00,
                } : undefined,
                addedAt: new Date().toISOString(),
              };
              updatedItems = [...items, mockCartItem];
              toast.success('Item added to cart');
            }

            set({ items: updatedItems });
            get().recalculateTotals();
            set({ isLoading: false });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.error || 'Failed to add item to cart',
            });
            toast.error(response.error || 'Failed to add item to cart');
            return false;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to add item to cart',
          });
          toast.error(error.message || 'Failed to add item to cart');
          return false;
        }
      },

      // Update cart item quantity
      updateCartItem: async (itemId: string, data: UpdateCartItemData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.updateCartItem(itemId, data);

          if (response.success) {
            const { items } = get();
            const updatedItems = items.map(item =>
              item.id === itemId
                ? { ...item, quantity: data.quantity }
                : item
            );

            set({ items: updatedItems });
            get().recalculateTotals();
            set({ isLoading: false });
            toast.success('Cart updated');
            return true;
          } else {
            set({
              isLoading: false,
              error: response.error || 'Failed to update cart item',
            });
            toast.error(response.error || 'Failed to update cart item');
            return false;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to update cart item',
          });
          toast.error(error.message || 'Failed to update cart item');
          return false;
        }
      },

      // Remove item from cart
      removeFromCart: async (itemId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.removeFromCart(itemId);

          if (response.success) {
            const { items } = get();
            const updatedItems = items.filter(item => item.id !== itemId);

            set({ items: updatedItems });
            get().recalculateTotals();
            set({ isLoading: false });
            toast.success('Item removed from cart');
          } else {
            set({
              isLoading: false,
              error: response.error || 'Failed to remove item from cart',
            });
            toast.error(response.error || 'Failed to remove item from cart');
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to remove item from cart',
          });
          toast.error(error.message || 'Failed to remove item from cart');
        }
      },

      // Clear entire cart
      clearCart: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.clearCart();

          if (response.success) {
            set({
              items: [],
              subtotal: 0,
              tax: 0,
              shipping: 0,
              discount: 0,
              total: 0,
              coupon: undefined,
              isLoading: false,
              error: null,
            });
            toast.success('Cart cleared');
          } else {
            set({
              isLoading: false,
              error: response.error || 'Failed to clear cart',
            });
            toast.error(response.error || 'Failed to clear cart');
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to clear cart',
          });
          toast.error(error.message || 'Failed to clear cart');
        }
      },

      // Apply coupon code
      applyCoupon: async (code: string) => {
        set({ isLoading: true, error: null });

        try {
          // For demo purposes, we'll create a mock coupon
          const mockCoupon: Coupon = {
            id: 'mock-coupon',
            code: code.toUpperCase(),
            type: 'percentage',
            value: 10,
            isActive: true,
            usageCount: 0,
          };

          set({ coupon: mockCoupon });
          get().recalculateTotals();
          set({ isLoading: false });
          toast.success('Coupon applied successfully');
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to apply coupon',
          });
          toast.error(error.message || 'Failed to apply coupon');
          return false;
        }
      },

      // Remove coupon
      removeCoupon: () => {
        set({ coupon: undefined });
        get().recalculateTotals();
        toast.success('Coupon removed');
      },

      // Recalculate cart totals
      recalculateTotals: () => {
        const { items, coupon } = get();

        // Calculate subtotal
        const subtotal = items.reduce((total, item) => {
          const itemPrice = item.selectedVariant?.salePrice ||
                           item.selectedVariant?.price ||
                           item.product.salePrice ||
                           item.product.price;
          return total + (itemPrice * item.quantity);
        }, 0);

        // Calculate shipping (free shipping over $50)
        const shipping = subtotal >= 50 ? 0 : 5.99;

        // Calculate tax (8% of subtotal)
        const tax = subtotal * 0.08;

        // Calculate discount
        let discount = 0;
        if (coupon) {
          if (coupon.type === 'percentage') {
            discount = subtotal * (coupon.value / 100);
          } else if (coupon.type === 'fixed') {
            discount = Math.min(coupon.value, subtotal);
          }
        }

        // Calculate total
        const total = subtotal + tax + shipping - discount;

        set({
          subtotal: Math.round(subtotal * 100) / 100,
          tax: Math.round(tax * 100) / 100,
          shipping: Math.round(shipping * 100) / 100,
          discount: Math.round(discount * 100) / 100,
          total: Math.round(total * 100) / 100,
        });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => ({
        getItem: (name) => storage.get(name),
        setItem: (name, value) => storage.set(name, value),
        removeItem: (name) => storage.remove(name),
      })),
    }
  )
);

