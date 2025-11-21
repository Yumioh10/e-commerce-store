// Root Layout
import { createRootRoute, createRoute, createRouter, Outlet, redirect, useParams, Link, useRouterState } from '@tanstack/react-router';
import { NotFoundPage } from './pages/NotFoundPage';
import { RootLayout } from './components/layouts/RootLayout';

// Loading component
const RouteLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Root Layout
const RootComponent = () => {
  return <RootLayout />;
};
const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});


// Index route (Home)
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { WishlistPage } from './pages/WishlistPage';


const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

export default routeTree;



