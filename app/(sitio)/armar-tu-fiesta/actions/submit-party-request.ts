"use server";

import { findMeetingHolidayError } from "@/features/availability/find-meeting-holiday-error";
import { checkDateAvailability } from "@/features/availability/check-date-availability";
import { partyRequestRepository } from "@/features/party-requests/party-request-repository";
import { partyRequestSchema } from "@/features/party-requests/party-request-schema";

export type SubmitPartyRequestResult =
  | { status: "received"; id: string }
  | { status: "rejected"; message: string };

/**
 * Registra la consulta para que el salón la vea en el panel. No reserva nada:
 * la consulta entra como "nueva" y la confirmación la decide el salón.
 * Los datos llegan del navegador, así que se vuelven a validar acá.
 */
export async function submitPartyRequest(input: unknown): Promise<SubmitPartyRequestResult> {
  const parsed = partyRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "rejected", message: "Hay datos incompletos o inválidos. Revisa los pasos anteriores." };
  }

  try {
    // La fecha pudo ocuparse mientras la persona completaba el resto del armador.
    const availability = await checkDateAvailability(parsed.data.eventDate);
    if (availability.status !== "available") {
      return { status: "rejected", message: availability.message };
    }

    const holidayError = await findMeetingHolidayError(parsed.data.meeting.date);
    if (holidayError) return { status: "rejected", message: holidayError };

    const record = await partyRequestRepository.create(parsed.data);
    return { status: "received", id: record.id };
  } catch (error) {
    console.error("Error al registrar la consulta", error);
    return { status: "rejected", message: "No pudimos registrar tu consulta. Prueba de nuevo en unos minutos." };
  }
}
