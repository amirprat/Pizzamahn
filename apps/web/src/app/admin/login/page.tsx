import Link from "next/link";
import { redirect } from "next/navigation";
import type { JSX } from "react";
import { AdminLoginForm } from "@/components/admin/login-form";
import { auth, signIn } from "@/lib/auth";

type LoginFormState = {
  error: string | null;
};

const initialState: LoginFormState = {
  error: null,
};

async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Email and password are required." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
    return { error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to sign in.";
    return { error: message };
  }
}

export default async function AdminLoginPage(): Promise<JSX.Element> {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-navy text-white">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <header className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-orange">
            Pizzamahn Admin
          </p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Sign in to continue
          </h1>
        </header>
        <AdminLoginForm action={loginAction} initialState={initialState} />
        <footer className="mt-12 text-center text-sm text-white/70">
          <p>
            Need help?{" "}
            <Link
              href="mailto:hello@pizzamahn.com"
              className="font-semibold text-brand-orange underline-offset-4 hover:underline"
            >
              Contact the site owner
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

