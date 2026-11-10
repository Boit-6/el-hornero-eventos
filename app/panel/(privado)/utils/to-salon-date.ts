const salonDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Argentina/Buenos_Aires",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Día (AAAA-MM-DD) en que cae un instante según la hora del salón, sin importar la zona del servidor. */
export function toSalonDate(isoTimestamp: string) {
  return salonDateFormatter.format(new Date(isoTimestamp));
}
