import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import Icon from "../common/Icon";

export function CookingView() {
  const { settings, flash } = useApp();
  const [f, setF] = useState({
    name: "",
    phone: "",
    address: "",
    date: "",
    time: "",
    people: "4",
    event: "",
    meals: "",
    notes: "",
  });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));

  const message =
    `Hello PB DELICACIES, I would like to book a home cooking session.\n\n` +
    `*Name:* ${f.name}\n` +
    `*Phone:* ${f.phone}\n` +
    `*Date:* ${f.date}\n` +
    `*Time:* ${f.time}\n` +
    `*Guests:* ${f.people} people\n` +
    `*Event:* ${f.event || "Family / Personal cooking"}\n` +
    `*Address:* ${f.address}\n` +
    `*Requested Meals:* ${f.meals}\n` +
    (f.notes ? `*Notes:* ${f.notes}` : "");

  const waLink = `https://wa.me/${settings.business.whatsapp}?text=${encodeURIComponent(message)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name || !f.phone) return;
    setSent(true);
    flash("Home cooking booking request received!");
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden" style={{ background: "var(--brown)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-5 shadow-inner"
              style={{ background: "rgba(217, 138, 61, 0.2)", color: "var(--gold)" }}
            >
              <Icon name="chef" size={14} /> PB DELICACIES Home Cooking
            </span>
            <h1
              className="font-serif font-bold leading-tight"
              style={{ color: "#f4e6d2", fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
            >
              Let Us Bring the Kitchen to You.
            </h1>
            <p className="mt-4 text-base sm:text-lg max-w-lg leading-relaxed" style={{ color: "rgba(244, 230, 210, 0.85)" }}>
              Planning a weekend gathering, family celebration, or simply craving freshly prepared Nigerian dishes cooked right inside your home kitchen? Book PB DELICACIES for a personalized culinary experience.
            </p>

            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {[
                "We come straight to your home",
                "Freshly prepared hot meals",
                "Great for families & gatherings",
                "Flexible weekend bookings",
                "Custom menu selections",
              ].map(b => (
                <li key={b} className="flex items-center gap-2.5 text-sm font-medium" style={{ color: "rgba(244, 230, 210, 0.92)" }}>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--green)", color: "#fff" }}
                  >
                    <Icon name="check" size={11} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-brown/40"
            style={{ background: "var(--muted)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1636647511729-6703539ba71f?w=900&h=700&fit=crop&auto=format"
              alt="PB DELICACIES chef preparing fresh food in home kitchen"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {sent ? (
          <div className="bg-card rounded-3xl border border-border p-8 sm:p-12 text-center shadow-lg animate-float-up">
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-inner mb-6"
              style={{ background: "rgba(74, 107, 61, 0.15)", color: "var(--green)" }}
            >
              <Icon name="check" size={38} />
            </div>
            <h2 className="font-serif text-3xl font-bold" style={{ color: "var(--brown)" }}>
              Booking Request Sent!
            </h2>
            <p className="mt-3 text-base max-w-md mx-auto" style={{ color: "var(--muted-foreground)" }}>
              Thank you, <span className="font-bold text-foreground">{f.name}</span>. We have logged your home cooking request and will reach out shortly to align on details and chef availability.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold shadow-md transition-transform hover:scale-105"
                style={{ background: "var(--green)", color: "#fff" }}
              >
                <Icon name="whatsapp" size={18} />
                <span>Confirm on WhatsApp</span>
              </a>
              <button
                onClick={() => setSent(false)}
                className="px-6 py-4 rounded-full font-bold border hover:bg-secondary transition-colors"
                style={{ borderColor: "var(--border)", color: "var(--brown)" }}
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-10 shadow-sm">
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: "var(--brown)" }}>
                Book a Home Cooking Session
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                Fill out the form below and we will contact you to confirm timing, menu choices, and ingredients.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={f.name}
                  onChange={set("name")}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                  Phone Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={f.phone}
                  onChange={set("phone")}
                  placeholder="0803 000 0000"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                  Home Address / Location
                </label>
                <input
                  type="text"
                  value={f.address}
                  onChange={set("address")}
                  placeholder="e.g. GRA, Ado-Ekiti / Hospital Road, Ido-Ekiti"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={f.date}
                  onChange={set("date")}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                  Preferred Time
                </label>
                <input
                  type="time"
                  value={f.time}
                  onChange={set("time")}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                  Number of People
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={f.people}
                  onChange={set("people")}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                  Type of Event
                </label>
                <input
                  type="text"
                  value={f.event}
                  onChange={set("event")}
                  placeholder="e.g. Birthday, Family Gathering, Weekend Chill"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                  Preferred Meals / Special Dishes
                </label>
                <input
                  type="text"
                  value={f.meals}
                  onChange={set("meals")}
                  placeholder="e.g. Smoky Jollof Rice, Pounded Yam & Egusi, Peppered Chicken..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                  Additional Notes or Kitchen Requirements
                </label>
                <textarea
                  value={f.notes}
                  onChange={set("notes")}
                  rows={2}
                  placeholder="Any dietary preferences, kitchen setup details, or specific requests..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
                />
              </div>

              <div className="sm:col-span-2 mt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-full font-bold shadow-md transition-transform hover:scale-[1.01] active:scale-95 text-base flex items-center justify-center gap-2"
                  style={{ background: "var(--primary)", color: "#fff" }}
                >
                  <Icon name="chef" size={20} />
                  <span>Request a Cooking Booking</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}

export default CookingView;
