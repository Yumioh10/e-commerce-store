import { useState, useMemo } from 'react'
import { ProductCard } from './ProductCard'
import type { props } from '@/types'
import { mockProducts } from '@/data/mockProducts'
import { Filter } from 'lucide-react'
import { categories } from '@/data/mockCategories'

export function ProductGrid({ onViewDetails }: props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<
    'featured' | 'price-low' | 'price-high' | 'rating'
  >('featured')

  const filteredProducts = useMemo(() => {
    const productsByCategory =
      selectedCategory === 'all'
        ? mockProducts
        : mockProducts.filter((product) => product.category === selectedCategory)

    switch (sortBy) {
      case 'price-low':
        return [...productsByCategory].sort((a, b) => a.price - b.price)
      case 'price-high':
        return [...productsByCategory].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...productsByCategory].sort((a, b) => b.rating - a.rating)
      default:
        return productsByCategory
    }
  }, [selectedCategory, sortBy])
  /*
  return (
    <section id="shop" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Carefully curated medical-grade cosmetics for every skin type and
            concern
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-teal-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
*/
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
        <p className="text-gray-600">
          Discover our clinically-tested dermatology solutions
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-gray-900 mb-3">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                currentPage={'home'}
                onNavigate={function (): void {
                  throw new Error('Function not implemented.')
                }}
                onCartOpen={function (): void {
                  throw new Error('Function not implemented.')
                }}
                products={[]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
