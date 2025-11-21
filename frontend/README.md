# Cosmetic E-Commerce Frontend Setup Guide

## Prerequisites
- Node.js 18+ installed
- Backend server running on `http://localhost:3000`

## Installation Steps

### 1. Navigate to frontend folder
```bash
cd frontend
```

### 2. Initialize Vite React TypeScript project
```bash
npm create vite@latest . -- --template react-ts
```

### 3. Install dependencies
```bash
# Core dependencies
npm install @tanstack/react-router @tanstack/react-query axios zustand react-hook-form zod lucide-react

# TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4. Project Structure
Create the following folder structure:
```
src/
├── components/
│   ├── layouts/
│   ├── products/
│   ├── cart/
│   └── common/
├── pages/
├── store/
├── lib/
└── types/
```

### 5. Configure Files

#### tailwind.config.js
Already provided in artifacts - copy the configuration.

#### src/index.css
Copy the provided styles with Tailwind directives.

#### .env
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### 6. Copy All Artifacts
Copy all the provided files from the artifacts:
- `src/lib/api.ts` - API frontend
- `src/store/authStore.ts` - Authentication state
- `src/store/cartStore.ts` - Shopping cart state
- `src/router.tsx` - Route configuration
- `src/App.tsx` - Main app component
- `src/main.tsx` - Entry point
- `src/components/layouts/` - Layout components
- `src/components/products/ProductCard.tsx` - Product card
- `src/pages/HomePage.tsx` - Home page

### 7. Create Missing Page Files

Create placeholder files for remaining pages:

**src/pages/ProductsPage.tsx**
```tsx
export default function ProductsPage() {
  return <div className="container-custom py-8">Products Page - Coming Soon</div>
}
```

**src/pages/ProductDetailPage.tsx**
```tsx
export default function ProductDetailPage() {
  return <div className="container-custom py-8">Product Detail - Coming Soon</div>
}
```

**src/pages/CartPage.tsx**
```tsx
export default function CartPage() {
  return <div className="container-custom py-8">Cart Page - Coming Soon</div>
}
```

**src/pages/CheckoutPage.tsx**
```tsx
export default function CheckoutPage() {
  return <div className="container-custom py-8">Checkout - Coming Soon</div>
}
```

**src/pages/LoginPage.tsx**
```tsx
export default function LoginPage() {
  return <div className="container-custom py-8">Login - Coming Soon</div>
}
```

**src/pages/RegisterPage.tsx**
```tsx
export default function RegisterPage() {
  return <div className="container-custom py-8">Register - Coming Soon</div>
}
```

**src/pages/ProfilePage.tsx**
```tsx
export default function ProfilePage() {
  return <div className="container-custom py-8">Profile - Coming Soon</div>
}
```

**src/pages/OrdersPage.tsx**
```tsx
export default function OrdersPage() {
  return <div className="container-custom py-8">Orders - Coming Soon</div>
}
```

**src/pages/OrderDetailPage.tsx**
```tsx
export default function OrderDetailPage() {
  return <div className="container-custom py-8">Order Detail - Coming Soon</div>
}
```

**src/pages/WishlistPage.tsx**
```tsx
export default function WishlistPage() {
  return <div className="container-custom py-8">Wishlist - Coming Soon</div>
}
```

### 8. Start Development Server
```bash
npm run dev
```

The app should now be running on `http://localhost:5173`

## Features Implemented

✅ **Routing with TanStack Router**
- Home page
- Products listing
- Product details
- Cart, Checkout
- Authentication (Login/Register)
- User profile, Orders, Wishlist

✅ **State Management**
- Zustand for auth and cart
- Persistent storage (localStorage)

✅ **API Integration**
- Axios frontend with interceptors
- Token management
- Automatic logout on 401

✅ **Responsive Design**
- Mobile-first approach
- TailwindCSS styling
- Modern UI components

✅ **Core Components**
- Header with search, cart, user menu
- Footer with links and newsletter
- Product cards with add to cart
- Loading states

## Next Steps

### Priority 1: Complete Core Pages
1. **ProductsPage** - Product listing with filters
2. **ProductDetailPage** - Product details with image gallery
3. **CartPage** - Shopping cart with quantity controls
4. **CheckoutPage** - Checkout form with address

### Priority 2: Authentication
1. **LoginPage** - Email/password login
2. **RegisterPage** - User registration
3. **ProfilePage** - User profile management

### Priority 3: Orders & Wishlist
1. **OrdersPage** - Order history
2. **OrderDetailPage** - Order details and tracking
3. **WishlistPage** - Saved products

### Additional Features to Implement
- Product search with autocomplete
- Advanced filtering (price, brand, category)
- Pagination
- Wishlist functionality
- Order tracking
- Reviews and ratings
- Password reset
- Admin dashboard (optional)

## Environment Variables
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Tech Stack
- **React 18** - UI library
- **TypeScript** - Type safety
- **TanStack Router** - Routing
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **Axios** - HTTP frontend
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **React Hook Form** - Forms
- **Zod** - Validation

## Troubleshooting

### CORS Issues
If you get CORS errors, make sure your backend has CORS enabled:
```typescript
// server.ts
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### API Connection
- Ensure backend is running on port 3000
- Check `.env` has correct API URL
- Verify MongoDB is connected

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Production Build
```bash
npm run build
```

Files will be in `dist/` folder ready for deployment.

## Deployment
- **Vercel** - Easy deployment for Vite apps
- **Netlify** - Alternative option
- **AWS S3 + CloudFront** - For larger scale

Remember to update `VITE_API_BASE_URL` to production API URL!