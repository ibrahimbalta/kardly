"use client"

import React, { useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import { Download, Share2, Check, ChevronLeft, ChevronRight, IdCard } from 'lucide-react'
import { useTranslation } from '@/context/LanguageContext'

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
        secondary: 'text-slate-500'
    },
    {
        id: 'modern_dark',
        name: 'Modern Dark',
        bg: 'bg-slate-900',
        text: 'text-white',
        accent: 'bg-emerald-500',
        accentText: 'text-emerald-500',
        secondary: 'text-slate-400'
    },
    {
        id: 'creative_gradient',
        name: 'Creative Gradient',
        bg: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500',
        text: 'text-white',
        accent: 'bg-white',
        accentText: 'text-white',
        secondary: 'text-white/70'
    },
    {
        id: 'gold_luxury',
        name: 'Gold Luxury',
        bg: 'bg-neutral-900',
        text: 'text-amber-100',
        accent: 'bg-amber-400',
        accentText: 'text-amber-400',
        secondary: 'text-amber-100/60'
    }
]

export default function BusinessCardGenerator({ user, profileData, mode = 'full', selectedTemplateId, onSelect }: BusinessCardGeneratorProps) {
    const { t } = useTranslation()
    const cardRef = useRef<HTMLDivElement>(null)

    // Internal state if prop not provided
    const [internalSelectedTpl, setInternalSelectedTpl] = useState(TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0])

    // Effective template
    const selectedTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || internalSelectedTpl

    const [isDownloading, setIsDownloading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const profileUrl = `${window.location.origin}/${user.username}`

    const handleDownload = async () => {
        if (!cardRef.current) return
        setIsDownloading(true)
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 3, // Higher quality
                useCORS: true,
                backgroundColor: null,
            })
            const image = canvas.toDataURL('image/jpeg', 0.9)
            const link = document.createElement('a')
            link.href = image
            link.download = `kardly-card-${user.username}.jpg`
            link.click()

            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (error) {
            console.error('Error generating card image:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${user.name} - Kardly Digital Business Card`,
                    text: `Check out my digital business card on Kardly!`,
                    url: profileUrl,
                })
            } catch (error) {
                console.log('Error sharing:', error)
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(profileUrl)
            alert(t('copiedLabel') || 'Link Copied!')
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col items-center">
                <div className="mb-6">
                    <h3 className="text-xl font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t('selectBusinessCard') || 'KARTVİZİT ŞABLONU SEÇ'}</h3>
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar max-w-full justify-center">
                        {TEMPLATES.map((tpl) => (
                            <button
                                key={tpl.id}
                                onClick={() => {
                                    if (onSelect) onSelect(tpl.id)
                                    else setInternalSelectedTpl(tpl)
                                }}
                                className={`shrink-0 w-12 h-12 rounded-full border-2 transition-all ${selectedTemplate.id === tpl.id ? 'border-primary ring-4 ring-primary/20 scale-110' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                                style={{ background: tpl.bg.includes('gradient') ? 'linear-gradient(135deg, #6366f1, #a855f7)' : tpl.bg.replace('bg-', '') }}
                                title={tpl.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Business Card Preview Area */}
                <div className="relative group">
                    <div className="absolute -inset-10 bg-primary/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    {/* The Card */}
                    <div
                        ref={cardRef}
                        className={`w-[500px] h-[280px] ${selectedTemplate.bg} flex overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative transition-all duration-500 rounded-xl`}
                    >
                        {/* Decorative background elements based on template */}
                        {selectedTemplate.id === 'minimal_white' && (
                            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-12" />
                        )}
                        {selectedTemplate.id === 'gold_luxury' && (
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30 L60 0 L60 60 Z' fill='%23fbbf24'/%3E%3C/svg%3E")` }} />
                        )}

                        <div className="flex-1 p-10 flex flex-col justify-between relative z-10">
                            <div>
                                <h1 className={`text-3xl font-black tracking-tighter mb-1 ${selectedTemplate.text}`}>
                                    {user.name.toUpperCase()}
                                </h1>
                                <p className={`text-xs font-black uppercase tracking-[0.2em] ${selectedTemplate.accentText}`}>
                                    {user.occupation || t('noTitleSpec') || 'PROFESSIONAL'}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${selectedTemplate.accent}`} />
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedTemplate.secondary}`}>kardly.site/{user.username}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedTemplate.accent}`} />
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedTemplate.secondary}`}>{user.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded flex items-center justify-center ${selectedTemplate.accent} text-white font-black text-[10px]`}>
                                    K
                                </div>
                                <span className={`text-[10px] font-black tracking-widest ${selectedTemplate.text}`}>KARDLY.SİTE</span>
                            </div>
                        </div>

                        <div className={`w-[180px] flex items-center justify-center relative z-10 pr-10`}>
                            <div className="p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                                <QRCodeSVG
                                    value={profileUrl}
                                    size={110}
                                    level="H"
                                    includeMargin={false}
                                    fgColor={selectedTemplate.id === 'minimal_white' ? '#0f172a' : '#000000'}
                                />
                            </div>
                        </div>

                        {/* Glossy overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                    </div>
                </div>

                {mode === 'full' && (
                    <div className="flex gap-4 mt-12 w-full max-w-md">
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isDownloading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : showSuccess ? (
                                <><Check size={18} /> {t('downloaded') || 'İNDİRİLDİ'}</>
                            ) : (
                                <><Download size={18} /> {t('downloadJpeg') || 'GÖRSEL OLARAK İNDİR'}</>
                            )}
                        </button>
                        <button
                            onClick={handleShare}
                            className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center"
                            title={t('shareLabel')}
                        >
                            <Share2 size={18} />
                        </button>
                    </div>
                )}

                {mode === 'full' && (
                    <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        {t('highQuality') || 'BASKIYA UYGUN YÜKSEK ÇÖZÜNÜRLÜK (300DPI)'}
                    </p>
                )}
            </div>
        </div>
    )
}
