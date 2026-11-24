import type { Metadata, Viewport } from "next";
import { Red_Hat_Display, Red_Hat_Text } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

// Base visual de la skill design-taste-frontend (no editar; los cambios propios van en globals.css)
import "@/styles/kit/system.css";
import "@/styles/kit/motion.css";
import "@/styles/kit/layout.css";
import "./globals.css";

const display = Red_Hat_Display({ subsets: ["latin"], variable: "--font-rh-display", display: "swap" });
const text = Red_Hat_Text({ subsets: ["latin"], variable: "--font-rh-text", display: "swap" });

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: site.title, template: `%s | ${site.brand}` },
  description: site.description,
  applicationName: site.brand,
  authors: [{ name: site.brand }],
  keywords: [
    "nutricionista online",
    "licenciada en nutrición",
    "consulta nutricional online",
    "nutricionista Argentina",
    "alimentación consciente",
    "alimentación vegetariana y vegana",
    "Aldana Heyde",
  ],
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  // la imagen para compartir la toma Next de src/app/opengraph-image.jpg y twitter-image.jpg
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: site.brand,
    title: site.title,
    description: site.shareDescription,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.shareDescription },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f3f1ec",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-AR"
      data-type="service"
      data-radius="soft"
      data-buttons="solid"
      className={`${display.variable} ${text.variable}`}
    >
      <body>
        {children}
        {/* visitas anónimas y sin cookies; solo existe en Vercel, así que fuera de ahí no se carga */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
