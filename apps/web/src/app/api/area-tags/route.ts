import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { areaTagSchema } from "@/lib/validators/area-tag";
import { slugify } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("includeInactive") === "true";

  try {
    const tags = await prisma.areaTag.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [
        {
          name: "asc",
        },
      ],
    });

    return NextResponse.json({ data: tags });
  } catch (error) {
    console.error("[AREA_TAGS_GET]", error);
    return NextResponse.json(
      { error: "Unable to load area tags." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = {
      ...body,
      slug: body.slug ?? slugify(body.name ?? ""),
    };
    const parsed = areaTagSchema.parse(payload);

    const created = await prisma.areaTag.create({
      data: parsed,
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("[AREA_TAGS_POST]", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unable to create area tag." },
      { status: 500 },
    );
  }
}

