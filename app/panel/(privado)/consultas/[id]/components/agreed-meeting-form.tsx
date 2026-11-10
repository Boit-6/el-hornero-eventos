"use client";

import { useActionState } from "react";
import type { AgreedMeeting } from "@/features/party-requests/agreed-meeting-schema";
import type { PanelFormState } from "../../../utils/panel-form-state";
import { setAgreedMeeting } from "../actions/set-agreed-meeting";
import { AgreedMeetingFields } from "./agreed-meeting-fields";

type AgreedMeetingFormProps = {
  requestId: string;
  meeting: AgreedMeeting;
};

const INITIAL_STATE: PanelFormState = { error: null };

/** Para cambiar el día u horario de una reunión ya pactada. */
export function AgreedMeetingForm({ requestId, meeting }: AgreedMeetingFormProps) {
  const [state, formAction, isPending] = useActionState(setAgreedMeeting.bind(null, requestId), INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-3">
      <h2 className="font-semibold">Reprogramar reunión</h2>
      <AgreedMeetingFields idPrefix="reschedule" defaultMeeting={meeting} />
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
        {isPending ? "Guardando…" : "Guardar reunión"}
      </button>
    </form>
  );
}
