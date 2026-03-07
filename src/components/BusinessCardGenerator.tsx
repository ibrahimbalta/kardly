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
            if (tpl) setActiveTab(tpl.category as any)
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

    const locationData = (profileData?.socialLinks as any[])?.find((l: any) => l.platform === 'location')?.url
    const whatsappData = (profileData?.socialLinks as any[])?.find((l: any) => l.platform === 'whatsapp')?.url

    const CardContent = (
        <div
            ref={cardRef}
            className={cn(
                "relative overflow-hidden transition-all duration-500 flex items-center justify-center p-8",
                tp.bg,
                orientation === 'landscape' ? "flex-row gap-12" : "flex-col gap-8",
                tp.pattern === 'vibe_wave' ? "border-[8px] border-[#e67e22]/20" : "border border-white/5",
                "rounded-[2.5rem] shadow-2xl"
            )}
            style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
        >
            {/* Dynamic Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {tp.pattern === 'dots' && (
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(${tp.hex === '#ffffff' ? '#000' : '#fff'} 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
                )}
                {tp.pattern === 'grid' && (
                    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(${tp.hex === '#ffffff' ? '#000' : '#fff'} 1px, transparent 1px), linear-gradient(90deg, ${tp.hex === '#ffffff' ? '#000' : '#fff'} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                )}
                {tp.pattern === 'nebula' && (
                    <>
                        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full blur-[100px] opacity-20 bg-purple-600" />
                        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full blur-[100px] opacity-20 bg-indigo-600" />
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />
                    </>
                )}
                {tp.pattern === 'elite_spatial' && (
                    <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15)_0%,transparent_70%)]" />
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(45deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-white/5 rounded-full scale-150 opacity-20" />
                    </>
                )}
                {tp.pattern === 'elite_cyber' && (
                    <>
                        <div className="absolute inset-0 bg-[#0a0a0a]" />
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#f0f 1px, transparent 1px), linear-gradient(90deg, #f0f 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) translateY(50px)' }} />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent animate-scan" />
                    </>
                )}
                {tp.pattern === 'elite_royal' && (
                    <>
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/shattered-island.png")' }} />
                        <div className="absolute inset-4 border border-amber-500/10 rounded-[2rem]" />
                        <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-amber-500/10 blur-[60px] rounded-full" />
                    </>
                )}
                {tp.pattern === 'aurora' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-blue-900/20 animate-pulse" />
                )}
            </div>

            {/* Main Content Side (Top in Portrait, Left in Landscape) */}
            <div className={cn(
                "relative z-10 flex flex-col items-center text-center max-w-[240px]",
                orientation === 'landscape' ? "items-start text-left" : ""
            )}>
                {/* QR Section */}
                <div className="relative group mb-8">
                    <div className={cn(
                        "absolute -inset-4 rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-30 transition-all duration-700",
                        tp.accent
                    )} />
                    <div className="relative p-3 bg-white rounded-3xl shadow-2xl border-white/20">
                        {qrDataUrl ? (
                            <img src={qrDataUrl} className="w-24 h-24" alt="QR Link" />
                        ) : (
                            <div className="w-24 h-24 animate-pulse bg-slate-100 rounded-xl" />
                        )}
                    </div>
                </div>

                {/* Profile Brief */}
                <div className="flex flex-col items-center">
                    <div className={cn(
                        "w-16 h-16 rounded-2xl mb-4 border-2 shadow-xl p-0.5",
                        tp.hex === '#ffffff' ? "border-slate-100" : "border-white/10"
                    )}>
                        <img
                            src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                            className="w-full h-full object-cover rounded-[0.8rem]"
                            alt=""
                        />
                    </div>
                    <div className="space-y-1 text-center">
                        <h1 className={cn(
                            "text-xl font-black tracking-tighter leading-none uppercase",
                            tp.text
                        )}>{profileData?.displayName || user.name || "KARDLY USER"}</h1>
                        <p className={cn("text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/5 rounded-full inline-block mt-1", tp.accentText)}>
                            {profileData?.occupation || user.occupation || "DİJİTAL UZMAN"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Side (Bottom in Portrait, Right in Landscape) */}
            <div className={cn(
                "relative z-10 w-full flex flex-col gap-2 max-w-[240px]",
                orientation === 'landscape' ? "justify-center" : ""
            )}>
                {[
                    { icon: Phone, value: profileData?.phone || user.phone, label: 'TELEFON' },
                    { icon: Mail, value: profileData?.email || user.email, label: 'E-POSTA' },
                    { icon: Globe, value: `kardly.site/${user.username}`, label: 'WEB PROFİL' }
                ].filter(item => item.value).map((item, idx) => (
                    <div key={idx} className={cn(
                        "flex items-center gap-3 p-2.5 rounded-2xl border",
                        tp.pattern.startsWith('elite_') ? "bg-white/[0.08] border-white/10 backdrop-blur-xl" : "bg-white/[0.03] border-white/5"
                    )}>
                        <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                            tp.accent,
                            "bg-opacity-10"
                        )}>
                            <item.icon size={12} className={tp.accentText} strokeWidth={3} />
                        </div>
                        <div className="min-w-0">
                            <span className={cn("block text-[7px] font-black uppercase tracking-widest opacity-30 mb-0.5", tp.text)}>{item.label}</span>
                            <span className={cn("block text-[10px] font-bold tracking-tight truncate", tp.text)}>{item.value}</span>
                        </div>
                    </div>
                ))}

                <div className="mt-4 opacity-20 text-center">
                    <span className={cn("text-[6px] font-black tracking-[0.4em] uppercase", tp.text)}>KARDLY • SİZİN İÇİN TASARLANDI</span>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 3s linear infinite;
                }
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
                    <div className={cn("absolute inset-2 blur-[60px] opacity-20 rounded-[2.5rem]", tp.accent)} />
                    {CardContent}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col items-center">
            {mode === 'selector' && (
                <div className="w-full mb-12">
                    {/* Tab Navigation */}
                    <div className="flex items-center justify-center p-1.5 bg-slate-900/50 backdrop-blur-xl rounded-[2rem] border border-white/5 mb-10 w-fit mx-auto shadow-2xl">
                        {(['Standard', 'Premium', 'Ultimate'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2",
                                    activeTab === tab
                                        ? "bg-primary text-white shadow-lg scale-105"
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

                    {/* Template Picker Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 justify-center px-4">
                        {TEMPLATES.filter(t => t.category === activeTab).map((tpl) => (
                            <button
                                key={tpl.id}
                                onClick={() => onSelect?.(tpl.id)}
                                className={cn(
                                    "relative w-full aspect-square rounded-2xl border-2 transition-all p-1.5 group/tpl overflow-hidden",
                                    internalSelectedTplId === tpl.id ? "border-primary ring-4 ring-primary/20 scale-105" : "border-white/5 hover:border-white/10"
                                )}
                            >
                                <div className="w-full h-full rounded-xl" style={{ background: tpl.hex }} />
                                {internalSelectedTplId === tpl.id && (
                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                        <Check size={16} className="text-white" strokeWidth={4} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Preview Component */}
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
                    <div className={cn("absolute inset-4 blur-[80px] opacity-10 rounded-[1.5rem]", tp.accent)} />
                    {CardContent}
                </div>
            </div>

            {/* Actions Bar */}
            <div className="w-full max-w-[340px] flex gap-3 mt-12 px-6 relative z-50">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-1 h-14 bg-primary text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : downloadSuccess ? <Check size={18} /> : <Download size={18} />}
                    {downloadSuccess ? 'GÖRSEL KAYDEDİLDİ' : 'TASARIMI İNDİR'}
                </button>
                <button
                    onClick={handleShare}
                    className="w-14 h-14 bg-white text-slate-900 rounded-[2rem] shadow-xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center"
                >
                    {shareSuccess ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
                </button>
            </div>

            <p className="mt-6 text-[8px] font-black opacity-20 uppercase tracking-[0.5em] text-slate-400">
                PORTRAIT MODE • v2.1
            </p>
        </div>
    )
}
