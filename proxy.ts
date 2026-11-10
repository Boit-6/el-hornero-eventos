import { NextResponse, type NextRequest } from "next/server";
import {
  isValidSessionToken,
  PANEL_LOGIN_PATH,
  PANEL_SESSION_COOKIE,
} from "@/features/panel-auth/session-token";

/**
 * Chequeo rápido del panel: sin cookie válida, redirige al login.
 * Es solo la primera barrera; cada página y acción del panel vuelve a verificar.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === PANEL_LOGIN_PATH) return NextResponse.next();

  const token = request.cookies.get(PANEL_SESSION_COOKIE)?.value;
  if (isValidSessionToken(token)) return NextResponse.next();

  return NextResponse.redirect(new URL(PANEL_LOGIN_PATH, request.url));
}

export const config = {
  matcher: ["/panel/:path*"],
};
