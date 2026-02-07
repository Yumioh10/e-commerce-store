import { Link } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { motion } from 'motion/react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCartStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-medical-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <Link to="/products/$productId" params={{ productId: product.id }}>
        <div className="relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </Link>

      <div className="p-4">
        <Link to="/products/$productId" params={{ productId: product.id }}>
          <h3 className="font-semibold text-medical-text mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-medical-text-secondary mb-3 capitalize">{product.volume}</p>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-medical-gray'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-medical-text-secondary ml-2">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-medical-text">{product.price.toFixed(2)} Dh</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addItem(product)}
            className="bg-brand-primary hover:bg-brand-secondary text-white p-2 rounded-full transition-colors"
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};