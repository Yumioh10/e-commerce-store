import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WishlistItem } from '../types/user';
import { apiClient } from '@lib/api';
import { storage } from '@lib/utils';
import toast from 'react-hot-toast';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
};
