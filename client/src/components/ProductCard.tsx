import { ShoppingCart, Star } from 'lucide-react'
import type { props } from '@/types'
import { useCart } from '@/hooks/useCart'

export function ProductCard({ product, onViewDetails }: props) {
  const { addToCart } = useCart()

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="text-2xl font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            onClick={() => onViewDetails(product)}
            className="flex items-center gap-2 bg-gray-200 text-teal-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105"
          >
            Details
          </button>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}