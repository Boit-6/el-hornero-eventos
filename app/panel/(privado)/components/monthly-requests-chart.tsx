import { parseIsoDate } from "@/features/utils/calendar-dates";

type MonthlyRequestsChartProps = {
  months: { month: string; count: number }[];
};

const monthLabelFormatter = new Intl.DateTimeFormat("es-AR", { month: "short" });

/** Barras horizontales con el valor al lado de cada una: se leen sin hover y sin depender del color. */
export function MonthlyRequestsChart({ months }: MonthlyRequestsChartProps) {
  const maxCount = Math.max(1, ...months.map(({ count }) => count));

  return (
    <section className="rounded-2xl border border-line bg-night p-5">
      <h2 className="font-display text-xl font-semibold">Consultas por mes</h2>
      <ul className="mt-4 space-y-2">
        {months.map(({ month, count }) => (
          <li key={month} className="grid grid-cols-[3rem_1fr_2rem] items-center gap-3 text-sm">
            <span className="text-muted capitalize">{monthLabelFormatter.format(parseIsoDate(`${month}-01`))}</span>
            <span className="h-3 rounded-full bg-coal">
              <span
                className="block h-full rounded-full bg-gold"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </span>
            <span className="text-right tabular-nums">{count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
