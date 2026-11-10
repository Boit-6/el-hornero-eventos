/**
 * Utilidades de fechas en formato ISO corto (AAAA-MM-DD) usando la hora local,
 * para que un `<input type="date">` nunca se corra un día por la zona horaria.
 */

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const longDateFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function parseIsoDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function addDaysFromToday(days: number) {
  const today = new Date();
  return toIsoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + days));
}

export function daysBetween(fromIsoDate: string, toIsoDateValue: string) {
  const difference = parseIsoDate(toIsoDateValue).getTime() - parseIsoDate(fromIsoDate).getTime();
  return Math.round(difference / MILLISECONDS_PER_DAY);
}

/** Día de la semana de una fecha: 0 = domingo … 6 = sábado. */
export function getWeekday(isoDate: string) {
  return parseIsoDate(isoDate).getDay();
}

export function formatLongDate(isoDate: string) {
  return longDateFormatter.format(parseIsoDate(isoDate));
}

export function addDays(isoDate: string, days: number) {
  const date = parseIsoDate(isoDate);
  return toIsoDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days));
}
