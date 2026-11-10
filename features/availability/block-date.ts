import "server-only";
import { partyRequestRepository } from "@/features/party-requests/party-request-repository";
import { addDaysFromToday } from "@/features/utils/calendar-dates";
import { blockedDateRepository } from "./blocked-date-repository";
import { findRequestsPreventingBlock } from "./find-requests-preventing-block";

export type BlockDateResult = { ok: true } | { ok: false; error: string };

/** Bloquea una fecha para la web pública, salvo que ya haya consultas apoyadas en ella. */
export async function blockDate(date: string, reason: string): Promise<BlockDateResult> {
  if (date < addDaysFromToday(0)) {
    return { ok: false, error: "No se puede bloquear un día que ya pasó." };
  }

  const requests = await partyRequestRepository.listNewestFirst();
  if (findRequestsPreventingBlock(requests, date).length > 0) {
    return {
      ok: false,
      error: "Hay consultas para esa fecha. Descártalas o cámbialas de fecha antes de bloquearla.",
    };
  }

  await blockedDateRepository.block(date, reason);
  return { ok: true };
}
