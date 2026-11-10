import Link from "next/link";
import { findEventType, findServiceStyle } from "@/features/catalog/party-options";
import { requirePanelSession } from "@/features/panel-auth/panel-session";
import { partyRequestRepository } from "@/features/party-requests/party-request-repository";
import {
  PARTY_REQUEST_STATUS_LABELS,
  PARTY_REQUEST_STATUSES,
  type PartyRequestStatus,
} from "@/features/party-requests/party-request-status";
import { formatLongDate } from "@/features/utils/calendar-dates";
import { StatusBadge } from "../components/status-badge";
import { formatCreatedAt } from "../utils/format-created-at";
import { PANEL_FIELD_CLASS } from "../utils/panel-field-class";
import { buildListHref } from "./utils/build-list-href";
import { filterRequests } from "./utils/filter-requests";
import { REQUEST_ORDER_LABELS, REQUEST_ORDERS, sortRequests, type RequestOrder } from "./utils/request-order";

const MAX_QUERY_LENGTH = 80;
const CHIP_CLASS =
  "inline-flex min-h-11 items-center rounded-full border border-line bg-night px-4 text-sm aria-[current=page]:border-gold aria-[current=page]:font-semibold";

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseStatusFilter(value: string | string[] | undefined): PartyRequestStatus | null {
  return PARTY_REQUEST_STATUSES.find((status) => status === firstValue(value)) ?? null;
}

function parseOrder(value: string | string[] | undefined): RequestOrder {
  return REQUEST_ORDERS.find((order) => order === firstValue(value)) ?? "recibida";
}

function parseQuery(value: string | string[] | undefined) {
  return (firstValue(value) ?? "").trim().slice(0, MAX_QUERY_LENGTH);
}

export default async function PanelRequestsPage({ searchParams }: PageProps<"/panel/consultas">) {
  await requirePanelSession();

  const params = await searchParams;
  const statusFilter = parseStatusFilter(params.estado);
  const query = parseQuery(params.q);
  const order = parseOrder(params.orden);

  const allRequests = await partyRequestRepository.listNewestFirst();
  // Los contadores de los chips respetan la búsqueda, para que sumen lo que se va a ver.
  const matchingQuery = filterRequests(allRequests, { status: null, query });
  const requests = sortRequests(filterRequests(matchingQuery, { status: statusFilter, query: "" }), order);

  const countByStatus = (status: PartyRequestStatus) =>
    matchingQuery.filter((request) => request.status === status).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Consultas</h1>
        <p className="mt-2 text-muted">Fiestas armadas desde la web. Ninguna está reservada hasta que la confirmes.</p>
      </div>

      <form action="/panel/consultas" className="flex flex-wrap items-end gap-3">
        {statusFilter && <input type="hidden" name="estado" value={statusFilter} />}
        <div className="min-w-56 flex-1">
          <label htmlFor="q" className="mb-1 block text-sm text-muted">
            Buscar por nombre, teléfono o evento
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query}
            maxLength={MAX_QUERY_LENGTH}
            className={PANEL_FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="orden" className="mb-1 block text-sm text-muted">
            Orden
          </label>
          <select id="orden" name="orden" defaultValue={order} className={PANEL_FIELD_CLASS}>
            {REQUEST_ORDERS.map((option) => (
              <option key={option} value={option}>
                {REQUEST_ORDER_LABELS[option]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="min-h-11 rounded-full bg-gold px-5 text-sm font-semibold text-night hover:bg-gold-bright active:scale-[0.97]"
        >
          Buscar
        </button>
      </form>

      <nav aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
        <Link
          href={buildListHref({ status: null, query, order })}
          aria-current={statusFilter ? undefined : "page"}
          className={CHIP_CLASS}
        >
          <span>
            Todas <span className="tabular-nums text-muted">({matchingQuery.length})</span>
          </span>
        </Link>
        {PARTY_REQUEST_STATUSES.map((status) => (
          <Link
            key={status}
            href={buildListHref({ status, query, order })}
            aria-current={statusFilter === status ? "page" : undefined}
            className={CHIP_CLASS}
          >
            <span>
              {PARTY_REQUEST_STATUS_LABELS[status]}{" "}
              <span className="tabular-nums text-muted">({countByStatus(status)})</span>
            </span>
          </Link>
        ))}
      </nav>

      {requests.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-night p-10 text-center text-muted">
          {query || statusFilter
            ? "No hay consultas que coincidan con la búsqueda."
            : "Todavía no hay consultas."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-night">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Recibida</th>
                <th className="px-4 py-3 font-semibold">Contacto</th>
                <th className="px-4 py-3 font-semibold">Evento</th>
                <th className="px-4 py-3 font-semibold">Fecha deseada</th>
                <th className="px-4 py-3 text-right font-semibold">Invitados</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-coal/60">
                  <td className="px-4 py-3 whitespace-nowrap text-muted tabular-nums">{formatCreatedAt(request.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/panel/consultas/${request.id}`} className="font-semibold underline-offset-4 hover:underline">
                      {request.contact.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {request.eventType === "otro" ? request.customEventName : findEventType(request.eventType)?.label}
                    <span className="text-muted"> · {findServiceStyle(request.serviceStyle)?.label}</span>
                  </td>
                  <td className="px-4 py-3">{formatLongDate(request.eventDate)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{request.guestCount}</td>
                  <td className="px-4 py-3"><StatusBadge status={request.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
