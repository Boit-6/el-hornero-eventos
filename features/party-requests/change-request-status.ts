import "server-only";
import { blockedDateRepository } from "@/features/availability/blocked-date-repository";
import { findMeetingHolidayError } from "@/features/availability/find-meeting-holiday-error";
import type { AgreedMeeting } from "./agreed-meeting-schema";
import { partyRequestRepository, type PartyRequestRecord } from "./party-request-repository";
import type { PartyRequestStatus } from "./party-request-status";

export type ChangeStatusResult = { ok: true } | { ok: false; error: string };

/** Mensaje de por qué no se puede confirmar la fecha de esta consulta, o `null` si se puede. */
async function findConfirmationConflict(request: PartyRequestRecord) {
  const [requests, isBlocked] = await Promise.all([
    partyRequestRepository.listNewestFirst(),
    blockedDateRepository.isBlocked(request.eventDate),
  ]);

  const alreadyConfirmed = requests.some(
    (other) => other.id !== request.id && other.status === "confirmada" && other.eventDate === request.eventDate,
  );
  if (alreadyConfirmed) {
    return "Ya hay otra fiesta confirmada para esa fecha. Descártala antes de confirmar esta.";
  }
  if (isBlocked) return "Esa fecha está bloqueada. Desbloquéala en el calendario antes de confirmar.";
  return null;
}

/**
 * Cambia el estado de una consulta. Una fecha admite una sola fiesta
 * confirmada y no puede estar bloqueada.
 */
export async function changeRequestStatus(
  requestId: string,
  status: PartyRequestStatus,
  agreedMeeting?: AgreedMeeting,
): Promise<ChangeStatusResult> {
  const request = await partyRequestRepository.findById(requestId);
  if (!request) return { ok: false, error: "La consulta ya no existe." };

  const holidayError = agreedMeeting ? await findMeetingHolidayError(agreedMeeting.date) : null;
  if (holidayError) return { ok: false, error: holidayError };

  if (status === "confirmada" && request.status !== "confirmada") {
    const conflict = await findConfirmationConflict(request);
    if (conflict) return { ok: false, error: conflict };
  }

  await partyRequestRepository.updateStatus(requestId, status, agreedMeeting);
  return { ok: true };
}
