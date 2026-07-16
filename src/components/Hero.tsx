"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, Sparkles, Star } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"

interface HeroProps {
    onHowItWorksClick?: () => void
}

export function Hero({ onHowItWorksClick }: HeroProps) {
    const { t } = useTranslation()
    const router = useRouter()
    const [claimUsername, setClaimUsername] = useState("")

    const handleClaim = (e: React.FormEvent) => {
        e.preventDefault()
        const cleaned = claimUsername.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
        if (!cleaned) return
        localStorage.setItem("pending_username", cleaned)
        router.push("/register")
    }

    return (
        <section className="relative min-h-[95vh] flex items-center bg-[#fcfbfc] overflow-hidden pt-36 pb-20 px-6 z-10">
            
            {/* ─── VIBRANT GRADIENT MESH BACKGROUND ─── */}
            <div className="absolute top-[-10%] right-[-10%] w-[65vw] h-[65vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.18),transparent_65%)] blur-[60px] pointer-events-none" />
            <div className="absolute top-[20%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.14),transparent_65%)] blur-[65px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12),transparent_60%)] blur-[55px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08),transparent_60%)] blur-[50px] pointer-events-none" />

            {/* Premium geometric grid lines overlay */}
            <svg className="absolute inset-0 w-full h-full stroke-slate-200/40 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] opacity-60 pointer-events-none" aria-hidden="true">
                <defs>
                    <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse" x="100%">
                        <path d="M.5 40V.5H40" fill="none" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" strokeWidth="0" />
            </svg>

            <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-6">
                    
                    {/* ─── LEFT COLUMN: Brand Message & Link Claim ─── */}
                    <div className="flex-[1] text-left lg:pr-2 w-full">
                        {/* Premium Soft Badge */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100/80 mb-8 text-[10px] font-black uppercase tracking-[0.22em] text-rose-600 shadow-sm relative overflow-hidden">
                            <Sparkles size={11} className="text-rose-500 animate-pulse" />
                            <span>{t('heroBadge') || "Yeni Nesil Dijital Kartvizit"}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-6xl xl:text-7.5xl font-extrabold tracking-tight mb-6 leading-[1.05] text-slate-900">
                            {t('heroTitle1') || "Profesyonel"}{" "}
                            <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-550 via-purple-600 to-indigo-650 italic font-serif tracking-normal">
                                {t('heroTitle3') || "tek linkte"}
                            </span>{" "}
                            {t('heroTitle4') || "buluşturun."}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base md:text-lg text-slate-500 max-w-xl mb-10 leading-relaxed font-semibold">
                            {t('heroDesc2') || "Portfolyonuz, randevularınız, ödemeleriniz ve iletişim kanallarınız — hepsi tek bir şık ve temassız dijital profilde. Yapay zeka ile 30 saniyede hazır."}
                        </p>

                        {/* Claim Form */}
                        <form onSubmit={handleClaim} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-xl mb-8 w-full relative">
                            <div className="relative flex-1 flex items-center bg-white border border-slate-200 rounded-2xl shadow-[0_4px_20px_rgba(244,63,94,0.03)] focus-within:border-rose-450 focus-within:ring-4 focus-within:ring-rose-100/50 transition-all px-5 py-4.5">
                                <span className="text-slate-400 font-bold text-sm sm:text-base select-none shrink-0">kardly.site/</span>
                                <input
                                    type="text"
                                    placeholder={t('usernameLabel') || "kullaniciadi"}
                                    value={claimUsername}
                                    onChange={(e) => setClaimUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                    className="w-full bg-transparent focus:outline-none pl-0.5 text-slate-800 font-bold text-sm sm:text-base placeholder:text-slate-300 placeholder:font-normal"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-9 py-4.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-750 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 shrink-0"
                            >
                                {t('ctaStart') || "Ücretsiz Başla"}
                                <ArrowRight size={14} />
                            </button>
                        </form>

                        {/* Benefits list */}
                        <div className="flex flex-wrap items-center gap-6 text-slate-400 text-xs font-semibold mb-10 border-b border-slate-100 pb-8">
                            <span className="flex items-center gap-2">
                                <Check size={16} className="text-emerald-500" /> Ömür Boyu Ücretsiz
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            <span className="flex items-center gap-2">
                                <Check size={16} className="text-rose-500" /> Kredi Kartı Gerekmez
                            </span>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-5">
                            <div className="flex -space-x-3.5">
                                {[
                                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                                ].map((url, i) => (
                                    <div key={i} className="w-10 h-10 rounded-xl border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                                        <img src={url} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-xl border-4 border-white bg-rose-500 flex items-center justify-center text-[10px] font-black text-white shadow-md">+2K</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <span className="text-amber-500 flex"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></span>
                                    <span className="font-extrabold">4.9 / 5.0</span>
                                </div>
                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Müşteri Memnuniyeti</div>
                            </div>
                        </div>
                    </div>

                    {/* ─── RIGHT COLUMN: Large Transparent Group Photo ─── */}
                    <div className="flex-[1.25] w-full flex justify-center lg:justify-end relative min-h-[420px] lg:min-h-[580px] lg:-mr-16">
                        {/* Radial Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-rose-300/30 via-indigo-200/30 to-amber-200/25 blur-[100px] rounded-full scale-125 pointer-events-none" />

                        {/* Large Image Container (Stable / No bounce animation) */}
                        <div className="relative w-full max-w-[680px] aspect-[1.15/1] overflow-hidden select-none flex items-center justify-center">
                            <img 
                                src="/images/group_using_kardly_app_transparent.png" 
                                alt="Group of diverse professionals holding phones with Kardly" 
                                className="w-full h-full object-contain" 
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
