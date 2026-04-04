"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
// Build trigger: 2026-03-07T09:22:00
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { TemplateGallery } from "@/components/TemplateGallery"
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
  Play,
  MapPin,
  MessageSquare,
  Music,
  Heart,
  ShoppingCart,
  Anchor,
  BookOpen,
  Camera,
  Coffee,
  Code2,
  Stethoscope,
  Scale
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"
import { AdvertisementSlot } from "@/components/AdvertisementSlot"
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
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-rose-100 selection:text-rose-600 overflow-x-hidden relative">
      {/* ─── GLOBAL PREMIUM LAYERS ─── */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
          {/* Grain Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] contrast-150 brightness-100 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
          
          {/* Advanced Mesh Glows */}
          <div className="absolute inset-0 overflow-hidden select-none">
              <motion.div
                animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-15%] right-[-10%] w-[70%] h-[70%] bg-rose-200/40 blur-[140px] rounded-full mix-blend-soft-light"
              />
              <motion.div
                animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[10%] left-[-20%] w-[80%] h-[80%] bg-indigo-200/30 blur-[180px] rounded-full mix-blend-overlay"
              />
              <motion.div
                animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[10%] left-1/4 w-[60%] h-[60%] bg-violet-200/20 blur-[150px] rounded-full mix-blend-overlay"
              />
          </div>
      </div>

      <Navbar />
      <Hero onHowItWorksClick={() => setIsHowItWorksOpen(true)} />
      
      {/* ─── AD SLOT 1: HERO BOTTOM ─── */}
      <AdvertisementSlot position="home_hero_bottom" />

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-32 md:py-48 px-6 relative z-10">
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
              {t('buildProfileTitle').split(' ').map((word, i) => (
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
      {/* ─── FEATURES: COMPACT TECH HUB ─── */}
      <section id="features" className="py-32 md:py-48 px-6 relative z-10">
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
              <h2 className="text-4xl md:text-[5rem] font-black text-slate-950 tracking-[-0.05em] leading-[0.9] mb-6 italic">
                {t('featuresTitle').split(' ').map((w, i) => (
                  <span key={i} className={i % 2 === 0 ? "text-slate-950" : "text-slate-400 font-light"}>{w} </span>
                ))}
              </h2>
              <p className="text-slate-500 text-base font-medium leading-relaxed max-w-sm">
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
                  {/* Glass Background */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br backdrop-blur-2xl border border-white/40 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 group-hover:scale-[1.02]",
                    theme.bg
                  )} />
                  
                  {/* Abstract Geometric Shapes */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                    <div className={cn("absolute -top-4 -right-4 w-24 h-24 rounded-full blur-xl transition-transform duration-700 group-hover:scale-150", theme.shape)} />
                    <div className={cn("absolute -bottom-8 -left-8 w-32 h-32 rotate-12 transition-transform duration-1000 group-hover:rotate-45", theme.shape)} />
                    {/* Decorative geometric icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] scale-[2] group-hover:scale-[3] transition-transform duration-1000">
                      {f.icon}
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col items-start gap-5">
                    {/* Icon Core */}
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

      {/* ─── AD SLOT 2: FEATURES BOTTOM ─── */}
      <AdvertisementSlot position="home_features_bottom" />

      {/* ─── SHOWCASE: COMPACT REFINED TILES ─── */}
      <section className="py-32 md:py-48 px-6 relative z-10">
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Text: Compact and Side-by-Side on Desktop */}
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 mb-6">
              <Sparkles size={11} className="text-rose-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-600">{t('dive1Label')}</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-slate-950 tracking-[-0.05em] leading-[0.9] mb-8 italic">
              {t('dive1Title').split(' ').map((w, i) => (
                <span key={i} className={i % 2 === 1 ? "opacity-30 font-light" : ""}>{w} </span>
              ))}
            </h3>
            <p className="text-slate-500 text-base leading-relaxed mb-10 max-w-sm font-medium">{t('dive1Desc')}</p>
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
      <section className="py-32 md:py-48 px-6 relative z-10">
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

        </div>
      </section>

      {/* ─── ABOUT US ─── */}
      <section id="about" className="py-32 md:py-48 px-6 relative z-10">
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
      <section id="templates" className="py-32 md:py-48 px-6 relative z-10">
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
                       <button className="w-full py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-black text-white uppercase tracking-widest">{t('preview')}</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AD SLOT 3: TEMPLATES BOTTOM ─── */}
      <AdvertisementSlot position="home_templates_bottom" />

      {/* ─── INDUSTRY SHOWCASE: BROADENING THE SCOPE ─── */}
      <section id="industries" className="py-32 md:py-48 px-6 relative z-10">
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
                
                {/* Decorative dots */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-current" />
                        <div className="w-1 h-1 rounded-full bg-current opacity-60" />
                        <div className="w-1 h-1 rounded-full bg-current opacity-30" />
                    </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NFC CARD SECTION: PHYSICAL REVOLUTION ─── */}
      <section id="nfc-card" className="py-32 md:py-48 px-6 relative z-10">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100"
              >
                <CreditCard size={14} className="text-orange-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">{t('nfcSectionBadge')}</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter leading-[0.9] italic">
                {t('nfcSectionTitle')}
              </h2>
              
              <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-xl">
                {t('nfcSectionDesc')}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: t('nfcFeature1Title'), desc: t('nfcFeature1Desc'), icon: <Zap /> },
                  { title: t('nfcFeature2Title'), desc: t('nfcFeature2Desc'), icon: <Palette /> }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
                      {item.icon}
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Link href="/register" className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 active:scale-95 group">
                  {t('nfcCtaBtn')}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="flex-1 relative">
                <motion.div
                  initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
                  whileInView={{ opacity: 1, rotate: 2, scale: 1 }}
                  className="relative z-10 w-full max-w-[440px] aspect-[1.58/1] bg-gradient-to-br from-slate-900 to-black rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] p-10 flex flex-col justify-between overflow-hidden border border-white/10"
                >
                  {/* NFC Logo Mock */}
                  <div className="absolute top-10 right-10 opacity-20">
                     <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border border-white rounded-full" />
                     </div>
                  </div>
                  
                  {/* Ambient light on card */}
                  <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full" />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 flex items-center justify-center mb-6">
                       <Layout size={32} className="text-white" />
                    </div>
                    <div className="text-2xl font-black text-white tracking-widest uppercase italic">KARDLY</div>
                  </div>
                  
                  <div className="relative z-10 flex justify-between items-end">
                    <div>
                      <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">{t('nfcCardType')}</div>
                      <div className="text-lg font-black text-white uppercase tracking-wider">{t('nfcUserMock')}</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-lg">
                       <QrCode size={40} className="text-slate-900" />
                    </div>
                  </div>
                </motion.div>
                
                {/* Secondary card for depth */}
                <motion.div
                  initial={{ opacity: 0, x: -40, y: 40 }}
                  whileInView={{ opacity: 0.4, x: -60, y: 20 }}
                  className="absolute top-0 left-0 -z-10 w-full max-w-[440px] aspect-[1.58/1] bg-orange-500 rounded-[2rem] blur-[2px]"
                />
            </div>
          </div>
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
                  <p className="text-[11px] text-slate-500 leading-relaxed">{t('newsletterDesc')}</p>
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
                  {newsStatus === "success" && <p className="text-[10px] text-emerald-400 font-bold">{t('registrationSuccess')}</p>}
                  {newsStatus === "error" && <p className="text-[10px] text-rose-400 font-bold">{t('registrationError')}</p>}
                  
                  <p className="text-[9px] text-slate-600 leading-tight">
                    {t('termsAgreement')}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0a0a0f] bg-slate-800" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{t('footerCommunity')}</span>
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
