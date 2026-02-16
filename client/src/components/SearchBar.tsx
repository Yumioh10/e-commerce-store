// components/SearchBar.tsx
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

interface SearchBarProps {
  initialValue?: string
  onSearch?: (query: string) => void
  placeholder?: string
  variant?: 'default' | 'compact' | 'full'
  className?: string
  autoSubmit?: boolean // If true, submits as you type
  navigateTo?: string // Route to navigate to on search
  clearOnEmpty?: boolean // New prop
}

export const SearchBar = ({ 
  initialValue = '', 
  onSearch,
  placeholder = 'Rechercher un produit ...',
  variant = 'default',
  className = '',
  autoSubmit = false,
  navigateTo = '/products',
  clearOnEmpty = true
}: SearchBarProps) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)

  const widthClasses = {
    default: 'w-full',
    compact: isFocused ? 'w-72' : 'w-56',
    full: 'w-full',
  }

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query)
    }
    
    // Add navigation logic here
    if (navigateTo) {
      if (query.trim()) {
        navigate({
          to: navigateTo,
          search: { search: query }
        })
      } else if (clearOnEmpty) {
        navigate({
          to: navigateTo,
          search: {}
        })
      }
    }
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


  return (
    <form onSubmit={handleSubmit} className={`${widthClasses[variant]} ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-text-secondary w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-medical-gray focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-300"
        />
      
      </div>
    </form>
  )
}