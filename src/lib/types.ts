export interface ProductColor {
  name: string;
  code: string; // Hex color code
  imageIndex?: number;
  stock?: number;
}

export interface ProductSize {
  name: string; // S, M, L, XL, XXL
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subCategory?: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  previousPrice?: number;
  discountPercentage?: number;
  sku: string;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  orderPosition?: number;
  features?: string[];
  materials?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
  isActive: boolean;
  orderPosition: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  price: number;
  selectedColor?: string;
  selectedSize: string;
  quantity: number;
  maxStock: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'payment_pending'
  | 'paid'
  | 'processing'
  | 'packed'
  | 'courier_assigned'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'return_approved'
  | 'returned'
  | 'refunded';

export type PaymentStatus =
  | 'unpaid'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color?: string;
  quantity: number;
  subtotal: number;
}

export interface OrderCustomerInfo {
  fullName: string;
  mobile: string;
  email?: string;
  division: string;
  district: string;
  area: string;
  fullAddress: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customer: OrderCustomerInfo;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryCharge: number;
  discountAmount?: number;
  total: number;
  deliveryArea: 'dhaka' | 'outside_dhaka';
  paymentMethod: 'cod' | 'pay_delivery_charge' | 'online_full';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusTimeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  source: 'online' | 'manual_employee';
  employeeName?: string;
  employeeId?: string;
  courierName?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  customerName: string;
  mobile: string;
  productName: string;
  reason: string;
  description: string;
  imageUrls?: string[];
  preferredResolution: 'refund' | 'replacement' | 'store_credit';
  status:
    | 'return_requested'
    | 'reviewing'
    | 'approved'
    | 'rejected'
    | 'product_received'
    | 'refunded'
    | 'completed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  orderPosition: number;
  isActive: boolean;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  dhakaDeliveryFee: number;
  outsideDhakaDeliveryFee: number;
  freeDeliveryThreshold?: number;
  codEnabled: boolean;
  onlinePaymentEnabled: boolean;
  heroSliderDurationSeconds: number;
  currency: string;
  timezone: string;
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'employee';
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CustomerUser {
  uid: string;
  email: string;
  password?: string;
  fullName: string;
  mobile?: string;
  address?: {
    division: string;
    district: string;
    area: string;
    fullAddress: string;
  };
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
