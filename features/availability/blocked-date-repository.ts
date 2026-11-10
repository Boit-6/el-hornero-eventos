import "server-only";
import path from "node:path";
import { createJsonFileBlockedDateRepository } from "./json-file-blocked-date-repository";
import { createNeonBlockedDateRepository } from "./neon-blocked-date-repository";

/** Día que el salón marcó como no disponible, por ejemplo por un feriado o un evento externo. */
export type BlockedDate = {
  date: string;
  reason: string;
  createdAt: string;
};

/**
 * Contrato de persistencia de las fechas bloqueadas. Igual que las consultas:
 * Postgres (Neon) con `DATABASE_URL`, archivo JSON local solo para desarrollo.
 */
export type BlockedDateRepository = {
  /** Bloqueos entre dos fechas ISO, ambas incluidas, ordenados por fecha. */
  listBetween(fromDate: string, toDate: string): Promise<BlockedDate[]>;
  isBlocked(date: string): Promise<boolean>;
  block(date: string, reason: string): Promise<void>;
  unblock(date: string): Promise<void>;
};

const databaseUrl = process.env.DATABASE_URL;

export const blockedDateRepository: BlockedDateRepository = databaseUrl
  ? createNeonBlockedDateRepository(databaseUrl)
  : createJsonFileBlockedDateRepository(path.join(process.cwd(), ".data", "blocked-dates.json"));
