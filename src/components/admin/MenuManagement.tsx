import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import type { MenuItem } from "../../types";
import { AvailabilityBadge, PriceTag } from "../common/Badge";
import Icon from "../common/Icon";
import FoodModal from "./FoodModal";
import ConfirmDialog from "../common/ConfirmDialog";

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export function MenuManagement() {
  const { menu, categories, toggleAvailability, updateItemPrice, deleteMenuItem } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filterAvailability, setFilterAvailability] = useState<"All" | "Available" | "Sold Out">("All");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  // In-line price editor state
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<number>(0);

  const filteredMenu = menu.filter(item => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesAvail =
      filterAvailability === "All" ||
      (filterAvailability === "Available" && item.available) ||
      (filterAvailability === "Sold Out" && !item.available);

    return matchesSearch && matchesCategory && matchesAvail;
  });

  const handleStartEditPrice = (item: MenuItem) => {
    setEditingPriceId(item.id);
    setEditingPriceValue(item.price);
  };

  const handleSavePrice = async (id: number) => {
    if (editingPriceValue > 0) {
      await updateItemPrice(id, editingPriceValue);
    }
    setEditingPriceId(null);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingItem) {
      await deleteMenuItem(deletingItem.id);
      setDeletingItem(null);
    }
  };

  return (
    <div className="space-y-6 animate-float-up">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: "var(--brown)" }}>
            Catalogue & Menu Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Add, modify prices, upload photos, or toggle availability. Changes appear live on the customer site.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
          style={{ background: "var(--primary)", color: "#fff" }}
        >
          <Icon name="plus" size={16} />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-card rounded-3xl p-4 sm:p-5 border border-border shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <Icon name="search" size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search food by name, description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm focus:outline-none focus:ring-2"
            style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none focus:ring-2"
            style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
          >
            <option value="All">All Categories ({menu.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Availability Filter */}
          <select
            value={filterAvailability}
            onChange={e => setFilterAvailability(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none focus:ring-2"
            style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
          >
            <option value="All">All Stock Status</option>
            <option value="Available">Available Only</option>
            <option value="Sold Out">Sold Out Only</option>
          </select>
        </div>
      </div>

      {/* Catalogue Table & Cards */}
      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-border bg-background/50 text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Meal & Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (₦)</th>
                <th className="py-3.5 px-4">Status & Visibility</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredMenu.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No food items match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMenu.map(item => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    {/* Meal Info */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-border flex-shrink-0 bg-muted">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm" style={{ color: "var(--brown)" }}>
                              {item.name}
                            </span>
                            {item.isSpecial && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-primary text-white">
                                Special
                              </span>
                            )}
                            {item.featured && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-900">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                        {item.category}
                      </span>
                    </td>

                    {/* Price & In-line editing */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {editingPriceId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={100}
                            step={50}
                            autoFocus
                            value={editingPriceValue}
                            onChange={e => setEditingPriceValue(Number(e.target.value))}
                            onKeyDown={e => {
                              if (e.key === "Enter") handleSavePrice(item.id);
                              if (e.key === "Escape") setEditingPriceId(null);
                            }}
                            className="w-24 px-2 py-1 text-xs font-bold rounded-lg border border-primary bg-background focus:outline-none"
                          />
                          <button
                            onClick={() => handleSavePrice(item.id)}
                            className="p-1 rounded-lg bg-green text-white hover:opacity-90"
                            aria-label="Save price"
                          >
                            <Icon name="check" size={13} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleStartEditPrice(item)}>
                          <PriceTag price={item.price} discountPrice={item.discountPrice} />
                          <button
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity p-0.5"
                            title="Edit price directly"
                          >
                            <Icon name="edit" size={12} />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Availability Toggle */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className="transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                        title="Click to toggle availability"
                      >
                        <AvailabilityBadge available={item.available} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-xl border border-border hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                          title="Edit full meal details"
                        >
                          <Icon name="edit" size={15} />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-2 rounded-xl border border-border hover:bg-rose-50 text-muted-foreground hover:text-rose-600 transition-colors"
                          title="Delete meal"
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Food Modal */}
      <FoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemToEdit={editingItem}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Food Item"
        message={`Are you sure you want to permanently remove "${deletingItem?.name}" from your catalogue? It will no longer appear on the customer website.`}
        confirmText="Yes, Delete Item"
        isDestructive={true}
      />
    </div>
  );
}

export default MenuManagement;
