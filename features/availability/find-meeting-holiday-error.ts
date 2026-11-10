import "server-only";
import { findHoliday } from "./holiday";
import { listUpcomingHolidays } from "./list-holidays";

/** Mensaje si la reunión cae en un feriado o puente (esos días no se atiende); `null` si se puede. */
export async function findMeetingHolidayError(meetingDate: string) {
  const holiday = findHoliday(await listUpcomingHolidays(), meetingDate);
  return holiday ? `Ese día es feriado (${holiday.name}) y no atendemos. Elige otro día para la reunión.` : null;
}
