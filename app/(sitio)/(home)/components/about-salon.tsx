import Image from "next/image";
import { SALON, SALON_ABOUT, SALON_SERVICES } from "@/features/catalog/salon";
import salonPanorama from "@/public/fotos/salon-panoramica.jpg";
import { SectionHeading } from "../../components/section-heading";

const STATS = [
  { value: "+20", label: "años de trayectoria" },
  { value: String(SALON.capacity.maxGuests), label: "personas a la cena" },
  { value: `${SALON.eventDurationHours} h`, label: "de evento, de día o de noche" },
];

export function AboutSalon() {
  return (
    <section id="salon" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="El salón" title={SALON_ABOUT.heading} />
            <p className="mt-6 text-lg text-muted">{SALON_ABOUT.body}</p>
            <dl className="mt-8 grid grid-cols-3 gap-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="border-t border-gold pt-3">
                  <dd className="font-display text-4xl font-semibold text-gold-bright tabular-nums">{stat.value}</dd>
                  <dt className="mt-1 text-sm text-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
          <Image
            src={salonPanorama}
            alt="Salón principal armado con mesas redondas, pista central y bolas de espejos"
            placeholder="blur"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="rounded-3xl border border-line"
          />
        </div>

        <div className="mt-16 rounded-3xl border border-line bg-coal p-8">
          <h3 className="font-display text-3xl font-semibold">Nuestros servicios</h3>
          <ul className="mt-6 grid gap-x-10 gap-y-3 text-muted sm:grid-cols-2">
            {SALON_SERVICES.map((service) => (
              <li key={service} className="flex gap-3">
                <span aria-hidden="true" className="text-gold">◆</span>
                {service}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
