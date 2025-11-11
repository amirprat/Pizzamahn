import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type MailingListPayload = {
  email?: string;
  source?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MailingListPayload;
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 },
      );
    }

    const subscriber = await prisma.mailingListSubscriber.upsert({
      where: { email },
      create: {
        email,
        source: body.source ?? "website",
      },
      update: {
        source: body.source ?? "website",
      },
    });

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (apiKey && audienceId) {
      const dataCenter = apiKey.split("-")[1];
      if (dataCenter) {
        const hashedEmail = crypto
          .createHash("md5")
          .update(email)
          .digest("hex");

        const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${audienceId}/members/${hashedEmail}`;
        const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");

        const payload = {
          email_address: email,
          status_if_new: "subscribed",
          status: "subscribed",
        };

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.warn(
            "[MAILCHIMP_SYNC_FAILED]",
            response.status,
            await response.text(),
          );
        }
      }
    }

    return NextResponse.json({ data: subscriber }, { status: 201 });
  } catch (error) {
    console.error("[MAILING_LIST_POST]", error);
    return NextResponse.json(
      { error: "Unable to join mailing list." },
      { status: 500 },
    );
  }
}

