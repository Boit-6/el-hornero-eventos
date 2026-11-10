import Link from "next/link";

export function ClosingCta() {
  return (
    <section className="bg-gold text-night">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between">
        <h2 className="max-w-xl font-display text-4xl font-semibold tracking-tight">
          ¿Ya te imaginas la fiesta? Ármala en cinco minutos.
        </h2>
        <Link
          href="/armar-tu-fiesta"
          className="inline-flex min-h-12 items-center rounded-full bg-night px-7 font-semibold text-gold-bright transition-transform duration-150 active:scale-[0.97]"
        >
          Empezar ahora
        </Link>
      </div>
    </section>
  );
}
