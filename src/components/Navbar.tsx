"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Layout, Menu, X, ArrowRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-6 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-[2rem] px-8 py-3.5 border-white/10 shadow-2xl">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-all duration-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                        <Layout className="text-white w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter leading-none">KARDLY<span className="text-primary">.</span></span>
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mt-0.5">Professional UI</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-widest text-foreground/60">
                    <Link href="#features" className="hover:text-primary transition-colors">Özellikler</Link>
                    <Link href="#pricing" className="hover:text-primary transition-colors">Fiyatlandırma</Link>
                    <Link href="#templates" className="hover:text-primary transition-colors">Şablonlar</Link>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <Link href="/login" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">Giriş</Link>
                    <Link
                        href="/register"
                        className="bg-primary text-white px-7 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 hover:bg-primary/90 active:scale-95 transition-all"
                    >
                        Hemen Başla
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden p-2 text-foreground/60 hover:text-primary transition-colors" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="md:hidden absolute top-28 left-6 right-6 glass rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-2xl z-50 border-white/10"
                    >
                        <Link href="#features" onClick={() => setIsOpen(false)} className="text-xl font-bold flex items-center justify-between">Özellikler <ArrowRight className="w-5 h-5 opacity-40" /></Link>
                        <Link href="#pricing" onClick={() => setIsOpen(false)} className="text-xl font-bold flex items-center justify-between">Fiyatlandırma <ArrowRight className="w-5 h-5 opacity-40" /></Link>
                        <Link href="#templates" onClick={() => setIsOpen(false)} className="text-xl font-bold flex items-center justify-between">Şablonlar <ArrowRight className="w-5 h-5 opacity-40" /></Link>
                        <hr className="border-white/5 my-2" />
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/login" className="flex items-center justify-center py-4 rounded-2xl font-bold border border-white/10">Giriş</Link>
                            <Link href="/register" className="flex items-center justify-center py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20">Başla</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
