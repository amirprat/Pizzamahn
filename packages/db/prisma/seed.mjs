import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultAreaTags = [
  "Virgin Islands",
  "St. Thomas",
  "St. John",
  "Caribbean",
  "Boca Raton",
  "Downtown",
  "Pop-Up",
  "Wood-Fired Pizza",
  "Delivery",
  "Takeout",
  "Catering",
];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  await prisma.contactEmail.createMany({
    data: [
      { label: "information", email: "pizzamahnvi@gmail.com" },
      { label: "support", email: "pizzamahnvi@gmail.com" },
      { label: "bookings", email: "pizzamahnvi@gmail.com" },
    ],
    skipDuplicates: true,
  });

  await prisma.areaTag.createMany({
    data: defaultAreaTags.map((name) => ({
      name,
      slug: slugify(name),
    })),
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✅ Seed data applied");
  })
  .catch(async (error) => {
    console.error("❌ Failed to seed database", error);
    await prisma.$disconnect();
    process.exit(1);
  });

