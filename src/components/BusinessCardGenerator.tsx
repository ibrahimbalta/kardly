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

    // Premium
    { id: 'vibe_wave', name: 'Vibe Wave', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#e67e22]', accentText: '#e67e22', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium' },
    { id: 'vibe_geometric', name: 'Vibe Geometric', bg: 'bg-[#1a1a1a]', text: 'text-white', accent: 'bg-[#e67e22]', accentText: '#e67e22', secondary: 'text-slate-300', hex: '#1a1a1a', pattern: 'vibe_geo', category: 'Premium' },
    { id: 'vibe_elegant', name: 'Vibe Elegant', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#e67e22]', accentText: '#e67e22', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_elegant', category: 'Premium' },

    // Ultimate (Elite)
    { id: 'elite_aurora', name: 'Aurora', bg: 'bg-[#050510]', text: 'text-white', accent: 'bg-cyan-500', accentText: '#22d3ee', secondary: 'text-slate-400', hex: '#050510', pattern: 'aurora', category: 'Ultimate' },
    { id: 'elite_mesh', name: 'Mesh Prism', bg: 'bg-black', text: 'text-white', accent: 'bg-fuchsia-600', accentText: '#d946ef', secondary: 'text-fuchsia-200/40', hex: '#000000', pattern: 'mesh', category: 'Ultimate' },
    { id: 'elite_glass', name: 'Frosty Glass', bg: 'bg-slate-900', text: 'text-white', accent: 'bg-blue-500', accentText: '#3b82f6', secondary: 'text-blue-100/40', hex: '#0f172a', pattern: 'frosty', category: 'Ultimate' },
    { id: 'elite_royal', name: 'Elite Royal', bg: 'bg-[#1a0b0b]', text: 'text-amber-100', accent: 'bg-amber-600', accentText: '#d97706', secondary: 'text-amber-200/40', hex: '#1a0b0b', pattern: 'elite_royal', category: 'Ultimate' }
]

export default function BusinessCardGenerator({ user, profileData, mode = 'full', selectedTemplateId, orientation = 'portrait', onSelect, onOrientationChange }: BusinessCardGeneratorProps) {
    const { t } = useTranslation()
    const cardRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(500)
    const [internalSelectedTpl, setInternalSelectedTpl] = useState(TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0])
    const [qrDataUrl, setQrDataUrl] = useState<string>('')
    const [activeTab, setActiveTab] = useState<'Standard' | 'Premium' | 'Ultimate'>('Ultimate')

    useEffect(() => {
        if (selectedTemplateId) {
            const tpl = TEMPLATES.find(t => t.id === selectedTemplateId)
            if (tpl) {
                setInternalSelectedTpl(tpl)
                setActiveTab(tpl.category as any)
            }
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
    const cardWidth = 320
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
            alert('İndirme hatası. Tarayıcı uyumsuzluğu olabilir.')
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

    const tp = internalSelectedTpl

    const locationData = profileData?.socialLinks?.find((l: any) => l.platform.toLowerCase() === 'location')?.url || profileData?.location || ""
    const whatsappData = profileData?.socialLinks?.find((l: any) => l.platform.toLowerCase() === 'whatsapp')?.url || ""

    const CardContent = (
        <div ref={cardRef} data-card-actual className={cn(
            "flex flex-col overflow-hidden relative group/card",
            tp.bg
        )} style={{
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            borderRadius: mode === 'modal' ? '2.5rem' : '1.5rem',
        }}>

            {/* Premium Background Graphics */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {tp.pattern === 'grid' && (
                    <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: `linear-gradient(${tp.accentText} 1px, transparent 1px), linear-gradient(90deg, ${tp.accentText} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                )}
                {tp.pattern === 'dots' && (
                    <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `radial-gradient(${tp.accentText} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                )}
                {tp.pattern === 'luxury' && (
                    <>
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23d4af37' fill-opacity='0.4'/%3E%3C/svg%3E")` }} />
                    </>
                )}
                {tp.pattern === 'waves' && (
                    <>
                        <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{ background: `radial-gradient(circle at 0% 0%, ${tp.accentText}33 0%, transparent 60%), radial-gradient(circle at 100% 100%, #000 0%, transparent 60%)` }} />
                        <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill={tp.hex === '#ffffff' ? '#000' : '#fff'} d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,138.7C960,160,1056,224,1152,240C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
                    </>
                )}
                {tp.pattern === 'layered' && (
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-2/5 opacity-10" style={{ background: tp.hex === '#ffffff' ? '#000' : tp.accentText, maskImage: 'linear-gradient(to bottom, black, transparent)' }} />
                        <div className="absolute bottom-0 right-0 w-full h-1/4 opacity-10" style={{ background: tp.accentText, maskImage: 'linear-gradient(to top, black, transparent)' }} />
                    </div>
                )}
                {tp.pattern === 'cyber' && (
                    <>
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#111_0%,_#000_100%)]" />
                        <div className="absolute top-0 left-0 w-full h-px bg-cyan-400 opacity-50 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                        <div className="absolute bottom-0 right-0 w-full h-px bg-fuchsia-500 opacity-50 shadow-[0_0_15px_rgba(192,38,211,0.5)]" />
                        <div className="absolute -left-20 top-40 w-60 h-px bg-cyan-400 rotate-45 opacity-20" />
                        <div className="absolute -right-20 bottom-40 w-60 h-px bg-fuchsia-500 rotate-45 opacity-20" />
                    </>
                )}
                {tp.pattern === 'leaf' && (
                    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 C70 30 70 70 50 100 C30 70 30 30 50 0' fill='none' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }} />
                )}
                {tp.pattern === 'glass' && (
                    <>
                        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-500/20 blur-[80px] rounded-full" />
                        <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-indigo-500/10 blur-[80px] rounded-full" />
                    </>
                )}
                {tp.pattern === 'tech' && (
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%)`, backgroundSize: '40px 40px' }} />
                )}
                {tp.pattern === 'sunset' && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#f9731633_0%,_transparent_50%),_radial-gradient(circle_at_100%_100%,_#3b120c_0%,_#000_100%)]" />
                )}
                {tp.pattern === 'lines' && (
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 40px)` }} />
                )}
                {tp.pattern === 'nebula' && (
                    <>
                        <div className="absolute inset-0 bg-[#000]" />
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 blur-[100px] rounded-full" />
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")` }} />
                    </>
                )}
                {tp.pattern === 'elite_spatial' && (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#050510] via-[#0a0a20] to-[#050510]" />
                        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,_rgba(34,211,238,0.08)_0%,_transparent_50%)] animate-pulse" />
                        <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full" />
                        <div className="absolute bottom-[20%] left-[-10%] w-72 h-72 bg-blue-600/10 blur-[90px] rounded-full" />
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
                    </>
                )}
                {tp.pattern === 'elite_cyber' && (
                    <>
                        <div className="absolute inset-0 bg-black" />
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(rgba(255,0,255,0.1) 1px, transparent 1px)`, backgroundSize: '100% 4px' }} />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(192,38,211,0.15)_0%,_transparent_70%)]" />
                        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: `linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-fuchsia-500/30 blur-sm animate-scan" />
                    </>
                )}
                {tp.pattern === 'elite_royal' && (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b0b] to-[#0a0a0a]" />
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l2.5 15h15l-12.5 10l5 15l-10-7.5l-10 7.5l5-15l-12.5-10h15z' fill='%23d4af37' fill-opacity='0.4'/%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }} />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent shadow-[0_4px_12px_rgba(212,175,55,0.3)]" />
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-amber-900/10 to-transparent" />
                        <div className="absolute top-1/2 right-0 w-32 h-64 bg-amber-500/5 blur-[60px] rounded-full" />
                    </>
                )}
                {tp.pattern === 'aurora' && (
                    <>
                        <div className="absolute inset-0 bg-[#050510]" />
                        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] opacity-50 blur-[100px]" style={{ background: `radial-gradient(circle at 30% 30%, #4facfe 0%, transparent 40%), radial-gradient(circle at 70% 60%, #00f2fe 0%, transparent 40%), radial-gradient(circle at 50% 10%, #667eea 0%, transparent 40%)` }} />
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#050510] to-transparent z-1" />
                    </>
                )}
                {tp.pattern === 'mesh' && (
                    <>
                        <div className="absolute inset-0 bg-black" />
                        <div className="absolute inset-0 opacity-30 animate-pulse-slow" style={{ background: `radial-gradient(circle at 20% 50%, #d946ef 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 50% 80%, #ec4899 0%, transparent 50%)`, filter: 'blur(60px)' }} />
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                    </>
                )}
                {tp.pattern === 'frosty' && (
                    <>
                        <div className="absolute inset-0 bg-[#0f172a]" />
                        <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full animate-bounce-slow" />
                        <div className="absolute bottom-[20%] left-[-10%] w-80 h-80 bg-indigo-600/15 blur-[120px] rounded-full" />
                        <div className="absolute inset-0 backdrop-blur-[2px] opacity-40 bg-[url('https://www.transparenttextures.com/patterns/snow.png')]" />
                    </>
                )}
                {tp.pattern === 'vibe_wave' && (
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-[45%] bg-[#24292e]" />
                        <svg className="absolute top-[38%] left-0 w-full h-32" viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <path fill="#24292e" d="M0,160L80,181.3C160,203,320,245,480,245.3C640,245,800,203,960,176C1120,149,1280,139,1360,133.3L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
                        </svg>
                        <div className="absolute top-[42%] left-0 w-full h-[2px] bg-[#e67e22]/30 blur-[4px]" />
                        <div className="absolute bottom-4 left-4 right-4 h-12 bg-[#24292e] rounded-xl flex items-center px-4">
                            <span className="text-[9px] text-white/50 tracking-widest font-bold">ADDRESS HERE, STREET, CITY 4320</span>
                        </div>
                    </div>
                )}
                {tp.pattern === 'vibe_geo' && (
                    <>
                        <div className="absolute inset-0 bg-[#0a0a0a]" />
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L50 50 L100 0 Z' fill='%23e67e22'/%3E%3C/svg%3E")`, backgroundSize: '150px 150px' }} />
                        <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#e67e22]/20 rounded-full blur-[60px]" />
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#e67e22]/10 rounded-full blur-[60px]" />
                        <div className="absolute top-0 left-0 w-full h-full border-[16px] border-[#e67e22]/5 pointer-events-none" />
                    </>
                )}
                {tp.pattern === 'vibe_elegant' && (
                    <>
                        <div className="absolute top-0 left-0 w-full h-6 bg-[#e67e22]" />
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-[#e67e22]" />
                        <div className="absolute top-0 right-0 w-12 h-full bg-[#24292e]/5" />
                        <div className="absolute top-32 right-0 w-1 h-32 bg-[#e67e22]" />
                    </>
                )}
            </div>

            <div className={cn(
                "flex-1 p-5 flex flex-col relative z-20 justify-start pt-8"
            )}>
                {/* QR Code Container - AT THE TOP as per references */}
                <div className="flex items-center justify-center mb-6">
                    <div className={cn(
                        "p-3 bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all ring-[6px] ring-white/10",
                        tp.pattern === 'layered' ? 'rounded-3xl border-2' : 'rounded-[2.25rem]'
                    )} style={{ borderColor: tp.accentText }}>
                        {qrDataUrl ? (
                            <img src={qrDataUrl} alt="QR Code" className="w-[100px] h-[100px]" />
                        ) : (
                            <div className="w-[100px] h-[100px] animate-pulse bg-slate-50 rounded-2xl flex items-center justify-center" >
                                <RefreshCw className="animate-spin text-slate-200" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Section - Under QR */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className={cn(
                        "relative z-10 overflow-hidden shadow-2xl transition-transform group-hover/card:scale-105 mb-3",
                        tp.pattern === 'vibe_wave'
                            ? "w-28 h-28 p-2 rounded-full border-[6px] border-[#e67e22] bg-white ring-8 ring-[#24292e]"
                            : tp.pattern === 'vibe_geo'
                                ? "w-24 h-24 p-1 rounded-[2rem] border-2 border-[#e67e22] bg-[#0a0a0a] ring-4 ring-white/5"
                                : "w-20 h-20 p-1 rounded-2xl border-2 ring-4 ring-white/5",
                        tp.hex === '#ffffff' ? "border-slate-100" : "border-white/20"
                    )}>
                        <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}`} className={cn(
                            "w-full h-full object-cover",
                            tp.pattern === 'vibe_wave' ? "rounded-full" : tp.pattern === 'vibe_geo' ? "rounded-[1.75rem]" : "rounded-xl"
                        )} alt="" />
                    </div>
                    <div className="space-y-1">
                        <h1 className={cn(
                            "font-black tracking-tighter line-clamp-1 leading-none uppercase",
                            tp.pattern === 'vibe_wave' ? "text-xl mt-2" : "text-lg",
                            tp.text
                        )}>{profileData?.displayName || user.name || "KARDLY USER"}</h1>
                        <p className={cn("text-[8px] font-black uppercase tracking-[0.2em] opacity-80", tp.accentText)}>
                            {profileData?.occupation || user.occupation || "DIGITAL EXPERT"}
                        </p>
                    </div>

                    {tp.pattern === 'layered' && (
                        <div className="w-full flex items-center justify-center gap-2 mt-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tp.accentText }} />
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                        </div>
                    )}
                </div>

                {/* Info Fields - Infographic Style */}
                <div className="space-y-1.5">
                    {[
                        { icon: Phone, value: profileData?.phone || user.phone, label: 'TELEFON' },
                        { icon: MapPin, value: profileData?.address, label: 'ADRES' },
                        { icon: MapPin, value: locationData, label: 'ŞEHİR / KONUM' },
                        { icon: MessageCircle, value: whatsappData, label: 'WHATSAPP', color: 'text-emerald-400' },
                        { icon: Mail, value: profileData?.email || user.email, label: 'E-POSTA' },
                        { icon: Globe, value: `kardly.site/${user.username}`, label: 'WEB' }
                    ].filter(item => item.value).map((item, idx) => (
                        <div key={idx} className={cn(
                            "flex items-center gap-3 p-2 rounded-xl transition-all border",
                            tp.category === 'Ultimate'
                                ? "bg-white/[0.08] border-white/10 backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                                : tp.pattern === 'layered'
                                    ? "bg-white/[0.05] border-white/5 shadow-sm"
                                    : "bg-white/[0.03] border-white/5 backdrop-blur-md"
                        )}>
                            <div className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center shadow-inner shrink-0",
                                item.color || tp.accentText,
                                tp.category === 'Ultimate' ? "bg-white/10" : "bg-white/5"
                            )}>
                                <item.icon size={11} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className={cn("text-[8px] font-black uppercase tracking-widest opacity-30 mb-0.5", tp.text)}>{item.label}</span>
                                <span className={cn("text-[9px] font-bold tracking-tight truncate", tp.text)}>{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-4 text-center pb-1">
                    <span className={cn("text-[6px] font-black tracking-[0.4em] uppercase opacity-20", tp.text)}>KARDLY • PREMIUM</span>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.1); opacity: 0.5; }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-30px) scale(1.05); }
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-scan { animation: scan 3s linear infinite; }
                .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
                .animate-bounce-slow { animation: bounce-slow 6s ease-in-out infinite; }
                .animate-shimmer { animation: shimmer 2s infinite; }
            `}</style>
        </div>
    )

    if (mode === 'modal') {
        return (
            <div className="w-full flex flex-col items-center">
                <div className="relative group/modal-card" style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}>
                    <div className={cn("absolute inset-2 blur-[60px] opacity-20 transition-all group-hover/modal-card:opacity-40 rounded-[2.5rem]", tp.accent)} />
                    {CardContent}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12 w-full flex flex-col items-center">
            {mode === 'selector' && (
                <div className="w-full bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/5 shadow-2xl">
                    <div className="flex flex-col gap-6">
                        {/* Tabs */}
                        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 w-fit mx-auto">
                            {(['Standard', 'Premium', 'Ultimate'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest",
                                        activeTab === tab
                                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
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

                        {/* Template Grid */}
                        <div className="w-full relative overflow-hidden min-h-[100px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.4, ease: "circOut" }}
                                    className="flex flex-wrap gap-4 justify-center"
                                >
                                    {TEMPLATES.filter(t => t.category === activeTab).map((tpl) => (
                                        <button
                                            key={tpl.id}
                                            onClick={() => onSelect?.(tpl.id)}
                                            className={cn(
                                                "group/tpl relative w-20 h-28 rounded-2xl border-2 transition-all overflow-hidden flex flex-col",
                                                tp.id === tpl.id
                                                    ? "border-primary ring-4 ring-primary/20 scale-105 shadow-xl"
                                                    : "border-white/5 hover:border-white/20 hover:scale-[1.02]"
                                            )}
                                        >
                                            <div className="flex-1 w-full" style={{ background: tpl.hex }}>
                                                {/* Mini Preview Placeholder */}
                                                <div className="w-full h-full opacity-30 flex items-center justify-center">
                                                    <div className="w-8 h-8 rounded-full border border-white/20 animate-pulse" />
                                                </div>
                                            </div>
                                            <div className="h-8 bg-slate-950/80 backdrop-blur-md flex items-center justify-center px-1">
                                                <span className="text-[7px] font-black uppercase tracking-tighter text-white truncate max-w-full">{tpl.name}</span>
                                            </div>
                                            {tp.id === tpl.id && (
                                                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-primary text-white p-1 rounded-full">
                                                        <Check size={10} />
                                                    </motion.div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            )}

            <div ref={containerRef} className="relative w-full overflow-hidden flex flex-col items-center px-4">
                <div
                    className="relative flex-shrink-0 transition-all duration-700 ease-out origin-center"
                    style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        transform: `scale(${cardScale})`,
                        marginTop: cardScale < 1 ? `-${(1 - cardScale) * cardHeight / 2}px` : '0px',
                        marginBottom: cardScale < 1 ? `-${(1 - cardScale) * cardHeight / 2}px` : '0px'
                    }}
                >
                    <div className={cn("absolute inset-4 blur-[80px] opacity-10 rounded-[1.5rem]", tp.accent)} />
                    {CardContent}
                </div>
            </div>

            <div className="w-full max-w-[340px] flex flex-col gap-4 mt-8 px-6">
                <div className="flex gap-3">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={cn(
                            "flex-1 h-14 flex items-center justify-center gap-3 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all relative overflow-hidden group/btn",
                            isDownloading ? "bg-slate-100 text-slate-400" : "bg-primary text-white shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-95"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:animate-shimmer" />
                        {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : downloadSuccess ? <Check size={18} /> : <Download size={18} />}
                        <span>{downloadSuccess ? 'BAŞARILI' : 'GÖRSELİ İNDİR'}</span>
                    </button>

                    <button
                        onClick={handleShare}
                        disabled={isSharing}
                        className="w-14 h-14 flex items-center justify-center bg-white text-slate-900 rounded-3xl shadow-xl shadow-slate-200 transition-all hover:bg-slate-50 active:scale-90 border border-slate-100"
                    >
                        {shareSuccess ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
                    </button>
                </div>

                <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] opacity-40">
                    KARDLY • SİZİN İÇİN TASARLANDI
                </p>
            </div>
        </div>
    )
}
