export type CategoryName = string;

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: CategoryName;
  image: string;
  available: boolean;
  featured?: boolean;
  isSpecial?: boolean;
  ingredients?: string[];
  preparationTime?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  itemCount?: number;
}

export type OrderStatus =
  | "New Order"
  | "Confirmed"
  | "Preparing"
  | "Ready"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus = "Pending" | "Paid" | "Failed";
export type OrderType = "Food Delivery" | "Home Pickup";
export type PaymentMethod = "Pay on Delivery" | "Bank Transfer";

export interface OrderItemExtra {
  name: string;
  price: number;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  extras?: string[];
  instructions?: string;
  total: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryArea: string;
  orderNotes?: string;
  preferredTime?: string;
  type: OrderType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  area?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "Active" | "VIP" | "Inactive";
  notes?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  location: string;
  phone: string;
  whatsapp: string;
  email?: string;
  openingDays: string;
  openingHours: string;
  deliveryFee: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface HeroContent {
  headline: string;
  highlightedText: string;
  subheadline: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  heroImage: string;
  badgeText: string;
  ratingScore: string;
  ratingLabel: string;
}

export interface SiteSettings {
  business: BusinessInfo;
  hero: HeroContent;
  weekLabel: string;
  weeklySpecialsNotice: string;
  announcement?: {
    enabled: boolean;
    text: string;
    linkText?: string;
    linkUrl?: string;
  };
  testimonials: Testimonial[];
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: "super_admin" | "admin" | "manager";
  lastLogin?: string;
}

export interface CartLine {
  key: string;
  item: MenuItem;
  qty: number;
  extras: string[];
  instructions: string;
}

export type Page = "home" | "menu" | "cooking" | "contact" | "cart" | "checkout" | "confirm" | "admin";

export type AdminTab =
  | "overview"
  | "menu"
  | "categories"
  | "orders"
  | "customers"
  | "weekly"
  | "content"
  | "settings";
