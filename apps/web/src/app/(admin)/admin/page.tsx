import type { JSX } from "react";
import { ReservationsDashboard } from "@/components/admin/reservations-dashboard";
import { prisma } from "@/lib/prisma";

export default async function AdminReservationsPage(): Promise<JSX.Element> {
  const areaTags = await prisma.areaTag.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-semibold text-brand-navy sm:text-4xl">
          Reservations
        </h1>
        <p className="mt-3 max-w-2xl text-base text-brand-gray-600">
          View and manage reservations, update statuses, and export guest lists. Use the filters to
          quickly find guests by name, contact, or area tags.
        </p>
      </header>
      <ReservationsDashboard areaTags={areaTags} />
    </div>
  );
}

