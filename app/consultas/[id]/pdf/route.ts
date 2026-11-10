import { buildPartyPdfResponse } from "@/features/party-requests/build-party-pdf-response";
import { partyRequestRepository } from "@/features/party-requests/party-request-repository";

const PUBLIC_LINK_DAYS = 30;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function isPublicLinkExpired(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() > PUBLIC_LINK_DAYS * MILLISECONDS_PER_DAY;
}

/**
 * GET /consultas/:id/pdf — el link que viaja en el mensaje de WhatsApp.
 * El id es un UUID aleatorio, imposible de adivinar, pero quien tenga el link
 * ve datos personales: por eso deja de funcionar a los 30 días. El salón sigue
 * viendo el PDF desde el panel.
 */
export async function GET(_request: Request, context: RouteContext<"/consultas/[id]/pdf">) {
  const { id } = await context.params;
  const partyRequest = await partyRequestRepository.findById(id);
  if (!partyRequest) {
    return new Response("Consulta no encontrada", { status: 404 });
  }
  if (isPublicLinkExpired(partyRequest.createdAt)) {
    return new Response("Este enlace venció. Escríbenos por WhatsApp para recibir el detalle de nuevo.", {
      status: 410,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return buildPartyPdfResponse(partyRequest);
}
