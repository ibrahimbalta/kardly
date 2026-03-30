import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim - Bize Ulaşın",
  description: "Kardly ekibiyle iletişime geçin. Dijital kartvizit, NFC kart, QR kod çözümleri ve platform hakkında sorularınız için bize yazın.",
  keywords: [
    "kardly iletişim", "dijital kartvizit destek", "kardly müşteri hizmetleri",
    "nfc kartvizit iletişim", "online kartvizit yardım"
  ],
  openGraph: {
    title: "İletişim - Kardly",
    description: "Kardly ekibiyle iletişime geçin. Sorularınız ve önerileriniz için bize ulaşın.",
    url: "https://kardly.site/iletisim",
    type: "website",
  },
  alternates: {
    canonical: "https://kardly.site/iletisim",
  },
};

export default function IletisimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
