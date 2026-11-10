import "server-only";
import path from "node:path";
import type { AgreedMeeting } from "./agreed-meeting-schema";
import { createJsonFilePartyRequestRepository } from "./json-file-party-request-repository";
import { createNeonPartyRequestRepository } from "./neon-party-request-repository";
import type { PartyRequestActivity } from "./party-request-activity";
import type { PartyRequestInput } from "./party-request-schema";
import type { PartyRequestStatus } from "./party-request-status";

export type PartyRequestRecord = PartyRequestInput & {
  id: string;
  createdAt: string;
  status: PartyRequestStatus;
  /** Reunión que acordó el salón; `null` mientras solo existe la propuesta de la persona. */
  agreedMeeting: AgreedMeeting | null;
};

/**
 * Contrato de persistencia de las consultas. Con `DATABASE_URL` se guardan en
 * Postgres (Neon); sin ella, en un archivo JSON local que solo sirve para
 * desarrollo, porque en Vercel el disco es de solo lectura.
 */
export type PartyRequestRepository = {
  create(input: PartyRequestInput): Promise<PartyRequestRecord>;
  findById(id: string): Promise<PartyRequestRecord | null>;
  listNewestFirst(): Promise<PartyRequestRecord[]>;
  /** Cambia el estado y, si viene, la reunión acordada; ambos quedan en el historial. */
  updateStatus(
    id: string,
    status: PartyRequestStatus,
    agreedMeeting?: AgreedMeeting,
  ): Promise<PartyRequestRecord | null>;
  setAgreedMeeting(id: string, meeting: AgreedMeeting): Promise<PartyRequestRecord | null>;
  addNote(id: string, note: string): Promise<boolean>;
  /** Historial de la consulta, lo más nuevo primero. */
  listActivity(id: string): Promise<PartyRequestActivity[]>;
  hasConfirmedRequestOn(eventDate: string): Promise<boolean>;
};

const databaseUrl = process.env.DATABASE_URL;

export const partyRequestRepository: PartyRequestRepository = databaseUrl
  ? createNeonPartyRequestRepository(databaseUrl)
  : createJsonFilePartyRequestRepository(path.join(process.cwd(), ".data", "party-requests.json"));
