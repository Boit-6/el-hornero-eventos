import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { SITE_URL } from "@/features/catalog/site-url";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Salón de eventos en Luján de Cuyo, Mendoza · El Hornero",
    template: "%s · El Hornero",
  },
  description:
    "Salón de eventos El Hornero, en Luján de Cuyo, Mendoza. Más de 20 años celebrando casamientos, fiestas de 15 y 18, y eventos empresariales. Arma tu fiesta online.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
