import React from 'react';

export const WishlistPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">My Wishlist</h1>
      <div className="text-center py-12">
        <p className="text-muted-foreground">Your wishlist is empty.</p>
      </div>
    </div>
  );
};
