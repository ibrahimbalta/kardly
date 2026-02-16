"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, QrCode, Zap, Star, ShieldCheck } from "lucide-react"

export function Hero() {
    return (
        <section className="relative pt-44 pb-32 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center bg-white">
            {/* Animated Blobs */}
            <div className="blob w-[500px] h-[500px] bg-rose-100 top-[-100px] right-[-100px] opacity-60" />
            <div className="blob w-[600px] h-[600px] bg-orange-50 bottom-[-200px] left-[-200px] opacity-70" />
            <div className="blob w-[400px] h-[400px] bg-amber-50 top-1/4 left-1/4 opacity-40" />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-rose-50 border border-rose-100 mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-rose-500 shadow-sm"
                    >
                        <Sparkles size={14} className="animate-spin-slow" />
                        <span>Dijital Kartvizitin Geleceği</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="text-6xl md:text-[90px] font-black tracking-tighter mb-8 leading-[0.9] text-slate-900"
                    >
                        Networking <br />
                        <span className="gradient-text">Renklensin.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl md:text-2xl text-slate-500 max-w-xl mb-12 font-medium leading-relaxed"
                    >
                        Klasik kartvizitleri unutun. Saniyeler içinde size özel, canlı ve profesyonel dijital kimliğinizi oluşturun.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-5 items-center justify-center lg:justify-start"
                    >
                        <Link href="/register" className="group relative w-full sm:w-auto px-12 py-6 bg-rose-500 text-white font-black text-xs uppercase tracking-widest rounded-3xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-rose-200 flex items-center justify-center gap-4">
                            ÜCRETSİZ BAŞLA <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="w-full sm:w-auto glass px-10 py-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 border-slate-200 text-slate-600">
                            NASIL ÇALIŞIR?
                        </button>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-center justify-center lg:justify-start gap-6 mt-16"
                    >
                        <div className="flex -space-x-3">
                            {[31, 65, 48, 20].map(i => (
                                <img key={i} src={`https://avatar.iran.liara.run/public/${i}`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-current text-amber-400" />)}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">2.000+ Mutlu Kullanıcı</span>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="relative hidden lg:block"
                >
                    <div className="absolute inset-0 bg-rose-200/40 blur-[120px] rounded-full" />

                    <div className="relative glass p-6 rounded-[4rem] border-white shadow-[0_20px_50px_rgba(244,63,94,0.15)] bg-white/60">
                        <div className="w-[340px] h-[640px] bg-slate-100 rounded-[3.5rem] overflow-hidden relative border-8 border-white shadow-2xl">
                            {/* Mockup Content */}
                            <div className="p-8 flex flex-col items-center h-full bg-gradient-to-b from-white to-slate-50">
                                <div className="w-24 h-24 bg-gradient-to-tr from-rose-500 to-orange-500 rounded-3xl mb-12 shadow-2xl flex items-center justify-center">
                                    <Zap size={48} className="text-white fill-current" />
                                </div>
                                <div className="h-6 w-32 bg-slate-300 rounded-full mb-3" />
                                <div className="h-2 w-48 bg-slate-200 rounded-full mb-10" />

                                <div className="space-y-4 w-full">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-14 w-full bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center px-4 gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-xs" />
                                            <div className="h-2 w-24 bg-slate-200 rounded-full" />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto mb-6 w-full h-16 bg-rose-500 rounded-2xl shadow-xl shadow-rose-200 flex items-center justify-center text-xs font-black text-white tracking-widest">
                                    REHBERE EKLE
                                </div>
                            </div>
                        </div>

                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute top-12 -right-8 glass p-5 rounded-3xl border-white shadow-xl bg-white/90"
                        >
                            <QrCode className="w-8 h-8 text-rose-500 mb-2" />
                            <div className="text-[9px] font-black text-slate-400">TARAT & KAYDET</div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute bottom-20 -left-8 glass p-5 rounded-3xl border-white shadow-xl bg-white/90"
                        >
                            <ShieldCheck className="w-8 h-8 text-green-500 mb-2" />
                            <div className="text-[9px] font-black text-slate-400">GÜVENLİ VCARD</div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
