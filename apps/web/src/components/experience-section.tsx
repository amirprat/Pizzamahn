import type { JSX } from "react";
import { experienceHighlights } from "@/lib/site-data";

export function ExperienceSection(): JSX.Element {
  return (
    <section
      id="experience"
      className="bg-white py-20"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="experience-heading"
            className="text-3xl font-semibold text-brand-navy sm:text-4xl"
          >
            Pizza, Reimagined Under Caribbean Skies
          </h2>
          <p className="mt-4 text-lg text-brand-gray-600">
            Every detail is curated—from the dough to the doughboys—to create an unforgettable night beneath the trees.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {experienceHighlights.map((highlight) => (
            <article
              key={highlight.title}
              className="flex h-full flex-col rounded-3xl border border-brand-gray-200 bg-white p-8 shadow-card"
            >
              <span className="text-4xl" aria-hidden="true">
                {highlight.icon}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-brand-navy">
                {highlight.title}
              </h3>
              <p className="mt-3 text-base text-brand-gray-600">
                {highlight.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

