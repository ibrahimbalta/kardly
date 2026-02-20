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

      {/* Features Grid - Professional & Unified */}
      <section id="features" className="py-32 px-6 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-rose-50/50 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-slate-50 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6"
            >
              <Sparkles size={12} className="text-rose-500" /> Profesyonel Özellikler
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-slate-900 uppercase">Dijital Kimliğiniz <br /><span className="text-rose-500 italic">Eksiksiz & Düzenli.</span></h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">
              Profilinizi iş dünyasının gerektirdiği tüm araçlarla donatın. Karmaşadan uzak, sade ve etkileyici bir yönetim deneyimi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Projects & Portfolio */}
            <FeatureCard
              icon={<Briefcase size={28} />}
              title="Projelerim & Portfolyo"
              description="Başarı hikayelerinizi ve tamamladığınız projeleri görsel zenginliklerle sergileyin. Şık ve hızlı bir sunum."
              color="rose"
            />

            {/* 2. Expertise Areas */}
            <FeatureCard
              icon={<CheckCircle2 size={28} />}
              title="Uzmanlık Alanları"
              description="Mesleki yetkinliklerinizi ve uzmanlıklarınızı profilinizde kategorize edilmiş şekilde şık bir şekilde listeleyin."
              color="amber"
            />

            {/* 3. CV & Catalog */}
            <FeatureCard
              icon={<FileText size={28} />}
              title="CV & Katalog"
              description="Profesyonel özgeçmişinizi ve hizmet kataloglarınızı tek tıkla indirilebilir dijital formatlara dönüştürün."
              color="indigo"
            />

            {/* 4. Monetization & Support */}
            <FeatureCard
              icon={<CreditCard size={28} />}
              title="Para Kazanma"
              description="Stripe ve PayTR entegrasyonu ile profiliniz üzerinden güvenle ödeme alın veya destek toplayın."
              color="emerald"
            />

            {/* 5. Appointment Tracking */}
            <FeatureCard
              icon={<Calendar size={28} />}
              title="Randevu Takibi"
              description="Müşterilerinizden gelen randevu taleplerini dashboard üzerinden anlık olarak yönetin ve planlayın."
              color="sky"
            />

            {/* 6. Visitor Statistics */}
            <FeatureCard
              icon={<BarChart3 size={28} />}
              title="Ziyaretçi Analizi"
              description="Tıklama, görüntülenme ve coğrafi verileri profesyonel ve sade grafiklerle anlık olarak takip edin."
              color="rose"
            />

            {/* 7. Stunning Templates */}
            <FeatureCard
              icon={<Palette size={28} />}
              title="Eşsiz Şablonlar"
              description="Neon ve Profesyonel seriler arasından tarzınıza en uygun tasarımı tek tıkla seçin ve yayınlayın."
              color="slate"
            />

            {/* 8. Secure Infrastructure */}
            <FeatureCard
              icon={<Shield size={28} />}
              title="Güvenli Altyapı"
              description="Verileriniz global güvenlik standartlarında korunur. 7/24 kesintisiz ve güvenli bir dijital varlık."
              color="indigo"
            />

            {/* 9. Smart Networking */}
            <FeatureCard
              icon={<Smartphone size={28} />}
              title="Akıllı Paylaşım"
              description="vCard, QR Kod ve tek link üzerinden tüm iletişim bilgilerinizi profesyonelce paylaşın."
              color="emerald"
            />
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

function FeatureCard({ icon, title, description, color }: any) {
  const colorMap: any = {
    rose: "bg-rose-50/50 text-rose-500 border-rose-100/50",
    amber: "bg-amber-50/50 text-amber-500 border-amber-100/50",
    indigo: "bg-indigo-50/50 text-indigo-500 border-indigo-100/50",
    emerald: "bg-emerald-50/50 text-emerald-500 border-emerald-100/50",
    sky: "bg-sky-50/50 text-sky-500 border-sky-100/50",
    slate: "bg-slate-50/50 text-slate-500 border-slate-100/50",
  }

  const selectedColor = colorMap[color] || colorMap.slate

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(244,63,94,0.08)] transition-all duration-500 group"
    >
      <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${selectedColor}`}>
        {icon}
      </div>
      <h3 className="text-xl font-black mb-4 tracking-tight text-slate-900 uppercase">{title}</h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">
        {description}
      </p>
    </motion.div>
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
