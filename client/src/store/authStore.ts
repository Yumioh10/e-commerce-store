import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { User, AuthState, RegisterData } from '@/types/auth';

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const { data } = await api.post<AuthResponse>('/auth/login', {
          email,
          password
        });
        
        localStorage.setItem('token', data.token);
        set({ user: data.user, isAuthenticated: true });
      },

      register: async (userData: RegisterData) => {
        const { data } = await api.post<AuthResponse>('/auth/register', {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          medicalLicense: userData.medicalLicense
        });
        
        localStorage.setItem('token', data.token);
        set({ user: data.user, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },

      // Load user on app init
      loadUser: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user, isAuthenticated: true });
        } catch {
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false });
        }
      }
    }),
    {
      name: 'mapara-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);
/*import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User, RegisterData, UserId } from '@/types/auth';

// Mock medical users database
const mockUsers: User[] = [
  {
    id: 'user_001' as UserId,
    email: 'doctor@clinic.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    medicalLicense: 'FR-12345',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call with medical-grade security delays
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const user = mockUsers.find(u => u.email === email);
        if (user && password === 'securemedical123') { // Mock password validation
          set({ user, isAuthenticated: true });
        } else {
          throw new Error('Invalid credentials or medical license not verified');
        }
      },

      register: async (userData: RegisterData) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In production, verify medical license against professional registry
        const newUser: User = {
          id: `user_${Date.now()}` as UserId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          medicalLicense: userData.medicalLicense,
        };
        
        mockUsers.push(newUser);
        set({ user: newUser, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'mapara-auth',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);*/