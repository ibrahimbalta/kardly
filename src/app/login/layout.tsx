import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "Kardly hesabınıza giriş yapın. Dijital kartvizitinizi yönetin, analitikleri görüntüleyin ve profilinizi güncelleyin.",
  openGraph: {
    title: "Giriş Yap - Kardly",
    description: "Kardly hesabınıza giriş yaparak dijital kartvizitinizi yönetin.",
    url: "https://kardly.site/login",
    type: "website",
  },
  alternates: {
    canonical: "https://kardly.site/login",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
