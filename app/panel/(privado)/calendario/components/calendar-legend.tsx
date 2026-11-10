export function CalendarLegend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
      <li className="flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-ok" /> Fiesta confirmada
      </li>
      <li className="flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-gold" /> Consultas en curso
      </li>
      <li className="flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-ivory" /> Reunión acordada
      </li>
      <li className="flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-danger" /> Feriado o puente
      </li>
      <li className="flex items-center gap-2">
        <span className="size-2.5 border border-line bg-[repeating-linear-gradient(135deg,transparent_0_2px,var(--color-line)_2px_3px)]" />{" "}
        Fecha bloqueada
      </li>
    </ul>
  );
}
