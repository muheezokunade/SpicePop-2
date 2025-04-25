// Website information
export const SITE_NAME = 'SpicePop';
export const SITE_DESCRIPTION = 'Nigerian Modern E-Commerce Platform for Spices and Foodstuffs';
export const FOUNDER = 'Iman Fasasi';

// Contact information
export const CONTACT_EMAIL = 'info@spicepop.net';
export const CONTACT_PHONE = '+2348068989798';
export const CONTACT_WHATSAPP = '+2348068989798';
export const CONTACT_ADDRESS = '13, Signature estate Ikota, Lekki, Lagos, Nigeria';

// Store locations
export const STORE_LOCATIONS = [
  '13, Signature estate Ikota, Lekki, Lagos, Nigeria',
  '10, Yusuf street Oshodi, Lagos',
  'Road 4, Plot B, Carlton Gate estate, Ibadan, Oyo State',
  '7B, road 7b, Obafemi Awolowo University, Ile ife, Osun State'
];

// Social links
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/18yaDEg6ck/',
  instagram: 'https://www.instagram.com/thespicepop?igsh=M3k3cm51aTQ3NG4=',
  twitter: 'https://x.com/thespicepop?t=UjxyaAgKbIrvzCH1gFmbuA&s=09',
  tiktok: 'https://www.tiktok.com/@spicepop?_t=ZM-8vpWf36RRDB&_r=1',
  whatsapp: 'https://wa.me/2349876543210'
};

// Navigation
export const MAIN_NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/blog' }
];

export const FOOTER_LINKS = {
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' }
  ],
  categories: [
    { label: 'Spices', href: '/shop?category=spices' },
    { label: 'Grains & Rice', href: '/shop?category=grains-rice' },
    { label: 'Sauces & Pastes', href: '/shop?category=sauces-pastes' },
    { label: 'Snacks', href: '/shop?category=snacks' },
    { label: 'Recipe Bundles', href: '/shop?category=recipe-bundles' }
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Shipping Policy', href: '/shipping' }
  ]
};

// Admin navigation
export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Products', href: '/admin/products', icon: 'Package' },
  { label: 'Categories', href: '/admin/categories', icon: 'FolderTree' },
  { label: 'Orders', href: '/admin/orders', icon: 'ShoppingCart' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' }
];

// Product categories
export const DEFAULT_CATEGORIES = [
  { name: 'Spices', slug: 'spices' },
  { name: 'Grains & Rice', slug: 'grains-rice' },
  { name: 'Sauces & Pastes', slug: 'sauces-pastes' },
  { name: 'Snacks', slug: 'snacks' },
  { name: 'Recipe Bundles', slug: 'recipe-bundles' }
];

// Order statuses
export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'paid', label: 'Paid', color: 'blue' },
  { value: 'shipped', label: 'Shipped', color: 'purple' },
  { value: 'delivered', label: 'Delivered', color: 'green' }
];

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login'
  },
  categories: {
    list: '/api/categories',
    detail: (id: string) => `/api/categories/${id}`
  },
  products: {
    list: '/api/products',
    featured: '/api/products?featured=true',
    byCategory: (categoryId: string) => `/api/products?category=${categoryId}`,
    detail: (id: string) => `/api/products/${id}`
  },
  orders: {
    list: '/api/orders',
    create: '/api/orders',
    detail: (id: string) => `/api/orders/${id}`,
    updateStatus: (id: string) => `/api/orders/${id}/status`
  },
  settings: {
    list: '/api/settings',
    update: (key: string) => `/api/settings/${key}`
  }
};

// Demo testimonials
export const TESTIMONIALS = [
  {
    name: 'Chioma A.',
    location: 'Lagos',
    rating: 5,
    text: "The jollof rice spice mix is amazing! It saved me so much time and gave my rice that authentic Nigerian flavor. Will definitely order again!"
  },
  {
    name: 'Emeka O.',
    location: 'London',
    rating: 5,
    text: "I've been looking for authentic Nigerian spices since I moved abroad. SpicePop has the best selection I've found online. Fast shipping too!"
  },
  {
    name: 'Funmi T.',
    location: 'Abuja',
    rating: 4.5,
    text: "The dried crayfish is of excellent quality. I appreciate that SpicePop sources from local Nigerian farmers. Will be a repeat customer for sure!"
  }
];

// Company features
export const FEATURES = [
  {
    title: 'Authentic & Fresh',
    description: 'Our spices come directly from Nigerian farms and markets, ensuring authentic flavor and maximum freshness.',
    icon: 'Leaf',
    color: 'secondary'
  },
  {
    title: 'Fast Delivery',
    description: 'We deliver nationwide with options for express delivery to get your Nigerian spices to you quickly.',
    icon: 'Truck',
    color: 'primary'
  },
  {
    title: 'Premium Quality',
    description: 'All our products go through rigorous quality checks to ensure you receive only the best Nigerian foodstuffs.',
    icon: 'Award',
    color: 'dark'
  }
];

// Product Images (placeholder)
export const PRODUCT_IMAGES = [
  '/images/products/pepper-mix.jpg',
  '/images/products/jollof-spice.jpg',
  '/images/products/ogbono.jpg',
  '/images/products/crayfish.jpg',
  '/images/products/ofada-rice.jpg',
  '/images/products/egusi.jpg',
  '/images/products/plantain-chips.jpg',
  '/images/products/suya-spice.jpg'
];
