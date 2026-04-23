"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Layout, Menu, X, ArrowRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { useTranslation } from "@/context/LanguageContext"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <nav className="fixed top-0 w-full z-50 px-3 sm:px-6 py-4 sm:py-6 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl sm:rounded-[2rem] px-4 sm:px-8 py-2.5 sm:py-3.5 border-white shadow-xl shadow-rose-100/20 bg-white/80">
                <Link href="/" className="flex items-center gap-2 sm:gap-3.5 group shrink-0">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 bg-rose-500 rounded-full flex items-center justify-center group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-rose-200/40 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-rose-600 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Layout className="text-white w-4 h-4 sm:w-6 sm:h-6 relative z-10" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-xl sm:text-3xl font-black tracking-tighter leading-none text-slate-950 flex items-center">
                            Kardly<span className="text-rose-500">.site</span>
                        </span>
                        <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 tracking-[0.1em] mt-0.5 sm:mt-1 ml-0.5">link to success</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-widest text-slate-500">
                    <Link href="#features" className="hover:text-rose-500 transition-colors uppercase">{t('features')}</Link>
                    <Link href="#templates" className="hover:text-rose-500 transition-colors uppercase">{t('templates')}</Link>
                    <Link 
                        href="/hub" 
                        className="relative group flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full font-black text-[10px] tracking-[0.2em] shadow-xl shadow-slate-200/50 hover:bg-rose-500 hover:shadow-rose-200 transition-all hover:scale-105 active:scale-95 group overflow-hidden"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        <span className="relative z-10">{t('businessHub')}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 group-hover:bg-white animate-pulse" />
                    </Link>
                    <Link href="#about" className="hover:text-rose-500 transition-colors uppercase">{t('about')}</Link>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <LanguageSwitcher />
                    <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">{t('login')}</Link>
                    <Link
                        href="/register"
                        className="bg-rose-500 text-white px-7 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-rose-200 hover:scale-105 hover:bg-rose-600 active:scale-95 transition-all"
                    >
                        {t('getStarted')}
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-1 sm:gap-4 ml-2">
                    <LanguageSwitcher />
                    <button 
                        className="p-1.5 sm:p-2 text-slate-800 hover:text-rose-500 transition-colors shrink-0 bg-slate-50 rounded-xl" 
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="md:hidden absolute top-[calc(100%+1rem)] left-4 right-4 glass rounded-3xl p-6 flex flex-col gap-5 shadow-2xl shadow-rose-200/20 z-50 border-slate-100 bg-white/95 backdrop-blur-xl"
                    >
                        <Link href="#features" onClick={() => setIsOpen(false)} className="text-lg font-bold flex items-center justify-between text-slate-800 px-2">
                            {t('features')} 
                            <ArrowRight className="w-4 h-4 text-rose-500 opacity-70" />
                        </Link>
                        <Link href="#templates" onClick={() => setIsOpen(false)} className="text-lg font-bold flex items-center justify-between text-slate-800 px-2">
                            {t('templates')} 
                            <ArrowRight className="w-4 h-4 text-rose-500 opacity-70" />
                        </Link>
                        
                        <Link 
                            href="/hub" 
                            onClick={() => setIsOpen(false)} 
                            className="bg-slate-950 text-white p-4 px-5 rounded-2xl text-lg font-bold flex items-center justify-between group shadow-xl shadow-slate-200/50"
                        >
                            <span className="flex items-center gap-3">
                                {t('businessHub')}
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            </span>
                            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-active:scale-90 transition-transform">
                                <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                        </Link>
                        
                        <Link href="#about" onClick={() => setIsOpen(false)} className="text-lg font-bold flex items-center justify-between text-slate-800 px-2">
                            {t('about')} 
                            <ArrowRight className="w-4 h-4 text-rose-500 opacity-70" />
                        </Link>
                        
                        <div className="h-px bg-slate-100 my-1 mx-2" />
                        
                        <div className="grid grid-cols-2 gap-3 pb-1">
                            <Link href="/login" className="flex items-center justify-center py-3.5 rounded-xl font-bold border border-slate-100 text-slate-500 text-sm">{t('login')}</Link>
                            <Link href="/register" className="flex items-center justify-center py-3.5 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 text-sm">{t('getStarted')}</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
