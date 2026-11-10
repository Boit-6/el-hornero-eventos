export const PDF_MIME_TYPE = "application/pdf";

/** Descarga el PDF de la consulta y lo deja listo para adjuntarlo al compartir. */
export async function fetchPdfFile(pdfUrl: string, fileName: string) {
  const response = await fetch(pdfUrl);
  if (!response.ok) throw new Error(`El PDF respondió ${response.status}`);

  return new File([await response.blob()], fileName, { type: PDF_MIME_TYPE });
}
