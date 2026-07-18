"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, ArrowLeft, Check, X, Sparkles, Zap, Crown, Star } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"

const faqs = [
    {
        question: "Ücretsiz plan gerçekten ücretsiz mi?",
        answer: "Evet! Ücretsiz planımız sonsuza kadar ücretsizdir. Kredi kartı bilgisi gerekmez. 1 dijital kartvizit oluşturabilir, temel şablonları kullanabilir ve sınırsız paylaşım yapabilirsiniz."
    },
    {
        question: "Planlar arasında istediğim zaman geçiş yapabilir miyim?",
        answer: "Elbette! İstediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Yükseltme anında geçerli olur, düşürme ise mevcut dönem sonunda uygulanır."
    },
    {
        question: "Yıllık planda indirim var mı?",
        answer: "Evet, yıllık ödeme tercih ettiğinizde aylık plana kıyasla %20'ye varan indirimlerden yararlanabilirsiniz. Pro plan aylık ₺49 yerine ₺39, İşletme planı aylık ₺99 yerine ₺79 olarak faturalandırılır."
    },
    {
        question: "İptal etmek istersem ne olur?",
        answer: "İstediğiniz zaman aboneliğinizi iptal edebilirsiniz. İptal sonrasında mevcut dönem sonuna kadar premium özelliklerinizi kullanmaya devam edebilirsiniz. Verileriniz silinmez, ücretsiz plana geçiş yapılır."
    }
]

