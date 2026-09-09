import React from "react";
import { useApp } from "../../context/AppContext";
import Icon from "../common/Icon";

export function ContactView() {
  const { settings } = useApp();

  const waLink = `https://wa.me/${settings.business.whatsapp}?text=${encodeURIComponent(
    "Hello PB DELICACIES, I would like to make an enquiry."
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-16">
      <div className="text-center max-w-xl mx-auto">
        <span
          className="text-xs font-bold tracking-[0.2em] uppercase"
          style={{ color: "var(--gold)" }}
        >
          We're Here For You
        </span>
        <h1
          className="font-serif text-4xl sm:text-5xl font-bold mt-1"
          style={{ color: "var(--brown)" }}
        >
          Contact {settings.business.name}
        </h1>
        <p className="mt-3 text-base sm:text-lg" style={{ color: "var(--muted-foreground)" }}>
          Have a question about our weekend menu, home delivery, or booking a chef? Reach out to us directly.
        </p>
      </div>

      {/* Main Action Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={`tel:${settings.business.phone}`}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-md transition-transform hover:scale-105"
          style={{ background: "var(--primary)", color: "#fff" }}
        >
          <Icon name="phone" size={22} />
          <span>Call: {settings.business.phone}</span>
        </a>

        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-md transition-transform hover:scale-105"
          style={{ background: "var(--green)", color: "#fff" }}
        >
          <Icon name="whatsapp" size={22} />
          <span>Chat on WhatsApp</span>
        </a>
      </div>

      {/* Info Cards */}
      <div className="mt-12 grid sm:grid-cols-3 gap-5">
        <div className="bg-card rounded-3xl p-6 border border-border text-center shadow-xs">
          <div
            className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "var(--secondary)", color: "var(--primary)" }}
          >
            <Icon name="location" size={22} />
          </div>
          <h3 className="font-serif text-lg font-bold" style={{ color: "var(--brown)" }}>
            Location
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            {settings.business.location}
          </p>
        </div>

        <div className="bg-card rounded-3xl p-6 border border-border text-center shadow-xs">
          <div
            className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "var(--secondary)", color: "var(--primary)" }}
          >
            <Icon name="calendar" size={22} />
          </div>
          <h3 className="font-serif text-lg font-bold" style={{ color: "var(--brown)" }}>
            Delivery Days
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            {settings.business.openingDays}
          </p>
        </div>

        <div className="bg-card rounded-3xl p-6 border border-border text-center shadow-xs">
          <div
            className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "var(--secondary)", color: "var(--primary)" }}
          >
            <Icon name="clock" size={22} />
          </div>
          <h3 className="font-serif text-lg font-bold" style={{ color: "var(--brown)" }}>
            Opening Hours
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            {settings.business.openingHours}
          </p>
        </div>
      </div>

      {/* Visual Location Map / Card */}
      <div
        className="mt-10 rounded-3xl overflow-hidden border border-border relative shadow-sm"
        style={{ background: "var(--secondary)", minHeight: 220 }}
      >
        <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-md mb-3"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            <Icon name="location" size={28} />
          </div>
          <span className="font-serif text-2xl font-bold" style={{ color: "var(--brown)" }}>
            {settings.business.location}
          </span>
          <p className="text-sm max-w-md mt-1" style={{ color: "var(--secondary-foreground)" }}>
            Hot weekend deliveries straight to your door across Ido-Ekiti, hospital quarters, market areas, and federal polytechnic junction.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactView;
