"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Briefcase, Palette, BarChart3, QrCode } from "lucide-react"

interface ShowcaseSectionProps {
  t: any
}

export function ShowcaseSection({ t }: ShowcaseSectionProps) {
  return (
    <section className="py-20 md:py-28 px-6 relative z-10">
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
        {/* Text Area */}
        <div className="flex-1 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 mb-6">
            <Sparkles size={11} className="text-rose-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-600">{t('dive1Label')}</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-black text-slate-950 tracking-[-0.05em] leading-[0.9] mb-8 italic">
            {t('dive1Title').split(' ').map((w: string, i: number) => (
              <span key={i} className={i % 2 === 1 ? "opacity-30 font-light" : ""}>{w} </span>
            ))}
          </h3>
          <p className="text-slate-500 text-base leading-relaxed mb-10 max-w-sm font-medium">{t('dive1Desc')}</p>
          <div className="flex flex-wrap gap-2">
            {(t('dive1List') as unknown as string[]).slice(0, 3).map((text: string, i: number) => (
              <div key={i} className="text-[10px] font-bold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg bg-white shadow-sm">
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Visual Block */}
        <div className="flex-[1.5] w-full">
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1: Project Stats */}
            <motion.div
              whileHover={{ y: -5 }}
              className="group relative rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-6 text-white shadow-xl shadow-rose-200/40 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase size={18} />
                </div>
                <div className="text-3xl font-black mb-1">24+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">{t('f1Title')}</div>
                <div className="flex items-end gap-1 mt-4 h-8">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/20 rounded-t-sm transition-all group-hover:bg-white/30" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card 2: Template Preview Mock */}
            <motion.div
              whileHover={{ y: -5 }}
              className="group relative rounded-2xl bg-white border border-slate-100 p-6 shadow-lg shadow-slate-100/50 overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                  <Palette size={18} />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{t('f7Title')}</div>
                <div className="flex gap-2">
                  {['bg-gradient-to-br from-violet-500 to-indigo-600', 'bg-gradient-to-br from-rose-500 to-pink-500', 'bg-gradient-to-br from-amber-400 to-orange-500'].map((grad, i) => (
                    <div key={i} className={`flex-1 h-16 rounded-lg ${grad} shadow-sm opacity-80 group-hover:opacity-100 transition-opacity`}>
                      <div className="w-4 h-4 bg-white/30 rounded-full mx-auto mt-3" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card 3: Analytics Mock */}
            <motion.div
              whileHover={{ y: -5 }}
              className="group relative rounded-2xl bg-[#0f172a] p-6 text-white shadow-xl overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 size={18} />
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+14.2%</div>
                </div>
                <div className="text-[10px] font-bold text-slate-500 mb-3">{t('f6Title')}</div>
                <svg viewBox="0 0 100 30" className="w-full h-8 text-cyan-500">
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    points="0,25 15,20 25,22 35,15 50,18 60,8 75,12 85,5 100,10"
                  />
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(34,211,238)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(34,211,238)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>

            {/* Card 4: QR & Share */}
            <motion.div
              whileHover={{ y: -5 }}
              className="group relative rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/50 p-6 shadow-lg shadow-amber-100/30 overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-amber-200">
                  <QrCode size={18} />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-amber-700/60 mb-3">{t('f8Title')}</div>
                <div className="grid grid-cols-5 gap-1 w-fit">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm transition-colors ${
                        [0,1,2,4,5,6,10,12,14,15,18,20,21,22,24].includes(i)
                          ? 'bg-amber-800/70 group-hover:bg-amber-600'
                          : 'bg-amber-200/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
