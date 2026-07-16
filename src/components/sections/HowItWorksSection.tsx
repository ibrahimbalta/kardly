"use client"

import { BarChart3 } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/context/LanguageContext"

interface HowItWorksSectionProps {
  t: any
  onPlayClick: () => void
}

export function HowItWorksSection({ t, onPlayClick }: HowItWorksSectionProps) {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/50 text-slate-900 overflow-hidden">
      
      <div className="mx-auto w-[90vw] max-w-[1504px] grid items-center gap-10 md:gap-12 lg:gap-16 md:grid-cols-2 md:[&>div:first-child]:order-2">
        
        {/* Text Column */}
        <div className="flex flex-col gap-6 max-md:items-center max-md:text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 shadow-sm w-fit">
            <BarChart3 size={11} className="text-emerald-500" />
            <span>Detaylı Analiz</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight text-balance">
            Kitlenizi analiz edin ve etkileşimde tutun
          </h2>

          <p className="text-slate-550 text-base md:text-lg max-w-[55ch] leading-relaxed font-semibold">
            Profilinizi kimlerin ziyaret ettiğini, hangi butonlara tıklandığını ve hangi şehirlerden giriş yapıldığını canlı olarak izleyin. Kitlenizi daha yakından tanıyıp etkileşimi artırın.
          </p>

          <div className="flex flex-wrap items-center gap-3 max-md:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 py-4 text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-emerald-500/10"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>

        {/* Visual Column: Analytics Dashboard Mockup */}
        <div className="w-full">
          <div className="rounded-3xl overflow-hidden bg-white border border-slate-100 p-6 md:p-8 shadow-xl">
            {/* Mock Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Performans Özeti</span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Ziyaretçi", value: "1.2K", change: "+12%" },
                { label: "Tıklamalar", value: "348", change: "+8%" },
                { label: "Kayıtlar", value: "94", change: "+20%" },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50/50 border border-slate-100/60 rounded-xl p-3">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                  <div className="text-lg font-black text-slate-800 mt-1">{stat.value}</div>
                  <div className="text-[9px] font-bold text-emerald-500 mt-0.5">{stat.change}</div>
                </div>
              ))}
            </div>

            {/* Simple Bar Chart */}
            <div className="mb-6">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Günlük Dağılım</div>
              <div className="flex items-end gap-2.5 h-20">
                {[30, 50, 40, 75, 55, 90, 65].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-md transition-all ${i === 5 ? 'bg-emerald-500' : 'bg-slate-200'}`}
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[7px] text-slate-400 font-bold uppercase">
                      {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Line Chart */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Haftalık Trend</span>
                <span className="text-[9px] font-black text-emerald-500">↑ %18.4</span>
              </div>
              <svg viewBox="0 0 200 35" className="w-full text-emerald-500">
                <path d="M0,30 Q25,25 40,22 T80,14 T120,18 T160,8 T200,4 V35 H0 Z" fill="rgba(16,185,129,0.05)" />
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  points="0,30 40,22 80,14 120,18 160,8 200,4"
                />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
