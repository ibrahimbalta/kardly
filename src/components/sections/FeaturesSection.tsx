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

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative">
          {[
            { icon: <Briefcase size={22} />, title: t('f1Title'), color: 'rose', delay: 0 },
            { icon: <CheckCircle2 size={22} />, title: t('f2Title'), color: 'amber', delay: 0.1 },
            { icon: <FileText size={22} />, title: t('f3Title'), color: 'blue', delay: 0.2 },
            { icon: <CreditCard size={22} />, title: t('f4Title'), color: 'emerald', delay: 0.3 },
            { icon: <Calendar size={22} />, title: t('f5Title'), color: 'indigo', delay: 0.4 },
            { icon: <BarChart3 size={22} />, title: t('f6Title'), color: 'purple', delay: 0.5 },
            { icon: <Palette size={22} />, title: t('f7Title'), color: 'pink', delay: 0.6 },
            { icon: <QrCode size={22} />, title: t('f8Title'), color: 'sky', delay: 0.7 },
            { icon: <Shield size={22} />, title: t('f9Title'), color: 'teal', delay: 0.8 },
          ].map((f, i) => {
            const themeMap = {
              rose: { bg: 'from-rose-500/10 to-rose-500/5', icon: 'bg-rose-500', glow: 'shadow-rose-500/20', text: 'text-rose-950', shape: 'bg-rose-500/5' },
              amber: { bg: 'from-amber-500/10 to-amber-500/5', icon: 'bg-amber-500', glow: 'shadow-amber-500/20', text: 'text-amber-950', shape: 'bg-amber-500/5' },
              blue: { bg: 'from-blue-500/10 to-blue-500/5', icon: 'bg-blue-500', glow: 'shadow-blue-500/20', text: 'text-blue-950', shape: 'bg-blue-500/5' },
              emerald: { bg: 'from-emerald-500/10 to-emerald-500/5', icon: 'bg-emerald-500', glow: 'shadow-emerald-500/20', text: 'text-emerald-950', shape: 'bg-emerald-500/5' },
              indigo: { bg: 'from-indigo-500/10 to-indigo-500/5', icon: 'bg-indigo-500', glow: 'shadow-indigo-500/20', text: 'text-indigo-950', shape: 'bg-indigo-500/5' },
              purple: { bg: 'from-purple-500/10 to-purple-500/5', icon: 'bg-purple-500', glow: 'shadow-purple-500/20', text: 'text-purple-950', shape: 'bg-purple-500/5' },
              pink: { bg: 'from-pink-500/10 to-pink-500/5', icon: 'bg-pink-500', glow: 'shadow-pink-500/20', text: 'text-pink-950', shape: 'bg-pink-500/5' },
              sky: { bg: 'from-sky-500/10 to-sky-500/5', icon: 'bg-sky-500', glow: 'shadow-sky-500/20', text: 'text-sky-950', shape: 'bg-sky-500/5' },
              teal: { bg: 'from-teal-500/10 to-teal-500/5', icon: 'bg-teal-500', glow: 'shadow-teal-500/20', text: 'text-teal-950', shape: 'bg-teal-500/5' }
            };
            
            const theme = themeMap[f.color as keyof typeof themeMap] || { bg: 'bg-slate-50', icon: 'bg-slate-500', glow: 'shadow-slate-500/20', text: 'text-slate-950', shape: 'bg-slate-500/5' };

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: f.delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "group relative min-h-[140px] p-8 rounded-[40px] overflow-hidden transition-all duration-700",
                  i % 3 === 1 ? "lg:translate-y-12" : "",
                  i % 3 === 2 ? "lg:translate-y-24" : ""
                )}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br backdrop-blur-2xl border border-white/40 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 group-hover:scale-[1.02]",
                  theme.bg
                )} />
                
                <div className="relative z-10 flex flex-col items-start gap-5">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110",
                    theme.icon, theme.glow
                  )}>
                    {f.icon}
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className={cn("text-lg font-black tracking-tighter leading-none italic", theme.text)}>
                      {f.title}
                    </h3>
                    <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                       <div className={cn("h-1 w-8 rounded-full", theme.icon)} />
                       <ArrowRight size={12} className={theme.text} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
