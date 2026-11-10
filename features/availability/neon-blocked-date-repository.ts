import "server-only";
import { neon } from "@neondatabase/serverless";
import type { BlockedDate, BlockedDateRepository } from "./blocked-date-repository";

type BlockedDateRow = {
  date: string;
  reason: string;
  created_at: string | Date;
};

function toBlockedDate(row: BlockedDateRow): BlockedDate {
  return { date: row.date, reason: row.reason, createdAt: new Date(row.created_at).toISOString() };
}

/** Fechas bloqueadas en Postgres (Neon). La tabla se crea sola en el primer uso. */
export function createNeonBlockedDateRepository(databaseUrl: string): BlockedDateRepository {
  const sql = neon(databaseUrl);
  let tableCreation: Promise<unknown> | null = null;

  function ensureTable() {
    tableCreation ??= sql`
      create table if not exists blocked_dates (
        date text primary key,
        reason text not null,
        created_at timestamptz not null default now()
      )
    `.catch((error: unknown) => {
      tableCreation = null;
      throw error;
    });
    return tableCreation;
  }

  return {
    async listBetween(fromDate, toDate) {
      await ensureTable();
      const rows = await sql`
        select date, reason, created_at from blocked_dates
        where date >= ${fromDate} and date <= ${toDate}
        order by date
      `;
      return (rows as BlockedDateRow[]).map(toBlockedDate);
    },

    async isBlocked(date) {
      await ensureTable();
      const rows = await sql`select 1 from blocked_dates where date = ${date}`;
      return rows.length > 0;
    },

    async block(date, reason) {
      await ensureTable();
      await sql`
        insert into blocked_dates (date, reason) values (${date}, ${reason})
        on conflict (date) do update set reason = excluded.reason
      `;
    },

    async unblock(date) {
      await ensureTable();
      await sql`delete from blocked_dates where date = ${date}`;
    },
  };
}
