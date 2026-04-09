"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CreditCard, Zap, Palette, ArrowRight, Layout, QrCode } from "lucide-react"

interface NfcSectionProps {
  t: any
}

export function NfcSection({ t }: NfcSectionProps) {
  return (
    <section id="nfc-card" className="py-20 md:py-28 px-6 relative z-10">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100"
            >
              <CreditCard size={14} className="text-orange-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">{t('nfcSectionBadge')}</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter leading-[0.9] italic">
              {t('nfcSectionTitle')}
            </h2>
            
            <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-xl">
              {t('nfcSectionDesc')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: t('nfcFeature1Title'), desc: t('nfcFeature1Desc'), icon: <Zap /> },
                { title: t('nfcFeature2Title'), desc: t('nfcFeature2Desc'), icon: <Palette /> }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <Link href="/register" className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 active:scale-95 group">
                {t('nfcCtaBtn')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
                whileInView={{ opacity: 1, rotate: 2, scale: 1 }}
                className="relative z-10 w-full max-w-[440px] aspect-[1.58/1] bg-gradient-to-br from-slate-900 to-black rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] p-10 flex flex-col justify-between overflow-hidden border border-white/10"
              >
                {/* NFC Logo Mock */}
                <div className="absolute top-10 right-10 opacity-20">
                   <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border border-white rounded-full" />
                   </div>
                </div>
                
                {/* Ambient light on card */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 flex items-center justify-center mb-6">
                     <Layout size={32} className="text-white" />
                  </div>
                  <div className="text-2xl font-black text-white tracking-widest uppercase italic">KARDLY</div>
                </div>
                
                <div className="relative z-10 flex justify-between items-end">
                  <div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">{t('nfcCardType')}</div>
                    <div className="text-lg font-black text-white uppercase tracking-wider">{t('nfcUserMock')}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-lg">
                     <QrCode size={40} className="text-slate-900" />
                  </div>
                </div>
              </motion.div>
              
              {/* Secondary card for depth */}
              <motion.div
                initial={{ opacity: 0, x: -40, y: 40 }}
                whileInView={{ opacity: 0.4, x: -60, y: 20 }}
                className="absolute top-0 left-0 -z-10 w-full max-w-[440px] aspect-[1.58/1] bg-orange-500 rounded-[2rem] blur-[2px]"
              />
          </div>
        </div>
      </div>
    </section>
  )
}