export default function FiyatlandirmaPage() {
    const { t } = useTranslation()
    const [isYearly, setIsYearly] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            {/* Header / Navigation */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-rose-200/40 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-600 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Layout className="text-white w-5 h-5 relative z-10" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-xl font-black tracking-tighter leading-none text-slate-950">Kardly<span className="text-rose-500">.site</span></span>
                            <span className="text-[9px] font-bold text-slate-400 tracking-[0.1em] mt-0.5 ml-0.5">link to success</span>
                        </div>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={14} /> {t('back')}
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-rose-50/80 via-violet-50/40 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-rose-200/30 via-violet-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-[11px] font-bold uppercase tracking-widest text-slate-600 shadow-sm">
                            <Sparkles size={14} className="text-rose-500" /> Fiyatlandırma
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                            <span className="bg-gradient-to-r from-rose-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
                                Planınızı Seçin
                            </span>
                        </h1>
                        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                            İhtiyacınıza uygun planı seçin ve dijital kartvizitinizi dakikalar içinde oluşturmaya başlayın. Tüm planlar 14 gün ücretsiz deneme içerir.
                        </p>
                    </motion.div>

                    {/* Monthly/Yearly Toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-10 flex items-center justify-center gap-4"
                    >
                        <span className={`text-sm font-semibold transition-colors ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Aylık</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isYearly ? 'bg-gradient-to-r from-rose-500 to-violet-500' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isYearly ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-sm font-semibold transition-colors ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Yıllık</span>
                        {isYearly && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                %20 İndirim
                            </span>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">

                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-500 group"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-slate-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Ücretsiz</h3>
                                    <p className="text-xs text-slate-500">Başlangıç için ideal</p>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900">₺0</span>
                                <span className="text-slate-500 text-sm font-medium">/ay</span>
                            </div>

                            <Link
                                href="/register"
                                className="block w-full py-3.5 rounded-2xl bg-slate-100 text-slate-900 text-sm font-bold text-center hover:bg-slate-200 transition-colors"
                            >
                                Ücretsiz Başla
                            </Link>

                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                {[
                                    { text: "1 dijital kartvizit", included: true },
                                    { text: "Temel şablonlar", included: true },
                                    { text: "QR kod oluşturma", included: true },
                                    { text: "Sınırsız paylaşım", included: true },
                                    { text: "Temel istatistikler", included: true },
                                    { text: "Özel alan adı", included: false },
                                    { text: "AI asistanı", included: false },
                                    { text: "Öncelikli destek", included: false },
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        {feature.included ? (
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-emerald-600" />
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                <X className="w-3 h-3 text-slate-400" />
                                            </div>
                                        )}
                                        <span className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Pro Plan - Highlighted */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative bg-gradient-to-br from-rose-500 to-violet-600 rounded-3xl p-8 shadow-2xl shadow-rose-200/50 hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 group md:scale-105 md:-mt-4 md:mb-[-16px]"
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-[1px] bg-gradient-to-br from-rose-400 via-violet-400 to-indigo-400 rounded-3xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity -z-10" />

                        {/* Popular badge */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-[11px] font-bold uppercase tracking-widest text-rose-600 shadow-lg">
                                <Star className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> En Popüler
                            </div>
                        </div>

                        <div className="space-y-6 pt-2">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <Crown className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Pro</h3>
                                    <p className="text-xs text-white/70">En çok tercih edilen</p>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₺{isYearly ? '39' : '49'}</span>
                                <span className="text-white/70 text-sm font-medium">/ay</span>
                                {isYearly && (
                                    <span className="ml-2 text-xs font-semibold text-white/60 line-through">₺49</span>
                                )}
                            </div>

                            <Link
                                href="/register"
                                className="block w-full py-3.5 rounded-2xl bg-white text-rose-600 text-sm font-bold text-center hover:bg-white/90 transition-colors shadow-lg"
                            >
                                Pro&apos;ya Geç
                            </Link>

                            <div className="space-y-3 pt-4 border-t border-white/20">
                                {[
                                    "Sınırsız kartvizit",
                                    "Tüm premium şablonlar",
                                    "QR kod oluşturma",
                                    "Sınırsız paylaşım",
                                    "Gelişmiş istatistikler",
                                    "Özel alan adı",
                                    "AI asistanı",
                                    "E-posta desteği",
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-sm text-white/90">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Enterprise Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="relative bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">İşletme</h3>
                                    <p className="text-xs text-slate-400">Takımlar için güçlü</p>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₺{isYearly ? '79' : '99'}</span>
                                <span className="text-slate-400 text-sm font-medium">/ay</span>
                                {isYearly && (
                                    <span className="ml-2 text-xs font-semibold text-slate-500 line-through">₺99</span>
                                )}
                            </div>

                            <Link
                                href="/iletisim"
                                className="block w-full py-3.5 rounded-2xl bg-white text-slate-900 text-sm font-bold text-center hover:bg-slate-100 transition-colors"
                            >
                                İletişime Geç
                            </Link>

                            <div className="space-y-3 pt-4 border-t border-white/10">
                                {[
                                    "Pro'daki her şey",
                                    "Takım yönetimi",
                                    "Toplu kartvizit oluşturma",
                                    "Marka özelleştirme",
                                    "API erişimi",
                                    "Öncelikli destek",
                                    "Özel entegrasyonlar",
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-emerald-400" />
                                        </div>
                                        <span className="text-sm text-slate-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Sıkça Sorulan Sorular</h2>
                    <p className="text-slate-500 mt-3 text-sm">Fiyatlandırma hakkında merak edilenler</p>
                </motion.div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full bg-white rounded-2xl border border-slate-200 p-5 text-left hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                                    <div className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-45' : ''}`}>
                                        <span className="text-slate-600 text-sm font-bold">+</span>
                                    </div>
                                </div>
                                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 mt-3' : 'max-h-0'}`}>
                                    <p className="text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
                                </div>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 md:p-16 text-center"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(244,63,94,0.15),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.15),transparent_60%)]" />

                    <div className="relative z-10 space-y-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Hala kararsız mısınız?</h2>
                        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                            Sizin için en uygun planı birlikte belirleyelim. Ekibimiz sorularınızı yanıtlamak için hazır.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/iletisim"
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-slate-900 text-sm font-bold hover:bg-slate-100 transition-colors shadow-lg"
                            >
                                İletişime Geçin
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
                            >
                                Ücretsiz Deneyin
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
