import { prisma } from "@/lib/prisma";

export type ContactEmailLabel = "information" | "support" | "bookings";

export type ContactEmailMap = Record<ContactEmailLabel, string>;

export const contactEmailLabels: ContactEmailLabel[] = [
  "information",
  "support",
  "bookings",
];

export const DEFAULT_CONTACT_EMAIL = "pizzamahnvi@gmail.com";

export async function fetchContactEmails(): Promise<ContactEmailMap> {
  try {
    const records = await prisma.contactEmail.findMany({
      where: { label: { in: contactEmailLabels } },
    });

    type ContactEmailRecord = typeof records[number];

    return contactEmailLabels.reduce((acc, label) => {
      const record = records.find(
        (entry: ContactEmailRecord) => entry.label === label,
      );
      acc[label] = record?.email ?? DEFAULT_CONTACT_EMAIL;
      return acc;
    }, {} as ContactEmailMap);
  } catch (error) {
    console.error("[CONTACT_EMAILS_FETCH_FAILURE]", error);
    return contactEmailLabels.reduce((acc, label) => {
      acc[label] = DEFAULT_CONTACT_EMAIL;
      return acc;
    }, {} as ContactEmailMap);
  }
}

export async function getContactEmail(
  label: ContactEmailLabel,
): Promise<string> {
  const emails = await fetchContactEmails();
  return emails[label];
}

