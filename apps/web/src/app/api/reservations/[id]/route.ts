import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reservationUpdateSchema } from "@/lib/validators/reservation";
import { slugify } from "@/lib/utils";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
      return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        ...reservation,
        areaTags: reservation.areaTags.map(
          (item: { areaTag: { id: number; name: string; slug: string } }) =>
            item.areaTag,
        ),
      },
    });
  } catch (error) {
    console.error("[RESERVATION_GET]", error);
    return NextResponse.json(
      { error: "Unable to load reservation." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await prisma.reservation.findUnique({
      where: { id },
      include: {
        areaTags: {
          include: {
            areaTag: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = reservationUpdateSchema.parse({
      ...body,
      guests: body.guests === undefined ? undefined : Number(body.guests),
    });

    const dataToUpdate: Record<string, unknown> = {};

    if (parsed.name) dataToUpdate.name = parsed.name;
    if (parsed.phone) dataToUpdate.phone = parsed.phone;
    if (parsed.email) dataToUpdate.email = parsed.email;
    if (parsed.time) dataToUpdate.time = parsed.time;
    if (parsed.notes !== undefined) dataToUpdate.notes = parsed.notes;
    if (parsed.status) dataToUpdate.status = parsed.status;
    if (parsed.guests !== undefined) dataToUpdate.guests = parsed.guests;
    if (parsed.date) {
      const newDate = new Date(parsed.date);
      if (Number.isNaN(newDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid reservation date." },
          { status: 400 },
        );
      }
      dataToUpdate.date = newDate;
    }

    const newTags = parsed.tags ? Array.from(new Set(parsed.tags)) : undefined;
    if (newTags) {
      dataToUpdate.tagsSummary = newTags.join(", ");
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (newTags) {
        const slugs = newTags.map((tag) => slugify(tag));

        const existingTagLinks = await tx.reservationAreaTag.findMany({
          where: { reservationId: id },
          include: { areaTag: true },
        });

        const tagsToRemove = existingTagLinks.filter(
          (link) => !slugs.includes(link.areaTag.slug),
        );

        if (tagsToRemove.length > 0) {
          await tx.reservationAreaTag.deleteMany({
            where: {
              reservationId: id,
              areaTagId: {
                in: tagsToRemove.map((link) => link.areaTagId),
              },
            },
          });
        }

        await Promise.all(
          newTags.map(async (tagName) => {
            const slug = slugify(tagName);
            const areaTag = await tx.areaTag.upsert({
              where: { slug },
              create: { name: tagName, slug },
              update: { name: tagName },
              select: { id: true },
            });

            await tx.reservationAreaTag.upsert({
              where: {
                reservationId_areaTagId: {
                  reservationId: id,
                  areaTagId: areaTag.id,
                },
              },
              create: {
                reservation: { connect: { id } },
                areaTag: { connect: { id: areaTag.id } },
              },
              update: {},
            });
          }),
        );
      }

      return tx.reservation.update({
        where: { id },
        data: dataToUpdate,
        include: {
          areaTags: {
            include: { areaTag: true },
          },
        },
      });
    });

    return NextResponse.json({
      data: {
        ...updated,
        areaTags: updated.areaTags.map(
          (item: { areaTag: { id: number; name: string; slug: string } }) =>
            item.areaTag,
        ),
      },
    });
  } catch (error) {
    console.error("[RESERVATION_PUT]", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unable to update reservation." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RESERVATION_DELETE]", error);
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Unable to delete reservation." },
      { status: 500 },
    );
  }
}

