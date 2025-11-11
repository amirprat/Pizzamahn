"use client";

import type { JSX, ReactNode } from "react";
import { useMemo, useState } from "react";

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

type ReservationDetailProps = {
  reservation: {
    id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    notes: string;
    status: ReservationStatus;
    tags: Array<{ id: number; name: string; slug: string }>;
  };
  areaTags: Array<{ id: number; name: string; slug: string }>;
};

const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
};

export function ReservationDetail({
  reservation,
  areaTags,
}: ReservationDetailProps): JSX.Element {
  const [formState, setFormState] = useState({
    name: reservation.name,
    email: reservation.email,
    phone: reservation.phone,
    date: reservation.date,
    time: reservation.time,
    guests: reservation.guests.toString(),
    notes: reservation.notes,
    status: reservation.status,
    tags: reservation.tags.map((tag) => tag.name),
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const sortedTags = useMemo(
    () => [...areaTags].sort((a, b) => a.name.localeCompare(b.name)),
    [areaTags],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      date: formState.date,
      time: formState.time,
      guests: Number(formState.guests),
      notes: formState.notes,
      status: formState.status,
      tags: formState.tags,
    };

    try {
      const response = await fetch(`/api/reservations/${reservation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error ?? "Unable to update reservation.");
      }
      setFeedback({
        type: "success",
        message: "Reservation updated successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Unexpected error.",
      });
    } finally {
      setSaving(false);
    }
  }

  function toggleTag(tagName: string) {
    setFormState((prev) => {
      const exists = prev.tags.includes(tagName);
      return {
        ...prev,
        tags: exists
          ? prev.tags.filter((tag) => tag !== tagName)
          : [...prev.tags, tagName],
      };
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-brand-gray-200 bg-white p-6 shadow-card"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="reservation-name">
          <input
            id="reservation-name"
            name="name"
            type="text"
            required
            value={formState.name}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, name: event.target.value }))
            }
            className="w-full rounded-2xl border border-brand-gray-300 px-4 py-3 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </Field>
        <Field label="Email" htmlFor="reservation-email">
          <input
            id="reservation-email"
            name="email"
            type="email"
            required
            value={formState.email}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, email: event.target.value }))
            }
            className="w-full rounded-2xl border border-brand-gray-300 px-4 py-3 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </Field>
        <Field label="Phone" htmlFor="reservation-phone">
          <input
            id="reservation-phone"
            name="phone"
            type="tel"
            required
            value={formState.phone}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, phone: event.target.value }))
            }
            className="w-full rounded-2xl border border-brand-gray-300 px-4 py-3 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </Field>
        <Field label="Guests" htmlFor="reservation-guests">
          <input
            id="reservation-guests"
            name="guests"
            type="number"
            min={1}
            max={50}
            required
            value={formState.guests}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, guests: event.target.value }))
            }
            className="w-full rounded-2xl border border-brand-gray-300 px-4 py-3 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </Field>
        <Field label="Event Date" htmlFor="reservation-date">
          <input
            id="reservation-date"
            name="date"
            type="date"
            required
            value={formState.date}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, date: event.target.value }))
            }
            className="w-full rounded-2xl border border-brand-gray-300 px-4 py-3 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </Field>
        <Field label="Event Time" htmlFor="reservation-time">
          <input
            id="reservation-time"
            name="time"
            type="time"
            required
            value={formState.time}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, time: event.target.value }))
            }
            className="w-full rounded-2xl border border-brand-gray-300 px-4 py-3 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </Field>
        <Field label="Status" htmlFor="reservation-status">
          <select
            id="reservation-status"
            name="status"
            required
            value={formState.status}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                status: event.target.value as ReservationStatus,
              }))
            }
            className="w-full rounded-2xl border border-brand-gray-300 px-4 py-3 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Notes" htmlFor="reservation-notes">
        <textarea
          id="reservation-notes"
          name="notes"
          rows={4}
          value={formState.notes}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, notes: event.target.value }))
          }
          className="w-full rounded-2xl border border-brand-gray-300 px-4 py-3 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          placeholder="Dietary requests, celebrations, custom notes..."
        />
      </Field>

      <Field label="Area Tags" htmlFor="reservation-tags">
        <div className="flex flex-wrap gap-2">
          {sortedTags.map((tag) => {
            const selected = formState.tags.includes(tag.name);
            return (
              <button
                type="button"
                key={tag.slug}
                onClick={() => toggleTag(tag.name)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  selected
                    ? "border-brand-orange bg-brand-orange text-brand-charcoal"
                    : "border-brand-gray-300 text-brand-navy hover:border-brand-orange hover:text-brand-orange"
                } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange`}
                aria-pressed={selected}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </Field>

      {feedback && (
        <div
          role="status"
          className={`rounded-2xl border p-4 text-sm ${
            feedback.type === "success"
              ? "border-brand-green/40 bg-brand-green/10 text-brand-navy"
              : "border-brand-error/40 bg-brand-error/10 text-brand-error"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#142041] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-brand-navy" htmlFor={htmlFor}>
      {label}
      {children}
    </label>
  );
}

