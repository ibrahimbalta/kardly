"use client"

import React, { useRef, useState, useEffect } from 'react'
// High-res business card generator with base64 QR support
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { Download, Share2, Check, RefreshCw } from 'lucide-react'
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
    mode?: 'full' | 'selector' | 'preview' | 'modal'
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
    const [qrDataUrl, setQrDataUrl] = useState<string>('')

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

    const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/${user.username}` : ''

    useEffect(() => {
        const generateQr = async () => {
            try {
                const url = await QRCode.toDataURL(profileUrl, {
                    width: 400,
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    }
                })
                setQrDataUrl(url)
            } catch (err) {
                console.error('QR Generate Error:', err)
            }
        }
        generateQr()
    }, [profileUrl])

    const isPortrait = orientation === 'portrait'
    const cardWidth = isPortrait ? 320 : 500
    const cardHeight = isPortrait ? 540 : 280

    // Scale logic
    const cardScale = mode === 'modal' ? 1 : Math.min(1, containerWidth / (cardWidth + 20))

    const [isDownloading, setIsDownloading] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [downloadSuccess, setDownloadSuccess] = useState(false)
    const [shareSuccess, setShareSuccess] = useState(false)

    const handleDownload = async () => {
        if (!cardRef.current || isDownloading) return
        setIsDownloading(true)
        try {
            // Re-generate QR with high res just in case
            await new Promise(r => setTimeout(r, 600))

            const canvas = await html2canvas(cardRef.current, {
                scale: 3, // Superior clarity for text/icons
                useCORS: true,
                allowTaint: true,
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
                        el.style.boxShadow = 'none'
                        el.style.width = `${cardWidth}px`
                        el.style.height = `${cardHeight}px`
                    }
                }
            })

            const image = canvas.toDataURL('image/jpeg', 0.98)
            const link = document.createElement('a')
            link.href = image
            link.download = `kardly-${user.username}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            setDownloadSuccess(true)
            setTimeout(() => setDownloadSuccess(false), 3000)
        } catch (error) {
            console.error('Download error:', error)
            alert(t('downloadError') || 'İndirme işlemi başarısız oldu. Lütfen tekrar deneyin.')
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
                navigator.clipboard.writeText(profileUrl)
                setShareSuccess(true)
                setTimeout(() => setShareSuccess(false), 2000)
            }
        } catch (error: any) {
            console.log('Sharing failed:', error)
            navigator.clipboard.writeText(profileUrl)
            setShareSuccess(true)
            setTimeout(() => setShareSuccess(false), 2000)
        } finally {
            setIsSharing(false)
        }
    }

    const tp = internalSelectedTpl

    const CardContent = (
        <div ref={cardRef} data-card-actual className={cn(
            "flex overflow-hidden shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] relative group/card",
            isPortrait ? "flex-col" : "flex-row",
            tp.bg
        )} style={{
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            borderRadius: mode === 'modal' ? '2.5rem' : '1.5rem',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>

            {/* Design Patterns based on template */}
            {tp.id === 'luxury_gold' && (
                <>
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500/10 skew-x-12 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-amber-500/5 -skew-y-12 -translate-x-1/4" />
                </>
            )}
            {tp.id === 'creative_pink' && (
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 0% 0%, #ec4899 0%, transparent 50%), radial-gradient(circle at 100% 100%, #881337 0%, transparent 50%)` }} />
            )}
            {tp.id === 'gradient_mesh' && (
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: tp.hex }} />
            )}
            {tp.id === 'cyber_neon' && (
                <>
                    <div className="absolute top-0 left-0 w-full h-px bg-cyan-400 opacity-20" />
                    <div className="absolute bottom-0 right-0 w-full h-px bg-fuchsia-500 opacity-20" />
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
                        "font-black tracking-tighter mb-1 line-clamp-2 leading-none",
                        tp.text,
                        isPortrait ? "text-4xl" : "text-3xl"
                    )}>{(profileData?.displayName || user.name || "İsim Soyisim").toUpperCase()}</h1>
                    <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] opacity-80", tp.accentText)}>{profileData?.occupation || user.occupation || "MESLEK ÜNVANI"}</p>
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

                <div className={cn("flex mt-6 transition-all group-hover/card:tracking-[0.8em]", isPortrait ? "justify-center opacity-40" : "opacity-30")}>
                    <span className={cn("text-[9px] font-black tracking-[0.5em] uppercase", tp.text)}>KARDLY.SİTE</span>
                </div>
            </div>

            <div className={cn(
                "flex items-center justify-center relative z-20",
                isPortrait ? "pb-14" : "w-[200px] pr-12"
            )}>
                <div className="p-3.5 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center group/qr transition-all hover:scale-105 active:scale-95">
                    {qrDataUrl ? (
                        <img src={qrDataUrl} alt="QR Code" className={isPortrait ? "w-[120px] h-[120px]" : "w-[110px] h-[110px]"} />
                    ) : (
                        <div className={cn(isPortrait ? "w-[120px] h-[120px]" : "w-[110px] h-[110px]", "animate-pulse bg-slate-100 rounded-2xl flex items-center justify-center")} >
                            <RefreshCw className="animate-spin text-slate-300" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    if (mode === 'modal') {
        return (
            <div className="w-full flex flex-col items-center">
                <div className="relative" style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}>
                    {CardContent}
                </div>

                <div className="w-full max-w-[320px] flex gap-3 mt-8">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex-1 h-16 flex items-center justify-center gap-3 bg-primary text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isDownloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : downloadSuccess ? <Check size={18} /> : <Download size={18} />}
                        {downloadSuccess ? t('downloaded') || 'İNDİRİLDİ' : t('downloadJpeg') || 'GÖRSEL İNDİR'}
                    </button>
                    <button
                        onClick={handleShare}
                        disabled={isSharing}
                        className="w-16 h-16 flex items-center justify-center bg-white/5 text-white/40 border border-white/5 rounded-3xl hover:bg-white/10 hover:text-white transition-all backdrop-blur-md active:scale-95"
                    >
                        {shareSuccess ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 w-full flex flex-col items-center">
            {mode === 'selector' && (
                <div className="w-full flex flex-col items-center gap-8">
                    {/* View Switcher omitted for space, keep original selector if needed or simplified */}
                    <div className="w-full text-center">
                        <div className="flex flex-wrap gap-4 justify-center px-4 max-w-sm mx-auto">
                            {TEMPLATES.map((tpl) => (
                                <button
                                    key={tpl.id}
                                    onClick={() => onSelect?.(tpl.id)}
                                    className={cn(
                                        "relative shrink-0 w-12 h-12 rounded-full border-2 transition-all p-0.5",
                                        tp.id === tpl.id ? "border-primary ring-4 ring-primary/20 scale-110" : "border-slate-200 opacity-60"
                                    )}
                                >
                                    <div className="w-full h-full rounded-full shadow-inner" style={{ background: tpl.hex }} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div ref={containerRef} className="relative w-full overflow-hidden flex flex-col items-center px-4">
                <div
                    className="relative flex-shrink-0 transition-all duration-500 origin-center"
                    style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        transform: `scale(${cardScale})`,
                        marginTop: cardScale < 1 ? `-${(1 - cardScale) * cardHeight / 2}px` : '0px',
                        marginBottom: cardScale < 1 ? `-${(1 - cardScale) * cardHeight / 2}px` : '0px'
                    }}
                >
                    {CardContent}
                </div>
            </div>

            {mode === 'full' && (
                <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-sm px-6">
                    <button onClick={handleDownload} disabled={isDownloading} className="flex-1 h-16 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3">
                        {isDownloading ? <RefreshCw className="animate-spin" /> : <Download size={20} />}
                        {t('downloadJpeg') || 'GÖRSEL İNDİR'}
                    </button>
                    <button onClick={handleShare} disabled={isSharing} className="w-16 h-16 bg-white/10 text-white rounded-3xl flex items-center justify-center">
                        <Share2 size={20} />
                    </button>
                </div>
            )}
        </div>
    )
}

