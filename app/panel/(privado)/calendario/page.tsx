import Link from "next/link";
import { listUpcomingHolidays } from "@/features/availability/list-holidays";
import { blockedDateRepository } from "@/features/availability/blocked-date-repository";
import { requirePanelSession } from "@/features/panel-auth/panel-session";
import { partyRequestRepository } from "@/features/party-requests/party-request-repository";
import { toIsoDate } from "@/features/utils/calendar-dates";
import { CalendarLegend } from "./components/calendar-legend";
import { DayPanel } from "./components/day-panel";
import { MonthGrid } from "./components/month-grid";
import { buildMonthGrid, formatMonthTitle, getGridRange } from "./utils/build-month-grid";
import { currentMonth, parseMonth, parseSelectedDay, shiftMonth } from "./utils/month-param";

const NAV_LINK_CLASS =
  "inline-flex min-h-11 items-center rounded-full border border-line bg-night px-4 text-sm hover:border-gold";

export default async function PanelCalendarPage({ searchParams }: PageProps<"/panel/calendario">) {
  await requirePanelSession();

  const params = await searchParams;
  const month = parseMonth(typeof params.mes === "string" ? params.mes : undefined);
  const selectedDay = parseSelectedDay(typeof params.dia === "string" ? params.dia : undefined, month);

  const { start, end } = getGridRange(month);
  const [requests, blockedDates, holidays] = await Promise.all([
    partyRequestRepository.listNewestFirst(),
    blockedDateRepository.listBetween(start, end),
    listUpcomingHolidays(),
  ]);
  const weeks = buildMonthGrid({ month, today: toIsoDate(new Date()), requests, blockedDates, holidays });
  const selected = weeks.flat().find((day) => day.date === selectedDay) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Calendario</h1>
        <p className="mt-2 text-muted">
          Ocupación del salón. Bloquea las fechas que no se pueden ofrecer: la web las muestra como comprometidas.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold first-letter:uppercase">{formatMonthTitle(month)}</h2>
        <nav aria-label="Cambiar de mes" className="flex gap-2">
          <Link href={`/panel/calendario?mes=${shiftMonth(month, -1)}`} className={NAV_LINK_CLASS}>
            ← Anterior
          </Link>
          <Link href={`/panel/calendario?mes=${currentMonth()}`} className={NAV_LINK_CLASS}>
            Hoy
          </Link>
          <Link href={`/panel/calendario?mes=${shiftMonth(month, 1)}`} className={NAV_LINK_CLASS}>
            Siguiente →
          </Link>
        </nav>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <MonthGrid month={month} weeks={weeks} selectedDay={selectedDay} />
          <CalendarLegend />
        </div>
        {selected ? (
          <DayPanel day={selected} />
        ) : (
          <p className="rounded-2xl border border-dashed border-line bg-night p-6 text-muted lg:min-h-48">
            Elige un día para ver sus consultas o bloquearlo.
          </p>
        )}
      </div>
    </div>
  );
}
