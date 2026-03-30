import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt Ol - Ücretsiz Dijital Kartvizit Oluştur",
  description: "Kardly'ye ücretsiz kayıt olun. AI destekli dijital kartvizitinizi saniyeler içinde oluşturun. QR kod ve NFC uyumlu profesyonel profil sayfanız hazır.",
  keywords: [
    "dijital kartvizit oluştur", "ücretsiz kartvizit", "online kartvizit kayıt",
    "nfc kartvizit oluştur", "qr kod kartvizit yap", "dijital profil oluştur"
  ],
  openGraph: {
    title: "Ücretsiz Kayıt Ol - Kardly Dijital Kartvizit",
    description: "Hemen ücretsiz kayıt olun ve AI destekli dijital kartvizitinizi oluşturun.",
    url: "https://kardly.site/register",
    type: "website",
  },
  alternates: {
    canonical: "https://kardly.site/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
