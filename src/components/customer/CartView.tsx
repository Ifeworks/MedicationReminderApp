import React from "react";
import { useApp } from "../../context/AppContext";
import type { CartLine } from "../../types";
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

export function CartView() {
  const { cart, setQty, removeLine, go, settings } = useApp();

  const subtotal = cart.reduce((s, l) => s + lineTotal(l), 0);
  const deliveryFee = cart.length ? settings.business.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-20 text-center animate-float-up">
        <div
          className="w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-inner"
          style={{ background: "var(--secondary)", color: "var(--primary)" }}
        >
          <Icon name="cart" size={38} />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-6" style={{ color: "var(--brown)" }}>
          Your cart is empty
        </h1>
        <p className="mt-2 text-base" style={{ color: "var(--muted-foreground)" }}>
          Explore this weekend's menu and add some delicious Nigerian specialties.
        </p>
        <button
          onClick={() => go("menu")}
          className="mt-8 px-8 py-3.5 rounded-full font-bold shadow-md transition-transform hover:scale-105 active:scale-95"
          style={{ background: "var(--primary)", color: "#fff" }}
        >
          Browse This Week's Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold" style={{ color: "var(--brown)" }}>
          Your Shopping Cart
        </h1>
        <span className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
          {cart.length} unique item{cart.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-8 items-start">
        {/* Cart Item Lines */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map(l => (
            <div
              key={l.key}
              className="bg-card rounded-3xl border border-border p-4 sm:p-5 flex gap-4 shadow-xs hover:shadow-md transition-shadow"
            >
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0"
                style={{ background: "var(--muted)" }}
              >
                <img src={l.item.image} alt={l.item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold truncate" style={{ color: "var(--brown)" }}>
                      {l.item.name}
                    </h3>
                    <button
                      onClick={() => removeLine(l.key)}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                      aria-label="Remove item"
                    >
                      <Icon name="trash" size={17} />
                    </button>
                  </div>

                  {l.extras.length > 0 && (
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                      <span className="font-semibold">Extras:</span> {l.extras.join(", ")}
                    </p>
                  )}

                  {l.instructions && (
                    <p className="text-xs mt-0.5 italic line-clamp-1" style={{ color: "var(--muted-foreground)" }}>
                      "{l.instructions}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                  {/* Stepper */}
                  <div className="inline-flex items-center rounded-full border border-border bg-background p-0.5">
                    <button
                      onClick={() => setQty(l.key, l.qty - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted"
                      style={{ color: "var(--brown)" }}
                      aria-label="Decrease"
                    >
                      <Icon name="minus" size={12} />
                    </button>
                    <span className="w-6 text-center text-xs font-bold tabular-nums" style={{ color: "var(--brown)" }}>
                      {l.qty}
                    </span>
                    <button
                      onClick={() => setQty(l.key, l.qty + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted"
                      style={{ color: "var(--brown)" }}
                      aria-label="Increase"
                    >
                      <Icon name="plus" size={12} />
                    </button>
                  </div>

                  <span className="font-serif text-base sm:text-lg font-bold" style={{ color: "var(--primary)" }}>
                    {naira(lineTotal(l))}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => go("menu")}
            className="self-start mt-2 inline-flex items-center gap-2 text-sm font-bold transition-transform hover:translate-x-1"
            style={{ color: "var(--primary)" }}
          >
            <Icon name="plus" size={14} />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Order Summary Box */}
        <div className="bg-card rounded-3xl border border-border p-6 shadow-md lg:sticky lg:top-24">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: "var(--brown)" }}>
            Order Summary
          </h3>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span style={{ color: "var(--muted-foreground)" }}>Subtotal</span>
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>{naira(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: "var(--muted-foreground)" }}>Estimated Delivery (Ido-Ekiti)</span>
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>{naira(deliveryFee)}</span>
            </div>
            <div className="h-px my-3" style={{ background: "var(--border)" }} />
            <div className="flex justify-between items-baseline">
              <span className="font-serif text-lg font-bold" style={{ color: "var(--brown)" }}>Total</span>
              <span className="font-serif text-2xl font-bold" style={{ color: "var(--primary)" }}>{naira(total)}</span>
            </div>
          </div>

          <button
            onClick={() => go("checkout")}
            className="mt-6 w-full py-4 rounded-full font-bold text-base shadow-md transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            <span>Proceed to Checkout</span>
            <Icon name="arrow" size={16} />
          </button>

          <p className="text-[11px] text-center mt-3" style={{ color: "var(--muted-foreground)" }}>
            Freshly prepared and packaged safely upon order confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartView;
