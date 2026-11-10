/**
 * Feriados de Mendoza que la API nacional no trae. Se repiten todos los años
 * en el mismo día; si la provincia agrega otro, se suma acá.
 */
export const MENDOZA_HOLIDAYS: ReadonlyArray<{ monthDay: string; name: string }> = [
  { monthDay: "07-25", name: "Santiago Apóstol, patrono de Mendoza" },
];
