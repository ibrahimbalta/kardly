"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, ArrowLeft } from "lucide-react"

export default function GizlilikPage() {
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
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Gizlilik Politikası</h1>
                    <p className="text-slate-500 text-sm mb-12">Son güncelleme: 20 Şubat 2026</p>
                </motion.div>

                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-slate-500 prose-p:leading-relaxed prose-li:text-slate-500">
                    <h2>1. Toplanan Bilgiler</h2>
                    <p>Kardly, hizmetlerini sağlamak için aşağıdaki bilgileri toplayabilir:</p>
                    <ul>
                        <li>Ad, soyad ve e-posta adresi (hesap oluşturma sırasında)</li>
                        <li>Profil bilgileri (meslek, hizmetler, sosyal medya linkleri vb.)</li>
                        <li>Kullanım verileri (ziyaret istatistikleri, tıklama verileri)</li>
                        <li>Ödeme bilgileri (güvenli ödeme altyapıları üzerinden)</li>
                    </ul>

                    <h2>2. Bilgilerin Kullanımı</h2>
                    <p>Topladığımız bilgiler yalnızca aşağıdaki amaçlarla kullanılır:</p>
                    <ul>
                        <li>Hesap oluşturma ve yönetimi</li>
                        <li>Hizmet sunumu ve iyileştirme</li>
                        <li>Kullanıcı destek hizmetleri</li>
                        <li>Güvenlik ve dolandırıcılık önleme</li>
                    </ul>

                    <h2>3. Bilgi Paylaşımı</h2>
                    <p>Kişisel bilgileriniz üçüncü taraflarla paylaşılmaz. Aşağıdaki durumlar hariç:</p>
                    <ul>
                        <li>Yasal zorunluluklar (mahkeme kararı vb.)</li>
                        <li>Ödeme işlemleri için güvenli ödeme altyapıları (Stripe, PayTR)</li>
                        <li>Kullanıcının açık rızası ile</li>
                    </ul>

                    <h2>4. Çerezler (Cookies)</h2>
                    <p>Kardly, kullanıcı deneyimini iyileştirmek için oturum çerezleri kullanır. Bu çerezler kimlik doğrulama ve tercih hatırlama amacıyla kullanılır.</p>

                    <h2>5. Veri Güvenliği</h2>
                    <p>Tüm veriler HTTPS ile şifrelenir ve güvenli sunucularda saklanır. Düzenli güvenlik güncellemeleri ve denetimler yapılmaktadır.</p>

                    <h2>6. Kullanıcı Hakları</h2>
                    <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                    <ul>
                        <li>Kişisel verilerinize erişim talep etme</li>
                        <li>Verilerin düzeltilmesini veya silinmesini isteme</li>
                        <li>Veri işlemeye itiraz etme</li>
                        <li>Hesabınızı ve tüm verilerinizi silme</li>
                    </ul>

                    <h2>7. Değişiklikler</h2>
                    <p>Bu gizlilik politikası zaman zaman güncellenebilir. Değişiklikler bu sayfa üzerinden yayınlanacaktır.</p>

                    <h2>8. İletişim</h2>
                    <p>Gizlilik ile ilgili sorularınız için <Link href="/iletisim" className="text-rose-500 hover:underline">iletişim sayfamızdan</Link> bize ulaşabilirsiniz.</p>
                </div>
            </div>
        </main>
    )
}
