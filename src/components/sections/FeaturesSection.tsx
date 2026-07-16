"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/context/LanguageContext"

interface FeaturesSectionProps {
  t: any
}

export function FeaturesSection({ t }: FeaturesSectionProps) {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-violet-50/50 via-white to-rose-50/50 text-slate-900 overflow-hidden">
      {/* Light subtle gradients */}
      <div className="absolute top-1/2 left-1/4 w-[35vw] h-[35vw] bg-[radial-gradient(circle,rgba(244,63,94,0.03),transparent_70%)] pointer-events-none" />

      <div className="mx-auto w-[90vw] max-w-[1504px] grid items-center gap-10 md:gap-12 lg:gap-16 md:grid-cols-2 md:[&>div:first-child]:order-2">
        
        {/* Text Column */}
        <div className="flex flex-col gap-6 max-md:items-center max-md:text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 shadow-sm w-fit">
            <Sparkles size={11} className="text-rose-500" />
            <span>Kolay Özelleştirme</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight text-balance">
            Profilinizi dakikalar içinde oluşturun ve özelleştirin
          </h2>

          <p className="text-slate-550 text-base md:text-lg max-w-[55ch] leading-relaxed font-semibold">
            Tüm sosyal medya hesaplarınızı, web sitelerinizi, portfolyonuzu ve iletişim kanallarınızı tek bir adreste toplayın. Kardly'nin hazır şablonlarıyla tarzınızı yansıtın.
          </p>

          <div className="flex flex-wrap items-center gap-3 max-md:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl px-8 py-4 text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-rose-500/10"
            >
              Ücretsiz Başla
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Visual Column: Profile Customization Mockup */}
        <div className="w-full">
          <div className="rounded-3xl overflow-hidden bg-white border border-slate-100 p-6 md:p-8 shadow-xl">
            {/* Mock Header */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="ml-3 text-[10px] text-slate-400 font-mono">kardly.site/admin</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Left: Settings Panel */}
              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Özellikler</div>
                
                {/* Toggle Rows */}
                {[
                  { label: "AI Asistan", active: true },
                  { label: "Randevu Sistemi", active: true },
                  { label: "QR Kod Paylaşımı", active: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50/50 border border-slate-100 rounded-xl px-3 py-2">
                    <span className="text-xs font-bold text-slate-650">{item.label}</span>
                    <div className={`w-8 h-4.5 rounded-full relative transition-colors ${item.active ? 'bg-rose-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all ${item.active ? 'left-[16px]' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}

                {/* Color Palette */}
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Tema Paleti</div>
                <div className="flex gap-1.5 flex-wrap">
                  {["bg-rose-500", "bg-indigo-500", "bg-emerald-500", "bg-amber-500"].map((c, i) => (
                    <div key={i} className={`w-6 h-6 rounded-lg ${c} ${i === 0 ? 'ring-2 ring-slate-900 ring-offset-2 ring-offset-white' : ''} cursor-pointer`} />
                  ))}
                </div>
              </div>

              {/* Right: Preview Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col items-center justify-center text-center">
                <div className="w-11 h-11 rounded-xl bg-rose-500 text-white flex items-center justify-center text-sm font-black mb-2.5">
                  LY
                </div>
                <div className="text-xs font-black text-slate-800">Lara Yıldız</div>
                <div className="text-[8px] text-slate-400 font-bold mb-3">UI/UX Designer</div>
                <div className="space-y-1.5 w-full">
                  <div className="bg-white border border-slate-100 rounded-lg py-1.5 text-[8px] font-bold text-slate-600 shadow-sm">Web Sitem</div>
                  <div className="bg-white border border-slate-100 rounded-lg py-1.5 text-[8px] font-bold text-slate-600 shadow-sm">LinkedIn</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
