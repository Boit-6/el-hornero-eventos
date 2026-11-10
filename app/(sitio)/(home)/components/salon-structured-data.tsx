import { SALON, SALON_ABOUT } from "@/features/catalog/salon";
import { SITE_URL } from "@/features/catalog/site-url";
import { JsonLd } from "../../components/json-ld";

const [streetAddress, addressLocality, addressRegion] = SALON.address.split(", ");

function toInternationalPhone(phone: string) {
  return `+54${phone.replace(/\D/g, "")}`;
}

// Sin precios ni coordenadas: la carta del salón no los publica y no hay que inventarlos.
const SALON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "EventVenue",
  "@id": `${SITE_URL}/#salon`,
  name: `${SALON.name} · ${SALON.tagline}`,
  slogan: SALON.slogan,
  description: SALON_ABOUT.body,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image.jpg`,
  telephone: toInternationalPhone(SALON.phones[0]),
  address: {
    "@type": "PostalAddress",
    streetAddress,
    addressLocality,
    addressRegion,
    addressCountry: "AR",
  },
  hasMap: SALON.mapsUrl,
  maximumAttendeeCapacity: SALON.capacity.maxGuests,
  sameAs: [SALON.instagramUrl],
  contactPoint: SALON.phones.map((phone) => ({
    "@type": "ContactPoint",
    contactType: "reservations",
    telephone: toInternationalPhone(phone),
    availableLanguage: "es",
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "18:00",
      closes: "21:00",
    },
  })),
};

export function SalonStructuredData() {
  return <JsonLd data={SALON_JSON_LD} />;
}
