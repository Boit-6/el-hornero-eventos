import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { panelSecurityStore } from "./panel-security-store";
import {
  createSessionToken,
  PANEL_LOGIN_PATH,
  PANEL_SESSION_COOKIE,
  readPanelPassword,
  readSessionToken,
  safeEquals,
} from "./session-token";

/**
 * Sesión del panel del salón. Hay un único usuario (el salón), así que alcanza
 * con una contraseña en variables de entorno y una cookie firmada.
 */

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export function isPanelPassword(candidate: string) {
  return safeEquals(candidate, readPanelPassword());
}

export async function startPanelSession() {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const cookieStore = await cookies();
  cookieStore.set(PANEL_SESSION_COOKIE, createSessionToken(expiresAt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/panel",
    expires: new Date(expiresAt),
  });
}

/** Además de borrar la cookie, anula la sesión: una copia del token deja de servir. */
export async function endPanelSession() {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(PANEL_SESSION_COOKIE)?.value);
  if (session) await panelSecurityStore.revokeSession(session.sessionId, new Date(session.expiresAt));
  cookieStore.delete({ name: PANEL_SESSION_COOKIE, path: "/panel" });
}

/** Para páginas y acciones del panel: corta y redirige si no hay sesión válida. */
export async function requirePanelSession() {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(PANEL_SESSION_COOKIE)?.value);
  if (!session || (await panelSecurityStore.isSessionRevoked(session.sessionId))) {
    redirect(PANEL_LOGIN_PATH);
  }
}
