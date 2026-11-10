const createdAtFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Argentina/Buenos_Aires",
});

export function formatCreatedAt(isoTimestamp: string) {
  return createdAtFormatter.format(new Date(isoTimestamp));
}
