import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'
import { User, Package, Heart, Settings, LogOut } from 'lucide-react'
import { motion } from 'motion/react'

export const Route = createFileRoute('/account/')({
  beforeLoad: (opts) => {
    const context = opts.context as { auth: { isAuthenticated: boolean } }
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/account',
        },
      })
    }
  },
  component: AccountPage,
})

function AccountPage() {
  const { user, logout } = useAuthStore()
  const menuItems = [
    { icon: <User />, label: 'Compte', href: '/account/profile' },
    { icon: <Package />, label: 'Commandes', href: '/account/orders' },
    { icon: <Heart />, label: "liste d'envie", href: '/account/wishlist' },
    { icon: <Settings />, label: 'Paramètres', href: '/account/settings' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-medical-white p-6 rounded-lg shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-medical-text">Mon Compte</h1>
          <p className="text-medical-text-secondary mt-1">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 bg-brand-coral hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {menuItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-medical-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <Link to={item.href} className="flex items-center space-x-4">
              <div className="text-brand-primary">{item.icon}</div>
              <span className="font-medium">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
