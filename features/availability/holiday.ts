/** Feriado nacional o día puente: esos días el salón no atiende reuniones. */
export type Holiday = {
  date: string;
  name: string;
};

export function findHoliday(holidays: ReadonlyArray<Holiday>, date: string) {
  return holidays.find((holiday) => holiday.date === date) ?? null;
}
