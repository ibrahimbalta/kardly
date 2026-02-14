import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Layout, Shield, Zap, Globe, MessageSquare, CreditCard } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Features Detail Section */}
      <section id="features" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Her Şey Tek Bir Sayfada</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
              Kardly, kişisel markanı yönetmek için ihtiyacın olan tüm araçları tek bir çatı altında toplar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-yellow-500" />}
              title="60 Saniyede Hazır"
              description="Uzun formlar doldurmakla uğraşma. AI asistanına mesleğini söyle, gerisini o halletsin."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8 text-blue-500" />}
              title="Özel Domain"
              description="kardly.me/adsoyad yerine kendi adınla (adsoyad.com) yayına başla."
            />
            <FeatureCard
              icon={<CreditCard className="w-8 h-8 text-emerald-500" />}
              title="Ödeme & Randevu"
              description="Hizmetlerin için ödeme alabilir, randevularını kolayca yönetebilirsin."
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-purple-500" />}
              title="WhatsApp Entegrasyonu"
              description="Potansiyel müşterilerinle doğrudan WhatsApp üzerinden iletişime geç."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-rose-500" />}
              title="Sınırsız vCard"
              description="İstediğin kadar kişi rehberine tek tıkla bilgilerini kaydetsin."
            />
            <FeatureCard
              icon={<Layout className="w-8 h-8 text-indigo-500" />}
              title="Premium Şablonlar"
              description="Her sektöre uygun, profesyoneller tarafından tasarlanmış onlarca şablon."
            />
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16">Senin İçin En Uygun Planı Seç</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Ücretsiz"
              price="0"
              features={["1 Şablon", "Kardly Alt Domain", "Temel AI Üretimi", "QR Kod"]}
              buttonText="Ücretsiz Başla"
              className="glass"
            />
            <PricingCard
              title="Pro"
              price="199"
              features={["Tüm Şablonlar", "Özel Domain Desteği", "Sınırsız AI Üretimi", "Detaylı Analitik", "Randevu Sistemi"]}
              buttonText="Pro'ya Geç"
              className="bg-primary text-white scale-110 relative shadow-2xl shadow-primary/40"
              featured
            />
            <PricingCard
              title="Business"
              price="499"
              features={["Ödeme Alma (İyzico)", "Ürün Listeleme", "Öncelikli Destek", "WhatsApp Botu", "Beyaz Etiket"]}
              buttonText="Bizimle İletişime Geç"
              className="glass"
            />
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Layout className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Kardly<span className="text-primary">.</span></span>
          </div>
          <div className="flex gap-8 text-sm text-foreground/50 font-medium">
            <a href="#" className="hover:text-primary">Kullanım Koşulları</a>
            <a href="#" className="hover:text-primary">Gizlilik Politikası</a>
            <a href="#" className="hover:text-primary">İletişim</a>
          </div>
          <p className="text-sm text-foreground/40">© 2026 Kardly AI. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass p-8 rounded-3xl hover:border-primary/50 transition-all group">
      <div className="mb-6 p-3 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-foreground/50 leading-relaxed text-sm">{description}</p>
    </div>
  )
}

function PricingCard({ title, price, features, buttonText, className, featured }: { title: string, price: string, features: string[], buttonText: string, className?: string, featured?: boolean }) {
  return (
    <div className={`p-8 rounded-[2.5rem] flex flex-col ${className}`}>
      {featured && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-primary px-4 py-1 rounded-full text-xs font-bold shadow-lg">EN POPÜLER</span>}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-4xl font-extrabold">₺{price}</span>
        <span className={`${featured ? "text-white/70" : "text-foreground/40"} text-sm`}>/ay</span>
      </div>
      <ul className="flex flex-col gap-4 mb-10 text-left flex-grow">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <Shield className={`w-4 h-4 ${featured ? "text-white" : "text-primary"}`} />
            <span className={featured ? "text-white/90" : "text-foreground/70"}>{f}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 ${featured ? "bg-white text-primary" : "bg-primary text-white shadow-lg shadow-primary/20"}`}>
        {buttonText}
      </button>
    </div>
  )
}
