import "server-only";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import type { AgreedMeeting } from "./agreed-meeting-schema";
import {
  activitiesForStatusChange,
  type PartyRequestActivity,
  type PartyRequestActivityDetail,
} from "./party-request-activity";
import type { PartyRequestRecord, PartyRequestRepository } from "./party-request-repository";
import type { PartyRequestInput } from "./party-request-schema";
import type { PartyRequestStatus } from "./party-request-status";

type PartyRequestRow = {
  id: string;
  created_at: string | Date;
  status: PartyRequestStatus;
  request: PartyRequestInput;
  agreed_meeting: AgreedMeeting | null;
};

type ActivityRow = {
  id: string;
  created_at: string | Date;
  kind: PartyRequestActivityDetail["kind"];
  payload: Omit<PartyRequestActivityDetail, "kind">;
};

function toRecord(row: PartyRequestRow): PartyRequestRecord {
  return {
    ...row.request,
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    status: row.status,
    agreedMeeting: row.agreed_meeting,
  };
}

function toActivity(row: ActivityRow): PartyRequestActivity {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    kind: row.kind,
    ...row.payload,
  } as PartyRequestActivity;
}

/**
 * Consultas guardadas en Postgres (Neon). Lo que armó la persona va completo
 * en una columna JSON; el estado, la reunión acordada y la fecha de alta van
 * aparte porque son los datos que maneja el salón desde el panel. El historial
 * (cambios de estado, reuniones y notas) vive en su propia tabla.
 */
export function createNeonPartyRequestRepository(databaseUrl: string): PartyRequestRepository {
  const sql = neon(databaseUrl);
  let tablesCreation: Promise<unknown> | null = null;

  // Las tablas se crean solas en el primer uso, así no hace falta un paso de migración al publicar.
  function ensureTables() {
    tablesCreation ??= (async () => {
      await sql`
        create table if not exists party_requests (
          id text primary key,
          created_at timestamptz not null,
          status text not null,
          request jsonb not null
        )
      `;
      await sql`alter table party_requests add column if not exists agreed_meeting jsonb`;
      await sql`
        create table if not exists party_request_activity (
          id text primary key,
          request_id text not null references party_requests(id),
          created_at timestamptz not null default now(),
          kind text not null,
          payload jsonb not null
        )
      `;
      await sql`
        create index if not exists party_request_activity_request_idx
        on party_request_activity (request_id, created_at)
      `;
    })().catch((error: unknown) => {
      tablesCreation = null;
      throw error;
    });
    return tablesCreation;
  }

  function insertActivity(requestId: string, detail: PartyRequestActivityDetail) {
    const { kind, ...payload } = detail;
    return sql`
      insert into party_request_activity (id, request_id, kind, payload)
      values (${randomUUID()}, ${requestId}, ${kind}, ${JSON.stringify(payload)}::jsonb)
    `;
  }

  async function findById(id: string) {
    await ensureTables();
    const rows = await sql`
      select id, created_at, status, request, agreed_meeting from party_requests where id = ${id}
    `;
    return rows.length > 0 ? toRecord(rows[0] as PartyRequestRow) : null;
  }

  /** Guarda estado y/o reunión y anota el historial en una sola transacción. */
  async function saveChange(
    id: string,
    status: PartyRequestStatus,
    agreedMeeting: AgreedMeeting | undefined,
  ) {
    const current = await findById(id);
    if (!current) return null;

    const details = activitiesForStatusChange(current, status, agreedMeeting);
    const meetingJson = JSON.stringify(agreedMeeting ?? current.agreedMeeting);
    await sql.transaction([
      sql`
        update party_requests
        set status = ${status}, agreed_meeting = ${meetingJson}::jsonb
        where id = ${id}
      `,
      ...details.map((detail) => insertActivity(id, detail)),
    ]);
    return findById(id);
  }

  return {
    async create(input) {
      await ensureTables();
      const rows = await sql`
        insert into party_requests (id, created_at, status, request)
        values (${randomUUID()}, now(), 'nueva', ${JSON.stringify(input)}::jsonb)
        returning id, created_at, status, request, agreed_meeting
      `;
      return toRecord(rows[0] as PartyRequestRow);
    },

    findById,

    async listNewestFirst() {
      await ensureTables();
      const rows = await sql`
        select id, created_at, status, request, agreed_meeting
        from party_requests order by created_at desc
      `;
      return (rows as PartyRequestRow[]).map(toRecord);
    },

    async hasConfirmedRequestOn(eventDate) {
      await ensureTables();
      const rows = await sql`
        select 1 from party_requests
        where status = 'confirmada' and request->>'eventDate' = ${eventDate}
        limit 1
      `;
      return rows.length > 0;
    },

    updateStatus(id, status, agreedMeeting) {
      return saveChange(id, status, agreedMeeting);
    },

    async setAgreedMeeting(id, meeting) {
      const current = await findById(id);
      return current ? saveChange(id, current.status, meeting) : null;
    },

    async addNote(id, note) {
      if (!(await findById(id))) return false;
      await insertActivity(id, { kind: "note", note });
      return true;
    },

    async listActivity(id) {
      await ensureTables();
      const rows = await sql`
        select id, created_at, kind, payload from party_request_activity
        where request_id = ${id} order by created_at desc
      `;
      return (rows as ActivityRow[]).map(toActivity);
    },
  };
}
