"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Layout, Menu, X, ArrowRight, Sparkles, User } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { useTranslation } from "@/context/LanguageContext"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <nav className="fixed top-0 w-full z-50 px-4 sm:px-8 py-5 transition-all duration-300">
            {/* Ultra-premium glass container with double border glow */}
            <div className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-xl bg-white/75 border border-white/50 rounded-3xl px-5 sm:px-8 py-3 shadow-[0_15px_40px_rgba(15,23,42,0.06)] relative overflow-hidden">
                
                {/* Subtle top light bar line */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-500/20 to-transparent" />

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-all duration-500 shadow-md shadow-rose-500/20 relative overflow-hidden">
                        <Layout className="text-white w-5 h-5 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-600 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-black tracking-tight leading-none text-slate-900">
                            Kardly<span className="text-rose-500 font-extrabold">.site</span>
                        </span>
                        <span className="text-[8px] font-black text-slate-400 tracking-[0.3em] uppercase mt-0.5 ml-0.5">link to success</span>
                    </div>
                </Link>

                {/* Desktop Navigation links */}
                <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500/90">
                    <Link href="#features" className="hover:text-rose-500 transition-colors uppercase relative py-1.5 group">
                        {t('features')}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-500 transition-all group-hover:w-full" />
                    </Link>
                    <Link href="#templates" className="hover:text-rose-500 transition-colors uppercase relative py-1.5 group">
                        {t('templates')}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-500 transition-all group-hover:w-full" />
                    </Link>
                    
                    {/* Business Hub Button - Premium Outline design */}
                    <Link 
                        href="/hub" 
                        className="relative flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-800 text-slate-800 rounded-full font-black text-[9px] tracking-[0.15em] transition-all bg-white hover:bg-slate-50 active:scale-95 shadow-sm"
                    >
                        <span>{t('businessHub')}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    </Link>
                    
                    <Link href="#about" className="hover:text-rose-500 transition-colors uppercase relative py-1.5 group">
                        {t('about')}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-500 transition-all group-hover:w-full" />
                    </Link>
                </div>

                {/* Action Buttons */}
                <div className="hidden md:flex items-center gap-5">
                    <LanguageSwitcher />
                    <Link 
                        href="/login" 
                        className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-rose-500 transition-colors flex items-center gap-1.5 py-2"
                    >
                        <User size={13} className="text-slate-400" />
                        {t('login')}
                    </Link>
                    <Link
                        href="/register"
                        className="bg-slate-950 text-white hover:bg-rose-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md transition-all hover:scale-[1.02] active:scale-95"
                    >
                        {t('getStarted')}
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-2 ml-2">
                    <LanguageSwitcher />
                    <button 
                        className="p-2 text-slate-800 hover:text-rose-500 transition-colors shrink-0 bg-slate-50 border border-slate-100 rounded-xl" 
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu dropdown */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="md:hidden absolute top-[calc(100%+0.5rem)] left-4 right-4 glass rounded-3xl p-6 flex flex-col gap-4.5 shadow-2xl z-50 border border-slate-100/80 bg-white/95 backdrop-blur-xl"
                    >
                        <Link href="#features" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase tracking-wider flex items-center justify-between text-slate-700 px-2 py-1">
                            {t('features')} 
                            <ArrowRight className="w-4 h-4 text-rose-500" />
                        </Link>
                        <Link href="#templates" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase tracking-wider flex items-center justify-between text-slate-700 px-2 py-1">
                            {t('templates')} 
                            <ArrowRight className="w-4 h-4 text-rose-500" />
                        </Link>
                        
                        <Link 
                            href="/hub" 
                            onClick={() => setIsOpen(false)} 
                            className="bg-slate-950 text-white p-3.5 px-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-between group shadow-lg"
                        >
                            <span className="flex items-center gap-2">
                                {t('businessHub')}
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            </span>
                            <ArrowRight className="w-4 h-4 text-white" />
                        </Link>
                        
                        <Link href="#about" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase tracking-wider flex items-center justify-between text-slate-700 px-2 py-1">
                            {t('about')} 
                            <ArrowRight className="w-4 h-4 text-rose-500" />
                        </Link>
                        
                        <div className="h-px bg-slate-100 my-1 mx-2" />
                        
                        <div className="grid grid-cols-2 gap-3 pb-1">
                            <Link href="/login" className="flex items-center justify-center py-3.5 rounded-xl font-bold border border-slate-100 text-slate-500 text-xs uppercase tracking-wider">{t('login')}</Link>
                            <Link href="/register" className="flex items-center justify-center py-3.5 bg-rose-500 text-white rounded-xl font-bold shadow-md shadow-rose-500/10 text-xs uppercase tracking-wider">{t('getStarted')}</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
