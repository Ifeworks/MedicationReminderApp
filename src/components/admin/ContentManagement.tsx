import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import type { HeroContent, Testimonial } from "../../types";
import Icon from "../common/Icon";
import Modal from "../common/Modal";

export function ContentManagement() {
  const { settings, updateHeroContent, updateTestimonials } = useApp();

  // Hero state
  const [hero, setHero] = useState<HeroContent>({ ...settings.hero });
  const [isHeroSaving, setIsHeroSaving] = useState(false);

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([...settings.testimonials]);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [tName, setTName] = useState("");
  const [tRole, setTRole] = useState("");
  const [tText, setTText] = useState("");
  const [tRating, setTRating] = useState(5);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsHeroSaving(true);
    try {
      await updateHeroContent(hero);
    } finally {
      setIsHeroSaving(false);
    }
  };

  const handleOpenAddTestimonial = () => {
    setEditingTestimonial(null);
    setTName("");
    setTRole("Ido-Ekiti");
    setTText("");
    setTRating(5);
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (t: Testimonial) => {
    setEditingTestimonial(t);
    setTName(t.name);
    setTRole(t.role);
    setTText(t.text);
    setTRating(t.rating);
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tText.trim()) return;

    let updated: Testimonial[];
    if (editingTestimonial) {
      updated = testimonials.map(t =>
        t.id === editingTestimonial.id
          ? { ...t, name: tName.trim(), role: tRole.trim(), text: tText.trim(), rating: tRating }
          : t
      );
    } else {
      const newT: Testimonial = {
        id: `test-${Date.now()}`,
        name: tName.trim(),
        role: tRole.trim() || "Customer",
        text: tText.trim(),
        rating: tRating,
      };
      updated = [...testimonials, newT];
    }

    setTestimonials(updated);
    await updateTestimonials(updated);
    setIsTestimonialModalOpen(false);
  };

  const handleDeleteTestimonial = async (id: string) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    await updateTestimonials(updated);
  };

  return (
    <div className="space-y-8 animate-float-up">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: "var(--brown)" }}>
          Website Content Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Customize homepage text, hero images, calls-to-action, and authentic customer testimonials.
        </p>
      </div>

      {/* Hero Section Content Form */}
      <form onSubmit={handleSaveHero} className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="font-serif text-xl font-bold" style={{ color: "var(--brown)" }}>
            Homepage Hero Section
          </h3>
          <span className="text-xs text-muted-foreground">Appears at the very top of the homepage</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Hero Top Headline
            </label>
            <input
              type="text"
              required
              value={hero.headline}
              onChange={e => setHero(p => ({ ...p, headline: e.target.value }))}
              placeholder="e.g. Delicious Food,"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Highlighted Highlight Line (Terracotta)
            </label>
            <input
              type="text"
              required
              value={hero.highlightedText}
              onChange={e => setHero(p => ({ ...p, highlightedText: e.target.value }))}
              placeholder="e.g. Made With Love."
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Subheadline / Description
            </label>
            <textarea
              rows={2}
              required
              value={hero.subheadline}
              onChange={e => setHero(p => ({ ...p, subheadline: e.target.value }))}
              placeholder="Freshly prepared weekend meals delivered..."
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Primary Button Text
            </label>
            <input
              type="text"
              value={hero.primaryCtaText}
              onChange={e => setHero(p => ({ ...p, primaryCtaText: e.target.value }))}
              placeholder="Order This Week's Menu"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Secondary Button Text
            </label>
            <input
              type="text"
              value={hero.secondaryCtaText}
              onChange={e => setHero(p => ({ ...p, secondaryCtaText: e.target.value }))}
              placeholder="Book Home Cooking"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Location Badge Pill
            </label>
            <input
              type="text"
              value={hero.badgeText}
              onChange={e => setHero(p => ({ ...p, badgeText: e.target.value }))}
              placeholder="Serving Ido-Ekiti every weekend"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Hero Food Photo URL
            </label>
            <input
              type="url"
              value={hero.heroImage}
              onChange={e => setHero(p => ({ ...p, heroImage: e.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={isHeroSaving}
            className="px-6 py-2.5 rounded-full text-xs font-bold shadow-md transition-transform hover:scale-105 active:scale-95"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            {isHeroSaving ? "Saving Hero..." : "Save Hero Content"}
          </button>
        </div>
      </form>

      {/* Testimonials / Customer Reviews Manager */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h3 className="font-serif text-xl font-bold" style={{ color: "var(--brown)" }}>
              Customer Testimonials & Reviews
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Manage customer feedback displayed on the homepage.</p>
          </div>

          <button
            onClick={handleOpenAddTestimonial}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shadow-xs transition-transform hover:scale-105"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            <Icon name="plus" size={14} />
            <span>Add Review</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map(t => (
            <div key={t.id} className="p-5 rounded-2xl border border-border bg-background/50 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex gap-1 mb-2 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Icon key={i} name="star" size={13} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs italic text-foreground leading-relaxed">"{t.text}"</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs" style={{ color: "var(--brown)" }}>
                    {t.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{t.role}</div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditTestimonial(t)}
                    className="p-1 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-primary"
                    title="Edit review"
                  >
                    <Icon name="edit" size={12} />
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(t.id)}
                    className="p-1 rounded-lg border border-border hover:bg-rose-50 text-muted-foreground hover:text-rose-600"
                    title="Delete review"
                  >
                    <Icon name="trash" size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Testimonial Modal */}
      <Modal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        title={editingTestimonial ? "Edit Testimonial" : "Add Customer Review"}
        maxWidth="md"
      >
        <form onSubmit={handleSaveTestimonial} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Customer Name *
            </label>
            <input
              type="text"
              required
              value={tName}
              onChange={e => setTName(e.target.value)}
              placeholder="e.g. Adebola O."
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Location / Neighborhood
            </label>
            <input
              type="text"
              value={tRole}
              onChange={e => setTRole(e.target.value)}
              placeholder="e.g. Ido-Ekiti / GRA, Ado-Ekiti"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Rating (1 - 5 Stars)
            </label>
            <select
              value={tRating}
              onChange={e => setTRating(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            >
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Customer Review / Feedback *
            </label>
            <textarea
              required
              rows={3}
              value={tText}
              onChange={e => setTText(e.target.value)}
              placeholder="What did the customer say about the taste, delivery, or service?"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsTestimonialModalOpen(false)}
              className="px-5 py-2.5 rounded-full border border-border text-xs font-bold hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold shadow-md transition-transform hover:scale-105 active:scale-95"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              Save Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ContentManagement;
