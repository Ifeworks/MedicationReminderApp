import React, { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useApp } from "../../context/AppContext";
import type { AdminTab } from "../../types";
import { Logo } from "../common/Logo";
import Icon, { type IconName } from "../common/Icon";

import DashboardOverview from "./DashboardOverview";
import MenuManagement from "./MenuManagement";
import CategoryManagement from "./CategoryManagement";
import OrderManagement from "./OrderManagement";
import CustomerManagement from "./CustomerManagement";
import WeeklyMenuSettings from "./WeeklyMenuSettings";
import ContentManagement from "./ContentManagement";
import WebsiteSettings from "./WebsiteSettings";

interface NavTabItem {
  tab: AdminTab;
  label: string;
  icon: IconName;
  badge?: number;
}

export function AdminLayout() {
  const { currentUser, logout } = useAdminAuth();
  const { adminTab, setAdminTab, go, orders, menu, settings } = useApp();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const pendingOrdersCount = orders.filter(
    o => o.status === "New Order" || o.status === "Confirmed" || o.status === "Preparing"
  ).length;

  const NAV_TABS: NavTabItem[] = [
    { tab: "overview", label: "Dashboard Overview", icon: "dashboard" },
    { tab: "orders", label: "Orders Management", icon: "orders", badge: pendingOrdersCount },
    { tab: "menu", label: "Menu & Catalogue", icon: "food", badge: menu.length },
    { tab: "categories", label: "Food Categories", icon: "categories" },
    { tab: "weekly", label: "Weekly Menu & Specials", icon: "calendar" },
    { tab: "customers", label: "Customers", icon: "users" },
    { tab: "content", label: "Website Content", icon: "content" },
    { tab: "settings", label: "Settings & Business", icon: "settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* ------------------------------------------------------------- */}
      {/*  DESKTOP SIDEBAR                                              */}
      {/* ------------------------------------------------------------- */}
      <aside
        className="hidden md:flex md:w-64 lg:w-72 flex-col justify-between border-r border-border p-5 sticky top-0 h-screen overflow-y-auto"
        style={{ background: "rgba(251, 246, 238, 0.98)" }}
      >
        <div>
          {/* Logo */}
          <div className="pb-6 border-b border-border/80 flex items-center justify-between">
            <Logo badgeText="Admin" size="sm" />
          </div>

          {/* Nav items */}
          <div className="mt-6 space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider px-3 mb-2" style={{ color: "var(--muted-foreground)" }}>
              Management
            </div>
            {NAV_TABS.map(item => {
              const isActive = adminTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setAdminTab(item.tab)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all text-left group"
                  style={{
                    background: isActive ? "var(--primary)" : "transparent",
                    color: isActive ? "#fff" : "var(--foreground)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ color: isActive ? "#fff" : "var(--primary)" }}>
                      <Icon name={item.icon} size={18} />
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full font-bold shadow-xs"
                      style={{
                        background: isActive ? "rgba(255,255,255,0.25)" : "var(--secondary)",
                        color: isActive ? "#fff" : "var(--secondary-foreground)",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom User info & Customer store button */}
        <div className="pt-4 border-t border-border space-y-2">
          <button
            onClick={() => go("home")}
            className="w-full py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border border-border hover:bg-secondary transition-colors"
            style={{ color: "var(--brown)" }}
          >
            <Icon name="external" size={14} />
            <span>View Customer Website</span>
          </button>

          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                style={{ background: "var(--secondary)", color: "var(--primary)" }}
              >
                {currentUser?.username?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate" style={{ color: "var(--brown)" }}>
                  {currentUser?.username || "Admin"}
                </div>
                <div className="text-[10px] capitalize text-muted-foreground">
                  {currentUser?.role?.replace("_", " ") || "Administrator"}
                </div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Log out"
              className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
            >
              <Icon name="logout" size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/*  MAIN ADMIN CONTENT AREA                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header
          className="sticky top-0 z-30 border-b border-border h-16 px-4 sm:px-8 flex items-center justify-between gap-4"
          style={{ background: "rgba(251, 246, 238, 0.92)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileDrawerOpen(o => !o)}
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary"
              style={{ color: "var(--brown)" }}
              aria-label="Toggle navigation"
            >
              <Icon name={mobileDrawerOpen ? "close" : "menu"} size={20} />
            </button>

            <div>
              <div className="text-[11px] uppercase font-bold tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                PB DELICACIES Backend
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold leading-tight" style={{ color: "var(--brown)" }}>
                {NAV_TABS.find(t => t.tab === adminTab)?.label || "Dashboard"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => go("home")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border hover:bg-secondary transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--brown)" }}
            >
              <Icon name="external" size={13} />
              <span>Customer Store</span>
            </button>

            {pendingOrdersCount > 0 && (
              <button
                onClick={() => setAdminTab("orders")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs animate-pulse"
                style={{ background: "rgba(181, 71, 31, 0.12)", color: "var(--primary)" }}
              >
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>{pendingOrdersCount} Pending Order{pendingOrdersCount > 1 ? "s" : ""}</span>
              </button>
            )}
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div
            className="md:hidden border-b border-border px-4 py-4 space-y-1 animate-float-up shadow-lg"
            style={{ background: "var(--background)" }}
          >
            {NAV_TABS.map(item => {
              const isActive = adminTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    setAdminTab(item.tab);
                    setMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    background: isActive ? "var(--primary)" : "transparent",
                    color: isActive ? "#fff" : "var(--foreground)",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: isActive ? "rgba(255,255,255,0.3)" : "var(--secondary)" }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 mt-3 border-t border-border flex items-center justify-between">
              <button
                onClick={() => {
                  go("home");
                  setMobileDrawerOpen(false);
                }}
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-border"
              >
                View Customer Store
              </button>
              <button
                onClick={() => logout()}
                className="text-xs font-bold text-primary px-3 py-2 rounded-xl"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Active Tab View */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {adminTab === "overview" && <DashboardOverview />}
          {adminTab === "menu" && <MenuManagement />}
          {adminTab === "categories" && <CategoryManagement />}
          {adminTab === "orders" && <OrderManagement />}
          {adminTab === "customers" && <CustomerManagement />}
          {adminTab === "weekly" && <WeeklyMenuSettings />}
          {adminTab === "content" && <ContentManagement />}
          {adminTab === "settings" && <WebsiteSettings />}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
