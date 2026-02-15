"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, QrCode, Smartphone, Layout } from "lucide-react"

export function Hero() {
    return (
        <section className="relative pt-44 pb-32 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[140px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full -translate-x-1/2" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full translate-y-1/2" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                <div className="text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-10 text-xs font-black uppercase tracking-[0.2em] border-white/10"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="gradient-text">Yapay Zeka Destekli Dijital Kartvizit</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] text-foreground"
                    >
                        Networking <br />
                        <span className="gradient-text">Geleceğini</span> Tasarla
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl md:text-2xl text-foreground/50 max-w-2xl mb-12 font-medium leading-relaxed"
                    >
                        Tek bir QR kod ile tüm profesyonel dünyanı paylaş. AI asistanın saniyeler içinde senin için özel bir portfolyo oluştursun.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-5"
                    >
                        <Link href="/register" className="bg-primary text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                            ŞİMDİ ÜCRETSİZ BAŞLA <ArrowRight className="w-5 h-5" />
                        </Link>
                        <button className="glass px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 border-white/10">
                            DEMO İNCELE
                        </button>
                    </motion.div>

                    {/* Quick Stats Overlay */}
                    <div className="flex items-center gap-10 mt-16 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black">10K+</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest">Kullanıcı</span>
                        </div>
                        <div className="w-[1px] h-10 bg-foreground/10" />
                        <div className="flex flex-col">
                            <span className="text-2xl font-black">50+</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest">Şablon</span>
                        </div>
                        <div className="w-[1px] h-10 bg-foreground/10" />
                        <div className="flex flex-col">
                            <span className="text-2xl font-black">99.9%</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest">Uptime</span>
                        </div>
                    </div>
                </div>

                {/* Hero Visual Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                    className="relative hidden lg:block"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                    <div className="relative glass p-6 rounded-[3.5rem] border-white/20 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700">
                        <div className="w-[320px] h-[600px] bg-[#020617] rounded-[2.8rem] overflow-hidden relative border-8 border-white/5">
                            {/* Mobile App Interface Mockup */}
                            <div className="p-8 flex flex-col items-center">
                                <div className="w-24 h-24 bg-primary/20 rounded-3xl mb-6 flex items-center justify-center">
                                    <Layout className="text-primary w-10 h-10" />
                                </div>
                                <div className="h-6 w-32 bg-white/20 rounded-full mb-2" />
                                <div className="h-3 w-48 bg-white/10 rounded-full mb-8" />
                                <div className="space-y-4 w-full">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-12 w-full bg-white/5 rounded-2xl border border-white/10" />
                                    ))}
                                </div>
                            </div>
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-12 bg-primary rounded-2xl shadow-xl shadow-primary/30" />
                        </div>
                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -top-10 -right-10 glass p-5 rounded-3xl border-white/20 shadow-xl"
                        >
                            <QrCode className="w-8 h-8 text-primary mb-2" />
                            <div className="text-[10px] font-black">DİNAMİK QR</div>
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute -bottom-5 -left-10 glass p-5 rounded-3xl border-white/20 shadow-xl"
                        >
                            <Smartphone className="w-8 h-8 text-indigo-400 mb-2" />
                            <div className="text-[10px] font-black">VCARD KAYIT</div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
