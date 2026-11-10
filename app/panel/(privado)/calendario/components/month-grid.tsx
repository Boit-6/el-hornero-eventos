import Link from "next/link";
import type { CalendarDay } from "../utils/build-month-grid";

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

type MonthGridProps = {
  month: string;
  weeks: CalendarDay[][];
  selectedDay: string | null;
};

function describeDay(day: CalendarDay) {
  const parts = [];
  if (day.confirmedRequest) parts.push(`fiesta confirmada de ${day.confirmedRequest.contact.name}`);
  if (day.openRequests.length > 0) parts.push(`${day.openRequests.length} consulta(s) en curso`);
  if (day.meetingRequests.length > 0) parts.push(`${day.meetingRequests.length} reunión(es)`);
  if (day.blocked) parts.push("fecha bloqueada");
  if (day.holiday) parts.push(`feriado: ${day.holiday.name}`);
  return parts.join(", ");
}

function Dot({ className, label }: { className: string; label: string }) {
  return <span role="img" aria-label={label} className={`inline-block size-2 rounded-full ${className}`} />;
}

export function MonthGrid({ month, weeks, selectedDay }: MonthGridProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-night">
      <div className="grid grid-cols-7 border-b border-line text-center text-xs font-semibold text-muted">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {weeks.flat().map((day) => {
          const summary = describeDay(day);
          return (
            <Link
              key={day.date}
              href={`/panel/calendario?mes=${month}&dia=${day.date}`}
              scroll={false}
              aria-label={`${Number(day.date.slice(8))}${summary ? `: ${summary}` : ""}`}
              aria-current={day.date === selectedDay ? "date" : undefined}
              className={`flex min-h-14 flex-col gap-1 border-b border-r border-line p-1.5 text-left hover:bg-coal sm:min-h-24 sm:p-2 aria-[current=date]:bg-gold-dim aria-[current=date]:ring-1 aria-[current=date]:ring-inset aria-[current=date]:ring-gold ${
                day.isInMonth ? "" : "opacity-35"
              } ${day.isPast ? "text-muted" : ""} ${day.blocked ? "bg-[repeating-linear-gradient(135deg,transparent_0_6px,var(--color-line)_6px_7px)]" : ""}`}
            >
              <span
                className={`text-sm tabular-nums ${day.isToday ? "inline-flex size-6 items-center justify-center rounded-full bg-gold font-semibold text-night" : ""}`}
              >
                {Number(day.date.slice(8))}
              </span>

              {/* En pantallas chicas solo puntos; desde sm, texto. */}
              <span className="flex gap-1 sm:hidden" aria-hidden="true">
                {day.confirmedRequest && <Dot className="bg-ok" label="Fiesta confirmada" />}
                {day.openRequests.length > 0 && <Dot className="bg-gold" label="Consultas en curso" />}
                {day.meetingRequests.length > 0 && <Dot className="bg-ivory" label="Reunión" />}
                {day.holiday && <Dot className="bg-danger" label="Feriado" />}
              </span>
              <span className="hidden flex-col gap-1 text-xs sm:flex">
                {day.confirmedRequest && (
                  <span className="truncate rounded bg-ok px-1.5 py-0.5 font-semibold text-night">
                    {day.confirmedRequest.contact.name}
                  </span>
                )}
                {day.openRequests.length > 0 && (
                  <span className="rounded bg-gold-dim px-1.5 py-0.5 text-gold-bright">
                    {day.openRequests.length} consulta{day.openRequests.length === 1 ? "" : "s"}
                  </span>
                )}
                {day.meetingRequests.length > 0 && (
                  <span className="text-ivory">
                    {day.meetingRequests.length} reunión{day.meetingRequests.length === 1 ? "" : "es"}
                  </span>
                )}
                {day.holiday && <span className="truncate text-danger">{day.holiday.name}</span>}
                {day.blocked && <span className="truncate text-muted">Bloqueado{day.blocked.reason ? `: ${day.blocked.reason}` : ""}</span>}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
