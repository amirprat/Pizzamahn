"use client";

import type { JSX } from "react";
import { useState } from "react";
import { slugify } from "@/lib/utils";

type AreaTag = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
};

type Props = {
  initialTags: AreaTag[];
};

export function AreaTagsManager({ initialTags }: Props): JSX.Element {
  const [tags, setTags] = useState(initialTags);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  async function refreshTags() {
    const response = await fetch("/api/area-tags?includeInactive=true");
    if (!response.ok) {
      throw new Error("Failed to refresh tags.");
    }
    const json = await response.json();
    setTags(json.data);
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.name),
      description: form.description.trim() || undefined,
      isActive: true,
    };

    try {
      const response = await fetch("/api/area-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error ?? "Unable to create tag.");
      }

      setForm({ name: "", description: "" });
      await refreshTags();
      setMessage({ type: "success", text: "Tag created successfully." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unexpected error.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function updateTag(slug: string, data: Partial<AreaTag>) {
    setMessage(null);
    const response = await fetch(`/api/area-tags/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error ?? "Unable to update tag.");
    }
  }

  async function handleToggle(tag: AreaTag) {
    try {
      await updateTag(tag.slug, { isActive: !tag.isActive });
      await refreshTags();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to update tag.",
      });
    }
  }

  async function handleRename(tag: AreaTag, nextName: string) {
    if (!nextName.trim() || nextName === tag.name) return;
    try {
      await updateTag(tag.slug, {
        name: nextName.trim(),
        slug: slugify(nextName),
      });
      await refreshTags();
      setMessage({ type: "success", text: "Tag updated successfully." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to update tag.",
      });
    }
  }

  async function handleDelete(tag: AreaTag) {
    const confirmed = window.confirm(
      `Delete tag “${tag.name}”? This will remove it from all reservations.`,
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/area-tags/${tag.slug}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error ?? "Unable to delete tag.");
      }
      await refreshTags();
      setMessage({ type: "success", text: "Tag deleted." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to delete tag.",
      });
    }
  }

  return (
    <section className="space-y-8">
      <form
        onSubmit={handleCreate}
        className="space-y-4 rounded-3xl border border-brand-gray-200 bg-white p-6 shadow-card"
      >
        <div>
          <h2 className="text-lg font-semibold text-brand-navy">Add new tag</h2>
          <p className="text-sm text-brand-gray-600">
            Tags power SEO metadata and filtering on the public site.
          </p>
        </div>
        <label className="flex flex-col gap-2 text-sm font-semibold text-brand-navy">
          Tag name
          <input
            type="text"
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="e.g. Pangea USVI"
            className="w-full rounded-2xl border border-brand-gray-300 px-4 py-3 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-brand-navy">
          Description (optional)
          <textarea
            rows={3}
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            className="w-full rounded-2xl border border-brand-gray-300 px-4 py-3 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#142041] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
        >
          {saving ? "Saving…" : "Add Tag"}
        </button>
      </form>

      {message && (
        <div
          role="status"
          className={`rounded-3xl border p-4 text-sm ${
            message.type === "success"
              ? "border-brand-green/40 bg-brand-green/10 text-brand-navy"
              : "border-brand-error/40 bg-brand-error/10 text-brand-error"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-brand-gray-200 bg-white shadow-card">
        <table className="min-w-full divide-y divide-brand-gray-200">
          <caption className="sr-only">Area tags</caption>
          <thead className="bg-brand-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-gray-600">
                Tag
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-gray-600">
                Description
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
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-brand-gray-50">
                <td className="px-4 py-4 align-top text-sm text-brand-navy">
                  <EditableField initialValue={tag.name} onSave={(value) => handleRename(tag, value)}>
                    {tag.name}
                  </EditableField>
                  <p className="text-xs uppercase text-brand-gray-400">/{tag.slug}</p>
                </td>
                <td className="px-4 py-4 align-top text-sm text-brand-gray-600">
                  {tag.description ?? <span className="text-brand-gray-400">No description</span>}
                </td>
                <td className="px-4 py-4 align-top text-sm text-brand-gray-600">
                  <button
                    type="button"
                    onClick={() => handleToggle(tag)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange ${
                      tag.isActive
                        ? "border border-brand-green/40 bg-brand-green/10 text-brand-green"
                        : "border border-brand-gray-300 text-brand-gray-500"
                    }`}
                  >
                    {tag.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-4 align-top text-right text-sm">
                  <button
                    type="button"
                    onClick={() => handleDelete(tag)}
                    className="rounded-full border border-brand-error/20 bg-brand-error/10 px-3 py-2 text-xs font-semibold text-brand-error transition hover:bg-brand-error/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tags.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-brand-gray-600">
                  No tags yet. Create your first tag to categorize reservations and improve SEO.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EditableField({
  initialValue,
  onSave,
  children,
}: {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  children: React.ReactNode;
}): JSX.Element {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave(value);
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-left text-brand-navy hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
      >
        {children}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoFocus
        className="rounded-2xl border border-brand-gray-300 px-3 py-2 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
      />
      <button
        type="submit"
        className="rounded-full border border-brand-green/40 bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green"
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => {
          setValue(initialValue);
          setEditing(false);
        }}
        className="rounded-full border border-brand-gray-300 px-3 py-1 text-xs font-semibold text-brand-gray-500"
      >
        Cancel
      </button>
    </form>
  );
}

