import type { PartyRequestRecord } from "@/features/party-requests/party-request-repository";

export const REQUEST_ORDERS = ["recibida", "evento"] as const;
export type RequestOrder = (typeof REQUEST_ORDERS)[number];

export const REQUEST_ORDER_LABELS: Record<RequestOrder, string> = {
  recibida: "Más recientes primero",
  evento: "Fecha del evento (próximas primero)",
};

/** `recibida` conserva el orden de llegada que entrega el repositorio; `evento` ordena por la fecha de la fiesta. */
export function sortRequests(requests: PartyRequestRecord[], order: RequestOrder) {
  if (order === "recibida") return requests;
  return requests.toSorted((first, second) => first.eventDate.localeCompare(second.eventDate));
}
