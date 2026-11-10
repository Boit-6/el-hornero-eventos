import type { Metadata } from "next";
import { SALON } from "@/features/catalog/salon";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Qué datos pedimos al armar tu fiesta en la web de El Hornero y para qué los usamos.",
  alternates: { canonical: "/privacidad" },
  // Borrador sin revisión legal: no se indexa hasta que el salón apruebe el texto.
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="bg-coal">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Privacidad</h1>

        <div className="mt-8 space-y-8 text-muted">
          <section>
            <h2 className="font-display text-2xl font-semibold text-ivory">Qué datos pedimos</h2>
            <p className="mt-2">
              Cuando armas tu fiesta guardamos lo que completas en el formulario: tu nombre, tu teléfono, los
              detalles del evento y de la reunión que propones, y los comentarios que quieras agregar.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-ivory">Para qué los usamos</h2>
            <p className="mt-2">
              Solo para responder tu consulta y coordinar la reunión con {SALON.name}. No los usamos para
              publicidad ni los vendemos o cedemos a otras empresas. Se guardan en los servicios de
              alojamiento que hacen funcionar este sitio.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-ivory">El enlace al PDF</h2>
            <p className="mt-2">
              El mensaje de WhatsApp incluye un enlace a un PDF con tu consulta. Cualquier persona que tenga
              ese enlace puede abrirlo, así que compártelo solo con el salón. El enlace deja de funcionar a los
              30 días.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-ivory">Tus derechos</h2>
            <p className="mt-2">
              Puedes pedirnos en cualquier momento ver, corregir o eliminar tus datos, como establece la Ley
              25.326 de Protección de Datos Personales. Escríbenos o llámanos al {SALON.phones.join(" o al ")},
              o visítanos en {SALON.address}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
