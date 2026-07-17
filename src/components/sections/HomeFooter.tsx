"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Instagram,
  Twitter,
  Linkedin,
  ArrowRight,
  Layout,
  Mail,
  Send
} from "lucide-react"

interface HomeFooterProps {
  t: any
}

export function HomeFooter({ t }: HomeFooterProps) {
  const router = useRouter()
  const [footerUsername, setFooterUsername] = useState("")
  const [newsEmail, setNewsEmail] = useState("")
  const [newsStatus, setNewsStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleFooterClaim = (e: FormEvent) => {
    e.preventDefault()
    const cleaned = footerUsername.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
    if (!cleaned) return
    localStorage.setItem("pending_username", cleaned)
    router.push("/register")
  }

  const handleNewsletter = async (e: FormEvent) => {
    e.preventDefault()
    if (!newsEmail || newsStatus === "loading") return
    setNewsStatus("loading")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsEmail })
      })
      if (res.ok) {
        setNewsStatus("success")
        setNewsEmail("")
      } else {
        setNewsStatus("error")
      }
    } catch {
      setNewsStatus("error")
    }
  }

  return (
    <div className="bg-[#fcfbfc] relative overflow-hidden">
      {/* ─── CTA BAND (Styled as a Premium Floating Box) ─── */}
      <section className="relative py-16 px-6 z-10">
        <div className="max-w-6xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-rose-500 to-violet-600 p-10 md:p-16 text-center relative overflow-hidden shadow-xl shadow-rose-500/10">
          {/* Decorative design elements */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              Dijital kartvizitinizi bugün oluşturun
            </h2>
            <p className="text-white/80 text-sm md:text-base font-semibold mb-8 max-w-md mx-auto">
              30 saniyede profesyonel dijital profilinizi oluşturun ve herkesle paylaşın.
            </p>

            <form onSubmit={handleFooterClaim} className="flex items-stretch gap-2 max-w-md mx-auto max-sm:flex-col max-sm:items-center max-sm:gap-3">
              <div className="flex-1 flex items-center bg-white/95 rounded-full px-5 py-3.5 shadow-inner w-full">
                <span className="text-slate-400 font-bold text-sm select-none shrink-0">kardly.site/</span>
                <input
                  type="text"
                  placeholder="isminiz"
                  value={footerUsername}
                  onChange={(e) => setFooterUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                  required
                  className="w-full bg-transparent focus:outline-none pl-0.5 text-slate-800 font-bold text-sm placeholder:text-slate-300"
                />
              </div>
              <button
                type="submit"
                className="bg-slate-950 text-white rounded-full px-8 py-3.5 text-xs font-black uppercase tracking-widest hover:bg-slate-900 active:scale-[0.97] transition-all shadow-md max-sm:w-full"
              >
                Ücretsiz Başla
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ─── FOOTER (Vibrant Premium Light Footer) ─── */}
      <footer className="relative py-20 px-6 border-t border-slate-100/80 bg-gradient-to-br from-indigo-50/70 via-rose-50/50 to-amber-50/60 overflow-hidden">
        {/* Colorful glowing background mesh spheres with increased opacity for visibility */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.18),transparent_65%)] blur-[40px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15),transparent_65%)] blur-[45px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Col 1: Brand */}
            <div className="space-y-5">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-550 flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-all">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-xl text-slate-800 tracking-tighter leading-none">
                    Kardly<span className="text-rose-500 font-black">.site</span>
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em]">link to success</span>
                </div>
              </Link>
              <p className="text-slate-605 text-xs leading-relaxed font-bold">
                Profesyonel dijital kartvizit ve mini site platformu.
              </p>
              <div className="flex gap-2.5">
                {[
                  { icon: <Instagram size={17} />, label: "Instagram", color: "hover:bg-pink-500" },
                  { icon: <Twitter size={17} />, label: "Twitter", color: "hover:bg-sky-500" },
                  { icon: <Linkedin size={17} />, label: "LinkedIn", color: "hover:bg-blue-600" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    className={`w-9 h-9 rounded-xl bg-white border border-slate-205 flex items-center justify-center text-slate-550 hover:text-white ${s.color} hover:border-transparent transition-all shadow-sm`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Product */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-5">{t('productCaps') || "Ürün"}</h4>
              <ul className="space-y-3 font-bold text-xs text-slate-550">
                <li><a href="#features" className="hover:text-rose-500 transition-colors">{t('features') || "Özellikler"}</a></li>
                <li><a href="#templates" className="hover:text-rose-500 transition-colors">{t('templates') || "Şablonlar"}</a></li>
                <li><Link href="/fiyatlandirma" className="hover:text-rose-500 transition-colors">Fiyatlandırma</Link></li>
              </ul>
            </div>

            {/* Col 3: Support */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-5">{t('supportCaps') || "Destek"}</h4>
              <ul className="space-y-3 font-bold text-xs text-slate-550">
                <li><Link href="/blog" className="hover:text-indigo-500 transition-colors">{t('blog') || "Blog"}</Link></li>
                <li><Link href="/iletisim" className="hover:text-indigo-500 transition-colors">{t('contact') || "İletişim"}</Link></li>
                <li><Link href="/sss" className="hover:text-indigo-500 transition-colors">SSS</Link></li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-5">Bülten</h4>
              <p className="text-slate-550 text-xs mb-4 leading-relaxed font-bold">Yeniliklerden haberdar olun.</p>
              <form onSubmit={handleNewsletter} className="relative flex items-center">
                <Mail size={13} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-9 pr-10 text-xs font-semibold text-slate-705 placeholder:text-slate-300 focus:outline-none focus:border-rose-500/50 transition-all shadow-sm"
                />
                <button
                  type="submit"
                  disabled={newsStatus === "loading"}
                  className="absolute right-1.5 p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-all shadow-md disabled:opacity-50"
                >
                  {newsStatus === "loading" ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={12} />
                  )}
                </button>
              </form>
              {newsStatus === "success" && (
                <p className="text-[9px] font-bold text-emerald-500 mt-2">✓ Başarıyla abone olundu!</p>
              )}
              {newsStatus === "error" && (
                <p className="text-[9px] font-bold text-rose-500 mt-2">× Bir hata oluştu.</p>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200/80 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] font-bold text-slate-500">© 2026 Kardly.site — Tüm hakları saklıdır.</p>
            <div className="flex gap-6 font-bold text-[11px] text-slate-500">
              {[
                { label: "Kullanım Koşulları", href: "/kullanim-sartlari" },
                { label: "Gizlilik Politikası", href: "/gizlilik" },
                { label: "KVKK", href: "/kvkk" },
              ].map((link, i) => (
                <Link key={i} href={link.href} className="hover:text-slate-700 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
