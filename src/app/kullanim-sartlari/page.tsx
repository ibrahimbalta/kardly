"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, ArrowLeft, ShieldCheck, Mail, Clock, FileText } from "lucide-react"

export default function KullanimSartlariPage() {
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
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest">
                                <ShieldCheck size={12} /> Legal Doküman
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Kullanım Şartları</h1>
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <Clock size={14} />
                                <span>Son güncelleme: 20 Şubat 2026</span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Lütfen Kardly hizmetlerini kullanmadan önce bu şartları dikkatlice okuyunuz. Bu belge, platformumuzu kullanırken uymanız gereken kuralları ve haklarınızı tanımlar.
                            </p>
                        </motion.div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Hızlı Erişim</h3>
                            <div className="space-y-2">
                                {[
                                    { id: "genel", label: "1. Genel Şartlar" },
                                    { id: "hizmet", label: "2. Hizmet Tanımı" },
                                    { id: "hesap", label: "3. Hesap Oluşturma" },
                                    { id: "icerik", label: "4. Kullanıcı İçerikleri" },
                                    { id: "odeme", label: "5. Ödeme ve Abonelik" },
                                    { id: "fikri", label: "6. Fikri Mülkiyet" }
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
                            <h3 className="text-sm font-bold">Sorunuz mu var?</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Kullanım şartlarımız hakkında herhangi bir sorunuz varsa hukuk ekibimizle iletişime geçebilirsiniz.
                            </p>
                            <Link
                                href="/iletisim"
                                className="inline-flex items-center justify-center w-full py-2.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-rose-50 transition-colors"
                            >
                                Bize Ulaşın
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
                                    <h2>1. Genel Şartlar</h2>
                                    <p>
                                        Bu web sitesine erişerek ve <strong>Kardly</strong> hizmetlerini kullanarak, aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız.
                                        Bu şartlar, Kardly ("Şirket") ile siz ("Kullanıcı") arasındaki yasal anlaşmayı temsil eder. Bu şartları kabul etmiyorsanız,
                                        lütfen hizmetlerimizi kullanmayın.
                                    </p>
                                </section>

                                <section id="hizmet">
                                    <h2>2. Hizmet Tanımı</h2>
                                    <p>
                                        Kardly, kullanıcılara dijital kartvizit, portfolyo ve profesyonel profil oluşturma imkanı sunan bir <strong>Yazılım ve Servis (SaaS)</strong> platformudur.
                                        Kullanıcılar projelerini, uzmanlık alanlarını, iletişim bilgilerini ve hizmetlerini tek bir merkezi profil sayfasında toplayabilir ve paylaşabilirler.
                                    </p>
                                </section>

                                <section id="hesap">
                                    <h2>3. Hesap Oluşturma</h2>
                                    <p>
                                        Hizmetlerimizi kullanmak için geçerli bir e-posta adresi ile hesap oluşturmanız gerekmektedir.
                                        Hesabınızla ilgili sağladığınız tüm bilgilerin doğru, eksiksiz ve güncel olmasından siz sorumlusunuz.
                                        Hesap güvenliğiniz (şifre gizliliği vb.) ve hesabınız üzerinden gerçekleştirilen tüm aktivitelerden tamamen siz sorumlusunuz.
                                    </p>
                                </section>

                                <section id="icerik">
                                    <h2>4. Kullanıcı İçerikleri</h2>
                                    <p>
                                        Platforma yüklediğiniz tüm içeriklerden (metin, görsel, video, linkler vb.) tamamen siz sorumlusunuz.
                                        Yasalara aykırı, telif hakkı ihlali içeren, müstehcen, tehditkar veya yanıltıcı içerikler yüklemek kesinlikle yasaktır.
                                        Kardly, bu tür içerikleri tespit etmesi durumunda içeriği kaldırma veya hesabı askıya alma hakkını saklı tutar.
                                    </p>
                                </section>

                                <section id="odeme">
                                    <h2>5. Ödeme ve Abonelik</h2>
                                    <p>
                                        Premium özelliklere erişim için ücretli abonelik veya tek seferlik ödeme planlarımız mevcuttur.
                                        Ödeme işlemleri dünyaca ünlü güvenli ödeme altyapıları (<strong>Stripe</strong>, <strong>PayTR</strong>) üzerinden gerçekleştirilir.
                                        İade politikamız, dijital ürünlerin doğası gereği ve tüketici hakları yasaları çerçevesinde satın alma tarihinden itibaren 14 gün içinde,
                                        hizmetin yoğun kullanımı gerçekleşmemiş olması şartıyla geçerlidir.
                                    </p>
                                </section>

                                <section id="fikri">
                                    <h2>6. Fikri Mülkiyet</h2>
                                    <p>
                                        Kardly platformunun tasarımı, yazılım kodu, logosu, markası ve tüm görsel unsurları Kardly'ye aittir ve uluslararası telif hakları yasaları ile korunmaktadır.
                                        Kullanıcılar, kendi oluşturdukları içeriklerin fikri mülkiyet haklarını korurlar ancak platformun genel yapısı üzerinde herhangi bir hak iddia edemezler.
                                    </p>
                                </section>

                                <h2>7. Hizmet Değişiklikleri</h2>
                                <p>
                                    Kardly, teknolojik gelişmelere veya yasal gerekliliklere uyum sağlamak amacıyla hizmetlerini ve bu kullanım şartlarını önceden bildirmeksizin değiştirme hakkını saklı tutar.
                                    Önemli değişiklikler kayıtlı kullanıcılara e-posta yoluyla veya platform içi bildirimlerle duyurulacaktır.
                                </p>

                                <h2>8. Hesap Sonlandırma</h2>
                                <p>
                                    Kullanım şartlarını, etik kuralları veya yasal mevzuatı ihlal eden kullanıcıların hesapları, Kardly tarafından önceden bildirimde bulunmaksızın askıya alınabilir veya kalıcı olarak sonlandırılabilir.
                                </p>

                                <h2>9. İletişim ve Destek</h2>
                                <p>
                                    Bu şartlarla veya platformun kullanımıyla ilgili her türlü sorunuz için
                                    <Link href="/iletisim" className="text-rose-600 font-bold hover:underline"> iletişim sayfamızdan</Link> veya
                                    destek ekibimizle doğrudan iletişime geçebilirsiniz.
                                </p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                                    <FileText size={14} /> Kardly Professional Legal Document
                                </div>
                                <button
                                    onClick={() => window.print()}
                                    className="text-xs font-bold text-slate-900 flex items-center gap-2 hover:text-rose-600 transition-colors"
                                >
                                    Dokümanı Yazdır
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    )
}
