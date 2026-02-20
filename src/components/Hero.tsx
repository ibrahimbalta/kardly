"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, QrCode, Zap, Star, ShieldCheck, Play, Globe, Users, BarChart3 } from "lucide-react"

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    })
}

export function Hero() {
    return (
        <section className="relative pt-44 pb-24 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-rose-50/30 to-white" />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="max-w-6xl mx-auto text-center relative z-10">
                <motion.div
                    custom={0} variants={fadeUp} initial="hidden" animate="visible"
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-slate-200 mb-10 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 shadow-sm"
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Yeni Nesil Dijital Kartvizit Platformu
                </motion.div>

                <motion.h1
                    custom={1} variants={fadeUp} initial="hidden" animate="visible"
                    className="text-5xl md:text-7xl lg:text-[88px] font-extrabold tracking-tight mb-8 leading-[1.05] text-slate-900"
                >
                    Profesyonel kimliğinizi <br />
                    <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">tek linkte</span> buluşturun.
                </motion.h1>

                <motion.p
                    custom={2} variants={fadeUp} initial="hidden" animate="visible"
                    className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-normal"
                >
                    Projeleriniz, uzmanlıklarınız, randevu sisteminiz ve ödeme altyapınız — hepsi tek bir profilde. Saniyeler içinde oluşturun, dünyayla paylaşın.
                </motion.p>

                <motion.div
                    custom={3} variants={fadeUp} initial="hidden" animate="visible"
                    className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16"
                >
                    <Link href="/register" className="group w-full sm:w-auto px-10 py-4.5 bg-slate-900 text-white font-semibold text-sm rounded-2xl transition-all hover:bg-slate-800 active:scale-[0.98] shadow-lg shadow-slate-900/10 flex items-center justify-center gap-3">
                        Ücretsiz Hesap Oluştur <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button className="w-full sm:w-auto px-10 py-4.5 bg-white text-slate-700 border border-slate-200 font-semibold text-sm rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm">
                        <Play size={16} className="text-rose-500" /> 2 Dakikada Keşfet
                    </button>
                </motion.div>

                {/* Mini stats row */}
                <motion.div
                    custom={4} variants={fadeUp} initial="hidden" animate="visible"
                    className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-20"
                >
                    {[
                        { icon: <Users size={16} />, label: '2,000+ Kullanıcı' },
                        { icon: <Globe size={16} />, label: 'Dünya Genelinde Erişim' },
                        { icon: <BarChart3 size={16} />, label: 'Anlık İstatistikler' },
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm text-slate-400 font-medium">
                            <span className="text-slate-300">{s.icon}</span>
                            {s.label}
                        </div>
                    ))}
                </motion.div>

                {/* Hero Visual — Browser Mockup */}
                <motion.div
                    custom={5} variants={fadeUp} initial="hidden" animate="visible"
                    className="max-w-5xl mx-auto relative"
                >
                    {/* Glow */}
                    <div className="absolute -inset-10 bg-gradient-to-t from-rose-200/30 via-transparent to-transparent blur-3xl rounded-full pointer-events-none" />

                    {/* Browser Window */}
                    <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden">
                        {/* Browser Bar */}
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            </div>
                            <div className="flex-1 mx-8">
                                <div className="bg-white border border-slate-200 rounded-xl px-5 py-2 text-xs text-slate-400 font-mono flex items-center gap-2 max-w-md mx-auto">
                                    <ShieldCheck size={12} className="text-emerald-500" />
                                    kardly.com/<span className="text-slate-700 font-medium">isminiz</span>
                                </div>
                            </div>
                        </div>

                        {/* App Content Preview */}
                        <div className="p-8 md:p-12 bg-gradient-to-br from-slate-50 to-white min-h-[400px]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Profile Preview */}
                                <div className="bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center text-center shadow-sm">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 mb-6 flex items-center justify-center shadow-lg">
                                        <Zap size={32} className="text-white" />
                                    </div>
                                    <div className="h-4 w-28 bg-slate-200 rounded-full mb-3" />
                                    <div className="h-3 w-36 bg-slate-100 rounded-full mb-6" />
                                    <div className="space-y-3 w-full">
                                        {['LinkedIn', 'Portfolio', 'E-posta'].map((l, i) => (
                                            <div key={i} className="h-11 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-4 gap-3">
                                                <div className="w-6 h-6 rounded-md bg-rose-50" />
                                                <span className="text-xs text-slate-400 font-medium">{l}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Stats Preview */}
                                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">Ziyaretçi İstatistikleri</div>
                                    <div className="flex items-end gap-2 h-32 mb-6">
                                        {[35, 55, 40, 75, 60, 90, 50].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ delay: 1.2 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                                                className="flex-1 bg-rose-500/15 rounded-lg border-t-2 border-rose-500/40"
                                            />
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                                            <div className="text-2xl font-bold text-slate-900">847</div>
                                            <div className="text-[10px] text-slate-400 font-medium">Görüntülenme</div>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                                            <div className="text-2xl font-bold text-slate-900">124</div>
                                            <div className="text-[10px] text-slate-400 font-medium">Tıklama</div>
                                        </div>
                                    </div>
                                </div>

                                {/* QR & Share Preview */}
                                <div className="bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center justify-center shadow-sm">
                                    <div className="w-32 h-32 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-6">
                                        <QrCode size={64} className="text-slate-300" />
                                    </div>
                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">QR Kod ile Paylaş</div>
                                    <div className="w-full h-11 bg-slate-900 rounded-xl flex items-center justify-center text-[11px] font-semibold text-white tracking-wide">
                                        REHBERE EKLE
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
