import "server-only";
import { jsPDF } from "jspdf";
import { SALON } from "@/features/catalog/salon";
import type { SummarySection } from "./describe-party-request";
import { NOT_A_RESERVATION_DISCLAIMER } from "./not-a-reservation-disclaimer";

const PAGE_MARGIN = 20;
const LABEL_COLUMN_WIDTH = 50;
const LINE_HEIGHT = 6;
const HEADER_HEIGHT = 30;
// Negro y dorado de la marca. El dorado va más oscuro que en la web para leerse sobre papel blanco.
const BLACK_RGB: [number, number, number] = [11, 10, 8];
const GOLD_RGB: [number, number, number] = [201, 162, 75];
const GOLD_ON_PAPER_RGB: [number, number, number] = [138, 106, 32];
const MUTED_RGB: [number, number, number] = [95, 88, 74];

/** Genera en el servidor el PDF con las especificaciones de la fiesta. */
export function buildPartyPdf(sections: SummarySection[]) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const valueWidth = pageWidth - PAGE_MARGIN * 2 - LABEL_COLUMN_WIDTH;
  let cursorY = PAGE_MARGIN;

  function ensureSpace(heightNeeded: number) {
    if (cursorY + heightNeeded <= pageHeight - PAGE_MARGIN) return;
    pdf.addPage();
    cursorY = PAGE_MARGIN;
  }

  pdf.setFillColor(...BLACK_RGB);
  pdf.rect(0, 0, pageWidth, HEADER_HEIGHT, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(...GOLD_RGB);
  pdf.text(SALON.name.toUpperCase(), PAGE_MARGIN, 14, { charSpace: 1.5 });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`${SALON.tagline.toUpperCase()}  ·  ${SALON.address}  ·  ${SALON.phones[0]}`, PAGE_MARGIN, 22);
  cursorY = HEADER_HEIGHT + 12;

  pdf.setFontSize(11);
  pdf.setTextColor(...MUTED_RGB);
  pdf.text("Especificaciones de la fiesta armada en la web", PAGE_MARGIN, cursorY);
  cursorY += 12;

  for (const section of sections) {
    ensureSpace(LINE_HEIGHT * 3);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.setTextColor(...GOLD_ON_PAPER_RGB);
    pdf.text(section.title, PAGE_MARGIN, cursorY);
    cursorY += LINE_HEIGHT + 1;

    pdf.setFontSize(11);
    for (const row of section.rows) {
      const valueLines: string[] = pdf.splitTextToSize(row.value, valueWidth);
      ensureSpace(valueLines.length * LINE_HEIGHT);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...BLACK_RGB);
      pdf.text(row.label, PAGE_MARGIN, cursorY);
      pdf.setFont("helvetica", "normal");
      pdf.text(valueLines, PAGE_MARGIN + LABEL_COLUMN_WIDTH, cursorY);
      cursorY += valueLines.length * LINE_HEIGHT;
    }
    cursorY += LINE_HEIGHT;
  }

  const disclaimerLines: string[] = pdf.splitTextToSize(NOT_A_RESERVATION_DISCLAIMER, pageWidth - PAGE_MARGIN * 2);
  ensureSpace(disclaimerLines.length * LINE_HEIGHT + LINE_HEIGHT);
  pdf.setDrawColor(...MUTED_RGB);
  pdf.line(PAGE_MARGIN, cursorY, pageWidth - PAGE_MARGIN, cursorY);
  cursorY += LINE_HEIGHT;
  pdf.setFontSize(9);
  pdf.setTextColor(...MUTED_RGB);
  pdf.text(disclaimerLines, PAGE_MARGIN, cursorY);

  return pdf.output("arraybuffer");
}
