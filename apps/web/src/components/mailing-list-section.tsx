"use client";

import type { FormEvent, JSX } from "react";
import { useState } from "react";
import { reservationStatus } from "@/lib/site-data";

type MailingListState = {
  status: "idle" | "success" | "error";
  message: string;
};

export function MailingListSection(): JSX.Element {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<MailingListState>({
    status: "idle",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      setState({
        status: "error",
        message: "Please provide an email address.",
      });
      return;
    }

    try {
      const response = await fetch("/api/mailing-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? "Unable to join mailing list at this time.");
      }

      setState({
        status: "success",
        message:
          "You're on the list! We'll share future pop-up dates and menus soon.",
      });
      setEmail("");
    } catch (error) {
      console.error(error);
      setState({
        status: "error",
        message:
          error instanceof Error ? error.message : "Unexpected error. Please try again later.",
      });
    }
  }

  return (
    <section
      id="mailing-list"
      className="bg-brand-charcoal py-20 text-white"
      aria-labelledby="mailing-list-heading"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-8 lg:flex-row lg:items-center">
        <div className="flex-1">
          <h2
            id="mailing-list-heading"
            className="text-3xl font-semibold sm:text-4xl"
          >
            {reservationStatus.mailingListCta.title}
          </h2>
          <p className="mt-4 text-lg text-white/80">
            {reservationStatus.mailingListCta.description}
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-3 rounded-3xl bg-white/10 p-6 shadow-card backdrop-blur lg:max-w-md"
        >
          <label className="text-sm font-semibold text-white" htmlFor="mailing-email">
            Email Address
          </label>
          <input
            id="mailing-email"
            type="email"
            name="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="rounded-2xl border border-white/40 bg-white/20 px-4 py-3 text-base text-white placeholder:text-white/60 backdrop-blur focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-brand-orange px-6 py-3 text-base font-semibold text-brand-charcoal transition hover:bg-[#f5851f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Join Now
          </button>
          {state.status === "success" && (
            <p role="status" className="text-sm text-brand-green">
              {state.message}
            </p>
          )}
          {state.status === "error" && (
            <p role="alert" className="text-sm text-brand-orange">
              {state.message}
            </p>
          )}
          <p className="text-xs text-white/70">
            Expect only the good stuff: event announcements, menu drops, and private tasting invites.
          </p>
        </form>
      </div>
    </section>
  );
}

