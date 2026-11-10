import { requirePanelSession } from "@/features/panel-auth/panel-session";
import { buildPartyPdfResponse } from "@/features/party-requests/build-party-pdf-response";
import { partyRequestRepository } from "@/features/party-requests/party-request-repository";

/** GET /panel/consultas/:id/pdf — el PDF de una consulta para el salón: exige sesión y no vence. */
export async function GET(_request: Request, context: RouteContext<"/panel/consultas/[id]/pdf">) {
  await requirePanelSession();

  const { id } = await context.params;
  const partyRequest = await partyRequestRepository.findById(id);
  if (!partyRequest) {
    return new Response("Consulta no encontrada", { status: 404 });
  }

  return buildPartyPdfResponse(partyRequest);
}
