import { Link } from '@tanstack/react-router';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useState } from 'react';

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  stock: number;
  rating?: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    
    addItem({
      productId: product._id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      quantity: 1,
      image: product.images[0] || 'https://via.placeholder.com/300',
      stock: product.stock,
    });

    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <Link to={`/products/${product._id}`} className="card group">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold">Out of Stock</span>
          </div>
        )}
        <button
          className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-primary-100 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            // Add to wishlist logic
          }}
        >
          <Heart size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          {product.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isAdding
              ? 'bg-green-600 text-white'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          <ShoppingCart size={18} />
          {isAdding ? 'Added!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}