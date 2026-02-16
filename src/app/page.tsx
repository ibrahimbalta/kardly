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
  Layers,
  Smartphone,
  QrCode,
  Cpu,
  ArrowUpRight,
  Star
} from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
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

      {/* Features Bento */}
      <section id="features" className="py-32 px-6 relative overflow-hidden bg-white">
        <div className="blob w-[800px] h-[800px] bg-rose-50 opacity-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-6"
            >
              <Sparkles size={12} /> Teknoloji & Sanat
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[0.9] text-slate-900">Profesyonel Dünyanı <br /><span className="gradient-text">Canlandırın.</span></h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
              Kardly ile sadece bir kartvizit değil, dijital dünyadaki en canlı ve etkileyici yüzünüzü oluşturun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[280px]">
            {/* AI Magic Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 md:row-span-2 rounded-[3rem] p-10 border border-slate-100 bg-white relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-rose-500 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl shadow-rose-200 group-hover:rotate-6 transition-transform">
                    <Cpu className="text-white" size={32} />
                  </div>
                  <h3 className="text-3xl font-black mb-4 leading-tight text-slate-900">Yapay Zeka <br /> Tasarım Sihirbazı</h3>
                  <p className="text-slate-500 text-lg max-w-sm">AI, sizin için en uygun renk paletini ve dizilimi saniyeler içinde belirler.</p>
                </div>
                <div className="h-40 bg-slate-50 rounded-[2rem] border border-slate-100 p-6 relative group-hover:scale-[1.02] transition-transform overflow-hidden">
                  <div className="flex gap-4 items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-rose-100 animate-pulse" />
                    <div className="space-y-2">
                      <div className="w-32 h-2 bg-slate-200 rounded-full" />
                      <div className="w-20 h-2 bg-slate-100 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-8 bg-white rounded-xl shadow-sm border border-slate-100" />
                    <div className="w-full h-8 bg-rose-500/10 rounded-xl" />
                  </div>
                  <MousePointer2 className="absolute bottom-4 right-4 text-rose-500 animate-bounce" />
                </div>
              </div>
            </motion.div>

            {/* vCard Save */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 rounded-[3rem] p-8 border border-slate-100 bg-white flex flex-col justify-between group overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                  <Smartphone size={24} />
                </div>
                <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[8px] font-black uppercase tracking-widest text-indigo-500">INSTANT SAVE</div>
              </div>
              <div>
                <h4 className="text-2xl font-black mb-2 tracking-tight text-slate-900">Tek Tıkla Rehbere Kayıt</h4>
                <p className="text-slate-500 text-sm">Kullanıcılarınız sizi uygulama indirmeden rehberlerine anında kaydedebilir.</p>
              </div>
            </motion.div>

            {/* Smart Modules */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-1 rounded-[3rem] p-8 border border-slate-100 bg-amber-50/30 flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <Layers className="text-amber-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h4 className="text-xl font-black tracking-tight leading-tight text-slate-900">Dinamik <br /> Modüller</h4>
              <p className="text-slate-500 text-[11px]">Hizmetlerinizi ve projelerinizi bento kartlarıyla estetik şekilde sunun.</p>
            </motion.div>

            {/* SEO Optimized */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-1 rounded-[3rem] p-8 border border-slate-100 bg-emerald-50/30 flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <Globe className="text-emerald-500 mb-6 group-hover:rotate-12 transition-transform" size={40} />
              <h4 className="text-xl font-black tracking-tight leading-tight text-slate-900">SEO <br /> Altyapısı</h4>
              <p className="text-slate-500 text-[11px]">Google aramalarında isminiz en profesyonel halinizle en üstte çıksın.</p>
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
              image="https://framerusercontent.com/images/3KqNoXyDAnD3K98uOq0N3H9vI.png?scale-down-to=1024"
              tag="EN POPÜLER"
            />
            <TemplateCard
              title="Clean Slate"
              color="#0ea5e9"
              image="https://framerusercontent.com/images/lYlDsk0J7D6W1vD3w4H9vI.png?scale-down-to=1024"
              tag="MİNİMAL"
            />
            <TemplateCard
              title="Soft Creative"
              color="#8b5cf6"
              image="https://framerusercontent.com/images/6PNoXyDAnD3K98uOq0N3H123.png?scale-down-to=1024"
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
                <h2 className="text-5xl font-black mb-10 tracking-tight leading-[1.1] text-slate-900">Networking'in <br /><span className="text-rose-500 underline decoration-4 underline-offset-8">Gelecek</span> Vizyonu.</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Girişimciler",
                    "Kreatif Direktörler",
                    "Emlak Brokerları",
                    "Lüks Hizmet Uzmanları",
                    "Doktorlar & Avukatlar",
                    "Dijital Göçebeler"
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
                  <div className="w-full h-full border-4 border-dashed border-rose-100 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center">
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
        <div className="aspect-[3/4] rounded-[2.5rem] bg-slate-50 mb-6 overflow-hidden relative border border-slate-100">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
          <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-100 text-[9px] font-black text-rose-500 shadow-sm">{tag}</div>
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
