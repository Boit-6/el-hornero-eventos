import type { PartyRequestStatus } from "@/features/party-requests/party-request-status";
import type { RequestOrder } from "./request-order";

type ListParams = {
  status: PartyRequestStatus | null;
  query: string;
  order: RequestOrder;
};

/** Link de la lista que conserva estado, búsqueda y orden; omite lo que está en su valor por defecto. */
export function buildListHref({ status, query, order }: ListParams) {
  const params = new URLSearchParams();
  if (status) params.set("estado", status);
  if (query) params.set("q", query);
  if (order !== "recibida") params.set("orden", order);

  const queryString = params.toString();
  return queryString ? `/panel/consultas?${queryString}` : "/panel/consultas";
}
