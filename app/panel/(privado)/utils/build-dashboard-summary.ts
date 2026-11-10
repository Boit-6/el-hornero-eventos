import { findEventType, findMeetingMode } from "@/features/catalog/party-options";
import type { AgreedMeeting } from "@/features/party-requests/agreed-meeting-schema";
import type { PartyRequestRecord } from "@/features/party-requests/party-request-repository";
import { OPEN_PARTY_REQUEST_STATUSES } from "@/features/party-requests/party-request-status";
import { addDays, daysBetween } from "@/features/utils/calendar-dates";
import { toSalonDate } from "./to-salon-date";

const UPCOMING_MEETINGS_DAYS = 14;
const UPCOMING_PARTIES_DAYS = 90;
const CHART_MONTHS = 6;

export type UpcomingMeeting = {
  request: PartyRequestRecord;
  meeting: AgreedMeeting;
  /** `false` si es solo la propuesta de la persona y el salón todavía no cargó el horario acordado. */
  isAgreed: boolean;
};

export type DashboardSummary = {
  newCount: number;
  /** Días que lleva sin atender la consulta nueva más vieja; `null` si no hay nuevas. */
  oldestNewAgeDays: number | null;
  upcomingMeetings: UpcomingMeeting[];
  upcomingParties: PartyRequestRecord[];
  /** Consultas en curso para una fecha que ya tiene otra fiesta confirmada. */
  dateConflicts: PartyRequestRecord[];
  monthlyRequests: { month: string; count: number }[];
  /** Confirmadas sobre confirmadas + descartadas (0 a 1); `null` si todavía no se cerró ninguna. */
  confirmationRate: number | null;
  requestsByEventType: { label: string; count: number }[];
};

type SummaryInput = {
  requests: PartyRequestRecord[];
  today: string;
};

function isOpen(request: PartyRequestRecord) {
  return OPEN_PARTY_REQUEST_STATUSES.includes(request.status);
}

function meetingOf(request: PartyRequestRecord): UpcomingMeeting | null {
  if (request.agreedMeeting) return { request, meeting: request.agreedMeeting, isAgreed: true };
  if (request.status === "reunion-pactada") return { request, meeting: request.meeting, isAgreed: false };
  return null;
}

function findUpcomingMeetings(requests: PartyRequestRecord[], today: string) {
  const lastDay = addDays(today, UPCOMING_MEETINGS_DAYS);
  return requests
    .filter(isOpen)
    .map(meetingOf)
    .filter((upcoming) => upcoming !== null)
    .filter(({ meeting }) => meeting.date >= today && meeting.date <= lastDay)
    .toSorted((first, second) =>
      `${first.meeting.date} ${first.meeting.time}`.localeCompare(`${second.meeting.date} ${second.meeting.time}`),
    );
}

function findDateConflicts(requests: PartyRequestRecord[]) {
  const confirmedDates = new Set(
    requests.filter((request) => request.status === "confirmada").map((request) => request.eventDate),
  );
  return requests.filter((request) => isOpen(request) && confirmedDates.has(request.eventDate));
}

/** Los últimos meses, del más viejo al actual, con cuántas consultas llegaron en cada uno. */
function countRequestsByMonth(requests: PartyRequestRecord[], today: string) {
  const [year, month] = today.split("-").map(Number);
  const months = Array.from({ length: CHART_MONTHS }, (_, index) => {
    const date = new Date(year, month - 1 - (CHART_MONTHS - 1 - index), 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });
  return months.map((monthKey) => ({
    month: monthKey,
    count: requests.filter((request) => toSalonDate(request.createdAt).startsWith(monthKey)).length,
  }));
}

function countByEventType(requests: PartyRequestRecord[]) {
  const counts = new Map<string, number>();
  for (const request of requests) {
    const label = request.eventType === "otro" ? (request.customEventName ?? "Otro") : (findEventType(request.eventType)?.label ?? "Otro");
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .toSorted((first, second) => second.count - first.count);
}

export function describeMeetingMode(meeting: AgreedMeeting) {
  return findMeetingMode(meeting.mode)?.label ?? meeting.mode;
}

/** Todo lo que muestra el resumen del panel, calculado a partir de las consultas. */
export function buildDashboardSummary({ requests, today }: SummaryInput): DashboardSummary {
  const newRequests = requests.filter((request) => request.status === "nueva");
  const oldestNew = newRequests.toSorted((first, second) => first.createdAt.localeCompare(second.createdAt))[0];

  const lastPartyDay = addDays(today, UPCOMING_PARTIES_DAYS);
  const confirmedCount = requests.filter((request) => request.status === "confirmada").length;
  const discardedCount = requests.filter((request) => request.status === "descartada").length;
  const closedCount = confirmedCount + discardedCount;

  return {
    newCount: newRequests.length,
    oldestNewAgeDays: oldestNew ? Math.max(0, daysBetween(toSalonDate(oldestNew.createdAt), today)) : null,
    upcomingMeetings: findUpcomingMeetings(requests, today),
    upcomingParties: requests
      .filter((request) => request.status === "confirmada" && request.eventDate >= today && request.eventDate <= lastPartyDay)
      .toSorted((first, second) => first.eventDate.localeCompare(second.eventDate)),
    dateConflicts: findDateConflicts(requests),
    monthlyRequests: countRequestsByMonth(requests, today),
    confirmationRate: closedCount > 0 ? confirmedCount / closedCount : null,
    requestsByEventType: countByEventType(requests),
  };
}
