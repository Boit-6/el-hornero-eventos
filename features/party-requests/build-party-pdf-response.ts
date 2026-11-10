import "server-only";
import { buildPartyPdf } from "./build-party-pdf";
import { describePartyRequest } from "./describe-party-request";
import type { PartyRequestRecord } from "./party-request-repository";

/** El PDF se genera en el momento a partir de lo guardado, así siempre refleja la consulta original. */
export function buildPartyPdfResponse(partyRequest: PartyRequestRecord) {
  const pdf = buildPartyPdf(describePartyRequest(partyRequest));
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="fiesta-el-hornero-${partyRequest.eventDate}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
