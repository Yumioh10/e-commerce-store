import { Cart } from "./components/Cart";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProductGrid } from "./components/ProductGrid";
import { Footer } from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { useState } from "react";
import type { Product, Page } from "./types";


function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cartOpen, setCartOpen] = useState(false);

  const handleNavigate = (page: Page) => setCurrentPage(page);
  const handleCartOpen = () => setCartOpen(true);
  const handleViewDetails = (_product: Product) => {};

  return (
    <CartProvider>
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onCartOpen={handleCartOpen}
        product={{} as Product}
        onViewDetails={handleViewDetails}
        products={[]}
      />
      <main>
        <Hero
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onCartOpen={handleCartOpen}
          product={{} as Product}
          onViewDetails={handleViewDetails}
          products={[]}
        />
        <ProductGrid
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onCartOpen={handleCartOpen}
          product={{} as Product}
          onViewDetails={handleViewDetails}
          products={[]}
        />
        <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </main>
      <Footer />
    </CartProvider>
  );
}

export default App;