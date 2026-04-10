"use client"

import { motion } from "framer-motion"
import { 
  ArrowRight, 
  Briefcase, 
  CheckCircle2, 
  FileText, 
  CreditCard, 
  Calendar, 
  BarChart3, 
  Palette, 
  QrCode, 
  Shield 
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FeaturesSectionProps {
  t: any
}

export function FeaturesSection({ t }: FeaturesSectionProps) {
  return (
    <section id="features" className="py-20 md:py-28 px-6 relative z-10">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-rose-100 blur-[100px] rounded-full opacity-80"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[55%] bg-indigo-100/80 blur-[100px] rounded-full opacity-70"
        />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
          <div className="max-w-xl text-left">
            <motion.div
              initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
              className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"
            >
              <div className="w-8 h-px bg-rose-500" /> {t('features')}
            </motion.div>
            <h2 className="text-4xl md:text-[5rem] font-black text-slate-950 tracking-[-0.05em] leading-[0.9] mb-6 italic">
              {t('featuresTitle').split(' ').map((w: string, i: number) => (
                <span key={i} className={i % 2 === 0 ? "text-slate-950" : "text-slate-400 font-light"}>{w} </span>
              ))}
            </h2>
            <p className="text-slate-500 text-base font-medium leading-relaxed max-w-sm">
              {t('featuresDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 lg:gap-6">
          {[
            { 
              icon: <Palette size={24} />, 
              title: t('f7Title'), 
              desc: 'Görsel kimliğinizi yansıtan premium temalar.',
              color: 'pink', 
              className: 'md:col-span-2 md:row-span-1 bg-gradient-to-br from-pink-500/10 to-rose-500/10'
            },
            { 
              icon: <BarChart3 size={24} />, 
              title: t('f6Title'), 
              desc: 'Gerçek zamanlı etkileşim verileri.',
              color: 'purple', 
              className: 'md:col-span-2 md:row-span-2 bg-gradient-to-br from-purple-500/10 to-indigo-500/10'
            },
            { 
              icon: <Calendar size={24} />, 
              title: t('f5Title'), 
              desc: 'Randevu ve takvim entegrasyonu.',
              color: 'indigo', 
              className: 'md:col-span-2 md:row-span-1 bg-gradient-to-br from-indigo-500/10 to-blue-500/10'
            },
            { 
              icon: <QrCode size={20} />, 
              title: t('f8Title'), 
              color: 'sky', 
              className: 'md:col-span-1 md:row-span-1 bg-gradient-to-br from-sky-500/10 to-teal-500/10'
            },
            { 
              icon: <Shield size={20} />, 
              title: t('f9Title'), 
              color: 'teal', 
              className: 'md:col-span-1 md:row-span-1 bg-gradient-to-br from-teal-500/10 to-emerald-500/10'
            },
          ].map((f, i) => {
            const themeMap = {
              pink: { icon: 'bg-pink-500', text: 'text-pink-950' },
              purple: { icon: 'bg-purple-500', text: 'text-purple-950' },
              indigo: { icon: 'bg-indigo-500', text: 'text-indigo-950' },
              sky: { icon: 'bg-sky-500', text: 'text-sky-950' },
              teal: { icon: 'bg-teal-500', text: 'text-teal-950' }
            };
            
            const theme = themeMap[f.color as keyof typeof themeMap] || { icon: 'bg-slate-500', text: 'text-slate-950' };

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "group relative overflow-hidden rounded-[2.5rem] border border-white/40 p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]",
                  f.className
                )}
              >
                <div className="relative z-10 h-full flex flex-col">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500",
                    theme.icon
                  )}>
                    {f.icon}
                  </div>
                  
                  <div>
                    <h3 className={cn("text-xl md:text-2xl font-black tracking-tight leading-tight mb-2 italic", theme.text)}>
                      {f.title}
                    </h3>
                    {'desc' in f && (
                      <p className="text-slate-500/80 text-sm font-medium leading-relaxed max-w-[200px]">
                        {f.desc}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", theme.text)}>Detaylı İncele</span>
                    <ArrowRight size={14} className={theme.text} />
                  </div>
                </div>
                
                {/* Decorative Shape */}
                <div className={cn(
                  "absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-20 transition-all duration-700 group-hover:scale-150",
                  theme.icon
                )} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
