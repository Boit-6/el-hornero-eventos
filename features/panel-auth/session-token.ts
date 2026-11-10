import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

/**
 * Token de sesión del panel: "<vencimiento>.<id de sesión>.<firma HMAC>". Sin
 * la clave secreta no se puede falsificar; el id permite anular una sesión al
 * cerrarla. Este módulo no usa APIs de Next para que también lo pueda importar
 * `proxy.ts`.
 */

export const PANEL_SESSION_COOKIE = "hornero_panel";
export const PANEL_LOGIN_PATH = "/panel/ingresar";

const MIN_SECRET_LENGTH = 32;
const MIN_PRODUCTION_PASSWORD_LENGTH = 12;

export type PanelSession = { sessionId: string; expiresAt: number };

export function readRequiredEnv(name: "PANEL_PASSWORD" | "PANEL_SESSION_SECRET") {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name} (ver .env.example)`);
  return value;
}

function getSessionSecret() {
  const secret = readRequiredEnv("PANEL_SESSION_SECRET");
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error(`PANEL_SESSION_SECRET debe tener al menos ${MIN_SECRET_LENGTH} caracteres`);
  }
  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

/** Compara en tiempo constante para no filtrar información por la demora. */
export function safeEquals(first: string, second: string) {
  const firstDigest = createHash("sha256").update(first).digest();
  const secondDigest = createHash("sha256").update(second).digest();
  return timingSafeEqual(firstDigest, secondDigest);
}

/** En producción no se acepta una contraseña corta: es la única llave del panel. */
export function readPanelPassword() {
  const password = readRequiredEnv("PANEL_PASSWORD");
  if (process.env.NODE_ENV === "production" && password.length < MIN_PRODUCTION_PASSWORD_LENGTH) {
    throw new Error(`PANEL_PASSWORD debe tener al menos ${MIN_PRODUCTION_PASSWORD_LENGTH} caracteres en producción`);
  }
  return password;
}

export function createSessionToken(expiresAt: number) {
  const payload = `${expiresAt}.${randomUUID()}`;
  return `${payload}.${sign(payload)}`;
}

/** Devuelve la sesión si el token está bien firmado y no venció; si no, `null`. */
export function readSessionToken(token: string | undefined): PanelSession | null {
  if (!token) return null;
  const [expiresAtText, sessionId, signature] = token.split(".");
  if (!expiresAtText || !sessionId || !signature) return null;

  const expiresAt = Number(expiresAtText);
  const isLive = expiresAt > Date.now();
  if (!isLive || !safeEquals(signature, sign(`${expiresAtText}.${sessionId}`))) return null;

  return { sessionId, expiresAt };
}

export function isValidSessionToken(token: string | undefined) {
  return readSessionToken(token) !== null;
}
