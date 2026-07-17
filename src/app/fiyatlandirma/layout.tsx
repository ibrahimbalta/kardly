import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fiyatlandırma - Kardly",
  description: "Kardly dijital kartvizit planları ve fiyatlandırması. Ücretsiz ve premium planları karşılaştırın.",
  openGraph: {
    title: "Fiyatlandırma - Kardly",
    description: "Kardly dijital kartvizit planları ve fiyatlandırması.",
    url: "https://kardly.site/fiyatlandirma",
    type: "website",
  },
  alternates: {
    canonical: "https://kardly.site/fiyatlandirma",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FiyatlandirmaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
