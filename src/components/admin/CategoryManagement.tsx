import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import type { Category } from "../../types";
import Icon from "../common/Icon";
import Modal from "../common/Modal";
import ConfirmDialog from "../common/ConfirmDialog";

export function CategoryManagement() {
  const { categories, menu, addCategory, updateCategory, deleteCategory } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
    } else {
      await addCategory({
        name: name.trim(),
        description: description.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (deletingCategory) {
      await deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  return (
    <div className="space-y-6 animate-float-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: "var(--brown)" }}>
            Food Categories Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Organize your menu sections. Changes immediately reflect in customer filter navigation.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
          style={{ background: "var(--primary)", color: "#fff" }}
        >
          <Icon name="plus" size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map(cat => {
          const itemCount = menu.filter(m => m.category === cat.name).length;
          return (
            <div
              key={cat.id}
              className="bg-card rounded-3xl p-6 border border-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold"
                    style={{ background: "var(--secondary)", color: "var(--primary)" }}
                  >
                    <Icon name="categories" size={18} />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-background border border-border text-muted-foreground">
                    {itemCount} dish{itemCount !== 1 ? "es" : ""}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold" style={{ color: "var(--brown)" }}>
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {cat.description || "No description provided."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-secondary transition-colors flex items-center gap-1.5"
                >
                  <Icon name="edit" size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeletingCategory(cat)}
                  disabled={categories.length <= 1}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Icon name="trash" size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? `Edit Category "${editingCategory.name}"` : "Add New Category"}
        subtitle="Categories will be displayed as filter chips on your customer menu page."
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Soups & Stews, Small Chops, Drinks"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Short Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of meals under this category..."
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-full border border-border text-xs font-bold hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold shadow-md transition-transform hover:scale-105 active:scale-95"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              {editingCategory ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deletingCategory?.name}"? Meals assigned to this category will still remain in your database.`}
        confirmText="Yes, Delete Category"
      />
    </div>
  );
}

export default CategoryManagement;
