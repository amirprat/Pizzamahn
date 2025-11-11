import Link from "next/link";
import { redirect } from "next/navigation";
import type { JSX, ReactNode } from "react";
import { auth, signOut } from "@/lib/auth";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps): Promise<JSX.Element> {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  async function handleSignOut(): Promise<void> {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-brand-gray-50 text-brand-charcoal">
      <header className="border-b border-brand-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/admin" className="text-lg font-semibold text-brand-navy">
            Pizzamahn Admin
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-brand-gray-600">
            <Link
              href="/admin"
              className="rounded-full px-4 py-2 hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
            >
              Reservations
            </Link>
            <Link
              href="/admin/area-tags"
              className="rounded-full px-4 py-2 hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
            >
              Area Tags
            </Link>
          </nav>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="rounded-full border border-brand-gray-300 px-4 py-2 text-sm font-semibold text-brand-gray-600 transition hover:border-brand-orange hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">{children}</main>
    </div>
  );
}

