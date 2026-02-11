import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/index.css';
import { App } from './App';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

/*import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import './styles/index.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { useAuthStore } from './store/authStore';
import type { RouterContext } from './types/router';

// Configure React Query for medical data caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes for product data
      gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
      retry: 1, // Fail fast for medical e-commerce
      refetchOnWindowFocus: false, // Reduce unnecessary API calls
    },
  },
});

// Create TanStack Router instance with typed context
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!, 
  } satisfies RouterContext,
  defaultPreload: 'intent',
});

// Register router for TypeScript type safety across the app
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Initialize authentification in router context
const auth = useAuthStore.getState();
(router.options.context as RouterContext).auth = auth;

// Sync auth state changes to router context
useAuthStore.subscribe((state) => {
  (router.options.context as RouterContext).auth = state;
});

// Mount application with error boundary for production
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);*/