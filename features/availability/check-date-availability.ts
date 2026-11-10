import "server-only";
import { addDaysFromToday, daysBetween } from "@/features/utils/calendar-dates";
import { partyRequestRepository } from "@/features/party-requests/party-request-repository";
import { MIN_DAYS_IN_ADVANCE, type AvailabilityResult } from "./availability-result";
import { blockedDateRepository } from "./blocked-date-repository";
import { getCalendarProvider } from "./calendar-provider";

/** Fecha bloqueada a mano o con una consulta confirmada desde el panel, sin importar el calendario externo. */
async function isDateTakenInternally(date: string) {
  const [isBlocked, hasConfirmedRequest] = await Promise.all([
    blockedDateRepository.isBlocked(date),
    partyRequestRepository.hasConfirmedRequestOn(date),
  ]);
  return isBlocked || hasConfirmedRequest;
}

/**
 * Consulta orientativa: informa si la fecha *puede* consultarse.
 * Nunca reserva ni confirma; eso lo resuelve el salón en la reunión.
 */
export async function checkDateAvailability(date: string): Promise<AvailabilityResult> {
  if (daysBetween(addDaysFromToday(0), date) < MIN_DAYS_IN_ADVANCE) {
    return {
      date,
      status: "too-soon",
      message: `Trabajamos con al menos ${MIN_DAYS_IN_ADVANCE} días de anticipación. Elige una fecha posterior.`,
    };
  }

  if (await isDateTakenInternally(date) || (await getCalendarProvider().isDateBusy(date))) {
    return { date, status: "unavailable", message: "Esa fecha ya está comprometida. Prueba con otro día." };
  }

  return {
    date,
    status: "available",
    message: "¡Hay disponibilidad para consultar! La fecha se confirma recién en la reunión con el salón.",
  };
}
