import type { JSX } from "react";
import { menuShowcase } from "@/lib/site-data";

type BadgeTone = "signature" | "spicy";

const badgeStyles: Record<BadgeTone, string> = {
  signature: "bg-[#FFE8B3] text-[#8A5200]",
  spicy: "bg-[#FFD6D6] text-[#B91C1C]",
};

export function MenuShowcase(): JSX.Element {
  return (
    <section className="bg-white py-20" aria-labelledby="menu-heading">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-brand-orange">
          <span aria-hidden="true">🔥</span>
          {menuShowcase.badge}
        </span>
        <h2
          id="menu-heading"
          className="mt-6 text-4xl font-semibold text-brand-navy sm:text-5xl"
        >
          {menuShowcase.title}
        </h2>
        <p className="mt-4 text-lg text-brand-gray-600">
          {menuShowcase.subtitle}
        </p>
        <div className="mt-16 space-y-16 text-left">
          {menuShowcase.sections.map((section) => (
            <div key={section.name} className="space-y-8">
              <header className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {section.icon}
                </span>
                <h3 className="text-2xl font-semibold text-brand-navy sm:text-3xl">
                  {section.name}
                </h3>
              </header>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {section.items.map((item) => (
                  <article
                    key={item.name}
                    className="flex h-full flex-col justify-between rounded-3xl border border-brand-gray-200 bg-white px-6 py-5 shadow-card/30"
                  >
                    <header className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl" aria-hidden="true">
                          {item.icon}
                        </span>
                        <h4 className="text-lg font-semibold text-brand-navy">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-lg font-semibold text-brand-orange">
                        {item.price}
                      </p>
                    </header>
                    {item.badges && item.badges.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.badges.map((badge) => (
                          <span
                            key={`${item.name}-${badge.label}`}
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeStyles[badge.tone]}`}
                          >
                            {badge.tone === "spicy" ? "🌶️" : "✨"}
                            {badge.label}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="mt-3 text-sm text-brand-gray-600">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

