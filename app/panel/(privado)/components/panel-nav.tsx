"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/panel", label: "Resumen" },
  { href: "/panel/consultas", label: "Consultas" },
  { href: "/panel/calendario", label: "Calendario" },
] as const;

function isCurrent(pathname: string, href: string) {
  // El resumen es la raíz del panel: solo cuenta cuando se está exactamente ahí.
  return href === "/panel" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function PanelNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Secciones del panel" className="-mb-px flex gap-1 overflow-x-auto">
      {NAV_ITEMS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={isCurrent(pathname, href) ? "page" : undefined}
          className="inline-flex min-h-11 items-center border-b-2 border-transparent px-3 text-sm font-semibold text-muted hover:text-ivory aria-[current=page]:border-gold aria-[current=page]:text-ivory"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
