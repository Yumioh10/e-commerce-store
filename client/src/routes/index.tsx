import { createFileRoute } from '@tanstack/react-router';
import { ProductGrid } from '@/components/ProductGrid';
import { mockProducts } from '@/data/mockProducts';
import { motion } from 'motion/react';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const featuredProducts = mockProducts.filter((p) => p.rating >= 4.8);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary/20 to-brand-coral/20 rounded-2xl p-8 md:p-12 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-brand-primary leading-tight"
            >
              Le meilleur de la parapharmacie,
              <span className="text-medical-text"> livré chez vous.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-medical-text-secondary"
            >
              Découvrez notre sélection de soins dermo-cosmétiques et profitez d'une expérience d'achat simple et rapide, partout au Maroc.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="bg-brand-primary hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Découvrir
              </Link>
              <Link
                to="/categories"
                className="border border-brand-primary text-brand-primary hover:bg-brand-dark hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Catégories
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <img
              src="./src/assets/Parapharmacie.jpg"
              alt="Professional skincare"
              className="rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-bold text-medical-text mb-6">Featured Products</h2>
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  );
}