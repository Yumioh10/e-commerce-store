import { useEffect } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';
import { router } from './router';

export function App() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    }
  }, [loadUser]);

  return <RouterProvider router={router} />;
}
