import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { activitiesForStatusChange, type PartyRequestActivity, type PartyRequestActivityDetail } from "./party-request-activity";
import type { PartyRequestRecord, PartyRequestRepository } from "./party-request-repository";

/** Cómo queda cada consulta en el archivo: el registro más su historial. */
type StoredRecord = Omit<PartyRequestRecord, "agreedMeeting"> & {
  agreedMeeting?: PartyRequestRecord["agreedMeeting"];
  activity?: PartyRequestActivity[];
};

function toRecord(stored: StoredRecord): PartyRequestRecord {
  // Las consultas guardadas antes del seguimiento no tienen reunión ni historial.
  const record: StoredRecord = { ...stored };
  delete record.activity;
  return { ...record, agreedMeeting: record.agreedMeeting ?? null };
}

function appendActivity(stored: StoredRecord, details: PartyRequestActivityDetail[]) {
  const createdAt = new Date().toISOString();
  stored.activity = [
    ...(stored.activity ?? []),
    ...details.map((detail) => ({ id: randomUUID(), createdAt, ...detail })),
  ];
}

/**
 * Base de datos simulada: guarda las consultas en un archivo JSON.
 * Sirve solo para desarrollo: en Vercel el disco es de solo lectura, y ahí se
 * usa la base real (ver `neon-party-request-repository.ts`).
 */
export function createJsonFilePartyRequestRepository(filePath: string): PartyRequestRepository {
  // Las escrituras se encadenan para que dos consultas simultáneas no se pisen.
  let pendingWrite: Promise<unknown> = Promise.resolve();

  async function readAll(): Promise<StoredRecord[]> {
    try {
      return JSON.parse(await readFile(filePath, "utf8"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  function modifyAll<Result>(change: (records: StoredRecord[]) => Result) {
    const write = pendingWrite.then(async () => {
      const records = await readAll();
      const result = change(records);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, JSON.stringify(records, null, 2));
      return result;
    });
    pendingWrite = write.catch(() => undefined);
    return write;
  }

  return {
    create(input) {
      const record: PartyRequestRecord = {
        ...input,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        status: "nueva",
        agreedMeeting: null,
      };
      return modifyAll((records) => {
        records.push(record);
        return record;
      });
    },

    async findById(id) {
      const records = await readAll();
      const stored = records.find((record) => record.id === id);
      return stored ? toRecord(stored) : null;
    },

    async listNewestFirst() {
      const records = await readAll();
      return records
        .map(toRecord)
        .toSorted((first, second) => second.createdAt.localeCompare(first.createdAt));
    },

    async hasConfirmedRequestOn(eventDate) {
      const records = await readAll();
      return records.some((record) => record.status === "confirmada" && record.eventDate === eventDate);
    },

    updateStatus(id, status, agreedMeeting) {
      return modifyAll((records) => {
        const stored = records.find((candidate) => candidate.id === id);
        if (!stored) return null;

        const details = activitiesForStatusChange(
          { status: stored.status, agreedMeeting: stored.agreedMeeting ?? null },
          status,
          agreedMeeting,
        );
        stored.status = status;
        if (agreedMeeting) stored.agreedMeeting = agreedMeeting;
        appendActivity(stored, details);
        return toRecord(stored);
      });
    },

    setAgreedMeeting(id, meeting) {
      return modifyAll((records) => {
        const stored = records.find((candidate) => candidate.id === id);
        if (!stored) return null;

        const details = activitiesForStatusChange(
          { status: stored.status, agreedMeeting: stored.agreedMeeting ?? null },
          stored.status,
          meeting,
        );
        stored.agreedMeeting = meeting;
        appendActivity(stored, details);
        return toRecord(stored);
      });
    },

    addNote(id, note) {
      return modifyAll((records) => {
        const stored = records.find((candidate) => candidate.id === id);
        if (!stored) return false;

        appendActivity(stored, [{ kind: "note", note }]);
        return true;
      });
    },

    async listActivity(id) {
      const records = await readAll();
      const activity = records.find((record) => record.id === id)?.activity ?? [];
      // Mismo instante → se conserva el orden de carga, lo último primero.
      return activity.toReversed().toSorted((first, second) => second.createdAt.localeCompare(first.createdAt));
    },
  };
}
