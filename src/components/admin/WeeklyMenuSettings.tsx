import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import Icon from "../common/Icon";
import { AvailabilityBadge } from "../common/Badge";

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export function WeeklyMenuSettings() {
  const { menu, settings, updateSettings, updateMenuItem } = useApp();

  const [weekLabel, setWeekLabel] = useState(settings.weekLabel);
  const [weeklyNotice, setWeeklyNotice] = useState(settings.weeklySpecialsNotice);
  const [announcementText, setAnnouncementText] = useState(settings.announcement?.text || "");
  const [announcementEnabled, setAnnouncementEnabled] = useState(settings.announcement?.enabled ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        weekLabel: weekLabel.trim(),
        weeklySpecialsNotice: weeklyNotice.trim(),
        announcement: {
          enabled: announcementEnabled,
          text: announcementText.trim(),
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFeatured = async (id: number, current: boolean | undefined) => {
    await updateMenuItem(id, { featured: !current });
  };

  const handleToggleSpecial = async (id: number, current: boolean | undefined) => {
    await updateMenuItem(id, { isSpecial: !current });
  };

  const handleToggleAvail = async (id: number, current: boolean) => {
    await updateMenuItem(id, { available: !current });
  };

  return (
    <div className="space-y-8 animate-float-up">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: "var(--brown)" }}>
          Weekly Menu & Weekend Specials
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Rotate your menu every weekend without touching any source code.
        </p>
      </div>

      {/* Week Banner & Notice Configuration */}
      <form onSubmit={handleSaveSettings} className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="font-serif text-xl font-bold" style={{ color: "var(--brown)" }}>
          Operating Schedule & Announcement Banner
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Weekly Date Label *
            </label>
            <input
              type="text"
              required
              value={weekLabel}
              onChange={e => setWeekLabel(e.target.value)}
              placeholder="e.g. Weekend of 30–31 August 2026"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
            <p className="text-[11px] text-muted-foreground mt-1">Displayed in the header of the menu page and homepage.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Weekly Menu Notice Banner
            </label>
            <input
              type="text"
              value={weeklyNotice}
              onChange={e => setWeeklyNotice(e.target.value)}
              placeholder="e.g. Menu changes weekly. Check back every week for new meals."
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--brown)" }}>
                Top Promo / Announcement Banner
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-primary">
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={e => setAnnouncementEnabled(e.target.checked)}
                  className="rounded text-primary"
                />
                <span>Enable Banner</span>
              </label>
            </div>
            <input
              type="text"
              value={announcementText}
              onChange={e => setAnnouncementText(e.target.value)}
              placeholder="e.g. 🎉 Now taking weekend orders! Call or WhatsApp 08150781154."
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-full text-xs font-bold shadow-md transition-transform hover:scale-105 active:scale-95"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            {isSaving ? "Saving..." : "Save Operating Schedule"}
          </button>
        </div>
      </form>

      {/* Quick Meal Curator for this week */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <h3 className="font-serif text-xl font-bold" style={{ color: "var(--brown)" }}>
            Select This Week's Featured Meals & Specials
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click the badges to toggle featured meals on homepage, weekend specials ribbons, and live availability.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menu.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                item.featured || item.isSpecial ? "border-primary bg-secondary/20 shadow-xs" : "border-border bg-background/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-border flex-shrink-0 bg-muted">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm truncate" style={{ color: "var(--brown)" }}>
                    {item.name}
                  </h4>
                  <div className="text-xs font-bold text-primary mt-0.5">{naira(item.price)}</div>
                  <div className="text-[11px] text-muted-foreground">{item.category}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center gap-1.5">
                {/* Featured Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleFeatured(item.id, item.featured)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                    item.featured ? "bg-primary text-white border-primary" : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {item.featured ? "★ Featured" : "+ Feature on Home"}
                </button>

                {/* Special Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleSpecial(item.id, item.isSpecial)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                    item.isSpecial ? "bg-amber-600 text-white border-amber-600" : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {item.isSpecial ? "✦ Weekend Special" : "+ Mark Special"}
                </button>

                {/* Stock Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleAvail(item.id, item.available)}
                  className="ml-auto"
                >
                  <AvailabilityBadge available={item.available} size="sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeeklyMenuSettings;
