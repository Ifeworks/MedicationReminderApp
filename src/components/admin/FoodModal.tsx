import React, { useEffect, useState } from "react";
import type { MenuItem } from "../../types";
import { useApp } from "../../context/AppContext";
import Modal from "../common/Modal";
import Icon from "../common/Icon";

const CURATED_FOOD_GALLERY = [
  { label: "Jollof Rice & Chicken", url: "https://images.unsplash.com/photo-1665332195309-9d75071138f0?w=800&h=600&fit=crop&auto=format" },
  { label: "Fried Rice & Chicken", url: "https://images.unsplash.com/photo-1665556899022-9761f95769e5?w=800&h=600&fit=crop&auto=format" },
  { label: "Ofada Rice & Sauce", url: "https://images.unsplash.com/photo-1664993101841-036f189719b6?w=800&h=600&fit=crop&auto=format" },
  { label: "Pounded Yam & Egusi", url: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&h=600&fit=crop&auto=format" },
  { label: "Amala & Ewedu", url: "https://images.unsplash.com/photo-1584789900011-0c3d178c58f8?w=800&h=600&fit=crop&auto=format" },
  { label: "Assorted Meat", url: "https://images.unsplash.com/photo-1664992960082-0ea299a9c53e?w=800&h=600&fit=crop&auto=format" },
  { label: "Grilled Peppered Chicken", url: "https://images.unsplash.com/photo-1665333048952-a3ee97714c6b?w=800&h=600&fit=crop&auto=format" },
  { label: "Fried Plantain (Dodo)", url: "https://images.unsplash.com/photo-1705088293125-063256c88cf5?w=800&h=600&fit=crop&auto=format" },
  { label: "Moi Moi Bean Cake", url: "https://images.unsplash.com/photo-1618426660666-2fbac6f11227?w=800&h=600&fit=crop&auto=format" },
  { label: "Chapman Punch", url: "https://images.unsplash.com/photo-1540138411301-84af810a9a44?w=800&h=600&fit=crop&auto=format" },
  { label: "Zobo Hibiscus Drink", url: "https://images.unsplash.com/photo-1786114911080-8a01bfb07163?w=800&h=600&fit=crop&auto=format" },
  { label: "Pepper Soup", url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop&auto=format" },
];

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: MenuItem | null;
}

export function FoodModal({ isOpen, onClose, itemToEdit }: FoodModalProps) {
  const { categories, addMenuItem, updateMenuItem } = useApp();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(3000);
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("Rice");
  const [image, setImage] = useState<string>(CURATED_FOOD_GALLERY[0].url);
  const [available, setAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [ingredientsText, setIngredientsText] = useState("");
  const [preparationTime, setPreparationTime] = useState("20-30 mins");
  const [activeImageTab, setActiveImageTab] = useState<"gallery" | "upload" | "url">("gallery");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setDescription(itemToEdit.description);
      setPrice(itemToEdit.price);
      setDiscountPrice(itemToEdit.discountPrice ? String(itemToEdit.discountPrice) : "");
      setCategory(itemToEdit.category);
      setImage(itemToEdit.image);
      setAvailable(itemToEdit.available);
      setFeatured(!!itemToEdit.featured);
      setIsSpecial(!!itemToEdit.isSpecial);
      setIngredientsText(itemToEdit.ingredients ? itemToEdit.ingredients.join(", ") : "");
      setPreparationTime(itemToEdit.preparationTime || "20-30 mins");
    } else {
      setName("");
      setDescription("");
      setPrice(3500);
      setDiscountPrice("");
      setCategory(categories[0]?.name || "Rice");
      setImage(CURATED_FOOD_GALLERY[0].url);
      setAvailable(true);
      setFeatured(false);
      setIsSpecial(false);
      setIngredientsText("");
      setPreparationTime("20-30 mins");
    }
  }, [itemToEdit, categories, isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price <= 0 || !category) return;

    setIsSaving(true);
    try {
      const ingredients = ingredientsText
        .split(",")
        .map(i => i.trim())
        .filter(Boolean);

      const parsedDiscount = discountPrice.trim() ? Number(discountPrice) : undefined;

      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        discountPrice: parsedDiscount,
        category,
        image: image || CURATED_FOOD_GALLERY[0].url,
        available,
        featured,
        isSpecial,
        ingredients: ingredients.length > 0 ? ingredients : undefined,
        preparationTime: preparationTime.trim() || undefined,
      };

      if (itemToEdit) {
        await updateMenuItem(itemToEdit.id, payload);
      } else {
        await addMenuItem(payload);
      }

      onClose();
    } catch (err) {
      console.error("Save food item failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? `Edit "${itemToEdit.name}"` : "Add New Food Item"}
      subtitle="Fill in the details below to add or update this delicacy in your catalogue."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Food Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Food Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Jollof Rice & Smoked Chicken"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Appetizing description of the ingredients, taste, and sides..."
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Price (₦) *
            </label>
            <input
              type="number"
              required
              min={100}
              step={50}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          {/* Optional Discount Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Discount / Promo Price (₦, Optional)
            </label>
            <input
              type="number"
              min={0}
              step={50}
              value={discountPrice}
              onChange={e => setDiscountPrice(e.target.value)}
              placeholder="e.g. 3200"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Category *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            >
              {categories.map(c => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Prep Time */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Estimated Prep Time
            </label>
            <input
              type="text"
              value={preparationTime}
              onChange={e => setPreparationTime(e.target.value)}
              placeholder="e.g. 20-30 mins"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          {/* Ingredients */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Key Ingredients (comma separated)
            </label>
            <input
              type="text"
              value={ingredientsText}
              onChange={e => setIngredientsText(e.target.value)}
              placeholder="Parboiled rice, fresh scotch bonnet, fried chicken, bay leaf..."
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>
        </div>

        {/* Image Selection Section */}
        <div className="border border-border rounded-2xl p-4 bg-background/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--brown)" }}>
              Food Photo
            </span>

            <div className="flex gap-1 text-xs">
              {(["gallery", "upload", "url"] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveImageTab(tab)}
                  className="px-2.5 py-1 rounded-lg font-semibold capitalize transition-colors"
                  style={{
                    background: activeImageTab === tab ? "var(--primary)" : "transparent",
                    color: activeImageTab === tab ? "#fff" : "var(--muted-foreground)",
                  }}
                >
                  {tab === "gallery" ? "Presets" : tab === "upload" ? "Upload" : "Custom URL"}
                </button>
              ))}
            </div>
          </div>

          {/* Image Preview & Selector */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-border flex-shrink-0 bg-muted">
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Icon name="image" size={24} />
                </div>
              )}
            </div>

            <div className="flex-1 w-full">
              {activeImageTab === "gallery" && (
                <div className="grid grid-cols-4 gap-2 max-h-28 overflow-y-auto p-1">
                  {CURATED_FOOD_GALLERY.map(preset => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        image === preset.url ? "ring-2 ring-primary scale-95" : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {activeImageTab === "upload" && (
                <div className="space-y-2">
                  <label className="block w-full border-2 border-dashed border-border hover:border-primary rounded-xl p-4 text-center cursor-pointer transition-colors">
                    <Icon name="upload" size={20} className="mx-auto mb-1 text-primary" />
                    <span className="text-xs font-semibold text-primary">Click to select photo from device</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <p className="text-[11px] text-muted-foreground">Images are automatically optimized for web preview.</p>
                </div>
              )}

              {activeImageTab === "url" && (
                <div>
                  <input
                    type="url"
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2"
                    style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Paste a direct image link from Unsplash or web.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toggles: Availability, Featured, Weekend Special */}
        <div className="grid sm:grid-cols-3 gap-3">
          {/* Availability */}
          <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-border bg-background/60 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={available}
              onChange={e => setAvailable(e.target.checked)}
              className="rounded text-primary focus:ring-ring w-4 h-4"
            />
            <div>
              <div className="text-xs font-bold" style={{ color: "var(--brown)" }}>Available for Order</div>
              <div className="text-[10px] text-muted-foreground">In stock today</div>
            </div>
          </label>

          {/* Featured on Home */}
          <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-border bg-background/60 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={featured}
              onChange={e => setFeatured(e.target.checked)}
              className="rounded text-primary focus:ring-ring w-4 h-4"
            />
            <div>
              <div className="text-xs font-bold" style={{ color: "var(--brown)" }}>Featured Meal</div>
              <div className="text-[10px] text-muted-foreground">Show in Homepage grid</div>
            </div>
          </label>

          {/* Today's Special */}
          <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-border bg-background/60 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isSpecial}
              onChange={e => setIsSpecial(e.target.checked)}
              className="rounded text-primary focus:ring-ring w-4 h-4"
            />
            <div>
              <div className="text-xs font-bold" style={{ color: "var(--brown)" }}>Weekend Special</div>
              <div className="text-[10px] text-muted-foreground">Add special banner tag</div>
            </div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-border text-xs font-bold hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-full text-xs font-bold shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            {isSaving ? "Saving Delicacy..." : itemToEdit ? "Update Food Item" : "Add to Catalogue"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default FoodModal;
