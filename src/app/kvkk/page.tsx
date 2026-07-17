"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, ArrowLeft, ShieldCheck, Clock, Eye, FileText, Scale, Users, Database } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"

export default function KVKKPage() {
    const { t } = useTranslation()

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

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Title and Summary */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                                <ShieldCheck size={12} /> KVKK
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">KVKK Aydınlatma Metni</h1>
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <Clock size={14} />
                                <span>Son güncelleme: 17 Temmuz 2026</span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında, kişisel verilerinizin işlenmesine ilişkin sizi bilgilendirmek amacıyla bu aydınlatma metni hazırlanmıştır.
                            </p>
                        </motion.div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">İçindekiler</h3>
                            <div className="space-y-2">
                                {[
                                    { id: "veri-sorumlusu", label: "1. Veri Sorumlusu" },
                                    { id: "islenen-veriler", label: "2. İşlenen Kişisel Veriler" },
                                    { id: "isleme-amaci", label: "3. İşlenme Amaçları" },
                                    { id: "aktarim", label: "4. Verilerin Aktarılması" },
                                    { id: "toplama-yontemi", label: "5. Toplama Yöntemi ve Hukuki Sebep" },
                                    { id: "haklar", label: "6. İlgili Kişinin Hakları" },
                                    { id: "basvuru", label: "7. Başvuru Yöntemi" },
                                    { id: "degisiklikler", label: "8. Değişiklikler" },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        className="block w-full text-left text-xs text-slate-500 hover:text-emerald-600 transition-colors py-1"
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
                                <Scale className="text-white w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold">Haklarınızı Kullanın</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                KVKK kapsamında sahip olduğunuz hakları kullanmak için bizimle iletişime geçebilirsiniz.
                            </p>
                            <Link
                                href="/iletisim"
                                className="inline-flex items-center justify-center w-full py-2.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-emerald-50 transition-colors"
                            >
                                İletişime Geç
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
                                <section id="veri-sorumlusu">
                                    <h2>1. Veri Sorumlusu</h2>
                                    <p>
                                        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel verileriniz; veri sorumlusu olarak <strong>Kardly Dijital Teknolojileri</strong> (&quot;Kardly&quot;) tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                                    </p>
                                    <p>
                                        Kardly olarak, kişisel verilerinizin güvenliği ve gizliliği konusunda azami hassasiyeti göstermekteyiz. Bu aydınlatma metni, <strong>kardly.site</strong> platformu üzerinden toplanan kişisel verilere ilişkin bilgilendirme amacıyla hazırlanmıştır.
                                    </p>
                                </section>

                                <section id="islenen-veriler">
                                    <h2>2. İşlenen Kişisel Veriler</h2>
                                    <p>Platformumuz üzerinden aşağıdaki kişisel verileriniz işlenebilmektedir:</p>
                                    <ul>
                                        <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, kullanıcı adı</li>
                                        <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, adres bilgileri</li>
                                        <li><strong>Kullanıcı İşlem Bilgileri:</strong> Dijital kartvizit içerikleri, profil bilgileri, sosyal medya bağlantıları, paylaşım ve etkileşim verileri</li>
                                        <li><strong>İşlem Güvenliği Bilgileri:</strong> IP adresi, cihaz bilgileri, tarayıcı türü, oturum bilgileri, log kayıtları</li>
                                        <li><strong>Pazarlama Bilgileri:</strong> Çerez verileri, tercihler, kampanya etkileşim bilgileri (açık rıza ile)</li>
                                        <li><strong>Finansal Bilgiler:</strong> Ödeme ve fatura bilgileri (ödeme işlemcileri aracılığıyla)</li>
                                    </ul>
                                </section>

                                <section id="isleme-amaci">
                                    <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
                                    <p>Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
                                    <ul>
                                        <li>Dijital kartvizit hizmetlerinin sunulması ve yönetilmesi</li>
                                        <li>Üyelik işlemlerinin gerçekleştirilmesi ve hesap güvenliğinin sağlanması</li>
                                        <li>Kullanıcı deneyiminin iyileştirilmesi ve kişiselleştirilmesi</li>
                                        <li>Yasal yükümlülüklerin yerine getirilmesi (5651 sayılı Kanun, vergi mevzuatı vb.)</li>
                                        <li>İletişim taleplerinin yanıtlanması ve müşteri desteği sağlanması</li>
                                        <li>Hizmet kalitesinin artırılması için istatistiksel analizlerin yapılması</li>
                                        <li>Açık rızanız doğrultusunda pazarlama ve tanıtım faaliyetlerinin yürütülmesi</li>
                                        <li>Bilgi güvenliği süreçlerinin planlanması ve denetlenmesi</li>
                                    </ul>
                                </section>

                                <section id="aktarim">
                                    <h2>4. Kişisel Verilerin Aktarılması</h2>
                                    <p>
                                        Kişisel verileriniz, KVKK&apos;nın 8. ve 9. maddelerinde belirtilen şartlara uygun olarak aşağıdaki taraflara aktarılabilir:
                                    </p>
                                    <ul>
                                        <li><strong>Yasal Merciler:</strong> Kanunen yetkili kamu kurum ve kuruluşlarına, yasal zorunluluk halinde</li>
                                        <li><strong>Bulut Hizmet Sağlayıcıları:</strong> Veri depolama ve işleme amacıyla, gerekli güvenlik önlemleri alınarak</li>
                                        <li><strong>Ödeme İşlemcileri:</strong> Ödeme işlemlerinin güvenli şekilde gerçekleştirilmesi amacıyla</li>
                                        <li><strong>Analiz Hizmetleri:</strong> Anonim ve toplu hale getirilmiş veriler üzerinden hizmet iyileştirme amacıyla</li>
                                    </ul>
                                    <p>
                                        Kişisel verileriniz, yurt dışına aktarılması halinde KVKK&apos;nın 9. maddesinde öngörülen şartlara uygun hareket edilmektedir.
                                    </p>
                                </section>

                                <section id="toplama-yontemi">
                                    <h2>5. Kişisel Veri Toplama Yöntemi ve Hukuki Sebebi</h2>
                                    <p>
                                        Kişisel verileriniz; web sitemiz, mobil uygulamalarımız, e-posta yazışmaları ve çerezler aracılığıyla elektronik ortamda otomatik ve yarı otomatik yollarla toplanmaktadır.
                                    </p>
                                    <p>Kişisel verileriniz aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:</p>
                                    <ul>
                                        <li><strong>Açık Rıza (m.5/1):</strong> Pazarlama faaliyetleri ve tercihlerinize dayalı kişiselleştirme</li>
                                        <li><strong>Sözleşmenin İfası (m.5/2-c):</strong> Dijital kartvizit hizmetinin sunulması için gerekli olan veri işleme</li>
                                        <li><strong>Hukuki Yükümlülük (m.5/2-ç):</strong> Yasal düzenlemelere uyum sağlanması</li>
                                        <li><strong>Meşru Menfaat (m.5/2-f):</strong> Hizmet güvenliğinin sağlanması, dolandırıcılığın önlenmesi</li>
                                    </ul>
                                </section>

                                <section id="haklar">
                                    <h2>6. İlgili Kişinin Hakları (KVKK Madde 11)</h2>
                                    <p>
                                        KVKK&apos;nın 11. maddesi kapsamında, kişisel veri sahibi olarak aşağıdaki haklara sahipsiniz:
                                    </p>
                                    <ul>
                                        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                                        <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                                        <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                                        <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
                                        <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
                                        <li>KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                                        <li>Düzeltme, silme ve yok etme işlemlerinin, kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                                        <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
                                        <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme</li>
                                    </ul>
                                </section>

                                <section id="basvuru">
                                    <h2>7. Başvuru Yöntemi</h2>
                                    <p>
                                        Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki yöntemlerden biriyle bize başvurabilirsiniz:
                                    </p>
                                    <ul>
                                        <li><strong>Yazılı Başvuru:</strong> Kimliğinizi tespit edici belgeler ile birlikte ıslak imzalı dilekçe ile şirket adresimize başvurabilirsiniz.</li>
                                        <li><strong>Elektronik Başvuru:</strong> <Link href="/iletisim" className="text-emerald-600 font-bold hover:underline">İletişim sayfamız</Link> üzerinden veya kayıtlı elektronik posta (KEP) aracılığıyla başvurabilirsiniz.</li>
                                    </ul>
                                    <p>
                                        Başvurularınız, talebin niteliğine göre en kısa sürede ve en geç <strong>30 (otuz) gün</strong> içinde ücretsiz olarak sonuçlandırılacaktır. İşlemin ayrıca bir maliyet gerektirmesi halinde, Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret alınabilir.
                                    </p>
                                </section>

                                <section id="degisiklikler">
                                    <h2>8. Değişiklikler</h2>
                                    <p>
                                        İşbu aydınlatma metni, yasal düzenlemeler ve şirket politikalarındaki değişikliklere bağlı olarak güncellenebilir. Güncellemeler, <strong>kardly.site</strong> üzerinden yayımlanarak yürürlüğe girer. Önemli değişiklikler hakkında kayıtlı e-posta adresiniz üzerinden bilgilendirileceksiniz.
                                    </p>
                                </section>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                                    <Eye size={14} /> 6698 Sayılı KVKK Kapsamında
                                </div>
                                <div className="flex gap-4 text-xs font-bold text-slate-900">
                                    <button onClick={() => window.print()} className="hover:text-emerald-600 transition-colors">Yazdır</button>
                                    <Link href="/gizlilik" className="hover:text-emerald-600 transition-colors">Gizlilik Politikası</Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    )
}
