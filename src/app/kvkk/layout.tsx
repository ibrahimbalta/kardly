import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Kardly KVKK aydınlatma metni. 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında haklarınız.",
  openGraph: {
    title: "KVKK Aydınlatma Metni - Kardly",
    description: "Kardly KVKK aydınlatma metni ve kişisel verilerin korunması hakkında bilgi.",
    url: "https://kardly.site/kvkk",
    type: "website",
  },
  alternates: {
    canonical: "https://kardly.site/kvkk",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function KVKKLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
