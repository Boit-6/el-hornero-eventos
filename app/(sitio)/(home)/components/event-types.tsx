import Link from "next/link";
import { EVENT_PAGES, toEventPagePath } from "@/features/catalog/event-pages";
import { EVENT_TYPES } from "@/features/catalog/party-options";
import { SectionHeading } from "../../components/section-heading";

const CHIP_CLASS_NAME = "inline-flex min-h-11 items-center rounded-full border px-5 font-display text-xl";

export function EventTypes() {
  return (
    <section id="eventos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Eventos" title="Casamientos, fiestas de 15 y eventos empresariales" />
      <ul className="mt-10 flex flex-wrap gap-3">
        {EVENT_TYPES.map((eventType) => {
          const page = EVENT_PAGES.find((candidate) => candidate.eventTypeId === eventType.id);

          return (
            <li key={eventType.id}>
              {page ? (
                <Link
                  href={toEventPagePath(page.slug)}
                  className={`${CHIP_CLASS_NAME} gap-2 border-gold/60 transition-colors duration-150 hover:border-gold-bright hover:text-gold-bright`}
                >
                  {eventType.label}
                  <span aria-hidden="true" className="font-sans text-base text-gold">→</span>
                </Link>
              ) : (
                <span className={`${CHIP_CLASS_NAME} border-line`}>{eventType.label}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
