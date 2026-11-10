import Image from "next/image";
import Link from "next/link";
import {
  DESSERTS,
  DRINKS,
  LATE_NIGHT_SERVICE,
  LUNCH_MENU,
  SEATED_PROPOSALS,
  SEATED_RECEPTION,
} from "@/features/catalog/party-options";
import beefStew from "@/public/fotos/plato-carne-a-la-olla.jpg";
import lasagna from "@/public/fotos/plato-lasana.jpg";
import flan from "@/public/fotos/postre-flan.jpg";
import { SectionHeading } from "../../components/section-heading";

const DISH_PHOTOS = [
  { photo: lasagna, caption: "Lasaña de carne, jamón cocido y queso" },
  { photo: beefStew, caption: "Carne a la olla con papas al horno" },
  { photo: flan, caption: "Flan casero con dulce de leche y crema" },
];

function BulletList({ items }: { items: ReadonlyArray<string> }) {
  return (
    <ul className="space-y-2 text-sm text-muted">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true" className="text-gold">◆</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function ExpandableList({ summary, items }: { summary: string; items: ReadonlyArray<string> }) {
  return (
    <details className="group border-t border-line pt-4">
      <summary className="flex min-h-11 cursor-pointer items-center justify-between font-semibold">
        {summary}
        <span aria-hidden="true" className="text-gold transition-transform duration-200 group-open:rotate-45">+</span>
      </summary>
      <div className="pt-2 pb-2">
        <BulletList items={items} />
      </div>
    </details>
  );
}

export function MenuProposals() {
  return (
    <section id="propuestas" className="scroll-mt-20 border-y border-line bg-coal">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Propuestas gastronómicas" title="Menú para eventos: lunch o formal" />
        <p className="mt-4 max-w-2xl text-muted">
          Menú de elaboración propia. El presupuesto es personalizado según las características de cada
          evento y lo definimos juntos en la reunión.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-line bg-night p-8">
            <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Opción 1 · Lunch</p>
            <h3 className="mt-2 font-display text-4xl font-semibold">{LUNCH_MENU.name}</h3>
            <p className="mt-3 mb-6 text-muted">
              Recepción e islas con un menú completo que circula durante toda la fiesta.
            </p>
            <ExpandableList summary="Recepción" items={LUNCH_MENU.reception} />
            <ExpandableList summary="Islas" items={LUNCH_MENU.islands} />
          </article>

          <article className="rounded-3xl border border-line bg-night p-8">
            <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Opciones 2 a 5 · Formal</p>
            <h3 className="mt-2 font-display text-4xl font-semibold">Recepción, plato y postre</h3>
            <p className="mt-3 mb-6 text-muted">
              Una recepción completa, el plato principal de la propuesta que elijas y un postre.
            </p>
            <ExpandableList summary="Recepción" items={SEATED_RECEPTION} />
            {SEATED_PROPOSALS.map((proposal) => (
              <ExpandableList key={proposal.id} summary={`${proposal.label} · plato principal`} items={proposal.mains} />
            ))}
            <ExpandableList summary="Postres (se elige uno)" items={DESSERTS} />
          </article>
        </div>

        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          {DISH_PHOTOS.map((dish) => (
            <li key={dish.caption}>
              <Image
                src={dish.photo}
                alt={dish.caption}
                placeholder="blur"
                sizes="(min-width: 640px) 33vw, 100vw"
                className="aspect-[3/2] w-full rounded-2xl border border-line object-cover"
              />
              <p className="mt-2 text-sm text-muted">{dish.caption}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-line p-6">
            <h3 className="mb-4 font-display text-2xl font-semibold">Bebidas</h3>
            <p className="mb-3 text-sm text-muted">En la recepción y la cena:</p>
            <BulletList items={DRINKS} />
          </div>
          <div className="rounded-3xl border border-line p-6">
            <h3 className="mb-4 font-display text-2xl font-semibold">Trasnoche</h3>
            <BulletList items={LATE_NIGHT_SERVICE.standard} />
          </div>
          <div className="rounded-3xl border border-gold/50 p-6">
            <h3 className="mb-4 font-display text-2xl font-semibold text-gold-bright">Trasnoche premium</h3>
            <p className="mb-3 text-sm text-muted">Con la opción 5:</p>
            <BulletList items={LATE_NIGHT_SERVICE.premium} />
          </div>
        </div>

        <Link
          href="/armar-tu-fiesta"
          className="mt-10 inline-flex min-h-12 items-center rounded-full bg-gold px-7 font-semibold text-night transition-[background-color,transform] duration-150 hover:bg-gold-bright active:scale-[0.97]"
        >
          Elige tu propuesta
        </Link>
      </div>
    </section>
  );
}
