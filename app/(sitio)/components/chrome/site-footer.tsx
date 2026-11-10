import Link from "next/link";
import { EVENT_PAGES, toEventPagePath } from "@/features/catalog/event-pages";
import { SALON } from "@/features/catalog/salon";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-coal">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-muted sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-display text-2xl text-ivory">{SALON.name}</p>
          <p>{SALON.tagline}</p>
          <p className="mt-2 text-gold">{SALON.slogan}</p>
        </div>
        <address className="not-italic">
          <p>{SALON.address}</p>
          <p>{SALON.phones.join(" · ")}</p>
          <p>Atención: {SALON.attentionHours}</p>
        </address>
        <div className="space-y-2 sm:text-right">
          {EVENT_PAGES.map((page) => (
            <p key={page.slug}>
              <Link href={toEventPagePath(page.slug)} className="hover:text-ivory">
                {page.label}
              </Link>
            </p>
          ))}
          <p>
            <a href={SALON.instagramUrl} target="_blank" rel="noopener" className="hover:text-ivory">
              Instagram {SALON.instagram}
            </a>
          </p>
          <p>
            <Link href="/privacidad" className="hover:text-ivory">
              Privacidad
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
