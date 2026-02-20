"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, QrCode, Zap, Star, ShieldCheck, Globe } from "lucide-react"

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
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-rose-100/20"
                    >
                        <Globe size={14} className="text-rose-500 animate-pulse" />
                        <span>Global Networking Vizyonu</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="text-7xl md:text-[100px] font-black tracking-tighter mb-8 leading-[0.85] text-slate-900"
                    >
                        Sınırsız <br />
                        <span className="gradient-text italic">Bağlantı.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl md:text-2xl text-slate-500 max-w-xl mb-12 font-medium leading-relaxed"
                    >
                        Dünyanın neresinde olursanız olun, dijital kimliğiniz saniyeler içinde global profesyonellerle buluşsun. Modern, hızlı ve etkileyici.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-5 items-center justify-center lg:justify-start"
                    >
                        <Link href="/register" className="group relative w-full sm:w-auto px-12 py-6 bg-rose-500 text-white font-black text-xs uppercase tracking-widest rounded-[2rem] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-rose-200 flex items-center justify-center gap-4">
                            Hemen Keşfet <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="w-full sm:w-auto glass-light border border-slate-100 px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-slate-500 bg-white/50 backdrop-blur-xl shadow-sm">
                            Global Demo İzle
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
                            {[31, 65, 48, 20, 12, 44].map(i => (
                                <img key={i} src={`https://avatar.iran.liara.run/public/${i}`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-current text-amber-400" />)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trusted by 10k+ Globals</span>
                                <div className="w-1 h-1 rounded-full bg-rose-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Global Verified</span>
                            </div>
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

                    <div className="relative glass p-6 rounded-[5rem] border-white shadow-[0_40px_100px_rgba(244,63,94,0.1)] bg-white/60">
                        <div className="w-[360px] h-[680px] bg-slate-100 rounded-[4rem] overflow-hidden relative border-8 border-white shadow-2xl">
                            {/* Mockup Content */}
                            <div className="p-8 flex flex-col items-center h-full bg-gradient-to-b from-white via-white to-slate-50">
                                <div className="w-full flex justify-between items-center mb-10">
                                    <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                                        <Globe size={24} className="text-white" />
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                                    </div>
                                </div>

                                <div className="w-28 h-28 rounded-[2.5rem] bg-slate-200 mb-8 border-4 border-white shadow-xl overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" />
                                </div>
                                <div className="h-4 w-32 bg-slate-900 rounded-full mb-3" />
                                <div className="h-2 w-48 bg-slate-300 rounded-full mb-12" />

                                <div className="space-y-4 w-full px-2">
                                    {[
                                        { icon: <Zap size={18} />, label: "Quick Contact", color: "bg-amber-500" },
                                        { icon: <QrCode size={18} />, label: "Save to Phone", color: "bg-indigo-500" },
                                        { icon: <ShieldCheck size={18} />, label: "Verify Identity", color: "bg-emerald-500" }
                                    ].map((item, i) => (
                                        <div key={i} className="h-16 w-full bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center px-5 gap-5 hover:border-rose-200 transition-colors">
                                            <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                                {item.icon}
                                            </div>
                                            <div className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">{item.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto mb-6 w-full h-16 bg-rose-500 rounded-[2rem] shadow-2xl shadow-rose-200 flex items-center justify-center text-xs font-black text-white tracking-[0.2em] uppercase">
                                    Share Profile
                                </div>
                            </div>
                        </div>

                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-12 -right-12 glass p-6 rounded-[2.5rem] border-white shadow-2xl bg-white/95"
                        >
                            <QrCode className="w-10 h-10 text-rose-500 mb-3" />
                            <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Global QR</div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-24 -left-12 glass p-6 rounded-[2.5rem] border-white shadow-2xl bg-white/95"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                    <ShieldCheck size={16} />
                                </div>
                                <div className="h-2 w-16 bg-slate-100 rounded-full" />
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Verified</div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
