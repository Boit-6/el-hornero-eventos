import type { PartyRequestRecord } from "@/features/party-requests/party-request-repository";
import { OPEN_PARTY_REQUEST_STATUSES } from "@/features/party-requests/party-request-status";

/**
 * Consultas de esa fecha que impiden bloquearla: las que están en curso y la
 * confirmada. Primero hay que descartarlas o moverlas.
 */
export function findRequestsPreventingBlock(requests: PartyRequestRecord[], date: string) {
  return requests.filter(
    (request) =>
      request.eventDate === date &&
      (request.status === "confirmada" || OPEN_PARTY_REQUEST_STATUSES.includes(request.status)),
  );
}
