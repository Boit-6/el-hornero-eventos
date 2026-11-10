import type { AgreedMeeting } from "./agreed-meeting-schema";
import type { PartyRequestStatus } from "./party-request-status";

/** Qué pasó en la consulta: un cambio de estado, una nota o una reunión acordada. */
export type PartyRequestActivityDetail =
  | { kind: "status"; status: PartyRequestStatus }
  | { kind: "note"; note: string }
  | { kind: "meeting"; meeting: AgreedMeeting };

export type PartyRequestActivity = { id: string; createdAt: string } & PartyRequestActivityDetail;

type RequestSnapshot = { status: PartyRequestStatus; agreedMeeting: AgreedMeeting | null };

function isSameMeeting(first: AgreedMeeting | null, second: AgreedMeeting) {
  return first?.date === second.date && first.time === second.time && first.mode === second.mode;
}

/** Lo que hay que anotar en el historial al cambiar el estado (y, si viene, la reunión). */
export function activitiesForStatusChange(
  previous: RequestSnapshot,
  status: PartyRequestStatus,
  agreedMeeting?: AgreedMeeting,
): PartyRequestActivityDetail[] {
  const activities: PartyRequestActivityDetail[] = [];
  if (previous.status !== status) activities.push({ kind: "status", status });
  if (agreedMeeting && !isSameMeeting(previous.agreedMeeting, agreedMeeting)) {
    activities.push({ kind: "meeting", meeting: agreedMeeting });
  }
  return activities;
}
