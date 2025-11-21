import React from 'react';
import type { CartItem as CartItemType } from '../../types/cart';
import { ProductImage } from '../common/ProductImage';
import { Button } from '../common/Button';
import { Minus, Plus, X, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  isLoading?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  isLoading = false,
}) => {
  const { product, quantity, selectedVariant } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.stockQuantity || 99)) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    handleQuantityChange(quantity - 1);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const itemPrice = selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.price;
  const itemTotal = itemPrice * quantity;

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <ProductImage
            src={product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            width={100}
            height={100}
            className="w-20 h-20 rounded-md"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <h3 className="font-medium text-sm line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground uppercase mt-1">
                {product.brand}
              </p>
              {selectedVariant && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedVariant.name}: {selectedVariant.value}
                </p>
              )}
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="p-1 rounded-full hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section - Price and Quantity */}
      <div className="flex justify-between items-center gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Quantity:</span>
          <div className="flex items-center border rounded-md">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1 || isLoading}
              className="p-1 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"
            >
              <Minus className="h-3 w-3" />
            </button>

            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              min="1"
              max={product.stockQuantity || 99}
              className="w-12 text-center border-x border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
              disabled={isLoading}
            />

            <button
              onClick={handleIncrement}
              disabled={quantity >= (product.stockQuantity || 99) || isLoading}
              className="p-1 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-md"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Price and Total */}
        <div className="text-right space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Price:</span>
            <span className="font-medium">{formatCurrency(itemPrice)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Total:</span>
            <span className="font-bold text-base">{formatCurrency(itemTotal)}</span>
          </div>
        </div>
      </div>

      {/* Stock Status */}
      {!product.inStock && (
        <div className="flex items-center space-x-2 text-sm text-destructive">
          <X className="h-4 w-4" />
          <span>Out of Stock</span>
        </div>
      )}

      {/* Low Stock Warning */}
      {product.inStock && product.stockQuantity && product.stockQuantity <= 5 && (
        <div className="flex items-center space-x-2 text-sm text-amber-600">
          <Minus className="h-4 w-4" />
          <span>Only {product.stockQuantity} left in stock</span>
        </div>
      )}
    </div>
  );
};

