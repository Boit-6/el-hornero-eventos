import "server-only";
import { createMemoryPanelSecurityStore } from "./memory-panel-security-store";
import { createNeonPanelSecurityStore } from "./neon-panel-security-store";

/**
 * Lo que el panel necesita recordar entre pedidos para defenderse: los
 * intentos fallidos de ingreso (para frenar el tanteo de contraseñas) y las
 * sesiones cerradas (para que un token copiado deje de servir al salir).
 */
export type PanelSecurityStore = {
  countLoginFailuresSince(clientId: string, since: Date): Promise<number>;
  recordLoginFailure(clientId: string): Promise<void>;
  clearLoginFailures(clientId: string): Promise<void>;
  revokeSession(sessionId: string, expiresAt: Date): Promise<void>;
  isSessionRevoked(sessionId: string): Promise<boolean>;
};

const databaseUrl = process.env.DATABASE_URL;

// En Vercel cada pedido puede caer en una instancia distinta: solo la base comparte el estado.
export const panelSecurityStore: PanelSecurityStore = databaseUrl
  ? createNeonPanelSecurityStore(databaseUrl)
  : createMemoryPanelSecurityStore();
