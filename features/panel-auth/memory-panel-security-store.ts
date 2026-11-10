import "server-only";
import type { PanelSecurityStore } from "./panel-security-store";

/** Versión en memoria, para desarrollo sin base de datos: se pierde al reiniciar el servidor. */
export function createMemoryPanelSecurityStore(): PanelSecurityStore {
  const failuresByClient = new Map<string, Date[]>();
  const revokedSessionIds = new Set<string>();

  return {
    async countLoginFailuresSince(clientId, since) {
      const failures = failuresByClient.get(clientId) ?? [];
      return failures.filter((failedAt) => failedAt >= since).length;
    },

    async recordLoginFailure(clientId) {
      failuresByClient.set(clientId, [...(failuresByClient.get(clientId) ?? []), new Date()]);
    },

    async clearLoginFailures(clientId) {
      failuresByClient.delete(clientId);
    },

    async revokeSession(sessionId) {
      revokedSessionIds.add(sessionId);
    },

    async isSessionRevoked(sessionId) {
      return revokedSessionIds.has(sessionId);
    },
  };
}
