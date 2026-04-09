"use client"

import { motion } from "framer-motion"
import { Zap, Play, MousePointer2, Palette, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface HowItWorksSectionProps {
  t: any
  onPlayClick: () => void
}

export function HowItWorksSection({ t, onPlayClick }: HowItWorksSectionProps) {
  return (
    <section className="py-20 md:py-28 px-6 relative z-10">
      {/* Decorative mesh background */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4, backgroundImage: 'radial-gradient(at 20% 80%, rgba(244,63,94,0.08) 0%, transparent 50%), radial-gradient(at 80% 20%, rgba(99,102,241,0.06) 0%, transparent 50%)' }} />
      
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-rose-50 to-indigo-50 border border-rose-100/50 mb-6"
          >
            <Zap size={13} className="text-rose-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">{t('howItWorks')}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-5xl md:text-[7.5rem] font-black tracking-[-0.07em] text-slate-950 mb-8 leading-[0.82] select-none"
          >
            {t('buildProfileTitle').split(' ').map((word: string, i: number) => (
              <span key={i} className={cn("inline-block mr-[0.2em]", i % 2 === 1 ? "italic font-light opacity-50" : "italic")}>{word}</span>
            ))}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >{t('buildProfileDesc')}</motion.p>
          
          <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
          >
              <button
                  onClick={onPlayClick}
                  className="group flex items-center gap-6 px-1.5 py-1.5 pr-8 bg-white border border-slate-200/60 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:border-slate-300 transition-all duration-500 active:scale-95"
              >
                  <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 overflow-hidden relative">
                       <div className="absolute inset-0 bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                       <Play size={24} className="relative z-10 fill-rose-500 group-hover:fill-white group-hover:text-white transition-all duration-500 translate-x-0.5" />
                  </div>
                  <span className="text-sm font-black text-slate-900 tracking-tight uppercase italic">{t('nasıl_çalışır_btn') || "Nasıl Çalışır?"}</span>
              </button>
          </motion.div>
        </div>

        {/* Timeline Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-[72px] left-[16.6%] right-[16.6%] h-[2px]">
            <motion.div
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full origin-left"
              style={{ background: 'linear-gradient(90deg, #f43f5e, #8b5cf6, #06b6d4)' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {[
              { step: '01', title: t('step1Title'), desc: t('step1Desc'), icon: <MousePointer2 size={22} />, gradient: 'from-rose-500 to-pink-500', glow: 'shadow-rose-500/20' },
              { step: '02', title: t('step2Title'), desc: t('step2Desc'), icon: <Palette size={22} />, gradient: 'from-violet-500 to-indigo-500', glow: 'shadow-violet-500/20' },
              { step: '03', title: t('step3Title'), desc: t('step3Desc'), icon: <Share2 size={22} />, gradient: 'from-cyan-500 to-teal-500', glow: 'shadow-cyan-500/20' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative group"
              >
                {/* Step circle on timeline */}
                <div className="flex justify-center mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-[56px] h-[56px] rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-xl ${item.glow} relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500`}
                  >
                    {item.icon}
                  </motion.div>
                </div>

                {/* Card */}
                <div className="relative bg-white/40 backdrop-blur-3xl rounded-[40px] p-10 md:p-12 border border-white/50 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group-hover:bg-white/60 transition-all duration-700 group-hover:-translate-y-2">
                  {/* Step number: Vertical floating label */}
                  <div className="absolute -left-4 top-12 -rotate-90 origin-center opacity-20 group-hover:opacity-100 transition-opacity">
                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                      {t('step')} {item.step}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-950 mb-4 tracking-tighter leading-tight italic">{item.title}</h3>
                  <p className="text-slate-500 text-[14px] leading-relaxed font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
