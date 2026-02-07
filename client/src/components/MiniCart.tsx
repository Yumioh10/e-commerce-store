import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '@/store/cartStore';
import { Link } from '@tanstack/react-router';

export const MiniCart = () => {
  const { isOpen, items, removeItem, toggleCart, total } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={toggleCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-medical-white shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-medical-gray">
                <h2 className="text-lg font-semibold">Your Cart</h2>
                <button onClick={toggleCart} className="p-2 hover:bg-medical-gray rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <p className="text-medical-text-secondary text-center">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-sm text-medical-text-secondary">
                            {item.price.toFixed(2)} x {item.quantity} Dh
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-brand-coral hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-medical-gray p-6">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-xl">{total().toFixed(2)} Dh</span>
                  </div>
                  <Link
                    to="/checkout"
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-3 rounded-lg text-center font-medium transition-colors block"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};