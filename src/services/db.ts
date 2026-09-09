import {
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS,
  INITIAL_MENU,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_SETTINGS,
  resetAllStorageToDefaults,
} from "./storage";
import type {
  MenuItem,
  Category,
  Order,
  OrderStatus,
  Customer,
  SiteSettings,
  BusinessInfo,
  HeroContent,
  Testimonial,
} from "../types";

export const db = {
  // -------------------------------------------------------------
  // Menu Items
  // -------------------------------------------------------------
  async getMenuItems(): Promise<MenuItem[]> {
    return loadFromStorage<MenuItem[]>(STORAGE_KEYS.MENU, INITIAL_MENU);
  },

  async getMenuItemById(id: number): Promise<MenuItem | null> {
    const items = await this.getMenuItems();
    return items.find(i => i.id === id) || null;
  },

  async createMenuItem(item: Omit<MenuItem, "id" | "createdAt">): Promise<MenuItem> {
    const items = await this.getMenuItems();
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItem: MenuItem = {
      ...item,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    const updated = [newItem, ...items];
    saveToStorage(STORAGE_KEYS.MENU, updated);
    return newItem;
  },

  async updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem> {
    const items = await this.getMenuItems();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) throw new Error(`Menu item with ID ${id} not found`);

    const updatedItem: MenuItem = { ...items[index], ...updates };
    items[index] = updatedItem;
    saveToStorage(STORAGE_KEYS.MENU, items);
    return updatedItem;
  },

  async toggleAvailability(id: number): Promise<MenuItem> {
    const item = await this.getMenuItemById(id);
    if (!item) throw new Error(`Menu item with ID ${id} not found`);
    return this.updateMenuItem(id, { available: !item.available });
  },

  async updatePrice(id: number, newPrice: number): Promise<MenuItem> {
    if (newPrice < 0) throw new Error("Price cannot be negative");
    return this.updateMenuItem(id, { price: newPrice });
  },

  async deleteMenuItem(id: number): Promise<boolean> {
    const items = await this.getMenuItems();
    const filtered = items.filter(i => i.id !== id);
    saveToStorage(STORAGE_KEYS.MENU, filtered);
    return true;
  },

  // -------------------------------------------------------------
  // Categories
  // -------------------------------------------------------------
  async getCategories(): Promise<Category[]> {
    return loadFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  async createCategory(cat: Omit<Category, "id">): Promise<Category> {
    const categories = await this.getCategories();
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    const updated = [...categories, newCat];
    saveToStorage(STORAGE_KEYS.CATEGORIES, updated);
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Category ${id} not found`);

    const oldName = categories[index].name;
    const updatedCat = { ...categories[index], ...updates };
    categories[index] = updatedCat;
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);

    // If category name changed, update menu items under this category
    if (updates.name && updates.name !== oldName) {
      const menuItems = await this.getMenuItems();
      const updatedMenu = menuItems.map(m => m.category === oldName ? { ...m, category: updates.name! } : m);
      saveToStorage(STORAGE_KEYS.MENU, updatedMenu);
    }

    return updatedCat;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getCategories();
    const target = categories.find(c => c.id === id);
    if (!target) return false;

    const filtered = categories.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  },

  // -------------------------------------------------------------
  // Orders
  // -------------------------------------------------------------
  async getOrders(): Promise<Order[]> {
    return loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  async createOrder(orderData: Omit<Order, "id" | "createdAt" | "status"> & { status?: OrderStatus }): Promise<Order> {
    const orders = await this.getOrders();
    const id = "PB" + Math.floor(2000 + Math.random() * 8000);
    const newOrder: Order = {
      ...orderData,
      id,
      status: orderData.status || "New Order",
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    saveToStorage(STORAGE_KEYS.ORDERS, updatedOrders);

    // Also update/create customer profile
    await this.upsertCustomerFromOrder(newOrder);

    return newOrder;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const orders = await this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error(`Order ${id} not found`);

    orders[index] = {
      ...orders[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },

  async deleteOrder(id: string): Promise<boolean> {
    const orders = await this.getOrders();
    const filtered = orders.filter(o => o.id !== id);
    saveToStorage(STORAGE_KEYS.ORDERS, filtered);
    return true;
  },

  // -------------------------------------------------------------
  // Customers
  // -------------------------------------------------------------
  async getCustomers(): Promise<Customer[]> {
    return loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },

  async upsertCustomerFromOrder(order: Order): Promise<Customer> {
    const customers = await this.getCustomers();
    const existingIndex = customers.findIndex(
      c => c.phone === order.customerPhone || (order.customerEmail && c.email === order.customerEmail)
    );

    if (existingIndex >= 0) {
      const existing = customers[existingIndex];
      const updatedCust: Customer = {
        ...existing,
        name: order.customerName || existing.name,
        address: order.deliveryAddress || existing.address,
        area: order.deliveryArea || existing.area,
        totalOrders: existing.totalOrders + 1,
        totalSpent: existing.totalSpent + order.total,
        lastOrderDate: order.createdAt,
        status: existing.totalOrders + 1 >= 4 ? "VIP" : "Active",
      };
      customers[existingIndex] = updatedCust;
      saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
      return updatedCust;
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: order.customerName,
        phone: order.customerPhone,
        email: order.customerEmail,
        address: order.deliveryAddress,
        area: order.deliveryArea,
        totalOrders: 1,
        totalSpent: order.total,
        lastOrderDate: order.createdAt,
        status: "Active",
      };
      const updated = [newCust, ...customers];
      saveToStorage(STORAGE_KEYS.CUSTOMERS, updated);
      return newCust;
    }
  },

  // -------------------------------------------------------------
  // Site Settings & Content
  // -------------------------------------------------------------
  async getSiteSettings(): Promise<SiteSettings> {
    return loadFromStorage<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const updated: SiteSettings = {
      ...current,
      ...updates,
      business: { ...current.business, ...(updates.business || {}) },
      hero: { ...current.hero, ...(updates.hero || {}) },
    };
    saveToStorage(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  async updateBusinessInfo(info: Partial<BusinessInfo>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    return this.updateSiteSettings({
      business: { ...current.business, ...info },
    });
  },

  async updateHeroContent(hero: Partial<HeroContent>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    return this.updateSiteSettings({
      hero: { ...current.hero, ...hero },
    });
  },

  async updateTestimonials(testimonials: Testimonial[]): Promise<SiteSettings> {
    return this.updateSiteSettings({ testimonials });
  },

  async resetToDemoDefaults(): Promise<void> {
    resetAllStorageToDefaults();
  },
};
