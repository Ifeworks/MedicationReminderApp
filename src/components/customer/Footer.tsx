import React from "react";
import { useApp } from "../../context/AppContext";
import { Logo } from "../common/Logo";
import Icon from "../common/Icon";
import type { Page } from "../../types";

export function Footer() {
  const { go, settings } = useApp();

  const waLink = `https://wa.me/${settings.business.whatsapp}?text=${encodeURIComponent(
    "Hello PB DELICACIES, I would like to make an enquiry."
  )}`;

  return (
    <footer className="mt-20 border-t border-brown/10" style={{ background: "var(--brown)", color: "#f4e6d2" }}>
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        {/* Brand section */}
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 text-sm max-w-sm leading-relaxed" style={{ color: "rgba(244, 230, 210, 0.78)" }}>
            Freshly prepared weekend Nigerian meals, delivered straight to your doorstep across Ido-Ekiti — or booked for personalized in-home cooking experiences.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 shadow-sm"
              style={{ background: "var(--green)", color: "#fff" }}
            >
              <Icon name="whatsapp" size={16} /> WhatsApp: {settings.business.phone}
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-serif text-lg font-semibold mb-3" style={{ color: "var(--gold)" }}>
            Explore
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: "rgba(244, 230, 210, 0.82)" }}>
            {(
              [
                { label: "Home", page: "home" },
                { label: "This Week's Menu", page: "menu" },
                { label: "Home Cooking Service", page: "cooking" },
                { label: "Contact Us", page: "contact" },
                { label: "Admin Portal", page: "admin" },
              ] as { label: string; page: Page }[]
            ).map(n => (
              <li key={n.page}>
                <button
                  onClick={() => go(n.page)}
                  className="hover:underline transition-colors hover:text-white text-left"
                >
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-serif text-lg font-semibold mb-3" style={{ color: "var(--gold)" }}>
            Find Us
          </h4>
          <ul className="space-y-2.5 text-sm" style={{ color: "rgba(244, 230, 210, 0.82)" }}>
            <li className="flex items-start gap-2">
              <span className="mt-0.5"><Icon name="location" size={15} /></span>
              <span>{settings.business.location}</span>
            </li>
            <li className="flex items-center gap-2">
              <Icon name="phone" size={15} />
              <span>{settings.business.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <Icon name="calendar" size={15} />
              <span>{settings.business.openingDays}</span>
            </li>
            <li className="flex items-center gap-2">
              <Icon name="clock" size={15} />
              <span>{settings.business.openingHours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="border-t px-6 py-5 text-center text-xs flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-2"
        style={{ borderColor: "rgba(244, 230, 210, 0.15)", color: "rgba(244, 230, 210, 0.6)" }}
      >
        <span>© 2026 {settings.business.name}. All rights reserved.</span>
        <span>Crafted with love in Ido-Ekiti, Nigeria</span>
      </div>
    </footer>
  );
}

export default Footer;
