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
        <nav className="fixed top-0 w-full z-50 px-6 py-6 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-[2rem] px-8 py-3.5 border-white shadow-xl shadow-rose-100/20 bg-white/80">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-11 h-11 bg-rose-500 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-rose-200">
                        <Layout className="text-white w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter leading-none text-slate-900">KARDLY<span className="text-rose-500">.</span></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Professional UI</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-widest text-slate-500">
                    <Link href="#features" className="hover:text-rose-500 transition-colors">{t('features')}</Link>
                    <Link href="#templates" className="hover:text-rose-500 transition-colors">{t('templates')}</Link>
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
                <div className="md:hidden flex items-center gap-4">
                    <LanguageSwitcher />
                    <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="md:hidden absolute top-28 left-6 right-6 glass rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-2xl z-50 border-slate-100 bg-white"
                    >
                        <Link href="#features" onClick={() => setIsOpen(false)} className="text-xl font-black flex items-center justify-between text-slate-900">{t('features')} <ArrowRight className="w-5 h-5 text-rose-500" /></Link>
                        <Link href="#templates" onClick={() => setIsOpen(false)} className="text-xl font-black flex items-center justify-between text-slate-900">{t('templates')} <ArrowRight className="w-5 h-5 text-rose-500" /></Link>
                        <hr className="border-slate-100 my-2" />
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/login" className="flex items-center justify-center py-4 rounded-2xl font-black border border-slate-100 text-slate-500">{t('login')}</Link>
                            <Link href="/register" className="flex items-center justify-center py-4 bg-rose-500 text-white rounded-2xl font-black shadow-lg shadow-rose-200">{t('getStarted')}</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
