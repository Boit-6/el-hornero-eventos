import Link from "next/link";
import { requirePanelSession } from "@/features/panel-auth/panel-session";
import { logOut } from "./actions/log-out";
import { PanelNav } from "./components/panel-nav";

export default async function PrivatePanelLayout({ children }: LayoutProps<"/panel">) {
  await requirePanelSession();

  return (
    <>
      <header className="border-b border-line bg-night">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/panel" className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold">El Hornero</span>
            <span className="text-sm text-muted">Panel</span>
          </Link>
          <form action={logOut}>
            <button type="submit" className="min-h-11 px-3 text-sm font-semibold text-muted hover:text-ivory">
              Cerrar sesión
            </button>
          </form>
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <PanelNav />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
    </>
  );
}
