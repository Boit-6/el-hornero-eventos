import { toIsoDate } from "@/features/utils/calendar-dates";

const MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Mes en formato `AAAA-MM`. */
export function currentMonth() {
  return toIsoDate(new Date()).slice(0, 7);
}

/** Lee `?mes=`: si no es un mes válido, cae en el mes actual. */
export function parseMonth(value: string | undefined) {
  return value && MONTH_PATTERN.test(value) ? value : currentMonth();
}

/** Lee `?dia=`: solo acepta una fecha real que pertenezca al mes mostrado. */
export function parseSelectedDay(value: string | undefined, month: string) {
  if (!value || !DAY_PATTERN.test(value) || !value.startsWith(month)) return null;
  return toIsoDate(new Date(`${value}T12:00:00`)) === value ? value : null;
}

/** Mes anterior (`-1`) o siguiente (`1`) en formato `AAAA-MM`. */
export function shiftMonth(month: string, offset: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  return toIsoDate(new Date(year, monthNumber - 1 + offset, 1)).slice(0, 7);
}
