import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import type { CartLine, Order, OrderType, PaymentMethod } from "../../types";
import Icon from "../common/Icon";

const DEFAULT_EXTRAS = [
  { name: "Extra Fried Chicken", price: 1500 },
  { name: "Extra Fried Plantain (Dodo)", price: 800 },
  { name: "Crisp Creamy Coleslaw", price: 700 },
  { name: "Extra Pepper Sauce (Ata)", price: 500 },
];

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

function lineTotal(l: CartLine) {
  const effectivePrice = l.item.discountPrice || l.item.price;
  const extrasTotal = l.extras.reduce((s, e) => {
    const found = DEFAULT_EXTRAS.find(x => x.name === e);
    return s + (found ? found.price : 0);
  }, 0);
  return (effectivePrice + extrasTotal) * l.qty;
}

export function CheckoutView({
  onOrderPlaced,
}: {
  onOrderPlaced: (order: Order) => void;
}) {
  const { cart, placeCustomerOrder, settings } = useApp();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("Ido-Ekiti");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("Food Delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Pay on Delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((s, l) => s + lineTotal(l), 0);
  const deliveryFee = orderType === "Food Delivery" ? settings.business.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || (orderType === "Food Delivery" && !address.trim())) {
      return;
    }

    setIsSubmitting(true);
    try {
      const createdOrder = await placeCustomerOrder({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        deliveryAddress: address.trim() || "Pickup at PB DELICACIES Kitchen",
        deliveryArea: area.trim() || "Ido-Ekiti",
        preferredTime: time.trim() || undefined,
        orderNotes: notes.trim() || undefined,
        type: orderType,
        paymentMethod,
        paymentStatus: "Pending",
        items: cart.map(l => ({
          id: l.item.id,
          name: l.item.name,
          price: l.item.discountPrice || l.item.price,
          quantity: l.qty,
          image: l.item.image,
          extras: l.extras,
          instructions: l.instructions,
          total: lineTotal(l),
        })),
        subtotal,
        deliveryFee,
        total,
      });

      onOrderPlaced(createdOrder);
    } catch (err) {
      console.error("Order submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold" style={{ color: "var(--brown)" }}>
        Checkout & Delivery
      </h1>
      <p className="text-sm mt-1 mb-8" style={{ color: "var(--muted-foreground)" }}>
        Enter your details to confirm your order with PB DELICACIES.
      </p>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Form Fields */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Customer & Delivery Info */}
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
            <h3 className="font-serif text-xl font-bold mb-5 flex items-center gap-2" style={{ color: "var(--brown)" }}>
              <Icon name="location" size={20} />
              <span>Contact & Delivery Details</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Adebola Olumide"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                  Phone Number (WhatsApp Preferred) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0803 000 0000"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                />
              </div>

              {orderType === "Food Delivery" && (
                <>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                      Delivery Address in Ido-Ekiti *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Street name, house description, landmark"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                      style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                      Area / Neighborhood
                    </label>
                    <input
                      type="text"
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      placeholder="e.g. Hospital Road, Fajuyi, GRA"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                      style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                      Preferred Delivery Time
                    </label>
                    <input
                      type="text"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      placeholder="e.g. Saturday 1:00 PM"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                      style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                    />
                  </div>
                </>
              )}

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                  Special Order / Delivery Notes
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Gate code, directions, packing preference..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                />
              </div>
            </div>
          </div>

          {/* Order Type */}
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
            <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--brown)" }}>
              <Icon name="truck" size={20} />
              <span>Order & Fulfillment Type</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {(["Food Delivery", "Home Pickup"] as OrderType[]).map(t => {
                const isSelected = orderType === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setOrderType(t)}
                    className="p-4 rounded-2xl border text-left transition-all"
                    style={{
                      borderColor: isSelected ? "var(--primary)" : "var(--border)",
                      background: isSelected ? "var(--secondary)" : "transparent",
                    }}
                  >
                    <div className="font-bold text-sm" style={{ color: isSelected ? "var(--primary)" : "var(--foreground)" }}>
                      {t}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                      {t === "Food Delivery" ? `Delivered to your door (+${naira(settings.business.deliveryFee)})` : "Pick up directly at our kitchen (Free)"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
            <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--brown)" }}>
              <Icon name="dollar" size={20} />
              <span>Payment Option</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {(["Pay on Delivery", "Bank Transfer"] as PaymentMethod[]).map(p => {
                const isSelected = paymentMethod === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPaymentMethod(p)}
                    className="p-4 rounded-2xl border text-left transition-all"
                    style={{
                      borderColor: isSelected ? "var(--primary)" : "var(--border)",
                      background: isSelected ? "var(--secondary)" : "transparent",
                    }}
                  >
                    <div className="font-bold text-sm" style={{ color: isSelected ? "var(--primary)" : "var(--foreground)" }}>
                      {p}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                      {p === "Pay on Delivery" ? "Cash or POS on delivery" : "Direct electronic bank transfer"}
                    </div>
                  </button>
                );
              })}
            </div>

            {paymentMethod === "Bank Transfer" && (
              <div
                className="mt-4 p-4 rounded-2xl border text-xs leading-relaxed"
                style={{ background: "rgba(217, 138, 61, 0.12)", borderColor: "rgba(217, 138, 61, 0.25)" }}
              >
                <div className="font-bold text-sm mb-1" style={{ color: "var(--brown)" }}>
                  PB DELICACIES Bank Details
                </div>
                <div>Bank: <span className="font-semibold">{settings.business.bankName || "Moniepoint / OPay"}</span></div>
                <div>Account Number: <span className="font-bold font-mono text-sm">{settings.business.accountNumber || settings.business.phone}</span></div>
                <div>Account Name: <span className="font-semibold">{settings.business.accountName || settings.business.name}</span></div>
                <div className="mt-2 text-muted-foreground">
                  Please send payment proof on WhatsApp after placing order.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary on Right */}
        <div className="bg-card rounded-3xl border border-border p-6 shadow-md lg:sticky lg:top-24">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: "var(--brown)" }}>
            Review Order
          </h3>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {cart.map(l => (
              <div key={l.key} className="flex justify-between items-start text-xs sm:text-sm gap-2">
                <div>
                  <span className="font-bold" style={{ color: "var(--brown)" }}>{l.qty}×</span>{" "}
                  <span style={{ color: "var(--foreground)" }}>{l.item.name}</span>
                  {l.extras.length > 0 && (
                    <div className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                      + {l.extras.join(", ")}
                    </div>
                  )}
                </div>
                <span className="font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
                  {naira(lineTotal(l))}
                </span>
              </div>
            ))}
          </div>

          <div className="h-px my-4" style={{ background: "var(--border)" }} />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span style={{ color: "var(--muted-foreground)" }}>Subtotal</span>
              <span className="font-semibold">{naira(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: "var(--muted-foreground)" }}>
                {orderType === "Food Delivery" ? "Delivery Fee" : "Pickup"}
              </span>
              <span className="font-semibold">
                {orderType === "Food Delivery" ? naira(deliveryFee) : "Free"}
              </span>
            </div>
            <div className="h-px my-2" style={{ background: "var(--border)" }} />
            <div className="flex justify-between items-baseline">
              <span className="font-serif text-lg font-bold" style={{ color: "var(--brown)" }}>Total</span>
              <span className="font-serif text-2xl font-bold" style={{ color: "var(--primary)" }}>
                {naira(total)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full py-4 rounded-full font-bold text-base shadow-md transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <Icon name="check" size={18} />
                <span>Confirm Order · {naira(total)}</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center mt-3" style={{ color: "var(--muted-foreground)" }}>
            By placing your order you will receive instant WhatsApp confirmation.
          </p>
        </div>
      </form>
    </div>
  );
}

export default CheckoutView;
