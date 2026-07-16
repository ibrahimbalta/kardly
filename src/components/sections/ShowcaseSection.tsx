"use client"

import { ArrowRight, Share2 } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/context/LanguageContext"

interface ShowcaseSectionProps {
  t: any
}

export function ShowcaseSection({ t }: ShowcaseSectionProps) {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-white via-indigo-50/40 to-slate-50 text-slate-900 overflow-hidden">
      {/* Light subtle gradients */}
      <div className="absolute top-1/2 right-1/4 w-[35vw] h-[35vw] bg-[radial-gradient(circle,rgba(139,92,246,0.03),transparent_70%)] pointer-events-none" />

      <div className="mx-auto w-[90vw] max-w-[1504px] grid items-center gap-10 md:gap-12 lg:gap-16 md:grid-cols-2">
        
        {/* Text Column */}
        <div className="flex flex-col gap-6 max-md:items-center max-md:text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 shadow-sm w-fit">
            <Share2 size={11} className="text-indigo-500" />
            <span>Kolay Paylaşım</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight text-balance">
            Kardly linkinizi istediğiniz her yerde paylaşın
          </h2>

          <p className="text-slate-550 text-base md:text-lg max-w-[55ch] leading-relaxed font-semibold">
            Profilinizi Instagram, TikTok, LinkedIn gibi sosyal ağlarda paylaşın. Ayrıca basılı kartvizitlerinize ekleyebileceğiniz özel yüksek çözünürlüklü QR kodunuzu indirip kullanın.
          </p>

          <div className="flex flex-wrap items-center gap-3 max-md:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-2xl px-8 py-4 text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-indigo-550/10"
            >
              Ücretsiz Başla
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Visual Column: QR + Sharing Concept */}
        <div className="w-full">
          <div className="aspect-square w-full max-w-[420px] mx-auto relative flex items-center justify-center">
            
            {/* Soft decorative background circles */}
            <div className="absolute inset-4 rounded-full border border-slate-100/60 pointer-events-none" />
            <div className="absolute inset-16 rounded-full border border-slate-100/60 pointer-events-none" />

            {/* Central QR Mockup Card */}
            <div className="relative bg-white rounded-3xl border border-slate-100 shadow-xl flex flex-col items-center justify-center p-8 z-10 w-64 md:w-72">
              
              {/* QR Code Grid */}
              <div className="w-28 h-28 md:w-32 md:h-32 grid grid-cols-7 grid-rows-7 gap-[3px] mb-4">
                {Array.from({ length: 49 }).map((_, i) => {
                  const isCorner = (i < 3 && (Math.floor(i / 7) < 3 || i % 7 < 3)) ||
                    (i % 7 < 3 && Math.floor(i / 7) < 3) ||
                    (i % 7 > 3 && Math.floor(i / 7) < 3) ||
                    (i % 7 < 3 && Math.floor(i / 7) > 3)
                  const isData = Math.random() > 0.45
                  return (
                    <div
                      key={i}
                      className={`rounded-[2px] ${isCorner || isData ? 'bg-slate-800' : 'bg-transparent'}`}
                    />
                  )
                })}
              </div>
              <div className="text-xs font-black text-slate-800">kardly.site/isminiz</div>
              <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Hızlı Erişim</div>
            </div>

            {/* Floating Social badges */}
            {[
              { label: "Instagram", bg: "bg-rose-50 text-rose-600 border-rose-100", pos: "-top-2 left-6" },
              { label: "TikTok", bg: "bg-slate-900 text-white border-slate-800", pos: "top-10 right-4" },
              { label: "WhatsApp", bg: "bg-emerald-50 text-emerald-600 border-emerald-100", pos: "bottom-12 -right-4" },
              { label: "LinkedIn", bg: "bg-blue-50 text-blue-600 border-blue-100", pos: "bottom-0 left-8" },
            ].map((icon, i) => (
              <div 
                key={i} 
                className={`absolute ${icon.pos} px-3.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider shadow-sm z-20`}
              >
                {icon.label}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
