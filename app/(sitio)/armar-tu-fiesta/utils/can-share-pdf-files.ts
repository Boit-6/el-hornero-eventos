import { PDF_MIME_TYPE } from "./fetch-pdf-file";

/**
 * Indica si el dispositivo puede mandar un PDF como adjunto desde el menú de
 * compartir. Se limita a pantallas táctiles: en computadoras ese menú casi
 * nunca ofrece WhatsApp, y ahí conviene el mensaje con el link.
 */
export function canSharePdfFiles() {
  if (typeof navigator.canShare !== "function") return false;

  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  const samplePdf = new File([], "consulta.pdf", { type: PDF_MIME_TYPE });
  return isTouchDevice && navigator.canShare({ files: [samplePdf] });
}
