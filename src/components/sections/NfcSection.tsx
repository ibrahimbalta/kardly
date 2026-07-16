"use client"

import { useTranslation } from "@/context/LanguageContext"

interface NfcSectionProps {
  t: any
}

const categories = [
  { word: "girişimciler", color: "text-rose-500" },
  { word: "tasarımcılar", color: "text-indigo-500" },
  { word: "avukatlar", color: "text-emerald-500" },
  { word: "doktorlar", color: "text-amber-500" },
  { word: "yazılımcılar", color: "text-sky-500" },
]

const carouselCards = [
  { name: "Ayşe Karaca", role: "Tasarımcı", initials: "AK", bg: "from-rose-500 to-pink-600", text: "text-white", user: "@aysekaraca", links: ["Portfolyo", "LinkedIn"] },
  { name: "Burak Şahin", role: "Yazılımcı", initials: "BŞ", bg: "from-indigo-500 to-violet-600", text: "text-white", user: "@burak.dev", links: ["GitHub", "LinkedIn"] },
  { name: "Ceren Yılmaz", role: "Diyetisyen", initials: "CY", bg: "from-emerald-500 to-teal-600", text: "text-white", user: "@cerenyilmaz", links: ["Randevu", "Hakkımda"] },
  { name: "Deniz Kaya", role: "Mimar", initials: "DK", bg: "from-amber-500 to-orange-600", text: "text-white", user: "@denizkaya", links: ["Projeler", "İletişim"] },
  { name: "Ece Demir", role: "Avukat", initials: "ED", bg: "from-sky-500 to-blue-600", text: "text-white", user: "@ecedemir", links: ["Danışmanlık", "Rehber"] },
]

export function NfcSection({ t }: NfcSectionProps) {
  const allCards = [...carouselCards, ...carouselCards]

  return (
    <section className="relative py-20 md:py-32 bg-white text-slate-900 overflow-hidden border-b border-slate-100">
      <style jsx>{`
        @keyframes rotateWords {
          0%, 16% { transform: translate3d(0, 0, 0); }
          20%, 36% { transform: translate3d(0, -100%, 0); }
          40%, 56% { transform: translate3d(0, -200%, 0); }
          60%, 76% { transform: translate3d(0, -300%, 0); }
          80%, 96% { transform: translate3d(0, -400%, 0); }
          100% { transform: translate3d(0, -500%, 0); }
        }
        @keyframes scrollCarousel {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      <div className="mx-auto w-[90vw] max-w-[1504px]">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">10.000+ kullanıcı</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Her sektörden binlerce
          </h2>

          {/* Rotating Words */}
          <div className="relative overflow-hidden h-[1.3em] text-4xl md:text-5xl font-black italic">
            <div
              className="flex flex-col"
              style={{
                animation: "rotateWords 12s ease-in-out infinite",
              }}
            >
              {[...categories, categories[0]].map((cat, i) => (
                <span key={i} className={`block h-[1.3em] leading-[1.3em] text-center ${cat.color}`}>
                  {cat.word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          className="flex items-stretch gap-6 px-6 md:px-12 hover:[animation-play-state:paused]"
          style={{
            animation: "scrollCarousel 35s linear infinite",
            width: "fit-content",
          }}
        >
          {allCards.map((card, i) => (
            <div
              key={i}
              className="shrink-0 w-[240px] md:w-[260px] aspect-[3/4.2] rounded-3xl overflow-hidden shadow-lg"
            >
              <div className={`w-full h-full bg-gradient-to-br ${card.bg} p-6 flex flex-col justify-between`}>
                {/* Top: Avatar + Info */}
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-base font-black mb-3">
                    {card.initials}
                  </div>
                  <div className="text-white text-sm font-black">{card.name}</div>
                  <div className="text-white/70 text-[10px] font-bold mt-0.5">{card.role}</div>
                </div>

                {/* Links */}
                <div className="space-y-2">
                  {card.links.map((link, j) => (
                    <div key={j} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/10 text-white text-[10px] font-black rounded-xl py-2.5 px-3 text-center transition-all cursor-pointer">
                      {link}
                    </div>
                  ))}
                </div>

                {/* Bottom Username Badge */}
                <div className="flex items-center justify-center">
                  <span className="bg-white/25 backdrop-blur-md border border-white/10 text-white rounded-full px-3.5 py-1 text-[9px] font-bold">
                    {card.user}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
