import Link from "next/link";
import { EVENT_PAGES, toEventPagePath, type EventPageSlug } from "@/features/catalog/event-pages";

export function OtherEvents({ currentSlug }: { currentSlug: EventPageSlug }) {
  const otherPages = EVENT_PAGES.filter((page) => page.slug !== currentSlug);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="font-display text-3xl font-semibold tracking-tight">También celebramos</h2>
      <ul className="mt-6 flex flex-wrap gap-3">
        {otherPages.map((page) => (
          <li key={page.slug}>
            <Link
              href={toEventPagePath(page.slug)}
              className="inline-flex min-h-11 items-center rounded-full border border-gold/60 px-5 font-display text-xl transition-colors duration-150 hover:border-gold-bright hover:text-gold-bright"
            >
              {page.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/#eventos"
            className="inline-flex min-h-11 items-center px-3 text-muted underline underline-offset-4 hover:text-ivory"
          >
            Todos los eventos
          </Link>
        </li>
      </ul>
    </section>
  );
}
