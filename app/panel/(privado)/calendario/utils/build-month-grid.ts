import { findHoliday, type Holiday } from "@/features/availability/holiday";
import type { BlockedDate } from "@/features/availability/blocked-date-repository";
import type { PartyRequestRecord } from "@/features/party-requests/party-request-repository";
import { OPEN_PARTY_REQUEST_STATUSES } from "@/features/party-requests/party-request-status";
import { addDays, getWeekday, parseIsoDate, toIsoDate } from "@/features/utils/calendar-dates";

const DAYS_PER_WEEK = 7;

export type CalendarDay = {
  date: string;
  isInMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  confirmedRequest: PartyRequestRecord | null;
  openRequests: PartyRequestRecord[];
  /** Consultas con reunión acordada ese día, salvo las descartadas. */
  meetingRequests: PartyRequestRecord[];
  blocked: BlockedDate | null;
  /** Feriado o puente: ese día el salón no atiende reuniones. */
  holiday: Holiday | null;
};

type MonthGridInput = {
  month: string;
  today: string;
  requests: PartyRequestRecord[];
  blockedDates: BlockedDate[];
  holidays: Holiday[];
};

/** Primer y último día que muestra la grilla del mes: semanas completas, de lunes a domingo. */
export function getGridRange(month: string) {
  const firstOfMonth = `${month}-01`;
  const mondayBasedWeekday = (getWeekday(firstOfMonth) + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
  const start = addDays(firstOfMonth, -mondayBasedWeekday);

  const [year, monthNumber] = month.split("-").map(Number);
  const lastOfMonth = toIsoDate(new Date(year, monthNumber, 0));
  const daysAfterLastMonday = (getWeekday(lastOfMonth) + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
  const end = addDays(lastOfMonth, DAYS_PER_WEEK - 1 - daysAfterLastMonday);

  return { start, end };
}

/** Arma las semanas del mes con lo que pasa cada día: fiestas, consultas, reuniones y bloqueos. */
export function buildMonthGrid({ month, today, requests, blockedDates, holidays }: MonthGridInput): CalendarDay[][] {
  const { start, end } = getGridRange(month);
  const blockedByDate = new Map(blockedDates.map((blocked) => [blocked.date, blocked]));

  const weeks: CalendarDay[][] = [];
  for (let weekStart = start; weekStart <= end; weekStart = addDays(weekStart, DAYS_PER_WEEK)) {
    const week = Array.from({ length: DAYS_PER_WEEK }, (_, offset): CalendarDay => {
      const date = addDays(weekStart, offset);
      return {
        date,
        isInMonth: date.startsWith(month),
        isToday: date === today,
        isPast: date < today,
        confirmedRequest:
          requests.find((request) => request.status === "confirmada" && request.eventDate === date) ?? null,
        openRequests: requests.filter(
          (request) => request.eventDate === date && OPEN_PARTY_REQUEST_STATUSES.includes(request.status),
        ),
        meetingRequests: requests.filter(
          (request) => request.status !== "descartada" && request.agreedMeeting?.date === date,
        ),
        blocked: blockedByDate.get(date) ?? null,
        holiday: findHoliday(holidays, date),
      };
    });
    weeks.push(week);
  }
  return weeks;
}

/** Nombre del mes y año, por ejemplo "noviembre de 2026". */
export function formatMonthTitle(month: string) {
  return new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" }).format(parseIsoDate(`${month}-01`));
}
