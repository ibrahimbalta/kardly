import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Dijital Kartvizit ve Profesyonel İpuçları",
  description: "Kardly Blog: Dijital kartvizit trendleri, NFC teknolojisi, QR kod kullanımı, kişisel marka oluşturma ve profesyonel ağ kurma hakkında güncel yazılar ve ipuçları.",
  keywords: [
    "dijital kartvizit blog", "nfc kartvizit haberleri", "qr kod kullanımı", 
    "kişisel marka oluşturma", "profesyonel networking", "dijital kimlik trendleri"
  ],
  openGraph: {
    title: "Kardly Blog - Dijital Kartvizit Dünyası",
    description: "Dijital kartvizit trendleri, NFC teknolojisi ve profesyonel ipuçları hakkında güncel yazılar.",
    url: "https://kardly.site/blog",
    type: "website",
  },
  alternates: {
    canonical: "https://kardly.site/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
