import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MiniCart } from '@/components/MiniCart';

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <main className="min-h-screen bg-medical-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
      <MiniCart />
      <TanStackRouterDevtools />
    </>
  ),
});