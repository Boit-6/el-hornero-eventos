import "server-only";
import { neon } from "@neondatabase/serverless";
import type { PanelSecurityStore } from "./panel-security-store";

export function createNeonPanelSecurityStore(databaseUrl: string): PanelSecurityStore {
  const sql = neon(databaseUrl);
  let tablesCreation: Promise<unknown> | null = null;

  // Las tablas se crean solas en el primer uso, igual que la de consultas.
  function ensureTables() {
    tablesCreation ??= Promise.all([
      sql`
        create table if not exists panel_login_failures (
          client_id text not null,
          failed_at timestamptz not null default now()
        )
      `,
      sql`
        create table if not exists panel_revoked_sessions (
          session_id text primary key,
          expires_at timestamptz not null
        )
      `,
    ]).catch((error: unknown) => {
      tablesCreation = null;
      throw error;
    });
    return tablesCreation;
  }

  return {
    async countLoginFailuresSince(clientId, since) {
      await ensureTables();
      const rows = await sql`
        select count(*)::int as failures from panel_login_failures
        where client_id = ${clientId} and failed_at >= ${since.toISOString()}
      `;
      return rows[0].failures as number;
    },

    async recordLoginFailure(clientId) {
      await ensureTables();
      await sql`insert into panel_login_failures (client_id) values (${clientId})`;
      // De paso se descartan los intentos viejos, que ya no cuentan para ningún bloqueo.
      await sql`delete from panel_login_failures where failed_at < now() - interval '1 day'`;
    },

    async clearLoginFailures(clientId) {
      await ensureTables();
      await sql`delete from panel_login_failures where client_id = ${clientId}`;
    },

    async revokeSession(sessionId, expiresAt) {
      await ensureTables();
      await sql`
        insert into panel_revoked_sessions (session_id, expires_at)
        values (${sessionId}, ${expiresAt.toISOString()})
        on conflict (session_id) do nothing
      `;
      // Una sesión vencida ya no pasa la verificación de firma: no hace falta recordarla.
      await sql`delete from panel_revoked_sessions where expires_at < now()`;
    },

    async isSessionRevoked(sessionId) {
      await ensureTables();
      const rows = await sql`select 1 from panel_revoked_sessions where session_id = ${sessionId}`;
      return rows.length > 0;
    },
  };
}
