import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import type { Order, OrderStatus } from "../../types";
import { OrderStatusBadge } from "../common/Badge";
import Icon from "../common/Icon";
import Modal from "../common/Modal";
import ConfirmDialog from "../common/ConfirmDialog";

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

const ALL_STATUSES: OrderStatus[] = [
  "New Order",
  "Confirmed",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export function OrderManagement() {
  const { orders, updateOrderStatus, deleteOrder, settings } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchesStatus = selectedStatus === "All" || o.status === selectedStatus;
    const matchesSearch =
      !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.deliveryArea.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder(prev => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingOrder) {
      await deleteOrder(deletingOrder.id);
      if (viewingOrder?.id === deletingOrder.id) {
        setViewingOrder(null);
      }
      setDeletingOrder(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getCustomerWhatsAppLink = (order: Order) => {
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, "");
    const intPhone = cleanPhone.startsWith("0") ? "234" + cleanPhone.slice(1) : cleanPhone;
    const msg = `Hello ${order.customerName}, this is PB DELICACIES regarding your order #${order.id}. Current status: *${order.status}*.`;
    return `https://wa.me/${intPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-6 animate-float-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: "var(--brown)" }}>
            Customer Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor incoming orders, transition delivery states, print slips, and contact customers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground">
            Total Orders: {orders.length}
          </span>
        </div>
      </div>

      {/* Toolbar: Search & Status Filters */}
      <div className="bg-card rounded-3xl p-4 sm:p-5 border border-border shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <Icon name="search" size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by order #, name, phone, area..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm focus:outline-none focus:ring-2"
            style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {["All", ...ALL_STATUSES].map(status => {
            const isActive = selectedStatus === status;
            const count = status === "All" ? orders.length : orders.filter(o => o.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 flex-shrink-0"
                style={{
                  background: isActive ? "var(--primary)" : "var(--background)",
                  color: isActive ? "#fff" : "var(--foreground)",
                  border: `1px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
                }}
              >
                <span>{status}</span>
                <span
                  className="text-[10px] px-1.5 py-0.2 rounded-full"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.25)" : "var(--muted)",
                    color: isActive ? "#fff" : "var(--muted-foreground)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-border bg-background/50 text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer & Location</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Total & Payment</th>
                <th className="py-3.5 px-4">Status Flow</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    {/* ID & Date */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="font-mono font-bold text-sm" style={{ color: "var(--primary)" }}>
                        #{order.id}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <div className="font-bold truncate" style={{ color: "var(--brown)" }}>
                        {order.customerName}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Icon name="phone" size={11} /> {order.customerPhone}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-xs mt-0.5">
                        {order.deliveryArea} · {order.type}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-4 px-4">
                      <div className="text-xs font-medium max-w-xs line-clamp-2">
                        {order.items.map(i => `${i.quantity}× ${i.name}`).join(", ")}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} total dish(es)
                      </div>
                    </td>

                    {/* Total & Payment */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-serif font-bold text-sm" style={{ color: "var(--primary)" }}>
                        {naira(order.total)}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {order.paymentMethod} ({order.paymentStatus})
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1 rounded-full text-xs font-bold border border-border bg-background focus:outline-none cursor-pointer"
                      >
                        {ALL_STATUSES.map(st => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="px-3 py-1.5 rounded-xl border border-border hover:bg-secondary text-xs font-semibold flex items-center gap-1 text-brown"
                          title="View order details"
                        >
                          <Icon name="eye" size={13} />
                          <span>Details</span>
                        </button>
                        <a
                          href={getCustomerWhatsAppLink(order)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-xl border border-border text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Message customer on WhatsApp"
                        >
                          <Icon name="whatsapp" size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Receipt Modal */}
      {viewingOrder && (
        <Modal
          isOpen={!!viewingOrder}
          onClose={() => setViewingOrder(null)}
          title={`Order #${viewingOrder.id}`}
          subtitle={`Placed on ${new Date(viewingOrder.createdAt).toLocaleString("en-NG")}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Status & Quick Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-secondary/50 border border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--brown)" }}>
                  Current Status:
                </span>
                <OrderStatusBadge status={viewingOrder.status} />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={viewingOrder.status}
                  onChange={e => handleStatusChange(viewingOrder.id, e.target.value as OrderStatus)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-border bg-card focus:outline-none"
                >
                  {ALL_STATUSES.map(st => (
                    <option key={st} value={st}>
                      Update to {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl border border-border bg-background/50">
                <div className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--brown)" }}>
                  Customer Information
                </div>
                <div className="font-bold text-base">{viewingOrder.customerName}</div>
                <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                  <Icon name="phone" size={13} /> {viewingOrder.customerPhone}
                </div>
                {viewingOrder.customerEmail && (
                  <div className="mt-0.5 text-muted-foreground">{viewingOrder.customerEmail}</div>
                )}
              </div>

              <div className="p-4 rounded-2xl border border-border bg-background/50">
                <div className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--brown)" }}>
                  Fulfillment & Location
                </div>
                <div className="font-bold">{viewingOrder.type}</div>
                <div className="mt-1 text-muted-foreground">{viewingOrder.deliveryAddress}</div>
                <div className="text-muted-foreground">Area: {viewingOrder.deliveryArea}</div>
                {viewingOrder.preferredTime && (
                  <div className="mt-1 font-semibold text-primary">Time: {viewingOrder.preferredTime}</div>
                )}
              </div>
            </div>

            {/* Special Notes */}
            {viewingOrder.orderNotes && (
              <div className="p-3 rounded-2xl border border-border bg-amber-50/60 text-xs">
                <span className="font-bold text-amber-900">Customer Note:</span>{" "}
                <span className="text-amber-800">{viewingOrder.orderNotes}</span>
              </div>
            )}

            {/* Item Breakdown */}
            <div className="border border-border rounded-2xl overflow-hidden">
              <div className="p-3 bg-background/70 border-b border-border text-xs font-bold uppercase tracking-wider" style={{ color: "var(--brown)" }}>
                Ordered Food Items
              </div>
              <div className="divide-y divide-border/60 p-2">
                {viewingOrder.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-primary">{it.quantity}×</span>{" "}
                      <span className="font-semibold">{it.name}</span>
                      {it.extras && it.extras.length > 0 && (
                        <div className="text-[11px] text-muted-foreground">+ {it.extras.join(", ")}</div>
                      )}
                      {it.instructions && (
                        <div className="text-[11px] text-muted-foreground italic">"{it.instructions}"</div>
                      )}
                    </div>
                    <span className="font-bold tabular-nums">{naira(it.total)}</span>
                  </div>
                ))}
              </div>

              {/* Subtotals & Total */}
              <div className="bg-background/40 p-4 border-t border-border space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{naira(viewingOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee ({viewingOrder.type})</span>
                  <span>{naira(viewingOrder.deliveryFee)}</span>
                </div>
                <div className="h-px my-2" style={{ background: "var(--border)" }} />
                <div className="flex justify-between items-baseline font-bold">
                  <span className="text-base" style={{ color: "var(--brown)" }}>Total Amount</span>
                  <span className="font-serif text-xl" style={{ color: "var(--primary)" }}>
                    {naira(viewingOrder.total)}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Payment: {viewingOrder.paymentMethod} ({viewingOrder.paymentStatus})
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setDeletingOrder(viewingOrder)}
                className="px-4 py-2 rounded-full border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors"
              >
                Delete Order Record
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={getCustomerWhatsAppLink(viewingOrder)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5"
                  style={{ background: "var(--green)", color: "#fff" }}
                >
                  <Icon name="whatsapp" size={14} />
                  <span>Notify via WhatsApp</span>
                </a>

                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-full border border-border text-xs font-bold hover:bg-secondary flex items-center gap-1.5"
                >
                  <Icon name="printer" size={14} />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Order Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingOrder}
        onClose={() => setDeletingOrder(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        message={`Are you sure you want to permanently delete order #${deletingOrder?.id}?`}
        confirmText="Yes, Delete Order"
      />
    </div>
  );
}

export default OrderManagement;
