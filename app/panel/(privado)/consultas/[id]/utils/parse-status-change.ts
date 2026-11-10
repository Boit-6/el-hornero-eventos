import { z } from "zod";
import type { AgreedMeeting } from "@/features/party-requests/agreed-meeting-schema";
import {
  PARTY_REQUEST_STATUSES,
  type PartyRequestStatus,
} from "@/features/party-requests/party-request-status";
import { readAgreedMeeting } from "./read-agreed-meeting";

const statusSchema = z.enum(PARTY_REQUEST_STATUSES, { error: "Elige un estado." });

type ParsedStatusChange =
  | { ok: true; status: PartyRequestStatus; agreedMeeting?: AgreedMeeting }
  | { ok: false; error: string };

/** "Reunión pactada" exige fecha, hora y modalidad; los demás estados ignoran esos campos. */
export function parseStatusChange(formData: FormData): ParsedStatusChange {
  const status = statusSchema.safeParse(formData.get("status"));
  if (!status.success) return { ok: false, error: status.error.issues[0].message };
  if (status.data !== "reunion-pactada") return { ok: true, status: status.data };

  const meeting = readAgreedMeeting(formData);
  if (!meeting.success) return { ok: false, error: meeting.error.issues[0].message };
  return { ok: true, status: status.data, agreedMeeting: meeting.data };
}
