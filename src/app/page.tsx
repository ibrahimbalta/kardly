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
  Palette,
  Layers,
  Search,
  Users
} from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "@/context/LanguageContext"
import { useRef } from "react"

export default function Home() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  return (
    <main ref={containerRef} className="min-h-screen bg-slate-50 text-slate-900 selection:bg-rose-100 selection:text-rose-600 overflow-x-hidden">
      <Navbar />
      <Hero />

      {/* Trust Section - Floating Logos */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12"
            >
              Dünya Çapında Profesyonellerin Tercihi
            </motion.p>
            <div className="flex flex-wrap justify-center gap-16 md:gap-24 items-center opacity-30">
              {['TECHFLOW', 'ZENITH', 'NEXUS', 'VANTAGE', 'HORIZON'].map((logo) => (
                <span key={logo} className="text-xl md:text-2xl font-black tracking-tighter hover:opacity-100 transition-opacity cursor-default">{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase - The "Wow" Grid */}
      <section id="features" className="py-40 px-6 relative">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [0, 100, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] -left-[10%] w-[600px] h-[600px] bg-rose-200/20 blur-[120px] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0],
              x: [0, -100, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[10%] -right-[10%] w-[700px] h-[700px] bg-indigo-200/20 blur-[120px] rounded-full"
          />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl mb-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <Sparkles size={12} className="text-rose-500" /> Geleceğin Networking Standartı
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-slate-900 uppercase">
              Tüm Güç <br />
              <span className="text-rose-500 italic">Profilinizde.</span>
            </h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl">
              İçeriğiniz aynı, ama sunumunuz artık bir sanat eseri. Dünyanın her yerindeki müşterileriniz ve partnerleriniz için saniyeler içinde büyüleyici bir dijital varlık oluşturun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-[320px]">
            {/* 1. Projects - Large Premium Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 lg:row-span-2 rounded-[4rem] bg-white border border-slate-100 p-12 relative overflow-hidden group shadow-2xl shadow-slate-200/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative z-10 h-full flex flex-col md:flex-row gap-12">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="w-20 h-20 bg-rose-500 rounded-[2.5rem] flex items-center justify-center text-white mb-10 shadow-2xl shadow-rose-200 group-hover:rotate-6 transition-transform duration-500">
                    <Briefcase size={40} />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 uppercase">Projelerim & <br />Portfolyo</h3>
                  <p className="text-slate-500 text-lg leading-relaxed mb-8">Sınırları aşın. Projelerinizi yüksek çözünürlüklü görseller ve etkileşimli kartlarla global bir kitleye sergileyin.</p>
                  <div className="flex gap-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100" />)}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 self-center">100+ Proje Yayında</span>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-0 bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden transform group-hover:scale-105 transition-transform duration-700">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 aspect-[3/4] bg-white rounded-3xl shadow-2xl p-6 rotate-6 group-hover:rotate-0 transition-all duration-700">
                      <div className="w-full h-2/3 bg-rose-50 rounded-2xl mb-4" />
                      <div className="h-4 w-3/4 bg-slate-100 rounded-full mb-2" />
                      <div className="h-4 w-1/2 bg-slate-50 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. Expertise Area - Tall Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-4 lg:row-span-2 rounded-[4rem] bg-slate-900 border border-slate-800 p-12 relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center text-white mb-10 shadow-xl shadow-amber-500/20">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-4xl font-black mb-6 text-white uppercase tracking-tight">Uzmanlık <br />Alanları</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">Yetkinliklerinizi sadece listelemeyin, onları parlatın. Uzmanlıklarınızı dünyanın her yerinden anlaşılır kılın.</p>
                </div>
                <div className="space-y-4">
                  {['UI/UX Design', 'Full-stack Dev', 'Marketing'].map((skill) => (
                    <div key={skill} className="py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] group-hover:bg-white/10 transition-colors">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 3. CV & Catalog - Wide Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-6 lg:row-span-1 rounded-[4rem] bg-indigo-500 p-12 relative overflow-hidden group shadow-2xl shadow-indigo-200"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/microfabrics.png')] opacity-20" />
              <div className="relative z-10 flex items-center gap-10 h-full">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex items-center justify-center text-white shrink-0">
                  <FileText size={48} />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-3 text-white uppercase tracking-tight">CV & Katalog</h3>
                  <p className="text-white/80 text-lg">Tüm profesyonel geçmişiniz ve ürün kataloğunuz tek tık uzağınızda.</p>
                </div>
                <div className="ml-auto w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowUpRight size={24} className="text-white" />
                </div>
              </div>
            </motion.div>

            {/* 4. Monetization - Wide Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-6 lg:row-span-1 rounded-[4rem] bg-white border border-slate-100 p-12 relative overflow-hidden group shadow-2xl shadow-slate-200/50"
            >
              <div className="relative z-10 flex items-center gap-10 h-full">
                <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white shrink-0 shadow-2xl shadow-emerald-200">
                  <CreditCard size={48} />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-3 text-slate-900 uppercase tracking-tight">Para Kazanma</h3>
                  <p className="text-slate-500 text-lg">Stripe ve PayTR ile profilinizi kazanca dönüştürün.</p>
                </div>
                <div className="ml-auto flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100" />
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100" />
                </div>
              </div>
            </motion.div>

            {/* 5. Appointment - Regular Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-4 lg:row-span-1 rounded-[4rem] bg-sky-500 p-12 relative overflow-hidden group shadow-2xl shadow-sky-200"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white mb-8">
                  <Calendar size={32} />
                </div>
                <h3 className="text-3xl font-black mb-3 text-white uppercase tracking-tight">Randevu Takibi</h3>
                <p className="text-white/80 text-base">Zamanınızı verimli yönetin, talepleri anında yakalayın.</p>
              </div>
            </motion.div>

            {/* 6. Stats - Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 lg:row-span-1 rounded-[4rem] bg-white border border-slate-100 p-12 relative overflow-hidden group shadow-2xl shadow-slate-200/50"
            >
              <div className="relative z-10 flex items-center justify-between h-full">
                <div className="max-w-md">
                  <div className="w-16 h-16 bg-rose-500 rounded-3xl flex items-center justify-center text-white mb-8">
                    <BarChart3 size={32} />
                  </div>
                  <h3 className="text-3xl font-black mb-3 text-slate-900 uppercase tracking-tight">Ziyaretçi Analizi</h3>
                  <p className="text-slate-500 text-lg">Kimin, nereden tıkladığını anlık olarak izleyin.</p>
                </div>
                <div className="flex items-end gap-3 h-32 px-10">
                  {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1 }}
                      className="w-4 bg-rose-500/20 rounded-t-full border-t border-rose-500"
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 7. Templates - Bottom Professional Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-12 lg:row-span-1 rounded-[4rem] bg-gradient-to-r from-slate-900 to-slate-800 p-12 relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="relative z-10 flex items-center justify-between h-full">
                <div className="flex items-center gap-12">
                  <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                    <Palette size={48} />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black mb-3 text-white uppercase tracking-tight">Eşsiz Şablonlar</h3>
                    <p className="text-slate-400 text-xl">Neon, Profesyonel ve Minimal. Her tarza uygun sanat eserleri.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-20 h-28 bg-white/5 border border-white/10 rounded-2xl group-hover:scale-110 transition-transform cursor-pointer" />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Templates Showcase - Animated Gallery */}
      <section id="templates" className="py-40 relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-32">
            <h2 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-none text-slate-900 uppercase">Tarzınızı <br /><span className="text-rose-500 italic underline decoration-slate-900 decoration-8 underline-offset-8">Dünyaya</span> Duyurun.</h2>
            <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">Modern, minimal veya kreatif. Global standartlarda tasarlanmış şablonlar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Neon Modern", color: "#f43f5e", tag: "TRENDING", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe" },
              { title: "Clean Slate", color: "#0ea5e9", tag: "MINIMAL", image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400" },
              { title: "Soft Creative", color: "#8b5cf6", tag: "PREMIUM", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e" }
            ].map((tmpl, i) => (
              <TemplateCard key={i} {...tmpl} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - The Big Finish */}
      <section className="py-40 relative overflow-hidden bg-slate-900">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 bg-rose-500/20 blur-[150px] rounded-full -top-1/2 -left-1/4"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute inset-0 bg-indigo-500/20 blur-[150px] rounded-full -bottom-1/2 -right-1/4"
        />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="space-y-12"
          >
            <h2 className="text-7xl md:text-[120px] font-black text-white leading-[0.85] tracking-tighters uppercase">
              REKABET <br />
              <span className="text-rose-500 italic">YENİDEN</span> <br />
              TANIMLANDI.
            </h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              <Link href="/register" className="px-16 py-8 bg-rose-500 text-white rounded-[2.5rem] font-black text-2xl tracking-tight shadow-3xl hover:scale-105 active:scale-95 transition-all group flex items-center gap-6">
                Hemen Başla <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-rose-500 text-rose-500" />)}
                </div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Global verified platform</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-32 bg-white border-t border-slate-100 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-24 mb-32">
            <div className="md:col-span-5">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-16 h-16 bg-rose-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-rose-200 group-hover:rotate-6 transition-transform">
                  <Layout className="text-white w-8 h-8" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black tracking-tighter leading-none text-slate-900">KARDLY<span className="text-rose-500">.</span></span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em] mt-1">Digital Evolution</span>
                </div>
              </Link>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">Dünyanın en ilham verici dijital kartvizit platformu. Profesyonelliğinizi sanatla birleştirin.</p>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-16">
              <FooterLinkGroup title="Ürün" links={["Özellikler", "Şablonlar", "Fiyatlandırma"]} />
              <FooterLinkGroup title="Yardım" links={["Blog", "İletişim", "SSS"]} />
              <FooterLinkGroup title="Yasal" links={["Kullanım", "Gizlilik"]} />
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-12">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">© 2026 KARDLY INC. FOR GLOBALS.</p>
            <div className="flex gap-12">
              {["INSTAGRAM", "TWITTER", "LINKEDIN"].map(social => (
                <a key={social} href="#" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-500 transition-colors">{social}</a>
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
      whileHover={{ y: -20, rotate: 2 }}
      className="group relative"
    >
      <div className="absolute inset-x-10 bottom-0 top-20 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700" style={{ background: color }} />
      <div className="relative bg-white rounded-[4rem] p-6 border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50 hover:border-rose-100 transition-all duration-500">
        <div className="aspect-[4/5] rounded-[3rem] bg-slate-50 mb-8 overflow-hidden relative border border-slate-100">
          <img src={`${image}?q=80&w=800&auto=format&fit=crop`} alt={title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
          <div className="absolute top-8 right-8 px-6 py-3 rounded-full bg-white/90 backdrop-blur-md border border-slate-100 text-[10px] font-black text-rose-500 shadow-xl tracking-widest">{tag}</div>
        </div>
        <div className="px-4 pb-4">
          <h4 className="text-3xl font-black tracking-tight text-slate-900 mb-4">{title}</h4>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="h-2 rounded-full w-12" style={{ backgroundColor: color }} />
              <div className="h-2 rounded-full w-4 bg-slate-100" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
              <ArrowRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function FooterLinkGroup({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="space-y-10">
      <h5 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900 border-b-2 border-rose-500 pb-2 inline-block">{title}</h5>
      <ul className="space-y-6">
        {links.map(link => (
          <li key={link}>
            <a href="#" className="text-base font-bold text-slate-400 hover:text-rose-500 transition-colors">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
