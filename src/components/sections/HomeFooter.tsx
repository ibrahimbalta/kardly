"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Zap, 
  Palette, 
  FileText, 
  Globe, 
  ArrowRight,
  Layout
} from "lucide-react"

interface HomeFooterProps {
  t: any
}

export function HomeFooter({ t }: HomeFooterProps) {
  const [newsEmail, setNewsEmail] = useState("")
  const [newsStatus, setNewsStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

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
    } catch (err) {
      setNewsStatus("error")
    }
  }

  return (
    <footer className="relative bg-[#0f172a] py-10 px-6 overflow-hidden border-t border-slate-800">
      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-8 items-start">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/20 group-hover:rotate-6 transition-all duration-500">
                <Layout className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="font-black text-2xl text-white tracking-tighter leading-none mb-1">
                  Kardly<span className="text-rose-500">.site</span>
                </div>
                <span className="text-[9px] font-black text-slate-500 tracking-[0.4em] uppercase italic opacity-60">link to success</span>
              </div>
            </Link>
            <div className="flex gap-4">
              {[
                { name: 'Instagram', icon: <Instagram size={18} /> },
                { name: 'Twitter', icon: <Twitter size={18} /> },
                { name: 'LinkedIn', icon: <Linkedin size={18} /> }
              ].map((s) => (
                <motion.a 
                  key={s.name} href="#" whileHover={{ y: -3, scale: 1.05 }}
                  className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/5 flex items-center justify-center text-slate-300 hover:text-white hover:bg-rose-500 transition-all duration-300 shadow-lg"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:pl-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 mb-6 italic">{t('productCaps')}</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors text-[14px] font-bold"><Zap size={14} className="text-amber-500" /> {t('features')}</a></li>
              <li><a href="#templates" className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors text-[14px] font-bold"><Palette size={14} className="text-indigo-500" /> {t('templates')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-6 italic">{t('supportCaps')}</h4>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-slate-300 hover:text-white transition-colors text-[14px] font-bold flex items-center gap-3"><FileText size={14} className="text-sky-500" /> {t('blog')}</Link></li>
              <li><Link href="/iletisim" className="text-slate-300 hover:text-white transition-colors text-[14px] font-bold flex items-center gap-3"><Globe size={14} className="text-emerald-500" /> {t('contact')}</Link></li>
            </ul>
          </div>

          {/* Newsletter Column: Ultra-Slim */}
          <div className="relative">
            <div className="p-6 rounded-[32px] bg-white/[0.04] backdrop-blur-3xl border border-white/10 shadow-2xl space-y-4">
              <h6 className="text-base font-black text-white italic tracking-tight">{t('newRegistration')}</h6>
              
              <form onSubmit={handleNewsletter} className="relative flex items-center">
                <input 
                  type="email" 
                  placeholder="Email.." 
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  required
                  className="w-full bg-[#0b0e14] border border-white/10 rounded-full py-2.5 px-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 transition-colors shadow-inner" 
                />
                <button 
                  type="submit"
                  disabled={newsStatus === "loading"}
                  className="absolute right-1 p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30 disabled:opacity-50"
                >
                  {newsStatus === "loading" ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                </button>
              </form>
              
              {newsStatus === "success" && (
                <p className="text-[10px] font-bold text-emerald-400 animate-pulse">✓ Başarıyla abone olundu!</p>
              )}
              {newsStatus === "error" && (
                <p className="text-[10px] font-bold text-rose-400">× Bir hata oluştu.</p>
              )}
              
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0f172a] bg-slate-800" />
                  ))}
                </div>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">{t('footerCommunity')}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">© 2026 Kardly.site — {t('allRights')}</p>
          <div className="flex gap-8">
            {[t('terms'), t('privacy')].map((link, i) => (
              <a key={i} href="#" className="text-slate-600 hover:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
