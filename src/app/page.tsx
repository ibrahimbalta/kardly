"use client"

import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import {
  Layout,
  Shield,
  Zap,
  Globe,
  MessageSquare,
  ArrowRight,
  MousePointer2,
  Sparkles,
  Smartphone,
  QrCode,
  BarChart3,
  Briefcase,
  Calendar,
  ArrowUpRight,
  Star,
  Activity,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  Linkedin,
  FileText,
  TrendingUp,
  CreditCard,
  List,
  Cpu,
  ShoppingBag,
  Palette
} from "lucide-react"
import { motion } from "framer-motion"

import { useTranslation } from "@/context/LanguageContext"

export default function Home() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-rose-100 selection:text-rose-600">
      <Navbar />
      <Hero />

      {/* Stats Section */}
      <section className="py-20 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-black tracking-tighter">CRYPTO<span className="text-rose-500">.</span></span>
            <span className="text-2xl font-black tracking-tighter">NEON TECH</span>
            <span className="text-2xl font-black tracking-tighter">VELOCITY UI</span>
            <span className="text-2xl font-black tracking-tighter">FUTURA</span>
            <span className="text-2xl font-black tracking-tighter">ZENITH</span>
          </div>
        </div>
      </section>

      {/* Features Showcase - Global Professionalism */}
      <section id="features" className="py-40 px-6 relative overflow-hidden bg-white">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-rose-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl mb-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <Globe size={12} className="text-rose-500" /> Global Standartlarda Teknoloji
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-slate-900">
              Sınırları Aşan <br />
              <span className="text-rose-500 italic">Dijital Güç.</span>
            </h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl">
              Kardly, sadece bir dijital kartvizit değil; global iş dünyasında kendinizi en prestijli şekilde temsil etmeniz için tasarlanmış kapsamlı bir ekosistemdir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* 1. Global Infrastructure - THE BIG ONE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="md:col-span-7 rounded-[4rem] p-12 bg-slate-900 text-white relative overflow-hidden group min-h-[500px] flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.15),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-10 border border-white/10 group-hover:scale-110 transition-transform">
                  <Cpu size={32} className="text-rose-500" />
                </div>
                <h3 className="text-5xl font-black mb-6 tracking-tight leading-none uppercase">Global Edge <br />Altyapısı</h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                  Profiliniz dünyanın neresinden açılırsa açılsın, 100+ global lokasyondaki sunucularımız sayesinde milisaniyeler içinde yüklenir. Kesintisiz global erişim.
                </p>
              </div>

              <div className="mt-12 relative h-32 flex items-center gap-1">
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [20, 40, 30, 60, 20],
                      opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                    className="flex-1 bg-white rounded-full min-w-[4px]"
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs tracking-widest uppercase shadow-2xl">0.1ms Global Latency</div>
                </div>
              </div>
            </motion.div>

            {/* 2. Multi-Language Profiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-5 rounded-[4rem] p-12 border border-slate-100 bg-white relative overflow-hidden group flex flex-col justify-between shadow-2xl shadow-slate-200/50"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-8 border border-rose-100">
                  <Globe size={28} className="text-rose-500" />
                </div>
                <h4 className="text-4xl font-black mb-4 tracking-tight text-slate-900 uppercase">Akıllı Çoklu Dil</h4>
                <p className="text-slate-500 text-base leading-relaxed">
                  Ziyaretçinizin dilini otomatik algılayan ve profilinizi ona göre sunan akıllı sistem. Global network için sınırları kaldırın.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                {['EN', 'TR', 'DE', 'FR', 'ES', 'CN'].map((lang) => (
                  <div key={lang} className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 border border-slate-100 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition-all">
                    {lang}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 3. Advanced Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-5 rounded-[4rem] p-12 border border-slate-100 bg-slate-50 relative overflow-hidden group shadow-sm"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-8 border border-indigo-200">
                  <TrendingUp size={28} className="text-indigo-600" />
                </div>
                <h4 className="text-4xl font-black mb-4 tracking-tight text-slate-900 uppercase">Derin Analiz</h4>
                <p className="text-slate-500 text-base leading-relaxed">
                  Basit bir tıklama sayacından çok daha fazlası. Ziyaretçilerinizin coğrafi dağılımı, cihaz tercihleri ve etkileşim kalitesini görün.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform">
                <BarChart3 size={240} />
              </div>
            </motion.div>

            {/* 4. Custom Branded Domains */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-7 rounded-[4rem] p-12 bg-indigo-600 text-white relative overflow-hidden group flex flex-col md:flex-row gap-10 shadow-2xl shadow-indigo-200"
            >
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="flex-1 relative z-10 py-4">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                  <Smartphone size={28} className="text-white" />
                </div>
                <h4 className="text-4xl font-black mb-4 tracking-tight uppercase leading-[0.9]">Kendi Markanızı <br />Yönetin</h4>
                <p className="text-indigo-100 text-lg">
                  Kendi alan adınızı (adiniz.com) profilinize bağlayın. Global branding'de profesyonelliği en üst seviyeye taşıyın.
                </p>
              </div>
              <div className="flex-1 relative z-10 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-8 rounded-[3rem] w-full max-w-[280px] rotate-3 group-hover:rotate-0 transition-transform duration-700 shadow-2xl">
                  <div className="w-full h-2 bg-white/20 rounded-full mb-6" />
                  <div className="w-2/3 h-2 bg-white/20 rounded-full mb-10" />
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-indigo-200">
                    <span>Domain Connected</span>
                    <Zap size={14} className="text-white" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 5. Enterprise API & Teams */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-4 rounded-[4rem] p-12 border border-slate-100 bg-white group shadow-sm hover:shadow-2xl transition-all"
            >
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8">
                <Layout size={28} />
              </div>
              <h4 className="text-3xl font-black mb-4 tracking-tight text-slate-900 uppercase leading-none">Enterprise <br />Çözümler</h4>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                Global ekipler için merkezi yönetim, kurumsal API entegrasyonu ve üst düzey güvenlik protokolleri.
              </p>
              <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                <span>Enterprise ready</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>

            {/* 6. Secure Global Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="md:col-span-8 rounded-[4rem] p-12 border border-emerald-500/10 bg-emerald-50/20 relative overflow-hidden group shadow-sm flex flex-col md:flex-row items-center gap-12"
            >
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-emerald-500/20">
                  <CreditCard size={28} />
                </div>
                <h4 className="text-4xl font-black mb-4 tracking-tight text-slate-900 uppercase">Güvenli Global Ödeme</h4>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Stripe, PayPal ve PayTR entegrasyonları ile dünyanın her yerinden ödeme alın veya destek toplayın. 135+ para birimi desteği.
                </p>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                {['STRIPE', 'PAYPAL', 'PAYTR', 'APPLE PAY'].map((pay) => (
                  <div key={pay} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-emerald-500/30 transition-all uppercase tracking-widest leading-none">
                    {pay}
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* Templates Showcase */}
      <section id="templates" className="py-24 relative bg-slate-50/50 overflow-hidden">
        <div className="blob w-[600px] h-[600px] bg-indigo-50 opacity-40 bottom-[-300px] right-[-300px]" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black mb-6 tracking-tight leading-none text-slate-900 uppercase">Tarzınızı <br /><span className="text-rose-500 italic">Yansıtın.</span></h2>
              <p className="text-slate-500 font-medium text-lg">Modern, minimal veya kreatif. Sizi en iyi anlatan şablonu saniyeler içinde seçin.</p>
            </div>
            <Link href="/register" className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] group border-b-2 border-rose-500 pb-2 text-rose-500">
              Tüm Şablonlar <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <TemplateCard
              title="Neon Modern"
              color="#f43f5e"
              image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
              tag="EN POPÜLER"
            />
            <TemplateCard
              title="Clean Slate"
              color="#0ea5e9"
              image="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop"
              tag="MİNİMAL"
            />
            <TemplateCard
              title="Soft Creative"
              color="#8b5cf6"
              image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop"
              tag="YENİ"
            />
          </div>
        </div>
      </section>

      {/* Global Impact Stats */}
      <section className="py-24 bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'Aktif Kullanıcı', value: '12K+', sub: 'Dünya Genelinde' },
              { label: 'Global Lokasyon', value: '100+', sub: 'Edge Server' },
              { label: 'Desteklenen Dil', value: '12', sub: 'Native Çeviri' },
              { label: 'Yıllık Etkileşim', value: '2M+', sub: 'Profil Görüntüleme' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-rose-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience - Premium Professionals */}
      <section className="py-40 relative px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[4rem] p-12 md:p-24 border border-slate-100 bg-white relative overflow-hidden shadow-2xl shadow-rose-100">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/50 via-transparent to-transparent opacity-50" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                >
                  <Star size={12} fill="currentColor" /> Premium Network
                </motion.div>
                <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tight leading-[0.9] text-slate-900 uppercase">
                  Global Liderlerin <br />
                  <span className="text-rose-500 underline decoration-4 underline-offset-8">Yeni Tercihi.</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Global Girişimciler",
                    "C-Level Yöneticiler",
                    "Kreatif Ajans Başkanları",
                    "Uluslararası Danışmanlar",
                    "Teknoloji Liderleri",
                    "Global Sales Expertleri"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-5 px-8 rounded-3xl bg-white border border-slate-100 group hover:shadow-2xl hover:border-rose-200 transition-all cursor-default">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg shadow-rose-200" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative group flex justify-center lg:justify-end">
                <div className="absolute -inset-20 bg-rose-100/30 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative aspect-square w-full max-w-md rounded-[4rem] bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-12 overflow-hidden shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/microfabrics.png')]" />
                  <div className="w-full h-full border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center p-10 text-center relative z-10">
                    <QrCode size={140} className="text-rose-500 mb-8 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.3)]" />
                    <div className="text-[10px] font-black uppercase text-white tracking-[0.3em] px-6 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">GLOBAL VCARD ACTIVE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-40 text-center relative overflow-hidden bg-rose-500">
        <div className="blob w-[600px] h-[600px] bg-rose-400 opacity-50 top-[-300px] left-[-300px]" />
        <div className="blob w-[600px] h-[600px] bg-rose-600 opacity-50 bottom-[-300px] right-[-300px]" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="max-w-4xl mx-auto px-6 relative z-10"
        >
          <h2 className="text-6xl md:text-8xl font-black mb-12 tracking-tighter leading-none text-white">YENİ DÖNEM <br /><span className="italic opacity-80 underline decoration-white/30 decoration-8 underline-offset-10">BAŞLIYOR.</span></h2>
          <Link href="/register" className="inline-flex items-center gap-6 px-16 py-8 bg-white text-rose-500 rounded-[2.5rem] font-black text-xl tracking-tight shadow-3xl hover:scale-105 active:scale-95 transition-all group">
            Ücretsiz Dene <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="mt-8 text-white/60 font-bold uppercase tracking-widest text-[10px]">1 dakikada hazır, ömür boyu senin.</p>
        </motion.div>
      </section>

      <footer className="py-24 bg-white border-t border-slate-100 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20 mb-20">
            <div className="max-w-sm">
              <Link href="/" className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                  <Layout className="text-white w-7 h-7" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase leading-none text-slate-900">KARDLY<span className="text-rose-500">.</span><br /><span className="text-[10px] text-slate-300 tracking-[0.4em]">DIGITAL</span></span>
              </Link>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">Dünyanın en canlı ve kullanıcı dostu dijital kartvizit platformu. Profesyonelliğinizi dijitalde şık bir şekilde sergileyin.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
              <FooterLinkGroup title="Ürün" links={["Özellikler", "Şablonlar", "Fiyatlandırma"]} />
              <FooterLinkGroup title="Yardım" links={["Blog", "İletişim", "SSS"]} />
              <FooterLinkGroup title="Yasal" links={["Kullanım", "Gizlilik"]} />
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">© 2026 KARDLY INC. CRAFTED WITH LOVE.</p>
            <div className="flex gap-8">
              {["TWITTER", "INSTAGRAM", "LINKEDIN"].map(social => (
                <a key={social} href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors font-bold">{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function TemplateCard({ title, image, color, tag }: any) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative"
    >
      <div className="absolute inset-0 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: color }} />
      <div className="relative bg-white rounded-[3rem] p-4 border border-slate-100 overflow-hidden shadow-sm shadow-rose-100 hover:shadow-2xl transition-all duration-500">
        <div className="aspect-[3/4] rounded-[2.5rem] bg-slate-100 mb-6 overflow-hidden relative border border-slate-200 shadow-inner">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
          <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-100 text-[10px] font-black text-rose-500 shadow-lg">{tag}</div>
        </div>
        <div className="px-4 pb-4 flex justify-between items-center">
          <div>
            <h4 className="text-xl font-black tracking-tight text-slate-900">{title}</h4>
            <div className="flex gap-1.5 mt-2">
              <div className="h-1 rounded-full w-8" style={{ backgroundColor: color }} />
              <div className="h-1 rounded-full w-2 bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function FooterLinkGroup({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="space-y-6">
      <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-200">{title}</h5>
      <ul className="space-y-4">
        {links.map(link => (
          <li key={link}>
            <a href="#" className="text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
