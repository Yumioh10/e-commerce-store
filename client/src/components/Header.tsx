
import { Link } from '@tanstack/react-router'
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { motion, AnimatePresence } from 'motion/react'
import Logo from '@/assets/mapara-logo.svg'
import { useState } from 'react'
import { categories } from '@/data/mockCategories'
import { useAuthStore } from '@/store/authStore'
import { SearchBar } from '@/components/SearchBar' // Import the new component

export const Header = () => {
  const { itemCount } = useCartStore()
  const { user, logout } = useAuthStore()
  const { isAuthenticated } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-50 bg-medical-white/95 backdrop-blur-sm border-b border-medical-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20
        ">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={Logo} alt="MaparaSanté" className="w-12 h-12" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-coral to-brand-dark bg-clip-text text-transparent">
              MaparaSanté
            </h1>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block ml-auto  -1/2 transform -translate-x-1/2">
            <SearchBar 
              initialValue={searchQuery}
              onSearch={setSearchQuery}
              variant="compact"
              navigateTo="/products"
            />
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center justify-end space-x-6">
            {/* Cart Icon */}
            <Link to='/cart' className='relative flex items-center text-medical-text hover:text-brand-primary transition-color'>
              <ShoppingCart className='w-6 h-6' />
              {itemCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute -top-2 -right-2 bg-brand-coral text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'
                >
                  {itemCount()}
                </motion.span>
              )}
            </Link>

            {/* Account / Login */}
            {isAuthenticated ? (
              <>
                <Link to="/account" className='hidden md:flex items-center space-x-2 text-medical-text hover:text-brand-dark group'>
                  <User className='w-6 h-6'/>
                  <span className='text-sm font-medium hidden lg:inline'>{user?.firstName}</span>
                </Link>
                <button
                  onClick={logout}
                  className="hidden md:flex items-center text-medical-text hover:text-brand-dark transition-colors"
                  aria-label='Déconnexion'
                >
                  <LogOut className='w-6 h-6' />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                search={{}}
                className='hidden md:flex bg-brand-primary hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
              >
                Connexion
              </Link>
            )}

            {/* Menu Toggle Button */}
            <button
              className='p-2 hover:bg-medical-gray rounded-full transition-colors'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label='Toggle navigation menu'
            >
              {isMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='border-t border-medical-gray bg-medical-white overflow-hidden'
          >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
              <div>
                <h2 className='text-lg font-semibold text-medical-text mb-4'>Catégories</h2>
                <nav className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to="/categories/$categoryId"
                      params={{ categoryId: category.id }}
                      className='py-3 px-4 text-medical-text hover:bg-medical-gray rounded-lg transition-colors font-medium text-left'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
              </div>
              
              {/* Mobile Search */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-medical-text-secondary w-5 h-5">
                <SearchBar 
                  placeholder="Rechercher des produits médicaux..."
                  navigateTo="/products"
                  variant="full"
                  onSearch={(query) => {
                    setSearchQuery(query)
                    setIsMenuOpen(false)
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner Bar */}
      <BannerBar />
    </header>
  )
}

const BannerBar = () => (
  <div className="bg-brand-primary/10 border-t border-medical-gray py-2">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center space-x-8 text-sm text-medical-text-secondary font-semibold">
        <span className="flex items-center space-x-2">
          <span>Profitez d'une livraison gratuite vers toutes les ville du Maroc dès 599 Dh d’achats.</span>
        </span>
      </div>
    </div>
  </div>
)