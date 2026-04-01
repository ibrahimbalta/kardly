"use client"

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  position: string;
}

interface AdvertisementSlotProps {
  position: 'home_hero_bottom' | 'home_features_bottom' | 'home_templates_bottom';
  className?: string;
}

export function AdvertisementSlot({ position, className }: AdvertisementSlotProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchAds() {
      try {
        const res = await fetch(`/api/ads?position=${position}`);
        if (res.ok) {
          const data = await res.json();
          setAds(data);
        }
      } catch (error) {
        console.error("Failed to fetch ads", error);
      }
    }
    fetchAds();
  }, [position]);

  useEffect(() => {
    if (ads.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [ads]);

  if (ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  return (
    <div className={cn("px-6 my-12", className)}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group relative"
        >
          {/* Ad Label */}
          <div className="absolute -top-3 left-8 z-20 px-3 py-1 rounded-full bg-slate-900 border border-white/10 shadow-xl flex items-center gap-1.5 transform -rotate-1 group-hover:rotate-0 transition-transform">
            <Sparkles size={10} className="text-amber-400" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Sponsor</span>
          </div>

          <Link
            href={currentAd.link}
            target="_blank"
            className="block relative w-full h-24 sm:h-32 rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 bg-white group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            {/* Background Image / Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-indigo-50 opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative h-full flex items-center px-8 md:px-12 gap-8">
              {/* Ad Image / Icon */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:rotate-3 transition-transform">
                {currentAd.imageUrl ? (
                  <img src={currentAd.imageUrl} alt={currentAd.title} className="w-full h-full object-cover" />
                ) : (
                  <Sparkles size={24} className="text-rose-500" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h4 className="text-base sm:text-xl font-black text-slate-950 tracking-tight leading-none mb-1 group-hover:text-rose-500 transition-colors">
                  {currentAd.title}
                </h4>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  Premium İş Ortağı <ExternalLink size={10} />
                </div>
              </div>

              {/* CTA Button */}
              <div className="hidden sm:flex px-6 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] transform group-hover:scale-105 group-hover:bg-rose-500 transition-all shadow-lg active:scale-95">
                Visit Now
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

// Internal Link Helper
import Link from "next/link";
