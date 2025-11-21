import React from 'react';

export const CartPage: React.FC = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="text-center py-12">
        <p className="text-muted-foreground">Your cart is empty.</p>
      </div>
    </div>
  );
};

