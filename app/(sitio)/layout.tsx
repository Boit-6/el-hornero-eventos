import { SiteFooter } from "./components/chrome/site-footer";
import { SiteHeader } from "./components/chrome/site-header";

export default function PublicSiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
