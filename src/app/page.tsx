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

      {/* Features Bento - Core Functionality Showcase */}
      <section id="features" className="py-32 px-6 relative overflow-hidden bg-white">
        <div className="blob w-[800px] h-[800px] bg-rose-50 opacity-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-6"
            >
              <Sparkles size={12} /> Hepsi Bir Arada Çözüm
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[0.9] text-slate-900">Dijital Kimliğiniz <br /><span className="gradient-text">Eksiksiz & Profesyonel</span></h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
              Profilinizi projeleriniz, uzmanlıklarınız ve ödeme sistemlerinizle donatın. Tek bir link üzerinden tüm iş dünyanızı yönetin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
            {/* 1. Projects & Portfolio - Large Bento */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-8 md:row-span-2 rounded-[3.5rem] p-10 border border-slate-100 bg-white relative overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative h-full flex flex-col md:flex-row gap-10">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="w-16 h-16 bg-rose-500 rounded-[1.8rem] flex items-center justify-center mb-8 shadow-xl shadow-rose-200 group-hover:rotate-6 transition-transform">
                    <Briefcase size={32} className="text-white" />
                  </div>
                  <h3 className="text-4xl font-black mb-4 tracking-tight text-slate-900">Projelerim & Portfolyo</h3>
                  <p className="text-slate-500 text-lg leading-relaxed">Başarı hikayelerinizi ve tamamladığınız projeleri görsel zenginliklerle sergileyin. Potansiyel partnerlerinizi tek bir bakışta etkileyin.</p>
                </div>
                <div className="flex-1 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group-hover:scale-[1.02] transition-transform overflow-hidden p-6 flex items-end">
                  <div className="w-full h-4/5 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                    <div className="aspect-video bg-slate-50 rounded-xl mb-4 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center">
                        <ImageIcon size={40} className="text-rose-200" />
                      </div>
                    </div>
                    <div className="h-4 w-2/3 bg-slate-100 rounded-full mb-2" />
                    <div className="h-3 w-1/3 bg-slate-50 rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. Expertise Areas */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 md:row-span-1 rounded-[3rem] p-8 border border-slate-100 bg-amber-50/20 flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-100">
                  <CheckCircle2 size={24} />
                </div>
                <div className="w-8 h-8 rounded-full border border-amber-200 flex items-center justify-center">
                  <ArrowUpRight size={14} className="text-amber-500" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-black mb-2 tracking-tight text-slate-900">Uzmanlık Alanları</h4>
                <p className="text-slate-500 text-sm">Mesleki yetkinliklerinizi ve uzmanlıklarınızı profilinizde şık bir şekilde listeleyin.</p>
              </div>
            </motion.div>

            {/* 3. CV & Catalog */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 md:row-span-1 rounded-[3rem] p-8 border border-slate-100 bg-indigo-50/30 flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <List size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">PRO VERSION</span>
              </div>
              <div>
                <h4 className="text-2xl font-black mb-2 text-slate-900">CV & Katalog Paylaşımı</h4>
                <p className="text-slate-500 text-sm">Profesyonel özgeçmişinizi ve kataloglarınızı tek tıkla indirilebilir hale getirin.</p>
              </div>
            </motion.div>

            {/* 4. Monetization & Support */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 md:row-span-2 rounded-[3.5rem] p-8 border border-slate-100 bg-slate-900 text-white flex flex-col group shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden"
            >
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-500/20">
                  <CreditCard size={28} />
                </div>
                <h4 className="text-3xl font-black mb-4">Para Kazanma & Destek</h4>
                <p className="text-slate-400 text-base mb-8 leading-relaxed">Stripe ve PayTR ile profiliniz üzerinden ödeme alın, destek toplayın veya hizmet satın.</p>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-white/10 transition-colors">
                    <div className="w-10 h-6 bg-white/10 rounded-md flex items-center justify-center text-[8px] font-black tracking-tighter">PayTR</div>
                    <span className="text-xs font-bold">Yerel Ödeme Entegrasyonu</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-white/10 transition-colors">
                    <div className="w-10 h-6 bg-white/10 rounded-md flex items-center justify-center text-[8px] font-black tracking-tighter">Stripe</div>
                    <span className="text-xs font-bold">Global Ödeme Çözümü</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform h-40 w-40">
                <ShoppingBag size={160} />
              </div>
            </motion.div>

            {/* 5. Appointment Tracking */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-8 md:row-span-1 rounded-[3.5rem] p-10 border border-slate-100 bg-sky-50/20 flex items-center gap-10 group shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="w-20 h-20 bg-sky-500 rounded-[2rem] flex items-center justify-center text-white shrink-0 shadow-2xl shadow-sky-100">
                <Calendar size={40} />
              </div>
              <div className="flex-1">
                <h4 className="text-3xl font-black mb-2 text-slate-900">Randevu Takibi</h4>
                <p className="text-slate-500 text-lg">Müşterilerinizden gelen randevu taleplerini dashboard üzerinden anlık olarak yönetin ve takip edin.</p>
              </div>
              <div className="hidden md:block w-32 h-32 border-4 border-dashed border-sky-200 rounded-3xl shrink-0 -rotate-6 group-hover:rotate-0 transition-transform" />
            </motion.div>

            {/* 6. Visitor Statistics */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-8 md:row-span-1 rounded-[3.5rem] p-10 border border-slate-100 bg-slate-50/50 flex items-center justify-between group shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase tracking-widest mb-6">REAL-TIME DATA</div>
                <h4 className="text-3xl font-black mb-4 text-slate-900">Ziyaretçi İstatistikleri</h4>
                <p className="text-slate-500 text-lg leading-relaxed">Tıklama, görüntülenme ve coğrafi verileri profesyonel grafiklerle dashboard'unuzda görün.</p>
              </div>
              <div className="w-48 h-24 flex items-end gap-2 px-6">
                {[30, 60, 45, 90, 65, 80].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    className="flex-1 bg-rose-500/20 rounded-t-lg border-t border-rose-500/40"
                  />
                ))}
              </div>
            </motion.div>

            {/* 7. Stunning Templates */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 md:row-span-1 rounded-[3rem] p-8 border border-slate-100 bg-white flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-6">
                  <Palette size={24} />
                </div>
                <h4 className="text-2xl font-black mb-2 text-slate-900 tracking-tight">Eşsiz Şablonlar</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Neon ve Profesyonel seriler ile tarzınıza en uygun tasarımı anında seçin.</p>
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

      {/* Target Audience */}
      <section className="py-40 relative px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[4rem] p-12 md:p-24 border border-slate-100 bg-white relative overflow-hidden shadow-2xl shadow-rose-100">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/50 via-transparent to-transparent opacity-50" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              <div>
                <h2 className="text-5xl font-black mb-10 tracking-tight leading-[1.1] text-slate-900 uppercase">Profesyonellerin <br /><span className="text-rose-500 underline decoration-4 underline-offset-8">Yeni</span> Tercihi.</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Kreatif Ajanslar",
                    "Girişimciler",
                    "Emlak/Satış Profesyonelleri",
                    "Eğitmenler & Uzmanlar",
                    "Freelance Çalışanlar",
                    "Genç Profesyoneller"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-4 px-6 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-lg hover:border-rose-100 transition-all cursor-default">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg shadow-rose-200" />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative group flex justify-center lg:justify-end">
                <div className="absolute -inset-10 bg-rose-100/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative aspect-square w-full max-w-sm rounded-[3.5rem] bg-white border border-rose-100 flex flex-col items-center justify-center p-10 overflow-hidden shadow-2xl">
                  <div className="w-full h-full border-4 border-dashed border-rose-100 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center" style={{ animation: 'pulse 3s infinite' }}>
                    <QrCode size={120} className="text-rose-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4 py-1.5 bg-slate-50 rounded-full">KARTINI OLUŞTUR</div>
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
          <h2 className="text-6xl md:text-8xl font-black mb-12 tracking-tighter leading-none text-white uppercase">YENİ DÖNEM <br /><span className="italic opacity-80 underline decoration-white/30 decoration-8 underline-offset-10 text-rose-100">BAŞLIYOR.</span></h2>
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
