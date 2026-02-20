"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Play, Globe, Users, BarChart3, ShieldCheck, Phone, Mail, MapPin, Briefcase, Star, Calendar, ExternalLink, Instagram, Linkedin, Sparkles } from "lucide-react"

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    })
}

export function Hero() {
    return (
        <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[90vh] flex items-center bg-white">
            {/* ─── BACKGROUND DECORATIONS ─── */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Subtle Grid */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Animated Orbs */}
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-rose-100/40 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-orange-50/40 rounded-full blur-[130px]"
                />
                <div className="absolute bottom-0 left-[20%] w-[30%] h-[30%] bg-blue-50/30 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 w-full mt-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 translate-y-4">

                    {/* ─── LEFT: Content Block ─── */}
                    <div className="flex-1 text-left lg:pr-4">
                        <motion.div
                            custom={0} variants={fadeUp} initial="hidden" animate="visible"
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm"
                        >
                            <Sparkles size={11} className="text-rose-500" />
                            Yeni Nesil Dijital Kartvizitler
                        </motion.div>

                        <motion.h1
                            custom={1} variants={fadeUp} initial="hidden" animate="visible"
                            className="text-5xl md:text-6xl xl:text-[76px] font-black tracking-tight mb-8 leading-[1] text-slate-900"
                        >
                            Profesyonel <br />
                            kimliğinizi <span className="relative">
                                <span className="relative z-10 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent italic">tek linkte</span>
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-rose-100/80 -z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
                                </svg>
                            </span> buluşturun.
                        </motion.h1>

                        <motion.p
                            custom={2} variants={fadeUp} initial="hidden" animate="visible"
                            className="text-lg md:text-xl text-slate-500 max-w-lg mb-12 leading-relaxed font-medium opacity-80"
                        >
                            Projeleriniz, randevularınız ve ödemeleriniz — hepsi tek bir modern profilde. Dakikalar içinde oluşturun, dünyayla paylaşın.
                        </motion.p>

                        <motion.div
                            custom={3} variants={fadeUp} initial="hidden" animate="visible"
                            className="flex flex-col sm:flex-row gap-4 mb-16"
                        >
                            <Link href="/register" className="group px-10 py-5 bg-slate-900 text-white font-bold text-base rounded-[20px] transition-all hover:bg-rose-500 active:scale-[0.97] shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3">
                                Ücretsiz Başla <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="px-10 py-5 bg-white text-slate-700 border border-slate-200/80 font-bold text-base rounded-[20px] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.97]">
                                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                                    <Play size={18} fill="currentColor" />
                                </div>
                                Nasıl Çalışır?
                            </button>
                        </motion.div>

                        {/* Integrated Stats */}
                        <motion.div
                            custom={4} variants={fadeUp} initial="hidden" animate="visible"
                            className="flex items-center gap-10 border-t border-slate-100 pt-10"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                                        <img src={`https://avatar.iran.liara.run/public/${i + 20}`} alt="User" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-rose-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">+</div>
                            </div>
                            <div>
                                <div className="text-xl font-black text-slate-900 leading-none mb-1">2,400+</div>
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Aktif Kullanıcı</div>
                            </div>
                            <div className="h-10 w-[1px] bg-slate-100" />
                            <div className="hidden sm:block">
                                <div className="flex items-center gap-1 text-amber-500 mb-1">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">5.0 Müşteri Memnuniyeti</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ─── RIGHT: Visual Block (Device Frame) ─── */}
                    <motion.div
                        custom={2} variants={fadeUp} initial="hidden" animate="visible"
                        className="flex-1 flex justify-center lg:justify-end relative"
                    >
                        <div className="relative group">
                            {/* Layered Decorative Background Shapes */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-100/50 rounded-full blur-2xl -z-10 animate-pulse" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-100/50 rounded-full blur-2xl -z-10 animate-pulse" />

                            {/* ─── PREMIUM PHONE MOCKUP ─── */}
                            <div className="relative w-[320px] md:w-[350px] aspect-[9/18.5] p-2.5 bg-slate-900 rounded-[3.5rem] shadow-[0_45px_100px_rgba(15,23,42,0.15)] border-[8px] border-slate-800 flex flex-col">
                                {/* Speaker/Cam Notcher */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-28 bg-slate-800 rounded-b-[1.5rem] z-20 flex items-center justify-center">
                                    <div className="w-8 h-1 bg-slate-600/50 rounded-full" />
                                </div>

                                {/* App UI Screen */}
                                <div className="flex-1 bg-white rounded-[2.8rem] overflow-hidden relative flex flex-col">
                                    {/* App Status Bar */}
                                    <div className="h-10 flex items-center justify-between px-8 text-slate-400 pt-4">
                                        <span className="text-[11px] font-bold tracking-tight italic">9:41</span>
                                        <div className="flex gap-1.5 items-center">
                                            <div className="w-4 h-2 rounded-sm bg-slate-200" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                        </div>
                                    </div>

                                    {/* Web Address Bar Wrapper */}
                                    <div className="px-6 mb-4">
                                        <div className="bg-slate-50/80 rounded-2xl px-4 py-2 border border-slate-100 flex items-center gap-2">
                                            <ShieldCheck size={12} className="text-emerald-500" />
                                            <span className="text-[10px] text-slate-400 font-medium truncate">kardly.com/aysedemir</span>
                                        </div>
                                    </div>

                                    {/* ─── CARD CONTENT (High-Premium Style) ─── */}
                                    <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                                        {/* Cover */}
                                        <div className="h-32 bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 relative">
                                            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" fill="none">
                                                <path fill="white" d="M0,256L60,240C120,224,240,192,360,186.7C480,181,600,203,720,202.7C840,203,960,181,1080,186.7C1200,192,1320,224,1380,240L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                                            </svg>
                                        </div>

                                        {/* Profile */}
                                        <div className="px-6 -mt-10 relative text-center">
                                            <div className="inline-block p-1.5 bg-white rounded-3xl shadow-xl shadow-rose-200/50 mb-4 transform group-hover:scale-105 transition-transform duration-500">
                                                <div className="w-20 h-20 rounded-[20px] bg-slate-100 flex items-center justify-center overflow-hidden">
                                                    <img src="https://avatar.iran.liara.run/public/girl" alt="Ayşe" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Ayşe Demir</h3>
                                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-6 mt-1">UX/UI Designer</div>

                                            {/* Quick Actions (Floating Grid) */}
                                            <div className="grid grid-cols-2 gap-3 mb-8">
                                                <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-col items-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 transition-all">
                                                    <Phone size={16} fill="white" strokeWidth={0} />
                                                    <span className="text-[9px] font-black uppercase tracking-wider">Hemen Ara</span>
                                                </div>
                                                <div className="p-3.5 rounded-2xl bg-rose-500 text-white flex flex-col items-center gap-2 shadow-lg shadow-rose-500/20 active:scale-95 transition-all">
                                                    <Mail size={16} fill="white" strokeWidth={0} />
                                                    <span className="text-[9px] font-black uppercase tracking-wider">E-posta</span>
                                                </div>
                                            </div>

                                            {/* Links List (Premium Glass Look) */}
                                            <div className="space-y-2.5">
                                                {[
                                                    { label: 'LinkedIn', icon: <Linkedin size={14} />, color: 'bg-blue-50 text-blue-600' },
                                                    { label: 'Portfolio', icon: <Globe size={14} />, color: 'bg-emerald-50 text-emerald-600' },
                                                    { label: 'Instagram', icon: <Instagram size={14} />, color: 'bg-pink-50 text-pink-600' },
                                                ].map((link, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 1.5 + i * 0.1 }}
                                                        className="group bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-md transition-all cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-xl ${link.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                                                {link.icon}
                                                            </div>
                                                            <span className="text-[11px] font-bold text-slate-700">{link.label}</span>
                                                        </div>
                                                        <ExternalLink size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Bottom Badge */}
                                            <div className="mt-8 pt-6 border-t border-slate-50">
                                                <div className="flex justify-center items-center gap-1 text-amber-500 mb-2">
                                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider italic">&ldquo;Premium Member &middot; Top rated&rdquo;</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* EXTRA FLOATING ELEMENTS - Closer and better integrated */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-12 bg-white/90 backdrop-blur-md p-4 rounded-[24px] shadow-2xl border border-slate-100 flex items-center gap-3 z-30"
                            >
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <Users size={18} />
                                </div>
                                <div className="pr-4">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Yeni Kayıt</div>
                                    <div className="text-xs font-black text-slate-900 leading-tight">Can Berk</div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 8, 0], x: [0, 5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-6 -left-12 bg-white/90 backdrop-blur-md p-4 rounded-[24px] shadow-2xl border border-slate-100 flex flex-col items-start gap-1 z-30"
                            >
                                <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Live Stats
                                </div>
                                <div className="flex items-end gap-1.5 h-10">
                                    {[15, 25, 18, 35, 20, 28].map((h, i) => (
                                        <div key={i} className="w-2.5 bg-rose-500/10 rounded-t-sm" style={{ height: `${h}px` }} />
                                    ))}
                                </div>
                                <div className="text-[14px] font-black text-slate-900 mt-1 flex items-center gap-1">
                                    +14.2% <span className="text-[10px] font-bold text-slate-400 tracking-tight">Artış</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
