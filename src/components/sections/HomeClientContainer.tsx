"use client"

import { useState } from "react"
import { Hero } from "@/components/Hero"
import { AdvertisementSlot } from "@/components/AdvertisementSlot"
import { HowItWorksModal } from "@/components/HowItWorksModal"

// Static imports for instant page load and zero layout shift / dynamic chunk delay
import { FeaturesSection } from "./FeaturesSection"
import { ShowcaseSection } from "./ShowcaseSection"
import { HowItWorksSection } from "./HowItWorksSection"
import { NfcSection } from "./NfcSection"
import { HomeFooter } from "./HomeFooter"
import { AboutSection } from "./AboutSection"
import { TemplateGallery } from "@/components/TemplateGallery"

import { useTranslation } from "@/context/LanguageContext"

export function HomeClientContainer() {
  const { t } = useTranslation()
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false)

  return (
    <>
      {/* Hero — Clean high-impact entry section */}
      <Hero onHowItWorksClick={() => setIsHowItWorksOpen(true)} />
      
      <AdvertisementSlot position="home_hero_bottom" />

      {/* Section 2: Create & Customize (Soft Violet/Pink Flow) */}
      <FeaturesSection t={t} />
      
      <AdvertisementSlot position="home_features_bottom" />

      {/* Section 3: Share Everywhere (Light Rose/Indigo Flow) */}
      <ShowcaseSection t={t} />

      {/* Section 4: Analytics (Soft Emerald/Mint Flow) */}
      <HowItWorksSection t={t} onPlayClick={() => setIsHowItWorksOpen(true)} />

      <AdvertisementSlot position="home_templates_bottom" />

      {/* Section 5: Template Gallery */}
      <TemplateGallery />

      {/* Section 6: About Us */}
      <AboutSection t={t} />

      {/* Section 7: Social Proof Carousel */}
      <NfcSection t={t} />

      {/* CTA Band + Footer */}
      <HomeFooter t={t} />

      <HowItWorksModal 
        isOpen={isHowItWorksOpen} 
        onClose={() => setIsHowItWorksOpen(false)} 
        t={t}
      />
    </>
  )
}
