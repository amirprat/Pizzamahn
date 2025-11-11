import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import { ReservationDetail } from "@/components/admin/reservation-detail";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReservationDetailPage({
  params,
}: PageProps): Promise<JSX.Element> {
  const { id } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      areaTags: {
        include: {
          areaTag: true,
        },
      },
    },
  });

  if (!reservation) {
    notFound();
  }

  const areaTags = await prisma.areaTag.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-brand-gray-500">
            Reservation Detail
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-brand-navy">{reservation.name}</h1>
          <p className="mt-2 text-sm text-brand-gray-600">
            Created {reservation.createdAt.toLocaleString()}
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-brand-gray-300 px-4 py-2 text-sm font-semibold text-brand-gray-600 transition hover:border-brand-orange hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
        >
          Back to reservations
        </Link>
      </div>
      <ReservationDetail
        reservation={{
          id: reservation.id,
          name: reservation.name,
          email: reservation.email,
          phone: reservation.phone,
          date: reservation.date.toISOString().split("T")[0],
          time: reservation.time,
          guests: reservation.guests,
          notes: reservation.notes ?? "",
          status: reservation.status,
          tags: reservation.areaTags.map((tag) => ({
            id: tag.areaTag.id,
            name: tag.areaTag.name,
            slug: tag.areaTag.slug,
          })),
        }}
        areaTags={areaTags.map((tag) => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        }))}
      />
    </div>
  );
}

