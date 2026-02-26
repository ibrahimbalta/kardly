"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, ArrowLeft, ShieldCheck, Mail, Clock, FileText } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"

export default function KullanimSartlariPage() {
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
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest">
                                <ShieldCheck size={12} /> {t('termsLegalDoc')}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{t('termsOfUse')}</h1>
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <Clock size={14} />
                                <span>{t('termsLastUpdate')}</span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {t('termsSummary')}
                            </p>
                        </motion.div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('termsQuickAccess')}</h3>
                            <div className="space-y-2">
                                {[
                                    { id: "genel", label: t('termsSection1Title') },
                                    { id: "hizmet", label: t('termsSection2Title') },
                                    { id: "hesap", label: t('termsSection3Title') },
                                    { id: "icerik", label: t('termsSection4Title') },
                                    { id: "odeme", label: t('termsSection5Title') },
                                    { id: "fikri", label: t('termsSection6Title') }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        className="block w-full text-left text-xs text-slate-500 hover:text-rose-600 transition-colors py-1"
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
                                <Mail className="text-white w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold">{t('termsQuestionTitle')}</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                {t('termsQuestionDesc')}
                            </p>
                            <Link
                                href="/iletisim"
                                className="inline-flex items-center justify-center w-full py-2.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-rose-50 transition-colors"
                            >
                                {t('termsContactUs')}
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
                                <section id="genel">
                                    <h2>{t('termsSection1Title')}</h2>
                                    <p>{t('termsSection1Desc')}</p>
                                </section>

                                <section id="hizmet">
                                    <h2>{t('termsSection2Title')}</h2>
                                    <p>{t('termsSection2Desc')}</p>
                                </section>

                                <section id="hesap">
                                    <h2>{t('termsSection3Title')}</h2>
                                    <p>{t('termsSection3Desc')}</p>
                                </section>

                                <section id="icerik">
                                    <h2>{t('termsSection4Title')}</h2>
                                    <p>{t('termsSection4Desc')}</p>
                                </section>

                                <section id="odeme">
                                    <h2>{t('termsSection5Title')}</h2>
                                    <p>{t('termsSection5Desc')}</p>
                                </section>

                                <section id="fikri">
                                    <h2>{t('termsSection6Title')}</h2>
                                    <p>{t('termsSection6Desc')}</p>
                                </section>

                                <h2>{t('termsSection7Title')}</h2>
                                <p>{t('termsSection7Desc')}</p>

                                <h2>{t('termsSection8Title')}</h2>
                                <p>{t('termsSection8Desc')}</p>

                                <h2>{t('termsSection9Title')}</h2>
                                <p>{t('termsSection9Desc')}</p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                                    <FileText size={14} /> {t('termsProfessionalLegal')}
                                </div>
                                <button
                                    onClick={() => window.print()}
                                    className="text-xs font-bold text-slate-900 flex items-center gap-2 hover:text-rose-600 transition-colors"
                                >
                                    {t('termsPrintDoc')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    )
}
