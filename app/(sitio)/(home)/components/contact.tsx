import { SALON, SALON_ABOUT } from "@/features/catalog/salon";
import { SectionHeading } from "../../components/section-heading";

function toPhoneHref(phone: string) {
  return `tel:+54${phone.replace(/\D/g, "")}`;
}

export function Contact() {
  return (
    <section id="contacto" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Nuestro compromiso" title="Cada evento es único" />
          <p className="mt-6 text-lg text-muted">{SALON_ABOUT.commitment}</p>
          <p className="mt-4 font-display text-2xl text-gold-bright italic">{SALON_ABOUT.invitation}</p>
        </div>

        <div className="rounded-3xl border border-line bg-coal p-8">
          <h3 className="font-display text-3xl font-semibold">Información y reservas</h3>
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Teléfonos</dt>
              <dd className="mt-1 flex flex-wrap gap-x-4 text-lg">
                {SALON.phones.map((phone) => (
                  <a key={phone} href={toPhoneHref(phone)} className="tabular-nums hover:text-gold-bright">
                    {phone}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Dirección</dt>
              <dd className="mt-1 text-lg">
                <a href={SALON.mapsUrl} target="_blank" rel="noopener" className="hover:text-gold-bright">
                  {SALON.address}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Horario de atención</dt>
              <dd className="mt-1 text-lg">{SALON.attentionHours}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Instagram</dt>
              <dd className="mt-1 text-lg">
                <a href={SALON.instagramUrl} target="_blank" rel="noopener" className="hover:text-gold-bright">
                  {SALON.instagram}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
