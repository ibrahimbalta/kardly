"use client"

import React, { useRef, useState, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
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
    orientation?: 'landscape' | 'portrait'
    onSelect?: (templateId: string) => void
    onOrientationChange?: (orientation: 'landscape' | 'portrait') => void
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
        id: 'luxury_gold',
        name: 'Luxury Gold',
        bg: 'bg-neutral-900',
        text: 'text-amber-100',
        accent: 'bg-amber-500',
        accentText: 'text-amber-500',
        secondary: 'text-amber-100/60',
        hex: '#171717'
    },
    {
        id: 'creative_pink',
        name: 'Creative Waves',
        bg: 'bg-[#4c0519]',
        text: 'text-white',
        accent: 'bg-pink-500',
        accentText: 'text-pink-400',
        secondary: 'text-white/60',
        hex: '#4c0519'
    },
    {
        id: 'royal_blue',
        name: 'Royal Blue',
        bg: 'bg-indigo-950',
        text: 'text-white',
        accent: 'bg-yellow-400',
        accentText: 'text-yellow-400',
        secondary: 'text-indigo-200/60',
        hex: '#1e1b4b'
    },
    {
        id: 'gradient_mesh',
        name: 'Nebula',
        bg: 'bg-slate-950',
        text: 'text-white',
        accent: 'bg-white',
        accentText: 'text-indigo-300',
        secondary: 'text-white/50',
        hex: 'linear-gradient(135deg, #0f172a, #312e81, #581c87)'
    },
    {
        id: 'cyber_neon',
        name: 'Cyber Neon',
        bg: 'bg-black',
        text: 'text-cyan-400',
        accent: 'bg-fuchsia-500',
        accentText: 'text-fuchsia-400',
        secondary: 'text-cyan-400/50',
        hex: '#000000'
    },
    {
        id: 'minimal_glass',
        name: 'Pure Glass',
        bg: 'bg-slate-800/40 backdrop-blur-xl',
        text: 'text-white',
        accent: 'bg-white',
        accentText: 'text-white',
        secondary: 'text-white/60',
        hex: 'rgba(51, 65, 85, 0.4)'
    },
    {
        id: 'deep_purple',
        name: 'Deep Purple',
        bg: 'bg-[#1e1432]',
        text: 'text-white',
        accent: 'bg-[#9d58ff]',
        accentText: 'text-[#9d58ff]',
        secondary: 'text-white/50',
        hex: '#1e1432'
    },
    {
        id: 'titanium_gray',
        name: 'Titanium',
        bg: 'bg-[#1c1c1c]',
        text: 'text-[#e0e0e0]',
        accent: 'bg-[#ff5722]',
        accentText: 'text-[#ff5722]',
        secondary: 'text-[#e0e0e0]/40',
        hex: '#1c1c1c'
    },
    {
        id: 'midnight_emerald',
        name: 'Emerald Dark',
        bg: 'bg-[#062016]',
        text: 'text-[#d4af37]',
        accent: 'bg-[#d4af37]',
        accentText: 'text-[#d4af37]',
        secondary: 'text-[#d4af37]/60',
        hex: '#062016'
    }
]

