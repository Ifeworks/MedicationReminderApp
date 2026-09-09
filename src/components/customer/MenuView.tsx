import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import MealCard from "./MealCard";
import Icon from "../common/Icon";

export function MenuView() {
  const { menu, categories, settings, setDetailItem, quickAdd } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMenu = menu.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.ingredients && item.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const categoryNames = ["All", ...categories.map(c => c.name)];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto">
        <span
          className="text-xs font-bold tracking-[0.2em] uppercase"
          style={{ color: "var(--gold)" }}
        >
          {settings.weekLabel}
        </span>
        <h1
          className="font-serif text-4xl sm:text-5xl font-bold mt-1"
          style={{ color: "var(--brown)" }}
        >
          This Week's Menu
        </h1>
        <p className="mt-3 text-base sm:text-lg" style={{ color: "var(--muted-foreground)" }}>
          Freshly prepared Nigerian delicacies available for this weekend.
        </p>
      </div>

      {/* Weekly notice banner */}
      <div
        className="mt-6 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-3 text-sm shadow-xs"
        style={{ background: "rgba(217, 138, 61, 0.12)", color: "#8a5a1c" }}
      >
        <div className="flex items-center gap-2.5">
          <Icon name="spark" size={18} />
          <span>{settings.weeklySpecialsNotice}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "var(--muted-foreground)" }}>
            <Icon name="search" size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search meals or ingredients..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 shadow-xs"
            style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              style={{ color: "var(--muted-foreground)" }}
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 w-full -mx-1 px-1 scrollbar-none">
          {categoryNames.map(c => {
            const active = activeCategory === c;
            const count = c === "All" ? menu.length : menu.filter(m => m.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 shadow-xs active:scale-95"
                style={{
                  background: active ? "var(--primary)" : "var(--card)",
                  color: active ? "#fff" : "var(--muted-foreground)",
                  border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
                }}
              >
                <span>{c}</span>
                <span
                  className="text-[10px] px-1.5 py-0.2 rounded-full"
                  style={{
                    background: active ? "rgba(255,255,255,0.25)" : "var(--muted)",
                    color: active ? "#fff" : "var(--muted-foreground)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items List */}
      {filteredMenu.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-3xl border border-border mt-8 p-6">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
            <Icon name="food" size={28} />
          </div>
          <h3 className="font-serif text-xl font-bold" style={{ color: "var(--brown)" }}>
            No meals found
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Try changing your search term or select another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
            }}
            className="mt-4 px-5 py-2 rounded-full text-xs font-bold"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            Clear Filters
          </button>
        </div>
      ) : activeCategory === "All" && !searchQuery ? (
        /* Grouped by categories when "All" is active */
        categories.map(cat => {
          const items = menu.filter(m => m.category === cat.name);
          if (items.length === 0) return null;
          return (
            <div key={cat.id} className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-serif text-2xl font-bold" style={{ color: "var(--brown)" }}>
                  {cat.name}
                </h2>
                <div className="h-px flex-1" style={{ background: "var(--border)" }} />
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}>
                  {items.length} dishes
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                  <MealCard
                    key={item.id}
                    item={item}
                    onOpen={() => setDetailItem(item)}
                    onAdd={() => quickAdd(item)}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        /* Flat grid when filtering */
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map(item => (
            <MealCard
              key={item.id}
              item={item}
              onOpen={() => setDetailItem(item)}
              onAdd={() => quickAdd(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuView;
