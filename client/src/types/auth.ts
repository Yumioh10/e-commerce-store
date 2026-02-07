import { z } from 'zod';

export const UserId = z.string().brand<'UserId'>();
export type UserId = z.infer<typeof UserId>;

export interface User {
  id: UserId;
  email: string;
  firstName: string;
  lastName: string;
  medicalLicense?: string; // For healthcare professionals
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  medicalLicense?: string;
}