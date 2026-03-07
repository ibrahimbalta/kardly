"use client"

import React, { useRef, useState, useEffect } from 'react'
import QRCode from 'qrcode'
import * as htmlToImage from 'html-to-image'
import { Download, Share2, Check, RefreshCw, Phone, MapPin, Mail, Globe, MessageCircle, Star, Crown, Palette } from 'lucide-react'
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
    // Standard
    { id: 'minimal_white', name: 'Zen White', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-indigo-600', accentText: 'text-indigo-600', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'dots', category: 'Standard' },
    { id: 'modern_dark', name: 'Obsidian', bg: 'bg-slate-950', text: 'text-white', accent: 'bg-emerald-400', accentText: 'text-emerald-400', secondary: 'text-slate-400', hex: '#020617', pattern: 'grid', category: 'Standard' },
    { id: 'minimal_noir', name: 'Noir Luxe', bg: 'bg-neutral-900', text: 'text-neutral-100', accent: 'bg-white', accentText: 'text-white', secondary: 'text-neutral-500', hex: '#171717', pattern: 'lines', category: 'Standard' },
    { id: 'standard_waves', name: 'Soft Waves', bg: 'bg-indigo-50', text: 'text-indigo-950', accent: 'bg-indigo-500', accentText: 'text-indigo-500', secondary: 'text-indigo-700/60', hex: '#eef2ff', pattern: 'waves', category: 'Standard' },

    // Premium
    { id: 'vibe_wave', name: 'Vibe Wave', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#e67e22]', accentText: 'text-[#e67e22]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#24292e' },
    { id: 'vibe_wave_blue', name: 'Wave Ocean', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#2563eb]', accentText: 'text-[#2563eb]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#1e3a5f' },
    { id: 'vibe_wave_emerald', name: 'Wave Emerald', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#059669]', accentText: 'text-[#059669]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#064e3b' },
    { id: 'vibe_wave_purple', name: 'Wave Royal', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#7c3aed]', accentText: 'text-[#7c3aed]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#2e1065' },
    { id: 'vibe_wave_ruby', name: 'Wave Ruby', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#dc2626]', accentText: 'text-[#dc2626]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#7f1d1d' },
    { id: 'vibe_wave_teal', name: 'Wave Teal', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#0d9488]', accentText: 'text-[#0d9488]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#134e4a' },
    { id: 'vibe_wave_rose', name: 'Wave Rosé', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#e11d48]', accentText: 'text-[#e11d48]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#4c0519' },
    { id: 'vibe_wave_midnight', name: 'Wave Midnight', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#06b6d4]', accentText: 'text-[#06b6d4]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#0f172a' },
    { id: 'vibe_wave_forest', name: 'Wave Forest', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#84cc16]', accentText: 'text-[#84cc16]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#14532d' },
    { id: 'vibe_wave_gold', name: 'Wave Gold', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#d4af37]', accentText: 'text-[#d4af37]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#000000' },
    { id: 'vibe_wave_slate', name: 'Wave Slate', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#64748b]', accentText: 'text-[#64748b]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#334155' },
    { id: 'vibe_wave_sunset', name: 'Wave Sunset', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#f97316]', accentText: 'text-[#f97316]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#4c1d95' },
    { id: 'vibe_wave_neon', name: 'Wave Neon', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#a3e635]', accentText: 'text-[#a3e635]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#0a0a0a' },
    { id: 'vibe_geometric', name: 'Vibe Geometric', bg: 'bg-[#1a1a1a]', text: 'text-white', accent: 'bg-[#e67e22]', accentText: 'text-[#e67e22]', secondary: 'text-slate-300', hex: '#1a1a1a', pattern: 'vibe_geo', category: 'Premium' },
    { id: 'vibe_elegant', name: 'Vibe Elegant', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#e67e22]', accentText: 'text-[#e67e22]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_elegant', category: 'Premium' },
    { id: 'premium_glass', name: 'Glass Frost', bg: 'bg-white/10', text: 'text-white', accent: 'bg-blue-400', accentText: 'text-[#60a5fa]', secondary: 'text-white/40', hex: '#1e293b', pattern: 'glass', category: 'Premium' },
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
                    color: { dark: '#000000', light: '#ffffff' }
                })
                setQrDataUrl(url)
            } catch (err) {
                console.error('QR Generate Error:', err)
            }
        }
        generateQr()
    }, [profileUrl])

    // ALWAYS portrait: 340x600
    const cardWidth = 340
    const cardHeight = 600
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
                backgroundColor: tp.hex,
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

    const locationData = (profileData?.socialLinks as any[])?.find((l: any) => l.platform?.toLowerCase() === 'location')?.url || profileData?.location || ""
    const whatsappData = (profileData?.socialLinks as any[])?.find((l: any) => l.platform?.toLowerCase() === 'whatsapp')?.url || ""

    /* ─── CARD CONTENT (always portrait / vertical) ─── */
    const CardContent = (
        <div
            ref={cardRef}
            data-card-actual
            className={cn(
                "flex flex-col overflow-hidden relative shadow-2xl",
                tp.bg,
                "rounded-[2.5rem]"
            )}
            style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                border: tp.hex === '#ffffff' ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.05)'
            }}
        >
            {/* Background Graphics */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {tp.pattern === 'dots' && (
                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `radial-gradient(${tp.hex === '#ffffff' ? '#94a3b8' : '#fff'} 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
                )}
                {tp.pattern === 'grid' && (
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(${tp.hex === '#ffffff' ? '#94a3b8' : '#fff'} 1px, transparent 1px), linear-gradient(90deg, ${tp.hex === '#ffffff' ? '#94a3b8' : '#fff'} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                )}
                {tp.pattern === 'lines' && (
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 40px)` }} />
                )}
                {tp.pattern === 'waves' && (
                    <svg className="absolute bottom-0 left-0 w-full opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill={tp.hex === '#ffffff' ? '#6366f1' : '#fff'} d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,138.7C960,160,1056,224,1152,240C1248,256,1344,224,1392,208L1440,192L1440,320L0,320Z"></path></svg>
                )}
                {tp.pattern === 'luxury' && (
                    <>
                        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full" />
                    </>
                )}
                {tp.pattern === 'nebula' && (
                    <>
                        <div className="absolute top-[-20%] right-[-20%] w-full h-full bg-purple-600/15 blur-[120px] rounded-full" />
                        <div className="absolute bottom-[-20%] left-[-20%] w-full h-full bg-indigo-600/15 blur-[120px] rounded-full" />
                    </>
                )}
                {tp.pattern === 'elite_spatial' && (
                    <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.12)_0%,transparent_70%)]" />
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    </>
                )}
                {tp.pattern === 'elite_cyber' && (
                    <>
                        <div className="absolute inset-0 bg-[#0a0a0a]" />
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#f0f 1px, transparent 1px), linear-gradient(90deg, #f0f 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(192,38,211,0.15)_0%,transparent_70%)]" />
                    </>
                )}
                {tp.pattern === 'elite_royal' && (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b0b] to-[#0a0a0a]" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                        <div className="absolute top-[-10%] right-[-10%] w-60 h-60 bg-amber-500/5 blur-[80px] rounded-full" />
                    </>
                )}
                {tp.pattern === 'aurora' && (
                    <>
                        <div className="absolute inset-0 bg-[#050510]" />
                        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[60%] opacity-30 blur-[80px]" style={{ background: 'radial-gradient(circle at 30% 30%, #4facfe 0%, transparent 40%), radial-gradient(circle at 70% 60%, #00f2fe 0%, transparent 40%)' }} />
                    </>
                )}
                {tp.pattern === 'mesh' && (
                    <div className="absolute inset-0 opacity-[0.12] blur-[60px]" style={{ background: 'radial-gradient(circle at 20% 20%, #f0f 0%, transparent 50%), radial-gradient(circle at 80% 80%, #0ff 0%, transparent 50%)' }} />
                )}
                {tp.pattern === 'frosty' && (
                    <>
                        <div className="absolute inset-0 bg-[#0f172a]" />
                        <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-blue-500/15 blur-[100px] rounded-full" />
                        <div className="absolute bottom-[20%] left-[-10%] w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full" />
                    </>
                )}
                {tp.pattern === 'glass' && (
                    <>
                        <div className="absolute inset-0 bg-[#1e293b]" />
                        <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-blue-500/15 blur-[80px] rounded-full" />
                        <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] bg-indigo-500/10 blur-[80px] rounded-full" />
                    </>
                )}
                {tp.pattern === 'vibe_wave' && (
                    <>
                        <div className="absolute top-0 left-0 w-full h-[40%]" style={{ backgroundColor: (tp as any).waveColor || '#24292e' }} />
                        <svg className="absolute top-[35%] left-0 w-full h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <path fill={(tp as any).waveColor || '#24292e'} d="M0,160L80,181.3C160,203,320,245,480,245.3C640,245,800,203,960,176C1120,149,1280,139,1360,133.3L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
                        </svg>
                    </>
                )}
                {tp.pattern === 'vibe_geo' && (
                    <>
                        <div className="absolute inset-0 bg-[#0a0a0a]" />
                        <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#e67e22]/15 rounded-full blur-[60px]" />
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#e67e22]/10 rounded-full blur-[60px]" />
                    </>
                )}
                {tp.pattern === 'vibe_elegant' && (
                    <>
                        <div className="absolute top-0 left-0 w-full h-6 bg-[#e67e22]" />
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-[#e67e22]" />
                    </>
                )}
            </div>

            {/* Card Inner Content (Portrait) */}
            <div className="flex-1 p-6 flex flex-col relative z-20 items-center text-center justify-between">
                {/* QR Code Top Section */}
                <div className="flex items-center justify-center pt-4 mb-6">
                    <div className="p-3.5 bg-white shadow-2xl rounded-[1.5rem] ring-[6px] ring-white/10">
                        {qrDataUrl ? (
                            <img src={qrDataUrl} alt="QR Code" className="w-[90px] h-[90px]" />
                        ) : (
                            <div className="w-[90px] h-[90px] animate-pulse bg-slate-50 rounded-xl flex items-center justify-center">
                                <RefreshCw className="animate-spin text-slate-200" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-center mb-6">
                    <div className={cn(
                        "w-20 h-20 rounded-2xl overflow-hidden shadow-2xl mb-4 border-2 ring-4 ring-white/5",
                        tp.hex === '#ffffff' ? "border-slate-200" : "border-white/15"
                    )}>
                        <img
                            src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=128`}
                            className="w-full h-full object-cover"
                            alt=""
                        />
                    </div>
                    <h1 className={cn(
                        "text-xl font-black tracking-tighter leading-none uppercase mb-2",
                        tp.text
                    )}>{profileData?.displayName || user.name || "KARDLY USER"}</h1>
                    <p className={cn(
                        "text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-white/5 rounded-full",
                        tp.accentText
                    )}>
                        {profileData?.occupation || user.occupation || "DİJİTAL UZMAN"}
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="w-full space-y-2.5 mt-auto">
                    {[
                        { icon: Phone, value: profileData?.phone || user.phone, label: 'TELEFON' },
                        { icon: Mail, value: profileData?.email || user.email, label: 'E-POSTA' },
                        { icon: Globe, value: `kardly.site/${user.username}`, label: 'WEB PROFİL' }
                    ].filter(item => item.value).map((item, idx) => (
                        <div key={idx} className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all",
                            tp.hex === '#ffffff'
                                ? "bg-slate-50 border-slate-100"
                                : tp.category === 'Ultimate'
                                    ? "bg-white/[0.06] border-white/[0.08] backdrop-blur-xl"
                                    : "bg-white/[0.03] border-white/[0.05]"
                        )}>
                            <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                                tp.hex === '#ffffff' ? "bg-indigo-50" : "bg-white/10"
                            )}>
                                <item.icon size={13} className={tp.accentText} strokeWidth={2.5} />
                            </div>
                            <div className="text-left min-w-0">
                                <span className={cn("block text-[7px] font-black uppercase tracking-widest opacity-30 mb-0.5", tp.text)}>{item.label}</span>
                                <span className={cn("block text-[10px] font-bold tracking-tight truncate", tp.text)}>{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Branding */}
                <div className="mt-5 opacity-20">
                    <span className={cn("text-[6px] font-black tracking-[0.5em] uppercase", tp.text)}>KARDLY • PREMIUM</span>
                </div>
            </div>
        </div>
    )

    /* ─── MODAL MODE (Profile Page) ─── */
    if (mode === 'modal') {
        return (
            <div className="w-full flex flex-col items-center">
                <div className="relative" style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}>
                    <div className={cn("absolute inset-4 blur-[80px] opacity-15 rounded-[2.5rem]", tp.accent)} />
                    {CardContent}
                </div>
            </div>
        )
    }

    /* ─── SELECTOR MODE (Dashboard) ─── */
    return (
        <div className="w-full flex flex-col items-center">
            {mode === 'selector' && (
                <div className="w-full mb-12 bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/5 shadow-2xl">
                    <div className="flex flex-col gap-8">
                        {/* Category Tabs */}
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

                        {/* Template Picker */}
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 justify-center">
                            {TEMPLATES.filter(t => t.category === activeTab).map((tpl) => (
                                <button
                                    key={tpl.id}
                                    onClick={() => onSelect?.(tpl.id)}
                                    className={cn(
                                        "relative aspect-square rounded-2xl border-2 transition-all p-1.5 overflow-hidden",
                                        internalSelectedTplId === tpl.id
                                            ? "border-primary ring-4 ring-primary/20 scale-110 shadow-xl shadow-primary/20"
                                            : "border-white/5 hover:border-white/10 hover:scale-105"
                                    )}
                                >
                                    <div className="w-full h-full rounded-xl overflow-hidden" style={{ background: (tpl as any).waveColor || tpl.hex }}>
                                        {tpl.pattern === 'vibe_wave' && (
                                            <div className="w-full h-[55%]" style={{ backgroundColor: (tpl as any).waveColor || '#24292e' }} />
                                        )}
                                    </div>
                                    {internalSelectedTplId === tpl.id && (
                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-2xl">
                                            <Check size={20} className="text-white" strokeWidth={5} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Card Preview */}
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

            {/* Download & Share Buttons */}
            <div className="w-full max-w-[340px] flex gap-4 mt-12 relative z-50">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-1 h-16 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {isDownloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : downloadSuccess ? <Check size={20} /> : <Download size={20} />}
                    {downloadSuccess ? 'KAYDEDİLDİ ✓' : 'TASARIMI İNDİR'}
                </button>
                <button
                    onClick={handleShare}
                    className="w-16 h-16 bg-white text-slate-900 rounded-full shadow-xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center"
                >
                    {shareSuccess ? <Check size={20} className="text-emerald-500" /> : <Share2 size={20} />}
                </button>
            </div>
        </div>
    )
}
