import { createRootRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { CartProvider } from "../context/CartContext";
import { Header } from "../components/Header";
import type { Page } from "../types";

// Root route definition
export const Route = createRootRoute({
  component: () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getCurrentPage = (): Page => {
      switch (location.pathname) {
        case '/':
          return 'home';
        case '/products':
          return 'products';
        case '/productDetail':
          return 'product-detail';
        case '/cart':
          return 'cart';
        case '/Checkout':
          return 'checkout';
        case '/success':
          return 'success';
        default:
          return 'home';
      }
    };

    const handleNavigate = (page: Page) => {
      switch (page) {
        case 'home':
          navigate({ to: '/' });
          break;
        case 'products':
          navigate({ to: '/products' });
          break;
        case 'product-detail':
          navigate({ to: '/products' }); // Navigate to products instead
          break;
        case 'cart':
          navigate({ to: '/cart' });
          break;
        case 'checkout':
          navigate({ to: '/Checkout' });
          break;
        case 'success':
          navigate({ to: '/success' });
          break;
      }
    };

    const handleCartOpen = () => {
      navigate({ to: '/cart' });
    };

    return (
      <CartProvider>
        <Header
          currentPage={getCurrentPage()}
          onNavigate={handleNavigate}
          onCartOpen={handleCartOpen}
          product={{} as any} // Placeholder, not used in Header
          onViewDetails={() => {}} // Placeholder
          products={[]} // Placeholder
        />
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
      </CartProvider>
    );
  },
});