import {
  EXTRA_SERVICES,
  INCLUDED_SERVICES,
  NOT_INCLUDED_AND_RULES,
  SALON_CONDITIONS,
} from "@/features/catalog/salon";
import { SectionHeading } from "../../components/section-heading";

function CheckList({ items }: { items: ReadonlyArray<string> }) {
  return (
    <ul className="mt-6 space-y-3 text-muted">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="text-gold">◆</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function IncludedAndExtras() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <SectionHeading eyebrow="En todas las propuestas" title="Servicios incluidos" />
          <CheckList items={INCLUDED_SERVICES} />
        </div>
        <div>
          <SectionHeading eyebrow="Suma lo que quieras" title="Servicios extra" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {EXTRA_SERVICES.map((extra) => (
              <li key={extra} className="rounded-full border border-line px-4 py-2 text-sm">
                {extra}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-line bg-coal p-8">
          <h3 className="font-display text-2xl font-semibold">Para tener en cuenta</h3>
          <CheckList items={SALON_CONDITIONS} />
        </div>
        <div className="rounded-3xl border border-line bg-coal p-8">
          <h3 className="font-display text-2xl font-semibold">No incluido y restricciones</h3>
          <CheckList items={NOT_INCLUDED_AND_RULES} />
        </div>
      </div>
    </section>
  );
}
