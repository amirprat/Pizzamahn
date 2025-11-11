"use client";

import type { ChangeEvent, FormEvent, JSX } from "react";
import { useState, useTransition } from "react";
import { reservationFormContent } from "@/lib/site-data";

type ReservationFormData = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  tags: string[];
};

type SubmissionState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

const initialForm: ReservationFormData = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  guests: 2,
  notes: "",
  tags: [],
};

type ReservationFormProps = {
  areaTags: Array<{ name: string; slug: string }>;
};

export function ReservationForm({
  areaTags,
}: ReservationFormProps): JSX.Element {
  const [formData, setFormData] = useState<ReservationFormData>(initialForm);
  const [submission, setSubmission] = useState<SubmissionState>({
    status: "idle",
    message: "",
  });
  const [isPending, startTransition] = useTransition();

  const isLoading = submission.status === "submitting" || isPending;

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  }

  function handleTagToggle(tag: string) {
    setFormData((prev) => {
      const alreadySelected = prev.tags.includes(tag);
      return {
        ...prev,
        tags: alreadySelected
          ? prev.tags.filter((item) => item !== tag)
          : [...prev.tags, tag],
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmission({ status: "submitting", message: "Submitting reservation..." });

    const payload = {
      ...formData,
      guests: Number(formData.guests),
    };

    startTransition(async () => {
      try {
        const response = await fetch("/api/reservations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.message ?? "Unable to create reservation.");
        }

        setSubmission({
          status: "success",
          message:
            "Reservation received! We'll confirm by email within the next few hours.",
        });
        setFormData(initialForm);
      } catch (error) {
        console.error(error);
        setSubmission({
          status: "error",
          message:
            error instanceof Error ? error.message : "Something went wrong. Please try again.",
        });
      }
    });
  }

  return (
    <section
      id="reservation"
      className="bg-brand-gray-50 py-20"
      aria-labelledby="reservation-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div>
          <h2
            id="reservation-heading"
            className="text-3xl font-semibold text-brand-navy sm:text-4xl"
          >
            {reservationFormContent.title}
          </h2>
          <p className="mt-4 text-lg text-brand-gray-600">
            {reservationFormContent.description}
          </p>
          <p className="mt-6 rounded-3xl bg-white p-6 text-sm text-brand-gray-600 shadow-card">
            We operate intimate pop-up events with very limited capacity. Submitting this form
            requests a reservation; our team will confirm availability and send payment details.
          </p>
          <div className="mt-6 space-y-3 text-sm text-brand-gray-600">
            <p>
              Need a custom experience or large gathering? Email{" "}
              <a
                href="mailto:hello@pizzamahn.com"
                className="font-semibold text-brand-navy underline-offset-4 hover:underline"
              >
                hello@pizzamahn.com
              </a>{" "}
              with your event details.
            </p>
            <p>All fields marked with * are required.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-brand-gray-200 bg-white p-8 shadow-card"
          noValidate
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              label="Full Name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <FormField
              label="Phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={formData.phone}
              onChange={handleChange}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4 sm:col-span-2">
              <FormField
                label="Preferred Date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={handleChange}
              />
              <FormField
                label="Preferred Time"
                name="time"
                type="time"
                required
                value={formData.time}
                onChange={handleChange}
              />
            </div>
            <FormField
              label="Number of Guests"
              name="guests"
              type="number"
              min={1}
              max={30}
              required
              value={formData.guests.toString()}
              onChange={handleChange}
            />
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-brand-navy">
                Area Tags
              </label>
              <p className="mt-2 text-sm text-brand-gray-600">
                Select the areas that best describe your request so we can customize your experience.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {areaTags.map((tag) => {
                  const selected = formData.tags.includes(tag.name);
                  return (
                    <button
                      type="button"
                      key={tag.slug}
                      onClick={() => handleTagToggle(tag.name)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        selected
                          ? "border-brand-orange bg-brand-orange text-brand-charcoal focus-visible:outline-brand-charcoal"
                          : "border-brand-gray-300 text-brand-navy hover:border-brand-orange hover:text-brand-orange focus-visible:outline-brand-orange"
                      }`}
                      aria-pressed={selected}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <FormField
              label="Notes"
              name="notes"
              as="textarea"
              rows={4}
              placeholder="Share dietary preferences, celebrations, or anything we should know."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-base font-semibold text-white transition hover:bg-[#142041] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
            >
              {isLoading ? "Submitting..." : reservationFormContent.submitLabel}
            </button>
            <p className="text-xs text-brand-gray-700">
              By submitting, you consent to us contacting you about this reservation and future events.
            </p>
            {submission.status === "success" && (
              <div
                role="status"
                className="rounded-2xl border border-brand-green/40 bg-brand-green/10 p-4 text-sm text-brand-navy"
              >
                {submission.message}
              </div>
            )}
            {submission.status === "error" && (
              <div
                role="alert"
                className="rounded-2xl border border-brand-error/40 bg-brand-error/10 p-4 text-sm text-brand-error"
              >
                {submission.message}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  as?: "textarea";
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  autoComplete?: string;
  required?: boolean;
  min?: number;
  max?: number;
  rows?: number;
  placeholder?: string;
};

function FormField(props: FormFieldProps): JSX.Element {
  const {
    label,
    name,
    type = "text",
    as,
    value,
    onChange,
    autoComplete,
    required = false,
    min,
    max,
    rows = 3,
    placeholder,
  } = props;

  const id = `reservation-${name}`;

  if (as === "textarea") {
    return (
      <div className="sm:col-span-2">
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-brand-navy"
        >
          {label}
          {required && <span className="text-brand-orange"> *</span>}
        </label>
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className="mt-2 w-full rounded-2xl border border-brand-gray-300 bg-white px-4 py-3 text-base text-brand-navy shadow-sm transition focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          required={required}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-brand-navy"
      >
        {label}
        {required && <span className="text-brand-orange"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
        className="mt-2 w-full rounded-2xl border border-brand-gray-300 bg-white px-4 py-3 text-base text-brand-navy shadow-sm transition focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
      />
    </div>
  );
}

