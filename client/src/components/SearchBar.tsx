import { Search, X, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { categories } from '@/data/mockCategories'

interface SearchBarProps {
  initialValue?: string
  onSearch?: (query: string, category?: string) => void
  placeholder?: string
  variant?: 'default' | 'compact' | 'hero' | 'minimal'
  className?: string
  autoSubmit?: boolean // If true, submits as you type
  navigateTo?: string // Route to navigate to on search
  clearOnEmpty?: boolean // New prop
  showCategories?: boolean
}

export const SearchBar = ({
  initialValue = '',
  onSearch,
  placeholder = 'Rechercher un produit ...',
  variant = 'default',
  className = '',
  autoSubmit = false,
  navigateTo = '/products',
  clearOnEmpty = true,
  showCategories = true,
}: SearchBarProps) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const [selecteCategory, setSelecteCategory] = useState<string>('')
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('mapara-recent-searches')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed.slice(0, 5)
        }
      } catch {
        return []
      }
    }
    return []
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Save recent search
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return
    const update = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      5,
    )
    setRecentSearches(update)
    localStorage.setItem('mapara-recent-searches', JSON.stringify(update))
  }

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false)
        setIsCategoryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = (query: string, category?: string) => {
    saveRecentSearch(query)

    if (onSearch) {
      onSearch(query, category || selecteCategory)
    }
    if (navigateTo) {
      const searchParams: Record<string, string> = {}
      if (query.trim()) searchParams.search = query
      if (category || selecteCategory)
        searchParams.category = category || selecteCategory

      navigate({
        to: navigateTo,
        search: Object.keys(searchParams).length > 0 ? searchParams : undefined,
      })
    }

    setIsFocused(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (autoSubmit) {
      handleSearch(value)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    inputRef.current?.focus()
    if (clearOnEmpty) {
      navigate({ to: navigateTo, search: {} })
    }
  }

  const selectCategory = (categoryId: string) => {
    setSelecteCategory(categoryId)
    setIsCategoryOpen(false)
    // optional: auto-search when category selected
    if (searchQuery) {
      handleSearch(searchQuery, categoryId)
    }
  }

  const clearCategory = () => {
    setSelecteCategory('')
    setIsCategoryOpen(false)
  }

  // variant styles
  const variantStyles = {
    default: {
      container: 'w-full max-w-2xl',
      input: 'h-12 text-base',
      dropdown: 'top-14',
      icon: 'w-5 h-5',
    },
    compact: {
      container: isFocused ? 'w-80' : 'w-64',
      input: 'h-10 text-sm',
      dropdown: 'top-12',
      icon: 'w-4 h-4',
    },
    hero: {
      container: 'w-full max-w-3xl',
      input: 'h-14 text-lg shadow-xl',
      dropdown: 'top-16',
      icon: 'w-6 h-6',
    },
    minimal: {
      container: 'w-full max-w-md',
      input:
        'h-10 text-sm bg-transparent border-0 border-b-2 border-medical-gray focus:border-brand-primary rounded-none px-0',
      dropdown: 'top-12',
      icon: 'w-4 h-4',
    },
  }
  const styles = variantStyles[variant]

  return (
    <div
      ref={containerRef}
      className={`relative ${styles.container} ${className}`}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="relative"
        initial={false}
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Main Input Container */}
        <div
          className={`
          relative flex items-center bg-medical-white rounded-2xl 
          border-2 transition-all duration-300 overflow-hidden
          ${
            isFocused
              ? 'border-brand-primary shadow-lg shadow-brand-primary/20'
              : 'border-medical-gray hover:border-brand-primary/50'
          }
          ${variant === 'minimal' ? 'border-0 border-b-2 rounded-none shadow-none' : ''}
        `}
        >
          {/* Category Selector */}
          {showCategories && variant !== 'minimal' && (
            <div className="relative border-r border-medical-gray">
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`
                  flex items-center space-x-2 px-4 py-2 text-sm font-medium
                  text-medical-text-secondary hover:text-brand-primary
                  transition-colors bg-medical-gray/30 hover:bg-medical-gray/50
                  ${selecteCategory ? 'text-brand-primary bg-brand-primary/10' : ''}
                `}
              >
                <span className="hidden sm:inline">
                  {selecteCategory
                    ? categories.find((c) => c.id === selecteCategory)?.name
                    : 'Catégories'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Category Dropdown */}
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-medical-white rounded-xl shadow-xl border border-medical-gray overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <button
                        type="button"
                        onClick={clearCategory}
                        className={`
                          w-full text-left px-4 py-3 rounded-lg text-sm transition-colors
                          ${!selecteCategory ? 'bg-brand-primary text-white' : 'hover:bg-medical-gray'}
                        `}
                      >
                        Catégories
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => selectCategory(category.id)}
                          className={`
                            w-full text-left px-4 py-3 rounded-lg text-sm transition-colors
                            ${
                              selecteCategory === category.id
                                ? 'bg-brand-primary text-white'
                                : 'hover:bg-medical-gray text-medical-text'
                            }
                          `}
                        >
                          <div className="font-medium">{category.name}</div>
                          <div className="text-xs opacity-70">
                            {category.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              className={`
              absolute left-4 top-1/2 transform -translate-y-1/2 
              text-medical-text-secondary transition-colors
              ${isFocused ? 'text-brand-primary' : ''}
              ${styles.icon}
            `}
            />

            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              placeholder={placeholder}
              className={`
                w-full bg-transparent outline-none text-medical-text placeholder-medical-text-secondary
                ${variant === 'minimal' ? 'pl-10 pr-8' : 'pl-12 pr-12'}
                ${styles.input}
              `}
            />

            {/* Clear Button */}
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-medical-gray text-medical-text-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button (Hero variant only) */}
          {variant === 'hero' && (
            <button
              type="submit"
              className="px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-medium transition-colors"
            >
              Search
            </button>
          )}
        </div>

        {/* Recent Searches Dropdown */}
        <AnimatePresence>
          {isFocused && recentSearches.length > 0 && !searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute ${styles.dropdown} left-0 right-0 bg-medical-white rounded-xl shadow-xl border border-medical-gray overflow-hidden z-40`}
            >
              <div className="p-3">
                <div className="text-xs font-medium text-medical-text-secondary uppercase tracking-wider mb-2 px-3">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSearchQuery(search)
                      handleSearch(search)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-medical-text hover:bg-medical-gray transition-colors flex items-center space-x-3"
                  >
                    <Search className="w-4 h-4 text-medical-text-secondary" />
                    <span>{search}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setRecentSearches([])
                    localStorage.removeItem('mapara-recent-searches')
                  }}
                  className="w-full text-center py-2 text-xs text-brand-coral hover:text-red-600 transition-colors mt-2"
                >
                  Clear History
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Suggestions (when typing) */}
        <AnimatePresence>
          {isFocused && searchQuery.length > 2 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute ${styles.dropdown} left-0 right-0 bg-medical-white rounded-xl shadow-xl border border-medical-gray overflow-hidden z-40`}
            >
              <div className="p-4 text-center text-sm text-medical-text-secondary">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span>Press Enter to search for "{searchQuery}"</span>
                </div>
                {selecteCategory && (
                  <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full">
                    in {categories.find((c) => c.id === selecteCategory)?.name}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Quick Category Pills (Hero variant) */}
      {variant === 'hero' && (
        <motion.div
          className="flex flex-wrap gap-2 mt-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-sm text-medical-text-secondary">Popular:</span>
          {categories.slice(0, 3).map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => selectCategory(category.id)}
              className="text-sm px-3 py-1 rounded-full bg-medical-gray/50 hover:bg-brand-primary/10 text-medical-text hover:text-brand-primary transition-colors"
            >
              {category.name}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
