import type { JSX } from "react";
import { AreaTagsManager } from "@/components/admin/area-tags-manager";
import { prisma } from "@/lib/prisma";

export default async function AreaTagsPage(): Promise<JSX.Element> {
  const tags = await prisma.areaTag.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-semibold text-brand-navy sm:text-4xl">
          Area Tags
        </h1>
        <p className="mt-3 max-w-2xl text-base text-brand-gray-600">
          Manage SEO and filtering tags that appear on the public site and reservation forms. Toggle
          availability, rename tags, and add new service areas.
        </p>
      </header>
      <AreaTagsManager initialTags={tags} />
    </div>
  );
}

