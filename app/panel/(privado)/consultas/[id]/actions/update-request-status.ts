"use server";

import { revalidatePath } from "next/cache";
import { requirePanelSession } from "@/features/panel-auth/panel-session";
import { changeRequestStatus } from "@/features/party-requests/change-request-status";
import type { PanelFormState } from "../../../utils/panel-form-state";
import { parseStatusChange } from "../utils/parse-status-change";

/** El id viene ligado desde el servidor (`bind`); el estado y la reunión, del formulario. */
export async function updateRequestStatus(
  requestId: string,
  _previousState: PanelFormState,
  formData: FormData,
): Promise<PanelFormState> {
  await requirePanelSession();

  const change = parseStatusChange(formData);
  if (!change.ok) return { error: change.error };

  const result = await changeRequestStatus(requestId, change.status, change.agreedMeeting);
  if (!result.ok) return { error: result.error };

  revalidatePath("/panel", "layout");
  return { error: null };
}
