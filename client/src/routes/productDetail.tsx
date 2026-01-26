import { createFileRoute } from '@tanstack/react-router'
import { mockProducts } from '@/data/mockProducts'
import { ProductCard } from '@/components/ProductCard'
import type { Product, Page } from '@/types'

export const Route = createFileRoute('/productDetail')({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || '',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { id } = Route.useSearch()
  const product = mockProducts.find((p) => p.id === id)

  const handleNavigate = (page: Page) => {
    switch (page) {
      case 'home':
        navigate({ to: '/' })
        break
      case 'products':
        navigate({ to: '/products' })
        break
      case 'product-detail':
        navigate({ to: '/products' }) // Navigate to products instead
        break
      case 'cart':
        navigate({ to: '/cart' })
        break
      case 'checkout':
        navigate({ to: '/Checkout' })
        break
      case 'success':
        navigate({ to: '/success' })
        break
    }
  }

  const handleViewDetails = (product: Product) => {
    navigate({ to: '/productDetail', search: { id: product.id } })
  }

  const handleCartOpen = () => {
    navigate({ to: '/cart' })
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{product.name}</h1>
        <ProductCard
          currentPage="product-detail"
          onNavigate={handleNavigate}
          onCartOpen={handleCartOpen}
          product={product}
          onViewDetails={handleViewDetails}
          products={[]}
        />
      </div>
    </div>
  )
}
