"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, ArrowLeft } from "lucide-react"

export default function KullanimSartlariPage() {
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
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4">Yasal</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Kullanım Şartları</h1>
                    <p className="text-slate-500 text-sm mb-12">Son güncelleme: 20 Şubat 2026</p>
                </motion.div>

                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-slate-500 prose-p:leading-relaxed prose-li:text-slate-500">
                    <h2>1. Genel Şartlar</h2>
                    <p>Bu web sitesine erişerek ve Kardly hizmetlerini kullanarak, aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız. Bu şartları kabul etmiyorsanız, lütfen hizmetlerimizi kullanmayın.</p>

                    <h2>2. Hizmet Tanımı</h2>
                    <p>Kardly, kullanıcılara dijital kartvizit ve profesyonel profil oluşturma imkanı sunan bir web platformudur. Kullanıcılar projelerini, uzmanlık alanlarını, iletişim bilgilerini ve hizmetlerini tek bir profil sayfasında toplayabilir.</p>

                    <h2>3. Hesap Oluşturma</h2>
                    <p>Hizmetlerimizi kullanmak için bir hesap oluşturmanız gerekmektedir. Hesabınızla ilgili tüm bilgilerin doğru ve güncel olmasından siz sorumlusunuz. Hesap güvenliğinizden ve hesabınız üzerinden gerçekleştirilen tüm aktivitelerden siz sorumlusunuz.</p>

                    <h2>4. Kullanıcı İçerikleri</h2>
                    <p>Platforma yüklediğiniz tüm içeriklerden (metin, görsel, link vb.) tamamen siz sorumlusunuz. Yasalara aykırı, telif hakkı ihlali içeren veya yanıltıcı içerikler yüklemek kesinlikle yasaktır.</p>

                    <h2>5. Ödeme ve Abonelik</h2>
                    <p>Premium özelliklere erişim için ücretli abonelik planlarımız mevcuttur. Ödeme işlemleri güvenli ödeme altyapıları (Stripe, PayTR) üzerinden gerçekleştirilir. İade politikamız, satın alma tarihinden itibaren 14 gün içinde geçerlidir.</p>

                    <h2>6. Fikri Mülkiyet</h2>
                    <p>Kardly platformunun tasarımı, kodu, logosu ve diğer tüm unsurları Kardly'ye aittir. Kullanıcılar, kendi oluşturdukları içeriklerin fikri mülkiyet haklarını korurlar.</p>

                    <h2>7. Hizmet Değişiklikleri</h2>
                    <p>Kardly, hizmetlerini ve bu kullanım şartlarını önceden bildirmeksizin değiştirme hakkını saklı tutar. Önemli değişiklikler e-posta veya platform üzerinden bildirilecektir.</p>

                    <h2>8. Hesap Sonlandırma</h2>
                    <p>Kardly, kullanım şartlarını ihlal eden hesapları önceden bildirimde bulunmaksızın askıya alma veya sonlandırma hakkına sahiptir.</p>

                    <h2>9. İletişim</h2>
                    <p>Bu şartlarla ilgili sorularınız için <Link href="/iletisim" className="text-rose-500 hover:underline">iletişim sayfamızdan</Link> bize ulaşabilirsiniz.</p>
                </div>
            </div>
        </main>
    )
}
