import { createFileRoute } from '@tanstack/react-router'
import { ProductGrid } from '@/components/ProductGrid'
import type { Product, Page } from '@/types'

export const Route = createFileRoute('/products')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()

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
    navigate({ to: '/productDetail', search: { id: product.id } })
  }

  const handleCartOpen = () => {
    navigate({ to: '/cart' });
  };

  return (
    <ProductGrid
      currentPage="products"
      onNavigate={handleNavigate}
      onCartOpen={handleCartOpen}
      product={{} as Product}
      onViewDetails={handleViewDetails}
      products={[]}
    />
  )
}