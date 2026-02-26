"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, ArrowLeft, Lock, Mail, Clock, Eye, ShieldCheck } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"

export default function GizlilikPage() {
    const { t } = useTranslation()

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            {/* Header / Navigation */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-rose-600 shadow-sm">
                            <Layout className="text-white w-4 h-4" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">Kardly<span className="text-rose-500">.</span></span>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={14} /> {t('back')}
                    </Link>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Title and Summary */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                                <Lock size={12} /> {t('privacyDataSecurity')}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{t('privacyPolicy')}</h1>
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <Clock size={14} />
                                <span>{t('termsLastUpdate')}</span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {t('privacySummary')}
                            </p>
                        </motion.div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('privacyContents')}</h3>
                            <div className="space-y-2">
                                {[
                                    { id: "toplanan", label: t('privacySection1Title') },
                                    { id: "kullanim", label: t('privacySection2Title') },
                                    { id: "paylasim", label: t('privacySection3Title') },
                                    { id: "cerezler", label: t('privacySection4Title') },
                                    { id: "guvenlik", label: t('privacySection5Title') },
                                    { id: "haklar", label: t('privacySection6Title') }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        className="block w-full text-left text-xs text-slate-500 hover:text-blue-600 transition-colors py-1"
                                        onClick={() => {
                                            const element = document.getElementById(item.id);
                                            element?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200 space-y-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="text-white w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold">{t('privacyKvkkTitle')}</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                {t('privacyKvkkDesc')}
                            </p>
                            <Link
                                href="/iletisim"
                                className="inline-flex items-center justify-center w-full py-2.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-blue-50 transition-colors"
                            >
                                {t('privacyMoreInfo')}
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Detailed Content */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm"
                        >
                            <div className="prose prose-slate prose-sm max-w-none 
                                prose-headings:text-slate-900 prose-headings:font-bold 
                                prose-h2:text-lg prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-100
                                prose-p:text-slate-600 prose-p:leading-relaxed 
                                prose-li:text-slate-600
                                prose-strong:text-slate-900"
                            >
                                <section id="toplanan">
                                    <h2>{t('privacySection1Title')}</h2>
                                    <p>{t('privacySection1Desc')}</p>
                                    <ul>
                                        <li><strong>{t('privacySection1Item1').split(':')[0]}:</strong>{t('privacySection1Item1').split(':')[1]}</li>
                                        <li><strong>{t('privacySection1Item2').split(':')[0]}:</strong>{t('privacySection1Item2').split(':')[1]}</li>
                                        <li><strong>{t('privacySection1Item3').split(':')[0]}:</strong>{t('privacySection1Item3').split(':')[1]}</li>
                                        <li><strong>{t('privacySection1Item4').split(':')[0]}:</strong>{t('privacySection1Item4').split(':')[1]}</li>
                                    </ul>
                                </section>

                                <section id="kullanim">
                                    <h2>{t('privacySection2Title')}</h2>
                                    <p>{t('privacySection2Desc')}</p>
                                    <ul>
                                        <li>{t('privacySection2Item1')}</li>
                                        <li>{t('privacySection2Item2')}</li>
                                        <li>{t('privacySection2Item3')}</li>
                                        <li>{t('privacySection2Item4')}</li>
                                    </ul>
                                </section>

                                <section id="paylasim">
                                    <h2>{t('privacySection3Title')}</h2>
                                    <p>{t('privacySection3Desc')}</p>
                                    <ul>
                                        <li>{t('privacySection3Item1')}</li>
                                        <li>{t('privacySection3Item2')}</li>
                                        <li>{t('privacySection3Item3')}</li>
                                    </ul>
                                </section>

                                <section id="cerezler">
                                    <h2>{t('privacySection4Title')}</h2>
                                    <p>{t('privacySection4Desc')}</p>
                                </section>

                                <section id="guvenlik">
                                    <h2>{t('privacySection5Title')}</h2>
                                    <p>{t('privacySection5Desc')}</p>
                                </section>

                                <section id="haklar">
                                    <h2>{t('privacySection6Title')}</h2>
                                    <p>{t('privacySection6Desc')}</p>
                                    <ul>
                                        <li>{t('privacySection6Item1')}</li>
                                        <li>{t('privacySection6Item2')}</li>
                                        <li>{t('privacySection6Item3')}</li>
                                        <li>{t('privacySection6Item4')}</li>
                                    </ul>
                                </section>

                                <h2>{t('privacySection7Title')}</h2>
                                <p>{t('privacySection7Desc')}</p>

                                <h2>{t('privacySection8Title')}</h2>
                                <p>{t('privacySection8Desc')}</p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                                    <Eye size={14} /> {t('privacyFramework')}
                                </div>
                                <div className="flex gap-4 text-xs font-bold text-slate-900">
                                    <button onClick={() => window.print()} className="hover:text-blue-600 transition-colors">{t('termsPrintDoc')}</button>
                                    <Link href="/kullanim-sartlari" className="hover:text-blue-600 transition-colors">{t('termsOfUse')}</Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    )
}
