import {
  eventDateSchema,
  eventDetailsSchema,
  meetingSchema,
  menuSchema,
  serviceSchema,
} from "@/features/party-requests/party-request-schema";

/** Pasos del armador, en orden, con el esquema Zod que valida cada uno. */
export const BUILDER_STEPS = [
  { id: "evento", label: "Evento", title: "Cuéntanos sobre tu evento", schema: eventDetailsSchema },
  { id: "servicio", label: "Servicio", title: "Elige el tipo de servicio", schema: serviceSchema },
  { id: "menu", label: "Menú", title: "Arma el menú", schema: menuSchema },
  { id: "fecha", label: "Fecha", title: "Consulta la disponibilidad", schema: eventDateSchema },
  { id: "reunion", label: "Reunión", title: "Pacta una reunión", schema: meetingSchema },
  { id: "resumen", label: "Enviar", title: "Revisa y envía tu fiesta", schema: null },
] as const;

export type BuilderStepId = (typeof BUILDER_STEPS)[number]["id"];
