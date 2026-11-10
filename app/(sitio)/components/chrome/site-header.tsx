import Image from "next/image";
import Link from "next/link";
import { SALON } from "@/features/catalog/salon";
import logo from "@/public/fotos/logo-el-hornero.png";

const NAV_LINKS = [
  { href: "/#salon", label: "El salón" },
  { href: "/#propuestas", label: "Propuestas" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#contacto", label: "Contacto" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-night/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label={`${SALON.name}, ${SALON.tagline}: inicio`}>
          <Image src={logo} alt="" priority sizes="94px" className="h-10 w-auto" />
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-1 sm:gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden px-2 py-2 text-sm text-muted transition-colors hover:text-ivory md:inline-block"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/armar-tu-fiesta"
            className="inline-flex min-h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-night transition-[background-color,transform] duration-150 hover:bg-gold-bright active:scale-[0.97]"
          >
            Arma tu fiesta
          </Link>
        </nav>
      </div>
    </header>
  );
}
