import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";
import { eventDetails, reservationStatus } from "@/lib/site-data";

const progressPercent = Math.min(
  100,
  Math.round((reservationStatus.reserved / reservationStatus.capacity) * 100),
);

function StatusBadge(): JSX.Element {
  return (
    <div
      className="inline-flex items-center gap-3 rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-brand-orange"
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">🔴</span>
      <span>
        {reservationStatus.isOpen ? "Reservations Open" : "Reservations Are Now Closed"}
      </span>
    </div>
  );
}

function Progress(): JSX.Element {
  return (
    <div className="mt-8 w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-6 text-white shadow-card backdrop-blur">
      <div className="flex items-center justify-between text-sm font-medium uppercase tracking-wide text-brand-gray-100">
        <span>Pizzas Ordered</span>
        <span>
          {reservationStatus.reserved} / {reservationStatus.capacity}
        </span>
      </div>
      <div className="mt-4 h-3 rounded-full bg-white/20" aria-hidden="true">
        <div
          className="h-full rounded-full bg-brand-green transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white">
        <span aria-hidden="true">✅</span>
        <p>{reservationStatus.isOpen ? "Event accepting reservations" : "Event at full capacity"}</p>
      </div>
    </div>
  );
}

export function HeroSection(): JSX.Element {
  return (
    <section className="relative overflow-hidden bg-brand-navy text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(32,178,170,0.18),_transparent_60%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-12 px-4 py-20 sm:px-8 lg:flex-row lg:px-12">
        <div className="flex-1 text-center lg:text-left">
          <StatusBadge />
          <div className="mt-8 flex flex-col gap-4">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              <span className="block text-brand-orange">Pizza Under</span>
              <span className="block text-white">the Trees</span>
            </h1>
            <p className="text-lg text-brand-gray-200 sm:text-xl">
              {eventDetails.subtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold uppercase text-brand-gray-100 lg:justify-start">
              <span>{eventDetails.date}</span>
              <span className="hidden h-3 w-3 rounded-full bg-brand-orange sm:inline-flex" aria-hidden="true" />
              <span>{eventDetails.location}</span>
            </div>
          </div>
          <p className="mt-6 text-base leading-relaxed text-brand-gray-100 sm:text-lg">
            {eventDetails.description}
          </p>
          <p className="mt-4 rounded-2xl bg-white/10 p-4 text-sm text-brand-gray-100">
            {reservationStatus.soldOutMessage}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href={reservationStatus.mailingListCta.buttonHref}
              className="inline-flex items-center justify-center rounded-full bg-brand-orange px-8 py-3 text-base font-semibold text-brand-charcoal shadow-card transition hover:bg-[#f5851f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {reservationStatus.mailingListCta.buttonLabel}
            </Link>
            <span className="text-sm text-brand-gray-200">
              {reservationStatus.mailingListCta.description}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-8">
          <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-[40px] bg-white p-6 shadow-card">
            <Image
              src="/images/pizzamahn-hero.png"
              alt="PIZZAMAHN wood-fired pizza setup at Pangea USVI"
              fill
              priority
              sizes="(max-width: 1024px) 80vw, 420px"
              className="h-full w-full object-contain"
            />
          </div>
          <Progress />
        </div>
      </div>
    </section>
  );
}

