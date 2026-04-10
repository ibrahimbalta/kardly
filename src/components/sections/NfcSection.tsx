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
          
          <div className="flex-1 relative flex justify-center items-center">
              {/* Tap Point Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                  {[...Array(3)].map((_, i) => (
                      <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ 
                              opacity: [0, 0.4, 0],
                              scale: [0.5, 2.5],
                          }}
                          transition={{ 
                              duration: 3,
                              repeat: Infinity,
                              delay: i * 1,
                              ease: "easeOut"
                          }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-orange-500/30"
                      />
                  ))}
              </div>

              {/* NFC Card */}
              <motion.div
                initial={{ opacity: 0, rotateX: 20, rotateY: -20, rotate: -5 }}
                whileInView={{ opacity: 1, rotateX: 25, rotateY: -15, rotate: -3 }}
                viewport={{ once: true }}
                className="relative z-10 w-full max-w-[420px] aspect-[1.58/1] bg-gradient-to-br from-slate-950 via-slate-900 to-black rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-10 flex flex-col justify-between overflow-hidden border border-white/5"
              >
                {/* Chip Detail */}
                <div className="w-12 h-10 bg-gradient-to-br from-amber-200 to-amber-500 rounded-lg relative overflow-hidden mb-4 opacity-80">
                    <div className="absolute inset-x-2 top-0 h-px bg-white/40" />
                    <div className="absolute inset-x-2 bottom-0 h-px bg-black/20" />
                    <div className="absolute inset-y-2 left-0 w-px bg-white/40" />
                    <div className="absolute inset-y-2 right-0 w-px bg-black/20" />
                </div>
                
                <div className="relative z-10">
                  <div className="text-4xl font-black text-white/5 tracking-[0.2em] absolute top-0 right-0 pointer-events-none">NFC</div>
                  <div className="text-2xl font-black text-white tracking-widest uppercase italic">KARDLY</div>
                </div>
                
                <div className="relative z-10 flex justify-between items-end">
                  <div>
                    <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">Elite Member</div>
                    <div className="text-base font-black text-white uppercase tracking-wider">{t('nfcUserMock')}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl shadow-2xl scale-90">
                     <QrCode size={36} className="text-slate-950" />
                  </div>
                </div>

                <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
              </motion.div>
              
              {/* Tapping Phone Mockup */}
              <motion.div
                initial={{ opacity: 0, x: 100, y: -50, rotate: -20 }}
                whileInView={{ 
                    opacity: 1, 
                    x: 60, 
                    y: -100, 
                    rotate: -25,
                    transition: { 
                        type: "spring", 
                        damping: 20, 
                        stiffness: 100, 
                        delay: 0.5 
                    }
                }}
                className="absolute top-0 right-0 z-20 w-48 h-96 bg-slate-950 rounded-[2.5rem] border-[6px] border-slate-900 shadow-2xl hidden md:block"
              >
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-900 rounded-full" />
                  <div className="w-full h-full bg-slate-900/50 rounded-[2.2rem] flex items-center justify-center">
                      <Zap className="text-orange-500 animate-pulse" size={32} />
                  </div>
              </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
