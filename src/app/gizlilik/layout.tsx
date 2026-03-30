import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Kardly gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında detaylı bilgi.",
  openGraph: {
    title: "Gizlilik Politikası - Kardly",
    description: "Kardly gizlilik politikası ve kişisel verilerin korunması hakkında bilgi.",
    url: "https://kardly.site/gizlilik",
    type: "website",
  },
  alternates: {
    canonical: "https://kardly.site/gizlilik",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GizlilikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
