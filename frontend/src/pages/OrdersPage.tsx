import React from 'react';

export const OrdersPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Order History</h1>
      <div className="text-center py-12">
        <p className="text-muted-foreground">No orders found.</p>
      </div>
    </div>
  );
};

