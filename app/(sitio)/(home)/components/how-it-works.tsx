import { SectionHeading } from "../../components/section-heading";

const STEPS = [
  { title: "Arma tu fiesta", description: "Elige el tipo de evento, lunch o formal y tu menú." },
  { title: "Consulta la fecha", description: "Te mostramos si el día que quieres está disponible para consultar." },
  { title: "Pacta una reunión", description: "Elige cuándo quieres que hablemos los detalles." },
  { title: "Envía por WhatsApp", description: "Nos llega tu propuesta con el link a un PDF y te respondemos nosotros." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Cómo funciona" title="Tu fiesta en cuatro pasos" />
      <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="border-t-2 border-gold pt-4">
            <span className="font-display text-sm font-semibold text-gold tabular-nums">
              0{index + 1}
            </span>
            <h3 className="mt-1 font-display text-xl font-semibold">{step.title}</h3>
            <p className="mt-2 text-muted">{step.description}</p>
          </li>
        ))}
      </ol>
      <p className="mt-10 rounded-2xl border border-line p-4 text-sm text-muted">
        Importante: armar tu fiesta en la web <strong className="text-ivory">no confirma ninguna reserva</strong>.
        La fecha queda confirmada únicamente cuando lo acordamos contigo en la reunión.
      </p>
    </section>
  );
}
