"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, ArrowLeft, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "@/context/LanguageContext"

function FaqItem({ q, a }: { q: string, a: string }) {
    const { language } = useTranslation()
    const [open, setOpen] = useState(false)

    return (
        <div className="border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors">
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left px-8 py-6 flex items-center justify-between gap-4"
            >
                <span className="text-base font-semibold text-slate-900">{q}</span>
                <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-8 pb-6"
                >
                    <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
                </motion.div>
            )}
        </div>
    )
}

export default function SSSPage() {
    const { t, language } = useTranslation()
    const faqs = t('faqs') as unknown as { q: string, a: string }[]

    return (
        <main className="min-h-screen bg-white">
            <div className="bg-slate-50 border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-rose-200">
                            <Layout className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900">Kardly<span className="text-rose-500">.</span></span>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={16} /> {t('back')}
                    </Link>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4">{t('faq')}</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">{t('faqTitle')}</h1>
                    <p className="text-slate-500 text-lg mb-16">{t('faqSubtitle')}</p>
                </motion.div>

                <div className="space-y-4">
                    {Array.isArray(faqs) && faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <FaqItem q={faq.q} a={faq.a} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    )
}
