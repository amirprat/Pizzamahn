import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { areaTagSchema } from "@/lib/validators/area-tag";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { slug: currentSlug } = await context.params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = areaTagSchema.partial().parse(body);

    if (parsed.slug && parsed.slug !== currentSlug) {
      const existing = await prisma.areaTag.findUnique({
        where: { slug: parsed.slug },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Slug already in use by another tag." },
          { status: 409 },
        );
      }
    }

    const updated = await prisma.areaTag.update({
      where: { slug: currentSlug },
      data: parsed,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[AREA_TAG_PUT]", error);
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Area tag not found." }, { status: 404 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unable to update area tag." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.areaTag.delete({
      where: { slug },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[AREA_TAG_DELETE]", error);
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Area tag not found." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Unable to delete area tag." },
      { status: 500 },
    );
  }
}

