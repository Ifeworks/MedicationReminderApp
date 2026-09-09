import React, { useState } from "react";
import { AppContextProvider, useApp } from "./context/AppContext";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import type { Order } from "./types";

// Common components
import Toast from "./components/common/Toast";
import Icon from "./components/common/Icon";

// Customer components
import Header from "./components/customer/Header";
import Footer from "./components/customer/Footer";
import HomeView from "./components/customer/HomeView";
import MenuView from "./components/customer/MenuView";
import CartView from "./components/customer/CartView";
import CheckoutView from "./components/customer/CheckoutView";
import ConfirmView from "./components/customer/ConfirmView";
import CookingView from "./components/customer/CookingView";
import ContactView from "./components/customer/ContactView";
import DetailModal from "./components/customer/DetailModal";

// Admin components
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./components/admin/AdminLogin";

function AppContent() {
  const { page, go, detailItem, setDetailItem, addLine, toast, settings } = useApp();
  const { isAuthenticated, loading: authLoading } = useAdminAuth();

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handleOrderPlaced = (order: Order) => {
    setConfirmedOrder(order);
    go("confirm");
  };

  const waFloatingLink = `https://wa.me/${settings.business.whatsapp}?text=${encodeURIComponent(
    "Hello PB DELICACIES, I would like to place an order."
  )}`;

  // If in Admin Section
  if (page === "admin") {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold text-brown">Loading Management Portal...</span>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-background flex flex-col justify-between">
          <AdminLogin />
          <Toast message={toast} />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <AdminLayout />
        <Toast message={toast} />
      </div>
    );
  }

  // Customer Section
  return (
    <div className="min-h-full flex flex-col bg-background text-foreground selection:bg-secondary selection:text-primary">
      <Header />

      <main className="flex-1 pb-16">
        {page === "home" && <HomeView />}
        {page === "menu" && <MenuView />}
        {page === "cooking" && <CookingView />}
        {page === "contact" && <ContactView />}
        {page === "cart" && <CartView />}
        {page === "checkout" && <CheckoutView onOrderPlaced={handleOrderPlaced} />}
        {page === "confirm" && confirmedOrder && <ConfirmView order={confirmedOrder} />}
      </main>

      <Footer />

      {/* Floating WhatsApp Action Button */}
      <a
        href={waFloatingLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group focus:outline-none"
        style={{ background: "var(--green)", color: "#fff" }}
        aria-label="Chat on WhatsApp"
      >
        <Icon name="whatsapp" size={28} />
        <span className="absolute right-16 bg-card border border-border text-brown px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Order on WhatsApp
        </span>
      </a>

      {/* Food Detail & Customization Modal */}
      {detailItem && (
        <DetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onAdd={(qty, extras, instructions) => {
            addLine(detailItem, qty, extras, instructions);
            setDetailItem(null);
          }}
        />
      )}

      {/* Global Toast Alerts */}
      <Toast message={toast} />
    </div>
  );
}

export default function App() {
  return (
    <AppContextProvider>
      <AdminAuthProvider>
        <AppContent />
      </AdminAuthProvider>
    </AppContextProvider>
  );
}
