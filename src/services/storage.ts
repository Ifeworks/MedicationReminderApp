import type {
  MenuItem,
  Category,
  Order,
  Customer,
  SiteSettings,
  AdminUser,
  CartLine,
} from "../types";

export const STORAGE_KEYS = {
  CART: "pb_delicacies_cart_v2",
  AUTH: "pb_delicacies_admin_auth_v2",
  SETTINGS: "pb_delicacies_settings_v2",
  CATEGORIES: "pb_delicacies_categories_v2",
  MENU: "pb_delicacies_menu_v2",
  ORDERS: "pb_delicacies_orders_v2",
  CUSTOMERS: "pb_delicacies_customers_v2",
  ADMIN_USERS: "pb_delicacies_admin_users_v2",
} as const;

export const INITIAL_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Rice", description: "Classic Nigerian party & native rice specialties", icon: "fire" },
  { id: "cat-2", name: "Swallows & Soups", description: "Freshly pounded swallows and traditional rich soups", icon: "chef" },
  { id: "cat-3", name: "Proteins", description: "Succulent flame-grilled, spiced and peppered meats", icon: "fire" },
  { id: "cat-4", name: "Sides", description: "Savory accompaniments, golden plantains and bean puddings", icon: "spark" },
  { id: "cat-5", name: "Drinks", description: "Chilled house-crafted beverages and Nigerian punches", icon: "spark" },
];

export const INITIAL_MENU: MenuItem[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_SETTINGS: SiteSettings = {
  business: {
    name: "PB DELICACIES",
    tagline: "Made with love",
    location: "Ido-Ekiti, Ekiti State, Nigeria",
    phone: "08150781152",
    whatsapp: "2348150781152",
    email: "orders@pbdelicacies.com",
    openingDays: "Fridays, Saturdays & Sundays",
    openingHours: "10:00 AM – 9:00 PM",
    deliveryFee: 1000,
    bankName: "Moniepoint / OPay / GTBank",
    accountNumber: "8150781152",
    accountName: "PB DELICACIES ENTERPRISE",
  },
  hero: {
    headline: "Delicious Food,",
    highlightedText: "Made With Love.",
    subheadline: "Freshly prepared weekend meals delivered to you in Ido-Ekiti — or let us bring the kitchen to your home.",
    primaryCtaText: "Order This Week's Menu",
    secondaryCtaText: "Book Home Cooking",
    heroImage: "https://images.unsplash.com/photo-1665332195309-9d75071138f0?w=900&h=900&fit=crop&auto=format",
    badgeText: "Serving Ido-Ekiti every weekend",
    ratingScore: "4.9 / 5",
    ratingLabel: "Loved by Ido-Ekiti",
  },
  weekLabel: "Weekend of 30–31 August 2026",
  weeklySpecialsNotice: "Menu changes weekly. Check back every week for fresh weekend specialties.",
  announcement: {
    enabled: true,
    text: "🎉 Now accepting weekend home cooking reservations across Ekiti State! Call or WhatsApp 08150781152.",
  },
  testimonials: [
    {
      id: "test-1",
      name: "Adebola O.",
      role: "Ido-Ekiti",
      text: "The jollof rice tastes just like my mum's! Delivery was quick and the packaging was so neat.",
      rating: 5,
    },
  ],
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-1",
    username: "admin@pbdelicacies.com",
    email: "admin@pbdelicacies.com",
    role: "super_admin",
  },
];

// Shopping Cart Storage Helpers
export const cartStorage = {
  getCart: (): CartLine[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Error loading cart from localStorage:", err);
      return [];
    }
  },
  saveCart: (cart: CartLine[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (err) {
      console.error("Error saving cart to localStorage:", err);
    }
  },
  clearCart: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CART);
    } catch (err) {
      console.error("Error clearing cart from localStorage:", err);
    }
  },
};

// General LocalStorage Fallback Helpers
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error loading key "${key}" from localStorage:`, err);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("pb-storage-change", { detail: { key, value } }));
  } catch (err) {
    console.error(`Error saving key "${key}" to localStorage:`, err);
  }
}

export function resetAllStorageToDefaults(): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(INITIAL_ADMIN_USERS));
  localStorage.removeItem(STORAGE_KEYS.CART);
  window.dispatchEvent(new CustomEvent("pb-storage-change", { detail: { key: "ALL" } }));
}