import type { JSX } from "react";
import { brandStatement, contactDetails } from "@/lib/site-data";
import type { ContactEmailMap } from "@/lib/contact-emails";

type BrandStorySectionProps = {
  emails: ContactEmailMap;
};

export function BrandStorySection({ emails }: BrandStorySectionProps): JSX.Element {
  return (
    <section
      id="contact"
      className="bg-brand-navy py-20 text-white"
      aria-labelledby="brand-story-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
            {brandStatement.tagline}
          </p>
          <h2
            id="brand-story-heading"
            className="mt-4 text-4xl font-semibold sm:text-5xl"
          >
            {brandStatement.title}
          </h2>
          <p className="mt-6 text-lg text-white/80">
            {brandStatement.copy}
          </p>
        </div>
        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-card backdrop-blur">
          <h3 className="text-2xl font-semibold text-white">
            Let&rsquo;s make pizza magic
          </h3>
          <p className="text-base text-white/80">
            Drop us a line to collaborate, plan a private pop-up, or bring island heat to your next celebration.
          </p>
          <div className="space-y-4 text-base text-white/90">
            <p>
              <span className="font-semibold text-brand-orange">Email:</span>{" "}
              <a
                href={`mailto:${emails.bookings}`}
                className="underline-offset-4 hover:underline"
              >
                {emails.bookings}
              </a>
            </p>
            <p>
              <span className="font-semibold text-brand-orange">Phone:</span>{" "}
              <a
                href={`tel:${contactDetails.phone.replace(/[^\d+]/g, "")}`}
                className="underline-offset-4 hover:underline"
              >
                {contactDetails.phone}
              </a>
            </p>
            <p>
              <span className="font-semibold text-brand-orange">Location:</span>{" "}
              {contactDetails.location}
            </p>
            <p>
              <span className="font-semibold text-brand-orange">Support:</span>{" "}
              <a
                href={`mailto:${emails.support}`}
                className="underline-offset-4 hover:underline"
              >
                {emails.support}
              </a>
            </p>
            <p>
              <span className="font-semibold text-brand-orange">Instagram:</span>{" "}
              <a
                href={contactDetails.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                @pizzamahn
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

