"use client"

import React, { useRef, useState, useEffect } from 'react'
import QRCode from 'qrcode'
import * as htmlToImage from 'html-to-image'
import { Download, Share2, Check, RefreshCw, Phone, MapPin, Mail, Globe, MessageCircle, Star, Crown, Palette, Zap } from 'lucide-react'
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

export const TEMPLATES = [
    // Standard - Upgraded with premium vibes
    { id: 'minimal_white', name: 'Alabaster', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#6366f1]', accentText: 'text-[#6366f1]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'mesh_standard', category: 'Standard', colors: ['#f8fafc', '#eff6ff', '#f5f3ff'] },
    { id: 'modern_dark', name: 'Midnight', bg: 'bg-[#030712]', text: 'text-white', accent: 'bg-[#10b981]', accentText: 'text-[#10b981]', secondary: 'text-slate-400', hex: '#030712', pattern: 'mesh_standard', category: 'Standard', colors: ['#030712', '#0f172a', '#1e1b4b'] },
    { id: 'minimal_noir', name: 'Slate Matte', bg: 'bg-[#0a0a0a]', text: 'text-neutral-100', accent: 'bg-white', accentText: 'text-white', secondary: 'text-neutral-500', hex: '#0a0a0a', pattern: 'grid_subtle', category: 'Standard' },
    { id: 'standard_waves', name: 'Azure Flow', bg: 'bg-[#f0f9ff]', text: 'text-[#0c4a6e]', accent: 'bg-[#0ea5e9]', accentText: 'text-[#0ea5e9]', secondary: 'text-[#0284c7]/60', hex: '#f0f9ff', pattern: 'waves_layered', category: 'Standard', colors: ['#e0f2fe', '#bae6fd', '#7dd3fc'] },

    // Premium - Enhanced with Mesh & Gradients
    { id: 'vibe_wave', name: 'Sunset Vibe', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#f59e0b]', accentText: 'text-[#f59e0b]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_gradient_wave', category: 'Premium', colors: ['#f59e0b', '#ef4444', '#7c3aed'], waveColor: '#1e293b' },
    { id: 'vibe_wave_blue', name: 'Oceanic', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#3b82f6]', accentText: 'text-[#3b82f6]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_gradient_wave', category: 'Premium', colors: ['#3b82f6', '#06b6d4', '#2563eb'], waveColor: '#0f172a' },
    { id: 'vibe_wave_purple', name: 'Royal Velvet', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#8b5cf6]', accentText: 'text-[#8b5cf6]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_gradient_wave', category: 'Premium', colors: ['#8b5cf6', '#d946ef', '#6366f1'], waveColor: '#2e1065' },
    { id: 'premium_glass', name: 'Ethereal Glass', bg: 'bg-white/10', text: 'text-white', accent: 'bg-[#60a5fa]', accentText: 'text-[#60a5fa]', secondary: 'text-white/40', hex: '#0f172a', pattern: 'mesh_prism', category: 'Premium', colors: ['#1e3a8a', '#3b82f6', '#9333ea'] },
    { id: 'premium_luxury', name: 'Royal Gold', bg: 'bg-[#050505]', text: 'text-[#fef3c7]', accent: 'bg-[#d97706]', accentText: 'text-[#fbbf24]', secondary: 'text-[#d97706]/20', hex: '#050505', pattern: 'luxury_refined', category: 'Premium', colors: ['#050505', '#1a0b0b', '#422006'] },

    // Ultimate (Elite) - Pushing the boundaries
    { id: 'elite_aurora', name: 'Aurora Borealis', bg: 'bg-[#020617]', text: 'text-white', accent: 'bg-[#22d3ee]', accentText: 'text-[#22d3ee]', colors: ['#4facfe', '#00f2fe', '#89f7fe'], animate: true, hex: '#020617', pattern: 'elite_aurora_3d', category: 'Ultimate' },
    { id: 'elite_spatial', name: 'Cosmos Pro', bg: 'bg-[#050510]', text: 'text-white', accent: 'bg-[#3b82f6]', accentText: 'text-[#3b82f6]', colors: ['#1e3a8a', '#3b82f6', '#0ea5e9'], animate: true, hex: '#050510', pattern: 'elite_spatial_refined', category: 'Ultimate' },
    { id: 'elite_cyber', name: 'Neo Cyber', bg: 'bg-black', text: 'text-white', accent: 'bg-[#f43f5e]', accentText: 'text-[#f43f5e]', colors: ['#f43f5e', '#8b5cf6', '#000000'], animate: true, hex: '#000000', pattern: 'elite_cyber_glitch_3d', category: 'Ultimate' },
    { id: 'elite_mesh', name: 'Holographic', bg: 'bg-black', text: 'text-white', accent: 'bg-[#d946ef]', accentText: 'text-[#d946ef]', colors: ['#d946ef', '#06b6d4', '#8b5cf6'], animate: true, hex: '#000000', pattern: 'elite_mesh_complex', category: 'Ultimate' },

    // Extraordinary - Visual Masterpieces
    { id: 'extra_3d_glass', name: 'Diamond Glass', bg: 'bg-[#0f172a]', text: 'text-white', accent: 'bg-[#38bdf8]', accentText: 'text-[#38bdf8]', colors: ['#0ea5e9', '#6366f1', '#a855f7'], animate: true, hex: '#0f172a', pattern: 'extra_glass_diamond', category: 'Extraordinary' },
    { id: 'extra_liquid_mercury', name: 'Chrome Flow', bg: 'bg-[#09090b]', text: 'text-white', accent: 'bg-[#d4d4d8]', accentText: 'text-[#d4d4d8]', colors: ['#27272a', '#52525b', '#e4e4e7'], animate: true, hex: '#09090b', pattern: 'extra_chrome_3d', category: 'Extraordinary' },
    { id: 'extra_magma_stone', name: 'Volcanic Rift', bg: 'bg-[#0c0a09]', text: 'text-[#fff7ed]', accent: 'bg-[#ea580c]', accentText: 'text-[#fb923c]', colors: ['#431407', '#9a3412', '#ea580c'], animate: true, hex: '#0c0a09', pattern: 'extra_magma_refined', category: 'Extraordinary' },
    { id: 'extra_pearl_iris', name: 'Opaline', bg: 'bg-white', text: 'text-[#0f172a]', accent: 'bg-[#a78bfa]', accentText: 'text-[#8b5cf6]', colors: ['#fdf4ff', '#f0f9ff', '#fff1f2'], animate: true, hex: '#ffffff', pattern: 'extra_opal_3d', category: 'Extraordinary' }
]

export default function BusinessCardGenerator({ user, profileData, mode = 'full', selectedTemplateId, orientation = 'portrait', onSelect, onOrientationChange }: BusinessCardGeneratorProps) {
    const { t } = useTranslation()
    const cardRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(500)
    const [internalSelectedTplId, setInternalSelectedTplId] = useState(selectedTemplateId || TEMPLATES[0].id)
    const [qrDataUrl, setQrDataUrl] = useState<string>('')
    const [activeTab, setActiveTab] = useState<'Standard' | 'Premium' | 'Ultimate' | 'Extraordinary'>('Extraordinary')

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
        if (!cardRef.current || isSharing) return
        setIsSharing(true)
        try {
            // Generate PNG for better transparency support and compatibility
            const dataUrl = await htmlToImage.toPng(cardRef.current, {
                pixelRatio: 2,
                backgroundColor: tp.hex,
                cacheBust: true,
            })

            // Convert dataUrl to File object manually (safer than fetch for base64)
            const [header, base64Data] = dataUrl.split(',')
            const mime = header.match(/:(.*?);/)?.[1] || 'image/png'
            const binary = atob(base64Data)
            const array = new Uint8Array(binary.length)
            for (let i = 0; i < binary.length; i++) {
                array[i] = binary.charCodeAt(i)
            }
            const blob = new Blob([array], { type: mime })
            const file = new File([blob], `kardly-card.png`, { type: mime })

            // Check if file sharing is supported
            const shareData = {
                files: [file],
                title: user.name,
                text: `${user.name} - Kardly Dijital Kartvizit`,
            }

            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData)
            } else if (navigator.share) {
                // Fallback to link sharing if file sharing is not supported
                await navigator.share({
                    title: user.name,
                    text: `${user.name} - Kardly Dijital Kartvizit`,
                    url: profileUrl
                })
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(profileUrl)
                setShareSuccess(true)
                setTimeout(() => setShareSuccess(false), 2000)
            }
        } catch (error) {
            console.error('Sharing failed', error)
            // Final fallback to link sharing on error
            if (navigator.share) {
                try { await navigator.share({ title: user.name, url: profileUrl }) } catch(e) {}
            }
        } finally {
            setIsSharing(false)
        }
    }

    const locationData = (profileData?.socialLinks as any[])?.find((l: any) => l.platform?.toLowerCase() === 'location')?.url || profileData?.location || ""
    const whatsappData = (profileData?.socialLinks as any[])?.find((l: any) => l.platform?.toLowerCase() === 'whatsapp')?.url || ""

    /* ÔöÇÔöÇÔöÇ CARD CONTENT (always portrait / vertical) ÔöÇÔöÇÔöÇ */
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
                backgroundColor: tp.hex,
                border: tp.hex === '#ffffff' ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.05)'
            }}
        >
            {/* Background Graphics */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* 1. MESH & DYNAMIC GRADIENTS (Standard & Premium Upgrade) */}
                {(tp.pattern?.includes('mesh') || tp.pattern === 'waves_layered') && (
                    <div className="absolute inset-0 opacity-40 blur-[120px] animate-elite-bg">
                        <div className="absolute top-[-20%] left-[-20%] w-full h-full rounded-full opacity-60" style={{ backgroundColor: tp.colors?.[0] || 'rgba(99,102,241,0.2)' }} />
                        <div className="absolute bottom-[-20%] right-[-20%] w-full h-full rounded-full opacity-40" style={{ backgroundColor: tp.colors?.[1] || 'rgba(244,63,94,0.1)' }} />
                        {tp.colors?.[2] && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full opacity-30" style={{ backgroundColor: tp.colors[2] }} />}
                    </div>
                )}

                {/* 2. SPECIFIC SVG OVERLAYS */}
                {tp.pattern === 'grid_subtle' && (
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(${tp.hex === '#ffffff' ? '#000' : '#fff'} 1px, transparent 1px), linear-gradient(90deg, ${tp.hex === '#ffffff' ? '#000' : '#fff'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                )}
                {tp.pattern?.includes('wave') && (
                    <div className="absolute inset-0 overflow-hidden">
                        {(tp.pattern === 'vibe_gradient_wave' || tp.pattern === 'vibe_wave') && (
                            <div className="absolute top-0 left-0 w-full h-[42%] shadow-2xl" style={{ background: tp.colors ? `linear-gradient(135deg, ${tp.colors[0]}, ${tp.colors[1]})` : ((tp as any).waveColor || '#24292e') }} />
                        )}
                        <svg className="absolute top-[38%] left-0 w-full h-32" viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <path fill={tp.colors?.[1] || (tp as any).waveColor || '#fff'} d="M0,160L80,181.3C160,203,320,245,480,245.3C640,245,800,203,960,176C1120,149,1280,139,1360,133.3L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
                        </svg>
                    </div>
                )}

                {/* 3. LUXURY & ELITE REFINED PATTERNS */}
                {tp.pattern?.includes('luxury') && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#1a0b0b] to-black">
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(217,119,6,0.15)_0%,transparent_50%)] animate-pulse" />
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#fbbf24 0.5px, transparent 0.5px)`, backgroundSize: '20px 20px' }} />
                    </div>
                )}

                {/* 4. ADVANCED ELITE & EXTRAORDINARY EFFECTS (Layered 3D) */}
                {(tp.pattern?.includes('elite_') || tp.pattern?.includes('extra_')) && (
                    <div className="absolute inset-0">
                        {/* Dynamic 3D Highlights */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-black/20" />
                        
                        {/* Shimmering Elements */}
                        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] animate-rotate-slow opacity-20" style={{ background: `conic-gradient(from 0deg at 50% 50%, transparent, ${tp.colors?.[0] || tp.hex}, transparent)` }} />
                        
                        {/* Noise Texture for Depth */}
                        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
                        
                        {/* Specific Extraordinary Enhancements */}
                        {tp.pattern?.includes('glass') && <div className="absolute inset-0 backdrop-blur-[1px] border border-white/10" />}
                        {tp.pattern?.includes('chrome') && <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/40" />}
                    </div>
                )}

                {/* Common Texture Overlay for all tiers */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
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
                    <span className={cn("text-[6px] font-black tracking-[0.5em] uppercase", tp.text)}>KARDLY · PREMIUM</span>
                </div>
            </div>
        </div>
    )

    /* ÔöÇÔöÇÔöÇ MODAL MODE (Profile Page) ÔöÇÔöÇÔöÇ */
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

    /* ÔöÇÔöÇÔöÇ SELECTOR MODE (Dashboard) ÔöÇÔöÇÔöÇ */
    return (
        <div className="w-full flex flex-col items-center">
            {mode === 'selector' && (
                <div className="w-full mb-12 bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/5 shadow-2xl">
                    <div className="flex flex-col gap-8">
                        {/* Category Tabs */}
                        <div className="max-w-full overflow-x-auto no-scrollbar py-2">
                            <div className="flex bg-slate-950/50 p-1 rounded-full border border-white/5 w-fit mx-auto shadow-inner whitespace-nowrap">
                                {(['Standard', 'Premium', 'Ultimate', 'Extraordinary'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "px-4 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-widest flex items-center gap-2",
                                            activeTab === tab
                                                ? "bg-primary text-white shadow-xl scale-105"
                                                : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        {tab === 'Standard' && <Palette size={14} />}
                                        {tab === 'Premium' && <Star size={14} />}
                                        {tab === 'Ultimate' && <Crown size={14} />}
                                        {tab === 'Extraordinary' && <Zap size={14} />}
                                        {tab === 'Extraordinary' ? 'Sıradışı' : tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Template Picker */}
                        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 sm:gap-4 justify-center">
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
                                    <div className="w-full h-full rounded-xl overflow-hidden relative" style={{
                                        background: tpl.category === 'Ultimate' && tpl.colors
                                            ? `linear-gradient(135deg, ${tpl.colors[0]}, ${tpl.colors[1] || tpl.colors[0]})`
                                            : ((tpl as any).waveColor || tpl.hex)
                                    }}>
                                        {tpl.pattern === 'vibe_wave' && (
                                            <div className="w-full h-[55%]" style={{ backgroundColor: (tpl as any).waveColor || '#24292e' }} />
                                        )}
                                        {tpl.category === 'Ultimate' && (
                                            <>
                                                <div className="absolute inset-0 opacity-20 animate-pulse bg-white/10" />
                                                <svg className="absolute -left-[50%] top-0 w-[150%] h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                    <path d="M0,0 C60,10 60,90 0,100 L100,100 L100,0 Z" fill="rgba(0,0,0,0.2)" />
                                                </svg>
                                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '6px 6px' }} />
                                            </>
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

            {/* Download & Share Buttons - Professional Redesign */}
            <div className="w-full max-w-[400px] flex gap-4 mt-16 relative z-50">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-[2.5] relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-rose-500 to-primary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative h-16 bg-slate-950 rounded-2xl flex items-center justify-center gap-3 overflow-hidden border border-white/10 transition-all active:scale-95">
                        {/* Animated Background Shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        
                        {isDownloading ? (
                            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                        ) : downloadSuccess ? (
                            <Check size={20} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        ) : (
                            <Download size={20} className="text-white group-hover:-translate-y-1 transition-transform duration-300" />
                        )}
                        
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-white font-black text-[11px] uppercase tracking-[0.2em]">
                                {downloadSuccess ? 'BAŞARIYLA KAYDEDİLDİ' : 'TASARIMI İNDİR'}
                            </span>
                            <span className="text-white/30 text-[8px] uppercase tracking-widest mt-1 font-medium group-hover:text-white/50 transition-colors">
                                Yüksek Kaliteli Görsel (PNG)
                            </span>
                        </div>
                    </div>
                </button>

                <button
                    onClick={handleShare}
                    className="flex-1 relative group"
                >
                    <div className="absolute -inset-1 bg-white/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative h-16 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center transition-all group-hover:bg-white/[0.08] active:scale-90 shadow-2xl">
                        {shareSuccess ? (
                            <Check size={22} className="text-emerald-400" />
                        ) : (
                            <Share2 size={22} className="text-white/70 group-hover:text-white group-hover:rotate-12 transition-all" />
                        )}
                    </div>
                </button>
            </div>

            {/* Local Styles for Elite Background Animations */}
            <style jsx>{`
                @keyframes aurora-flow {
                    0% { background-position: 0% 50%; opacity: 0.4; transform: scale(1); }
                    50% { background-position: 100% 50%; opacity: 0.6; transform: scale(1.1); }
                    100% { background-position: 0% 50%; opacity: 0.4; transform: scale(1); }
                }
                @keyframes floating {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(2px, 5px) rotate(0.5deg); }
                    66% { transform: translate(-3px, 2px) rotate(-0.5deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
                @keyframes rotate-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes glitch-line {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(600px); }
                }
                @keyframes matrix-rain {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(600px); opacity: 0; }
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                .animate-elite-bg {
                    background-size: 200% 200%;
                    animation: aurora-flow 12s ease-in-out infinite;
                }
                .animate-floating {
                    animation: floating 8s ease-in-out infinite;
                }
                .animate-rotate-slow {
                    animation: rotate-slow 20s linear infinite;
                }
                .animate-glitch-line {
                    animation: glitch-line 3s linear infinite;
                }
                .animate-matrix-rain {
                    animation: matrix-rain 3s linear infinite;
                }
            `}</style>
        </div>
    )
}
