import type { JSX } from "react";
import { BrandStorySection } from "@/components/brand-story";
import { ExperienceSection } from "@/components/experience-section";
import { FAQSection } from "@/components/faq-section";
import { HeroSection } from "@/components/hero";
import { MailingListSection } from "@/components/mailing-list-section";
import { MenuShowcase } from "@/components/menu-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";
import { defaultAreaTags } from "@/lib/site-data";
import { fetchContactEmails } from "@/lib/contact-emails";
import { slugify } from "@/lib/utils";

export default async function HomePage(): Promise<JSX.Element> {
  const dbAreaTags = await prisma.areaTag.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });

  const contactEmails = await fetchContactEmails();

  const resolvedAreaTags =
    dbAreaTags.length > 0
      ? dbAreaTags
      : defaultAreaTags.map((name) => ({ name, slug: slugify(name) }));

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-orange focus:px-4 focus:py-2 focus:text-brand-charcoal"
      >
        Skip to content
      </a>
      <SiteHeader featuredAreas={resolvedAreaTags} />
      <main id="main-content">
        <HeroSection />
        <ExperienceSection />
        <MenuShowcase />
        <MailingListSection />
        <FAQSection />
        <BrandStorySection emails={contactEmails} />
      </main>
      <SiteFooter areaTags={resolvedAreaTags} emails={contactEmails} />
    </>
  );
}
