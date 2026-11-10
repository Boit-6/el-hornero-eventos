import "server-only";
import { createGoogleCalendar, readGoogleCalendarConfig } from "./google-calendar";
import { createMockCalendar } from "./mock-calendar";

/** Fuente de verdad sobre qué días ya tiene ocupados el salón. */
export type CalendarProvider = {
  isDateBusy(isoDate: string): Promise<boolean>;
};

/** Usa Google Calendar si está configurado; si no, la agenda simulada. */
export function getCalendarProvider(): CalendarProvider {
  const googleConfig = readGoogleCalendarConfig();
  return googleConfig ? createGoogleCalendar(googleConfig) : createMockCalendar();
}
