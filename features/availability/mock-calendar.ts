import "server-only";
import type { CalendarProvider } from "./calendar-provider";

/**
 * Agenda simulada, sin eventos externos. Las fechas ocupadas salen de las
 * consultas confirmadas y de los bloqueos del panel (ver `checkDateAvailability`).
 */
export function createMockCalendar(): CalendarProvider {
  return {
    async isDateBusy() {
      return false;
    },
  };
}
