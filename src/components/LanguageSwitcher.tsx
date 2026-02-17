"use client"

import { useTranslation } from "@/context/LanguageContext"
import { motion } from "framer-motion"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
    const { language, setLanguage } = useTranslation()

    return (
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full">
            <button
                onClick={() => setLanguage('tr')}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${language === 'tr'
                        ? 'bg-white text-rose-500 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
            >
                TR
            </button>
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${language === 'en'
                        ? 'bg-white text-rose-500 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
            >
                EN
            </button>
        </div>
    )
}
