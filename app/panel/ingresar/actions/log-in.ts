"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { panelSecurityStore } from "@/features/panel-auth/panel-security-store";
import { isPanelPassword, startPanelSession } from "@/features/panel-auth/panel-session";

export type LogInState = { error: string | null };

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const UNKNOWN_CLIENT = "desconocido";

/** La IP de quien intenta ingresar; en Vercel la informa la plataforma en estas cabeceras. */
async function readClientId() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  return requestHeaders.get("x-real-ip") ?? forwardedFor ?? UNKNOWN_CLIENT;
}

export async function logIn(_previousState: LogInState, formData: FormData): Promise<LogInState> {
  const clientId = await readClientId();
  const lockoutStart = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000);
  const recentFailures = await panelSecurityStore.countLoginFailuresSince(clientId, lockoutStart);
  if (recentFailures >= MAX_FAILED_ATTEMPTS) {
    return { error: `Demasiados intentos fallidos. Prueba de nuevo en ${LOCKOUT_MINUTES} minutos.` };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !isPanelPassword(password)) {
    await panelSecurityStore.recordLoginFailure(clientId);
    return { error: "Contraseña incorrecta." };
  }

  await panelSecurityStore.clearLoginFailures(clientId);
  await startPanelSession();
  redirect("/panel");
}
