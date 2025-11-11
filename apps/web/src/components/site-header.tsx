import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";
type SiteHeaderProps = {
  featuredAreas: Array<{ name: string; slug: string }>;
};

export function SiteHeader({ featuredAreas }: SiteHeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-brand-gray-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Pizzamahn home">
          <Image
            src="/images/pizzamahn-logo.png"
            alt="Pizzamahn logo"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full border border-brand-gray-200 bg-white object-cover"
            priority
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-brand-navy">PIZZAMAHN</span>
            <span className="text-sm text-brand-gray-600">Pizza Under the Trees</span>
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm font-medium text-brand-navy md:flex">
          <Link href="#experience" className="hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange">
            Experience
          </Link>
          <Link href="#reservation" className="hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange">
            Reservations
          </Link>
          <Link href="#mailing-list" className="hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange">
            Mailing List
          </Link>
          <Link href="#contact" className="hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex">
          <div className="flex items-center gap-2 rounded-full border border-brand-gray-300 px-3 py-1 text-xs font-semibold text-brand-gray-600">
            <span className="sr-only">Featured areas</span>
            <span aria-hidden="true">📍</span>
            <span>{featuredAreas.slice(0, 3).map((tag) => tag.name).join(" • ")}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

