"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { blockedDateRepository } from "@/features/availability/blocked-date-repository";
import { requirePanelSession } from "@/features/panel-auth/panel-session";

const dateSchema = z.iso.date();

export async function unblockDate(formData: FormData) {
  await requirePanelSession();

  const date = dateSchema.safeParse(formData.get("date"));
  if (!date.success) return;

  await blockedDateRepository.unblock(date.data);
  revalidatePath("/panel", "layout");
}
