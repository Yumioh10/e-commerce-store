import React, { useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import { useProductStore } from '../store/productStore';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams({ from: '/products/$productId' });
  const { currentProduct, isLoading, fetchProduct } = useProductStore();

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Product Image</p>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground uppercase">{currentProduct.brand}</p>
            <h1 className="text-3xl font-bold mt-2">{currentProduct.name}</h1>
          </div>
          <p className="text-lg text-muted-foreground">{currentProduct.description}</p>
          <div className="text-2xl font-bold">
            ${currentProduct.salePrice || currentProduct.price}
          </div>
        </div>
      </div>
    </div>
  );
};

