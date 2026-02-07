import { createFileRoute, notFound, Link } from '@tanstack/react-router';
import { mockProducts } from '@/data/mockProducts';
import { categories } from '@/data/mockCategories';
import { ProductGrid } from '@/components/ProductGrid';

export const Route = createFileRoute('/categories/$categoryId')({
  loader: async ({ params }) => {
    const category = categories.find((c) => c.id === params.categoryId);
    if (!category) throw notFound();
    const products = mockProducts.filter((p) => p.category === params.categoryId);
    return { category, products };
  },
  errorComponent: CategoryNotFound,
  component: CategoryPage,
});

function CategoryPage() {
  const { category, products } = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-medical-text mb-2">{category.name}</h1>
        <p className="text-medical-text-secondary">{category.description}</p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}

function CategoryNotFound() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-medical-text mb-4">Category Not Found</h2>
      <p className="text-medical-text-secondary mb-6">This medical cosmetics category doesn't exist.</p>
      <Link to="/products" className="bg-brand-primary text-white px-6 py-3 rounded-lg">
        Browse All Products
      </Link>
    </div>
  );
}