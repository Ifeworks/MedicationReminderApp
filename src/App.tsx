import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Business constants                                                  */
/* ------------------------------------------------------------------ */

const BUSINESS = {
  name: "PB DELICACIES",
  location: "Ido-Ekiti, Ekiti State, Nigeria",
  phone: "08150781154",
  whatsapp: "2348150781154", // international format for wa.me
};

const DELIVERY_FEE = 1000;

function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

function img(id: string, w = 800, h = 600) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;
}

function waLink(message: string) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}

/* ------------------------------------------------------------------ */
/*  Menu data — structured so the owner can swap it every week         */
/* ------------------------------------------------------------------ */

type Category = "Rice" | "Swallows & Soups" | "Proteins" | "Sides" | "Drinks";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  available: boolean;
  featured?: boolean;
}

const WEEK_LABEL = "Weekend of 30–31 August 2026";

const MENU: MenuItem[] = [
  {
    id: 1,
    name: "Jollof Rice & Chicken",
    description: "Smoky Nigerian-style jollof rice served with tender fried chicken.",
    price: 3500,
    category: "Rice",
    image: img("1665332195309-9d75071138f0"),
    available: true,
    featured: true,
  },
  {
    id: 2,
    name: "Fried Rice & Chicken",
    description: "Colourful fried rice tossed with vegetables, liver and juicy chicken.",
    price: 3800,
    category: "Rice",
    image: img("1665556899022-9761f95769e5"),
    available: true,
    featured: true,
  },
  {
    id: 3,
    name: "Ofada Rice & Ayamase Sauce",
    description: "Local ofada rice with rich, peppery green ayamase (designer) stew.",
    price: 4000,
    category: "Rice",
    image: img("1664993101841-036f189719b6"),
    available: true,
    featured: true,
  },
  {
    id: 4,
    name: "Pounded Yam & Egusi Soup",
    description: "Soft pounded yam with melon-seed egusi soup, spinach and assorted meat.",
    price: 4200,
    category: "Swallows & Soups",
    image: img("1604329760661-e71dc83f8f26"),
    available: true,
    featured: true,
  },
  {
    id: 5,
    name: "Amala & Ewedu",
    description: "Smooth amala paired with silky ewedu and gbegiri, topped with stew.",
    price: 3200,
    category: "Swallows & Soups",
    image: img("1584789900011-0c3d178c58f8"),
    available: true,
  },
  {
    id: 6,
    name: "Assorted Meat Platter",
    description: "Generous selection of grilled and peppered assorted meats.",
    price: 5000,
    category: "Proteins",
    image: img("1664992960082-0ea299a9c53e"),
    available: true,
    featured: true,
  },
  {
    id: 7,
    name: "Peppered Grilled Chicken",
    description: "Half chicken marinated in pepper spice and flame-grilled.",
    price: 3000,
    category: "Proteins",
    image: img("1665333048952-a3ee97714c6b"),
    available: true,
  },
  {
    id: 8,
    name: "Fried Plantain (Dodo)",
    description: "Sweet ripe plantain fried golden — the perfect side.",
    price: 1200,
    category: "Sides",
    image: img("1705088293125-063256c88cf5"),
    available: true,
  },
  {
    id: 9,
    name: "Moi Moi",
    description: "Steamed bean pudding with egg and fish, soft and savoury.",
    price: 1000,
    category: "Sides",
    image: img("1618426660666-2fbac6f11227"),
    available: false,
  },
  {
    id: 10,
    name: "Chapman",
    description: "Chilled Nigerian punch with a citrus-berry kick.",
    price: 1500,
    category: "Drinks",
    image: img("1540138411301-84af810a9a44"),
    available: true,
  },
  {
    id: 11,
    name: "Zobo Drink",
    description: "Refreshing hibiscus drink infused with pineapple and ginger.",
    price: 800,
    category: "Drinks",
    image: img("1786114911080-8a01bfb07163"),
    available: true,
  },
];

const CATEGORIES: Category[] = ["Rice", "Swallows & Soups", "Proteins", "Sides", "Drinks"];

const EXTRAS = [
  { name: "Extra Chicken", price: 1500 },
  { name: "Extra Plantain", price: 800 },
  { name: "Coleslaw", price: 700 },
];

/* ------------------------------------------------------------------ */
/*  Cart types & routing                                               */
/* ------------------------------------------------------------------ */

interface CartLine {
  key: string;
  item: MenuItem;
  qty: number;
  extras: string[];
  instructions: string;
}

type Page = "home" | "menu" | "cooking" | "contact" | "cart" | "checkout" | "confirm" | "admin";

interface OrderInfo {
  id: string;
  name: string;
  area: string;
  address: string;
  total: number;
  type: string;
  lines: CartLine[];
}

/* ------------------------------------------------------------------ */
/*  Small UI atoms                                                      */
/* ------------------------------------------------------------------ */

