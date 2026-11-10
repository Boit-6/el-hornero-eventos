import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { SALON } from "@/features/catalog/salon";
import { describePartyRequest } from "@/features/party-requests/describe-party-request";
import { NOT_A_RESERVATION_DISCLAIMER } from "@/features/party-requests/not-a-reservation-disclaimer";
import { partyRequestSchema, type PartyRequestInput } from "@/features/party-requests/party-request-schema";
import { submitPartyRequest } from "../actions/submit-party-request";
import { buildWhatsappMessage, buildWhatsappUrl } from "../utils/build-whatsapp-message";
import { canSharePdfFiles } from "../utils/can-share-pdf-files";
import { fetchPdfFile } from "../utils/fetch-pdf-file";

type SendState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent"; pdfUrl: string; whatsappUrl: string; pdfFile: File | null }
  | { status: "error"; message: string };

function openUrlInTab(tab: Window | null, url: string) {
  if (tab) {
    tab.location.href = url;
  } else {
    window.location.href = url;
  }
}

async function sharePdfFile(pdfFile: File, message: string) {
  try {
    await navigator.share({ files: [pdfFile], text: message });
  } catch {
    // La persona canceló o el navegador pidió un toque nuevo: queda el botón para reintentar.
  }
}

export function SummaryStep() {
  const { getValues } = useFormContext<PartyRequestInput>();
  const [sendState, setSendState] = useState<SendState>({ status: "idle" });
  const parsed = partyRequestSchema.safeParse(getValues());

  if (!parsed.success) {
    return (
      <p className="rounded-2xl border border-danger/30 bg-danger/5 p-4 text-danger">
        Falta completar algún dato. Vuelve a los pasos anteriores para revisarlos.
      </p>
    );
  }

  const partyRequest = parsed.data;
  const sections = describePartyRequest(partyRequest);

  async function handleSend() {
    const sharesPdfAsFile = canSharePdfFiles();
    // La pestaña se abre antes de cualquier `await`: si no, el navegador la bloquea como popup.
    const whatsappTab = sharesPdfAsFile ? null : window.open("", "_blank");
    setSendState({ status: "sending" });

    const result = await submitPartyRequest(partyRequest);
    if (result.status === "rejected") {
      whatsappTab?.close();
      setSendState({ status: "error", message: result.message });
      return;
    }

    const pdfUrl = `${window.location.origin}/consultas/${result.id}/pdf`;
    const message = buildWhatsappMessage(sections, pdfUrl);
    const whatsappUrl = buildWhatsappUrl(SALON.whatsappNumber, message);

    if (!sharesPdfAsFile) {
      setSendState({ status: "sent", pdfUrl, whatsappUrl, pdfFile: null });
      openUrlInTab(whatsappTab, whatsappUrl);
      return;
    }

    const pdfFileName = `fiesta-el-hornero-${partyRequest.eventDate}.pdf`;
    // Si el PDF no se puede descargar, queda el mensaje con el link como alternativa.
    const pdfFile = await fetchPdfFile(pdfUrl, pdfFileName).catch(() => null);
    setSendState({ status: "sent", pdfUrl, whatsappUrl, pdfFile });
    if (pdfFile) await sharePdfFile(pdfFile, message);
  }

  function handleShareAgain() {
    if (sendState.status !== "sent" || !sendState.pdfFile) return;
    return sharePdfFile(sendState.pdfFile, buildWhatsappMessage(sections, sendState.pdfUrl));
  }

  return (
    <div className="space-y-8">
      <dl className="divide-y divide-line rounded-2xl border border-line">
        {sections.map((section) => (
          <div key={section.title} className="p-5">
            <dt className="font-display text-lg font-semibold text-gold">{section.title}</dt>
            <dd className="mt-2">
              <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[10rem_1fr]">
                {section.rows.map((row) => (
                  <div key={row.label} className="contents">
                    <dt className="text-sm text-muted">{row.label}</dt>
                    <dd className="mb-2 sm:mb-0">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </dd>
          </div>
        ))}
      </dl>

      <p className="rounded-2xl bg-coal p-4 text-sm text-muted">{NOT_A_RESERVATION_DISCLAIMER}</p>

      {sendState.status === "sent" ? (
        <div aria-live="polite" className="space-y-4">
          {sendState.pdfFile ? (
            <p className="text-ok">
              ¡Listo! Registramos tu consulta. Comparte el PDF por WhatsApp y elige el contacto de El
              Hornero (+{SALON.whatsappNumber}).
            </p>
          ) : (
            <p className="text-ok">
              ¡Listo! Registramos tu consulta y abrimos el chat con El Hornero con el mensaje y el link
              al PDF. Solo tienes que tocar enviar.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {sendState.pdfFile && (
              <button
                type="button"
                onClick={handleShareAgain}
                className="inline-flex min-h-11 items-center rounded-full bg-[#1f8f4e] px-5 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
              >
                Compartir PDF por WhatsApp
              </button>
            )}
            <a
              href={sendState.whatsappUrl}
              target="_blank"
              rel="noopener"
              className={
                sendState.pdfFile
                  ? "inline-flex min-h-11 items-center rounded-full border border-ivory/20 px-5 text-sm font-semibold"
                  : "inline-flex min-h-11 items-center rounded-full bg-[#1f8f4e] px-5 text-sm font-semibold text-white"
              }
            >
              {sendState.pdfFile ? "Enviar solo el mensaje" : "Abrir WhatsApp de nuevo"}
            </a>
            <a
              href={sendState.pdfUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center rounded-full border border-ivory/20 px-5 text-sm font-semibold"
            >
              Ver PDF
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSend}
            disabled={sendState.status === "sending"}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#1f8f4e] px-7 font-semibold text-white transition-[background-color,transform,opacity] duration-150 hover:bg-[#18773f] active:scale-[0.97] disabled:opacity-60 sm:w-auto"
          >
            {sendState.status === "sending" ? "Registrando consulta…" : "Enviar por WhatsApp"}
          </button>
          <div aria-live="polite" className="min-h-6 text-sm text-danger">
            {sendState.status === "error" && <p>{sendState.message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
