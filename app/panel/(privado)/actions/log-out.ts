"use server";

import { redirect } from "next/navigation";
import { endPanelSession } from "@/features/panel-auth/panel-session";
import { PANEL_LOGIN_PATH } from "@/features/panel-auth/session-token";

export async function logOut() {
  await endPanelSession();
  redirect(PANEL_LOGIN_PATH);
}
