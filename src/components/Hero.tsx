"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Play, Globe, Users, BarChart3, ShieldCheck, MapPin, Mail, Phone, Briefcase, Star, ExternalLink, Instagram, Linkedin, Github, Calendar, CreditCard } from "lucide-react"

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
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

                {/* ─── HERO VISUAL: Real Card Template Preview ─── */}
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
                                    kardly.com/<span className="text-slate-700 font-medium">ayse-demir</span>
                                </div>
                            </div>
                        </div>

                        {/* ─── Realistic Profile Card Inside Browser ─── */}
                        <div className="p-6 md:p-10 bg-gradient-to-br from-slate-50 via-white to-rose-50/30 min-h-[480px]">
                            <div className="max-w-3xl mx-auto">
                                {/* Profile Card */}
                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden">
                                    {/* Cover/Banner */}
                                    <div className="h-36 md:h-44 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 40%)' }} />
                                        {/* Floating decorative shapes */}
                                        <motion.div
                                            animate={{ y: [-5, 5, -5], rotate: [0, 3, 0] }}
                                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute top-6 right-8 w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm"
                                        />
                                        <motion.div
                                            animate={{ y: [5, -5, 5], rotate: [0, -2, 0] }}
                                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute bottom-4 right-32 w-10 h-10 rounded-full bg-white/10 border border-white/15"
                                        />
                                    </div>

                                    {/* Profile Info */}
                                    <div className="px-6 md:px-10 pb-8 -mt-12 relative">
                                        {/* Avatar */}
                                        <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-xl mb-5 relative">
                                            <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src="https://avatar.iran.liara.run/public/girl"
                                                    alt="Ayşe Demir"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                                                <ShieldCheck size={12} className="text-white" />
                                            </div>
                                        </div>

                                        {/* Name & Title */}
                                        <div className="mb-6">
                                            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Ayşe Demir</h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                                <Briefcase size={14} className="text-rose-400" />
                                                UX/UI Designer & Brand Strategist
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1.5">
                                                <MapPin size={12} />
                                                İstanbul, Türkiye
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-lg">
                                            10+ yıllık deneyimle markaları dijital dünyada öne çıkarıyorum. Kullanıcı odaklı tasarım, marka kimliği ve strateji konusunda uzmanım.
                                        </p>

                                        {/* Quick Action Buttons */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                                            {[
                                                { icon: <Mail size={16} />, label: 'E-posta', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                                                { icon: <Phone size={16} />, label: 'Ara', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                                                { icon: <Calendar size={16} />, label: 'Randevu', color: 'bg-purple-50 text-purple-600 border-purple-100' },
                                                { icon: <CreditCard size={16} />, label: 'Ödeme Yap', color: 'bg-amber-50 text-amber-600 border-amber-100' },
                                            ].map((btn, i) => (
                                                <motion.div
                                                    key={i}
                                                    whileHover={{ y: -2 }}
                                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all hover:shadow-md ${btn.color}`}
                                                >
                                                    {btn.icon}
                                                    <span className="hidden sm:inline">{btn.label}</span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Social Links */}
                                        <div className="space-y-2.5 mb-8">
                                            {[
                                                { icon: <Linkedin size={16} />, label: 'LinkedIn', handle: 'ayse-demir', color: 'hover:bg-blue-50 hover:border-blue-200' },
                                                { icon: <Instagram size={16} />, label: 'Instagram', handle: '@aysedemir.design', color: 'hover:bg-pink-50 hover:border-pink-200' },
                                                { icon: <Github size={16} />, label: 'GitHub', handle: 'aysedemir', color: 'hover:bg-slate-100 hover:border-slate-300' },
                                                { icon: <Globe size={16} />, label: 'Portfolio', handle: 'aysedemir.com', color: 'hover:bg-rose-50 hover:border-rose-200' },
                                            ].map((link, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 1.5 + i * 0.1 }}
                                                    className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border border-slate-100 bg-white cursor-pointer group transition-all ${link.color}`}
                                                >
                                                    <span className="text-slate-400 group-hover:text-slate-600 transition-colors">{link.icon}</span>
                                                    <div className="flex-1">
                                                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{link.label}</div>
                                                        <div className="text-sm text-slate-700 font-semibold">{link.handle}</div>
                                                    </div>
                                                    <ExternalLink size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Star Rating */}
                                        <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                                                ))}
                                            </div>
                                            <span className="text-xs text-slate-400 font-medium">4.9 / 5 · 128 değerlendirme</span>
                                        </div>
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
