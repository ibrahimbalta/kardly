"use client"

import { motion } from "framer-motion"
import { Users, Sparkles, Globe, Shield, Zap } from "lucide-react"

interface AboutSectionProps {
  t: any
}

export function AboutSection({ t }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 md:py-28 px-6 relative z-10">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(at 0% 0%, rgba(244,63,94,0.03) 0%, transparent 40%), radial-gradient(at 100% 100%, rgba(99,102,241,0.03) 0%, transparent 40%)' }} />
      
      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 mb-6">
              <Users size={14} className="text-rose-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">{t('about')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              {t('aboutTitle')}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              {t('aboutDescription')}
            </p>
            
            <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-rose-500" />
                {t('aboutPurpose')}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                {t('aboutPurposeDesc')}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-10">{t('aboutHowItWorksTitle')}</h3>
            
            {[
              { title: t('aboutPoint1Title'), desc: t('aboutPoint1Desc'), icon: <Globe className="text-rose-500" /> },
              { title: t('aboutPoint2Title'), desc: t('aboutPoint2Desc'), icon: <Shield className="text-indigo-500" /> },
              { title: t('aboutPoint3Title'), desc: t('aboutPoint3Desc'), icon: <Zap className="text-amber-500" /> }
            ].map((point, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  {point.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{point.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{point.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
