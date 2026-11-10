/**
 * Estados internos de una consulta. Los maneja solo el salón desde el panel:
 * la web pública nunca confirma nada por sí sola.
 */
export const PARTY_REQUEST_STATUSES = [
  "nueva",
  "contactada",
  "reunion-pactada",
  "confirmada",
  "descartada",
] as const;

export type PartyRequestStatus = (typeof PARTY_REQUEST_STATUSES)[number];

export const PARTY_REQUEST_STATUS_LABELS: Record<PartyRequestStatus, string> = {
  nueva: "Nueva",
  contactada: "Contactada",
  "reunion-pactada": "Reunión pactada",
  confirmada: "Confirmada",
  descartada: "Descartada",
};

/** Consultas en curso: todavía no se cerraron ni se confirmaron ni se descartaron. */
export const OPEN_PARTY_REQUEST_STATUSES: readonly PartyRequestStatus[] = [
  "nueva",
  "contactada",
  "reunion-pactada",
];
