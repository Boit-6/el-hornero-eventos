import Link from "next/link";
import type { EventPage } from "@/features/catalog/event-pages";
import { INCLUDED_SERVICES } from "@/features/catalog/salon";
import { SectionHeading } from "../../../components/section-heading";

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

export function EventServices({ page }: { page: EventPage }) {
  return (
    <section className="border-y border-line bg-coal">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="En todas las propuestas" title="Servicios incluidos" />
            <CheckList items={INCLUDED_SERVICES} />
          </div>
          <div>
            <SectionHeading eyebrow="Suma lo que quieras" title="Extras para sumar" />
            <ul className="mt-6 flex flex-wrap gap-2">
              {page.extras.map((extra) => (
                <li key={extra} className="rounded-full border border-line px-4 py-2 text-sm">
                  {extra}
                </li>
              ))}
            </ul>
            <h3 className="mt-10 font-display text-2xl font-semibold">Para tener en cuenta</h3>
            <CheckList items={page.notes} />
          </div>
        </div>

        <p className="mt-12 max-w-2xl text-muted">
          El presupuesto es personalizado y lo definimos juntos en la reunión. Mira{" "}
          <Link href="/#propuestas" className="text-gold-bright underline underline-offset-4 hover:text-ivory">
            el menú completo
          </Link>{" "}
          y las{" "}
          <Link href="/#preguntas" className="text-gold-bright underline underline-offset-4 hover:text-ivory">
            preguntas frecuentes
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
