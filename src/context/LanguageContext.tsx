"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '@/lib/i18n'

type Language = 'tr' | 'en'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string, ...args: any[]) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('tr')

    useEffect(() => {
        const savedLang = localStorage.getItem('lang') as Language
        if (savedLang && (savedLang === 'tr' || savedLang === 'en')) {
            setLanguageState(savedLang)
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem('lang', lang)
    }

    const t = (key: string, ...args: any[]) => {
        const val = translations[language][key]
        if (typeof val === 'function') {
            return val(...args)
        }
        return val || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useTranslation() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider')
    }
    return context
}
