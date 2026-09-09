import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import type { Customer, Order } from "../../types";
import Icon from "../common/Icon";
import Modal from "../common/Modal";

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export function CustomerManagement() {
  const { customers, orders } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(c => {
    return (
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.area && c.area.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const getCustomerOrders = (phone: string): Order[] => {
    return orders.filter(o => o.customerPhone === phone);
  };

  const getWhatsAppLink = (phone: string, name: string) => {
    const clean = phone.replace(/[^0-9]/g, "");
    const intPhone = clean.startsWith("0") ? "234" + clean.slice(1) : clean;
    const msg = `Hello ${name}, thank you for being a valued customer of PB DELICACIES!`;
    return `https://wa.me/${intPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-6 animate-float-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: "var(--brown)" }}>
            Customer Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            View customer profiles, order history, and lifetime customer spending.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground">
            {customers.length} Registered Customer{customers.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-card rounded-3xl p-4 sm:p-5 border border-border shadow-xs flex items-center">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <Icon name="search" size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, phone, area..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm focus:outline-none focus:ring-2"
            style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-border bg-background/50 text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Customer Name & Contacts</th>
                <th className="py-3.5 px-4">Location / Address</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No customer records match your query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => (
                  <tr key={cust.id} className="hover:bg-muted/30 transition-colors">
                    {/* Name & Phone */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-sm flex-shrink-0"
                          style={{ background: "var(--secondary)", color: "var(--primary)" }}
                        >
                          {cust.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-sm" style={{ color: "var(--brown)" }}>
                            {cust.name}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Icon name="phone" size={11} /> {cust.phone}
                          </div>
                          {cust.email && (
                            <div className="text-[11px] text-muted-foreground">{cust.email}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4">
                      <div className="text-xs max-w-xs truncate">{cust.address || "Ido-Ekiti"}</div>
                      <div className="text-[11px] text-muted-foreground">{cust.area || "Ekiti"}</div>
                    </td>

                    {/* Orders count */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-bold text-sm" style={{ color: "var(--brown)" }}>
                        {cust.totalOrders} order{cust.totalOrders !== 1 ? "s" : ""}
                      </span>
                    </td>

                    {/* Total Spend */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-serif font-bold text-sm" style={{ color: "var(--primary)" }}>
                        {naira(cust.totalSpent)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: cust.status === "VIP" ? "rgba(217, 138, 61, 0.15)" : "rgba(74, 107, 61, 0.12)",
                          color: cust.status === "VIP" ? "var(--gold)" : "var(--green)",
                        }}
                      >
                        {cust.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-3 py-1.5 rounded-xl border border-border hover:bg-secondary text-xs font-semibold"
                        >
                          History
                        </button>
                        <a
                          href={getWhatsAppLink(cust.phone, cust.name)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-xl border border-border text-emerald-700 hover:bg-emerald-50"
                          title="Chat on WhatsApp"
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

      {/* Customer Order History Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer: ${selectedCustomer.name}`}
          subtitle={`Phone: ${selectedCustomer.phone} · Total Lifetime Spend: ${naira(selectedCustomer.totalSpent)}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider" style={{ color: "var(--brown)" }}>
              Order History ({getCustomerOrders(selectedCustomer.phone).length})
            </h4>

            {getCustomerOrders(selectedCustomer.phone).length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">No detailed order log found for this phone number.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {getCustomerOrders(selectedCustomer.phone).map(order => (
                  <div key={order.id} className="p-3.5 rounded-2xl border border-border bg-background/50 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono font-bold text-primary">#{order.id}</span>
                      <span className="font-serif font-bold text-sm">{naira(order.total)}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {order.items.map(i => `${i.quantity}× ${i.name}`).join(", ")}
                    </div>
                    <div className="flex justify-between items-center mt-2 text-[11px] text-muted-foreground pt-1.5 border-t border-border/40">
                      <span>{new Date(order.createdAt).toLocaleDateString("en-NG")}</span>
                      <span className="font-semibold">{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 rounded-full border border-border text-xs font-bold hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CustomerManagement;
