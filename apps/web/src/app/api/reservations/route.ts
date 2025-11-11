import { NextResponse } from "next/server";
import type { Prisma } from "@pizzamahn/db";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reservationCreateSchema } from "@/lib/validators/reservation";
import { slugify } from "@/lib/utils";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const status = searchParams.get("status")?.toUpperCase() ?? undefined;
  const tag = searchParams.get("tag")?.trim();
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "25");
  const sort = (searchParams.get("sort") ?? "date-desc") as
    | "date-desc"
    | "date-asc"
    | "created-desc";

  const skip = pageSize * (page - 1);

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && ["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
    where.status = status;
  }

  if (tag) {
    where.areaTags = {
      some: {
        areaTag: {
          slug: tag,
        },
      },
    };
  }

  try {
    const orderBy =
      sort === "date-asc"
        ? [
            {
              date: "asc" as const,
            },
            { createdAt: "asc" as const },
          ]
        : sort === "created-desc"
          ? [
              {
                createdAt: "desc" as const,
              },
            ]
          : [
              { date: "desc" as const },
              { createdAt: "desc" as const },
            ];

    const [reservations, total] = await prisma.$transaction([
      prisma.reservation.findMany({
        where,
        include: {
          areaTags: {
            include: {
              areaTag: true,
            },
          },
        },
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.reservation.count({ where }),
    ]);

    type ReservationWithArea = Prisma.ReservationGetPayload<{
      include: { areaTags: { include: { areaTag: true } } };
    }>;

    const formatted = reservations.map((reservation: ReservationWithArea) => ({
      ...reservation,
      areaTags: reservation.areaTags.map(
        (item: { areaTag: { id: number; name: string; slug: string } }) =>
          item.areaTag,
      ),
    }));

    return NextResponse.json({
      data: formatted,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[RESERVATIONS_GET]", error);
    return NextResponse.json(
      { error: "Unable to load reservations." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = reservationCreateSchema.parse({
      ...body,
      guests: Number(body.guests),
    });

    const reservationDate = new Date(parsed.date);
    if (Number.isNaN(reservationDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid reservation date." },
        { status: 400 },
      );
    }

    const uniqueTags = Array.from(new Set(parsed.tags ?? []));

    const reservation = await prisma.reservation.create({
      data: {
        name: parsed.name,
        phone: parsed.phone,
        email: parsed.email,
        date: reservationDate,
        time: parsed.time,
        guests: parsed.guests,
        notes: parsed.notes ?? null,
        tagsSummary: uniqueTags.join(", "),
        areaTags: {
          create: uniqueTags.map((tagName) => {
            const slug = slugify(tagName);
            return {
              areaTag: {
                connectOrCreate: {
                  where: { slug },
                  create: {
                    name: tagName,
                    slug,
                  },
                },
              },
            };
          }),
        },
      },
      include: {
        areaTags: {
          include: {
            areaTag: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: {
          ...reservation,
          areaTags: reservation.areaTags.map((item) => item.areaTag),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[RESERVATIONS_POST]", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unable to create reservation." },
      { status: 500 },
    );
  }
}

