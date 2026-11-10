import {
  findEventShift,
  findEventType,
  findMeetingMode,
  findSeatedProposal,
  findServiceStyle,
  LUNCH_MENU,
} from "@/features/catalog/party-options";
import { SALON } from "@/features/catalog/salon";
import { formatLongDate } from "@/features/utils/calendar-dates";
import type { PartyRequestInput } from "./party-request-schema";

export type SummaryRow = { label: string; value: string };

export type SummarySection = { title: string; rows: SummaryRow[] };

function describeEventName(request: PartyRequestInput) {
  if (request.eventType === "otro") return request.customEventName;
  return findEventType(request.eventType)?.label ?? "";
}

function describeGuests(request: PartyRequestInput) {
  const { minAdultsWithoutSurcharge } = SALON.capacity;
  const hasSurcharge = request.guestCount < minAdultsWithoutSurcharge;
  return hasSurcharge
    ? `${request.guestCount} (menos de ${minAdultsWithoutSurcharge} adultos: se cobra adicional)`
    : String(request.guestCount);
}

function describeMenu(request: PartyRequestInput): SummaryRow[] {
  if (request.serviceStyle === "lunch") {
    return [{ label: "Menú", value: `${LUNCH_MENU.name} (opción 1): recepción e islas` }];
  }

  const { proposal: proposalId, main, dessert } = request.seatedMenu;
  const proposal = proposalId ? findSeatedProposal(proposalId) : undefined;
  const hasSingleMain = proposal?.mains.length === 1;
  return [
    { label: "Propuesta", value: proposal?.label ?? "-" },
    { label: "Plato principal", value: (hasSingleMain ? proposal?.mains[0] : main) ?? "-" },
    { label: "Postre", value: dessert ?? "-" },
  ];
}

/**
 * Traduce una solicitud ya validada a secciones legibles. Es la única fuente
 * para el resumen en pantalla, el mensaje de WhatsApp, el PDF y el panel.
 */
export function describePartyRequest(request: PartyRequestInput): SummarySection[] {
  const serviceLabel = findServiceStyle(request.serviceStyle)?.label.toLowerCase() ?? "";
  const shiftLabel = findEventShift(request.eventShift)?.label.toLowerCase() ?? "";

  return [
    {
      title: "Evento",
      rows: [
        { label: "Tipo", value: describeEventName(request) },
        { label: "Invitados", value: describeGuests(request) },
        { label: "Fecha deseada", value: `${formatLongDate(request.eventDate)}, ${shiftLabel}` },
      ],
    },
    {
      title: `Servicio ${serviceLabel}`,
      rows: [
        ...describeMenu(request),
        ...(request.extras.length > 0 ? [{ label: "Extras de interés", value: request.extras.join(", ") }] : []),
      ],
    },
    {
      title: "Reunión para hablar detalles",
      rows: [
        { label: "Día", value: formatLongDate(request.meeting.date) },
        { label: "Horario", value: `${request.meeting.time} h` },
        { label: "Modalidad", value: findMeetingMode(request.meeting.mode)?.label ?? request.meeting.mode },
      ],
    },
    {
      title: "Contacto",
      rows: [
        { label: "Nombre", value: request.contact.name },
        { label: "Teléfono", value: request.contact.phone },
        ...(request.notes ? [{ label: "Comentarios", value: request.notes }] : []),
      ],
    },
    {
      title: "Presupuesto",
      rows: [{ label: "Valor", value: "Personalizado: se cotiza en la reunión con el salón." }],
    },
  ];
}
