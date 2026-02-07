import { createFileRoute, Link } from '@tanstack/react-router';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Route = createFileRoute('/cart')({
  component: CartPage,
});

function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h2 className="text-2xl font-bold text-medical-text mb-4">Your Treatment Plan is Empty</h2>
        <p className="text-medical-text-secondary mb-6">Add some medical cosmetics to get started.</p>
        <Link to="/products" className="bg-brand-primary text-white px-6 py-3 rounded-lg">
          Browse Products
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-4">
        <motion.h1
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-3xl font-bold text-medical-text mb-6"
        >
          Your Treatment Plan
        </motion.h1>
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-medical-white rounded-lg p-6 shadow-sm flex items-center space-x-6"
            >
              <img src={item.images[0]} alt={item.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <Link to="/products/$productId" params={{ productId: item.id }}>
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                </Link>
                <p className="text-medical-text-secondary mb-2">{item.volume}</p>
                <p className="text-brand-primary font-bold">{item.price.toFixed(2)} Dh</p>
              </div>
              
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 rounded-full hover:bg-medical-gray transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-full hover:bg-medical-gray transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </motion.div>
              
              <motion.button
                onClick={() => removeItem(item.id)}
                className="text-brand-coral hover:text-red-600 p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/*Order Summary Sidebar*/}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-medical-white rounded-lg p-6 shadow-sm h-fit"
      >
        <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{total().toFixed(2)} Dh</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>0.00 Dh</span>
          </div>
        </div>
        <div className="border-t border-medical-gray pt-4 mb-6">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{total().toFixed(2)} Dh</span>
          </div>
        </div>
        <Link
          to="/checkout"
          className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-3 rounded-lg font-medium transition-colors block text-center"
        >
          Proceed to Secure Checkout
        </Link>
      </motion.div>
    </motion.div>
  );
}