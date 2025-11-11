"use client";

import type { JSX } from "react";
import { useFormState } from "react-dom";

type LoginFormState = {
  error: string | null;
};

type Props = {
  action: (
    prevState: LoginFormState,
    formData: FormData,
  ) => Promise<LoginFormState>;
  initialState: LoginFormState;
};

export function AdminLoginForm({ action, initialState }: Props): JSX.Element {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="mt-10 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white shadow-inner placeholder:text-white/60 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white shadow-inner placeholder:text-white/60 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
        />
      </div>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full bg-brand-orange px-6 py-3 text-base font-semibold text-brand-charcoal transition hover:bg-[#f5851f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Sign In
      </button>
      {state.error && (
        <div
          role="alert"
          className="rounded-2xl border border-brand-orange/40 bg-brand-orange/10 p-4 text-sm text-white"
        >
          {state.error}
        </div>
      )}
    </form>
  );
}

