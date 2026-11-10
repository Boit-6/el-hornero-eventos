import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BlockedDate, BlockedDateRepository } from "./blocked-date-repository";

/** Fechas bloqueadas en un archivo JSON. Solo para desarrollo, como las consultas. */
export function createJsonFileBlockedDateRepository(filePath: string): BlockedDateRepository {
  // Las escrituras se encadenan para que dos cambios simultáneos no se pisen.
  let pendingWrite: Promise<unknown> = Promise.resolve();

  async function readAll(): Promise<BlockedDate[]> {
    try {
      return JSON.parse(await readFile(filePath, "utf8"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  function modifyAll(change: (blockedDates: BlockedDate[]) => BlockedDate[]) {
    const write = pendingWrite.then(async () => {
      const updated = change(await readAll());
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, JSON.stringify(updated, null, 2));
    });
    pendingWrite = write.catch(() => undefined);
    return write;
  }

  return {
    async listBetween(fromDate, toDate) {
      const blockedDates = await readAll();
      return blockedDates
        .filter(({ date }) => date >= fromDate && date <= toDate)
        .toSorted((first, second) => first.date.localeCompare(second.date));
    },

    async isBlocked(date) {
      const blockedDates = await readAll();
      return blockedDates.some((blocked) => blocked.date === date);
    },

    block(date, reason) {
      return modifyAll((blockedDates) => [
        ...blockedDates.filter((blocked) => blocked.date !== date),
        { date, reason, createdAt: new Date().toISOString() },
      ]);
    },

    unblock(date) {
      return modifyAll((blockedDates) => blockedDates.filter((blocked) => blocked.date !== date));
    },
  };
}
