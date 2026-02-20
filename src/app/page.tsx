"use client"

import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import {
  Layout,
  Shield,
  ArrowRight,
  Sparkles,
  Smartphone,
  QrCode,
  BarChart3,
  Briefcase,
  Calendar,
  Star,
  CheckCircle2,
  FileText,
  CreditCard,
  Palette,
  Eye,
  Share2,
  Zap,
  MousePointer2,
  Globe,
  Users,
  ChevronRight,
  Check
} from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/context/LanguageContext"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  })
}

export default function Home() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-rose-100 selection:text-rose-600 overflow-x-hidden">
      <Navbar />
      <Hero />

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-32 px-6 relative bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4"
            >{t('howItWorks')}</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
            >{t('buildProfileTitle')}</motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-slate-500 text-lg max-w-2xl mx-auto"
            >{t('buildProfileDesc')}</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: t('step1Title'), desc: t('step1Desc'), icon: <MousePointer2 size={24} /> },
              { step: '02', title: t('step2Title'), desc: t('step2Desc'), icon: <Palette size={24} /> },
              { step: '03', title: t('step3Title'), desc: t('step3Desc'), icon: <Share2 size={24} /> }
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white border border-slate-200 rounded-3xl p-10 hover:border-slate-300 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="text-[80px] font-extrabold text-slate-100 leading-none mb-6 select-none">{item.step}</div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm">
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-32 px-6 bg-slate-50 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4"
            >{t('features')}</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
            >{t('featuresTitle')}</motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-slate-500 text-lg max-w-2xl mx-auto"
            >{t('featuresDesc')}</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Briefcase size={24} />,
                title: t('f1Title'),
                desc: t('f1Desc'),
                accent: 'bg-rose-50 text-rose-500'
              },
              {
                icon: <CheckCircle2 size={24} />,
                title: t('f2Title'),
                desc: t('f2Desc'),
                accent: 'bg-amber-50 text-amber-500'
              },
              {
                icon: <FileText size={24} />,
                title: t('f3Title'),
                desc: t('f3Desc'),
                accent: 'bg-indigo-50 text-indigo-500'
              },
              {
                icon: <CreditCard size={24} />,
                title: t('f4Title'),
                desc: t('f4Desc'),
                accent: 'bg-emerald-50 text-emerald-500'
              },
              {
                icon: <Calendar size={24} />,
                title: t('f5Title'),
                desc: t('f5Desc'),
                accent: 'bg-sky-50 text-sky-500'
              },
              {
                icon: <BarChart3 size={24} />,
                title: t('f6Title'),
                desc: t('f6Desc'),
                accent: 'bg-violet-50 text-violet-500'
              },
              {
                icon: <Palette size={24} />,
                title: t('f7Title'),
                desc: t('f7Desc'),
                accent: 'bg-pink-50 text-pink-500'
              },
              {
                icon: <QrCode size={24} />,
                title: t('f8Title'),
                desc: t('f8Desc'),
                accent: 'bg-slate-100 text-slate-600'
              },
              {
                icon: <Shield size={24} />,
                title: t('f9Title'),
                desc: t('f9Desc'),
                accent: 'bg-teal-50 text-teal-500'
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-white rounded-2xl border border-slate-200 p-8 hover:border-slate-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.accent} transition-transform group-hover:scale-110`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURE DEEP DIVE (THE "AHA" SECTION) ─── */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* Feature 1: Portfolio */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4">{t('dive1Label')}</p>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">{t('dive1Title')}</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">{t('dive1Desc')}</p>
              <ul className="space-y-3">
                {(t('dive1List') as unknown as string[]).map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <Check size={16} className="text-emerald-500 shrink-0" /> {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-[4/3] bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center">
                    <Briefcase size={24} className="text-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="order-2 lg:order-1 bg-slate-900 rounded-3xl p-8 shadow-lg">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-6">{t('last30Days')}</div>
              <div className="flex items-end gap-2 h-40 mb-6">
                {[30, 50, 45, 70, 55, 90, 75, 60, 85, 65, 95, 80].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="flex-1 bg-rose-500/30 rounded-sm border-t border-rose-500"
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { val: '2.4K', label: t('viewsLabel') },
                  { val: '389', label: t('clicksLabel') },
                  { val: '%16', label: t('conversionLabel') }
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-white">{s.val}</div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4">{t('dive2Label')}</p>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">{t('dive2Title')}</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">{t('dive2Desc')}</p>
              <ul className="space-y-3">
                {(t('dive2List') as unknown as string[]).map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <Check size={16} className="text-emerald-500 shrink-0" /> {text}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Feature 3: Payments */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4">{t('dive3Label')}</p>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">{t('dive3Title')}</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">{t('dive3Desc')}</p>
              <ul className="space-y-3">
                {(t('dive3List') as unknown as string[]).map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <Check size={16} className="text-emerald-500 shrink-0" /> {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-10 flex flex-col items-center justify-center shadow-sm">
              <CreditCard size={64} className="text-emerald-500 mb-6" />
              <div className="flex gap-4 mb-6">
                {['Stripe', 'PayTR'].map(p => (
                  <div key={p} className="px-5 py-2.5 bg-white rounded-xl border border-emerald-100 text-xs font-semibold text-emerald-600 shadow-sm">{p}</div>
                ))}
              </div>
              <div className="text-sm text-emerald-600/70 font-medium">{t('securePayment')}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TEMPLATES ─── */}
      <section id="templates" className="py-32 relative bg-slate-50 overflow-hidden px-6">
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4"
            >{t('templates')}</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
            >{t('templateTitle')}</motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-slate-500 text-lg max-w-xl mx-auto"
            >{t('templateDesc')}</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Neon Modern", color: "#f43f5e", tag: t('tagPopular'), desc: t('neonDesc'), image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe" },
              { title: "Clean Slate", color: "#0ea5e9", tag: t('tagMinimal'), desc: t('minimalDesc'), image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400" },
              { title: "Soft Creative", color: "#8b5cf6", tag: t('tagPremium'), desc: t('softDesc'), image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e" }
            ].map((tmpl, i) => (
              <motion.div
                key={i}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-500"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img src={`${tmpl.image}?q=80&w=800&auto=format&fit=crop`} alt={tmpl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-5 right-5 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-slate-700 tracking-wider shadow-sm">{tmpl.tag}</div>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{tmpl.title}</h4>
                  <p className="text-sm text-slate-500 mb-5">{tmpl.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tmpl.color }} />
                      <div className="w-4 h-4 rounded-full bg-slate-100" />
                      <div className="w-4 h-4 rounded-full bg-slate-50" />
                    </div>
                    <span className="text-xs font-semibold text-rose-500 group-hover:underline">{t('preview')} →</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4"
            >{t('usersLabel')}</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
            >{t('usersTitle')}</motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Ayşe Kara', role: 'UX Designer', text: t('testimonial1') },
              { name: 'Mehmet Yılmaz', role: 'Gayrimenkul Danışmanı', text: t('testimonial2') },
              { name: 'Elif Demir', role: 'Freelance Fotoğrafçı', text: t('testimonial3') }
            ].map((t, i) => (
              <motion.div
                key={i}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-8"
              >
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 px-6 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-indigo-500/10" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {t('ctaTitle')}
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">{t('ctaDesc')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="group px-10 py-5 bg-rose-500 text-white rounded-2xl font-semibold text-base hover:bg-rose-600 active:scale-[0.98] transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-3">
                {t('ctaStart')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-semibold text-base hover:bg-white/10 transition-all flex items-center justify-center">
                {t('ctaExplore')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-20 bg-white border-t border-slate-100 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-12 mb-16">
            <div className="col-span-2 md:col-span-4">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-rose-200">
                  <Layout className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">Kardly<span className="text-rose-500">.</span></span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{t('footerDesc')}</p>
            </div>
            <div className="md:col-span-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-5">{t('product')}</h5>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">Özellikler</a></li>
                <li><a href="#templates" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">Şablonlar</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">Fiyatlandırma</a></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-5">{t('support')}</h5>
              <ul className="space-y-3">
                <li><Link href="/blog" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">Blog</Link></li>
                <li><Link href="/iletisim" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">İletişim</Link></li>
                <li><Link href="/sss" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">SSS</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-5">{t('legal')}</h5>
              <ul className="space-y-3">
                <li><Link href="/kullanim-sartlari" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">Kullanım Şartları</Link></li>
                <li><Link href="/gizlilik" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">Gizlilik</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-5">{t('social')}</h5>
              <ul className="space-y-3">
                <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">Instagram</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">Twitter</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-rose-500 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-300 font-medium">© 2026 Kardly. {t('allRights')}</p>
            <p className="text-xs text-slate-300 font-medium">{t('designedIn')}</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
