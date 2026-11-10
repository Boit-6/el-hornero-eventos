import Link from "next/link";
import { findMeetingMode } from "@/features/catalog/party-options";
import { formatLongDate } from "@/features/utils/calendar-dates";
import { StatusBadge } from "../../components/status-badge";
import { unblockDate } from "../actions/unblock-date";
import type { CalendarDay } from "../utils/build-month-grid";
import { BlockDateForm } from "./block-date-form";

function RequestLink({ request }: { request: CalendarDay["openRequests"][number] }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <Link href={`/panel/consultas/${request.id}`} className="font-semibold underline-offset-4 hover:underline">
        {request.contact.name}
      </Link>
      <StatusBadge status={request.status} />
    </li>
  );
}

/** Por qué no se puede bloquear el día, o `null` si se puede. */
function findBlockingReason(day: CalendarDay) {
  if (day.isPast) return "No se puede bloquear un día que ya pasó.";
  if (day.confirmedRequest || day.openRequests.length > 0) {
    return "Hay consultas para esta fecha. Descártalas o cámbialas de fecha antes de bloquearla.";
  }
  return null;
}

export function DayPanel({ day }: { day: CalendarDay }) {
  const blockingReason = findBlockingReason(day);
  const hasActivity = day.confirmedRequest || day.openRequests.length > 0 || day.meetingRequests.length > 0;

  return (
    <section aria-labelledby="day-title" className="space-y-5 rounded-2xl border border-line bg-night p-5">
      <h2 id="day-title" className="font-display text-2xl font-semibold first-letter:uppercase">
        {formatLongDate(day.date)}
      </h2>

      {day.holiday && (
        <p className="text-sm text-danger">
          Feriado: {day.holiday.name}. No se atienden reuniones este día.
        </p>
      )}

      {day.confirmedRequest && (
        <div>
          <h3 className="text-sm font-semibold text-gold">Fiesta confirmada</h3>
          <ul className="mt-2 space-y-2">
            <RequestLink request={day.confirmedRequest} />
          </ul>
        </div>
      )}

      {day.openRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gold">Consultas en curso</h3>
          <ul className="mt-2 space-y-2">
            {day.openRequests.map((request) => (
              <RequestLink key={request.id} request={request} />
            ))}
          </ul>
        </div>
      )}

      {day.meetingRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gold">Reuniones</h3>
          <ul className="mt-2 space-y-2">
            {day.meetingRequests.map((request) => (
              <li key={request.id}>
                <Link href={`/panel/consultas/${request.id}`} className="font-semibold underline-offset-4 hover:underline">
                  {request.contact.name}
                </Link>
                <span className="text-muted">
                  {" "}
                  · {request.agreedMeeting?.time} h · {request.agreedMeeting && findMeetingMode(request.agreedMeeting.mode)?.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!hasActivity && !day.blocked && <p className="text-muted">Sin movimientos este día.</p>}

      {day.blocked ? (
        <div className="space-y-3">
          <p>
            <span className="font-semibold">Fecha bloqueada</span>
            {day.blocked.reason && <span className="text-muted"> · {day.blocked.reason}</span>}
          </p>
          <form action={unblockDate}>
            <input type="hidden" name="date" value={day.date} />
            <button
              type="submit"
              className="min-h-11 rounded-full border border-ivory/20 px-5 text-sm font-semibold hover:bg-coal active:scale-[0.97]"
            >
              Desbloquear
            </button>
          </form>
        </div>
      ) : blockingReason ? (
        <p className="text-sm text-muted">{blockingReason}</p>
      ) : (
        <BlockDateForm date={day.date} />
      )}
    </section>
  );
}
