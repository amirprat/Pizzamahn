import type { JSX } from "react";
import { contactDetails } from "@/lib/site-data";
import type { ContactEmailMap } from "@/lib/contact-emails";

type SiteFooterProps = {
  areaTags: Array<{ name: string; slug: string }>;
  emails: ContactEmailMap;
};

export function SiteFooter({ areaTags, emails }: SiteFooterProps): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">PIZZAMAHN</h3>
            <p className="mt-2 text-sm text-white/70">
              Caribbean soul, wood fired, always fresh.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide">
              Contact
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>
                <a href={`mailto:${emails.information}`} className="hover:text-brand-orange">
                  {emails.information}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contactDetails.phone.replace(/[^\d+]/g, "")}`}
                  className="hover:text-brand-orange"
                >
                  {contactDetails.phone}
                </a>
              </li>
              <li className="text-white/70">
                {contactDetails.location}
              </li>
              <li>
                <a href={contactDetails.instagram} className="hover:text-brand-orange" target="_blank" rel="noopener noreferrer">
                  @pizzamahn
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide">
              Area Tags
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {areaTags.map((tag) => (
                <span
                  key={tag.slug}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/60">
          © {currentYear} Pizzamahn. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

