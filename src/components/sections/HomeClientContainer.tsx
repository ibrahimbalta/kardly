"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Hero } from "@/components/Hero"
import { AdvertisementSlot } from "@/components/AdvertisementSlot"
import { HowItWorksModal } from "@/components/HowItWorksModal"
import { motion } from "framer-motion"

// ─── LAZY LOADED SECTIONS ──────────────────────────────────────────
const HowItWorksSection = dynamic(() => import("./HowItWorksSection").then(mod => mod.HowItWorksSection), { 
  ssr: false,
  loading: () => <SectionSkeleton />
})

const FeaturesSection = dynamic(() => import("./FeaturesSection").then(mod => mod.FeaturesSection), { 
  ssr: false,
  loading: () => <SectionSkeleton />
})

const ShowcaseSection = dynamic(() => import("./ShowcaseSection").then(mod => mod.ShowcaseSection), { 
  ssr: false,
  loading: () => <SectionSkeleton />
})

const AboutSection = dynamic(() => import("./AboutSection").then(mod => mod.AboutSection), { 
  ssr: false,
  loading: () => <SectionSkeleton />
})

const IndustriesSection = dynamic(() => import("./IndustriesSection").then(mod => mod.IndustriesSection), { 
  ssr: false,
  loading: () => <SectionSkeleton />
})

const NfcSection = dynamic(() => import("./NfcSection").then(mod => mod.NfcSection), { 
  ssr: false,
  loading: () => <SectionSkeleton />
})

const HomeFooter = dynamic(() => import("./HomeFooter").then(mod => mod.HomeFooter), { 
  ssr: false
})

const TemplateGallery = dynamic(() => import("@/components/TemplateGallery").then(mod => mod.TemplateGallery), { 
  ssr: false,
  loading: () => <SectionSkeleton />
})

// ─── UTILS & PROPS ────────────────────────────────────────────────
function SectionSkeleton() {
  return <div className="py-20 animate-pulse bg-slate-50 border-y border-slate-100 h-[400px] flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-widest">Yükleniyor...</div>
}

import { useTranslation } from "@/context/LanguageContext"

interface HomeClientContainerProps {
  // t prop'u artık içeride useTranslation ile alınacak
}

export function HomeClientContainer({}: HomeClientContainerProps) {
  const { t } = useTranslation()
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false)

  return (
    <>
      {/* ─── ANIMATED BACKGROUND LAYERS ─── */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden select-none">
          <motion.div
            animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-15%] right-[-10%] w-[70%] h-[70%] bg-rose-200/40 blur-[140px] rounded-full mix-blend-soft-light"
          />
          <motion.div
            animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[10%] left-[-20%] w-[80%] h-[80%] bg-indigo-200/30 blur-[180px] rounded-full mix-blend-overlay"
          />
          <motion.div
            animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] left-1/4 w-[60%] h-[60%] bg-violet-200/20 blur-[150px] rounded-full mix-blend-overlay"
          />
      </div>

      <Hero onHowItWorksClick={() => setIsHowItWorksOpen(true)} />
      
      {/* ─── AD SLOT 1 ─── */}
      <AdvertisementSlot position="home_hero_bottom" />

      {/* ─── SCROLL TRIGGERED SECTIONS ─── */}
      <HowItWorksSection t={t} onPlayClick={() => setIsHowItWorksOpen(true)} />
      
      <FeaturesSection t={t} />
      
      <AdvertisementSlot position="home_features_bottom" />
      
      <ShowcaseSection t={t} />
      
      <AboutSection t={t} />

      {/* Templates Section Wrapper */}
      <section className="py-20 md:py-28 px-6 relative z-10">
        <div className="max-w-6xl mx-auto relative border-b border-slate-100 pb-12 mb-12">
           <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter leading-none mb-4 italic">{t('templateTitle')}</h2>
              <p className="text-slate-500 text-sm font-medium max-w-sm">{t('templateDesc')}</p>
           </div>
        </div>
        <TemplateGallery />
      </section>

      <AdvertisementSlot position="home_templates_bottom" />

      <IndustriesSection t={t} />
      
      <NfcSection t={t} />

      <HomeFooter t={t} />

      <HowItWorksModal 
        isOpen={isHowItWorksOpen} 
        onClose={() => setIsHowItWorksOpen(false)} 
        t={t}
      />
    </>
  )
}
