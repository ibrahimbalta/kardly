"use client"

import React, { useRef, useState, useEffect } from 'react'
import QRCode from 'qrcode'
import * as htmlToImage from 'html-to-image'
import { Download, Share2, Check, RefreshCw, Phone, MapPin, Mail, Globe, MessageCircle, Star, Crown, Palette } from 'lucide-react'
import { useTranslation } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

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
    // Standard
    { id: 'minimal_white', name: 'Zen White', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-indigo-600', accentText: 'text-indigo-600', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'dots', category: 'Standard' },
    { id: 'modern_dark', name: 'Obsidian', bg: 'bg-slate-950', text: 'text-white', accent: 'bg-emerald-400', accentText: 'text-emerald-400', secondary: 'text-slate-400', hex: '#020617', pattern: 'grid', category: 'Standard' },
    { id: 'minimal_noir', name: 'Noir Luxe', bg: 'bg-neutral-900', text: 'text-neutral-100', accent: 'bg-white', accentText: 'text-white', secondary: 'text-neutral-500', hex: '#171717', pattern: 'lines', category: 'Standard' },
    { id: 'standard_waves', name: 'Soft Waves', bg: 'bg-indigo-50', text: 'text-indigo-950', accent: 'bg-indigo-500', accentText: 'text-indigo-500', secondary: 'text-indigo-700/60', hex: '#eef2ff', pattern: 'waves', category: 'Standard' },

    // Premium
    { id: 'vibe_wave', name: 'Vibe Wave', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#e67e22]', accentText: 'text-[#e67e22]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium' },
    { id: 'vibe_geometric', name: 'Vibe Geometric', bg: 'bg-[#1a1a1a]', text: 'text-white', accent: 'bg-[#e67e22]', accentText: 'text-[#e67e22]', secondary: 'text-slate-300', hex: '#1a1a1a', pattern: 'vibe_geo', category: 'Premium' },
    { id: 'vibe_elegant', name: 'Vibe Elegant', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#e67e22]', accentText: 'text-[#e67e22]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_elegant', category: 'Premium' },
    { id: 'premium_glass', name: 'Glass Frost', bg: 'bg-white/10', text: 'text-white', accent: 'bg-blue-400', accentText: 'text-[#60a5fa]', secondary: 'text-white/40', hex: '#ffffff', pattern: 'glass', category: 'Premium' },
    { id: 'premium_luxury', name: 'Golden Era', bg: 'bg-neutral-950', text: 'text-amber-100', accent: 'bg-amber-500', accentText: 'text-[#f59e0b]', secondary: 'text-amber-500/20', hex: '#0a0a0a', pattern: 'luxury', category: 'Premium' },

    // Ultimate (Elite)
    { id: 'elite_aurora', name: 'Aurora', bg: 'bg-[#050510]', text: 'text-white', accent: 'bg-cyan-500', accentText: 'text-[#22d3ee]', secondary: 'text-slate-400', hex: '#050510', pattern: 'aurora', category: 'Ultimate' },
    { id: 'elite_spatial', name: 'Spatial Pro', bg: 'bg-[#050510]', text: 'text-white', accent: 'bg-blue-500', accentText: 'text-[#3b82f6]', secondary: 'text-blue-200/40', hex: '#050510', pattern: 'elite_spatial', category: 'Ultimate' },
    { id: 'elite_cyber', name: 'Cyberpunk', bg: 'bg-black', text: 'text-white', accent: 'bg-fuchsia-500', accentText: 'text-[#d946ef]', secondary: 'text-fuchsia-200/40', hex: '#000000', pattern: 'elite_cyber', category: 'Ultimate' },
    { id: 'elite_mesh', name: 'Mesh Prism', bg: 'bg-black', text: 'text-white', accent: 'bg-fuchsia-600', accentText: 'text-[#d946ef]', secondary: 'text-fuchsia-200/40', hex: '#000000', pattern: 'mesh', category: 'Ultimate' },
    { id: 'elite_glass', name: 'Frosty Glass', bg: 'bg-slate-900', text: 'text-white', accent: 'bg-blue-500', accentText: 'text-[#3b82f6]', secondary: 'text-blue-100/40', hex: '#0f172a', pattern: 'frosty', category: 'Ultimate' },
    { id: 'elite_royal', name: 'Elite Royal', bg: 'bg-[#1a0b0b]', text: 'text-amber-100', accent: 'bg-amber-600', accentText: 'text-[#d97706]', secondary: 'text-amber-200/40', hex: '#1a0b0b', pattern: 'elite_royal', category: 'Ultimate' },
    { id: 'elite_nebula', name: 'Deep Nebula', bg: 'bg-black', text: 'text-white', accent: 'bg-purple-500', accentText: 'text-[#a855f7]', secondary: 'text-purple-200/40', hex: '#000000', pattern: 'nebula', category: 'Ultimate' }
]

export default function BusinessCardGenerator({ user, profileData, mode = 'full', selectedTemplateId, orientation = 'portrait', onSelect, onOrientationChange }: BusinessCardGeneratorProps) {
    const { t } = useTranslation()
    const cardRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(500)
    const [internalSelectedTplId, setInternalSelectedTplId] = useState(selectedTemplateId || TEMPLATES[0].id)
    const [qrDataUrl, setQrDataUrl] = useState<string>('')
    const [activeTab, setActiveTab] = useState<'Standard' | 'Premium' | 'Ultimate'>('Ultimate')

    useEffect(() => {
        if (selectedTemplateId) {
            setInternalSelectedTplId(selectedTemplateId)
            const tpl = TEMPLATES.find(t => t.id === selectedTemplateId)
            if (tpl && tpl.category) setActiveTab(tpl.category as any)
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

    const tp = TEMPLATES.find(t => t.id === internalSelectedTplId) || TEMPLATES[0]
    const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/${user.username}` : ''

    useEffect(() => {
        const generateQr = async () => {
            try {
                const url = await QRCode.toDataURL(profileUrl, {
                    width: 512,
                    margin: 2,
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

    // Scale logic
    const cardWidth = orientation === 'landscape' ? 600 : 340
    const cardHeight = orientation === 'landscape' ? 340 : 600
    const cardScale = mode === 'modal' ? 1 : Math.min(1, containerWidth / (cardWidth + 20))

    const [isDownloading, setIsDownloading] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [downloadSuccess, setDownloadSuccess] = useState(false)
    const [shareSuccess, setShareSuccess] = useState(false)

    const handleDownload = async () => {
        if (!cardRef.current || isDownloading) return
        setIsDownloading(true)
        try {
            await new Promise(r => setTimeout(r, 800))
            const dataUrl = await htmlToImage.toJpeg(cardRef.current, {
                quality: 0.98,
                pixelRatio: 3,
                backgroundColor: '#000000',
                cacheBust: true,
            })
            const link = document.createElement('a')
            link.href = dataUrl
            link.download = `kardly-${user.username}.jpg`
            link.click()
            setDownloadSuccess(true)
            setTimeout(() => setDownloadSuccess(false), 3000)
        } catch (error) {
            console.error('Download error:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    const handleShare = async () => {
        if (isSharing) return
        setIsSharing(true)
        try {
            if (navigator.share) {
                await navigator.share({ title: user.name, url: profileUrl })
            } else {
                navigator.clipboard.writeText(profileUrl)
                setShareSuccess(true)
                setTimeout(() => setShareSuccess(false), 2000)
            }
        } catch (error) {
            console.log('Sharing failed', error)
        } finally {
            setIsSharing(false)
        }
    }

    const locationData = (profileData?.socialLinks as any[])?.find((l: any) => l.platform.toLowerCase() === 'location')?.url || profileData?.location || ""
    const whatsappData = (profileData?.socialLinks as any[])?.find((l: any) => l.platform.toLowerCase() === 'whatsapp')?.url || ""

    const CardContent = (
        <div
            ref={cardRef}
            data-card-actual
            className={cn(
                "flex overflow-hidden relative group/card shadow-2xl transition-all duration-500",
                orientation === 'landscape' ? "flex-row" : "flex-col",
                tp.bg,
                "rounded-[2.5rem]"
            )}
            style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                border: tp.hex === '#ffffff' ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.05)'
            }}
        >
            {/* Premium Background Graphics */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {tp.pattern === 'grid' && (
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(${tp.accentText} 1px, transparent 1px), linear-gradient(90deg, ${tp.accentText} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                )}
                {tp.pattern === 'dots' && (
                    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `radial-gradient(${tp.accentText} 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
                )}
                {tp.pattern === 'luxury' && (
                    <>
                        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full" />
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50 Z' fill='%23d4af37'/%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />
                    </>
                )}
                {tp.pattern === 'nebula' && (
                    <>
                        <div className="absolute top-[-20%] right-[-20%] w-full h-full bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow" />
                        <div className="absolute bottom-[-20%] left-[-20%] w-full h-full bg-indigo-600/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    </>
                )}
                {tp.pattern === 'elite_spatial' && (
                    <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.1)_0%,_transparent_70%)]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-white/5 rounded-full scale-150 opacity-20" />
                        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    </>
                )}
                {tp.pattern === 'elite_cyber' && (
                    <>
                        <div className="absolute inset-0 bg-[#0a0a0a]" />
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#f0f 1px, transparent 1px), linear-gradient(90deg, #f0f 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) translateY(50px)' }} />
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent animate-scan" />
                    </>
                )}
                {tp.pattern === 'elite_royal' && (
                    <>
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/shattered-island.png")' }} />
                        <div className="absolute inset-8 border border-amber-500/10 rounded-[2rem]" />
                        <div className="absolute top-[-10%] right-[-10%] w-60 h-60 bg-amber-500/5 blur-[80px] rounded-full" />
                    </>
                )}
                {tp.pattern === 'aurora' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-purple-900/10 animate-pulse-slow" />
                )}
                {tp.pattern === 'mesh' && (
                    <div className="absolute inset-0 opacity-[0.15] blur-[80px]" style={{ background: 'radial-gradient(circle at 20% 20%, #f0f 0%, transparent 50%), radial-gradient(circle at 80% 80%, #0ff 0%, transparent 50%)' }} />
                )}
                {tp.pattern === 'vibe_wave' && (
                    <div className="absolute top-0 left-0 w-full h-[45%] bg-[#24292e]" />
                )}
            </div>

            <div className={cn(
                "flex-1 p-8 flex flex-col relative z-20 items-center text-center",
                orientation === 'landscape' ? "justify-center" : "justify-start"
            )}>
                {/* QR Code Container */}
                <div className="mb-8">
                    <div className={cn(
                        "p-4 bg-white shadow-2xl flex items-center justify-center transition-all ring-[8px] ring-white/10 rounded-[2.5rem]",
                    )}>
                        {qrDataUrl ? (
                            <img src={qrDataUrl} alt="QR Code" className="w-24 h-24" />
                        ) : (
                            <div className="w-24 h-24 animate-pulse bg-slate-50 rounded-2xl flex items-center justify-center" >
                                <RefreshCw className="animate-spin text-slate-200" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className={cn(
                        "relative z-10 overflow-hidden shadow-2xl mb-4 w-20 h-20 p-1 rounded-2xl border-2 ring-4 ring-white/5",
                        tp.hex === '#ffffff' ? "border-slate-100" : "border-white/20"
                    )}>
                        <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`} className="w-full h-full object-cover rounded-xl" alt="" />
                    </div>
                    <div className="space-y-1">
                        <h1 className={cn(
                            "text-xl font-black tracking-tighter leading-none uppercase",
                            tp.text
                        )}>{profileData?.displayName || user.name || "KARDLY USER"}</h1>
                        <p className={cn("text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/5 rounded-full inline-block mt-2", tp.accentText)}>
                            {profileData?.occupation || user.occupation || "DİJİTAL UZMAN"}
                        </p>
                    </div>
                </div>

                {/* Info Fields */}
                <div className="w-full space-y-2 mt-auto">
                    {[
                        { icon: Phone, value: profileData?.phone || user.phone, label: 'TELEFON' },
                        { icon: Mail, value: profileData?.email || user.email, label: 'E-POSTA' },
                        { icon: Globe, value: `kardly.site/${user.username}`, label: 'WEB PROFİL' }
                    ].filter(item => item.value).map((item, idx) => (
                        <div key={idx} className={cn(
                            "flex items-center gap-3 p-3 rounded-2xl border",
                            tp.category === 'Ultimate' ? "bg-white/[0.08] border-white/10 backdrop-blur-xl shadow-lg" : "bg-white/[0.03] border-white/5"
                        )}>
                            <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                                tp.accent,
                                "bg-opacity-10"
                            )}>
                                <item.icon size={12} className={tp.accentText} strokeWidth={3} />
                            </div>
                            <div className="text-left min-w-0">
                                <span className={cn("block text-[7px] font-black uppercase tracking-widest opacity-30 mb-0.5", tp.text)}>{item.label}</span>
                                <span className={cn("block text-[10px] font-bold tracking-tight truncate", tp.text)}>{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 opacity-20">
                    <span className={cn("text-[6px] font-black tracking-[0.5em] uppercase", tp.text)}>KARDLY • SİZİN İÇİN TASARLANDI</span>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.2; transform: scale(1.1); }
                }
                .animate-scan { animation: scan 3s linear infinite; }
                .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
            `}</style>
        </div>
    )

    if (mode === 'modal') {
        return (
            <div className="w-full flex flex-col items-center px-4">
                <div
                    className="relative group/modal-card"
                    style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        transform: `scale(${cardScale})`,
                        transformOrigin: 'top center'
                    }}
                >
                    <div className={cn("absolute inset-4 blur-[80px] opacity-20 rounded-[2.5rem]", tp.accent)} />
                    {CardContent}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col items-center">
            {mode === 'selector' && (
                <div className="w-full mb-12 bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/5 shadow-2xl">
                    <div className="flex flex-col gap-8">
                        {/* Tabs */}
                        <div className="flex bg-slate-950/50 p-1.5 rounded-full border border-white/5 w-fit mx-auto shadow-inner">
                            {(['Standard', 'Premium', 'Ultimate'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-8 py-3 rounded-full transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2",
                                        activeTab === tab
                                            ? "bg-primary text-white shadow-xl scale-105"
                                            : "text-slate-400 hover:text-white"
                                    )}
                                >
                                    {tab === 'Standard' && <Palette size={14} />}
                                    {tab === 'Premium' && <Star size={14} />}
                                    {tab === 'Ultimate' && <Crown size={14} />}
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Picker */}
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 justify-center">
                            {TEMPLATES.filter(t => t.category === activeTab).map((tpl) => (
                                <button
                                    key={tpl.id}
                                    onClick={() => onSelect?.(tpl.id)}
                                    className={cn(
                                        "relative aspect-square rounded-2xl border-2 transition-all p-1.5 group/tpl overflow-hidden",
                                        internalSelectedTplId === tpl.id
                                            ? "border-primary ring-4 ring-primary/20 scale-105 shadow-xl shadow-primary/20"
                                            : "border-white/5 hover:border-white/10 hover:scale-105"
                                    )}
                                >
                                    <div className="w-full h-full rounded-xl" style={{ background: tpl.hex }} />
                                    {internalSelectedTplId === tpl.id && (
                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                            <Check size={20} className="text-white" strokeWidth={5} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Preview */}
            <div ref={containerRef} className="relative w-full overflow-hidden flex flex-col items-center">
                <div
                    className="relative transition-all duration-700 ease-out origin-top"
                    style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        transform: `scale(${cardScale})`,
                        marginBottom: cardScale < 1 ? `-${(1 - cardScale) * cardHeight}px` : '0px'
                    }}
                >
                    <div className={cn("absolute inset-6 blur-[100px] opacity-10 rounded-[2rem]", tp.accent)} />
                    {CardContent}
                </div>
            </div>

            {/* Actions */}
            <div className="w-full max-w-[340px] flex gap-4 mt-12 relative z-50">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-1 h-16 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    {isDownloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download size={20} />}
                    {downloadSuccess ? 'KAYDEDİLDİ' : 'TASARIMI İNDİR'}
                </button>
                <button
                    onClick={handleShare}
                    className="w-16 h-16 bg-white text-slate-900 rounded-full shadow-xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center"
                >
                    <Share2 size={20} />
                </button>
            </div>
        </div>
    )
}
