"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                        <Layout className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Kardly<span className="text-primary text-2xl">.</span></span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link href="#features" className="hover:text-primary transition-colors">Özellikler</Link>
                    <Link href="#pricing" className="hover:text-primary transition-colors">Fiyatlandırma</Link>
                    <Link href="#templates" className="hover:text-primary transition-colors">Şablonlar</Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Giriş Yap</Link>
                    <Link
                        href="/register"
                        className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        Hemen Başla
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-24 left-6 right-6 glass rounded-2xl p-6 flex flex-col gap-4 shadow-xl"
                >
                    <Link href="#features" className="text-lg font-medium">Özellikler</Link>
                    <Link href="#pricing" className="text-lg font-medium">Fiyatlandırma</Link>
                    <Link href="#templates" className="text-lg font-medium">Şablonlar</Link>
                    <hr className="border-white/10" />
                    <Link href="/login" className="text-lg font-medium">Giriş Yap</Link>
                    <Link href="/register" className="bg-primary text-white px-5 py-3 rounded-xl text-center font-semibold">Hemen Başla</Link>
                </motion.div>
            )}
        </nav>
    )
}
