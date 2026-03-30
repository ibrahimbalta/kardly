import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description: "Kardly platformunun kullanım şartları ve koşulları. Dijital kartvizit hizmetimizi kullanmadan önce lütfen okuyun.",
  openGraph: {
    title: "Kullanım Şartları - Kardly",
    description: "Kardly platformunun kullanım şartları ve koşulları.",
    url: "https://kardly.site/kullanim-sartlari",
    type: "website",
  },
  alternates: {
    canonical: "https://kardly.site/kullanim-sartlari",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function KullanimSartlariLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
