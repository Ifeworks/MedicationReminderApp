import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Logo } from "../common/Logo";
import Icon from "../common/Icon";
import type { Page } from "../../types";

const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "This Week's Menu", page: "menu" },
  { label: "Home Cooking", page: "cooking" },
  { label: "Contact", page: "contact" },
];

export function Header() {
  const { page, go, cartCount, settings } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const waLink = `https://wa.me/${settings.business.whatsapp}?text=${encodeURIComponent(
    "Hello PB DELICACIES, I would like to place an order."
  )}`;

  return (
    <header
      className="sticky top-0 z-40 border-b border-border"
      style={{ background: "rgba(251, 246, 238, 0.92)", backdropFilter: "blur(14px)" }}
    >
      {/* Top announcement if active */}
      {settings.announcement?.enabled && (
        <div
          className="py-1.5 px-4 text-center text-xs font-semibold text-white tracking-wide"
          style={{ background: "var(--primary)" }}
        >
          {settings.announcement.text}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button
          onClick={() => go("home")}
          className="focus:outline-none focus-visible:ring-2 rounded-xl p-1 -m-1 group"
        >
          <Logo />
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(n => {
            const active = page === n.page;
            return (
              <button
                key={n.page}
                onClick={() => go(n.page)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  color: active ? "var(--primary)" : "var(--muted-foreground)",
                  background: active ? "var(--secondary)" : "transparent",
                  fontWeight: active ? 600 : 500,
                }}
              >
                {n.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Direct WhatsApp link */}
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-[1.03]"
            style={{ background: "rgba(74, 107, 61, 0.12)", color: "var(--green)" }}
          >
            <Icon name="whatsapp" size={16} />
            <span>WhatsApp</span>
          </a>

          {/* Cart button */}
          <button
            onClick={() => go("cart")}
            className="relative w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-secondary"
            style={{ color: "var(--brown)" }}
            aria-label="Cart"
          >
            <Icon name="cart" size={20} />
            {cartCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full text-[11px] font-bold flex items-center justify-center shadow-sm animate-float-up"
                style={{ background: "var(--primary)", color: "#fff" }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Order now CTA */}
          <button
            onClick={() => go("menu")}
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-transform hover:scale-[1.03]"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Order Now
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(o => !o)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            style={{ color: "var(--brown)" }}
            aria-label="Toggle menu"
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t border-border px-4 py-4 flex flex-col gap-1.5 animate-float-up shadow-lg"
          style={{ background: "var(--background)" }}
        >
          {NAV_ITEMS.map(n => {
            const active = page === n.page;
            return (
              <button
                key={n.page}
                onClick={() => {
                  go(n.page);
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  color: active ? "var(--primary)" : "var(--foreground)",
                  background: active ? "var(--secondary)" : "transparent",
                }}
              >
                {n.label}
              </button>
            );
          })}

          <div className="h-px my-2" style={{ background: "var(--border)" }} />

          <button
            onClick={() => {
              go("admin");
              setMobileMenuOpen(false);
            }}
            className="text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            style={{ color: "var(--primary)" }}
          >
            <Icon name="shield" size={16} /> Owner Dashboard
          </button>

          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold"
            style={{ background: "var(--green)", color: "#fff" }}
          >
            <Icon name="whatsapp" size={16} /> Chat on WhatsApp ({settings.business.phone})
          </a>
        </div>
      )}
    </header>
  );
}

export default Header;
