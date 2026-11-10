import type { Metadata } from "next";
import { listUpcomingHolidays } from "@/features/availability/list-holidays";
import { buildPageMetadata } from "../utils/build-page-metadata";
import { PartyBuilder } from "./components/party-builder";

const DESCRIPTION =
  "Elige tu evento, lunch o formal, el menú y la fecha. Pacta una reunión y envíanos tu propuesta por WhatsApp.";

export const metadata: Metadata = {
  title: "Arma tu fiesta",
  ...buildPageMetadata({
    title: "Arma tu fiesta · El Hornero",
    description: DESCRIPTION,
    path: "/armar-tu-fiesta",
  }),
};

export default async function BuildYourPartyPage() {
  const holidays = await listUpcomingHolidays();

  return (
    <div className="bg-coal">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Arma tu fiesta
        </h1>
        <p className="mt-3 text-muted">
          En seis pasos nos cuentas cómo te imaginas tu evento. Al final nos lo envías por WhatsApp
          y coordinamos una reunión. Nada queda reservado hasta que lo confirmemos juntos.
        </p>
        <div className="mt-10">
          <PartyBuilder holidays={holidays} />
        </div>
      </div>
    </div>
  );
}
