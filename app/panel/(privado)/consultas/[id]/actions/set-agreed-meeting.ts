"use server";

import { revalidatePath } from "next/cache";
import { findMeetingHolidayError } from "@/features/availability/find-meeting-holiday-error";
import { requirePanelSession } from "@/features/panel-auth/panel-session";
import { partyRequestRepository } from "@/features/party-requests/party-request-repository";
import type { PanelFormState } from "../../../utils/panel-form-state";
import { readAgreedMeeting } from "../utils/read-agreed-meeting";

/** Reprograma la reunión de una consulta que ya está en "Reunión pactada". */
export async function setAgreedMeeting(
  requestId: string,
  _previousState: PanelFormState,
  formData: FormData,
): Promise<PanelFormState> {
  await requirePanelSession();

  const meeting = readAgreedMeeting(formData);
  if (!meeting.success) return { error: meeting.error.issues[0].message };

  const holidayError = await findMeetingHolidayError(meeting.data.date);
  if (holidayError) return { error: holidayError };

  const request = await partyRequestRepository.findById(requestId);
  if (!request) return { error: "La consulta ya no existe." };
  if (request.status !== "reunion-pactada") {
    return { error: "Marca la consulta como \"Reunión pactada\" para cargar la reunión." };
  }

  await partyRequestRepository.setAgreedMeeting(requestId, meeting.data);
  revalidatePath("/panel", "layout");
  return { error: null };
}