export default function BusinessCardGenerator({ user, profileData, mode = 'full', selectedTemplateId, orientation = 'landscape', onSelect, onOrientationChange }: BusinessCardGeneratorProps) {
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

    const isPortrait = orientation === 'portrait'
    const cardWidth = isPortrait ? 300 : 500
    const cardHeight = isPortrait ? 500 : 280

    // Scale logic
    const cardScale = Math.min(1, containerWidth / (cardWidth + 20))
    const [isDownloading, setIsDownloading] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [downloadSuccess, setDownloadSuccess] = useState(false)
    const [shareSuccess, setShareSuccess] = useState(false)
    const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/${user.username}` : ''

    const handleDownload = async () => {
        if (!cardRef.current || isDownloading) return
        setIsDownloading(true)
        try {
            // Give time for everything to settle
            await new Promise(r => setTimeout(r, 600))

            const canvas = await html2canvas(cardRef.current, {
                scale: 2, // Stable quality
                useCORS: true,
                backgroundColor: null,
                logging: false,
                width: cardWidth,
                height: cardHeight,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.querySelector('[data-card-actual]') as HTMLElement
                    if (el) {
                        el.style.transform = 'none'
                        el.style.margin = '0'
                        el.style.position = 'static'
                        el.style.borderRadius = '0'
                    }
                }
            })
            const image = canvas.toDataURL('image/jpeg', 0.95)
            const link = document.createElement('a')
            link.href = image
            link.download = `kardly-${user.username}-${orientation}.jpg`
            link.click()
            setDownloadSuccess(true)
            setTimeout(() => setDownloadSuccess(false), 3000)
        } catch (error) {
            console.error('Download error:', error)
            alert(t('downloadError') || 'İndirme sırasında bir hata oluştu.')
        } finally {
            setIsDownloading(false)
        }
    }

    const handleShare = async () => {
        if (isSharing) return
        setIsSharing(true)

        try {
            if (navigator.share) {
                await navigator.share({
                    title: `${user.name} - Kardly`,
                    text: `Check out my digital business card!`,
                    url: profileUrl,
                })
            } else {
                throw new Error('Share API not supported')
            }
        } catch (error: any) {
            console.log('Sharing failed, copying to clipboard instead:', error)
            navigator.clipboard.writeText(profileUrl)
            setShareSuccess(true)
            setTimeout(() => setShareSuccess(false), 2000)
        } finally {
            setIsSharing(false)
        }
    }

    const tp = internalSelectedTpl

    return (
        <div className="space-y-8 w-full flex flex-col items-center">
            {mode === 'selector' && (
                <div className="w-full flex flex-col items-center gap-8">
                    {/* View Switcher */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                        <button
                            onClick={() => onOrientationChange?.('landscape')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                !isPortrait ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            {t('landscape') || 'YATAY'}
                        </button>
                        <button
                            onClick={() => onOrientationChange?.('portrait')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                isPortrait ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            {t('portrait') || 'DİKEY'}
                        </button>
                    </div>

                    <div className="w-full text-center">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
                            {t('selectTemplate') || 'ŞABLON SEÇİMİ'}
                        </h3>
                        <div className="flex flex-wrap gap-4 justify-center px-4 max-w-sm mx-auto">
                            {TEMPLATES.map((tpl) => (
                                <button
                                    key={tpl.id}
                                    onClick={() => onSelect?.(tpl.id)}
                                    className={cn(
                                        "relative group shrink-0 w-12 h-12 rounded-full border-2 transition-all p-0.5",
                                        tp.id === tpl.id
                                            ? "border-primary ring-4 ring-primary/20 scale-110 shadow-lg"
                                            : "border-slate-200 opacity-60 hover:opacity-100 hover:scale-105"
                                    )}
                                >
                                    <div className="w-full h-full rounded-full shadow-inner" style={{ background: tpl.hex }} />
                                    {tp.id === tpl.id && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-full">
                                            <Check size={18} className="text-white drop-shadow-sm" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div ref={containerRef} className="relative w-full overflow-visible flex flex-col items-center">
                <div
                    className="relative flex-shrink-0 transition-all duration-500 ease-out origin-center"
                    style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        transform: `scale(${cardScale})`,
                        marginTop: cardScale < 1 ? `-${(1 - cardScale) * cardHeight / 2}px` : '0px',
                        marginBottom: cardScale < 1 ? `-${(1 - cardScale) * cardHeight / 2}px` : '0px'
                    }}
                    data-card-preview
                >
                    <div ref={cardRef} data-card-actual className={cn(
                        "flex overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] relative transition-all duration-500",
                        isPortrait ? "flex-col" : "flex-row",
                        tp.bg
                    )} style={{ width: `${cardWidth}px`, height: `${cardHeight}px`, borderRadius: '1.5rem' }}>

                        {/* Design Elements */}
                        {tp.id === 'luxury_gold' && (
                            <>
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500/20 skew-x-12 translate-x-1/4" />
                                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-amber-500/10 -skew-y-12 -translate-x-1/4" />
                            </>
                        )}
                        {tp.id === 'creative_pink' && (
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 0% 0%, #ec4899 0%, transparent 50%), radial-gradient(circle at 100% 100%, #881337 0%, transparent 50%)` }} />
                        )}
                        {tp.id === 'gradient_mesh' && (
                            <div className="absolute inset-0 opacity-40 shadow-[inset_0_0_100px_rgba(255,255,255,0.1)]" style={{ backgroundImage: tp.hex }} />
                        )}
                        {tp.id === 'cyber_neon' && (
                            <>
                                <div className="absolute top-0 left-0 w-full h-px bg-cyan-400 opacity-50" />
                                <div className="absolute bottom-0 right-0 w-full h-px bg-fuchsia-500 opacity-50" />
                                <div className="absolute top-0 right-0 w-1/4 h-full bg-cyan-400/5 blur-3xl" />
                            </>
                        )}
                        {tp.id === 'midnight_emerald' && (
                            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 0h20v20H0V0z' fill='%23d4af37' fill-opacity='1'/%3E%3C/svg%3E")` }} />
                        )}

                        <div className={cn(
                            "flex-1 p-8 sm:p-10 flex flex-col relative z-20",
                            isPortrait ? "justify-start text-center pt-14" : "justify-between"
                        )}>
                            <div className={isPortrait ? "mb-10" : ""}>
                                <h1 className={cn(
                                    "font-black tracking-tighter mb-1 line-clamp-2",
                                    tp.text,
                                    isPortrait ? "text-4xl" : "text-3xl"
                                )}>{(profileData?.displayName || user.name || "John Doe").toUpperCase()}</h1>
                                <p className={cn("text-[10px] font-black uppercase tracking-[0.2em] opacity-80", tp.accentText)}>{profileData?.occupation || user.occupation || "PROFESSIONAL"}</p>
                            </div>

                            <div className={cn("space-y-4", isPortrait ? "mt-4" : "")}>
                                <div className={cn("flex items-center gap-3", isPortrait && "justify-center")}>
                                    <div className={cn("w-2 h-2 rounded-full shrink-0", tp.accent)} />
                                    <span className={cn("text-[10px] font-bold tracking-widest truncate", tp.secondary)}>kardly.site/{user.username}</span>
                                </div>
                                {(profileData?.phone || user.phone) && (
                                    <div className={cn("flex items-center gap-3", isPortrait && "justify-center")}>
                                        <div className={cn("w-2 h-2 rounded-full shrink-0", tp.accent)} />
                                        <span className={cn("text-[10px] font-bold tracking-widest truncate", tp.secondary)}>{profileData?.phone || user.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className={cn("flex mt-6", isPortrait ? "justify-center opacity-40" : "opacity-30")}>
                                <span className={cn("text-[10px] font-black tracking-[0.5em] uppercase", tp.text)}>KARDLY.SİTE</span>
                            </div>
                        </div>

                        <div className={cn(
                            "flex items-center justify-center relative z-20",
                            isPortrait ? "pb-14" : "w-[180px] pr-10"
                        )}>
                            <div className="p-3 bg-white rounded-3xl shadow-2xl flex items-center justify-center group/qr transition-transform hover:scale-105">
                                <QRCodeCanvas value={profileUrl} size={isPortrait ? 130 : 110} level="H" fgColor="#000" bgColor="#fff" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {mode === 'full' && (
                <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-sm px-6 relative z-30">
                    <button onClick={handleDownload} disabled={isDownloading} className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 min-w-[200px]">
                        {isDownloading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : downloadSuccess ? <><Check size={20} /> {t('downloaded') || 'İNDİRİLDİ'}</> : <><Download size={20} /> {t('downloadJpeg') || 'GÖRSEL İNDİR'}</>}
                    </button>
                    <button onClick={handleShare} disabled={isSharing} className="px-6 py-5 bg-white/10 text-white/70 border border-white/10 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white/20 hover:text-white transition-all flex items-center justify-center backdrop-blur-md min-w-[70px]">
                        {shareSuccess ? <Check size={20} className="text-emerald-400" /> : <Share2 size={20} />}
                    </button>
                </div>
            )}
            {mode === 'full' && <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-white opacity-40">{t('ultraHighQuality') || 'BASKI KALİTESİ (Ultra HD)'}</p>}
        </div>
    )
}
