"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, ArrowLeft, Lock, Mail, Clock, Eye, ShieldCheck } from "lucide-react"

export default function GizlilikPage() {
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
                        <ArrowLeft size={14} /> Ana Sayfa
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
                                <Lock size={12} /> Veri Güvenliği
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Gizlilik Politikası</h1>
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <Clock size={14} />
                                <span>Son güncelleme: 20 Şubat 2026</span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Verilerinizin gizliliği ve güvenliği bizim için en yüksek önceliktir. Bu politika, hangi bilgileri neden topladığımızı ve bunları nasıl koruduğumuzu açıklar.
                            </p>
                        </motion.div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">İçindekiler</h3>
                            <div className="space-y-2">
                                {[
                                    { id: "toplanan", label: "1. Toplanan Bilgiler" },
                                    { id: "kullanim", label: "2. Bilgilerin Kullanımı" },
                                    { id: "paylasim", label: "3. Bilgi Paylaşımı" },
                                    { id: "cerezler", label: "4. Çerezler (Cookies)" },
                                    { id: "guvenlik", label: "5. Veri Güvenliği" },
                                    { id: "haklar", label: "6. Kullanıcı Hakları" }
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
                            <h3 className="text-sm font-bold">KVKK Uyumlu</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Tüm süreçlerimiz Kişisel Verilerin Korunması Kanunu (KVKK) ve GDPR standartlarına uygun olarak yürütülmektedir.
                            </p>
                            <Link
                                href="/iletisim"
                                className="inline-flex items-center justify-center w-full py-2.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-blue-50 transition-colors"
                            >
                                Detaylı Bilgi Alın
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
                                    <h2>1. Toplanan Bilgiler</h2>
                                    <p>Kardly, sizlere en iyi hizmeti sunabilmek adına aşağıdaki verileri toplamaktadır:</p>
                                    <ul>
                                        <li><strong>Kimlik Bilgileri:</strong> Ad, soyad ve e-posta adresi (hesap oluşturma ve doğrulama süreçleri için).</li>
                                        <li><strong>Profil Bilgileri:</strong> Meslek, uzmanlık alanları, sosyal medya bağlantıları ve profilinizde paylaşmayı seçtiğiniz diğer bilgiler.</li>
                                        <li><strong>Kullanım Verileri:</strong> Platform içindeki etkileşimleriniz, ziyaret istatistikleri ve teknik erişim kayıtları.</li>
                                        <li><strong>Ödeme Bilgileri:</strong> Abonelik işlemleri için gerekli fatura bilgileri (Kart verileri sadece güvenli ödeme sağlayıcıları tarafından işlenir).</li>
                                    </ul>
                                </section>

                                <section id="kullanim">
                                    <h2>2. Bilgilerin Kullanımı</h2>
                                    <p>Topladığımız veriler, hizmet kalitemizi artırmak ve yasal yükümlülüklerimizi yerine getirmek amacıyla şu şekillerde kullanılır:</p>
                                    <ul>
                                        <li>Hizmetlerimizin sunulması, hesabınızın yönetilmesi ve destek taleplerinizin karşılanması.</li>
                                        <li>Platformun kişiselleştirilmesi ve kullanıcı deneyiminin iyileştirilmesi.</li>
                                        <li>Sistem güvenliğinin sağlanması ve olası kötüye kullanımların önlenmesi.</li>
                                        <li>Hizmet güncellemeleri ve önemli bilgilendirmelerin iletilmesi.</li>
                                    </ul>
                                </section>

                                <section id="paylasim">
                                    <h2>3. Bilgi Paylaşımı</h2>
                                    <p>Kardly, kullanıcıların kişisel verilerini üçüncü taraflara satmaz veya kiralamaz. Ancak aşağıdaki durumlarda paylaşım yapılabilir:</p>
                                    <ul>
                                        <li>Yasal zorunluluklar gereği yetkili kurum ve kuruluşlarla yapılan paylaşımlar.</li>
                                        <li>Hizmetin sürdürülmesi için gerekli olan teknolojik altyapı sağlayıcıları (Sunucu, e-posta iletim servisleri).</li>
                                        <li>Ödeme işlemlerinin tamamlanması için Stripe veya PayTR gibi güvenli finans kuruluşları.</li>
                                    </ul>
                                </section>

                                <section id="cerezler">
                                    <h2>4. Çerezler (Cookies)</h2>
                                    <p>
                                        Kardly, oturum yönetimi ve tercihlerinizi hatırlamak için zorunlu ve performans odaklı çerezler kullanır.
                                        Bu çerezler, web sitemize her girişinizde sizi tanımamızı sağlar ve daha hızlı bir deneyim sunar.
                                        Tarayıcı ayarlarınız üzerinden çerezleri yönetebilir veya tamamen reddedebilirsiniz.
                                    </p>
                                </section>

                                <section id="guvenlik">
                                    <h2>5. Veri Güvenliği</h2>
                                    <p>
                                        Verileriniz endüstri standardı olan <strong>SSL/TLS</strong> protokolü ile şifrelenerek iletilir.
                                        Sunucularımız yüksek güvenlikli veri merkezlerinde barındırılmakta olup, düzenli olarak sızma testleri ve güvenlik denetimlerinden geçirilmektedir.
                                    </p>
                                </section>

                                <section id="haklar">
                                    <h2>6. Kullanıcı Hakları</h2>
                                    <p>KVKK ve yasalar kapsamında şu haklara sahipsiniz:</p>
                                    <ul>
                                        <li>Verilerinizin işlenip işlenmediğini öğrenme.</li>
                                        <li>Kişisel verilerinizin bir kopyasını talep etme.</li>
                                        <li>Eksik veya yanlış verilerin düzeltilmesini isteme.</li>
                                        <li>Hesabınızı silme yoluyla verilerinizin tamamen temizlenmesini talep etme.</li>
                                    </ul>
                                </section>

                                <h2>7. Değişiklikler</h2>
                                <p>
                                    Gizlilik politikamız, yasal düzenlemeler veya hizmet güncellemeleri nedeniyle zaman zaman güncellenebilir.
                                    Güncel sürüm her zaman bu sayfa üzerinden erişilebilir olacaktır.
                                </p>

                                <h2>8. İletişim</h2>
                                <p>
                                    Gizlilik ile ilgili tüm soru ve talepleriniz için
                                    <Link href="/iletisim" className="text-blue-600 font-bold hover:underline"> iletişim formumuzu</Link> kullanabilir
                                    veya doğrudan privacy@kardly.app adresine yazabilirsiniz.
                                </p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                                    <Eye size={14} /> Kardly Privacy Framework v2.0
                                </div>
                                <div className="flex gap-4 text-xs font-bold text-slate-900">
                                    <button onClick={() => window.print()} className="hover:text-blue-600 transition-colors">Yazdır</button>
                                    <Link href="/kullanim-sartlari" className="hover:text-blue-600 transition-colors">Kullanım Şartları</Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    )
}
