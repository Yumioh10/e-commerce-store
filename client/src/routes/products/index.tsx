import { createFileRoute } from '@tanstack/react-router'
import { ProductGrid } from '@/components/ProductGrid'
import { mockProducts } from '@/data/mockProducts'
import { categories } from '@/data/mockCategories'
import { useState } from 'react'
import { SearchBar } from '@/components/SearchBar'

export const Route = createFileRoute('/products/')({
  loader: async () => mockProducts,
   validateSearch: (search: Record<string, unknown>) => ({
    search: (search.search as string) || '',
  }),
  component: ProductsPage,
})

function ProductsPage() {
  const products = Route.useLoaderData()
  const { search: urlSearch } = Route.useSearch()
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 200],
  })

  const filteredProducts = products.filter((product) => {
     // Search filter from URL
    if (urlSearch) {
      const searchTerm = urlSearch.toLowerCase()
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) 
      if (!matchesSearch) return false
    }
    // Category filter
    if (filters.category && product.category !== filters.category) return false
    
    // Price range filter - FIXED: Now correctly filters products
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false
    }
    
    // If all filters pass, include the product
    return true
  })

 return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-medical-text">
        Medical Cosmetics Catalog
      </h1>

      {/* Filters */}
      <div className="bg-medical-white rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Add SearchBar to products page */}
        

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

          <div className="flex items-center space-x-2">
            <input
              type="number"
                            value={filters.priceRange[1]}

              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: [filters.priceRange[0], Number(e.target.value)],
                })
              }
              className="px-3 py-2 border border-medical-gray rounded-lg w-full"
              placeholder="Max price"
            />
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-medical-text-secondary">
        {filteredProducts.length} products found
      </p>

      <ProductGrid products={filteredProducts} />
    </div>
  )
}