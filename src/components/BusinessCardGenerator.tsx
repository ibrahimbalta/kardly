"use client"

import React, { useRef, useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import { Download, Share2, Check } from 'lucide-react'
import { useTranslation } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

interface BusinessCardGeneratorProps {
    user: {
        name: string
        username: string
        occupation?: string
        image?: string
        phone?: string
        email?: string
    }
    profileData: any
    mode?: 'full' | 'selector' | 'preview'
    selectedTemplateId?: string
    onSelect?: (templateId: string) => void
}

const TEMPLATES = [
    {
        id: 'minimal_white',
        name: 'Minimal White',
        bg: 'bg-white',
        text: 'text-slate-900',
        accent: 'bg-indigo-600',
        accentText: 'text-indigo-600',
        secondary: 'text-slate-500',
        hex: '#ffffff'
    },
    {
        id: 'modern_dark',
        name: 'Modern Dark',
        bg: 'bg-slate-900',
        text: 'text-white',
        accent: 'bg-emerald-500',
        accentText: 'text-emerald-500',
        secondary: 'text-slate-400',
        hex: '#0f172a'
    },
    {
        id: 'creative_gradient',
        name: 'Creative Gradient',
        bg: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500',
        text: 'text-white',
        accent: 'bg-white',
        accentText: 'text-white',
        secondary: 'text-white/70',
        hex: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)'
    },
    {
        id: 'gold_luxury',
        name: 'Gold Luxury',
        bg: 'bg-neutral-900',
        text: 'text-amber-100',
        accent: 'bg-amber-400',
        accentText: 'text-amber-400',
        secondary: 'text-amber-100/60',
        hex: '#171717'
    }
]

export default function BusinessCardGenerator({ user, profileData, mode = 'full', selectedTemplateId, onSelect }: BusinessCardGeneratorProps) {
    const { t } = useTranslation()
    const cardRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(500)
    const [internalSelectedTpl, setInternalSelectedTpl] = useState(TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0])

    useEffect(() => {
        if (selectedTemplateId) {
            const tpl = TEMPLATES.find(t => t.id === selectedTemplateId)
            if (tpl) setInternalSelectedTpl(tpl)
        }
    }, [selectedTemplateId])

    useEffect(() => {
        const obs = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setContainerWidth(entry.contentRect.width)
            }
        })
        if (containerRef.current) obs.observe(containerRef.current)
        return () => obs.disconnect()
    }, [])

    const selectedTemplate = internalSelectedTpl
    const cardScale = Math.min(1, (containerWidth) / 520)
    const [isDownloading, setIsDownloading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/${user.username}` : ''

    const handleDownload = async () => {
        if (!cardRef.current) return
        setIsDownloading(true)
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                logging: false,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.querySelector('[data-card-preview]') as HTMLElement
                    if (el) el.style.transform = 'none'
                }
            })
            const image = canvas.toDataURL('image/jpeg', 0.9)
            const link = document.createElement('a')
            link.href = image
            link.download = `kardly-card-${user.username}.jpg`
            link.click()
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (error) {
            console.error('Error generating card:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${user.name} - Kardly`,
                    text: `Check out my digital business card on Kardly!`,
                    url: profileUrl,
                })
            } catch (error) {
                console.log('Error sharing:', error)
            }
        } else {
            navigator.clipboard.writeText(profileUrl)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 2000)
        }
    }

    return (
        <div className="space-y-6 sm:space-y-10 w-full flex flex-col items-center">
            {mode === 'selector' && (
                <div className="w-full text-center">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6 px-4">
                        {t('selectBusinessCard') || 'KARTVİZİT ŞABLONU SEÇ'}
                    </h3>
                    <div className="flex flex-wrap gap-4 justify-center px-4 max-w-sm mx-auto">
                        {TEMPLATES.map((tpl) => (
                            <button
                                key={tpl.id}
                                onClick={() => {
                                    if (onSelect) onSelect(tpl.id)
                                    else setInternalSelectedTpl(tpl)
                                }}
                                className={cn(
                                    "relative group shrink-0 w-11 h-11 rounded-full border-2 transition-all p-0.5",
                                    selectedTemplate.id === tpl.id
                                        ? "border-primary ring-4 ring-primary/20 scale-110 shadow-lg"
                                        : "border-white/10 opacity-60 hover:opacity-100 hover:scale-105"
                                )}
                            >
                                <div className="w-full h-full rounded-full shadow-inner" style={{ background: tpl.hex }} />
                                {selectedTemplate.id === tpl.id && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-full">
                                        <Check size={16} className="text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div ref={containerRef} className="relative w-full overflow-visible flex flex-col items-center">
                <div
                    className="relative flex-shrink-0 transition-transform duration-500 origin-center"
                    style={{
                        width: '500px', height: '280px', transform: `scale(${cardScale})`,
                        marginTop: cardScale < 1 ? `-${(1 - cardScale) * 140}px` : '0px',
                        marginBottom: cardScale < 1 ? `-${(1 - cardScale) * 140}px` : '0px'
                    }}
                    data-card-preview
                >
                    <div ref={cardRef} className={cn("w-[500px] h-[280px] flex overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] relative rounded-2xl", selectedTemplate.bg)}>
                        {selectedTemplate.id === 'minimal_white' && <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-12" />}
                        {selectedTemplate.id === 'gold_luxury' && <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30 L60 0 L60 60 Z' fill='%23fbbf24'/%3E%3C/svg%3E")` }} />}

                        <div className="flex-1 p-10 flex flex-col justify-between relative z-10">
                            <div>
                                <h1 className={cn("text-3xl font-black tracking-tighter mb-1 line-clamp-1", selectedTemplate.text)}>{(profileData?.displayName || user.name || "İsim Soyisim").toUpperCase()}</h1>
                                <p className={cn("text-xs font-black uppercase tracking-[0.2em] opacity-80", selectedTemplate.accentText)}>{profileData?.occupation || user.occupation || "DİJİTAL KARTVİZİT"}</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-2 h-2 rounded-full", selectedTemplate.accent)} />
                                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", selectedTemplate.secondary)}>kardly.site/{user.username}</span>
                                </div>
                                {(profileData?.phone || user.phone) && (
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-2 h-2 rounded-full", selectedTemplate.accent)} />
                                        <span className={cn("text-[10px] font-bold uppercase tracking-widest", selectedTemplate.secondary)}>{profileData?.phone || user.phone}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={cn("text-[10px] font-black tracking-[0.3em] uppercase opacity-40", selectedTemplate.text)}>KARDLY.SİTE</span>
                            </div>
                        </div>
                        <div className="w-[180px] flex items-center justify-center relative z-10 pr-10">
                            <div className="p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                                <QRCodeSVG value={profileUrl} size={110} level="H" fgColor="#000" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {mode === 'full' && (
                <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md px-6 relative z-20">
                    <button onClick={handleDownload} disabled={isDownloading} className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                        {isDownloading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : showSuccess ? <><Check size={18} /> {t('downloaded') || 'İNDİRİLDİ'}</> : <><Download size={18} /> {t('downloadJpeg') || 'GÖRSEL OLARAK İNDİR'}</>}
                    </button>
                    <button onClick={handleShare} className="px-6 py-4 bg-white/10 text-white/70 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 hover:text-white transition-all flex items-center justify-center"><Share2 size={18} /></button>
                </div>
            )}
            {mode === 'full' && <p className="mt-4 text-[9px] font-black uppercase tracking-[0.4em] text-white opacity-40">{t('highQuality') || 'YÜKSEK KALİTE (300DPI)'}</p>}
        </div>
    )
}
