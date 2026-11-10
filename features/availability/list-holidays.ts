import "server-only";
import { z } from "zod";
import { toIsoDate } from "@/features/utils/calendar-dates";
import type { Holiday } from "./holiday";
import { MENDOZA_HOLIDAYS } from "./provincial-holidays";

const HOLIDAYS_API_URL = "https://api.argentinadatos.com/v1/feriados";
const SECONDS_PER_DAY = 24 * 60 * 60;
const REQUEST_TIMEOUT_MS = 5000;

const holidaysResponseSchema = z.array(z.object({ fecha: z.iso.date(), nombre: z.string() }));

/**
 * Feriados y puentes de un año según ArgentinaDatos (API pública, sin clave).
 * La respuesta se guarda un día. Si la API falla se devuelve una lista vacía:
 * es preferible aceptar una reunión en feriado que dejar el armador sin funcionar.
 */
async function listHolidaysOfYear(year: number): Promise<Holiday[]> {
  try {
    const response = await fetch(`${HOLIDAYS_API_URL}/${year}`, {
      next: { revalidate: SECONDS_PER_DAY },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`ArgentinaDatos respondió ${response.status}`);

    const holidays = holidaysResponseSchema.parse(await response.json());
    return holidays.map(({ fecha, nombre }) => ({ date: fecha, name: nombre }));
  } catch (error) {
    console.error(`No se pudieron leer los feriados de ${year}`, error);
    return [];
  }
}

function listProvincialHolidaysOfYear(year: number): Holiday[] {
  return MENDOZA_HOLIDAYS.map(({ monthDay, name }) => ({ date: `${year}-${monthDay}`, name }));
}

/** Feriados nacionales, puentes y provinciales de este año y del siguiente: alcanza para cualquier reunión. */
export async function listUpcomingHolidays(): Promise<Holiday[]> {
  const currentYear = Number(toIsoDate(new Date()).slice(0, 4));
  const years = [currentYear, currentYear + 1];
  const nationalHolidays = await Promise.all(years.map(listHolidaysOfYear));
  return [...nationalHolidays.flat(), ...years.flatMap(listProvincialHolidaysOfYear)];
}
