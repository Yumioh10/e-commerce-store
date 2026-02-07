import { useState } from 'react';
import { createFileRoute, notFound, Link } from '@tanstack/react-router';
import { mockProducts } from '@/data/mockProducts';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductDetailSkeleton } from '@/components/LoadingSkeleton';

export const Route = createFileRoute('/products/$productId')({
  loader: async ({ params }) => {
    const product = mockProducts.find((p) => p.id === params.productId);
    if (!product) throw notFound();
    return product;
  },
  pendingComponent: ProductDetailSkeleton,
  errorComponent: ProductNotFound,
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const product = Route.useLoaderData();
  const { addItem } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/*Image Gallery */}
        <div>
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="w-full rounded-lg mb-4"
          />
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={product.name}
                onClick={() => setSelectedImage(idx)}
                className={`rounded cursor-pointer border-2 ${
                  selectedImage === idx ? 'border-brand-primary' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        {/*Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-medical-text mb-2">{product.name}</h1>
            <p className="text-medical-text-secondary mb-4">{product.volume}</p>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-medical-gray'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-medical-text-secondary">({product.reviewCount} reviews)</span>
            </div>
            <div className="text-3xl font-bold text-brand-primary mb-6">{product.price.toFixed(2)} Dh</div>
          </div>

          {/*Add to Cart */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addItem(product)}
            disabled={!product.inStock}
            className="w-full bg-brand-primary hover:bg-brand-secondary disabled:bg-medical-gray text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{product.inStock ? 'Add to Treatment Plan' : 'Out of Stock'}</span>
          </motion.button>

          {/*Medical Claims */}
          <div className="bg-brand-primary/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Medical Claims</h3>
            <ul className="space-y-1">
              {product.medicalClaims.map((claim, idx) => (
                <li key={idx} className="text-sm flex items-center space-x-2">
                  <Check className="w-4 h-4 text-brand-secondary" />
                  <span>{claim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/*Tabs */}
      <div className="bg-medical-white rounded-lg shadow-sm">
        <div className="border-b border-medical-gray">
          <nav className="flex space-x-8">
            {['description', 'ingredients', 'usage'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 capitalize border-b-2 ${
                  activeTab === tab
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-medical-text-secondary'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'description' && <p className="whitespace-pre-line">{product.description}</p>}
          {activeTab === 'ingredients' && (
            <ul className="list-disc list-inside space-y-1">
              {product.ingredients.map((ingredient, idx) => (
                <li key={idx}>{ingredient}</li>
              ))}
            </ul>
          )}
          {activeTab === 'usage' && <p>Apply as directed by your dermatologist. Always patch test before use.</p>}
        </div>
      </div>
    </div>
  );
}

function ProductNotFound() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-medical-text mb-4">Product Not Found</h2>
      <p className="text-medical-text-secondary mb-6">The product you're looking for doesn't exist.</p>
      <Link to="/products" className="text-brand-primary hover:underline">
        Browse all products
      </Link>
    </div>
  );
}