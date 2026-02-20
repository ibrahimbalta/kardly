"use client"

import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import {
  Layout,
  Shield,
  ArrowRight,
  Sparkles,
  Smartphone,
  QrCode,
  BarChart3,
  Briefcase,
  Calendar,
  Star,
  CheckCircle2,
  FileText,
  CreditCard,
  Palette,
  Eye,
  Share2,
  Zap,
  MousePointer2,
  Globe,
  Users,
  ChevronRight,
  Check
} from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/context/LanguageContext"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  })
}

export default function Home() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-rose-100 selection:text-rose-600 overflow-x-hidden">
      <Navbar />
      <Hero />

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-32 px-6 relative bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4"
            >Nasıl Çalışır?</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
            >3 adımda profesyonel profilinizi oluşturun</motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-slate-500 text-lg max-w-2xl mx-auto"
            >Karmaşık kurulum yok. Kayıt olun, içeriğinizi ekleyin, paylaşın. İşte bu kadar.</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Kayıt Olun', desc: 'E-posta adresinizle saniyeler içinde hesap oluşturun. Kredi kartı gerekmez.', icon: <MousePointer2 size={24} /> },
              { step: '02', title: 'Profilinizi Doldurun', desc: 'Projeler, uzmanlıklar, hizmetler ve iletişim bilgilerinizi ekleyin.', icon: <Palette size={24} /> },
              { step: '03', title: 'Link ile Paylaşın', desc: 'QR kod veya kısa link ile müşterilerinize her yerde ulaşın.', icon: <Share2 size={24} /> }
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white border border-slate-200 rounded-3xl p-10 hover:border-slate-300 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="text-[80px] font-extrabold text-slate-100 leading-none mb-6 select-none">{item.step}</div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm">
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-32 px-6 bg-slate-50 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4"
            >Özellikler</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
            >Profilinizi güçlendiren her araç burada</motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-slate-500 text-lg max-w-2xl mx-auto"
            >Sadece bir dijital kartvizit değil. Projelerinizden randevularınıza, istatistiklerden ödemelere kadar iş hayatınızın tamamını yöneten bir platform.</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Briefcase size={24} />,
                title: 'Projeler & Portfolyo',
                desc: 'Tamamladığınız projeleri görsellerle sergileyin. Potansiyel müşterileriniz çalışmalarınızı anında görsün.',
                accent: 'bg-rose-50 text-rose-500'
              },
              {
                icon: <CheckCircle2 size={24} />,
                title: 'Uzmanlık Alanları',
                desc: 'Mesleki yetkinliklerinizi ve becerilerinizi kategorize ederek profilinizde profesyonelce listeleyin.',
                accent: 'bg-amber-50 text-amber-500'
              },
              {
                icon: <FileText size={24} />,
                title: 'CV & Katalog',
                desc: 'Profesyonel özgeçmişinizi veya hizmet kataloglarınızı tek tıkla indirilebilir hale getirin.',
                accent: 'bg-indigo-50 text-indigo-500'
              },
              {
                icon: <CreditCard size={24} />,
                title: 'Ödeme Alma',
                desc: 'Stripe ve PayTR entegrasyonu ile profiliniz üzerinden güvenle ödeme alın veya destek toplayın.',
                accent: 'bg-emerald-50 text-emerald-500'
              },
              {
                icon: <Calendar size={24} />,
                title: 'Randevu Takibi',
                desc: 'Müşterilerinizden gelen randevu taleplerini dashboard üzerinden anlık olarak yönetin ve planlayın.',
                accent: 'bg-sky-50 text-sky-500'
              },
              {
                icon: <BarChart3 size={24} />,
                title: 'Ziyaretçi Analizi',
                desc: 'Profilinize kimlerin, nereden ve ne zaman girdiğini detaylı grafiklerle takip edin.',
                accent: 'bg-violet-50 text-violet-500'
              },
              {
                icon: <Palette size={24} />,
                title: 'Premium Şablonlar',
                desc: 'Neon, Minimal ve Profesyonel seriler arasından sektörünüze uygun tasarımı tek tıkla seçin.',
                accent: 'bg-pink-50 text-pink-500'
              },
              {
                icon: <QrCode size={24} />,
                title: 'QR Kod & vCard',
                desc: 'Özel QR kodunuzu oluşturun, tek taramayla kişi rehberine eklenen dijital kartvizit paylaşın.',
                accent: 'bg-slate-100 text-slate-600'
              },
              {
                icon: <Shield size={24} />,
                title: 'Güvenli Altyapı',
                desc: 'Verileriniz şifrelenerek korunur. 7/24 kesintisiz erişim ve güvenli bir dijital varlık sunarız.',
                accent: 'bg-teal-50 text-teal-500'
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-white rounded-2xl border border-slate-200 p-8 hover:border-slate-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.accent} transition-transform group-hover:scale-110`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURE DEEP DIVE (THE "AHA" SECTION) ─── */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* Feature 1: Portfolio */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4">Portfolyo & Projeler</p>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">İşleriniz sizin yerinize konuşsun</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">Profilinize eklediğiniz projeler, görsellerle birlikte profesyonel bir galeri olarak görüntülenir. Müşterileriniz geçmiş çalışmalarınızı inceleyerek size güvenle ulaşır.</p>
              <ul className="space-y-3">
                {['Görsel yükleme ile zengin sunum', 'Proje açıklaması ve link ekleme', 'Sürükle-bırak sıralama'].map((t, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <Check size={16} className="text-emerald-500 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-[4/3] bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center">
                    <Briefcase size={24} className="text-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="order-2 lg:order-1 bg-slate-900 rounded-3xl p-8 shadow-lg">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-6">Son 30 Gün</div>
              <div className="flex items-end gap-2 h-40 mb-6">
                {[30, 50, 45, 70, 55, 90, 75, 60, 85, 65, 95, 80].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="flex-1 bg-rose-500/30 rounded-sm border-t border-rose-500"
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { val: '2.4K', label: 'Görüntülenme' },
                  { val: '389', label: 'Tıklama' },
                  { val: '%16', label: 'Dönüşüm' }
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-white">{s.val}</div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4">İstatistikler & Analiz</p>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">Kim bakıyor, nereden geliyor?</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">Her ziyaretçiyi takip edin. Hangi linklerinize tıklanıyor, hangi şehirden geliyorlar? Veriye dayalı kararlar alın ve profilinizi sürekli geliştirin.</p>
              <ul className="space-y-3">
                {['Gerçek zamanlı ziyaretçi takibi', 'Coğrafi konum analizi', 'Link bazlı tıklama raporu'].map((t, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <Check size={16} className="text-emerald-500 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Feature 3: Payments */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4">Ödeme & Kazanç</p>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">Profiliniz, kasanız olsun</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">Stripe ve PayTR entegrasyonuyla profiliniz üzerinden doğrudan ödeme alın. Hizmet satışı, danışmanlık ücreti veya bağış toplama — hepsi tek yerden.</p>
              <ul className="space-y-3">
                {['Stripe ile global ödeme', 'PayTR ile yerel çözüm', 'Otomatik fatura & bildirim'].map((t, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <Check size={16} className="text-emerald-500 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-10 flex flex-col items-center justify-center shadow-sm">
              <CreditCard size={64} className="text-emerald-500 mb-6" />
              <div className="flex gap-4 mb-6">
                {['Stripe', 'PayTR'].map(p => (
                  <div key={p} className="px-5 py-2.5 bg-white rounded-xl border border-emerald-100 text-xs font-semibold text-emerald-600 shadow-sm">{p}</div>
                ))}
              </div>
              <div className="text-sm text-emerald-600/70 font-medium">Güvenli ödeme altyapısı</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TEMPLATES ─── */}
      <section id="templates" className="py-32 relative bg-slate-50 overflow-hidden px-6">
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4"
            >Şablonlar</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
            >Tarzınızı yansıtan tasarımlar</motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-slate-500 text-lg max-w-xl mx-auto"
            >Profesyonel, minimal veya kreatif — her sektöre ve her kişiliğe özel şablonlar.</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Neon Modern", color: "#f43f5e", tag: "EN POPÜLER", desc: "Cesur ve dikkat çekici. Kreatif sektörler için ideal.", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe" },
              { title: "Clean Slate", color: "#0ea5e9", tag: "MİNİMAL", desc: "Sade ve şık. Kurumsal profesyoneller için.", image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400" },
              { title: "Soft Creative", color: "#8b5cf6", tag: "PREMİUM", desc: "Yaratıcı ve sıcak tonlar. Freelancerlar için.", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e" }
            ].map((tmpl, i) => (
              <motion.div
                key={i}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-500"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img src={`${tmpl.image}?q=80&w=800&auto=format&fit=crop`} alt={tmpl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-5 right-5 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-slate-700 tracking-wider shadow-sm">{tmpl.tag}</div>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{tmpl.title}</h4>
                  <p className="text-sm text-slate-500 mb-5">{tmpl.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tmpl.color }} />
                      <div className="w-4 h-4 rounded-full bg-slate-100" />
                      <div className="w-4 h-4 rounded-full bg-slate-50" />
                    </div>
                    <span className="text-xs font-semibold text-rose-500 group-hover:underline">Önizleme →</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4"
            >Kullanıcılarımız</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
            >Binlerce profesyonel Kardly kullanıyor</motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Ayşe Kara', role: 'UX Designer', text: 'Müşterilerime projelerimi göstermek hiç bu kadar kolay olmamıştı. QR kodum hep yanımda.' },
              { name: 'Mehmet Yılmaz', role: 'Gayrimenkul Danışmanı', text: 'Randevu takibi ve istatistikler sayesinde satışlarım %30 arttı. Süper bir araç.' },
              { name: 'Elif Demir', role: 'Freelance Fotoğrafçı', text: 'Portfolyomu tek linkte toplamak işlerimi kat kat hızlandırdı. Herkes soruyor nasıl yaptığımı.' }
            ].map((t, i) => (
              <motion.div
                key={i}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-8"
              >
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 px-6 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-indigo-500/10" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Dijital kimliğinizi <br />bugün oluşturun
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Kredi kartı gerekmez. 60 saniyede kayıt olun, dakikalar içinde profiliniz yayında olsun.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="group px-10 py-5 bg-rose-500 text-white rounded-2xl font-semibold text-base hover:bg-rose-600 active:scale-[0.98] transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-3">
                Ücretsiz Başla <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-semibold text-base hover:bg-white/10 transition-all flex items-center justify-center">
                Özellikleri İncele
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-20 bg-white border-t border-slate-100 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-12 mb-16">
            <div className="col-span-2 md:col-span-4">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-rose-200">
                  <Layout className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">Kardly<span className="text-rose-500">.</span></span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">Profesyonel dijital kartvizit platformu. İş dünyasını tek linkte birleştirin.</p>
            </div>
            <div className="md:col-span-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-5">Ürün</h5>
              <ul className="space-y-3">
                {['Özellikler', 'Şablonlar', 'Fiyatlandırma'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-5">Destek</h5>
              <ul className="space-y-3">
                {['Blog', 'İletişim', 'SSS'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-5">Yasal</h5>
              <ul className="space-y-3">
                {['Kullanım Şartları', 'Gizlilik'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-5">Sosyal</h5>
              <ul className="space-y-3">
                {['Instagram', 'Twitter', 'LinkedIn'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-300 font-medium">© 2026 Kardly. Tüm hakları saklıdır.</p>
            <p className="text-xs text-slate-300 font-medium">Türkiye'de tasarlandı, dünyaya sunuldu.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
