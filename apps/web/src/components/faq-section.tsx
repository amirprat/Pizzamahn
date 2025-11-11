import type { JSX } from "react";
import { faqs } from "@/lib/site-data";

export function FAQSection(): JSX.Element {
  return (
    <section
      aria-labelledby="faq-heading"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <h2
          id="faq-heading"
          className="text-3xl font-semibold text-brand-navy sm:text-4xl"
        >
          Before You Arrive
        </h2>
        <div className="mt-10 space-y-6">
          {faqs.map((faq) => (
            <details
              key={faq.title}
              className="group rounded-3xl border border-brand-gray-200 bg-brand-gray-50 p-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-brand-navy">
                <span>{faq.title}</span>
                <span
                  aria-hidden="true"
                  className="transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-base text-brand-gray-600">
                {faq.body}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

