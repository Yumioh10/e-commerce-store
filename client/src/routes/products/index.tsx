import { createFileRoute } from '@tanstack/react-router'
import { ProductGrid } from '@/components/ProductGrid'
import { mockProducts } from '@/data/mockProducts'
import { categories } from '@/data/mockCategories'
import { useState } from 'react'

export const Route = createFileRoute('/products/')({
  loader: async () => mockProducts,
  component: ProductsPage,
})

function ProductsPage() {
  const products = Route.useLoaderData()
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 200],
  })

  const filteredProducts = products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false
    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    )
    return true
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-medical-text">
        Medical Cosmetics Catalog
      </h1>

      {/* Filters */}
      <div className="bg-medical-white rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="px-4 py-2 border border-medical-gray rounded-lg focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-medical-text-secondary"></label>
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: [Number(e.target.value), filters.priceRange[1]],
                })
              }
              className="px-3 py-2 border border-medical-gray rounded-lg w-full"
              placeholder="Min price"
            />
          </div>
        </div>
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  )
}
