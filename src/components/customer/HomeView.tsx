import React from "react";
import { useApp } from "../../context/AppContext";
import MealCard from "./MealCard";
import Icon from "../common/Icon";

export function HomeView() {
  const { menu, settings, go, setDetailItem, quickAdd } = useApp();

  const featuredMeals = menu.filter(m => m.featured || m.isSpecial);
  const displayMeals = featuredMeals.length > 0 ? featuredMeals : menu.slice(0, 6);

  return (
    <div>
      {/* ------------------------------------------------------------- */}
      {/*  HERO SECTION                                                 */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-float-up">
            <span
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5 shadow-xs"
              style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}
            >
              <Icon name="location" size={13} /> {settings.hero.badgeText}
            </span>

            <h1
              className="font-serif font-bold leading-[1.08] tracking-tight"
              style={{ color: "var(--brown)", fontSize: "clamp(2.4rem, 5.5vw, 4rem)" }}
            >
              {settings.hero.headline}
              <br />
              <span style={{ color: "var(--primary)" }}>{settings.hero.highlightedText}</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg max-w-lg leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {settings.hero.subheadline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => go("menu")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold shadow-md transition-transform hover:scale-[1.03] active:scale-95"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                <span>{settings.hero.primaryCtaText}</span>
                <Icon name="arrow" size={16} />
              </button>

              <button
                onClick={() => go("cooking")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold border transition-colors hover:bg-secondary active:scale-95"
                style={{ borderColor: "var(--border)", color: "var(--brown)" }}
              >
                <Icon name="chef" size={17} />
                <span>{settings.hero.secondaryCtaText}</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl rotate-1 border-4 border-card"
              style={{ background: "var(--muted)" }}
            >
              <img
                src={settings.hero.heroImage}
                alt="Nigerian food delicacies feast"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div
              className="absolute -bottom-6 -left-2 sm:-left-6 bg-card rounded-2xl shadow-xl px-5 py-3.5 border border-border flex items-center gap-3 -rotate-2 animate-float-up"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shadow-inner"
                style={{ background: "rgba(217, 138, 61, 0.15)", color: "var(--gold)" }}
              >
                <Icon name="star" size={20} fill="var(--gold)" />
              </div>
              <div>
                <div className="font-serif text-lg font-bold" style={{ color: "var(--brown)" }}>
                  {settings.hero.ratingScore}
                </div>
                <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {settings.hero.ratingLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/*  WEEKLY SPECIALS                                              */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--gold)" }}
            >
              {settings.weekLabel}
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl font-bold mt-1"
              style={{ color: "var(--brown)" }}
            >
              What's Cooking This Weekend?
            </h2>
          </div>
          <button
            onClick={() => go("menu")}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold transition-transform hover:translate-x-1"
            style={{ color: "var(--primary)" }}
          >
            <span>Full menu</span>
            <Icon name="arrow" size={15} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMeals.map(item => (
            <MealCard
              key={item.id}
              item={item}
              onOpen={() => setDetailItem(item)}
              onAdd={() => quickAdd(item)}
            />
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <button
            onClick={() => go("menu")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm border"
            style={{ borderColor: "var(--border)", color: "var(--brown)" }}
          >
            <span>View All Menu Items</span>
            <Icon name="arrow" size={14} />
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/*  SERVICES CARDS                                               */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div
            className="rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            style={{ background: "var(--secondary)" }}
          >
            <div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-xs"
                style={{ background: "var(--primary)", color: "#fff" }}
              >
                <Icon name="truck" size={24} />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: "var(--brown)" }}>
                Weekend Food Delivery
              </h3>
              <p className="mt-2 text-sm sm:text-base max-w-sm leading-relaxed" style={{ color: "var(--secondary-foreground)" }}>
                Order freshly prepared authentic Nigerian meals every weekend and enjoy hot, timely delivery right across Ido-Ekiti and environs.
              </p>
            </div>
            <div className="mt-8">
              <button
                onClick={() => go("menu")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold shadow-sm transition-transform hover:scale-105"
                style={{ background: "var(--primary)", color: "#fff" }}
              >
                <span>View Menu</span>
                <Icon name="arrow" size={15} />
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-md"
            style={{ background: "var(--brown)" }}
          >
            <div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-inner"
                style={{ background: "var(--gold)", color: "#3a2412" }}
              >
                <Icon name="chef" size={24} />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: "#f4e6d2" }}>
                Home Cooking Service
              </h3>
              <p className="mt-2 text-sm sm:text-base max-w-sm leading-relaxed" style={{ color: "rgba(244, 230, 210, 0.85)" }}>
                Hosting a family gathering, celebration or craving hot food made in your kitchen? Book PB DELICACIES chefs to prepare delicacies at home.
              </p>
            </div>
            <div className="mt-8">
              <button
                onClick={() => go("cooking")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold shadow-sm transition-transform hover:scale-105"
                style={{ background: "var(--gold)", color: "#3a2412" }}
              >
                <span>Book a Cooking Session</span>
                <Icon name="arrow" size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/*  WHY CHOOSE US                                                */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center mb-10" style={{ color: "var(--brown)" }}>
          Why Choose Us
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "fire" as const, title: "Freshly Prepared", text: "Cooked to order each weekend — never frozen or microwaved." },
            { icon: "truck" as const, title: "Weekend Delivery", text: "Direct to your door across Ido-Ekiti & surrounding areas." },
            { icon: "chef" as const, title: "Home Cooking", text: "We come and cook in your own kitchen for families and events." },
            { icon: "heart" as const, title: "Local & Trusted", text: "A proud Ekiti neighbour delivering hygienic homemade taste." },
          ].map(b => (
            <div
              key={b.title}
              className="bg-card rounded-3xl p-6 border border-border text-center shadow-xs hover:shadow-md transition-shadow"
            >
              <div
                className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "var(--secondary)", color: "var(--primary)" }}
              >
                <Icon name={b.icon} size={22} />
              </div>
              <h4 className="font-serif text-lg font-bold" style={{ color: "var(--brown)" }}>
                {b.title}
              </h4>
              <p className="text-xs sm:text-sm mt-1.5 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {b.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/*  HOW IT WORKS                                                 */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold" style={{ color: "var(--brown)" }}>
            How It Works
          </h2>
          <p className="text-sm sm:text-base mt-2" style={{ color: "var(--muted-foreground)" }}>
            Three simple steps to enjoying a hearty, delicious weekend meal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "01", title: "Choose Your Food", text: "Browse this week's curated menu and select your favorite meals and extras." },
            { n: "02", title: "Place Your Order", text: "Add to cart, input your delivery address in Ido-Ekiti, and checkout." },
            { n: "03", title: "Enjoy Your Meal", text: "Receive your freshly prepared delicacies hot and ready to savor." },
          ].map((s, i) => (
            <div key={s.n} className="relative bg-card rounded-3xl p-8 border border-border shadow-xs flex flex-col justify-between">
              <div>
                <div className="font-serif text-5xl font-bold opacity-30" style={{ color: "var(--primary)" }}>
                  {s.n}
                </div>
                <h4 className="font-serif text-xl font-bold mt-2" style={{ color: "var(--brown)" }}>
                  {s.title}
                </h4>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {s.text}
                </p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3.5 z-10 p-1.5 rounded-full bg-card border border-border text-primary shadow-xs" style={{ color: "var(--gold)" }}>
                  <Icon name="arrow" size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/*  TESTIMONIALS                                                 */}
      {/* ------------------------------------------------------------- */}
      {settings.testimonials && settings.testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: "var(--brown)" }}>
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {settings.testimonials.map(t => (
              <div key={t.id} className="bg-card rounded-3xl p-6 sm:p-7 border border-border shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-3.5" style={{ color: "var(--gold)" }}>
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Icon key={i} name="star" size={15} fill="var(--gold)" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed italic" style={{ color: "var(--foreground)" }}>
                    "{t.text}"
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-base shadow-xs"
                    style={{ background: "var(--secondary)", color: "var(--primary)" }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: "var(--brown)" }}>
                      {t.name}
                    </div>
                    <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default HomeView;
