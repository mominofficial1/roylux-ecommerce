import {
  Product,
  Category,
  HeroSlide,
  SiteSettings,
  Order,
  ReturnRequest,
  Employee,
  CustomerUser,
  CartItem,
  OrderStatus,
  PaymentStatus,
} from './types';
import { db } from './firebase';
import { doc, setDoc, updateDoc, getDocs, collection } from 'firebase/firestore';

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-slide-1',
    title: 'WE GIVE YOU A WARM SWEET',
    subtitle: 'COMFORT MEETS TIMELESS STYLE',
    badge: 'NEW WINTER DROP 2026',
    imageUrl: '/images/hero/hero-1.jpg',
    buttonText: 'SHOP WINTER SWEATSHIRTS',
    buttonLink: '/shop?category=winter-sweatshirt',
    orderPosition: 1,
    isActive: true,
  },
  {
    id: 'hero-slide-2',
    title: 'PREMIUM COMFORT ELEVATED STYLE',
    subtitle: "MORE THAN JUST A HOODIE — IT'S A LIFESTYLE",
    badge: 'SIGNATURE HOODIE COLLECTION',
    imageUrl: '/images/hero/hero-2.jpg',
    buttonText: 'EXPLORE HOODIES',
    buttonLink: '/shop?category=winter-hoodie',
    orderPosition: 2,
    isActive: true,
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Winter Hoodie',
    slug: 'winter-hoodie',
    description: 'Heavyweight premium fleece hoodies with tailored fits and custom hardware.',
    imageUrl: '/images/products/product-3/1-front.jpg',
    productCount: 4,
    isActive: true,
    orderPosition: 1,
  },
  {
    id: 'cat-2',
    name: 'Winter Sweatshirt',
    slug: 'winter-sweatshirt',
    description: 'Classic collegiate varsity crewnecks crafted from plush thermal fleece.',
    imageUrl: '/images/products/product-4/1-front.jpg',
    productCount: 1,
    isActive: true,
    orderPosition: 2,
  },
  {
    id: 'cat-3',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Discover the latest additions to the RoyLux winter aesthetic.',
    imageUrl: '/images/products/product-1/1-front.jpg',
    productCount: 5,
    isActive: true,
    orderPosition: 3,
  },
  {
    id: 'cat-4',
    name: 'Best Sellers',
    slug: 'best-sellers',
    description: 'Our most sought-after signature pieces, adored for comfort and luxury.',
    imageUrl: '/images/products/product-2/1-front.jpg',
    productCount: 3,
    isActive: true,
    orderPosition: 4,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'roylux-love-of-god-hoodie',
    name: 'RoyLux "Love of God" Two-Tone Fleece Hoodie',
    slug: 'roylux-love-of-god-hoodie',
    category: 'Winter Hoodie',
    subCategory: 'Graphic Hoodies',
    shortDescription:
      'Deep forest green fleece pullover featuring contrast heather grey hood lining, ribbed cuffs, and iconic geometric chest typography.',
    fullDescription:
      'An expressive statement piece designed for ultimate winter coziness. The RoyLux "Love of God" Two-Tone Fleece Hoodie pairs a rich forest green body with a soft contrast grey marl hood and matching cuffs. Finished with a deep front kangaroo pocket, precision-stitched chest artwork, and relaxed drop-shoulder tailoring.',
    price: 2450,
    previousPrice: 2850,
    discountPercentage: 14,
    sku: 'RL-HG-001',
    stock: 45,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    images: [
      '/images/products/product-1/1-front.jpg',
      '/images/products/product-1/2-back.jpg',
      '/images/products/product-1/3-side.jpg',
      '/images/products/product-1/4-hood-detail.jpg',
      '/images/products/product-1/5-cuff-detail.jpg',
    ],
    colors: [
      { name: 'Forest Green & Grey', code: '#1B3B2B', imageIndex: 0, stock: 45 },
    ],
    sizes: [
      { name: 'M', stock: 15 },
      { name: 'L', stock: 20 },
      { name: 'XL', stock: 10 },
    ],
    features: [
      'Heavyweight 340+ GSM brushed cotton-fleece blend',
      'Dual-tone contrast heather grey fleece hood and cuffs',
      'High-density screenprint typography with subtle RoyLux crown',
      'Double-stitched kangaroo pocket with reinforced corners',
    ],
    materials: '80% Premium Combed Cotton, 20% Thermal Fleece Poly',
    createdAt: '2026-10-24T10:00:00Z',
    updatedAt: '2026-10-24T10:00:00Z',
  },
  {
    id: 'roylux-signature-charcoal-hoodie',
    name: 'RoyLux Signature Tipped Charcoal Fleece Hoodie',
    slug: 'roylux-signature-charcoal-hoodie',
    category: 'Winter Hoodie',
    subCategory: 'Minimalist Hoodies',
    shortDescription:
      'Sophisticated charcoal grey pullover hoodie accented with clean white contrast tipping on the cuffs and waistband.',
    fullDescription:
      'Understated luxury meets athletic refinement. Crafted from dense charcoal fleece, this hoodie features clean white tipped accents along the ribbed cuffs and bottom hem, white tubular drawstrings with metal aglets, and the subtle white RoyLux crown embroidered on the chest.',
    price: 2350,
    previousPrice: 2700,
    discountPercentage: 13,
    sku: 'RL-HC-002',
    stock: 50,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    images: [
      '/images/products/product-2/1-front.jpg',
      '/images/products/product-2/2-back.jpg',
      '/images/products/product-2/3-angle.jpg',
      '/images/products/product-2/4-profile.jpg',
      '/images/products/product-2/5-pocket-detail.jpg',
    ],
    colors: [
      { name: 'Charcoal Grey', code: '#383838', imageIndex: 0, stock: 50 },
    ],
    sizes: [
      { name: 'M', stock: 18 },
      { name: 'L', stock: 22 },
      { name: 'XL', stock: 10 },
    ],
    features: [
      'Dense 360 GSM fleece with ultra-soft interior brushing',
      'Sport-inspired white contrast tipping on waistband and cuffs',
      'Direct chest embroidery of RoyLux crown crest',
      'Reinforced pouch pocket and heavy-gauge eyelets',
    ],
    materials: '85% Cotton, 15% Poly Fleece',
    createdAt: '2026-10-24T10:05:00Z',
    updatedAt: '2026-10-24T10:05:00Z',
  },
  {
    id: 'roylux-heritage-colorblock-hoodie',
    name: 'RoyLux Heritage Colorblock Cream & Emerald Hoodie',
    slug: 'roylux-heritage-colorblock-hoodie',
    category: 'Winter Hoodie',
    subCategory: 'Signature Drops',
    shortDescription:
      'Architectural cream pullover hoodie with bold vertical emerald green side inserts and embroidered chest insignia.',
    fullDescription:
      'A masterclass in modern luxury streetwear. The RoyLux Heritage Colorblock Hoodie showcases vertical emerald green panels contouring from shoulder to sleeve, balanced against a pristine cream fleece foundation. Features a crossover collar hood, gunmetal-tipped drawstrings, and emerald embroidery.',
    price: 2650,
    previousPrice: 3100,
    discountPercentage: 15,
    sku: 'RL-HG-003',
    stock: 35,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    images: [
      '/images/products/product-3/1-front.jpg',
      '/images/products/product-3/2-back.jpg',
      '/images/products/product-3/3-angle.jpg',
      '/images/products/product-3/4-profile.jpg',
      '/images/products/product-3/5-embroidery-detail.jpg',
    ],
    colors: [
      { name: 'Cream & Emerald Green', code: '#F5F2EB', imageIndex: 0, stock: 35 },
    ],
    sizes: [
      { name: 'M', stock: 12 },
      { name: 'L', stock: 15 },
      { name: 'XL', stock: 8 },
    ],
    features: [
      'Cut-and-sew emerald green side and sleeve panels',
      'Crossover collar with contrast-lined hood',
      'High-definition RoyLux crown and wordmark chest embroidery',
      'Custom gunmetal aglets and branded eyelets',
    ],
    materials: '85% Cotton, 15% Poly Fleece Heavyweight',
    createdAt: '2026-10-24T10:10:00Z',
    updatedAt: '2026-10-24T10:10:00Z',
  },
  {
    id: 'roylux-varsity-striped-crewneck',
    name: 'RoyLux Varsity Striped Cream Winter Sweatshirt',
    slug: 'roylux-varsity-striped-crewneck',
    category: 'Winter Sweatshirt',
    subCategory: 'Crewnecks',
    shortDescription:
      'Timeless vintage collegiate aesthetic with double-striped ribbed collar, hem, and cuffs on warm cream fleece.',
    fullDescription:
      'Effortless elegance for cooler days. The RoyLux Varsity Crewneck Sweatshirt takes classic varsity styling to high-fashion territory. Cut from dense cream fleece, it is detailed with black-and-white striped ribbing around the crewneck, wrist cuffs, and waistband, finished with a subtle black chest crest.',
    price: 1950,
    previousPrice: 2300,
    discountPercentage: 15,
    sku: 'RL-SW-004',
    stock: 40,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    images: [
      '/images/products/product-4/1-front.jpg',
      '/images/products/product-4/2-back.jpg',
      '/images/products/product-4/3-angle.jpg',
      '/images/products/product-4/4-profile.jpg',
      '/images/products/product-4/5-cuff-detail.jpg',
    ],
    colors: [
      { name: 'Cream with Black Trim', code: '#FAF8F5', imageIndex: 0, stock: 40 },
    ],
    sizes: [
      { name: 'S', stock: 10 },
      { name: 'M', stock: 15 },
      { name: 'L', stock: 15 },
    ],
    features: [
      'Vintage collegiate double-striped ribbed collar, cuffs, and hem',
      'Plush, anti-pilling warm fleece interior',
      'Subtle black embroidered RoyLux crown on left chest',
      'Relaxed drop-shoulder silhouette for effortless layering',
    ],
    materials: '80% Combed Cotton, 20% Fleece',
    createdAt: '2026-10-24T10:15:00Z',
    updatedAt: '2026-10-24T10:15:00Z',
  },
  {
    id: 'roylux-minimalist-pure-cream-hoodie',
    name: 'RoyLux Minimalist Pure Cream Heavyweight Hoodie',
    slug: 'roylux-minimalist-pure-cream-hoodie',
    category: 'Winter Hoodie',
    subCategory: 'Minimalist Hoodies',
    shortDescription:
      'Pristine cream heavy fleece pullover with minimalist black RoyLux insignia and custom gunmetal hardware.',
    fullDescription:
      'The definitive neutral hoodie for the discerning wardrobe. Crafted from unblemished cream brushed fleece, this piece exemplifies minimal luxury with a spacious double-layered hood, gunmetal-finished drawstrings, and the understated RoyLux emblem on the left chest.',
    price: 2350,
    previousPrice: 2750,
    discountPercentage: 15,
    sku: 'RL-HC-005',
    stock: 50,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    images: [
      '/images/products/product-5/1-front.jpg',
      '/images/products/product-5/2-back.jpg',
      '/images/products/product-5/3-hood-detail.jpg',
      '/images/products/product-5/4-cuff-detail.jpg',
    ],
    colors: [
      { name: 'Pure Cream', code: '#F6F4EE', imageIndex: 0, stock: 50 },
    ],
    sizes: [
      { name: 'M', stock: 20 },
      { name: 'L', stock: 20 },
      { name: 'XL', stock: 10 },
    ],
    features: [
      'Heavyweight 360 GSM combed cotton fleece',
      'Double-ply crossover hood with metallic grommets',
      'Tonal woven drawstrings with gunmetal aglets',
      'Deep kangaroo pocket and high-rebound ribbed trims',
    ],
    materials: '85% Cotton, 15% Poly Fleece',
    createdAt: '2026-10-24T10:20:00Z',
    updatedAt: '2026-10-24T10:20:00Z',
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'RoyLux',
  tagline: 'Premium Fashion & Winter Essentials',
  logoUrl: '/images/logo/roylux-logo.png',
  phone: '+880 1711 000000',
  email: 'concierge@roylux.com',
  address: 'Gulshan 2, Dhaka, Bangladesh',
  facebookUrl: 'https://facebook.com/royluxfashion',
  instagramUrl: 'https://instagram.com/royluxofficial',
  tiktokUrl: 'https://tiktok.com/@royluxofficial',
  dhakaDeliveryFee: 60,
  outsideDhakaDeliveryFee: 120,
  freeDeliveryThreshold: 4500,
  codEnabled: true,
  onlinePaymentEnabled: true,
  heroSliderDurationSeconds: 5,
  currency: 'BDT',
  timezone: 'Asia/Dhaka',
};

