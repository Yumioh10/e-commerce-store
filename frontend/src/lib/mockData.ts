import type { Product, ProductCategory, ProductBrand, ProductReview } from '../types/product';
import type { User, Address, PaymentMethod } from '../types/auth';
import type { Order } from '../types/order';

// Mock Products Data
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Radiant Glow Serum',
    description: 'A luxurious vitamin C serum that brightens and evens skin tone while providing powerful antioxidant protection.',
    price: 68.00,
    salePrice: 54.40,
    images: [
      {
        id: '1-1',
        url: '/images/products/serum-1.jpg',
        alt: 'Radiant Glow Serum Bottle',
        isPrimary: true,
        order: 1
      },
      {
        id: '1-2',
        url: '/images/products/serum-1-2.jpg',
        alt: 'Radiant Glow Serum Application',
        isPrimary: false,
        order: 2
      }
    ],
    category: 'skincare',
    subcategory: 'serums',
    brand: 'LuxeBeauty',
    rating: 4.8,
    reviewCount: 324,
    inStock: true,
    stockQuantity: 150,
    features: ['Vitamin C', 'Hyaluronic Acid', 'Fragrance-Free', 'Paraben-Free'],
    ingredients: ['Water', 'Ascorbic Acid', 'Sodium Hyaluronate', 'Glycerin', 'Vitamin E'],
    howToUse: 'Apply 3-4 drops to clean face and neck, morning and evening. Follow with moisturizer.',
    weight: 30,
    dimensions: { length: 4, width: 4, height: 12 },
    tags: ['brightening', 'anti-aging', 'antioxidant', 'vegan'],
    variants: [
      {
        id: '1-v1',
        name: 'Original',
        type: 'other',
        value: 'original',
        sku: 'RGS-001',
        price: 68.00,
        salePrice: 54.40,
        inStock: true,
        stockQuantity: 100
      },
      {
        id: '1-v2',
        name: 'Sensitive',
        type: 'other',
        value: 'sensitive',
        sku: 'RGS-002',
        price: 68.00,
        inStock: true,
        stockQuantity: 50
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Velvet Matte Lipstick - Ruby Red',
    description: 'Long-lasting matte lipstick with intense color payoff and comfortable, non-drying formula.',
    price: 24.00,
    images: [
      {
        id: '2-1',
        url: '/images/products/lipstick-2.jpg',
        alt: 'Velvet Matte Lipstick Ruby Red',
        isPrimary: true,
        order: 1
      }
    ],
    category: 'makeup',
    subcategory: 'lips',
    brand: 'ColorPop',
    rating: 4.6,
    reviewCount: 189,
    inStock: true,
    stockQuantity: 200,
    features: ['Long-lasting', 'Matte Finish', 'Non-drying', 'Vegan'],
    ingredients: ['Candelilla Wax', 'Carnauba Wax', 'Mica', 'Iron Oxides', 'Vitamin E'],
    howToUse: 'Apply directly to lips starting from the center and blending outward. Reapply as needed.',
    weight: 4,
    dimensions: { length: 2, width: 2, height: 6 },
    tags: ['matte', 'long-lasting', 'pigmented', 'vegan'],
    variants: [
      {
        id: '2-v1',
        name: 'Ruby Red',
        type: 'color',
        value: '#DC143C',
        sku: 'VML-001-R',
        price: 24.00,
        inStock: true,
        stockQuantity: 50,
        image: '/images/products/lipstick-ruby.jpg'
      },
      {
        id: '2-v2',
        name: 'Nude Pink',
        type: 'color',
        value: '#FFB6C1',
        sku: 'VML-001-P',
        price: 24.00,
        inStock: true,
        stockQuantity: 75,
        image: '/images/products/lipstick-pink.jpg'
      },
      {
        id: '2-v3',
        name: 'Deep Burgundy',
        type: 'color',
        value: '#800020',
        sku: 'VML-001-B',
        price: 24.00,
        inStock: true,
        stockQuantity: 75,
        image: '/images/products/lipstick-burgundy.jpg'
      }
    ],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: '3',
    name: 'Hydrating Cream Cleanser',
    description: 'Gentle, cream-based cleanser that effectively removes makeup and impurities without stripping the skin.',
    price: 32.00,
    images: [
      {
        id: '3-1',
        url: '/images/products/cleanser-3.jpg',
        alt: 'Hydrating Cream Cleanser',
        isPrimary: true,
        order: 1
      }
    ],
    category: 'skincare',
    subcategory: 'cleansers',
    brand: 'PureSkin',
    rating: 4.7,
    reviewCount: 267,
    inStock: true,
    stockQuantity: 80,
    features: ['Gentle', 'Hydrating', 'Makeup Removing', 'pH Balanced'],
    ingredients: ['Water', 'Glycerin', 'Cetyl Alcohol', 'Shea Butter', 'Chamomile Extract'],
    howToUse: 'Massage onto damp skin in circular motions. Rinse thoroughly with warm water.',
    weight: 150,
    dimensions: { length: 6, width: 6, height: 15 },
    tags: ['gentle', 'hydrating', 'sensitive-skin', 'clean'],
    createdAt: '2024-01-08T11:30:00Z',
    updatedAt: '2024-01-22T10:15:00Z'
  },
  {
    id: '4',
    name: 'Volumizing Mascara',
    description: 'Dramatic volume and length with our innovative brush technology that coats every lash.',
    price: 28.00,
    salePrice: 22.40,
    images: [
      {
        id: '4-1',
        url: '/images/products/mascara-4.jpg',
        alt: 'Volumizing Mascara',
        isPrimary: true,
        order: 1
      }
    ],
    category: 'makeup',
    subcategory: 'eyes',
    brand: 'LashLux',
    rating: 4.5,
    reviewCount: 412,
    inStock: true,
    stockQuantity: 120,
    features: ['Volumizing', 'Lengthening', 'Smudge-proof', 'Water-resistant'],
    ingredients: ['Water', 'Beeswax', 'Carnauba Wax', 'Iron Oxides', 'Panthenol'],
    howToUse: 'Start at the base of lashes and wiggle brush upward to coat. Apply second coat for added drama.',
    weight: 8,
    dimensions: { length: 3, width: 3, height: 12 },
    tags: ['volumizing', 'lengthening', 'dramatic', 'long-lasting'],
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-25T09:30:00Z'
  },
  {
    id: '5',
    name: 'Nourishing Face Oil',
    description: 'Luxurious blend of botanical oils that deeply nourish and restore skin\'s natural radiance.',
    price: 78.00,
    images: [
      {
        id: '5-1',
        url: '/images/products/face-oil-5.jpg',
        alt: 'Nourishing Face Oil',
        isPrimary: true,
        order: 1
      }
    ],
    category: 'skincare',
    subcategory: 'oils',
    brand: 'BotanicalLux',
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 60,
    features: ['Anti-aging', 'Nourishing', 'Fast-absorbing', 'Natural'],
    ingredients: ['Rosehip Oil', 'Jojoba Oil', 'Argan Oil', 'Vitamin E', 'Lavender Oil'],
    howToUse: 'Warm 3-5 drops in palms and press onto clean face and neck. Use at night.',
    weight: 30,
    dimensions: { length: 3, width: 3, height: 8 },
    tags: ['anti-aging', 'nourishing', 'luxury', 'natural'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-26T15:45:00Z'
  }
];

// Mock Categories
export const mockCategories: ProductCategory[] = [
  {
    id: 'cat-1',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Premium skincare products for radiant, healthy skin',
    image: '/images/categories/skincare.jpg',
    subcategories: [
      {
        id: 'subcat-1',
        name: 'Cleansers',
        slug: 'cleansers',
        description: 'Gentle and effective cleansers for all skin types',
        categoryId: 'cat-1',
        productCount: 24
      },
      {
        id: 'subcat-2',
        name: 'Serums',
        slug: 'serums',
        description: 'Concentrated treatments for targeted skin concerns',
        categoryId: 'cat-1',
        productCount: 18
      },
      {
        id: 'subcat-3',
        name: 'Moisturizers',
        slug: 'moisturizers',
        description: 'Hydrating moisturizers for every skin type',
        categoryId: 'cat-1',
        productCount: 32
      },
      {
        id: 'subcat-4',
        name: 'Oils',
        slug: 'oils',
        description: 'Nourishing face oils for extra care',
        categoryId: 'cat-1',
        productCount: 12
      }
    ],
    productCount: 86
  },
  {
    id: 'cat-2',
    name: 'Makeup',
    slug: 'makeup',
    description: 'High-quality makeup for any look',
    image: '/images/categories/makeup.jpg',
    subcategories: [
      {
        id: 'subcat-5',
        name: 'Foundation',
        slug: 'foundation',
        description: 'Flawless foundation for perfect coverage',
        categoryId: 'cat-2',
        productCount: 28
      },
      {
        id: 'subcat-6',
        name: 'Lips',
        slug: 'lips',
        description: 'Stunning lip colors and treatments',
        categoryId: 'cat-2',
        productCount: 45
      },
      {
        id: 'subcat-7',
        name: 'Eyes',
        slug: 'eyes',
        description: 'Eye makeup to make your eyes pop',
        categoryId: 'cat-2',
        productCount: 38
      }
    ],
    productCount: 111
  },
  {
    id: 'cat-3',
    name: 'Hair Care',
    slug: 'hair-care',
    description: 'Professional hair care products',
    image: '/images/categories/hair-care.jpg',
    subcategories: [
      {
        id: 'subcat-8',
        name: 'Shampoos',
        slug: 'shampoos',
        description: 'Gentle cleansing shampoos',
        categoryId: 'cat-3',
        productCount: 22
      },
      {
        id: 'subcat-9',
        name: 'Conditioners',
        slug: 'conditioners',
        description: 'Nourishing conditioners for healthy hair',
        categoryId: 'cat-3',
        productCount: 20
      }
    ],
    productCount: 42
  }
];

// Mock Brands
export const mockBrands: ProductBrand[] = [
  {
    id: 'brand-1',
    name: 'LuxeBeauty',
    slug: 'luxebeauty',
    description: 'Luxury skincare with premium ingredients',
    logo: '/images/brands/luxebeauty.png',
    website: 'https://luxebeauty.com',
    productCount: 15
  },
  {
    id: 'brand-2',
    name: 'ColorPop',
    slug: 'colorpop',
    description: 'Vibrant makeup for every style',
    logo: '/images/brands/colorpop.png',
    website: 'https://colorpop.com',
    productCount: 32
  },
  {
    id: 'brand-3',
    name: 'PureSkin',
    slug: 'pureskin',
    description: 'Clean, gentle skincare for sensitive skin',
    logo: '/images/brands/pureskin.png',
    website: 'https://pureskin.com',
    productCount: 18
  }
];

// Mock User
export const mockUser: User = {
  id: 'user-1',
  email: 'sarah.johnson@example.com',
  firstName: 'Sarah',
  lastName: 'Johnson',
  phone: '+1 (555) 123-4567',
  avatar: '/images/users/avatar-1.jpg',
  addresses: [
    {
      id: 'addr-1',
      type: 'shipping',
      isDefault: true,
      firstName: 'Sarah',
      lastName: 'Johnson',
      company: '',
      address: '123 Beauty Lane',
      apartment: 'Apt 4B',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 'addr-2',
      type: 'billing',
      isDefault: true,
      firstName: 'Sarah',
      lastName: 'Johnson',
      company: '',
      address: '123 Beauty Lane',
      apartment: 'Apt 4B',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States',
      phone: '+1 (555) 123-4567'
    }
  ],
  paymentMethods: [
    {
      id: 'pm-1',
      type: 'card',
      isDefault: true,
      card: {
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025
      }
    }
  ],
  preferences: {
    newsletter: true,
    smsNotifications: false,
    pushNotifications: true,
    currency: 'USD',
    language: 'en'
  },
  createdAt: '2023-06-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z'
};

// Mock Reviews
export const mockReviews: ProductReview[] = [
  {
    id: 'review-1',
    productId: '1',
    userId: 'user-2',
    user: {
      name: 'Emily Chen',
      avatar: '/images/users/avatar-2.jpg'
    },
    rating: 5,
    title: 'Amazing serum! My skin loves it.',
    content: 'I\'ve been using this serum for 3 weeks now and my skin has never looked better. It\'s so bright and glowy!',
    images: [],
    helpful: 24,
    verified: true,
    createdAt: '2024-01-18T14:30:00Z'
  },
  {
    id: 'review-2',
    productId: '1',
    userId: 'user-3',
    user: {
      name: 'Maria Rodriguez'
    },
    rating: 4,
    title: 'Great but a bit expensive',
    content: 'Really good serum that works well, but the price point is quite high for the size.',
    images: [],
    helpful: 12,
    verified: true,
    createdAt: '2024-01-15T09:20:00Z'
  }
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-2024-001',
    userId: 'user-1',
    user: mockUser,
    items: [
      {
        id: 'order-item-1',
        productId: '1',
        productName: 'Radiant Glow Serum',
        productImage: '/images/products/serum-1.jpg',
        brand: 'LuxeBeauty',
        quantity: 1,
        unitPrice: 68.00,
        salePrice: 54.40,
        total: 54.40,
        selectedVariant: {
          name: 'Original',
          value: 'original'
        }
      }
    ],
    status: 'delivered',
    subtotal: 54.40,
    tax: 4.35,
    shipping: 5.00,
    discount: 0,
    total: 63.75,
    shippingAddress: mockUser.addresses[0],
    billingAddress: mockUser.addresses[1],
    paymentMethod: mockUser.paymentMethods[0],
    paymentStatus: 'completed',
    paymentId: 'pay_1234567890',
    trackingNumber: '1Z9999W99999999999',
    trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=1Z9999W99999999999',
    estimatedDelivery: '2024-01-20T00:00:00Z',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
    shippedAt: '2024-01-17T14:20:00Z',
    deliveredAt: '2024-01-20T16:30:00Z'
  }
];
