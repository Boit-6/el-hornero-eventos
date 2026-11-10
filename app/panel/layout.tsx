import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  return <div className="flex min-h-full flex-1 flex-col bg-coal">{children}</div>;
}
