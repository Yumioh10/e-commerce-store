export const LoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-center">
      <div className="w-16 h-16 bg-medical-gray rounded-full mx-auto mb-4"></div>
        <p className="text-medical-text-secondary">Authentification ...</p>
    </div>
  </div>
);

export const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-medical-gray rounded-lg aspect-square mb-4"></div>
        <div className="h-4 bg-medical-gray rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-medical-gray rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-medical-gray rounded-lg aspect-square"></div>
      <div>
        <div className="h-8 bg-medical-gray rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-medical-gray rounded w-1/2 mb-8"></div>
        <div className="space-y-2">
          <div className="h-4 bg-medical-gray rounded"></div>
          <div className="h-4 bg-medical-gray rounded"></div>
          <div className="h-4 bg-medical-gray rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);