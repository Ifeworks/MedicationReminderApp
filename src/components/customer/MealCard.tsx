import React from "react";
import type { MenuItem } from "../../types";
import { AvailabilityBadge, PriceTag } from "../common/Badge";
import Icon from "../common/Icon";

export function MealCard({
  item,
  onOpen,
  onAdd,
}: {
  item: MenuItem;
  onOpen: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="group bg-card rounded-3xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col relative">
      {/* Featured / Special ribbon */}
      {item.isSpecial && (
        <div
          className="absolute top-3 right-3 z-10 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md text-white flex items-center gap-1"
          style={{ background: "var(--primary)" }}
        >
          <Icon name="spark" size={11} /> Special
        </div>
      )}

      {/* Food Image */}
      <button
        onClick={onOpen}
        className="relative aspect-[4/3] w-full overflow-hidden text-left focus:outline-none focus-visible:ring-2"
        style={{ background: "var(--muted)" }}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ opacity: item.available ? 1 : 0.6 }}
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <AvailabilityBadge available={item.available} />
        </div>
      </button>

      {/* Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <button onClick={onOpen} className="text-left w-full focus:outline-none">
            <h3
              className="font-serif text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-1"
              style={{ color: "var(--brown)" }}
            >
              {item.name}
            </h3>
          </button>
          <p
            className="text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <PriceTag price={item.price} discountPrice={item.discountPrice} />

          <button
            onClick={e => {
              e.stopPropagation();
              onAdd();
            }}
            disabled={!item.available}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-transform hover:scale-105 shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            <Icon name="plus" size={13} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MealCard;
