import React from "react";
import type { Order } from "../../types";
import { useApp } from "../../context/AppContext";
import Icon from "../common/Icon";

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export function ConfirmView({ order }: { order: Order }) {
  const { go, settings } = useApp();

  const itemsListText = order.items
    .map(i => `- ${i.quantity}× ${i.name} (${naira(i.total)})`)
    .join("\n");

  const message =
    `Hello PB DELICACIES, I just placed order #${order.id} on your website.\n\n` +
    `*Customer:* ${order.customerName}\n` +
    `*Phone:* ${order.customerPhone}\n` +
    `*Items:*\n${itemsListText}\n\n` +
    `*Type:* ${order.type}\n` +
    `*Address:* ${order.deliveryAddress} (${order.deliveryArea})\n` +
    `*Payment:* ${order.paymentMethod}\n` +
    `*Total:* ${naira(order.total)}`;

  const waLink = `https://wa.me/${settings.business.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 text-center animate-float-up">
      <div
        className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg"
        style={{ background: "rgba(74, 107, 61, 0.15)", color: "var(--green)" }}
      >
        <Icon name="check" size={38} />
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-6" style={{ color: "var(--brown)" }}>
        Order Received! 🎉
      </h1>
      <p className="mt-2 text-base" style={{ color: "var(--muted-foreground)" }}>
        Thank you, <span className="font-semibold" style={{ color: "var(--brown)" }}>{order.customerName}</span>. Your order has been placed and received by PB DELICACIES.
      </p>

      {/* Order Summary Card */}
      <div className="mt-8 bg-card rounded-3xl border border-border p-6 sm:p-8 text-left shadow-sm">
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold" style={{ color: "var(--muted-foreground)" }}>
              Order Reference
            </span>
            <div className="font-serif text-2xl font-bold mt-0.5" style={{ color: "var(--primary)" }}>
              #{order.id}
            </div>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: "rgba(74, 107, 61, 0.12)", color: "var(--green)" }}
          >
            {order.status}
          </span>
        </div>

        <div className="space-y-2.5">
          {order.items.map((it, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span style={{ color: "var(--foreground)" }}>
                <span className="font-bold">{it.quantity}×</span> {it.name}
              </span>
              <span className="font-semibold tabular-nums">{naira(it.total)}</span>
            </div>
          ))}
        </div>

        <div className="h-px my-4" style={{ background: "var(--border)" }} />

        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-xs" style={{ color: "var(--muted-foreground)" }}>
            <span>Subtotal</span>
            <span>{naira(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs" style={{ color: "var(--muted-foreground)" }}>
            <span>{order.type === "Food Delivery" ? "Delivery Fee" : "Pickup"}</span>
            <span>{order.type === "Food Delivery" ? naira(order.deliveryFee) : "Free"}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2">
            <span className="font-serif text-base font-bold" style={{ color: "var(--brown)" }}>Total Amount</span>
            <span className="font-serif text-xl font-bold" style={{ color: "var(--primary)" }}>{naira(order.total)}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border space-y-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
          <div className="flex items-center gap-2">
            <Icon name="location" size={14} />
            <span>{order.type} to: <strong>{order.deliveryAddress}</strong> ({order.deliveryArea})</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="clock" size={14} />
            <span>Estimated delivery in 45–75 minutes after phone/WhatsApp confirmation.</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold shadow-md transition-transform hover:scale-105"
          style={{ background: "var(--green)", color: "#fff" }}
        >
          <Icon name="whatsapp" size={18} />
          <span>Confirm on WhatsApp</span>
        </a>

        <button
          onClick={() => go("home")}
          className="px-8 py-4 rounded-full font-bold border hover:bg-secondary transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--brown)" }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default ConfirmView;
