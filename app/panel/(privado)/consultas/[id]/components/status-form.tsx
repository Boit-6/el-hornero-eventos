"use client";

import { useActionState } from "react";
import type { AgreedMeeting } from "@/features/party-requests/agreed-meeting-schema";
import {
  PARTY_REQUEST_STATUS_LABELS,
  PARTY_REQUEST_STATUSES,
  type PartyRequestStatus,
} from "@/features/party-requests/party-request-status";
import { PANEL_FIELD_CLASS } from "../../../utils/panel-field-class";
import type { PanelFormState } from "../../../utils/panel-form-state";
import { updateRequestStatus } from "../actions/update-request-status";
import { AgreedMeetingFields } from "./agreed-meeting-fields";

type StatusFormProps = {
  requestId: string;
  currentStatus: PartyRequestStatus;
  /** Reunión ya acordada o, si no hay, la que propuso la persona. */
  defaultMeeting: AgreedMeeting;
};

const INITIAL_STATE: PanelFormState = { error: null };

export function StatusForm({ requestId, currentStatus, defaultMeeting }: StatusFormProps) {
  const [state, formAction, isPending] = useActionState(updateRequestStatus.bind(null, requestId), INITIAL_STATE);

  return (
    // `group` + `has-*`: los campos de la reunión se muestran solo con "Reunión pactada" elegida, sin estado en React.
    <form action={formAction} className="group space-y-3">
      <label htmlFor="status" className="block font-semibold">
        Estado de la consulta
      </label>
      <div className="flex gap-2">
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          // La key fuerza a remontar el select cuando el estado cambia en el servidor.
          key={currentStatus}
          className={`${PANEL_FIELD_CLASS} flex-1`}
        >
          {PARTY_REQUEST_STATUSES.map((status) => (
            <option key={status} value={status}>
              {PARTY_REQUEST_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="min-h-11 rounded-full bg-gold px-5 text-sm font-semibold text-night hover:bg-gold-bright active:scale-[0.97] disabled:opacity-60"
        >
          {isPending ? "Guardando…" : "Guardar"}
        </button>
      </div>

      <fieldset className="hidden space-y-2 group-has-[option[value=reunion-pactada]:checked]:block">
        <legend className="mb-2 text-sm font-semibold text-gold">Reunión acordada</legend>
        <AgreedMeetingFields idPrefix="status-meeting" defaultMeeting={defaultMeeting} />
      </fieldset>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <p className="text-xs text-muted">
        Al marcarla como confirmada, la fecha deja de aparecer disponible en la web. Con Google Calendar,
        carga además el evento en el calendario del salón.
      </p>
    </form>
  );
}
