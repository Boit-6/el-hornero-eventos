"use server";

import { revalidatePath } from "next/cache";
import { requirePanelSession } from "@/features/panel-auth/panel-session";
import { internalNoteSchema } from "@/features/party-requests/internal-note-schema";
import { partyRequestRepository } from "@/features/party-requests/party-request-repository";
import type { PanelFormState } from "../../../utils/panel-form-state";

export async function addNote(
  requestId: string,
  _previousState: PanelFormState,
  formData: FormData,
): Promise<PanelFormState> {
  await requirePanelSession();

  const note = internalNoteSchema.safeParse(formData.get("note"));
  if (!note.success) return { error: note.error.issues[0].message };

  const wasSaved = await partyRequestRepository.addNote(requestId, note.data);
  if (!wasSaved) return { error: "La consulta ya no existe." };

  revalidatePath(`/panel/consultas/${requestId}`);
  return { error: null };
}
