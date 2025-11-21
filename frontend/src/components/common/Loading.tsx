import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', className, text }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin', sizes[size])} />
      {text && (
        <span className="ml-2 text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
};

// Full page loading component
export const PageLoading: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loading size="lg" className="mb-4" />
        <p className="text-lg text-muted-foreground">{text}</p>
      </div>
    </div>
  );
};

// Skeleton loading component
export const Skeleton: React.FC<{
  className?: string;
  lines?: number;
  width?: string | string[];
  height?: string | string[];
}> = ({
  className,
  lines = 1,
  width = '100%',
  height = '1rem'
}) => {
  const widths = Array.isArray(width) ? width : [width];
  const heights = Array.isArray(height) ? height : [height];

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-muted rounded"
          style={{
            width: widths[index] || widths[0],
            height: heights[index] || heights[0],
          }}
        />
      ))}
    </div>
  );
};

// Product card skeleton
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <Skeleton height="200px" className="w-full" />
      <div className="p-4 space-y-3">
        <Skeleton height="1rem" width="60%" />
        <Skeleton height="0.875rem" width="40%" />
        <Skeleton height="1.5rem" width="30%" />
        <Skeleton height="2.5rem" className="w-full" />
      </div>
    </div>
  );
};

// List skeleton
export const ListSkeleton: React.FC<{
  items: number;
  showAvatar?: boolean;
}> = ({ items, showAvatar = false }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          {showAvatar && <Skeleton width="40px" height="40px" className="rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton height="1rem" width="70%" />
            <Skeleton height="0.875rem" width="50%" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;

