import { useState } from 'react'
import { ShoppingCart, Search, Menu, X, Heart } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import type { props } from '../types'

export function Header({ onNavigate, currentPage }: props) {
  const { getTotalItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-2xl font-bold text-teal-600 hover:text-teal-700"
            >
              MaparaSanté
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium ${
                currentPage === 'home'
                  ? 'text-teal-600'
                  : 'text-gray-700 hover:text-teal-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('products')}
              className={`text-sm font-medium ${
                currentPage === 'products'
                  ? 'text-teal-600'
                  : 'text-gray-700 hover:text-teal-600'
              }`}
            >
              Products
            </button>
          </nav>

          <div className="flex space-x-4">
            <button className="p-2 text-gray-600 hover:text-teal-600">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-teal-600">
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="p-2 text-gray-600 hover:text-teal-600 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <button
              onClick={() => {
                onNavigate('home')
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('products')
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Products
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
