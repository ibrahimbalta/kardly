"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Play, Globe, Users, BarChart3, ShieldCheck, Phone, Mail, MapPin, Briefcase, Star, Calendar, ExternalLink, Instagram, Linkedin } from "lucide-react"

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    })
}

export function Hero() {
    return (
        <section className="relative pt-36 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-rose-50/30 to-white" />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="max-w-7xl mx-auto relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* ─── LEFT: Text Content ─── */}
                    <div className="text-left">
                        <motion.div
                            custom={0} variants={fadeUp} initial="hidden" animate="visible"
                            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-slate-200 mb-8 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 shadow-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Yeni Nesil Dijital Kartvizit Platformu
                        </motion.div>

                        <motion.h1
                            custom={1} variants={fadeUp} initial="hidden" animate="visible"
                            className="text-4xl md:text-5xl lg:text-6xl xl:text-[68px] font-extrabold tracking-tight mb-6 leading-[1.08] text-slate-900"
                        >
                            Profesyonel kimliğinizi{" "}
                            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">tek linkte</span> buluşturun.
                        </motion.h1>

                        <motion.p
                            custom={2} variants={fadeUp} initial="hidden" animate="visible"
                            className="text-base md:text-lg text-slate-500 max-w-lg mb-10 leading-relaxed"
                        >
                            Projeleriniz, uzmanlıklarınız, randevu sisteminiz ve ödeme altyapınız — hepsi tek bir profilde. Saniyeler içinde oluşturun, dünyayla paylaşın.
                        </motion.p>

                        <motion.div
                            custom={3} variants={fadeUp} initial="hidden" animate="visible"
                            className="flex flex-col sm:flex-row gap-3 items-start mb-10"
                        >
                            <Link href="/register" className="group px-8 py-4 bg-slate-900 text-white font-semibold text-sm rounded-2xl transition-all hover:bg-slate-800 active:scale-[0.98] shadow-lg shadow-slate-900/10 flex items-center gap-3">
                                Ücretsiz Hesap Oluştur <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-semibold text-sm rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm">
                                <Play size={16} className="text-rose-500" /> 2 Dakikada Keşfet
                            </button>
                        </motion.div>

                        <motion.div
                            custom={4} variants={fadeUp} initial="hidden" animate="visible"
                            className="flex flex-wrap items-center gap-6 md:gap-8"
                        >
                            {[
                                { icon: <Users size={15} />, label: '2,000+ Kullanıcı' },
                                { icon: <Globe size={15} />, label: 'Global Erişim' },
                                { icon: <BarChart3 size={15} />, label: 'Anlık İstatistik' },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                                    <span className="text-slate-300">{s.icon}</span>
                                    {s.label}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ─── RIGHT: Light Profile Card ─── */}
                    <motion.div
                        custom={3} variants={fadeUp} initial="hidden" animate="visible"
                        className="flex justify-center lg:justify-end"
                    >
                        <div className="relative">
                            {/* Glow behind card */}
                            <div className="absolute -inset-8 bg-gradient-to-br from-rose-200/30 via-pink-100/20 to-orange-100/20 blur-3xl rounded-full pointer-events-none" />

                            {/* ─── THE CARD ─── */}
                            <motion.div
                                animate={{ y: [-6, 6, -6] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-[300px] md:w-[320px] rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/80 border border-slate-200/80 bg-white"
                            >
                                {/* Cover Banner */}
                                <div className="h-28 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
                                    <motion.div
                                        animate={{ x: [-3, 3, -3], y: [-2, 2, -2] }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute top-3 right-4 w-10 h-10 rounded-xl bg-white/15 border border-white/20"
                                    />
                                    <motion.div
                                        animate={{ x: [2, -2, 2] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute bottom-2 right-16 w-6 h-6 rounded-full bg-white/10 border border-white/15"
                                    />
                                </div>

                                <div className="px-6 pb-6 -mt-10 relative">
                                    {/* Avatar */}
                                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg mb-4">
                                        <div className="w-full h-full rounded-[14px] overflow-hidden bg-rose-100">
                                            <img
                                                src="https://avatar.iran.liara.run/public/girl"
                                                alt="Ayşe Demir"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Name & Title */}
                                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-0.5">Ayşe Demir</h3>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Briefcase size={12} className="text-rose-400" />
                                        <span className="text-xs text-slate-500 font-medium">UX/UI Designer</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mb-5">
                                        <MapPin size={11} className="text-slate-300" />
                                        <span className="text-[11px] text-slate-400">İstanbul, Türkiye</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-3 gap-2 mb-5">
                                        {[
                                            { icon: <Phone size={14} />, label: 'Ara', color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
                                            { icon: <Mail size={14} />, label: 'E-posta', color: 'text-blue-500 bg-blue-50 border-blue-100' },
                                            { icon: <Calendar size={14} />, label: 'Randevu', color: 'text-purple-500 bg-purple-50 border-purple-100' },
                                        ].map((btn, i) => (
                                            <div key={i} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-center cursor-pointer hover:shadow-md transition-all ${btn.color}`}>
                                                {btn.icon}
                                                <span className="text-[10px] font-semibold">{btn.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Social Links */}
                                    <div className="space-y-2 mb-5">
                                        {[
                                            { icon: <Linkedin size={14} />, label: 'LinkedIn', handle: 'ayse-demir' },
                                            { icon: <Instagram size={14} />, label: 'Instagram', handle: '@aysedemir.design' },
                                            { icon: <Globe size={14} />, label: 'Portfolio', handle: 'aysedemir.com' },
                                        ].map((link, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 1.2 + i * 0.1 }}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer group hover:border-rose-200 hover:bg-rose-50/30 transition-all"
                                            >
                                                <span className="text-slate-400 group-hover:text-rose-500 transition-colors">{link.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{link.label}</div>
                                                    <div className="text-xs text-slate-700 font-semibold truncate">{link.handle}</div>
                                                </div>
                                                <ExternalLink size={12} className="text-slate-300 group-hover:text-rose-400 transition-colors" />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                                            ))}
                                        </div>
                                        <span className="text-[11px] text-slate-400 font-medium">4.9 · 128 değerlendirme</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating elements */}
                            <motion.div
                                animate={{ y: [-8, 8, -8] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-3 -left-5 w-11 h-11 rounded-2xl bg-white shadow-lg shadow-slate-200/60 flex items-center justify-center border border-slate-100"
                            >
                                <Briefcase size={16} className="text-rose-500" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [6, -6, 6] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-2 -left-6 w-10 h-10 rounded-xl bg-white shadow-lg shadow-slate-200/60 flex items-center justify-center border border-slate-100"
                            >
                                <BarChart3 size={15} className="text-emerald-500" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [-5, 7, -5] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-20 -right-5 w-10 h-10 rounded-xl bg-white shadow-lg shadow-slate-200/60 flex items-center justify-center border border-slate-100"
                            >
                                <Star size={15} className="text-amber-500 fill-amber-500" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