function Icon({ path, size = 20, fill = "none" }: { path: string; size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {path.split("|").map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

const ICONS = {
  cart: "M6 6h15l-1.5 9h-12z|M6 6 5 3H2|M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z|M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  whatsapp: "M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 21l1.5-5a8.5 8.5 0 0 1 8-11.5 8.38 8.38 0 0 1 8.5 8.5z",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  plus: "M12 5v14|M5 12h14",
  minus: "M5 12h14",
  check: "M20 6 9 17l-5-5",
  location: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z|M12 10a3 3 0 1 0 0-.01",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 6v6l4 2",
  fire: "M12 2c1 3-1 4-2 6s0 4 2 4 3-2 2-5c2 1 4 4 4 7a6 6 0 0 1-12 0c0-4 4-6 6-12z",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21l8.84-8.61a5.5 5.5 0 0 0 0-7.78z",
  truck: "M1 3h15v13H1z|M16 8h4l3 3v5h-7|M5.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z|M18.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  chef: "M6 13a4 4 0 1 1 1-7.87A4 4 0 0 1 15 4a4 4 0 0 1 3 6.87V13z|M6 13v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-6",
  arrow: "M5 12h14|M12 5l7 7-7 7",
  close: "M18 6 6 18|M6 6l12 12",
  menu: "M3 12h18|M3 6h18|M3 18h18",
  trash: "M3 6h18|M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
  star: "M12 2l3 6.5 7 .5-5.5 4.5 2 7L12 17l-6.5 3.5 2-7L2 9l7-.5z",
  spark: "M12 3v4|M12 17v4|M3 12h4|M17 12h4|M6 6l2.5 2.5|M15.5 15.5 18 18|M18 6l-2.5 2.5|M8.5 15.5 6 18",
};

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        <Icon path={ICONS.chef} size={18} />
      </div>
      <div className="leading-none">
        <div className="font-serif text-lg font-semibold tracking-tight" style={{ color: light ? "#fff7ee" : "var(--brown)" }}>
          PB DELICACIES
        </div>
        <div className="text-[10px] tracking-[0.2em] uppercase" style={{ color: light ? "rgba(255,247,238,0.7)" : "var(--muted-foreground)" }}>
          Made with love
        </div>
      </div>
    </div>
  );
}

function Badge({ available }: { available: boolean }) {
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
      style={{
        background: available ? "rgba(74,107,61,0.12)" : "rgba(43,28,20,0.08)",
        color: available ? "var(--green)" : "var(--muted-foreground)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: available ? "var(--green)" : "var(--muted-foreground)" }} />
      {available ? "Available" : "Sold out"}
    </span>
  );
}

function QtyStepper({ qty, onChange, size = "md" }: { qty: number; onChange: (n: number) => void; size?: "sm" | "md" }) {
  const btn = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card">
      <button
        onClick={() => onChange(Math.max(1, qty - 1))}
        className={`${btn} flex items-center justify-center rounded-full hover:bg-muted transition-colors`}
        style={{ color: "var(--brown)" }}
        aria-label="Decrease"
      >
        <Icon path={ICONS.minus} size={14} />
      </button>
      <span className="w-8 text-center font-semibold tabular-nums" style={{ color: "var(--brown)" }}>{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        className={`${btn} flex items-center justify-center rounded-full hover:bg-muted transition-colors`}
        style={{ color: "var(--brown)" }}
        aria-label="Increase"
      >
        <Icon path={ICONS.plus} size={14} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Header + footer                                                    */
/* ------------------------------------------------------------------ */

const NAV: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "This Week's Menu", page: "menu" },
  { label: "Home Cooking", page: "cooking" },
  { label: "Contact", page: "contact" },
];

function Header({ page, go, cartCount }: { page: Page; go: (p: Page) => void; cartCount: number }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border" style={{ background: "rgba(251,246,238,0.9)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button onClick={() => go("home")}><Logo /></button>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map(n => (
            <button
              key={n.page}
              onClick={() => go(n.page)}
              className="px-3.5 py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                color: page === n.page ? "var(--primary)" : "var(--muted-foreground)",
                background: page === n.page ? "var(--secondary)" : "transparent",
              }}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink("Hello PB DELICACIES, I would like to place an order.")}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-[1.03]"
            style={{ background: "rgba(74,107,61,0.12)", color: "var(--green)" }}
          >
            <Icon path={ICONS.whatsapp} size={16} /> WhatsApp
          </a>
          <button
            onClick={() => go("cart")}
            className="relative w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-secondary"
            style={{ color: "var(--brown)" }}
            aria-label="Cart"
          >
            <Icon path={ICONS.cart} size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full text-[11px] font-bold flex items-center justify-center" style={{ background: "var(--primary)", color: "#fff" }}>
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => go("menu")}
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-[1.03]"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Order Now
          </button>
          <button
            onClick={() => setOpen(o => !o)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary"
            style={{ color: "var(--brown)" }}
            aria-label="Menu"
          >
            <Icon path={open ? ICONS.close : ICONS.menu} size={20} />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border px-4 py-3 flex flex-col gap-1 animate-float-up" style={{ background: "var(--background)" }}>
          {NAV.map(n => (
            <button
              key={n.page}
              onClick={() => { go(n.page); setOpen(false); }}
              className="text-left px-3 py-2.5 rounded-xl text-sm font-medium"
              style={{ color: page === n.page ? "var(--primary)" : "var(--foreground)", background: page === n.page ? "var(--secondary)" : "transparent" }}
            >
              {n.label}
            </button>
          ))}
          <button onClick={() => { go("admin"); setOpen(false); }} className="text-left px-3 py-2.5 rounded-xl text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
            Owner Dashboard
          </button>
        </div>
      )}
    </header>
  );
}

