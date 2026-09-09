import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type {
  MenuItem,
  Category,
  Order,
  OrderStatus,
  Customer,
  SiteSettings,
  CartLine,
  Page,
  AdminTab,
  BusinessInfo,
  HeroContent,
  Testimonial,
} from "../types";
import {
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_SETTINGS,
  cartStorage,
} from "../services/storage";
import { API_BASE_URL } from "../services/api";

// Helper to grab the admin token for protected API routes
const getAuthHeaders = (): Record<string, string> => {
  const token =
    localStorage.getItem("pb_delicacies_admin_token") ||
    localStorage.getItem("pb_delicacies_admin_auth_v2");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Clear stale or rejected tokens from storage
const clearAdminTokens = () => {
  localStorage.removeItem("pb_delicacies_admin_token");
  localStorage.removeItem("pb_delicacies_admin_auth_v2");
};

interface AppContextType {
  page: Page;
  setPage: (p: Page) => void;
  adminTab: AdminTab;
  setAdminTab: (t: AdminTab) => void;
  go: (p: Page) => void;

  menu: MenuItem[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  settings: SiteSettings;
  loading: boolean;

  detailItem: MenuItem | null;
  setDetailItem: (m: MenuItem | null) => void;

  toast: string | null;
  flash: (msg: string) => void;

  cart: CartLine[];
  cartCount: number;
  addLine: (item: MenuItem, qty: number, extras: string[], instructions: string) => void;
  quickAdd: (item: MenuItem) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;

  placeCustomerOrder: (orderData: Omit<Order, "id" | "createdAt" | "status">) => Promise<Order>;

  addMenuItem: (item: Omit<MenuItem, "id" | "createdAt"> | any) => Promise<MenuItem>;
  updateMenuItem: (id: number | string, updates: Partial<MenuItem> | any) => Promise<MenuItem>;
  deleteMenuItem: (id: number | string) => Promise<boolean>;
  toggleAvailability: (id: number | string) => Promise<MenuItem>;
  updateItemPrice: (id: number | string, price: number) => Promise<MenuItem>;

  addCategory: (cat: Omit<Category, "id">) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<boolean>;

  updateOrderStatus: (id: string, status: OrderStatus) => Promise<Order>;
  deleteOrder: (id: string) => Promise<boolean>;

  updateSettings: (updates: Partial<SiteSettings>) => Promise<SiteSettings>;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => Promise<SiteSettings>;
  updateHeroContent: (hero: Partial<HeroContent>) => Promise<SiteSettings>;
  updateTestimonials: (testimonials: Testimonial[]) => Promise<SiteSettings>;
  resetToDemo: () => Promise<void>;

  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [page, setPageState] = useState<Page>("home");
  const [adminTab, setAdminTab] = useState<AdminTab>("overview");

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState<CartLine[]>(() => cartStorage.getCart());
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const cartCount = useMemo(() => cart.reduce((s, l) => s + l.qty, 0), [cart]);

  useEffect(() => {
    cartStorage.saveCart(cart);
  }, [cart]);

  const loadData = async () => {
    try {
      setLoading(true);

      const menuRes = await fetch(`${API_BASE_URL}/menu`);
      if (menuRes.ok) {
        const menuResult = await menuRes.json();
        const rawMenu = menuResult.data || menuResult;
        const formattedMenu: MenuItem[] = Array.isArray(rawMenu)
          ? rawMenu.map((m: any) => ({
              id: m.id,
              name: m.name || "",
              description: m.description || "",
              price: Number(m.price) || 0,
              discountPrice: m.discountPrice || m.discount_price || undefined,
              category: typeof m.category === "string" ? m.category : (m.categories?.name || m.category_name || "Rice"),
              image: m.image || m.image_url || "https://images.unsplash.com/photo-1665332195309-9d75071138f0?w=800&h=600&fit=crop&auto=format",
              available: m.available !== undefined ? Boolean(m.available) : (m.is_available !== undefined ? Boolean(m.is_available) : true),
              featured: m.featured !== undefined ? Boolean(m.featured) : Boolean(m.is_featured_this_week),
              isSpecial: m.isSpecial !== undefined ? Boolean(m.isSpecial) : Boolean(m.is_special),
              ingredients: Array.isArray(m.ingredients) ? m.ingredients : (typeof m.ingredients === "string" ? m.ingredients.split(",") : []),
              preparationTime: m.preparationTime || m.preparation_time || "20-30 mins",
              createdAt: m.createdAt || m.created_at,
            }))
          : [];
        setMenu(formattedMenu);
      }

      const ordersRes = await fetch(`${API_BASE_URL}/orders`, {
        headers: getAuthHeaders(),
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const rawOrders = ordersData.data || ordersData;
        if (Array.isArray(rawOrders)) {
          setOrders(rawOrders);
        }
      }

      const catRes = await fetch(`${API_BASE_URL}/categories`);
      if (catRes.ok) {
        const catData = await catRes.json();
        const rawCats = catData.data || catData;
        if (Array.isArray(rawCats) && rawCats.length > 0) {
          setCategories(rawCats);
        }
      }
    } catch (err) {
      console.error("Error loading application state from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUrl = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === "/admin" || path.startsWith("/admin/") || hash === "#admin" || hash === "#/admin") {
        setPageState("admin");
      }
    };
    handleUrl();

    window.addEventListener("popstate", handleUrl);
    return () => window.removeEventListener("popstate", handleUrl);
  }, []);

  const setPage = (p: Page) => {
    setPageState(p);
    if (p === "admin") {
      window.history.pushState(null, "", "#admin");
    } else if (window.location.hash === "#admin" || window.location.hash === "#/admin") {
      window.history.pushState(null, "", window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const go = (p: Page) => setPage(p);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  };

  const addLine = (item: MenuItem, qty: number, extras: string[], instructions: string) => {
    const key = `${item.id}-${[...extras].sort().join(",")}-${instructions.trim()}`;
    setCart(prev => {
      const existing = prev.find(l => l.key === key);
      if (existing) {
        return prev.map(l => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { key, item, qty, extras, instructions }];
    });
    flash(`${qty}× ${item.name} added to cart`);
  };

  const quickAdd = (item: MenuItem) => {
    if (!item.available) {
      flash(`${item.name} is currently sold out`);
      return;
    }
    addLine(item, 1, [], "");
  };

  const setQty = (key: string, qty: number) => {
    if (qty <= 0) {
      removeLine(key);
      return;
    }
    setCart(prev => prev.map(l => (l.key === key ? { ...l, qty } : l)));
  };

  const removeLine = (key: string) => {
    setCart(prev => prev.filter(l => l.key !== key));
    flash("Item removed from cart");
  };

  const clearCart = () => {
    setCart([]);
    cartStorage.clearCart();
  };

  const placeCustomerOrder = async (orderData: any): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: orderData.customerName || orderData.fullName || orderData.full_name,
          phone_number: orderData.phone || orderData.customerPhone || orderData.phoneNumber || orderData.phone_number,
          delivery_address: orderData.deliveryAddress || orderData.delivery_address,
          delivery_type: orderData.deliveryType || orderData.type || orderData.delivery_type || "Food Delivery",
          payment_method: orderData.paymentMethod || orderData.payment_method || "Pay on Delivery",
          order_notes: orderData.orderNotes || orderData.notes || orderData.order_notes || "",
          items: cart.map(line => ({
            menu_item_id: line.item.id,
            name: line.item.name,
            quantity: line.qty,
            price: line.item.discountPrice || line.item.price,
            special_instructions: line.instructions || ""
          })),
          subtotal: orderData.subtotal,
          delivery_fee: orderData.deliveryFee || orderData.delivery_fee || 0,
          total: orderData.total
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to place order");
      }

      const orderNumber = result.order_number || result.data?.order_number || result.data?.id || `PB-${Math.floor(1000 + Math.random() * 9000)}`;
      const savedOrder = result.data || {};

      const customerName = orderData.customerName || orderData.fullName || orderData.full_name;
      const phone = orderData.phone || orderData.customerPhone || orderData.phoneNumber || orderData.phone_number;
      const address = orderData.deliveryAddress || orderData.delivery_address;
      const deliveryType = orderData.deliveryType || orderData.type || orderData.delivery_type || "Food Delivery";
      const paymentMethod = orderData.paymentMethod || orderData.payment_method || "Pay on Delivery";

      const itemsList = cart.map(l => `- ${l.qty}x ${l.item.name} (₦${((l.item.discountPrice || l.item.price) * l.qty).toLocaleString()})`).join("\n");

      const message = `Hello PB DELICACIES, I just placed an order!\n\n` +
        `*Order Number:* ${orderNumber}\n` +
        `*Name:* ${customerName}\n` +
        `*Phone:* ${phone}\n` +
        `*Delivery Type:* ${deliveryType}\n` +
        `*Address:* ${address}\n` +
        `*Payment Method:* ${paymentMethod}\n\n` +
        `*Items:*\n${itemsList}\n\n` +
        `*Subtotal:* ₦${orderData.subtotal?.toLocaleString()}\n` +
        `*Delivery Fee:* ₦${(orderData.deliveryFee || orderData.delivery_fee || 0).toLocaleString()}\n` +
        `*Total:* ₦${orderData.total?.toLocaleString()}`;

      const whatsappNumber = "2348150781152";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      const newOrder: Order = {
        id: savedOrder.order_number || orderNumber,
        customerName,
        customerPhone: phone,
        customerEmail: orderData.customerEmail,
        deliveryAddress: address,
        deliveryArea: orderData.deliveryArea || "Ido-Ekiti",
        orderNotes: orderData.orderNotes || orderData.notes,
        preferredTime: orderData.preferredTime,
        type: deliveryType,
        paymentMethod,
        paymentStatus: "Pending",
        status: (savedOrder.status as OrderStatus) || "New Order",
        items: cart.map(l => ({
          id: typeof l.item.id === "number" ? l.item.id : 1,
          name: l.item.name,
          price: l.item.discountPrice || l.item.price,
          quantity: l.qty,
          image: l.item.image,
          extras: l.extras,
          instructions: l.instructions,
          total: (l.item.discountPrice || l.item.price) * l.qty,
        })),
        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee || 0,
        total: orderData.total,
        createdAt: savedOrder.created_at || new Date().toISOString(),
      };

      setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
      clearCart();
      flash(`Order #${orderNumber} placed successfully!`);
      return newOrder;
    } catch (error: any) {
      console.error("Order placement error:", error);
      flash(error.message || "Error placing order");
      throw error;
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, "id" | "createdAt"> | any): Promise<MenuItem> => {
    try {
      const isFormData = typeof FormData !== "undefined" && item instanceof FormData;
      const headers: Record<string, string> = {
        ...getAuthHeaders(),
      };
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`${API_BASE_URL}/menu`, {
        method: "POST",
        headers,
        body: isFormData ? item : JSON.stringify(item),
      });

      const result = await res.json();
      if (!res.ok) {
        if (res.status === 401) clearAdminTokens();
        throw new Error(result.message || "Failed to create menu item");
      }

      const m = result.data || result;
      const created: MenuItem = {
        id: m.id,
        name: m.name || (isFormData ? "" : item.name),
        description: m.description || (isFormData ? "" : item.description),
        price: Number(m.price) || (isFormData ? 0 : item.price),
        discountPrice: m.discountPrice || m.discount_price || (isFormData ? undefined : item.discountPrice),
        category: typeof m.category === "string" ? m.category : (m.categories?.name || (isFormData ? "Rice" : item.category) || "Rice"),
        image: m.image || m.image_url || (isFormData ? "" : item.image),
        available: m.available !== undefined ? Boolean(m.available) : (m.is_available !== undefined ? Boolean(m.is_available) : (isFormData ? true : item.available)),
        featured: m.featured !== undefined ? Boolean(m.featured) : (m.is_featured_this_week !== undefined ? Boolean(m.is_featured_this_week) : (isFormData ? false : item.featured)),
        isSpecial: m.isSpecial !== undefined ? Boolean(m.isSpecial) : (isFormData ? false : item.isSpecial),
        ingredients: m.ingredients || (isFormData ? [] : item.ingredients),
        preparationTime: m.preparationTime || m.preparation_time || (isFormData ? "20-30 mins" : item.preparationTime),
        createdAt: m.createdAt || m.created_at || new Date().toISOString(),
      };

      setMenu(prev => [created, ...prev]);
      flash(`"${created.name}" added to menu successfully`);
      return created;
    } catch (err: any) {
      flash(err.message || "Error adding menu item");
      throw err;
    }
  };

  const updateMenuItem = async (id: number | string, updates: Partial<MenuItem> | any): Promise<MenuItem> => {
    try {
      const isFormData = typeof FormData !== "undefined" && updates instanceof FormData;
      const headers: Record<string, string> = {
        ...getAuthHeaders(),
      };
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: "PUT",
        headers,
        body: isFormData ? updates : JSON.stringify(updates),
      });

      const result = await res.json();
      if (!res.ok) {
        if (res.status === 401) clearAdminTokens();
        throw new Error(result.message || "Failed to update item");
      }

      const m = result.data || result;
      const updated: MenuItem = {
        id: m.id || id,
        name: m.name !== undefined ? m.name : (isFormData ? "" : (updates.name || "")),
        description: m.description !== undefined ? m.description : (isFormData ? "" : (updates.description || "")),
        price: m.price !== undefined ? Number(m.price) : (isFormData ? 0 : (updates.price || 0)),
        discountPrice: m.discountPrice || m.discount_price || (isFormData ? undefined : updates.discountPrice),
        category: typeof m.category === "string" ? m.category : (m.categories?.name || (isFormData ? "Rice" : updates.category) || "Rice"),
        image: m.image || m.image_url || (isFormData ? "" : updates.image),
        available: m.available !== undefined ? Boolean(m.available) : (m.is_available !== undefined ? Boolean(m.is_available) : (isFormData ? true : (updates.available ?? true))),
        featured: m.featured !== undefined ? Boolean(m.featured) : (m.is_featured_this_week !== undefined ? Boolean(m.is_featured_this_week) : (isFormData ? false : Boolean(updates.featured))),
        isSpecial: m.isSpecial !== undefined ? Boolean(m.isSpecial) : (isFormData ? false : Boolean(updates.isSpecial)),
        ingredients: m.ingredients || (isFormData ? [] : updates.ingredients),
        preparationTime: m.preparationTime || m.preparation_time || (isFormData ? "20-30 mins" : updates.preparationTime),
      };

      setMenu(prev => prev.map(item => (String(item.id) === String(id) ? { ...item, ...updated } : item)));
      flash(`"${updated.name || "Item"}" updated successfully`);
      return updated;
    } catch (err: any) {
      flash(err.message || "Error updating menu item");
      throw err;
    }
  };

  const deleteMenuItem = async (id: number | string): Promise<boolean> => {
    try {
      const itemToDelete = menu.find(m => String(m.id) === String(id));
      const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (res.ok) {
        setMenu(prev => prev.filter(m => String(m.id) !== String(id)));
        flash(`"${itemToDelete?.name || "Item"}" deleted successfully`);
        return true;
      }

      if (res.status === 401 || res.status === 403) {
        clearAdminTokens();
        flash("Session expired. Please log in again as admin.");
        return false;
      }

      const errData = await res.json().catch(() => ({}));
      flash(errData.message || "Error deleting item from server");
      return false;
    } catch (err) {
      console.error("Error deleting menu item:", err);
      flash("Network error: Could not reach server");
      return false;
    }
  };

  const toggleAvailability = async (id: number | string): Promise<MenuItem> => {
    const target = menu.find(m => String(m.id) === String(id));
    const newStatus = !target?.available;
    return updateMenuItem(id, { available: newStatus });
  };

  const updateItemPrice = async (id: number | string, price: number): Promise<MenuItem> => {
    return updateMenuItem(id, { price });
  };

  const addCategory = async (cat: Omit<Category, "id">): Promise<Category> => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(cat),
      });
      const result = await res.json();
      if (!res.ok) {
        if (res.status === 401) clearAdminTokens();
        throw new Error(result.message || "Failed to create category");
      }

      const created = result.data || result;
      setCategories(prev => [...prev, created]);
      flash(`Category "${created.name}" created`);
      return created;
    } catch (err: any) {
      flash(err.message || "Error adding category");
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category> => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updates),
      });
      const result = await res.json();
      if (!res.ok) {
        if (res.status === 401) clearAdminTokens();
        throw new Error(result.message || "Failed to update category");
      }

      const updated = result.data || result;
      setCategories(prev => prev.map(c => (String(c.id) === String(id) ? { ...c, ...updated } : c)));
      flash(`Category "${updated.name || "Category"}" updated`);
      return updated;
    } catch (err: any) {
      flash(err.message || "Error updating category");
      throw err;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const target = categories.find(c => String(c.id) === String(id));
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (res.ok) {
        setCategories(prev => prev.filter(c => String(c.id) !== String(id)));
        flash(`Category "${target?.name || "Category"}" deleted`);
        return true;
      }
      if (res.status === 401) clearAdminTokens();
      return false;
    } catch (err) {
      flash("Error deleting category");
      return false;
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (!res.ok && res.status === 401) clearAdminTokens();
      const updated = result.data || { id, status };
      setOrders(prev => prev.map(o => (String(o.id) === String(id) ? { ...o, status } : o)));
      flash(`Order #${id} status updated to ${status}`);
      return updated;
    } catch (err) {
      flash("Failed to update order status");
      throw err;
    }
  };

  const deleteOrder = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => String(o.id) !== String(id)));
        flash(`Order #${id} deleted`);
        return true;
      }
      if (res.status === 401) clearAdminTokens();
      return false;
    } catch (err) {
      flash("Error deleting order");
      return false;
    }
  };

  const updateSettings = async (updates: Partial<SiteSettings>): Promise<SiteSettings> => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    flash("Website settings saved successfully");
    return newSettings;
  };

  const updateBusinessInfo = async (info: Partial<BusinessInfo>): Promise<SiteSettings> => {
    const updatedSettings = {
      ...settings,
      business: { ...settings.business, ...info }
    };
    setSettings(updatedSettings);
    flash("Business information updated");
    return updatedSettings;
  };

  const updateHeroContent = async (hero: Partial<HeroContent>): Promise<SiteSettings> => {
    const updatedSettings = {
      ...settings,
      hero: { ...settings.hero, ...hero }
    };
    setSettings(updatedSettings);
    flash("Hero banner updated");
    return updatedSettings;
  };

  const updateTestimonials = async (testimonials: Testimonial[]): Promise<SiteSettings> => {
    const updatedSettings = { ...settings, testimonials };
    setSettings(updatedSettings);
    flash("Customer reviews updated");
    return updatedSettings;
  };

  const resetToDemo = async (): Promise<void> => {
    await loadData();
    flash("All data refreshed from database");
  };

  return (
    <AppContext.Provider
      value={{
        page,
        setPage,
        adminTab,
        setAdminTab,
        go,
        menu,
        categories,
        orders,
        customers,
        settings,
        loading,
        detailItem,
        setDetailItem,
        toast,
        flash,
        cart,
        cartCount,
        addLine,
        quickAdd,
        setQty,
        removeLine,
        clearCart,
        placeCustomerOrder,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleAvailability,
        updateItemPrice,
        addCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus,
        deleteOrder,
        updateSettings,
        updateBusinessInfo,
        updateHeroContent,
        updateTestimonials,
        resetToDemo,
        refreshAllData: loadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppContextProvider");
  }
  return ctx;
}