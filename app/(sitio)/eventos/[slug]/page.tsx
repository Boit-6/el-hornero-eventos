import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EVENT_PAGES, findEventPage, toEventPagePath } from "@/features/catalog/event-pages";
import { SITE_URL } from "@/features/catalog/site-url";
import { ClosingCta } from "../../components/closing-cta";
import { JsonLd } from "../../components/json-ld";
import { buildPageMetadata } from "../../utils/build-page-metadata";
import { EventHero } from "./components/event-hero";
import { EventHighlights } from "./components/event-highlights";
import { EventServices } from "./components/event-services";
import { OtherEvents } from "./components/other-events";

// Solo existen las páginas del catálogo: cualquier otro slug es un 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return EVENT_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps<"/eventos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = findEventPage(slug);
  if (!page) return {};

  return {
    title: page.heading,
    ...buildPageMetadata({
      title: `${page.heading} · El Hornero`,
      description: page.description,
      path: toEventPagePath(page.slug),
    }),
  };
}

export default async function EventPage({ params }: PageProps<"/eventos/[slug]">) {
  const { slug } = await params;
  const page = findEventPage(slug);
  if (!page) notFound();

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "El Hornero", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: page.label, item: `${SITE_URL}${toEventPagePath(page.slug)}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <EventHero page={page} />
      <EventHighlights page={page} />
      <EventServices page={page} />
      <OtherEvents currentSlug={page.slug} />
      <ClosingCta />
    </>
  );
}
