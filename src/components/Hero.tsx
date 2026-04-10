"use client"

import Link from "next/link"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { ArrowRight, Play, Globe, Users, BarChart3, ShieldCheck, Phone, Mail, MapPin, Briefcase, Star, Calendar, ExternalLink, Instagram, Linkedin, Sparkles, TrendingUp, Check } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"
import { useRef, useEffect } from "react"

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    })
}

interface HeroProps {
    onHowItWorksClick?: () => void
}

export function Hero({ onHowItWorksClick }: HeroProps) {
    const { t } = useTranslation()
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    // Mouse Parallax Logic
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 25, stiffness: 150 }
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig)
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            const { innerWidth, innerHeight } = window
            mouseX.set((clientX / innerWidth) - 0.5)
            mouseY.set((clientY / innerHeight) - 0.5)
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [mouseX, mouseY])

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <section ref={containerRef} className="relative pt-32 pb-32 px-6 overflow-hidden min-h-screen flex items-center bg-white">
            {/* ─── ENHANCED MESH GRADIENT BACKGROUND ─── */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Dynamic Base Gradient */}
                <div className="absolute inset-0 bg-[#fffaff]" />
                
                {/* Fluid Mesh Blobs */}
                <motion.div
                    animate={{ 
                        x: [0, 100, -50, 0], 
                        y: [0, -50, 100, 0],
                        rotate: [0, 90, 180, 0],
                        scale: [1, 1.2, 0.9, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-rose-200/30 rounded-full blur-[140px] mix-blend-multiply"
                />
                
                <motion.div
                    animate={{ 
                        x: [0, -80, 120, 0], 
                        y: [0, 120, -50, 0],
                        rotate: [0, -120, 0],
                        scale: [1.1, 0.8, 1.2, 1.1]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-200/30 rounded-full blur-[160px] mix-blend-multiply"
                />

                <motion.div
                    animate={{ 
                        x: [0, 60, -60, 0], 
                        y: [0, 80, -80, 0],
                        scale: [1, 1.3, 0.7, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] right-[10%] w-[50vw] h-[50vw] bg-amber-100/40 rounded-full blur-[140px] mix-blend-multiply"
                />

                {/* Technical Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay" 
                    style={{ 
                        backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)', 
                        backgroundSize: '80px 80px' 
                    }} 
                />

                {/* Light Rays */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,182,193,0.1),transparent_50%)]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

                    {/* ─── LEFT: Content Block ─── */}
                    <motion.div style={{ y: y1, opacity }} className="flex-[1.2] text-left lg:pr-8">
                        {/* Status Badge */}
                        <motion.div
                            custom={0} variants={fadeUp} initial="hidden" animate="visible"
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 mb-10 text-[11px] font-black uppercase tracking-[0.25em] text-rose-500 shadow-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                            {t('heroBadge')}
                        </motion.div>

                        <motion.h1
                            custom={1} variants={fadeUp} initial="hidden" animate="visible"
                            className="text-6xl md:text-7xl xl:text-[88px] font-black tracking-[-0.04em] mb-8 leading-[0.95] text-slate-950"
                        >
                            {t('heroTitle1')} <br />
                            <span className="inline-block">{t('heroTitle2')}</span>{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10 bg-gradient-to-r from-rose-500 via-pink-600 to-orange-500 bg-clip-text text-transparent italic">{t('heroTitle3')}</span>
                                <motion.span 
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 1, duration: 1.2 }}
                                    className="absolute -bottom-2 left-0 h-4 bg-rose-100/60 -z-10 rounded-full"
                                />
                            </span> 
                            <br />
                            {t('heroTitle4')}
                        </motion.h1>

                        <motion.p
                            custom={2} variants={fadeUp} initial="hidden" animate="visible"
                            className="text-xl md:text-2xl text-slate-500/80 max-w-xl mb-12 leading-relaxed font-medium"
                        >
                            {t('heroDesc2')}
                        </motion.p>

                        <motion.div
                            custom={3} variants={fadeUp} initial="hidden" animate="visible"
                            className="flex flex-col sm:flex-row gap-5 mb-16"
                        >
                            <Link href="/register" className="group relative px-10 py-6 bg-slate-950 text-white font-black text-lg rounded-[24px] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative z-10">{t('ctaStart')}</span>
                                <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            
                            <button 
                                onClick={onHowItWorksClick}
                                className="group px-10 py-6 bg-white/40 backdrop-blur-xl text-slate-700 border border-white/80 font-black text-lg rounded-[24px] hover:bg-white hover:shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:bg-rose-500 transition-colors shadow-lg">
                                    <Play size={20} fill="currentColor" />
                                </div>
                                {t('howItWorks')}
                            </button>
                        </motion.div>

                        {/* Social Proof Stats */}
                        <motion.div
                            custom={4} variants={fadeUp} initial="hidden" animate="visible"
                            className="flex flex-wrap items-center gap-8 lg:gap-12"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3.5">
                                    {[
                                        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
                                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
                                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                                    ].map((url, i) => (
                                        <motion.div 
                                            key={i} 
                                            whileHover={{ y: -5, zIndex: 10 }}
                                            className="w-12 h-12 rounded-2xl border-4 border-white bg-slate-100 overflow-hidden shadow-sm"
                                        >
                                            <img src={url} alt="User" className="w-full h-full object-cover" />
                                        </motion.div>
                                    ))}
                                    <div className="w-12 h-12 rounded-2xl border-4 border-white bg-rose-500 flex items-center justify-center text-[11px] font-black text-white shadow-xl">+</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900 leading-none">{t('heroStat1Value')}</div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{t('heroStat1Label')}</div>
                                </div>
                            </div>
                            
                            <div className="h-10 w-[1px] bg-slate-200 hidden md:block" />

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                                    <ShieldCheck size={26} />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900 leading-none">{t('heroStat2Value')}</div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{t('heroStat2Label')}</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* ─── RIGHT: Visual Block (The Card Showcase) ─── */}
                    <motion.div
                        style={{ y: y2 }}
                        className="flex-1 flex justify-center lg:justify-end relative perspective-1000"
                    >
                        <div className="relative group">
                            {/* Glow Effects */}
                            <div className="absolute inset-0 bg-rose-400/20 blur-[100px] rounded-full scale-150 animate-pulse" />
                            
                            {/* ─── ULTIMATE PHONE MOCKUP ─── */}
                            <motion.div 
                                style={{ rotateX, rotateY }}
                                className="relative w-[340px] md:w-[380px] aspect-[9/18.5] p-3 bg-slate-950 rounded-[4.5rem] shadow-[0_60px_120px_rgba(15,23,42,0.3)] border-[10px] border-slate-900/50 backdrop-blur-2xl transition-all duration-700"
                            >
                                {/* Apple-style Dynamic Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-32 bg-slate-900 rounded-b-[2rem] z-30 flex items-center justify-center">
                                    <div className="w-10 h-1.5 bg-slate-800 rounded-full" />
                                </div>

                                {/* Inner Screen Layout */}
                                <div className="flex-1 h-full bg-[#fdfcff] rounded-[3.8rem] overflow-hidden relative flex flex-col pt-4">
                                    {/* App-like Navigation Bar */}
                                    <div className="px-8 mb-6 flex items-center justify-between">
                                        <div className="text-[11px] font-black tracking-[-0.05em]">Lara Yıldız</div>
                                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Globe size={12} className="text-slate-400" />
                                        </div>
                                    </div>

                                    {/* ─── PREMIUM PROFILE CARD RENDER ─── */}
                                    <div className="px-8 pb-10 flex-1 overflow-y-auto no-scrollbar">
                                        {/* Avatar Section */}
                                        <div className="relative mb-10 mt-4">
                                            <div className="absolute inset-0 bg-rose-200/50 blur-2xl rounded-full scale-150" />
                                            <div className="relative w-28 h-28 mx-auto rounded-[32px] bg-white p-2 shadow-2xl transform hover:scale-110 transition-transform duration-500">
                                                <div className="w-full h-full rounded-[24px] overflow-hidden bg-slate-100">
                                                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center text-white">
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center mb-8">
                                            <h3 className="text-3xl font-black text-slate-900 leading-none mb-2">Lara Yıldız</h3>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Senior UI/UX Designer</div>
                                        </div>

                                        {/* Grid Actions */}
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="p-4 rounded-3xl bg-slate-950 text-white flex flex-col items-center gap-2 shadow-2xl active:scale-95 transition-all">
                                                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                                    <Phone size={18} fill="white" />
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-widest">{t('callNow')}</span>
                                            </div>
                                            <div className="p-4 rounded-3xl bg-rose-500 text-white flex flex-col items-center gap-2 shadow-2xl active:scale-95 transition-all">
                                                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                                                    <Mail size={18} fill="white" />
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-widest">{t('email')}</span>
                                            </div>
                                        </div>

                                        {/* Classic Links (Enhanced Card Look) */}
                                        <div className="space-y-3">
                                            {[
                                                { label: 'LinkedIn', icon: <Linkedin size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
                                                { label: 'Behance Portfolio', icon: <Globe size={16} />, color: 'text-rose-600', bg: 'bg-rose-50' },
                                                { label: 'Official Site', icon: <ExternalLink size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                            ].map((link, i) => (
                                                <div key={i} className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-3xl hover:border-rose-200 transition-all cursor-pointer hover:shadow-lg">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-2xl ${link.bg} ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                            {link.icon}
                                                        </div>
                                                        <span className="text-sm font-black text-slate-800">{link.label}</span>
                                                    </div>
                                                    <ArrowRight size={14} className="text-slate-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* ─── GLASSMORPHISM FLOATING CARDS ─── */}
                            
                            {/* 1. Analytic Card (Glass) */}
                            <motion.div
                                animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -left-20 p-5 rounded-[2.5rem] bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col gap-3 z-40 max-w-[200px]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Views</div>
                                        <div className="text-xl font-black text-slate-900">+2.4k</div>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '70%' }}
                                        transition={{ duration: 2, delay: 1 }}
                                        className="h-full bg-gradient-to-r from-amber-400 to-rose-500"
                                    />
                                </div>
                            </motion.div>

                            {/* 2. Success Notification (Glass) */}
                            <motion.div
                                animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-8 -right-16 p-4 rounded-[2.2rem] bg-white/80 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex items-center gap-4 z-40"
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400">
                                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-[14px] font-black text-slate-900 leading-tight">Card Shared!</div>
                                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Just now via QR</div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ml-2">
                                    <ShieldCheck size={14} />
                                </div>
                            </motion.div>

                            {/* 3. Tiny Decorative Badge */}
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute top-[20%] -right-10 w-16 h-16 rounded-3xl bg-slate-950 flex items-center justify-center text-white transform rotate-12 shadow-2xl z-40"
                            >
                                <Users size={24} />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
               style={{ opacity }}
               className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Scroll</div>
                <div className="w-[2px] h-12 bg-gradient-to-b from-rose-500 to-transparent rounded-full" />
            </motion.div>
        </section>
    )
}
