import { findMeetingMode } from "@/features/catalog/party-options";
import type { PartyRequestActivity } from "@/features/party-requests/party-request-activity";
import { PARTY_REQUEST_STATUS_LABELS } from "@/features/party-requests/party-request-status";
import { formatLongDate } from "@/features/utils/calendar-dates";
import { formatCreatedAt } from "../../../utils/format-created-at";

type ActivityTimelineProps = {
  activity: PartyRequestActivity[];
  receivedAt: string;
};

function describeActivity(entry: PartyRequestActivity) {
  switch (entry.kind) {
    case "status":
      return `Estado: ${PARTY_REQUEST_STATUS_LABELS[entry.status]}`;
    case "meeting": {
      const { date, time, mode } = entry.meeting;
      return `Reunión acordada: ${formatLongDate(date)}, ${time} h · ${findMeetingMode(mode)?.label ?? mode}`;
    }
    case "note":
      return entry.note;
  }
}

/** Línea de tiempo de la consulta, lo más nuevo arriba y la recepción al final. */
export function ActivityTimeline({ activity, receivedAt }: ActivityTimelineProps) {
  const entries = [
    ...activity.map((entry) => ({ id: entry.id, createdAt: entry.createdAt, text: describeActivity(entry), isNote: entry.kind === "note" })),
    { id: "received", createdAt: receivedAt, text: "Consulta recibida", isNote: false },
  ];

  return (
    <section aria-labelledby="timeline-title" className="rounded-2xl border border-line bg-night p-5">
      <h2 id="timeline-title" className="font-semibold">
        Historial
      </h2>
      <ol className="mt-3 space-y-4">
        {entries.map((entry) => (
          <li key={entry.id} className="border-l-2 border-line pl-3">
            <p className="text-xs text-muted tabular-nums">{formatCreatedAt(entry.createdAt)}</p>
            <p className={entry.isNote ? "mt-1 whitespace-pre-wrap break-words" : "mt-1"}>{entry.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
