import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Layout, Shield, Zap, Globe, MessageSquare } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Features Detail Section (Bento Grid) */}
      <section id="features" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Tek Platform, <span className="text-primary">Sınırsız</span> Güç</h2>
            <p className="text-foreground/50 max-w-2xl mx-auto text-lg font-medium">
              Kişisel markanızı zirveye taşıyacak her şey bento kutusu titizliğiyle tek bir yerde toplandı.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Big Bento Card */}
            <div className="md:col-span-2 md:row-span-2 glass p-10 rounded-[3rem] border-white/10 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all" />
              <div>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-black mb-4">Meta-hızlı AI Kurulumu</h3>
                <p className="text-foreground/50 text-lg max-w-md">
                  Saatlerce süren sayfa tasarımlarını unutun. AI asistanına kim olduğunuzu söyleyin, o sizin için mükemmel yapıyı kursun.
                </p>
              </div>
              <div className="mt-8 relative h-40 bg-white/5 rounded-3xl border border-white/10 overflow-hidden p-6 hidden sm:block">
                <div className="flex gap-4">
                  <div className="w-1/3 h-full bg-primary/20 rounded-xl animate-pulse" />
                  <div className="w-1/3 h-full bg-white/5 rounded-xl" />
                  <div className="w-1/3 h-full bg-white/5 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Small Bento Cards */}
            <div className="glass p-8 rounded-[3rem] border-white/10 flex flex-col justify-end group">
              <Globe className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-black mb-2 tracking-tight">Özel Domain</h4>
              <p className="text-foreground/50 text-sm">Kendi isminizle profesyonel bir imaj çizin.</p>
            </div>



            <div className="md:row-span-2 glass p-10 rounded-[3rem] border-white/10 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-purple-500/10 to-transparent" />
              <MessageSquare className="w-12 h-12 text-purple-500 mb-6" />
              <h4 className="text-2xl font-black mb-4 leading-tight">Gelişmiş WhatsApp Otomasyonu</h4>
              <p className="text-foreground/50 text-sm mb-10">Müşterilerinizle 7/24 kesintisiz iletişim kurun, randevuları otomatikleştirin.</p>
              <div className="h-48 bg-black/40 rounded-3xl border border-white/10 p-4">
                <div className="flex flex-col gap-2">
                  <div className="w-2/3 h-6 bg-purple-500/20 rounded-lg self-start" />
                  <div className="w-3/4 h-10 bg-white/5 rounded-lg self-end" />
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-[3rem] border-white/10 flex flex-col justify-end group">
              <Shield className="w-10 h-10 text-rose-500 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-black mb-2 tracking-tight">Sınırsız vCard</h4>
              <p className="text-foreground/50 text-sm">Dijital kartvizitinizi sınırsızca paylaşın.</p>
            </div>

            <div className="glass p-8 rounded-[3rem] border-white/10 flex flex-col justify-end group">
              <Layout className="w-10 h-10 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-black mb-2 tracking-tight">Özel Modüller</h4>
              <p className="text-foreground/50 text-sm">Bento modülleriyle sayfanızı kişiselleştirin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight leading-[1.1]">Kardly Kimler İçin <br /><span className="text-primary italic">Mükemmel?</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Yazılımcılar & Tasarımcılar",
                  "Doktorlar & Avukatlar",
                  "Emlak Danışmanları",
                  "Freelancer & Dijital Göçebeler",
                  "Eğitmenler & Koçlar",
                  "Küçük İşletmeler"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 glass p-4 rounded-2xl border-white/5">
                    <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]" />
                    <span className="text-sm font-bold opacity-70">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
              <div className="relative glass p-4 rounded-[3rem] border-white/10 aspect-video flex items-center justify-center">
                <span className="text-6xl font-black opacity-10 uppercase tracking-[0.5em] select-none rotate-12">Showcase</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Layout className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">KARDLY<span className="text-primary">.</span></span>
          </Link>
          <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
            <a href="#" className="hover:text-primary transition-colors">Kullanım Koşulları</a>
            <a href="#" className="hover:text-primary transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-30">© 2026 KARDLY UI. Crafted for professionals.</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass p-10 rounded-[2.5rem] hover:border-primary/50 transition-all group hover:-translate-y-2">
      <div className="mb-8 p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-primary/20 transition-all border border-white/5">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
      <p className="text-foreground/50 leading-relaxed font-medium">{description}</p>
    </div>
  )
}