function Footer({ go }: { go: (p: Page) => void }) {
  return (
    <footer className="mt-20" style={{ background: "var(--brown)", color: "#f4e6d2" }}>
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 text-sm max-w-xs" style={{ color: "rgba(244,230,210,0.75)" }}>
            Freshly prepared weekend Nigerian meals, delivered across Ido-Ekiti — or cooked right in your home.
          </p>
          <a
            href={waLink("Hello PB DELICACIES, I would like to place an order.")}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: "var(--green)", color: "#fff" }}
          >
            <Icon path={ICONS.whatsapp} size={16} /> Chat on WhatsApp
          </a>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-3" style={{ color: "var(--gold)" }}>Explore</h4>
          <ul className="space-y-2 text-sm" style={{ color: "rgba(244,230,210,0.8)" }}>
            {NAV.map(n => (
              <li key={n.page}>
                <button onClick={() => go(n.page)} className="hover:underline">{n.label}</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-3" style={{ color: "var(--gold)" }}>Find Us</h4>
          <ul className="space-y-2 text-sm" style={{ color: "rgba(244,230,210,0.8)" }}>
            <li className="flex items-start gap-2"><Icon path={ICONS.location} size={16} /> {BUSINESS.location}</li>
            <li className="flex items-center gap-2"><Icon path={ICONS.phone} size={16} /> {BUSINESS.phone}</li>
          </ul>
        </div>
      </div>
      <div className="border-t px-6 py-5 text-center text-xs" style={{ borderColor: "rgba(244,230,210,0.15)", color: "rgba(244,230,210,0.6)" }}>
        © 2026 PB DELICACIES. All rights reserved.
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Meal card + detail modal                                           */
/* ------------------------------------------------------------------ */

function MealCard({ item, onOpen, onAdd }: { item: MenuItem; onOpen: () => void; onAdd: () => void }) {
  return (
    <div className="group bg-card rounded-3xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <button onClick={onOpen} className="relative aspect-[4/3] overflow-hidden text-left" style={{ background: "var(--muted)" }}>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ opacity: item.available ? 1 : 0.55 }}
          loading="lazy"
        />
        <div className="absolute top-3 left-3"><Badge available={item.available} /></div>
      </button>
      <div className="p-5 flex flex-col flex-1">
        <button onClick={onOpen} className="text-left">
          <h3 className="font-serif text-lg font-semibold leading-snug" style={{ color: "var(--brown)" }}>{item.name}</h3>
        </button>
        <p className="text-sm mt-1.5 flex-1" style={{ color: "var(--muted-foreground)" }}>{item.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-serif text-xl font-semibold" style={{ color: "var(--primary)" }}>{naira(item.price)}</span>
          <button
            onClick={onAdd}
            disabled={!item.available}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            <Icon path={ICONS.plus} size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ item, onClose, onAdd }: { item: MenuItem; onClose: () => void; onAdd: (qty: number, extras: string[], instructions: string) => void }) {
  const [qty, setQty] = useState(1);
  const [extras, setExtras] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const extrasTotal = extras.reduce((s, e) => s + (EXTRAS.find(x => x.name === e)?.price || 0), 0);
  const total = (item.price + extrasTotal) * qty;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: "rgba(43,28,20,0.55)" }} onClick={onClose}>
      <div
        className="bg-card w-full max-w-lg sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto animate-float-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10]" style={{ background: "var(--muted)" }}>
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.9)", color: "var(--brown)" }}>
            <Icon path={ICONS.close} size={18} />
          </button>
          <div className="absolute bottom-3 left-3"><Badge available={item.available} /></div>
        </div>
        <div className="p-6">
          <h2 className="font-serif text-2xl font-semibold" style={{ color: "var(--brown)" }}>{item.name}</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>{item.description}</p>
          <div className="mt-3 font-serif text-2xl font-semibold" style={{ color: "var(--primary)" }}>{naira(item.price)}</div>

          <div className="mt-5">
            <div className="text-sm font-semibold mb-2" style={{ color: "var(--brown)" }}>Optional extras</div>
            <div className="flex flex-col gap-2">
              {EXTRAS.map(ex => {
                const on = extras.includes(ex.name);
                return (
                  <button
                    key={ex.name}
                    onClick={() => setExtras(p => on ? p.filter(e => e !== ex.name) : [...p, ex.name])}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-colors"
                    style={{ borderColor: on ? "var(--primary)" : "var(--border)", background: on ? "var(--secondary)" : "transparent" }}
                  >
                    <span className="flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                      <span className="w-4 h-4 rounded-full flex items-center justify-center border" style={{ borderColor: on ? "var(--primary)" : "var(--border)", background: on ? "var(--primary)" : "transparent", color: "#fff" }}>
                        {on && <Icon path={ICONS.check} size={10} />}
                      </span>
                      {ex.name}
                    </span>
                    <span style={{ color: "var(--muted-foreground)" }}>+{naira(ex.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-semibold mb-2 block" style={{ color: "var(--brown)" }}>Special instructions</label>
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              rows={2}
              placeholder="e.g. Extra pepper, no onions..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <QtyStepper qty={qty} onChange={setQty} />
            <button
              onClick={() => onAdd(qty, extras, instructions)}
              disabled={!item.available}
              className="flex-1 py-3 rounded-full font-semibold transition-transform hover:scale-[1.02] disabled:opacity-40"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Add to Cart · {naira(total)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME page                                                          */
/* ------------------------------------------------------------------ */

function Home({ go, openItem, addItem }: { go: (p: Page) => void; openItem: (i: MenuItem) => void; addItem: (i: MenuItem) => void }) {
  const featured = MENU.filter(m => m.featured);
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="animate-float-up">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}>
              <Icon path={ICONS.location} size={13} /> Serving Ido-Ekiti every weekend
            </span>
            <h1 className="font-serif font-semibold leading-[1.05] tracking-tight" style={{ color: "var(--brown)", fontSize: "clamp(2.4rem, 6vw, 4rem)" }}>
              Delicious Food,<br />
              <span style={{ color: "var(--primary)" }}>Made With Love.</span>
            </h1>
            <p className="mt-5 text-lg max-w-md" style={{ color: "var(--muted-foreground)" }}>
              Freshly prepared weekend meals delivered to you in Ido-Ekiti — or let us bring the kitchen to your home.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => go("menu")} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold transition-transform hover:scale-[1.03]" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                Order This Week's Menu <Icon path={ICONS.arrow} size={16} />
              </button>
              <button onClick={() => go("cooking")} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold border transition-colors hover:bg-secondary" style={{ borderColor: "var(--border)", color: "var(--brown)" }}>
                <Icon path={ICONS.chef} size={16} /> Book Home Cooking
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl rotate-1" style={{ background: "var(--muted)" }}>
              <img src={img("1665332195309-9d75071138f0", 900, 900)} alt="Jollof rice with grilled fish and vegetables" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-2 sm:-left-5 bg-card rounded-2xl shadow-xl px-5 py-4 border border-border flex items-center gap-3 -rotate-2">
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(217,138,61,0.15)", color: "var(--gold)" }}>
                <Icon path={ICONS.star} size={20} fill="var(--gold)" />
              </div>
              <div>
                <div className="font-serif text-lg font-semibold" style={{ color: "var(--brown)" }}>4.9 / 5</div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Loved by Ido-Ekiti</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly special */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "var(--gold)" }}>{WEEK_LABEL}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold mt-1" style={{ color: "var(--brown)" }}>What's Cooking This Weekend?</h2>
          </div>
          <button onClick={() => go("menu")} className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap" style={{ color: "var(--primary)" }}>
            Full menu <Icon path={ICONS.arrow} size={15} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map(item => (
            <MealCard key={item.id} item={item} onOpen={() => openItem(item)} onAdd={() => addItem(item)} />
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: "var(--secondary)" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--primary)", color: "#fff" }}>
              <Icon path={ICONS.truck} size={24} />
            </div>
            <h3 className="font-serif text-2xl font-semibold" style={{ color: "var(--brown)" }}>Weekend Food Delivery</h3>
            <p className="mt-2 text-sm max-w-sm" style={{ color: "var(--secondary-foreground)" }}>
              Order freshly prepared meals and have them delivered to your doorstep.
            </p>
            <button onClick={() => go("menu")} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: "var(--primary)", color: "#fff" }}>
              View Menu <Icon path={ICONS.arrow} size={15} />
            </button>
          </div>
          <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: "var(--brown)" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--gold)", color: "#3a2412" }}>
              <Icon path={ICONS.chef} size={24} />
            </div>
            <h3 className="font-serif text-2xl font-semibold" style={{ color: "#f4e6d2" }}>Home Cooking Service</h3>
            <p className="mt-2 text-sm max-w-sm" style={{ color: "rgba(244,230,210,0.8)" }}>
              Hosting a family gathering or simply want a freshly cooked meal at home? Book PB DELICACIES to cook for you.
            </p>
            <button onClick={() => go("cooking")} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: "var(--gold)", color: "#3a2412" }}>
              Book a Cooking Session <Icon path={ICONS.arrow} size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20">
        <h2 className="font-serif text-3xl font-semibold text-center mb-8" style={{ color: "var(--brown)" }}>Why Choose Us</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: ICONS.fire, title: "Freshly Prepared", text: "Cooked to order each weekend — never frozen." },
            { icon: ICONS.truck, title: "Weekend Delivery", text: "Straight to your door across Ido-Ekiti." },
            { icon: ICONS.chef, title: "Home Cooking", text: "We come and cook in your own kitchen." },
            { icon: ICONS.heart, title: "Local & Trusted", text: "A neighbour you can count on." },
          ].map(b => (
            <div key={b.title} className="bg-card rounded-2xl p-6 border border-border text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
                <Icon path={b.icon} size={22} />
              </div>
              <h4 className="font-serif text-lg font-semibold" style={{ color: "var(--brown)" }}>{b.title}</h4>
              <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20">
        <h2 className="font-serif text-3xl font-semibold text-center mb-2" style={{ color: "var(--brown)" }}>How It Works</h2>
        <p className="text-center text-sm mb-10" style={{ color: "var(--muted-foreground)" }}>Three simple steps to a delicious meal.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "1", title: "Choose Your Food", text: "Browse the weekly menu and select what you want." },
            { n: "2", title: "Place Your Order", text: "Add your meals to the cart and provide your delivery details." },
            { n: "3", title: "Enjoy Your Meal", text: "Receive your food at your chosen location." },
          ].map((s, i) => (
            <div key={s.n} className="relative bg-card rounded-3xl p-7 border border-border">
              <div className="font-serif text-5xl font-semibold" style={{ color: "var(--secondary)" }}>{s.n}</div>
              <h4 className="font-serif text-xl font-semibold mt-2" style={{ color: "var(--brown)" }}>{s.title}</h4>
              <p className="text-sm mt-1.5" style={{ color: "var(--muted-foreground)" }}>{s.text}</p>
              {i < 2 && <div className="hidden md:block absolute top-1/2 -right-3 text-primary" style={{ color: "var(--gold)" }}><Icon path={ICONS.arrow} size={20} /></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20">
        <h2 className="font-serif text-3xl font-semibold text-center mb-8" style={{ color: "var(--brown)" }}>What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: "Adebola O.", role: "Ido-Ekiti", text: "The jollof rice tastes just like my mum's! Delivery was quick and the packaging was so neat." },
            { name: "Tunde A.", role: "GRA, Ado-Ekiti", text: "Booked them to cook for my family reunion. Everyone was impressed — truly homemade quality." },
            { name: "Grace E.", role: "Fajuyi Area", text: "My weekend go-to. Fresh, generous portions and always on time. Highly recommended!" },
          ].map(t => (
            <div key={t.name} className="bg-card rounded-3xl p-6 border border-border">
              <div className="flex gap-0.5 mb-3" style={{ color: "var(--gold)" }}>
                {Array.from({ length: 5 }).map((_, i) => <Icon key={i} path={ICONS.star} size={15} fill="var(--gold)" />)}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>"{t.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-semibold" style={{ background: "var(--secondary)", color: "var(--primary)" }}>{t.name[0]}</div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--brown)" }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-4" style={{ color: "var(--muted-foreground)" }}>
          Sample reviews — the owner can replace these with real customer feedback.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MENU page                                                          */
/* ------------------------------------------------------------------ */

function MenuPage({ openItem, addItem }: { openItem: (i: MenuItem) => void; addItem: (i: MenuItem) => void }) {
  const [active, setActive] = useState<Category | "All">("All");
  const shown = active === "All" ? MENU : MENU.filter(m => m.category === active);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold" style={{ color: "var(--brown)" }}>This Week's Menu</h1>
        <p className="mt-3 text-lg" style={{ color: "var(--muted-foreground)" }}>Freshly prepared meals available for this weekend.</p>
      </div>

      <div className="mt-6 rounded-2xl px-5 py-3.5 flex items-center gap-3 text-sm" style={{ background: "rgba(217,138,61,0.12)", color: "#8a5a1c" }}>
        <Icon path={ICONS.spark} size={18} />
        Menu changes weekly. Check back every week for new meals.
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {(["All", ...CATEGORIES] as const).map(c => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0"
            style={{
              background: active === c ? "var(--primary)" : "var(--card)",
              color: active === c ? "#fff" : "var(--muted-foreground)",
              border: `1px solid ${active === c ? "var(--primary)" : "var(--border)"}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {(active === "All" ? CATEGORIES : [active]).map(cat => {
        const items = shown.filter(m => m.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="mt-10">
            <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-3" style={{ color: "var(--brown)" }}>
              {cat}
              <span className="h-px flex-1" style={{ background: "var(--border)" }} />
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map(item => (
                <MealCard key={item.id} item={item} onOpen={() => openItem(item)} onAdd={() => addItem(item)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CART page                                                          */
/* ------------------------------------------------------------------ */

function lineTotal(l: CartLine) {
  const extras = l.extras.reduce((s, e) => s + (EXTRAS.find(x => x.name === e)?.price || 0), 0);
  return (l.item.price + extras) * l.qty;
}

function CartPage({ cart, setQty, remove, go }: { cart: CartLine[]; setQty: (k: string, n: number) => void; remove: (k: string) => void; go: (p: Page) => void }) {
  const subtotal = cart.reduce((s, l) => s + lineTotal(l), 0);
  const total = subtotal + (cart.length ? DELIVERY_FEE : 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
          <Icon path={ICONS.cart} size={32} />
        </div>
        <h1 className="font-serif text-3xl font-semibold mt-6" style={{ color: "var(--brown)" }}>Your cart is empty</h1>
        <p className="mt-2" style={{ color: "var(--muted-foreground)" }}>Add some delicious meals from this week's menu.</p>
        <button onClick={() => go("menu")} className="mt-6 px-6 py-3 rounded-full font-semibold" style={{ background: "var(--primary)", color: "#fff" }}>Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
      <h1 className="font-serif text-4xl font-semibold" style={{ color: "var(--brown)" }}>Your Cart</h1>
      <div className="mt-6 grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-3">
          {cart.map(l => (
            <div key={l.key} className="bg-card rounded-2xl border border-border p-4 flex gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "var(--muted)" }}>
                <img src={l.item.image} alt={l.item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <h3 className="font-serif text-lg font-semibold" style={{ color: "var(--brown)" }}>{l.item.name}</h3>
                  <button onClick={() => remove(l.key)} className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0" aria-label="Remove">
                    <Icon path={ICONS.trash} size={18} />
                  </button>
                </div>
                {l.extras.length > 0 && <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>+ {l.extras.join(", ")}</p>}
                {l.instructions && <p className="text-xs mt-0.5 italic" style={{ color: "var(--muted-foreground)" }}>"{l.instructions}"</p>}
                <div className="flex items-center justify-between mt-3">
                  <QtyStepper qty={l.qty} onChange={n => setQty(l.key, n)} size="sm" />
                  <span className="font-serif text-lg font-semibold" style={{ color: "var(--primary)" }}>{naira(lineTotal(l))}</span>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => go("menu")} className="self-start mt-1 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--primary)" }}>
            <Icon path={ICONS.plus} size={15} /> Continue Shopping
          </button>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 lg:sticky lg:top-24">
          <h3 className="font-serif text-xl font-semibold mb-4" style={{ color: "var(--brown)" }}>Order Summary</h3>
          <Row label="Subtotal" value={naira(subtotal)} />
          <Row label="Delivery fee" value={naira(DELIVERY_FEE)} />
          <div className="h-px my-3" style={{ background: "var(--border)" }} />
          <Row label="Total" value={naira(total)} bold />
          <button onClick={() => go("checkout")} className="mt-5 w-full py-3.5 rounded-full font-semibold transition-transform hover:scale-[1.02]" style={{ background: "var(--primary)", color: "#fff" }}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-baseline py-1">
      <span className={bold ? "font-serif text-lg font-semibold" : "text-sm"} style={{ color: bold ? "var(--brown)" : "var(--muted-foreground)" }}>{label}</span>
      <span className={bold ? "font-serif text-xl font-semibold" : "text-sm font-medium"} style={{ color: bold ? "var(--primary)" : "var(--foreground)" }}>{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable form field                                                */
/* ------------------------------------------------------------------ */

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-1.5 block" style={{ color: "var(--brown)" }}>{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2"
        style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
      />
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  CHECKOUT page                                                      */
/* ------------------------------------------------------------------ */

function Checkout({ cart, onPlace }: { cart: CartLine[]; onPlace: (o: OrderInfo) => void }) {
  const [f, setF] = useState({ name: "", phone: "", address: "", area: "", notes: "", time: "" });
  const [type, setType] = useState("Food Delivery");
  const [pay, setPay] = useState("Pay on Delivery");
  const subtotal = cart.reduce((s, l) => s + lineTotal(l), 0);
  const total = subtotal + (type === "Food Delivery" ? DELIVERY_FEE : 0);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF(p => ({ ...p, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name || !f.phone || !f.address) return;
    onPlace({
      id: "PB" + Math.floor(1000 + Math.random() * 9000),
      name: f.name,
      area: f.area || f.address,
      address: f.address,
      total,
      type,
      lines: cart,
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
      <h1 className="font-serif text-4xl font-semibold" style={{ color: "var(--brown)" }}>Checkout</h1>
      <form onSubmit={submit} className="mt-6 grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-serif text-xl font-semibold mb-4" style={{ color: "var(--brown)" }}>Delivery Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" value={f.name} onChange={set("name")} placeholder="Your name" required />
              <Field label="Phone Number" value={f.phone} onChange={set("phone")} placeholder="080..." required />
              <div className="sm:col-span-2"><Field label="Delivery Address" value={f.address} onChange={set("address")} placeholder="Street / house description" required /></div>
              <Field label="Area / Location" value={f.area} onChange={set("area")} placeholder="e.g. Fajuyi, GRA" />
              <Field label="Preferred Delivery Time" value={f.time} onChange={set("time")} placeholder="e.g. Saturday 1pm" />
              <div className="sm:col-span-2"><Field label="Order Notes" value={f.notes} onChange={set("notes")} placeholder="Anything we should know?" /></div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-serif text-xl font-semibold mb-4" style={{ color: "var(--brown)" }}>Order Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {["Food Delivery", "Home Pickup"].map(t => (
                <button key={t} type="button" onClick={() => setType(t)} className="px-4 py-3 rounded-xl border text-sm font-semibold text-left transition-colors" style={{ borderColor: type === t ? "var(--primary)" : "var(--border)", background: type === t ? "var(--secondary)" : "transparent", color: type === t ? "var(--primary)" : "var(--foreground)" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-serif text-xl font-semibold mb-4" style={{ color: "var(--brown)" }}>Payment</h3>
            <div className="grid grid-cols-2 gap-3">
              {["Pay on Delivery", "Bank Transfer"].map(p => (
                <button key={p} type="button" onClick={() => setPay(p)} className="px-4 py-3 rounded-xl border text-sm font-semibold text-left transition-colors" style={{ borderColor: pay === p ? "var(--primary)" : "var(--border)", background: pay === p ? "var(--secondary)" : "transparent", color: pay === p ? "var(--primary)" : "var(--foreground)" }}>
                  {p}
                </button>
              ))}
            </div>
            {pay === "Bank Transfer" && (
              <p className="mt-3 text-xs rounded-xl px-3 py-2.5" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                Bank transfer details will be added here by PB DELICACIES and shared on confirmation.
              </p>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 lg:sticky lg:top-24">
          <h3 className="font-serif text-xl font-semibold mb-4" style={{ color: "var(--brown)" }}>Order Summary</h3>
          <div className="flex flex-col gap-2 mb-3 max-h-48 overflow-y-auto">
            {cart.map(l => (
              <div key={l.key} className="flex justify-between text-sm gap-2">
                <span style={{ color: "var(--foreground)" }}>{l.qty}× {l.item.name}</span>
                <span className="font-medium flex-shrink-0" style={{ color: "var(--foreground)" }}>{naira(lineTotal(l))}</span>
              </div>
            ))}
          </div>
          <div className="h-px my-2" style={{ background: "var(--border)" }} />
          <Row label="Subtotal" value={naira(subtotal)} />
          <Row label={type === "Food Delivery" ? "Delivery fee" : "Pickup"} value={type === "Food Delivery" ? naira(DELIVERY_FEE) : "Free"} />
          <div className="h-px my-2" style={{ background: "var(--border)" }} />
          <Row label="Total" value={naira(total)} bold />
          <button type="submit" className="mt-5 w-full py-3.5 rounded-full font-semibold transition-transform hover:scale-[1.02]" style={{ background: "var(--primary)", color: "#fff" }}>
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CONFIRMATION page                                                  */
/* ------------------------------------------------------------------ */

function Confirmation({ order, go }: { order: OrderInfo; go: (p: Page) => void }) {
  const message =
    `Hello PB DELICACIES, I just placed order ${order.id}.%0A%0A` +
    `Name: ${order.name}%0A` +
    order.lines.map(l => `- ${l.qty}× ${l.item.name} (${naira(lineTotal(l))})`).join("%0A") +
    `%0ATotal: ${naira(order.total)}%0A` +
    `${order.type} to: ${order.area}`;
  return (
    <div className="max-w-2xl mx-auto px-6 pt-14 text-center">
      <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ background: "rgba(74,107,61,0.15)", color: "var(--green)" }}>
        <Icon path={ICONS.check} size={38} />
      </div>
      <h1 className="font-serif text-4xl font-semibold mt-6" style={{ color: "var(--brown)" }}>Order Received! 🎉</h1>
      <p className="mt-3" style={{ color: "var(--muted-foreground)" }}>
        Thank you for ordering from PB DELICACIES. We have received your order and will contact you shortly to confirm it.
      </p>

      <div className="mt-8 bg-card rounded-3xl border border-border p-6 text-left">
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Order number</span>
          <span className="font-serif text-xl font-semibold" style={{ color: "var(--primary)" }}>{order.id}</span>
        </div>
        <div className="flex flex-col gap-2">
          {order.lines.map(l => (
            <div key={l.key} className="flex justify-between text-sm">
              <span style={{ color: "var(--foreground)" }}>{l.qty}× {l.item.name}</span>
              <span className="font-medium" style={{ color: "var(--foreground)" }}>{naira(lineTotal(l))}</span>
            </div>
          ))}
        </div>
        <div className="h-px my-4" style={{ background: "var(--border)" }} />
        <Row label="Total amount" value={naira(order.total)} bold />
        <div className="mt-4 space-y-1.5 text-sm">
          <div className="flex items-center gap-2" style={{ color: "var(--muted-foreground)" }}><Icon path={ICONS.location} size={15} /> {order.type} — {order.area}</div>
          <div className="flex items-center gap-2" style={{ color: "var(--muted-foreground)" }}><Icon path={ICONS.clock} size={15} /> Estimated within 60–90 mins once confirmed.</div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <a href={waLink(decodeURIComponent(message))} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold" style={{ background: "var(--green)", color: "#fff" }}>
          <Icon path={ICONS.whatsapp} size={18} /> Contact Us on WhatsApp
        </a>
        <button onClick={() => go("home")} className="px-6 py-3.5 rounded-full font-semibold border" style={{ borderColor: "var(--border)", color: "var(--brown)" }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME COOKING page                                                  */
/* ------------------------------------------------------------------ */

function Cooking() {
  const [f, setF] = useState({ name: "", phone: "", address: "", date: "", time: "", people: "", event: "", meals: "", notes: "" });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF(p => ({ ...p, [k]: e.target.value }));
  const message =
    `Hello PB DELICACIES, I would like to book a home cooking session.%0A%0A` +
    `Name: ${f.name}%0ADate: ${f.date}%0ATime: ${f.time}%0APeople: ${f.people}%0AAddress: ${f.address}%0AMeals: ${f.meals}`;

  return (
    <div>
      <section className="relative overflow-hidden" style={{ background: "var(--brown)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: "rgba(217,138,61,0.2)", color: "var(--gold)" }}>
              <Icon path={ICONS.chef} size={14} /> PB DELICACIES Home Cooking
            </span>
            <h1 className="font-serif font-semibold leading-tight" style={{ color: "#f4e6d2", fontSize: "clamp(2.2rem,5vw,3.5rem)" }}>
              Let Us Bring the Kitchen to You.
            </h1>
            <p className="mt-4 text-lg max-w-md" style={{ color: "rgba(244,230,210,0.8)" }}>
              Planning a weekend gathering, family celebration, or simply want freshly prepared Nigerian meals cooked in your home? Book PB DELICACIES for a personalized home cooking experience.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-2.5">
              {["We come to your home", "Freshly prepared meals", "Families & small gatherings", "Weekend bookings", "Flexible menu options"].map(b => (
                <li key={b} className="flex items-center gap-2 text-sm" style={{ color: "rgba(244,230,210,0.9)" }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--green)", color: "#fff" }}><Icon path={ICONS.check} size={12} /></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl" style={{ background: "var(--muted)" }}>
            <img src={img("1636647511729-6703539ba71f", 800, 600)} alt="A cook preparing fresh food in a home kitchen" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        {sent ? (
          <div className="bg-card rounded-3xl border border-border p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: "rgba(74,107,61,0.15)", color: "var(--green)" }}>
              <Icon path={ICONS.check} size={30} />
            </div>
            <h2 className="font-serif text-2xl font-semibold mt-4" style={{ color: "var(--brown)" }}>Booking Request Sent!</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
              Thank you, {f.name || "friend"}. We'll reach out shortly to confirm your home cooking session.
            </p>
            <a href={waLink(decodeURIComponent(message))} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold" style={{ background: "var(--green)", color: "#fff" }}>
              <Icon path={ICONS.whatsapp} size={18} /> Confirm on WhatsApp
            </a>
          </div>
        ) : (
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold mb-1" style={{ color: "var(--brown)" }}>Booking Form</h2>
            <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>Tell us about your event and we'll do the rest.</p>
            <form onSubmit={e => { e.preventDefault(); if (f.name && f.phone) setSent(true); }} className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" value={f.name} onChange={set("name")} required />
              <Field label="Phone Number" value={f.phone} onChange={set("phone")} required />
              <div className="sm:col-span-2"><Field label="Home Address" value={f.address} onChange={set("address")} /></div>
              <Field label="Preferred Date" type="date" value={f.date} onChange={set("date")} />
              <Field label="Preferred Time" type="time" value={f.time} onChange={set("time")} />
              <Field label="Number of People" type="number" min={1} value={f.people} onChange={set("people")} />
              <Field label="Type of Event" value={f.event} onChange={set("event")} placeholder="e.g. Birthday, reunion" />
              <div className="sm:col-span-2"><Field label="Preferred Meals" value={f.meals} onChange={set("meals")} placeholder="e.g. Jollof rice, pounded yam & egusi" /></div>
              <div className="sm:col-span-2"><Field label="Additional Instructions" value={f.notes} onChange={set("notes")} /></div>
              <button type="submit" className="sm:col-span-2 mt-2 py-3.5 rounded-full font-semibold transition-transform hover:scale-[1.01]" style={{ background: "var(--primary)", color: "#fff" }}>
                Request a Cooking Booking
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTACT page                                                       */
/* ------------------------------------------------------------------ */

function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 text-center">
      <h1 className="font-serif text-4xl sm:text-5xl font-semibold" style={{ color: "var(--brown)" }}>PB DELICACIES</h1>
      <p className="mt-4 flex items-center justify-center gap-2 text-lg" style={{ color: "var(--muted-foreground)" }}>
        <Icon path={ICONS.location} size={18} /> {BUSINESS.location}
      </p>
      <p className="mt-1 flex items-center justify-center gap-2 font-serif text-2xl font-semibold" style={{ color: "var(--brown)" }}>
        <Icon path={ICONS.phone} size={20} /> {BUSINESS.phone}
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-transform hover:scale-[1.03]" style={{ background: "var(--primary)", color: "#fff" }}>
          <Icon path={ICONS.phone} size={20} /> Call Us
        </a>
        <a href={waLink("Hello PB DELICACIES, I have an enquiry.")} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-transform hover:scale-[1.03]" style={{ background: "var(--green)", color: "#fff" }}>
          <Icon path={ICONS.whatsapp} size={20} /> Chat on WhatsApp
        </a>
      </div>

      <div className="mt-10 rounded-3xl overflow-hidden border border-border relative" style={{ background: "var(--secondary)", height: 260 }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "var(--primary)", color: "#fff" }}>
            <Icon path={ICONS.location} size={26} />
          </div>
          <span className="font-serif text-xl font-semibold" style={{ color: "var(--brown)" }}>Ido-Ekiti, Ekiti State, Nigeria</span>
          <span className="text-sm" style={{ color: "var(--secondary-foreground)" }}>Weekend deliveries across the town & environs</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ADMIN dashboard (concept)                                          */
/* ------------------------------------------------------------------ */

const STATUSES = ["New Order", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"] as const;
type Status = typeof STATUSES[number];
const STATUS_COLOR: Record<Status, string> = {
  "New Order": "#b5471f",
  Confirmed: "#8a5a1c",
  Preparing: "#d98a3d",
  "Out for Delivery": "#4a6b3d",
  Delivered: "#3f7a4f",
  Cancelled: "#8a6f5c",
};

interface AdminOrder { id: string; customer: string; items: string; amount: number; status: Status; }

const INITIAL_ORDERS: AdminOrder[] = [
  { id: "PB2041", customer: "Adebola O.", items: "2× Jollof & Chicken, 1× Chapman", amount: 8500, status: "New Order" },
  { id: "PB2040", customer: "Tunde A.", items: "1× Pounded Yam & Egusi", amount: 4200, status: "Preparing" },
  { id: "PB2039", customer: "Grace E.", items: "1× Fried Rice, 1× Dodo", amount: 5000, status: "Out for Delivery" },
  { id: "PB2038", customer: "Kunle B.", items: "1× Ofada Rice & Sauce", amount: 4000, status: "Delivered" },
];

function Admin() {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [menu, setMenu] = useState<MenuItem[]>(MENU);

  const totalOrders = orders.length;
  const pending = orders.filter(o => o.status === "New Order" || o.status === "Confirmed" || o.status === "Preparing").length;
  const sales = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.amount, 0);

  function cycleStatus(id: string) {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const i = STATUSES.indexOf(o.status);
      return { ...o, status: STATUSES[(i + 1) % STATUSES.length] };
    }));
  }

  function toggleAvail(id: number) {
    setMenu(prev => prev.map(m => m.id === id ? { ...m, available: !m.available } : m));
  }

  const stats = [
    { label: "Total Orders", value: totalOrders },
    { label: "Today's Orders", value: 3 },
    { label: "Pending Orders", value: pending },
    { label: "Total Sales", value: naira(sales) },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-4xl font-semibold" style={{ color: "var(--brown)" }}>Owner Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{WEEK_LABEL}</p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}>Concept preview</span>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-2xl border border-border p-5">
            <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>{s.label}</div>
            <div className="font-serif text-3xl font-semibold mt-1" style={{ color: "var(--primary)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6 items-start">
        {/* Orders */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: "var(--brown)" }}>Recent Orders</h2>
          <div className="flex flex-col gap-3">
            {orders.map(o => (
              <div key={o.id} className="rounded-xl border border-border p-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-semibold" style={{ color: "var(--brown)" }}>{o.id}</span>
                    <span className="text-sm" style={{ color: "var(--muted-foreground)" }}> · {o.customer}</span>
                  </div>
                  <span className="font-serif font-semibold" style={{ color: "var(--primary)" }}>{naira(o.amount)}</span>
                </div>
                <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{o.items}</p>
                <button
                  onClick={() => cycleStatus(o.id)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-transform hover:scale-105"
                  style={{ background: `${STATUS_COLOR[o.status]}1a`, color: STATUS_COLOR[o.status] }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLOR[o.status] }} />
                  {o.status} · tap to update
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly menu editor */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold" style={{ color: "var(--brown)" }}>Edit Weekly Menu</h2>
            <button className="text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1" style={{ background: "var(--primary)", color: "#fff" }}>
              <Icon path={ICONS.plus} size={13} /> Add Food
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto">
            {menu.map(m => (
              <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border p-2.5">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "var(--muted)" }}>
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ color: "var(--brown)" }}>{m.name}</div>
                  <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{m.category} · {naira(m.price)}</div>
                </div>
                <button
                  onClick={() => toggleAvail(m.id)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: m.available ? "rgba(74,107,61,0.12)" : "rgba(43,28,20,0.08)", color: m.available ? "var(--green)" : "var(--muted-foreground)" }}
                >
                  {m.available ? "Available" : "Hidden"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating WhatsApp button + toast                                   */
/* ------------------------------------------------------------------ */

function FloatingWA() {
  return (
    <a
      href={waLink("Hello PB DELICACIES, I would like to place an order.")}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110"
      style={{ background: "var(--green)", color: "#fff" }}
      aria-label="Chat on WhatsApp"
    >
      <Icon path={ICONS.whatsapp} size={26} />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [detail, setDetail] = useState<MenuItem | null>(null);
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const cartCount = useMemo(() => cart.reduce((s, l) => s + l.qty, 0), [cart]);

  function go(p: Page) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  function addLine(item: MenuItem, qty: number, extras: string[], instructions: string) {
    const key = `${item.id}-${extras.sort().join(",")}-${instructions}`;
    setCart(prev => {
      const existing = prev.find(l => l.key === key);
      if (existing) return prev.map(l => l.key === key ? { ...l, qty: l.qty + qty } : l);
      return [...prev, { key, item, qty, extras, instructions }];
    });
    flash(`${item.name} added to cart`);
  }

  function quickAdd(item: MenuItem) {
    if (!item.available) return;
    addLine(item, 1, [], "");
  }

  function setQty(k: string, n: number) {
    setCart(prev => prev.map(l => l.key === k ? { ...l, qty: n } : l));
  }
  function remove(k: string) {
    setCart(prev => prev.filter(l => l.key !== k));
  }

  function placeOrder(o: OrderInfo) {
    setOrder(o);
    setCart([]);
    go("confirm");
  }

  return (
    <div className="min-h-full flex flex-col">
      <Header page={page} go={go} cartCount={cartCount} />

      <main className="flex-1 pb-10">
        {page === "home" && <Home go={go} openItem={setDetail} addItem={quickAdd} />}
        {page === "menu" && <MenuPage openItem={setDetail} addItem={quickAdd} />}
        {page === "cooking" && <Cooking />}
        {page === "contact" && <Contact />}
        {page === "cart" && <CartPage cart={cart} setQty={setQty} remove={remove} go={go} />}
        {page === "checkout" && (cart.length ? <Checkout cart={cart} onPlace={placeOrder} /> : <CartPage cart={cart} setQty={setQty} remove={remove} go={go} />)}
        {page === "confirm" && order && <Confirmation order={order} go={go} />}
        {page === "admin" && <Admin />}
      </main>

      <Footer go={go} />
      <FloatingWA />

      {detail && (
        <DetailModal
          item={detail}
          onClose={() => setDetail(null)}
          onAdd={(qty, extras, instructions) => { addLine(detail, qty, extras, instructions); setDetail(null); }}
        />
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-sm font-semibold shadow-xl animate-float-up flex items-center gap-2" style={{ background: "var(--brown)", color: "#f4e6d2" }}>
          <Icon path={ICONS.check} size={16} /> {toast}
        </div>
      )}
    </div>
  );
}
