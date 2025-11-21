import React, { useEffect } from 'react';
import { ProductCard } from '../components/products/ProductCard';
import { Loading, ProductCardSkeleton } from '../components/common/Loading';
import { useProductStore } from '../store/productStore';

export const HomePage: React.FC = () => {
  const {
    featuredProducts,
    categories,
    products,
    isLoading,
    fetchProducts,
    fetchCategories,
  } = useProductStore();

  useEffect(() => {
    // Fetch featured products and categories
    fetchProducts({ limit: 8 });
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-accent/10 py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Discover Your
                <span className="text-primary block">Natural Beauty</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Transform your skincare routine with our curated selection of premium cosmetics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Shop by Category</h2>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Featured Products</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
