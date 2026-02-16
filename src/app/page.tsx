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
  ArrowUpRight
} from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-primary/30">
      <Navbar />
      <Hero />

      {/* Trusted By / Stats Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-30 grayscale contrast-150">
            <span className="text-2xl font-black tracking-tighter hover:grayscale-0 transition-all cursor-default">CRYPTO<span className="text-primary italic">.</span></span>
            <span className="text-2xl font-black tracking-tighter hover:grayscale-0 transition-all cursor-default">NEON TECH</span>
            <span className="text-2xl font-black tracking-tighter hover:grayscale-0 transition-all cursor-default">VELOCITY UI</span>
            <span className="text-2xl font-black tracking-tighter hover:grayscale-0 transition-all cursor-default">FUTURA</span>
            <span className="text-2xl font-black tracking-tighter hover:grayscale-0 transition-all cursor-default">ZENITH</span>
          </div>
        </div>
      </section>

      {/* Features Bento Mosaic */}
      <section id="features" className="py-32 px-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[160px] rounded-full" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6"
            >
              <Sparkles size={12} /> Sınırsız İnovasyon
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[0.9]">Zirveye Ulaşmak <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">Tek Dokunuş.</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg font-medium">
              Kardly, geleneksel kartvizitleri rafa kaldırıp profesyonel varlığınızı dijitalin en prestijli haliyle sunar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[280px]">
            {/* AI Magic Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 md:row-span-2 glass rounded-[3rem] p-10 border-white/5 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-primary/40 group-hover:rotate-6 transition-transform">
                    <Cpu className="text-white" size={32} />
                  </div>
                  <h3 className="text-3xl font-black mb-4 leading-tight">Yapay Zeka <br /> Tasarım Sihirbazı</h3>
                  <p className="text-white/40 text-lg max-w-sm">Kartvizitinizi AI ile saniyeler içinde oluşturun. Renkler, fontlar ve dizilim tamamen size özel.</p>
                </div>
                <div className="h-40 bg-black/40 rounded-[2rem] border border-white/5 p-6 relative group-hover:scale-[1.02] transition-transform">
                  <div className="flex gap-4 items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                    <div className="space-y-2">
                      <div className="w-32 h-2 bg-white/10 rounded-full" />
                      <div className="w-20 h-2 bg-white/5 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-8 bg-primary/20 rounded-xl" />
                    <div className="w-full h-8 bg-white/5 rounded-xl" />
                  </div>
                  <MousePointer2 className="absolute bottom-4 right-4 text-primary animate-bounce" />
                </div>
              </div>
            </motion.div>

            {/* vCard Save */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 glass rounded-[3rem] p-8 border-white/5 flex flex-col justify-between group overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400">
                  <Smartphone size={24} />
                </div>
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black uppercase tracking-widest text-indigo-400">One-Tap Save</div>
              </div>
              <div>
                <h4 className="text-2xl font-black mb-2 italic tracking-tight">Rehbere Doğrudan Kayıt</h4>
                <p className="text-white/40 text-sm">Hiçbir uygulama indirmeden tek tıkla doğrudan telefona kaydedilin.</p>
              </div>
            </motion.div>

            {/* Smart Modules */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-1 glass rounded-[3rem] p-8 border-white/5 flex flex-col justify-between group"
            >
              <Layers className="text-rose-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h4 className="text-xl font-black tracking-tight leading-tight">Dinamik Bento <br /> Modülleri</h4>
              <p className="text-white/40 text-[11px]">Hizmetler, ürünler, projeler. İstediğiniz her şeyi ekleyin.</p>
            </motion.div>

            {/* SEO Optimized */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-1 glass rounded-[3rem] p-8 border-white/5 flex flex-col justify-between group"
            >
              <Globe className="text-cyan-400 mb-6 group-hover:rotate-12 transition-transform" size={40} />
              <h4 className="text-xl font-black tracking-tight leading-tight">Google Arkadaşı <br /> Profiller</h4>
              <p className="text-white/40 text-[11px]">İsminiz aratıldığında en üstte, en profesyonel halinizle çıkın.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Templates Slider / Showcase */}
      <section id="templates" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black mb-6 tracking-tight leading-none uppercase">Her Stil İçin <br /><span className="text-primary italic">Bir Şablon.</span></h2>
              <p className="text-white/40 font-medium">İster minimal, ister agresif modern. Size en uygun yüzünüzü seçin.</p>
            </div>
            <Link href="/register" className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] group border-b-2 border-primary pb-2">
              Tümünü Gör <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <TemplateCard
              title="Neon Modern"
              color="#6366f1"
              image="https://framerusercontent.com/images/3KqNoXyDAnD3K98uOq0N3H9vI.png?scale-down-to=1024"
              tag="PREMIUM"
            />
            <TemplateCard
              title="Minimal Dark"
              color="#ffffff"
              image="https://framerusercontent.com/images/lYlDsk0J7D6W1vD3w4H9vI.png?scale-down-to=1024"
              tag="TRENDING"
            />
            <TemplateCard
              title="Glass Morph"
              color="#ec4899"
              image="https://framerusercontent.com/images/6PNoXyDAnD3K98uOq0N3H123.png?scale-down-to=1024"
              tag="NEW"
            />
          </div>
        </div>
      </section>

      {/* Target Audience / Identity Section */}
      <section className="py-40 relative px-6 overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[4rem] p-12 md:p-24 border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              <div>
                <h2 className="text-5xl font-black mb-10 tracking-tight leading-[1.1]">Profesyonelliğin <br /> Yeni <span className="text-primary underline decoration-4 underline-offset-8">Standartı.</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Freelancerlar",
                    "Kurumsal Liderler",
                    "Sanatçılar",
                    "Gayrimenkul Uzmanları",
                    "Doktorlar",
                    "Ağ Mimarları"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.08] transition-colors cursor-default">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-xs font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative aspect-square rounded-[3.5rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 flex items-center justify-center p-10 overflow-hidden">
                  <QrCode size={180} className="text-primary/40 group-hover:text-primary transition-colors" />
                  <div className="absolute bottom-10 animate-bounce">
                    <Link href="/register" className="px-6 py-3 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                      KODUNU AL <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 text-center relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className="text-6xl md:text-8xl font-black mb-12 tracking-tighter leading-none">GELECEĞİN <br /><span className="italic text-primary">ELİNDE.</span></h2>
          <Link href="/register" className="inline-flex items-center gap-6 px-16 py-8 bg-primary rounded-[2rem] font-black text-xl tracking-tight shadow-3xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group">
            Hemen Ücretsiz Sayfanı Kur <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="mt-8 text-white/30 font-bold uppercase tracking-widest text-[10px]">Kredi kartı gerekmez. Saniyeler içinde hazırsın.</p>
        </motion.div>
      </section>

      <footer className="py-24 border-t border-white/5 px-6 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20 mb-20">
            <div className="max-w-sm">
              <Link href="/" className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40">
                  <Layout className="text-white w-7 h-7" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase leading-none">KARDLY<span className="text-primary">.</span><br /><span className="text-[10px] text-white/20 tracking-[0.4em]">INTERFACE</span></span>
              </Link>
              <p className="text-white/30 text-sm font-medium leading-relaxed">Modern profesyoneller için tasarlanmış dünyanın en hızlı ve estetik dijital kartvizit platformu.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
              <FooterLinkGroup title="Ürün" links={["Özellikler", "Şablonlar", "Fiyatlandırma", "NFC Kartlar"]} />
              <FooterLinkGroup title="Şirket" links={["Hakkımızda", "Blog", "Kariyer", "İletişim"]} />
              <FooterLinkGroup title="Yasal" links={["Kullanım Koşulları", "Gizlilik", "Çerezler"]} />
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">© 2026 KARDLY TECHNOLOGIES. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              {["TWITTER", "INSTAGRAM", "LINKEDIN"].map(social => (
                <a key={social} href="#" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-primary transition-colors">{social}</a>
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
      <div className="absolute inset-0 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: color }} />
      <div className="relative glass rounded-[3rem] p-4 border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="aspect-[3/4] rounded-[2.5rem] bg-black/40 mb-6 overflow-hidden relative border border-white/5">
          <img src={image} alt={title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
          <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black text-white">{tag}</div>
        </div>
        <div className="px-4 pb-4 flex justify-between items-center">
          <div>
            <h4 className="text-xl font-black tracking-tight">{title}</h4>
            <div className="flex gap-1.5 mt-2">
              <div className="h-1 rounded-full w-8 bg-primary" />
              <div className="h-1 rounded-full w-2 bg-white/20" />
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
      <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/10">{title}</h5>
      <ul className="space-y-4">
        {links.map(link => (
          <li key={link}>
            <a href="#" className="text-sm font-bold text-white/40 hover:text-primary transition-colors">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}


