"use client";

import { useActionState } from "react";
import type { PanelFormState } from "../../../utils/panel-form-state";
import { addNote } from "../actions/add-note";

const INITIAL_STATE: PanelFormState = { error: null };
const MAX_NOTE_LENGTH = 1000;

export function NoteForm({ requestId }: { requestId: string }) {
  const [state, formAction, isPending] = useActionState(addNote.bind(null, requestId), INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-3">
      <label htmlFor="note" className="block font-semibold">
        Nota interna
      </label>
      <textarea
        id="note"
        name="note"
        rows={3}
        required
        maxLength={MAX_NOTE_LENGTH}
        className="w-full rounded-xl border border-line bg-night px-3 py-2 text-base outline-none focus:border-gold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
      />
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="min-h-11 rounded-full border border-gold px-5 text-sm font-semibold text-gold hover:bg-gold-dim active:scale-[0.97] disabled:opacity-60"
      >
        {isPending ? "Guardando…" : "Agregar nota"}
      </button>
      <p className="text-xs text-muted">Solo la ve el salón. Una vez guardada no se edita: corrígela con otra nota.</p>
    </form>
  );
}
