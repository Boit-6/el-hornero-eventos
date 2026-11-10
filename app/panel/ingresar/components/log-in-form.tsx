"use client";

import { useActionState } from "react";
import { logIn, type LogInState } from "../actions/log-in";

const INITIAL_STATE: LogInState = { error: null };

export function LogInForm() {
  const [state, formAction, isPending] = useActionState(logIn, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="password" className="mb-2 block font-semibold">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? "password-error" : undefined}
          className="min-h-12 w-full rounded-xl border border-line bg-night px-4 outline-none focus:border-gold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold aria-invalid:border-danger"
        />
        {state.error && (
          <p id="password-error" className="mt-2 text-sm text-danger">
            {state.error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="min-h-12 w-full rounded-full bg-gold px-7 font-semibold text-night transition-[background-color,transform,opacity] duration-150 hover:bg-gold-bright active:scale-[0.97] disabled:opacity-60"
      >
        {isPending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
