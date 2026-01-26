import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product, Page } from "@/types";

export const Route = createFileRoute("/")({
  component: () => <HomePage />,
});

function HomePage() {
  const navigate = Route.useNavigate();

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

  const handleViewDetails = (product: Product) => {
    navigate({ to: '/productDetail', search: { id: product.id } });
  };

  const handleCartOpen = () => {
    navigate({ to: '/cart' });
  };

  return (
    <div>
      <Hero
        currentPage="home"
        onNavigate={handleNavigate}
        onCartOpen={handleCartOpen}
        product={{} as Product}
        onViewDetails={handleViewDetails}
        products={[]}
      />
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <ProductGrid
          currentPage="home"
          onNavigate={handleNavigate}
          onCartOpen={handleCartOpen}
          product={{} as Product}
          onViewDetails={handleViewDetails}
          products={[]}
        />
      </main>
    </div>
  );
}
