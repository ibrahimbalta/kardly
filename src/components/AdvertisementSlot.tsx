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

  if (ads.length === 0) return null;



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

          <div className="flex flex-col gap-4">
            {ads.map((ad, idx) => (
              <Link
                key={ad.id}
                href={ad.link}
                target="_blank"
                className="block relative w-full h-32 sm:h-44 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 bg-white group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                {/* Background Image / Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-indigo-50 opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative h-full flex items-center px-8 md:px-12 gap-10">
                  {/* Ad Image / Icon - DOUBLED SIZE */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white shadow-2xl border border-slate-50 flex items-center justify-center overflow-hidden shrink-0 group-hover:rotate-3 transition-transform">
                    {ad.imageUrl ? (
                      <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles size={40} className="text-rose-500" />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tighter leading-none mb-2 group-hover:text-rose-500 transition-colors uppercase italic">
                      {ad.title}
                    </h4>
                    <div className="text-[11px] sm:text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      PREMIUM İŞ ORTAĞI <ExternalLink size={12} />
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="hidden sm:flex px-8 py-3.5 rounded-2xl bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.2em] transform group-hover:scale-105 group-hover:bg-rose-500 transition-all shadow-xl active:scale-95 italic">
                    Visit Now
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Internal Link Helper
import Link from "next/link";
