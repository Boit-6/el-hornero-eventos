import type { PartyRequestRecord } from "@/features/party-requests/party-request-repository";
import type { PartyRequestStatus } from "@/features/party-requests/party-request-status";

type RequestFilters = {
  status: PartyRequestStatus | null;
  query: string;
};

/** Minúsculas y sin tildes, para que "mar" encuentre "María". */
function normalizeText(text: string) {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function onlyDigits(text: string) {
  return text.replace(/\D/g, "");
}

function matchesQuery(request: PartyRequestRecord, query: string) {
  const text = normalizeText(query);
  const digits = onlyDigits(query);

  const searchableText = normalizeText(`${request.contact.name} ${request.customEventName ?? ""}`);
  const matchesText = searchableText.includes(text);
  const matchesPhone = digits.length > 0 && onlyDigits(request.contact.phone).includes(digits);
  return matchesText || matchesPhone;
}

/** Aplica el estado elegido y la búsqueda por nombre, teléfono o nombre del evento. */
export function filterRequests(requests: PartyRequestRecord[], { status, query }: RequestFilters) {
  const trimmedQuery = query.trim();
  return requests.filter(
    (request) =>
      (!status || request.status === status) && (!trimmedQuery || matchesQuery(request, trimmedQuery)),
  );
}
