import React from "react";
import { useApp } from "../../context/AppContext";
import { OrderStatusBadge } from "../common/Badge";
import Icon from "../common/Icon";
import type { OrderStatus } from "../../types";

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export function DashboardOverview() {
  const { orders, menu, customers, settings, setAdminTab, updateOrderStatus } = useApp();

  // Calculate Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    o => o.status === "New Order" || o.status === "Confirmed" || o.status === "Preparing"
  ).length;
  const completedOrders = orders.filter(o => o.status === "Delivered").length;
  const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;

  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const availableItems = menu.filter(m => m.available).length;
  const soldOutItems = menu.length - availableItems;

  const recentOrders = orders.slice(0, 5);

  const STATUS_FLOW: OrderStatus[] = [
    "New Order",
    "Confirmed",
    "Preparing",
    "Ready",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  const handleCycleStatus = (orderId: string, currentStatus: OrderStatus) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    const nextStatus = STATUS_FLOW[(currentIndex + 1) % STATUS_FLOW.length];
    updateOrderStatus(orderId, nextStatus);
  };

  return (
    <div className="space-y-8 animate-float-up">
      {/* Top Banner / Week label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card rounded-3xl p-6 border border-border shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gold)" }}>
            Current Operating Week
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-0.5" style={{ color: "var(--brown)" }}>
            {settings.weekLabel}
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            All orders, catalogue items and prices sync live with your customer website.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setAdminTab("menu")}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold shadow-sm transition-transform hover:scale-105"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            <Icon name="plus" size={14} />
            <span>Add Meal</span>
          </button>

          <button
            onClick={() => setAdminTab("orders")}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold border hover:bg-secondary transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--brown)" }}
          >
            <Icon name="orders" size={14} />
            <span>Manage Orders</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-card rounded-3xl p-5 sm:p-6 border border-border shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Revenue</span>
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(74, 107, 61, 0.12)", color: "var(--green)" }}>
              <Icon name="dollar" size={18} />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold mt-3" style={{ color: "var(--primary)" }}>
            {naira(totalRevenue)}
          </div>
          <div className="text-[11px] mt-1 text-muted-foreground flex items-center gap-1">
            <Icon name="trending" size={12} />
            <span>From {totalOrders - cancelledOrders} confirmed orders</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-card rounded-3xl p-5 sm:p-6 border border-border shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending Orders</span>
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(217, 138, 61, 0.15)", color: "var(--gold)" }}>
              <Icon name="clock" size={18} />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold mt-3" style={{ color: "var(--brown)" }}>
            {pendingOrders}
          </div>
          <div className="text-[11px] mt-1 text-muted-foreground">
            Needs preparation / delivery
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-card rounded-3xl p-5 sm:p-6 border border-border shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Completed</span>
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(74, 107, 61, 0.12)", color: "var(--green)" }}>
              <Icon name="check" size={18} />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold mt-3" style={{ color: "var(--brown)" }}>
            {completedOrders}
          </div>
          <div className="text-[11px] mt-1 text-muted-foreground">
            Successfully delivered
          </div>
        </div>

        {/* Catalogue Food Items */}
        <div className="bg-card rounded-3xl p-5 sm:p-6 border border-border shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Food Items</span>
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
              <Icon name="food" size={18} />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold mt-3" style={{ color: "var(--brown)" }}>
            {menu.length}
          </div>
          <div className="text-[11px] mt-1 flex items-center gap-2">
            <span className="text-emerald-700 font-semibold">{availableItems} Available</span>
            <span>·</span>
            <span className="text-rose-700 font-semibold">{soldOutItems} Sold out</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders + Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Recent Orders Table / Feed */}
        <div className="lg:col-span-2 bg-card rounded-3xl border border-border p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold" style={{ color: "var(--brown)" }}>
                Recent Customer Orders
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Click status badge to cycle progress</p>
            </div>
            <button
              onClick={() => setAdminTab("orders")}
              className="text-xs font-bold hover:underline"
              style={{ color: "var(--primary)" }}
            >
              View all ({orders.length}) →
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No orders received yet. Place an order on the customer website to test!
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(o => (
                <div
                  key={o.id}
                  className="rounded-2xl border border-border p-4 hover:shadow-xs transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background/40"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm" style={{ color: "var(--primary)" }}>
                        #{o.id}
                      </span>
                      <span className="font-bold text-sm truncate" style={{ color: "var(--brown)" }}>
                        {o.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground">({o.customerPhone})</span>
                    </div>

                    <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {o.items.map(i => `${i.quantity}× ${i.name}`).join(", ")}
                    </div>

                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {o.deliveryArea} · {new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0">
                    <span className="font-serif font-bold text-base" style={{ color: "var(--brown)" }}>
                      {naira(o.total)}
                    </span>

                    <button
                      onClick={() => handleCycleStatus(o.id, o.status)}
                      title="Click to advance status"
                      className="transition-transform hover:scale-105 active:scale-95"
                    >
                      <OrderStatusBadge status={o.status} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Insights & Shortcuts */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-card rounded-3xl border border-border p-6 shadow-xs">
            <h3 className="font-serif text-lg font-bold mb-4" style={{ color: "var(--brown)" }}>
              Quick Management
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => setAdminTab("menu")}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-border hover:bg-secondary transition-colors text-left text-xs sm:text-sm font-semibold"
                style={{ color: "var(--brown)" }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon name="food" size={17} />
                  <span>Update Food Prices / Stock</span>
                </div>
                <Icon name="arrow" size={14} />
              </button>

              <button
                onClick={() => setAdminTab("weekly")}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-border hover:bg-secondary transition-colors text-left text-xs sm:text-sm font-semibold"
                style={{ color: "var(--brown)" }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon name="calendar" size={17} />
                  <span>Edit This Weekend's Menu</span>
                </div>
                <Icon name="arrow" size={14} />
              </button>

              <button
                onClick={() => setAdminTab("content")}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-border hover:bg-secondary transition-colors text-left text-xs sm:text-sm font-semibold"
                style={{ color: "var(--brown)" }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon name="content" size={17} />
                  <span>Edit Homepage & Reviews</span>
                </div>
                <Icon name="arrow" size={14} />
              </button>
            </div>
          </div>

          {/* Top Categories / Food Breakdown */}
          <div className="bg-card rounded-3xl border border-border p-6 shadow-xs">
            <h3 className="font-serif text-lg font-bold mb-3" style={{ color: "var(--brown)" }}>
              Customer Summary
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1 border-b border-border/60">
                <span className="text-muted-foreground">Registered / Active Customers</span>
                <span className="font-bold">{customers.length}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/60">
                <span className="text-muted-foreground">VIP Loyal Customers</span>
                <span className="font-bold">{customers.filter(c => c.status === "VIP").length}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Standard Delivery Fee</span>
                <span className="font-bold">{naira(settings.business.deliveryFee)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
