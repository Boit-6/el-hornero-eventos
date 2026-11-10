import type { SummarySection } from "@/features/party-requests/describe-party-request";

export function buildWhatsappMessage(sections: SummarySection[], pdfUrl: string) {
  const body = sections
    .map((section) => {
      const rows = section.rows.map((row) => `• ${row.label}: ${row.value}`).join("\n");
      return `*${section.title}*\n${rows}`;
    })
    .join("\n\n");

  return [
    "¡Hola! Vengo desde la web y quiero mi fiesta así:",
    body,
    `PDF con todas las especificaciones: ${pdfUrl}`,
    "¡Quedo atento/a para confirmar la reunión!",
  ].join("\n\n");
}

export function buildWhatsappUrl(phoneNumber: string, message: string) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
