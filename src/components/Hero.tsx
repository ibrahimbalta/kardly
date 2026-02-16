"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles, QrCode, Smartphone, Layout, Star, ShieldCheck, Zap } from "lucide-react"
import { useRef } from "react"

export function Hero() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100])
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 15])

    return (
        <section ref={containerRef} className="relative pt-44 pb-32 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full mix-blend-screen opacity-50 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full mix-blend-screen opacity-50" />

            {/* Grid Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl glass mb-8 text-[11px] font-black uppercase tracking-[0.3em] border-white/5 shadow-2xl"
                    >
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-white/80">Dijital Networking Devrimi</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="text-7xl md:text-[110px] font-black tracking-tighter mb-8 leading-[0.85] text-white"
                    >
                        Kartviziti <br />
                        <span className="text-primary italic">Öldürdük.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl md:text-2xl text-white/40 max-w-xl mb-12 font-medium leading-relaxed"
                    >
                        Tek bir dokunuşla rehbere kaydedilen, AI ile saniyeler içinde tasarlanan ve asla bitmeyen dijital gücünüz.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-5 items-center justify-center lg:justify-start"
                    >
                        <Link href="/register" className="group relative w-full sm:w-auto px-12 py-6 bg-white text-black font-black text-xs uppercase tracking-widest rounded-3xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.15)] flex items-center justify-center gap-4">
                            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl" />
                            HEMEN ÜCRETSİZ BAŞLA <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="w-full sm:w-auto glass px-10 py-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3 border-white/10 text-white/60 hover:text-white">
                            CANLI DEMO
                        </button>
                    </motion.div>

                    {/* Social Proof Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-16"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-10 h-10 rounded-full border-2 border-[#030712] object-cover" />
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-[#030712] bg-primary flex items-center justify-center text-[10px] font-black text-white">+2K</div>
                        </div>
                        <div className="h-10 w-[1px] bg-white/5 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-current text-amber-400" />)}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">5.0 Mükemmel Reyting</span>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Visual Mockup */}
                <motion.div
                    style={{ y: y1, rotate }}
                    className="relative hidden lg:block perspective-1000"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full animate-pulse" />

                    {/* Main Phone Frame */}
                    <div className="relative glass p-4 rounded-[4rem] border-white/10 shadow-2xl overflow-hidden">
                        <div className="w-[340px] h-[640px] bg-[#020617] rounded-[3.5rem] overflow-hidden relative border-8 border-white/5 shadow-inner">
                            {/* Inner Screen Visuals */}
                            <div className="p-8 space-y-8 h-full">
                                <div className="flex justify-between items-center opacity-40">
                                    <div className="w-10 h-2 bg-white rounded-full" />
                                    <div className="w-5 h-5 bg-white/20 rounded-full" />
                                </div>
                                <div className="w-24 h-24 bg-gradient-to-br from-primary to-indigo-600 rounded-[2rem] mx-auto shadow-2xl shadow-primary/40 flex items-center justify-center">
                                    <Zap size={40} className="text-white fill-current" />
                                </div>
                                <div className="space-y-4">
                                    <div className="h-6 w-40 bg-white/20 rounded-xl mx-auto" />
                                    <div className="h-2 w-56 bg-white/10 rounded-full mx-auto" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-20 glass rounded-2xl border-white/5" />
                                    ))}
                                </div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="h-16 w-full bg-primary rounded-2xl flex items-center justify-center text-xs font-black uppercase tracking-widest text-white">REHBERE EKLE</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Interaction Cards */}
                        <motion.div
                            animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-20 -right-12 glass p-6 rounded-3xl border-white/20 shadow-2xl backdrop-blur-xl group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-500">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-white/40 uppercase">Güvenli</div>
                                    <div className="text-xs font-black text-white">ONAYLANMIŞ</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-40 -left-12 glass p-6 rounded-3xl border-white/20 shadow-2xl backdrop-blur-xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                                    <QrCode size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-white/40 uppercase">Dinamik</div>
                                    <div className="text-xs font-black text-white">QR KOD</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
