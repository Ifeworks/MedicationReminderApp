import React from "react";
import type { OrderStatus } from "../../types";

export function AvailabilityBadge({ available, size = "md" }: { available: boolean; size?: "sm" | "md" }) {
  const isSm = size === "sm";
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full select-none transition-colors ${
        isSm ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      }`}
      style={{
        background: available ? "rgba(74, 107, 61, 0.12)" : "rgba(43, 28, 20, 0.08)",
        color: available ? "var(--green)" : "var(--muted-foreground)",
      }}
    >
      <span
        className={`rounded-full ${isSm ? "w-1.5 h-1.5" : "w-2 h-2"}`}
        style={{ background: available ? "var(--green)" : "var(--muted-foreground)" }}
      />
      {available ? "Available" : "Sold Out"}
    </span>
  );
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  "New Order": { bg: "#b5471f1a", text: "#b5471f", dot: "#b5471f" },
  Confirmed: { bg: "#8a5a1c1a", text: "#8a5a1c", dot: "#8a5a1c" },
  Preparing: { bg: "#d98a3d1a", text: "#b87028", dot: "#d98a3d" },
  Ready: { bg: "#4a6b3d1a", text: "#3b5830", dot: "#4a6b3d" },
  "Out for Delivery": { bg: "#2563eb1a", text: "#1d4ed8", dot: "#2563eb" },
  Delivered: { bg: "#15803d1a", text: "#15803d", dot: "#16a34a" },
  Cancelled: { bg: "#8a6f5c1a", text: "#8a6f5c", dot: "#8a6f5c" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const conf = ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS["New Order"];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: conf.bg, color: conf.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: conf.dot }} />
      {status}
    </span>
  );
}

export function PriceTag({ price, discountPrice }: { price: number; discountPrice?: number }) {
  const format = (n: number) => "₦" + n.toLocaleString("en-NG");
  return (
    <div className="inline-flex items-baseline gap-1.5">
      <span className="font-serif text-lg sm:text-xl font-bold" style={{ color: "var(--primary)" }}>
        {format(discountPrice || price)}
      </span>
      {discountPrice && discountPrice < price && (
        <span className="text-xs line-through" style={{ color: "var(--muted-foreground)" }}>
          {format(price)}
        </span>
      )}
    </div>
  );
}

export default AvailabilityBadge;
