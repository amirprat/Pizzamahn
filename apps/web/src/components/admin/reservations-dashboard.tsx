"use client";

import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

type AreaTag = {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
};

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  notes?: string | null;
  createdAt: string;
  areaTags: Array<{ id: number; name: string; slug: string }>;
};

type ApiResponse = {
  data: Reservation[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

type Props = {
  areaTags: AreaTag[];
};

type SortOption = "date-desc" | "date-asc" | "created-desc";

const STATUS_OPTIONS: Array<Reservation["status"]> = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
];

const SORT_LABELS: Record<SortOption, string> = {
  "date-desc": "Event Date (newest)",
  "date-asc": "Event Date (oldest)",
  "created-desc": "Created (newest)",
};

export function ReservationsDashboard({ areaTags }: Props): JSX.Element {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("date-desc");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchReservations() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search.trim()) {
        params.set("search", search.trim());
      }
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (tagFilter !== "all") {
        params.set("tag", tagFilter);
      }
      switch (sort) {
        case "date-asc":
          params.set("sort", "date-asc");
          break;
        case "created-desc":
          params.set("sort", "created-desc");
          break;
        default:
          params.set("sort", "date-desc");
      }

      try {
        const response = await fetch(`/api/reservations?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to load reservations.");
        }
        const json = (await response.json()) as ApiResponse;
        setReservations(json.data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError(
          err instanceof Error ? err.message : "Failed to load reservations.",
        );
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(fetchReservations, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [search, statusFilter, tagFilter, sort]);

  const pendingCount = useMemo(
    () => reservations.filter((reservation) => reservation.status === "PENDING").length,
    [reservations],
  );

  async function handleStatusChange(
    reservationId: string,
    nextStatus: Reservation["status"],
  ) {
    const previous = reservations;
    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === reservationId
          ? { ...reservation, status: nextStatus }
          : reservation,
      ),
    );

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update reservation status.");
      }
    } catch (err) {
      setReservations(previous);
      alert(err instanceof Error ? err.message : "Unable to update status.");
    }
  }

  async function handleDelete(reservationId: string) {
    const confirmed = window.confirm("Delete this reservation? This cannot be undone.");
    if (!confirmed) return;

    const previous = reservations;
    setReservations((current) =>
      current.filter((reservation) => reservation.id !== reservationId),
    );

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete reservation.");
      }
    } catch (err) {
      setReservations(previous);
      alert(err instanceof Error ? err.message : "Unable to delete reservation.");
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-brand-gray-200 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-brand-navy">Reservation Summary</h2>
          <p className="text-sm text-brand-gray-600">
            {reservations.length} total • {pendingCount} pending responses
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/reservations/export"
            className="inline-flex items-center justify-center rounded-full border border-brand-gray-300 px-5 py-2 text-sm font-semibold text-brand-navy transition hover:border-brand-orange hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
          >
            Export CSV
          </a>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setTagFilter("all");
              setSort("date-desc");
            }}
            className="inline-flex items-center justify-center rounded-full border border-brand-gray-200 bg-brand-gray-100 px-5 py-2 text-sm font-semibold text-brand-navy transition hover:bg-brand-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-brand-gray-200 bg-white p-6 shadow-card sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm font-semibold text-brand-navy">
          Search
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, email, phone, notes…"
            className="rounded-2xl border border-brand-gray-300 px-4 py-2 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-brand-navy">
          Status
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-2xl border border-brand-gray-300 px-4 py-2 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.toLowerCase()}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-brand-navy">
          Area Tag
          <select
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
            className="rounded-2xl border border-brand-gray-300 px-4 py-2 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          >
            <option value="all">All tags</option>
            {areaTags.map((tag) => (
              <option key={tag.slug} value={tag.slug}>
                {tag.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-brand-navy">
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="rounded-2xl border border-brand-gray-300 px-4 py-2 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-3xl border border-brand-gray-200 bg-white shadow-card">
        <table className="min-w-full divide-y divide-brand-gray-200">
          <caption className="sr-only">Reservation records</caption>
          <thead className="bg-brand-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-gray-600">
                Guest
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-gray-600">
                Event
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-gray-600">
                Guests
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-gray-600">
                Area Tags
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-gray-600">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-brand-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-100">
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-brand-gray-600">
                  Loading reservations…
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-brand-error">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && reservations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-brand-gray-600">
                  No reservations found. Adjust your filters or check back later.
                </td>
              </tr>
            )}
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-brand-gray-50">
                <td className="px-4 py-4 align-top">
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-brand-navy">{reservation.name}</p>
                    <p className="text-brand-gray-600">
                      <a href={`mailto:${reservation.email}`} className="hover:text-brand-orange">
                        {reservation.email}
                      </a>
                    </p>
                    <p className="text-brand-gray-500">
                      <a href={`tel:${reservation.phone}`} className="hover:text-brand-orange">
                        {reservation.phone}
                      </a>
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4 align-top text-sm text-brand-gray-600">
                  <p>{format(new Date(reservation.date), "MMM d, yyyy")}</p>
                  <p className="text-brand-gray-500">{reservation.time}</p>
                  <p className="text-brand-gray-400">
                    Added {format(new Date(reservation.createdAt), "MMM d, yyyy")}
                  </p>
                </td>
                <td className="px-4 py-4 align-top text-sm text-brand-gray-600">
                  {reservation.guests}
                </td>
                <td className="px-4 py-4 align-top text-sm text-brand-gray-600">
                  <div className="flex flex-wrap gap-2">
                    {reservation.areaTags.map((tag) => (
                      <span
                        key={`${reservation.id}-${tag.slug}`}
                        className="rounded-full border border-brand-gray-200 bg-brand-gray-100 px-3 py-1 text-xs font-medium text-brand-navy"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 align-top text-sm text-brand-gray-600">
                  <label className="sr-only" htmlFor={`status-${reservation.id}`}>
                    Update status for {reservation.name}
                  </label>
                  <select
                    id={`status-${reservation.id}`}
                    value={reservation.status}
                    onChange={(event) =>
                      handleStatusChange(
                        reservation.id,
                        event.target.value as Reservation["status"],
                      )
                    }
                    className="rounded-full border border-brand-gray-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option.toLowerCase()}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4 align-top text-right text-sm">
                  <div className="flex justify-end gap-2">
                    <a
                      href={`/admin/reservations/${reservation.id}`}
                      className="rounded-full border border-brand-gray-300 px-3 py-2 text-xs font-semibold text-brand-navy transition hover:border-brand-orange hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
                    >
                      View
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(reservation.id)}
                      className="rounded-full border border-brand-error/20 bg-brand-error/10 px-3 py-2 text-xs font-semibold text-brand-error transition hover:bg-brand-error/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-error"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

