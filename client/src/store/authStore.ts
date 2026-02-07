import { create } from 'zustand';
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
);