import { RouterProvider } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';
import { router } from './router';
import { useAuthStore } from '@store/authStore';
import { useEffect } from 'react';

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication on app start
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="App">
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          },
          success: {
            iconTheme: {
              primary: 'hsl(318, 100%, 57%)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'hsl(0, 84%, 60%)',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
