"use client";

import { useActionState } from "react";
import { PANEL_FIELD_CLASS } from "../../utils/panel-field-class";
import type { PanelFormState } from "../../utils/panel-form-state";
import { blockDateAction } from "../actions/block-date";

const INITIAL_STATE: PanelFormState = { error: null };

export function BlockDateForm({ date }: { date: string }) {
  const [state, formAction, isPending] = useActionState(blockDateAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="date" value={date} />
      <div>
        <label htmlFor="block-reason" className="mb-1 block text-sm text-muted">
          Motivo (opcional)
        </label>
        <input id="block-reason" name="reason" type="text" maxLength={80} className={PANEL_FIELD_CLASS} />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="min-h-11 rounded-full bg-gold px-5 text-sm font-semibold text-night hover:bg-gold-bright active:scale-[0.97] disabled:opacity-60"
      >
        {isPending ? "Bloqueando…" : "Bloquear fecha"}
      </button>
    </form>
  );
}
