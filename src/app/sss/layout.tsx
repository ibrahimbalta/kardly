import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular (SSS)",
  description: "Kardly hakkında sıkça sorulan sorular: Dijital kartvizit nasıl oluşturulur, NFC ve QR kod nasıl çalışır, ücretsiz plan neleri kapsar ve daha fazlası.",
  keywords: [
    "dijital kartvizit sss", "nfc kartvizit nasıl çalışır", "qr kod kartvizit nasıl yapılır",
    "kardly fiyatları", "dijital kartvizit ücretsiz", "online kartvizit soru cevap"
  ],
  openGraph: {
    title: "SSS - Kardly Dijital Kartvizit",
    description: "Kardly dijital kartvizit platformu hakkında tüm sorularınızın cevapları.",
    url: "https://kardly.site/sss",
    type: "website",
  },
  alternates: {
    canonical: "https://kardly.site/sss",
  },
};

export default function SSSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
