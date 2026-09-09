import React, { useState } from "react";
import type { MenuItem } from "../../types";
import { AvailabilityBadge } from "../common/Badge";
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

export function DetailModal({
  item,
  onClose,
  onAdd,
}: {
  item: MenuItem;
  onClose: () => void;
  onAdd: (qty: number, extras: string[], instructions: string) => void;
}) {
  const [qty, setQty] = useState(1);
  const [extras, setExtras] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");

  const effectivePrice = item.discountPrice || item.price;
  const extrasTotal = extras.reduce((s, e) => {
    const found = DEFAULT_EXTRAS.find(x => x.name === e);
    return s + (found ? found.price : 0);
  }, 0);
  const total = (effectivePrice + extrasTotal) * qty;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      style={{ background: "rgba(43, 28, 20, 0.65)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="bg-card w-full max-w-lg sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto animate-float-up my-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Large Food Image */}
        <div className="relative aspect-[16/10] w-full" style={{ background: "var(--muted)" }}>
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105"
            style={{ background: "rgba(255, 255, 255, 0.92)", color: "var(--brown)" }}
            aria-label="Close"
          >
            <Icon name="close" size={18} />
          </button>
          <div className="absolute bottom-3 left-3">
            <AvailabilityBadge available={item.available} />
          </div>
          {item.category && (
            <div
              className="absolute bottom-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full text-white shadow-sm"
              style={{ background: "rgba(43, 28, 20, 0.75)" }}
            >
              {item.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold" style={{ color: "var(--brown)" }}>
                {item.name}
              </h2>
              {item.preparationTime && (
                <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  <Icon name="clock" size={13} />
                  <span>Prep: {item.preparationTime}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="font-serif text-2xl font-bold" style={{ color: "var(--primary)" }}>
                {naira(effectivePrice)}
              </div>
              {item.discountPrice && (
                <div className="text-xs line-through" style={{ color: "var(--muted-foreground)" }}>
                  {naira(item.price)}
                </div>
              )}
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            {item.description}
          </p>

          {/* Ingredients if provided */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mt-4 p-3 rounded-2xl border border-border/80 bg-background/50">
              <div className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                Key Ingredients
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-0.5 rounded-full"
                    style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Optional extras */}
          <div className="mt-5">
            <div className="text-sm font-bold mb-2.5" style={{ color: "var(--brown)" }}>
              Add Optional Extras
            </div>
            <div className="flex flex-col gap-2">
              {DEFAULT_EXTRAS.map(ex => {
                const isSelected = extras.includes(ex.name);
                return (
                  <button
                    key={ex.name}
                    type="button"
                    onClick={() =>
                      setExtras(prev =>
                        isSelected ? prev.filter(e => e !== ex.name) : [...prev, ex.name]
                      )
                    }
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition-all text-left"
                    style={{
                      borderColor: isSelected ? "var(--primary)" : "var(--border)",
                      background: isSelected ? "var(--secondary)" : "transparent",
                    }}
                  >
                    <span className="flex items-center gap-2.5" style={{ color: "var(--foreground)" }}>
                      <span
                        className="w-4 h-4 rounded-md flex items-center justify-center border transition-colors"
                        style={{
                          borderColor: isSelected ? "var(--primary)" : "var(--border)",
                          background: isSelected ? "var(--primary)" : "transparent",
                          color: "#fff",
                        }}
                      >
                        {isSelected && <Icon name="check" size={11} />}
                      </span>
                      <span className="font-medium">{ex.name}</span>
                    </span>
                    <span className="font-semibold text-xs" style={{ color: "var(--muted-foreground)" }}>
                      +{naira(ex.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special instructions */}
          <div className="mt-5">
            <label className="text-sm font-bold mb-1.5 block" style={{ color: "var(--brown)" }}>
              Special Cooking Instructions
            </label>
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              rows={2}
              placeholder="e.g. Extra spicy, no onions, pack stew separately..."
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          {/* Footer Controls */}
          <div className="mt-6 pt-4 border-t border-border flex items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-border bg-background p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                style={{ color: "var(--brown)" }}
                aria-label="Decrease quantity"
              >
                <Icon name="minus" size={14} />
              </button>
              <span className="w-8 text-center font-bold tabular-nums" style={{ color: "var(--brown)" }}>
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                style={{ color: "var(--brown)" }}
                aria-label="Increase quantity"
              >
                <Icon name="plus" size={14} />
              </button>
            </div>

            <button
              onClick={() => onAdd(qty, extras, instructions)}
              disabled={!item.available}
              className="flex-1 py-3.5 px-6 rounded-full font-bold transition-transform hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              <Icon name="cart" size={18} />
              <span>Add to Cart · {naira(total)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
