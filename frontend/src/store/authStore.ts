import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, User, LoginData, RegisterData } from '../types/auth';
import { apiClient } from '@lib/api';
import { storage } from '@lib/utils';
import toast from 'react-hot-toast';

interface AuthStore extends AuthState {
  // Actions
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  initializeAuth: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.login(data);

          if (response.success && response.data) {
            const { user, token, refreshToken } = response.data;

            // Store tokens
            storage.set('auth_token', token);
            storage.set('refresh_token', refreshToken);

            // Update store state
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            toast.success(`Welcome back, ${user.firstName}!`);
            return true;
          } else {
            const errorMessage = response.error || 'Login failed';
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: errorMessage,
            });
            toast.error(errorMessage);
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.message || 'Login failed';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          toast.error(errorMessage);
          return false;
        }
      },

      // Register action
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.register(data);

          if (response.success && response.data) {
            const { user, token, refreshToken } = response.data;

            // Store tokens
            storage.set('auth_token', token);
            storage.set('refresh_token', refreshToken);

            // Update store state
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            toast.success(`Welcome to Cosmetic Store, ${user.firstName}!`);
            return true;
          } else {
            const errorMessage = response.error || 'Registration failed';
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: errorMessage,
            });
            toast.error(errorMessage);
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.message || 'Registration failed';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          toast.error(errorMessage);
          return false;
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });

        try {
          await apiClient.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear tokens from storage
          storage.remove('auth_token');
          storage.remove('refresh_token');

          // Reset store state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          toast.success('Logged out successfully');
        }
      },

      // Refresh token action
      refreshToken: async () => {
        try {
          const response = await apiClient.refreshToken();

          if (response.success && response.data) {
            const { token } = response.data;
            storage.set('auth_token', token);
            return true;
          }

          // Token refresh failed, logout user
          await get().logout();
          return false;
        } catch (error) {
          console.error('Token refresh error:', error);
          await get().logout();
          return false;
        }
      },

      // Update user action
      updateUser: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });

        try {
          // For now, just update local state
          // In a real app, you'd call an API endpoint
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = { ...currentUser, ...userData, updatedAt: new Date().toISOString() };
            set({
              user: updatedUser,
              isLoading: false,
              error: null,
            });

            toast.success('Profile updated successfully');
            return true;
          }
          return false;
        } catch (error: any) {
          const errorMessage = error.message || 'Profile update failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          toast.error(errorMessage);
          return false;
        }
      },

      // Initialize auth from storage
      initializeAuth: () => {
        const token = storage.get('auth_token');

        if (token) {
          set({ isAuthenticated: true });

          // In a real app, you might want to validate the token
          // and fetch fresh user data here
        } else {
          set({
            user: null,
            isAuthenticated: false,
            error: null
          });
        }
      },

      // Clear error action
      clearError: () => {
        set({ error: null });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => ({
        getItem: (name) => storage.get(name),
        setItem: (name, value) => storage.set(name, value),
        removeItem: (name) => storage.remove(name),
      })),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

