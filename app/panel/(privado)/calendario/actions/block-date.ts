"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { blockDate } from "@/features/availability/block-date";
import { blockReasonSchema } from "@/features/availability/blocked-date-schema";
import { requirePanelSession } from "@/features/panel-auth/panel-session";
import type { PanelFormState } from "../../utils/panel-form-state";

const dateSchema = z.iso.date({ error: "La fecha no es válida." });

export async function blockDateAction(_previousState: PanelFormState, formData: FormData): Promise<PanelFormState> {
  await requirePanelSession();

  const date = dateSchema.safeParse(formData.get("date"));
  if (!date.success) return { error: date.error.issues[0].message };
  const reason = blockReasonSchema.safeParse(formData.get("reason") ?? "");
  if (!reason.success) return { error: reason.error.issues[0].message };

  const result = await blockDate(date.data, reason.data);
  if (!result.ok) return { error: result.error };

  revalidatePath("/panel", "layout");
  return { error: null };
}
