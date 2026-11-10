import { buildPageMetadata } from "../utils/build-page-metadata";
import { AboutSalon } from "./components/about-salon";
import { ClosingCta } from "../components/closing-cta";
import { Contact } from "./components/contact";
import { EventTypes } from "./components/event-types";
import { Faq } from "./components/faq";
import { Gallery } from "./components/gallery";
import { Hero } from "./components/hero";
import { HowItWorks } from "./components/how-it-works";
import { IncludedAndExtras } from "./components/included-and-extras";
import { MenuProposals } from "./components/menu-proposals";
import { SalonStructuredData } from "./components/salon-structured-data";
import { Spaces } from "./components/spaces";

export const metadata = buildPageMetadata({
  title: "Salón de eventos en Luján de Cuyo, Mendoza · El Hornero",
  description:
    "Salón de eventos El Hornero, en Luján de Cuyo, Mendoza. Más de 20 años celebrando casamientos, fiestas de 15 y 18, y eventos empresariales. Arma tu fiesta online.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <SalonStructuredData />
      <Hero />
      <AboutSalon />
      <Spaces />
      <EventTypes />
      <MenuProposals />
      <IncludedAndExtras />
      <Gallery />
      <HowItWorks />
      <Faq />
      <Contact />
      <ClosingCta />
    </>
  );
}
