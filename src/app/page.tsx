"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
// Build trigger: 2026-03-07T09:22:00
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import {
  Layout,
  Shield,
  ArrowRight,
  Sparkles,
  Smartphone,
  QrCode,
  BarChart3,
  Briefcase,
  Calendar,
  Star,
  CheckCircle2,
  FileText,
  CreditCard,
  Palette,
  Eye,
  Share2,
  Zap,
  MousePointer2,
  Globe,
  Users,
  ChevronRight,
  Check,
  Instagram,
  Twitter,
  Linkedin,
  Play
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/context/LanguageContext"
import { HowItWorksModal } from "@/components/HowItWorksModal"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  })
}

export default function Home() {
  const { t } = useTranslation()
  const [newsEmail, setNewsEmail] = useState("")
  const [newsStatus, setNewsStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false)

  const handleNewsletter = async (e: FormEvent) => {
    e.preventDefault()
    if (!newsEmail || newsStatus === "loading") return
    
    setNewsStatus("loading")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsEmail })
      })
      if (res.ok) {
        setNewsStatus("success")
        setNewsEmail("")
      } else {
        setNewsStatus("error")
      }
    } catch (err) {
      setNewsStatus("error")
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-rose-100 selection:text-rose-600 overflow-x-hidden">
      <Navbar />
      <Hero onHowItWorksClick={() => setIsHowItWorksOpen(true)} />

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-32 md:py-40 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
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
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]"
            >{t('buildProfileTitle')}</motion.h2>
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
                    onClick={() => setIsHowItWorksOpen(true)}
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
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-[28px] p-8 md:p-10 border border-slate-200/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] group-hover:border-slate-300/80 transition-all duration-500 group-hover:-translate-y-1">
                    {/* Step number */}
                    <div className={`text-[11px] font-extrabold uppercase tracking-[0.2em] bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-4`}>
                      Step {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 text-[15px] leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ─── FEATURES: COMPACT TECH HUB ─── */}
      <section id="features" className="py-24 px-6 relative overflow-hidden border-b border-slate-100" style={{ background: 'linear-gradient(135deg, #fff 0%, #fdf2f8 30%, #eef2ff 70%, #fff 100%)' }}>
        {/* Animated Background Effects - Visible Wavy Feel */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Rose blob - top left */}
          <motion.div
            animate={{
              x: [0, 60, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-rose-100 blur-[100px] rounded-full opacity-80"
          />
          {/* Indigo blob - bottom right */}
          <motion.div
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[55%] bg-indigo-100/80 blur-[100px] rounded-full opacity-70"
          />
          {/* Center accent blob */}
          <motion.div
            animate={{
              x: [0, 20, -20, 0],
              y: [0, -15, 15, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-violet-100/50 blur-[80px] rounded-full opacity-60"
          />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          
          {/* Organic Wave SVG - bottom */}
          <div className="absolute bottom-0 left-0 w-full opacity-[0.06]">
            <svg viewBox="0 0 1440 320" className="w-full" preserveAspectRatio="none">
              <path fill="#6366f1" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,229.3C840,235,960,213,1080,197.3C1200,181,1320,171,1380,165.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>
          </div>
          {/* Second wave layer */}
          <div className="absolute bottom-0 left-0 w-full opacity-[0.04]">
            <svg viewBox="0 0 1440 320" className="w-full" preserveAspectRatio="none">
              <path fill="#f43f5e" d="M0,288L60,272C120,256,240,224,360,218.7C480,213,600,235,720,245.3C840,256,960,256,1080,234.7C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>
          </div>
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
              <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter leading-none mb-4 italic">
                {t('featuresTitle')}
              </h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {t('featuresDesc')}
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                Hub v2.0
              </div>
            </div>
          </div>

          {/* Ultra-Compact Micro-Tile Grid - Light Theme */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: <Briefcase size={18} />, title: t('f1Title'), bg: 'group-hover:bg-rose-500' },
              { icon: <CheckCircle2 size={18} />, title: t('f2Title'), bg: 'group-hover:bg-amber-500' },
              { icon: <FileText size={18} />, title: t('f3Title'), bg: 'group-hover:bg-blue-500' },
              { icon: <CreditCard size={18} />, title: t('f4Title'), bg: 'group-hover:bg-emerald-500' },
              { icon: <Calendar size={18} />, title: t('f5Title'), bg: 'group-hover:bg-indigo-500' },
              { icon: <BarChart3 size={18} />, title: t('f6Title'), bg: 'group-hover:bg-purple-500' },
              { icon: <Palette size={18} />, title: t('f7Title'), bg: 'group-hover:bg-pink-500' },
              { icon: <QrCode size={18} />, title: t('f8Title'), bg: 'group-hover:bg-sky-500' },
              { icon: <Shield size={18} />, title: t('f9Title'), bg: 'group-hover:bg-teal-500' },
            ].map((f, i) => {
              const colors = [
                { bg: 'bg-rose-50', border: 'border-rose-100', accent: 'bg-rose-500', shadow: 'shadow-rose-100' },
                { bg: 'bg-indigo-50', border: 'border-indigo-100', accent: 'bg-indigo-500', shadow: 'shadow-indigo-100' },
                { bg: 'bg-violet-50', border: 'border-violet-100', accent: 'bg-violet-500', shadow: 'shadow-violet-100' },
                { bg: 'bg-emerald-50', border: 'border-emerald-100', accent: 'bg-emerald-500', shadow: 'shadow-emerald-100' },
                { bg: 'bg-amber-50', border: 'border-amber-100', accent: 'bg-amber-500', shadow: 'shadow-amber-100' },
                { bg: 'bg-cyan-50', border: 'border-cyan-100', accent: 'bg-cyan-500', shadow: 'shadow-cyan-100' },
                { bg: 'bg-fuchsia-50', border: 'border-fuchsia-100', accent: 'bg-fuchsia-500', shadow: 'shadow-fuchsia-100' },
                { bg: 'bg-orange-50', border: 'border-orange-100', accent: 'bg-orange-500', shadow: 'shadow-orange-100' },
                { bg: 'bg-sky-50', border: 'border-sky-100', accent: 'bg-sky-500', shadow: 'shadow-sky-100' }
              ][i] || { bg: 'bg-slate-50', border: 'border-slate-100', accent: 'bg-slate-500', shadow: 'shadow-slate-100' };

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="group relative h-[84px] cursor-pointer"
                >
                  <div className={`absolute inset-0 ${colors.bg} border ${colors.border} rounded-[24px] shadow-sm transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-lg ${colors.shadow}`} />
                  
                  <div className="relative h-full flex items-center p-2.5">
                    <div className="flex items-center gap-4 w-full h-full rounded-[20px] p-2 pr-6 overflow-hidden">
                      {/* Icon Container with matching accent */}
                      <div className={`relative shrink-0 w-12 h-12 rounded-[16px] ${colors.accent} border-2 border-white/20 shadow-sm flex items-center justify-center transition-all duration-500 group-hover:rotate-6`}>
                         <span className="text-white">{f.icon}</span>
                      </div>

                      {/* Text Container: Increased font size */}
                      <div className="flex-1">
                        <div className="inline-block relative">
                           <h3 className="relative z-10 text-[15px] font-black text-slate-950 tracking-tight leading-none">
                             {f.title}
                           </h3>
                        </div>
                      </div>

                      <div className="opacity-30 group-hover:opacity-100 transition-all duration-300">
                         <ArrowRight size={12} className="text-slate-400 group-hover:text-slate-900" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SHOWCASE: COMPACT REFINED TILES ─── */}
      <section className="py-24 px-6 bg-slate-50/50 relative overflow-hidden border-b border-slate-100">
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Text: Compact and Side-by-Side on Desktop */}
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 mb-6">
              <Sparkles size={11} className="text-rose-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-600">{t('dive1Label')}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter leading-none mb-6 italic">{t('dive1Title')}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">{t('dive1Desc')}</p>
            <div className="flex flex-wrap gap-2">
              {(t('dive1List') as unknown as string[]).slice(0, 3).map((text, i) => (
                <div key={i} className="text-[10px] font-bold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg bg-white shadow-sm">
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Visual Block - No Images */}
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
                  {/* Mini bar chart */}
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
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-indigo-50 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                    <Palette size={18} />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{t('f7Title')}</div>
                  {/* Mock template cards */}
                  <div className="flex gap-2">
                    {['bg-gradient-to-br from-violet-500 to-indigo-600', 'bg-gradient-to-br from-rose-500 to-pink-500', 'bg-gradient-to-br from-amber-400 to-orange-500'].map((grad, i) => (
                      <div key={i} className={`flex-1 h-16 rounded-lg ${grad} shadow-sm opacity-80 group-hover:opacity-100 transition-opacity`}>
                        <div className="w-4 h-4 bg-white/30 rounded-full mx-auto mt-3" />
                        <div className="w-6 h-1 bg-white/20 rounded-full mx-auto mt-1.5" />
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
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 size={18} />
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+14.2%</div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 mb-3">{t('f6Title')}</div>
                  {/* Mini line chart */}
                  <svg viewBox="0 0 100 30" className="w-full h-8 text-cyan-500">
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="0,25 15,20 25,22 35,15 50,18 60,8 75,12 85,5 100,10"
                    />
                    <polyline
                      fill="url(#chartFill)"
                      stroke="none"
                      points="0,25 15,20 25,22 35,15 50,18 60,8 75,12 85,5 100,10 100,30 0,30"
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
                  {/* Mock QR pattern */}
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


      {/* ─── FEATURE DEEP DIVE ─── */}
      <section className="py-24 md:py-32 px-6 bg-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, 60, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-violet-100/30 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-50/40 rounded-full blur-[120px]"
          />
        </div>
        
        <div className="max-w-5xl mx-auto space-y-24 relative">

          {/* Feature 2: Stats & Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1 w-full order-2 md:order-1">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/40">
                <div className="bg-[#0f172a] p-5 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t('last30Days')}</div>
                    <div className="flex gap-1">
                      {[1,2,3].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-slate-800" />)}
                    </div>
                  </div>
                  <div className="flex items-end gap-1 h-32 mb-6">
                    {[30, 60, 45, 80, 50, 95, 70, 40, 85, 60, 100, 75].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm bg-rose-500/30 border-t border-rose-500/50" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[t('viewsLabel'), t('clicksLabel'), t('conversionLabel')].map((l, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="text-lg font-bold text-white mb-0.5 tracking-tight">{['2.4K', '389', '%16'][i]}</div>
                        <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
                <BarChart3 size={11} className="text-indigo-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">{t('dive2Label')}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter leading-none mb-6 italic">{t('dive2Title')}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">{t('dive2Desc')}</p>
              <ul className="grid grid-cols-1 gap-3">
                {(t('dive2List') as unknown as string[]).slice(0, 3).map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-200">
                      <Check size={10} className="text-white" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Feature 3: Payments */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col md:flex-row items-center gap-12 pt-12"
          >
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                <CreditCard size={11} className="text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">{t('dive3Label')}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter leading-none mb-6 italic">{t('dive3Title')}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">{t('dive3Desc')}</p>
              <ul className="grid grid-cols-1 gap-3">
                {(t('dive3List') as unknown as string[]).slice(0, 3).map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-200">
                      <Check size={10} className="text-white" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 w-full">
              <div className="relative rounded-3xl overflow-hidden bg-emerald-50 border border-emerald-100 p-8 flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}
                  className="w-full max-w-[240px] bg-white rounded-2xl shadow-xl shadow-emerald-200/50 p-5 border border-white"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <ArrowRight size={20} className="text-white" />
                    </div>
                    <div className="text-[7px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest border border-emerald-100">Pay Direct</div>
                  </div>
                  <div className="space-y-3 mb-5">
                    <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
                    <div className="h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center px-3 text-[9px] text-slate-400 font-mono">stripe.com/p/kardly...</div>
                  </div>
                  <div className="w-full h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all cursor-pointer">
                    {t('ctaStart')}
                  </div>
                </motion.div>
                <div className="mt-6 flex items-center gap-2 text-emerald-700/60">
                  <Shield size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('securePayment')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT US ─── */}
      <section id="about" className="py-32 md:py-40 px-6 relative overflow-hidden bg-white">
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

      {/* ─── TEMPLATES: HIGH-END GRID ─── */}
      <section id="templates" className="py-24 px-6 relative overflow-hidden bg-white">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-1/4 w-[40%] h-[40%] bg-violet-100/30 rounded-full blur-[100px]"
          />
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-slate-100 pb-12">
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 mb-6"
              >
                <Palette size={11} className="text-violet-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-600 font-sans">{t('templates')}</span>
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter leading-none mb-4 italic italic">{t('templateTitle')}</h2>
              <p className="text-slate-500 text-sm font-medium max-w-sm">{t('templateDesc')}</p>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:block">Architecture v4.0</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Neon Modern", cat: t('tagPopular'), img: "/images/templates/neon.png", gradient: "from-rose-500 to-pink-500" },
              { title: "Clean Slate", cat: t('tagMinimal'), img: "/images/templates/minimal.png", gradient: "from-sky-500 to-cyan-500" },
              { title: "Creative", cat: t('tagPremium'), img: "/images/templates/creative.png", gradient: "from-violet-500 to-purple-500" },
              { title: "Cyber Link", cat: "Elite", img: "/images/templates/cyber.png", gradient: "from-amber-500 to-orange-500" }
            ].map((tmpl, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-500"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                  <img src={tmpl.img} alt={tmpl.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-md bg-gradient-to-r ${tmpl.gradient} text-[8px] font-black text-white uppercase tracking-widest`}>
                    {tmpl.cat}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent">
                    <h4 className="text-[11px] font-bold text-white tracking-tight leading-tight">{tmpl.title}</h4>
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="w-full py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-black text-white uppercase tracking-widest">Preview</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="py-32 md:py-40 px-6 relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(at 80% 20%, rgba(244,63,94,0.04) 0%, transparent 50%), radial-gradient(at 20% 80%, rgba(99,102,241,0.04) 0%, transparent 50%)' }} />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-20 md:mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100/50 mb-6"
            >
              <Star size={13} className="fill-amber-500 text-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{t('usersLabel')}</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]"
            >{t('usersTitle')}</motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: 'Ayşe Kara', role: 'UX Designer', text: t('testimonial1'), gradient: 'from-rose-500 to-pink-500' },
              { name: 'Mehmet Yılmaz', role: 'Gayrimenkul Danışmanı', text: t('testimonial2'), gradient: 'from-violet-500 to-indigo-500' },
              { name: 'Elif Demir', role: 'Freelance Fotoğrafçı', text: t('testimonial3'), gradient: 'from-cyan-500 to-teal-500' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-white rounded-[28px] border border-slate-200/60 p-8 md:p-9 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:border-slate-300/80 transition-all duration-500 hover:-translate-y-1"
              >
                {/* Gradient top accent */}
                <div className={`absolute top-0 left-8 right-8 h-[3px] rounded-b-full bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(s => (
                    <div key={s} className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                    </div>
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-slate-600 text-[15px] leading-relaxed mb-8">&ldquo;{item.text}&rdquo;</p>
                
                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-sm font-bold text-white shadow-lg`}>
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-400 font-medium">{item.role}</div>
                  </div>
                  <div className="ml-auto">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check size={11} className="text-emerald-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA: COMPACT LIGHT ─── */}
      <section className="py-24 px-6 relative bg-white overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-slate-50/40" />
            <motion.div
                animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-1/4 w-[30%] h-[40%] bg-rose-100/30 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 left-1/4 w-[30%] h-[40%] bg-indigo-100/20 rounded-full blur-[100px]"
            />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="p-12 md:p-16 rounded-[40px] bg-white border border-slate-100 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] text-center relative overflow-hidden"
          >
            {/* Ambient pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f43f5e 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            
            <div className="relative z-10 space-y-8">
              <motion.div
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100"
              >
                <Sparkles size={11} className="text-rose-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-600">{t('getStarted')}</span>
              </motion.div>
              
              <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter leading-none italic italic">
                {t('ctaTitle')}
              </h2>
              <p className="text-slate-500 text-sm md:text-base font-medium max-w-lg mx-auto leading-relaxed">{t('ctaDesc')}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/register" className="group px-8 py-3.5 bg-rose-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 active:scale-95 flex items-center justify-center gap-2">
                  <span>{t('ctaStart')}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#features" className="px-8 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center">
                  {t('ctaExplore')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER: PREMIUM DARK ─── */}
      <footer className="py-24 px-6 relative bg-[#0a0a0f] overflow-hidden">
        {/* Subtle ambient glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/[0.03] blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/[0.03] blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(244,63,94,0.02)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-12 md:gap-16 mb-20 items-start">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-3 space-y-8">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                  <Layout className="text-white w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tighter text-white">
                    Kardly<span className="text-rose-500">.site</span>
                  </span>
                  <span className="text-[8px] font-bold text-slate-500 tracking-[0.2em] uppercase">link to success</span>
                </div>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed">{t('footerDesc')}</p>
              
              <div className="flex gap-4">
                {[
                  { name: 'Instagram', icon: <Instagram size={18} /> },
                  { name: 'Twitter', icon: <Twitter size={18} /> },
                  { name: 'LinkedIn', icon: <Linkedin size={18} /> }
                ].map((s) => (
                  <a key={s.name} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-300">
                     {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Product Column */}
            <div className="md:col-span-2">
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8 italic">{t('product')}</h5>
              <ul className="space-y-4">
                <li><a href="#features" className="text-[13px] font-medium text-slate-500 hover:text-white transition-colors flex items-center gap-2 underline-offset-4 hover:underline"><Zap size={14} className="text-amber-500" /> {t('features')}</a></li>
                <li><a href="#templates" className="text-[13px] font-medium text-slate-500 hover:text-white transition-colors flex items-center gap-2 underline-offset-4 hover:underline"><Palette size={14} className="text-indigo-500" /> {t('templates')}</a></li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="md:col-span-2">
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8 italic">{t('support')}</h5>
              <ul className="space-y-4">
                <li><Link href="/blog" className="text-[13px] font-medium text-slate-500 hover:text-white transition-colors flex items-center gap-2"><FileText size={14} className="text-sky-500" /> {t('blog')}</Link></li>
                <li><Link href="/iletisim" className="text-[13px] font-medium text-slate-500 hover:text-white transition-colors flex items-center gap-2"><Globe size={14} className="text-emerald-500" /> {t('contact')}</Link></li>
                <li><Link href="/sss" className="text-[13px] font-medium text-slate-500 hover:text-white transition-colors flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> {t('faq')}</Link></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="md:col-span-2">
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8 italic">{t('legal')}</h5>
              <ul className="space-y-4">
                <li><Link href="/kullanim-sartlari" className="text-[13px] font-medium text-slate-500 hover:text-white transition-colors flex items-center gap-2 block"><Shield size={14} className="text-slate-400" /> {t('terms')}</Link></li>
                <li><Link href="/gizlilik" className="text-[13px] font-medium text-slate-500 hover:text-white transition-colors flex items-center gap-2 block"><Sparkles size={14} className="text-slate-400" /> {t('privacy')}</Link></li>
              </ul>
            </div>

            {/* Newsletter / Join Column */}
            <div className="col-span-2 md:col-span-3 space-y-8">
               <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                  <h6 className="text-xs font-black text-white uppercase tracking-widest">{t('newRegistration')}</h6>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Topluluğumuza katılın ve güncellemelerden haberdar olun.</p>
                  <form onSubmit={handleNewsletter} className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Email.." 
                      value={newsEmail}
                      onChange={(e) => setNewsEmail(e.target.value)}
                      required
                      className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-rose-500/50 flex-grow" 
                    />
                    <button 
                      type="submit"
                      disabled={newsStatus === "loading"}
                      className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </form>
                  {newsStatus === "success" && <p className="text-[10px] text-emerald-400 font-bold">Kayıt başarılı! ✨</p>}
                  {newsStatus === "error" && <p className="text-[10px] text-rose-400 font-bold">Bir hata oluştu.</p>}
                  
                  <p className="text-[9px] text-slate-600 leading-tight">
                    Kaydolarak <Link href="/kullanim-sartlari" className="underline hover:text-rose-500 transition-colors">Kullanım Şartları</Link> ve <Link href="/gizlilik" className="underline hover:text-rose-500 transition-colors">Gizlilik Sözleşmesi</Link>'ni kabul etmiş olursunuz.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0a0a0f] bg-slate-800" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">50,000+ Members</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">© 2026 Kardly.site — {t('allRights')}</p>
          </div>
        </div>
      </footer>

      <HowItWorksModal 
        isOpen={isHowItWorksOpen} 
        onClose={() => setIsHowItWorksOpen(false)} 
        t={t}
      />
    </main>
  )
}
