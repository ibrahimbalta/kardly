"use client"

import { motion } from "framer-motion"
import { 
  Zap, 
  Scale, 
  Stethoscope, 
  Palette, 
  Code2, 
  MapPin, 
  Instagram, 
  Coffee, 
  BookOpen, 
  Heart, 
  ShoppingCart, 
  Camera 
} from "lucide-react"

interface IndustriesSectionProps {
  t: any
}

export function IndustriesSection({ t }: IndustriesSectionProps) {
  return (
    <section id="industries" className="py-20 md:py-28 px-6 relative z-10">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 border border-indigo-100/50 mb-6"
          >
            <Zap size={13} className="text-indigo-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-600">{t('industriesTitle')}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 mb-6 leading-none italic"
          >{t('industriesTitle')}</motion.h2>
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">{t('industriesSubTitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {[
            { label: t('industryLaw'), icon: <Scale />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
            { label: t('industryHealth'), icon: <Stethoscope />, color: 'bg-rose-50 text-rose-600 border-rose-100' },
            { label: t('industryCreative'), icon: <Palette />, color: 'bg-violet-50 text-violet-600 border-violet-100' },
            { label: t('industryIT'), icon: <Code2 />, color: 'bg-sky-50 text-sky-600 border-sky-100' },
            { label: t('industryRealEstate'), icon: <MapPin />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
            { label: t('industryInfluencer'), icon: <Instagram />, color: 'bg-pink-50 text-pink-600 border-pink-100' },
            { label: t('industryFood'), icon: <Coffee />, color: 'bg-orange-50 text-orange-600 border-orange-100' },
            { label: t('industryEducation'), icon: <BookOpen />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
            { label: t('industryBeauty'), icon: <Heart />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
            { label: t('industryTrade'), icon: <ShoppingCart />, color: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100' },
            { label: t('industryArtist'), icon: <Camera />, color: 'bg-slate-50 text-slate-600 border-slate-100' },
            { label: t('industrySport'), icon: <Zap />, color: 'bg-teal-50 text-teal-600 border-teal-100' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`group relative p-6 rounded-3xl border ${item.color} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 transition-transform group-hover:rotate-6 group-hover:scale-110">
                {item.icon}
              </div>
              <span className="text-[11px] md:text-xs font-black uppercase tracking-widest leading-tight">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