// Unified in-memory and client-side reactive store
class RoyLuxStore {
  private static STORAGE_PREFIX = 'roylux_store_';

  private static get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(this.STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  // Products
  static getProducts(): Product[] {
    return this.get<Product[]>('products', INITIAL_PRODUCTS);
  }

  static getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id || p.slug === id);
  }

  static saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    let targetProduct: Product;
    if (index >= 0) {
      targetProduct = { ...product, updatedAt: new Date().toISOString() };
      products[index] = targetProduct;
    } else {
      targetProduct = {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      products.unshift(targetProduct);
    }
    this.set('products', products);

    // Sync to Cloud Firestore
    try {
      setDoc(doc(db, 'products', targetProduct.id), targetProduct).catch((err) => {
        console.warn('Firebase product write warning:', err);
      });
    } catch (err) {
      console.warn('Firebase product error:', err);
    }
  }

  static deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.set('products', products);
  }

  // Categories
  static getCategories(): Category[] {
    return this.get<Category[]>('categories', INITIAL_CATEGORIES);
  }

  static saveCategory(category: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    this.set('categories', categories);
  }

  static deleteCategory(id: string): void {
    const categories = this.getCategories().filter((c) => c.id !== id);
    this.set('categories', categories);
  }

  // Hero Slides
  static getHeroSlides(): HeroSlide[] {
    return this.get<HeroSlide[]>('hero_slides', INITIAL_HERO_SLIDES);
  }

  static saveHeroSlide(slide: HeroSlide): void {
    const slides = this.getHeroSlides();
    const index = slides.findIndex((s) => s.id === slide.id);
    if (index >= 0) {
      slides[index] = slide;
    } else {
      slides.push(slide);
    }
    this.set('hero_slides', slides);
  }

  // Site Settings
  static getSettings(): SiteSettings {
    return this.get<SiteSettings>('settings', INITIAL_SETTINGS);
  }

  static saveSettings(settings: SiteSettings): void {
    this.set('settings', settings);
  }

  // Orders
  static getOrders(): Order[] {
    return this.get<Order[]>('orders', []);
  }

  static getOrderById(id: string): Order | undefined {
    return this.getOrders().find(
      (o) => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase()
    );
  }

  static createOrder(
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusTimeline'>
  ): Order {
    const orders = this.getOrders();
    const orderNumber = `RL-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber,
      statusTimeline: [
        {
          status: orderData.orderStatus || 'pending',
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.set('orders', orders);

    // Sync order to Cloud Firestore
    try {
      setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((err) => {
        console.warn('Firebase order write warning:', err);
      });
    } catch (err) {
      console.warn('Firebase order error:', err);
    }

    return newOrder;
  }

  static updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus,
    note?: string
  ): void {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index >= 0) {
      orders[index].orderStatus = status;
      if (paymentStatus) {
        orders[index].paymentStatus = paymentStatus;
      }
      orders[index].statusTimeline.push({
        status,
        timestamp: new Date().toISOString(),
        note: note || `Order status updated to ${status}`,
      });
      orders[index].updatedAt = new Date().toISOString();
      this.set('orders', orders);

      // Sync status update to Cloud Firestore
      try {
        const updatePayload: any = {
          orderStatus: status,
          statusTimeline: orders[index].statusTimeline,
          updatedAt: orders[index].updatedAt,
        };
        if (paymentStatus) {
          updatePayload.paymentStatus = paymentStatus;
        }
        updateDoc(doc(db, 'orders', orderId), updatePayload).catch((err) => {
          console.warn('Firebase order status update warning:', err);
        });
      } catch (err) {
        console.warn('Firebase updateDoc error:', err);
      }
    }
  }

  // Return Requests
  static getReturns(): ReturnRequest[] {
    return this.get<ReturnRequest[]>('returns', []);
  }

  static createReturnRequest(
    data: Omit<ReturnRequest, 'id' | 'createdAt' | 'updatedAt'>
  ): ReturnRequest {
    const returns = this.getReturns();
    const newReturn: ReturnRequest = {
      ...data,
      id: 'ret-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    returns.unshift(newReturn);
    this.set('returns', returns);

    // Sync return request to Cloud Firestore
    try {
      setDoc(doc(db, 'returns', newReturn.id), newReturn).catch((err) => {
        console.warn('Firebase return write warning:', err);
      });
    } catch (err) {
      console.warn('Firebase return error:', err);
    }

    return newReturn;
  }

  static updateReturnStatus(id: string, status: ReturnRequest['status'], adminNotes?: string): void {
    const returns = this.getReturns();
    const index = returns.findIndex((r) => r.id === id);
    if (index >= 0) {
      returns[index].status = status;
      if (adminNotes) returns[index].adminNotes = adminNotes;
      returns[index].updatedAt = new Date().toISOString();
      this.set('returns', returns);

      // Sync to Cloud Firestore
      try {
        const payload: any = {
          status,
          updatedAt: returns[index].updatedAt,
        };
        if (adminNotes) payload.adminNotes = adminNotes;
        updateDoc(doc(db, 'returns', id), payload).catch((err) => {
          console.warn('Firebase return status update warning:', err);
        });
      } catch (err) {
        console.warn('Firebase return updateDoc error:', err);
      }
    }
  }

  // Firebase Remote Sync
  static async syncWithFirebase(): Promise<{ ordersCount: number; returnsCount: number }> {
    try {
      // 1. Fetch Orders from Firebase
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      if (!ordersSnapshot.empty) {
        const remoteOrders: Order[] = [];
        ordersSnapshot.forEach((docSnap) => {
          remoteOrders.push(docSnap.data() as Order);
        });
        // Merge with existing local orders
        const localOrders = this.getOrders();
        const map = new Map<string, Order>();
        remoteOrders.forEach((o) => map.set(o.id, o));
        localOrders.forEach((o) => {
          if (!map.has(o.id)) map.set(o.id, o);
        });
        const mergedOrders = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.set('orders', mergedOrders);
      }

      // 2. Fetch Returns from Firebase
      const returnsSnapshot = await getDocs(collection(db, 'returns'));
      if (!returnsSnapshot.empty) {
        const remoteReturns: ReturnRequest[] = [];
        returnsSnapshot.forEach((docSnap) => {
          remoteReturns.push(docSnap.data() as ReturnRequest);
        });
        const localReturns = this.getReturns();
        const map = new Map<string, ReturnRequest>();
        remoteReturns.forEach((r) => map.set(r.id, r));
        localReturns.forEach((r) => {
          if (!map.has(r.id)) map.set(r.id, r);
        });
        const mergedReturns = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.set('returns', mergedReturns);
      }

      return {
        ordersCount: this.getOrders().length,
        returnsCount: this.getReturns().length,
      };
    } catch (err) {
      console.warn('Firebase syncWithFirebase failed, using local fallback:', err);
      return {
        ordersCount: this.getOrders().length,
        returnsCount: this.getReturns().length,
      };
    }
  }

  // Cart
  static getCart(): CartItem[] {
    return this.get<CartItem[]>('cart', []);
  }

  static addToCart(item: Omit<CartItem, 'id'>): CartItem[] {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      (c) =>
        c.productId === item.productId &&
        c.selectedSize === item.selectedSize &&
        c.selectedColor === item.selectedColor
    );
    if (existingIndex >= 0) {
      cart[existingIndex].quantity = Math.min(
        cart[existingIndex].maxStock,
        cart[existingIndex].quantity + item.quantity
      );
    } else {
      cart.push({
        ...item,
        id: `${item.productId}-${item.selectedSize}-${item.selectedColor || 'def'}`,
      });
    }
    this.set('cart', cart);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('roylux-cart-updated'));
    }
    return cart;
  }

  static updateCartQuantity(itemId: string, quantity: number): CartItem[] {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter((i) => i.id !== itemId);
    } else {
      const index = cart.findIndex((i) => i.id === itemId);
      if (index >= 0) {
        cart[index].quantity = Math.min(cart[index].maxStock, quantity);
      }
    }
    this.set('cart', cart);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('roylux-cart-updated'));
    }
    return cart;
  }

  static clearCart(): void {
    this.set('cart', []);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('roylux-cart-updated'));
    }
  }

  // Auth / Role Security
  static getAdminCredentials() {
    return this.get('admin_credentials', {
      username: 'roylux_admin',
      password: 'RoyLux#2026!Fashion',
    });
  }

  static saveAdminCredentials(username: string, password: string) {
    this.set('admin_credentials', { username, password });
  }

  static getEmployeeCredentials() {
    return this.get('employee_credentials', {
      username: 'roylux_staff',
      password: 'RoyLuxStaff@2026',
    });
  }

  static saveEmployeeCredentials(username: string, password: string) {
    this.set('employee_credentials', { username, password });
  }
}

export default RoyLuxStore;
