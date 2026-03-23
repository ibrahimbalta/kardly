"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/context/LanguageContext"

export function CookieBanner() {
    const { t } = useTranslation()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent")
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted")
        setIsVisible(false)
    }

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined")
        setIsVisible(false)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-[9999]"
                >
                    <div className="bg-white/80 backdrop-blur-2xl border border-slate-200 p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden relative group">
                        {/* Decorative Gradient Background */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-rose-500/10 blur-[60px] rounded-full group-hover:bg-rose-500/20 transition-all duration-700" />
                        
                        <div className="relative z-10">
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 flex-shrink-0 animate-bounce-subtle">
                                    <Cookie size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 mb-1 tracking-tight">Kardly Cookies</h3>
                                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                        {t('cookieBannerText')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 py-3 px-4 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-rose-500 transition-all duration-300 shadow-lg shadow-slate-900/10 hover:shadow-rose-500/20 active:scale-95"
                                >
                                    {t('acceptCookies')}
                                </button>
                                <Link
                                    href="/gizlilik"
                                    className="py-3 px-6 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-xl hover:bg-slate-200 transition-colors active:scale-95"
                                >
                                    {t('moreInfo')}
                                </Link>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="p-3 text-slate-300 hover:text-slate-600 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
