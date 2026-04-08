import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kardly | AI Destekli Dijital Kartvizit ve Mini Site Oluşturucu",
    template: "%s | Kardly"
  },
  description: "Kardly ile saniyeler içinde yapay zeka destekli dijital kartvizit ve kişisel mini site oluşturun. QR kod ve NFC uyumlu profesyonel profil sayfası ile yeni nesil temassız iletişim.",
  keywords: [
    "dijital kartvizit", "nfc kartvizit", "qr kod kartvizit", "akıllı kartvizit", "elektronik kartvizit", 
    "vcard", "profil oluşturucu", "portfolio builder", "temassız kartvizit", "yeni nesil kartvizit", 
    "dijital kimlik", "akıllı kimlik", "digital business card", "nfc card", "qr business card"
  ],
  authors: [{ name: "Kardly Team", url: "https://kardly.site" }],
  creator: "Kardly",
  publisher: "Kardly",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Kardly | AI Destekli Profesyonel Dijital Kimliğinizi Oluşturun",
    description: "NFC ve QR destekli yeni nesil dijital kartvizit platformu. Ücretsiz profesyonel profilinizi oluşturun ve paylaşın.",
    url: "https://kardly.site",
    siteName: "Kardly",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kardly Dijital Kartvizit Oluşturucu",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kardly | AI Destekli Yeni Nesil Dijital Kartvizit",
    description: "Saniyeler içinde profesyonel dijital kartvizitinizi oluşturun. QR ve NFC uyumlu akıllı çözümler.",
    images: ["/images/og-image.png"],
    creator: "@kardlysite",
  },
  alternates: {
    canonical: "https://kardly.site",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FF3B6B" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { PWAInstallPrompt, OfflineIndicator } from "@/components/PWAProvider";
import { CookieBanner } from "@/components/CookieBanner";
import prisma from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;
  try {
    settings = await prisma.globalSettings.findUnique({
      where: { id: "main" }
    })
  } catch (error) {
    console.error("Prisma Settings Error:", error);
  }

  return (
    <html lang="tr">
      <head>
        {/* DNS Prefetch & Preconnect for External Resources */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://ui-avatars.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA Meta Tags */}
        <link rel="icon" href="/icons/favicon.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/icons/icon-192x192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
        {/* AdSense & Analytics */}
        {settings?.adSenseCode && (
          <script dangerouslySetInnerHTML={{ __html: settings.adSenseCode }} />
        )}
        {settings?.analyticsCode && (
          <script dangerouslySetInnerHTML={{ __html: settings.analyticsCode }} />
        )}
        {settings?.customCss && (
          <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
        )}
        {/* Splash screen color */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Kardly" />
        {/* MS Tile */}
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="msapplication-TileColor" content="#030712" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LanguageProvider>
            {/* Structured Data (SEO) */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify([
                  {
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "Kardly",
                    "url": "https://kardly.site",
                    "logo": "https://kardly.site/icons/icon-512x512.png",
                    "description": "AI destekli dijital kartvizit ve mini site oluşturucu platform.",
                    "sameAs": [
                      "https://instagram.com/kardlysite",
                      "https://twitter.com/kardlysite",
                      "https://linkedin.com/company/kardly"
                    ],
                    "contactPoint": {
                      "@type": "ContactPoint",
                      "contactType": "customer service",
                      "url": "https://kardly.site/iletisim",
                      "availableLanguage": ["Turkish", "English"]
                    }
                  },
                  {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "Kardly",
                    "url": "https://kardly.site",
                    "description": "Yapay zeka destekli dijital kartvizit ve kişisel mini site oluşturucu.",
                    "inLanguage": "tr",
                    "potentialAction": {
                      "@type": "SearchAction",
                      "target": "https://kardly.site/?q={search_term_string}",
                      "query-input": "required name=search_term_string"
                    }
                  },
                  {
                    "@context": "https://schema.org",
                    "@type": "WebApplication",
                    "name": "Kardly",
                    "url": "https://kardly.site",
                    "applicationCategory": "BusinessApplication",
                    "operatingSystem": "Web",
                    "offers": {
                      "@type": "Offer",
                      "price": "0",
                      "priceCurrency": "TRY",
                      "description": "Ücretsiz dijital kartvizit oluşturma"
                    },
                    "featureList": [
                      "AI destekli dijital kartvizit oluşturma",
                      "QR kod ve NFC uyumlu paylaşım",
                      "Profesyonel şablonlar",
                      "Gerçek zamanlı analitik",
                      "Kişisel mini site",
                      "Online ödeme entegrasyonu"
                    ]
                  },
                  {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                      { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://kardly.site/" },
                      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://kardly.site/blog" },
                      { "@type": "ListItem", "position": 3, "name": "SSS", "item": "https://kardly.site/sss" },
                      { "@type": "ListItem", "position": 4, "name": "İletişim", "item": "https://kardly.site/iletisim" }
                    ]
                  }
                ])
              }}
            />
            {children}
            <CookieBanner />
            <PWAInstallPrompt />
            <OfflineIndicator />
            {settings?.customJs && (
              <div dangerouslySetInnerHTML={{ __html: settings.customJs }} />
            )}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
