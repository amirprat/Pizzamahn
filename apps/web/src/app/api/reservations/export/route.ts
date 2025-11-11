import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function toCSV(data: Array<Record<string, string | number | null>>): string {
  if (!data.length) {
    return "id,name,email,phone,date,time,guests,status,tags,notes,createdAt";
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers
      .map((key) => {
        const value = item[key];
        if (value === null || value === undefined) return "";
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes("\"") || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        areaTags: {
          include: {
            areaTag: true,
          },
        },
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    const csvRows = reservations.map((reservation) => ({
      id: reservation.id,
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      date: reservation.date.toISOString().split("T")[0],
      time: reservation.time,
      guests: reservation.guests,
      status: reservation.status,
      tags: reservation.areaTags.map((tag) => tag.areaTag.name).join("; "),
      notes: reservation.notes ?? "",
      createdAt: reservation.createdAt.toISOString(),
    }));

    const csv = toCSV(csvRows);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="pizzamahn-reservations.csv"`,
      },
    });
  } catch (error) {
    console.error("[RESERVATIONS_EXPORT]", error);
    return NextResponse.json(
      { error: "Unable to export reservations." },
      { status: 500 },
    );
  }
}

