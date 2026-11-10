import { SALON_FAQ } from "@/features/catalog/salon-faq";
import { JsonLd } from "../../components/json-ld";
import { SectionHeading } from "../../components/section-heading";

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SALON_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export function Faq() {
  return (
    <section id="preguntas" className="scroll-mt-20 border-t border-line bg-coal">
      <JsonLd data={FAQ_JSON_LD} />
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Preguntas frecuentes" title="Lo que más nos consultan" />
        <ul className="mt-10 border-t border-line">
          {SALON_FAQ.map((item) => (
            <li key={item.question} className="border-b border-line">
              <details className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-xl font-semibold [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="text-2xl leading-none font-normal text-gold transition-transform duration-150 ease-out group-open:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <p className="pr-8 pb-5 text-muted">{item.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
