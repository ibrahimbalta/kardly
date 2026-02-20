"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Play, Globe, Users, BarChart3, ShieldCheck, Phone, Mail, MapPin, Briefcase, Star, Calendar, ExternalLink } from "lucide-react"

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

                    {/* ─── RIGHT: Profile Card Preview ─── */}
                    <motion.div
                        custom={3} variants={fadeUp} initial="hidden" animate="visible"
                        className="flex justify-center lg:justify-end"
                    >
                        <div className="relative">
                            {/* Glow behind card */}
                            <div className="absolute -inset-8 bg-gradient-to-br from-rose-300/20 via-amber-200/10 to-emerald-200/10 blur-3xl rounded-full pointer-events-none" />

                            {/* ─── THE CARD ─── */}
                            <div className="relative w-[300px] md:w-[320px] rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-700/50"
                                style={{ background: 'linear-gradient(160deg, #1a2a1a 0%, #1e2e1c 30%, #2a3628 60%, #1c2a1a 100%)' }}
                            >
                                {/* Subtle texture overlay */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(200,255,200,0.15) 0%, transparent 60%)' }} />

                                <div className="relative z-10 p-6 pt-8">
                                    {/* Decorative Top Corner */}
                                    <div className="absolute top-4 right-4">
                                        <div className="w-6 h-6 rounded-md border border-lime-500/30 flex items-center justify-center">
                                            <ShieldCheck size={12} className="text-lime-400/70" />
                                        </div>
                                    </div>

                                    {/* Avatar */}
                                    <div className="flex flex-col items-center mb-5">
                                        <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-br from-lime-400/60 to-emerald-600/60 mb-4">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-slate-800">
                                                <img
                                                    src="https://avatar.iran.liara.run/public/boy"
                                                    alt="İbrahim Balta"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-extrabold text-white tracking-tight uppercase">İBRAHİM BALTA</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-6 h-[1px] bg-lime-500/40" />
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-lime-400/70">Yazılım Test Uzmanı</span>
                                            <div className="w-6 h-[1px] bg-lime-500/40" />
                                        </div>
                                    </div>

                                    {/* Username badge */}
                                    <div className="flex justify-center mb-4">
                                        <div className="px-4 py-2 rounded-full bg-slate-800/80 border border-slate-600/30 text-xs text-slate-400 font-mono">
                                            rahatsızlık
                                        </div>
                                    </div>

                                    {/* Quote */}
                                    <div className="text-center mb-6">
                                        <p className="text-xs text-slate-400 italic leading-relaxed">&ldquo;Hayallere koşları, Farkı Yaşa &rdquo;</p>
                                    </div>

                                    {/* Action Links */}
                                    <div className="space-y-2 mb-6">
                                        {[
                                            { icon: <Phone size={14} />, label: 'ARA' },
                                            { icon: <Mail size={14} />, label: 'WHATSAPP' },
                                            { icon: <Mail size={14} />, label: 'E-MAİL' },
                                            { icon: <Calendar size={14} />, label: 'RANDEVU AL' },
                                            { icon: <Globe size={14} />, label: 'WEB SİTE' },
                                            { icon: <MapPin size={14} />, label: 'KONUM' },
                                        ].map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 1.0 + i * 0.08 }}
                                                className="flex items-center gap-3 px-5 py-3 rounded-xl border border-slate-700/40 bg-slate-800/30 hover:bg-slate-700/40 transition-all cursor-pointer group"
                                            >
                                                <span className="text-slate-500 group-hover:text-lime-400 transition-colors">{item.icon}</span>
                                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Bio */}
                                    <div className="mb-5 px-1">
                                        <p className="text-[11px] text-slate-500 leading-relaxed">
                                            Yazılım test süreçlerini yönetiyor, modern test otomasyon araçlarıyla çalışıyorum. Kalite odaklı profesyonel yaklaşım.
                                        </p>
                                    </div>

                                    {/* Review */}
                                    <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/30 mb-5">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-bold text-slate-400">Ali Yılmaz</span>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4].map(i => (
                                                    <Star key={i} size={9} className="text-amber-400 fill-amber-400" />
                                                ))}
                                                <Star size={9} className="text-slate-600" />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-relaxed">&ldquo;Harika bir profesyonel...&rdquo;</p>
                                    </div>

                                    {/* Bottom CTA */}
                                    <div className="space-y-2">
                                        <div className="w-full py-3 bg-lime-500 rounded-xl text-center text-sm font-bold text-slate-900 shadow-lg shadow-lime-500/20 cursor-pointer hover:bg-lime-400 transition-colors">
                                            DANIŞMANLIK AL
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1 py-2.5 bg-slate-800/60 border border-slate-700/40 rounded-xl text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-700/50 transition-colors">
                                                PAYLAŞ
                                            </div>
                                            <div className="flex-1 py-2.5 bg-lime-500/20 border border-lime-500/30 rounded-xl text-center text-[10px] font-bold text-lime-400 uppercase tracking-widest cursor-pointer hover:bg-lime-500/30 transition-colors">
                                                ⭐ Değerlendir
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements around the card */}
                            <motion.div
                                animate={{ y: [-8, 8, -8] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-4 -left-6 w-12 h-12 rounded-2xl bg-white shadow-lg shadow-slate-200/60 flex items-center justify-center border border-slate-100"
                            >
                                <Briefcase size={18} className="text-rose-500" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [6, -6, 6] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-3 -left-8 w-11 h-11 rounded-xl bg-white shadow-lg shadow-slate-200/60 flex items-center justify-center border border-slate-100"
                            >
                                <BarChart3 size={16} className="text-emerald-500" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [-5, 7, -5] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-16 -right-6 w-11 h-11 rounded-xl bg-white shadow-lg shadow-slate-200/60 flex items-center justify-center border border-slate-100"
                            >
                                <Star size={16} className="text-amber-500 fill-amber-500" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
