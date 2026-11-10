import "server-only";
import { JWT } from "google-auth-library";
import type { CalendarProvider } from "./calendar-provider";

const FREE_BUSY_URL = "https://www.googleapis.com/calendar/v3/freeBusy";
const READ_ONLY_SCOPE = "https://www.googleapis.com/auth/calendar.readonly";
const SALON_TIME_ZONE = "America/Argentina/Buenos_Aires";
const SALON_UTC_OFFSET = "-03:00";

type GoogleCalendarConfig = {
  calendarId: string;
  serviceAccountEmail: string;
  privateKey: string;
};

type FreeBusyResponse = {
  calendars: Record<string, { busy: unknown[]; errors?: unknown[] }>;
};

/** Devuelve la configuración solo si están las tres variables de entorno. */
export function readGoogleCalendarConfig(): GoogleCalendarConfig | null {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!calendarId || !serviceAccountEmail || !privateKey) return null;

  // En los .env la clave suele venir con "\n" literales en vez de saltos de línea.
  return { calendarId, serviceAccountEmail, privateKey: privateKey.replace(/\\n/g, "\n") };
}

/**
 * Consulta el calendario del salón con la API freeBusy de Google.
 * Un día está ocupado si tiene cualquier evento cargado en ese calendario.
 * Requiere compartir el calendario con la cuenta de servicio (permiso de lectura).
 */
export function createGoogleCalendar(config: GoogleCalendarConfig): CalendarProvider {
  const auth = new JWT({
    email: config.serviceAccountEmail,
    key: config.privateKey,
    scopes: [READ_ONLY_SCOPE],
  });

  return {
    async isDateBusy(isoDate) {
      const { token } = await auth.getAccessToken();
      const response = await fetch(FREE_BUSY_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          timeMin: `${isoDate}T00:00:00${SALON_UTC_OFFSET}`,
          timeMax: `${isoDate}T23:59:59${SALON_UTC_OFFSET}`,
          timeZone: SALON_TIME_ZONE,
          items: [{ id: config.calendarId }],
        }),
      });
      if (!response.ok) throw new Error(`Google Calendar respondió ${response.status}`);

      const data: FreeBusyResponse = await response.json();
      const calendar = data.calendars[config.calendarId];
      if (!calendar || calendar.errors?.length) {
        throw new Error("No se pudo leer el calendario del salón en Google Calendar");
      }
      return calendar.busy.length > 0;
    },
  };
}
