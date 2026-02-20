"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, ArrowLeft, ChevronDown } from "lucide-react"
import { useState } from "react"

const faqs = [
    {
        q: "Kardly nedir?",
        a: "Kardly, profesyonel dijital kartvizit ve kişisel profil oluşturma platformudur. Projelerinizi, uzmanlıklarınızı, iletişim bilgilerinizi ve hizmetlerinizi tek bir link altında toplayarak kolayca paylaşmanızı sağlar."
    },
    {
        q: "Kardly ücretsiz mi?",
        a: "Evet! Temel özellikler ücretsiz olarak kullanılabilir. Premium şablonlar ve gelişmiş özellikler için uygun fiyatlı planlarımız mevcuttur."
    },
    {
        q: "QR kod nasıl oluşturuluyor?",
        a: "Profilinizi oluşturduktan sonra otomatik olarak bir QR kod üretilir. Bu kodu kartvizitinize, sunumlarınıza veya sosyal medyanıza ekleyebilirsiniz."
    },
    {
        q: "Ödeme almak için ne yapmalıyım?",
        a: "Dashboard üzerinden Stripe veya PayTR entegrasyonunuzu aktifleştirin. Ardından profilinize ödeme butonu ekleyerek müşterilerinizden doğrudan ödeme alabilirsiniz."
    },
    {
        q: "Profilimi özelleştirebilir miyim?",
        a: "Evet. Farklı şablon temaları, renk paleti seçenekleri ve blok düzeni ile profilinizi tamamen kişiselleştirebilirsiniz."
    },
    {
        q: "Verilerim güvende mi?",
        a: "Kesinlikle. Tüm veriler şifrelenmiş bağlantılar üzerinden iletilir ve güvenli sunucularda saklanır. Kişisel bilgileriniz üçüncü taraflarla paylaşılmaz."
    },
    {
        q: "Randevu sistemi nasıl çalışıyor?",
        a: "Profilinizde randevu butonunu etkinleştirdikten sonra, ziyaretçileriniz sizinle doğrudan randevu talebi oluşturabilir. Gelen talepler dashboard üzerinden yönetilir."
    },
    {
        q: "Kardly'yi hangi cihazlarda kullanabilirim?",
        a: "Kardly tamamen responsive bir platformdur. Bilgisayar, tablet ve mobil cihazlarda sorunsuz çalışır."
    },
]

function FaqItem({ q, a }: { q: string, a: string }) {
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
                        <ArrowLeft size={16} /> Ana Sayfa
                    </Link>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4">SSS</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Sıkça Sorulan Sorular</h1>
                    <p className="text-slate-500 text-lg mb-16">Merak ettiklerinizin yanıtlarını burada bulabilirsiniz.</p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
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
