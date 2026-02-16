"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import {
    MessageCircle,
    Phone,
    Share2,
    Calendar,
    CheckCircle2,
    Instagram,
    Twitter,
    Linkedin,
    Mail,
    MapPin,
    Globe,
    Smartphone,
    Play,
    Download,
    Github,
    Youtube,
    FileText,
    ArrowRight,
    Star,
    MessageSquare,
    Quote,
    X,
    QrCode,
    Zap,
    Trophy,
    Target,
    Users,
    Code,
    Palette,
    Briefcase,
    Settings,
    Shield
} from "lucide-react"
import { AppointmentModal } from "@/components/AppointmentModal"
import { translations } from "@/lib/i18n"
import { motion, AnimatePresence } from "framer-motion"

// ─── TYPES ───────────────────────────────────────────────────────

interface Profile {
    id: string;
    username: string;
    occupation: string;
    slogan: string;
    bio: string;
    phone: string;
    themeColor: string;
    templateId: string;
    socialLinks: { platform: string; url: string }[];
    services: { title: string; description: string }[];
    workingHours: string[];
    user: {
        name: string;
        image: string;
        email: string;
        subscription?: { plan: string };
    };
    products: { id: string; name: string; description: string; price: number; image: string; link: string }[];
    blocks: { id: string; type: string; content: any; order: number; isActive: boolean }[];
    cvUrl?: string;
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────

export default function ProfileClient({ profile }: { profile: any }) {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
    const [lang, setLang] = useState("tr")
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [reviews, setReviews] = useState([
        { id: 1, name: "Fatih Yaman", title: "CEO, XYZ Şirketi", content: "Şirketimizin test sürecini mükemmel bir şekilde yönetti. Kesinlikle tavsiye ederim!", rating: 5, image: "https://i.pravatar.cc/150?u=fatih" },
        { id: 2, name: "Zeynep Kaya", title: "Yazılım Müdürü", content: "Teknik bilgisi ve problem çözme hızı gerçekten etkileyici.", rating: 5, image: "https://i.pravatar.cc/150?u=zeynep" },
        { id: 3, name: "Ali Yılmaz", title: "Proje Yöneticisi", content: "İletişimi çok güçlü ve teslimatları her zaman zamanında yapıyor.", rating: 4, image: "https://i.pravatar.cc/150?u=ali" }
    ])
    const t = translations[lang as keyof typeof translations] || translations.tr

    useEffect(() => { setMounted(true) }, [])

    const handleShare = async () => {
        const url = `${window.location.origin}/${profile.username}`
        if (navigator.share) {
            try { await navigator.share({ title: profile.user.name, text: profile.slogan, url }) } catch { }
        } else {
            navigator.clipboard.writeText(url)
            setCopied(true); setTimeout(() => setCopied(false), 2000)
        }
    }

    if (!mounted) return <div className="min-h-screen bg-[#020617] flex items-center justify-center font-sans"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>

    const props = { profile, t, lang, setIsAppointmentOpen, isAppointmentOpen, handleShare, reviews, setIsReviewModalOpen }

    // Template Selector Logic
    const renderTemplate = () => {
        switch (profile.templateId) {
            case "neon_black": return <NeonModernTemplate {...props} colorScheme="black" />;
            case "neon_white": return <NeonModernTemplate {...props} colorScheme="white" />;
            case "neon_blue": return <NeonModernTemplate {...props} colorScheme="blue" />;
            case "neon_green": return <NeonModernTemplate {...props} colorScheme="green" />;
            case "neon_purple": return <NeonModernTemplate {...props} colorScheme="purple" />;
            case "neon_red": return <NeonModernTemplate {...props} colorScheme="red" />;
            case "neon_gold": return <NeonModernTemplate {...props} colorScheme="gold" />;
            case "neon_rose": return <NeonModernTemplate {...props} colorScheme="rose" />;
            case "neon_cyan": return <NeonModernTemplate {...props} colorScheme="cyan" />;
            case "neon_gs": return <NeonModernTemplate {...props} colorScheme="gs" />;
            case "neon_fb": return <NeonModernTemplate {...props} colorScheme="fb" />;
            case "neon_ts": return <NeonModernTemplate {...props} colorScheme="ts" />;
            case "neon_bjk": return <NeonModernTemplate {...props} colorScheme="bjk" />;
            case "neon_tr": return <NeonModernTemplate {...props} colorScheme="tr" />;
            case "neon_greenwhite": return <NeonModernTemplate {...props} colorScheme="greenwhite" />;
            case "neon_greenblack": return <NeonModernTemplate {...props} colorScheme="greenblack" />;
            case "neon_orangeblack": return <NeonModernTemplate {...props} colorScheme="orangeblack" />;
            default: return <NeonModernTemplate {...props} colorScheme="black" />;
        }
    }

    return (
        <>
            <AppointmentModal profile={profile} isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} t={t} />
            {renderTemplate()}

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={(newReview: any) => setReviews([newReview, ...reviews])}
                themeColor={profile.themeColor || "#0ea5e9"}
            />

            <AnimatePresence>
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] bg-white text-black px-8 py-4 rounded-full font-black shadow-2xl flex items-center gap-3 border border-indigo-100"
                    >
                        <CheckCircle2 size={20} className="text-indigo-600" /> Link Kopyalandı!
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

function NeonModernTemplate({ profile, colorScheme, handleShare, reviews, setIsReviewModalOpen }: any) {
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [reviews.length])

    const theme = {
        black: {
            bg: "bg-[#030712]",
            card: "bg-black/40",
            text: "text-white",
            subtext: "text-white/60",
            border: "border-white/10",
            glow: "shadow-[0_0_20px_rgba(14,165,233,0.5)]",
            accent: "#0ea5e9", // Blue glow
            btn: "bg-black/60 border-white/20",
            btnText: "text-white",
            icon: "text-[#0ea5e9]"
        },
        white: {
            bg: "bg-[#F8FAFC]",
            card: "bg-white",
            text: "text-slate-900",
            subtext: "text-slate-500",
            border: "border-slate-200",
            glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
            accent: "#3b82f6",
            cvAccent: "#3b82f6",
            btn: "bg-slate-50 border-slate-200",
            btnText: "text-slate-900",
            icon: "text-[#3b82f6]"
        },
        blue: {
            bg: "bg-[#0c1e35]",
            card: "bg-[#0f2a4a]/40",
            text: "text-white",
            subtext: "text-blue-200/60",
            border: "border-blue-500/20",
            glow: "shadow-[0_0_20px_rgba(56,189,248,0.5)]",
            accent: "#38bdf8",
            btn: "bg-[#0f2a4a]/60 border-blue-500/30",
            btnText: "text-white",
            icon: "text-[#38bdf8]"
        },
        green: {
            bg: "bg-[#06140e]",
            card: "bg-[#0a1f16]/40",
            text: "text-white",
            subtext: "text-green-200/60",
            border: "border-green-500/20",
            glow: "shadow-[0_0_20px_rgba(34,197,94,0.5)]",
            accent: "#22c55e",
            btn: "bg-[#0a1f16]/60 border-green-500/30",
            btnText: "text-white",
            icon: "text-[#22c55e]"
        },
        purple: {
            bg: "bg-[#13072e]",
            card: "bg-[#1a0b3d]/40",
            text: "text-white",
            subtext: "text-purple-200/60",
            border: "border-purple-500/20",
            glow: "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
            accent: "#a855f7",
            btn: "bg-[#1a0b3d]/60 border-purple-500/30",
            btnText: "text-white",
            icon: "text-[#a855f7]"
        },
        red: {
            bg: "bg-[#1a0505]",
            card: "bg-[#2d0a0a]/40",
            text: "text-white",
            subtext: "text-red-200/60",
            border: "border-red-500/20",
            glow: "shadow-[0_0_20px_rgba(239,68,68,0.5)]",
            accent: "#ef4444",
            btn: "bg-[#2d0a0a]/60 border-red-500/30",
            btnText: "text-white",
            icon: "text-[#ef4444]"
        },
        gold: {
            bg: "bg-[#1a1405]",
            card: "bg-[#2d230a]/40",
            text: "text-white",
            subtext: "text-amber-200/60",
            border: "border-amber-500/20",
            glow: "shadow-[0_0_20px_rgba(251,191,36,0.5)]",
            accent: "#fbbf24",
            btn: "bg-[#2d230a]/60 border-amber-500/30",
            btnText: "text-white",
            icon: "text-[#fbbf24]"
        },
        rose: {
            bg: "bg-[#1a050f]",
            card: "bg-[#2d0a1a]/40",
            text: "text-white",
            subtext: "text-rose-200/60",
            border: "border-rose-500/20",
            glow: "shadow-[0_0_20px_rgba(244,63,94,0.5)]",
            accent: "#f43f5e",
            btn: "bg-[#2d0a1a]/60 border-rose-500/30",
            btnText: "text-white",
            icon: "text-[#f43f5e]"
        },
        cyan: {
            bg: "bg-[#051a1a]",
            card: "bg-[#0a2d2d]/40",
            text: "text-white",
            subtext: "text-cyan-200/60",
            border: "border-cyan-500/20",
            glow: "shadow-[0_0_20px_rgba(6,182,212,0.5)]",
            accent: "#06b6d4",
            btn: "bg-[#0a2d2d]/60 border-cyan-500/30",
            btnText: "text-white",
            icon: "text-[#06b6d4]"
        },
        gs: {
            bg: "bg-[#1a0505]",
            card: "bg-[#2d0a0a]/40",
            text: "text-[#fbbf24]",
            subtext: "text-red-200/60",
            border: "border-[#fbbf24]/20",
            glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
            accent: "#fbbf24",
            btn: "bg-[#2d0a0a]/60 border-red-500/30",
            btnText: "text-[#fbbf24]",
            icon: "text-[#fbbf24]"
        },
        fb: {
            bg: "bg-[#050b1a]",
            card: "bg-[#0a152d]/40",
            text: "text-[#fbbf24]",
            subtext: "text-blue-200/60",
            border: "border-[#fbbf24]/20",
            glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
            accent: "#fbbf24",
            btn: "bg-[#0a152d]/60 border-blue-500/30",
            btnText: "text-[#fbbf24]",
            icon: "text-[#fbbf24]"
        },
        ts: {
            bg: "bg-[#1a0510]",
            card: "bg-[#2d0a1a]/40",
            text: "text-[#38bdf8]",
            subtext: "text-rose-200/60",
            border: "border-[#38bdf8]/20",
            glow: "shadow-[0_0_20px_rgba(56,189,248,0.3)]",
            accent: "#38bdf8",
            btn: "bg-[#2d0a1a]/60 border-rose-500/30",
            btnText: "text-[#38bdf8]",
            icon: "text-[#38bdf8]"
        },
        bjk: {
            bg: "bg-[#000000]",
            card: "bg-white/5",
            text: "text-white",
            subtext: "text-white/60",
            border: "border-white/20",
            glow: "shadow-[0_0_20px_rgba(255,255,255,0.1)]",
            accent: "#ffffff",
            cvAccent: "#a3a3a3",
            btn: "bg-white/5 border-white/20",
            btnText: "text-white",
            icon: "text-white"
        },
        tr: {
            bg: "bg-[#1a0505]",
            card: "bg-white/5",
            text: "text-white",
            subtext: "text-red-200/60",
            border: "border-white/20",
            glow: "shadow-[0_0_20px_rgba(255,255,255,0.1)]",
            accent: "#ffffff",
            cvAccent: "#ef4444",
            btn: "bg-white/5 border-white/20",
            btnText: "text-white",
            icon: "text-white"
        },
        greenwhite: {
            bg: "bg-[#06140e]",
            card: "bg-white/5",
            text: "text-white",
            subtext: "text-green-200/60",
            border: "border-white/20",
            glow: "shadow-[0_0_20px_rgba(255,255,255,0.1)]",
            accent: "#ffffff",
            cvAccent: "#22c55e",
            btn: "bg-white/5 border-white/20",
            btnText: "text-white",
            icon: "text-white"
        },
        greenblack: {
            bg: "bg-[#06140e]",
            card: "bg-black/60",
            text: "text-[#22c55e]",
            subtext: "text-green-200/60",
            border: "border-[#22c55e]/20",
            glow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]",
            accent: "#22c55e",
            btn: "bg-black/60 border-green-500/30",
            btnText: "text-[#22c55e]",
            icon: "text-[#22c55e]"
        },
        orangeblack: {
            bg: "bg-[#0f0a05]",
            card: "bg-black/60",
            text: "text-orange-500",
            subtext: "text-orange-200/60",
            border: "border-orange-500/20",
            glow: "shadow-[0_0_20px_rgba(249,115,22,0.3)]",
            accent: "#f97316",
            btn: "bg-black/60 border-orange-500/30",
            btnText: "text-orange-500",
            icon: "text-orange-500"
        }
    }[colorScheme as 'black' | 'white' | 'blue' | 'green' | 'purple' | 'red' | 'gold' | 'rose' | 'cyan' | 'gs' | 'fb' | 'ts' | 'bjk' | 'tr' | 'greenwhite' | 'greenblack' | 'orangeblack'] || {
        bg: "bg-[#030712]",
        card: "bg-black/40",
        text: "text-white",
        subtext: "text-white/60",
        border: "border-white/10",
        glow: "shadow-[0_0_20px_rgba(14,165,233,0.5)]",
        accent: "#0ea5e9",
        btn: "bg-black/60 border-white/20",
        btnText: "text-white",
        icon: "text-[#0ea5e9]"
    }

    const socialLinks = profile.socialLinks || []

    const actions = [
        { label: "Ara", icon: <Phone size={20} />, href: `tel:${socialLinks.find((l: any) => l.platform === 'phone')?.url}`, active: !!socialLinks.find((l: any) => l.platform === 'phone')?.url },
        { label: "WhatsApp", icon: <MessageCircle size={20} />, href: `https://wa.me/${socialLinks.find((l: any) => l.platform === 'phone')?.url?.replace(/\D/g, '')}`, active: !!socialLinks.find((l: any) => l.platform === 'phone')?.url },
        { label: "E-Mail", icon: <Mail size={20} />, href: `mailto:${profile.user.email}`, active: !!profile.user.email },
        { label: "Web Site", icon: <Globe size={20} />, href: socialLinks.find((l: any) => l.platform === 'website')?.url, active: !!socialLinks.find((l: any) => l.platform === 'website')?.url },
        { label: "Konum", icon: <MapPin size={20} />, href: socialLinks.find((l: any) => l.platform === 'location')?.url, active: !!socialLinks.find((l: any) => l.platform === 'location')?.url },
    ].filter(a => a.active)

    return (
        <div className={cn("min-h-screen font-sans flex items-center justify-center p-4 relative overflow-hidden", theme.bg)}>
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 blur-[120px] opacity-20 rounded-full" style={{ background: theme.accent }} />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 blur-[120px] opacity-20 rounded-full" style={{ background: theme.accent }} />
            </div>

            <main className="relative z-10 w-full max-w-[420px] space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("rounded-[3rem] border p-8 space-y-8 backdrop-blur-3xl shadow-2xl", theme.card, theme.border)}
                >
                    {/* Profile Section */}
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="relative group">
                            {/* Expertise Icons */}
                            {(profile.services || []).slice(0, 6).map((service: any, i: number, arr: any[]) => {
                                const angle = (i * (360 / arr.length) - 90) * (Math.PI / 180);
                                const radius = 95;
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;

                                const getIcon = (title: string) => {
                                    const t = title.toLowerCase();
                                    if (t.includes('satış') || t.includes('sales') || t.includes('pazar') || t.includes('market')) return <Trophy size={16} />;
                                    if (t.includes('strateji') || t.includes('strategy') || t.includes('plan')) return <Target size={16} />;
                                    if (t.includes('inovasyon') || t.includes('innovation') || t.includes('süreç') || t.includes('process')) return <Zap size={16} />;
                                    if (t.includes('müşteri') || t.includes('customer') || t.includes('crm') || t.includes('ilişki')) return <Users size={16} />;
                                    if (t.includes('yazılım') || t.includes('code') || t.includes('software') || t.includes('geliştirme')) return <Code size={16} />;
                                    if (t.includes('tasarım') || t.includes('design') || t.includes('grafik')) return <Palette size={16} />;
                                    if (t.includes('hukuk') || t.includes('law') || t.includes('legal')) return <Shield size={16} />;
                                    if (t.includes('finans') || t.includes('money') || t.includes('bank')) return <Briefcase size={16} />;
                                    return <Zap size={16} />;
                                };

                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className="absolute z-20 flex flex-col items-center gap-1 group/item"
                                        style={{
                                            left: `calc(50% + ${x}px)`,
                                            top: `calc(50% + ${y}px)`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-xl glass border border-white/20 flex items-center justify-center shadow-lg transition-all group-hover/item:scale-110 group-hover/item:rotate-6"
                                            style={{ color: theme.accent, boxShadow: `0 0 15px ${theme.accent}30` }}
                                        >
                                            {getIcon(service.title)}
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-0.5 rounded-full text-white pointer-events-none">
                                            {service.title}
                                        </span>
                                    </motion.div>
                                );
                            })}

                            <motion.div
                                animate={{
                                    boxShadow: [
                                        `0 0 0px ${theme.accent}00`,
                                        `0 0 20px ${theme.accent}40`,
                                        `0 0 0px ${theme.accent}00`
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="w-32 h-32 rounded-full p-1 border-2 relative z-10 overflow-hidden"
                                style={{ borderColor: theme.accent }}
                            >
                                <img src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`} className="w-full h-full rounded-full object-cover" />
                            </motion.div>
                            <div className="absolute inset-[-10px] rounded-full blur-2xl opacity-20 animate-pulse" style={{ background: theme.accent }} />
                        </div>

                        <div>
                            <h1 className={cn("text-3xl font-black tracking-tight", theme.text)}>{profile.user.name}</h1>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <div className="h-[1px] w-4 rounded-full opacity-30" style={{ background: theme.accent }} />
                                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80" style={{ color: theme.accent }}>{profile.occupation || "WEB DEVELOPER"}</p>
                                <div className="h-[1px] w-4 rounded-full opacity-30" style={{ background: theme.accent }} />
                            </div>
                            {profile.slogan && <p className={cn("text-sm font-bold mt-3 opacity-60", theme.text)}>“{profile.slogan}”</p>}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                        {actions.map((action, i) => (
                            <motion.a
                                key={i}
                                href={action.href}
                                target="_blank"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                className={cn("w-full py-4 px-6 rounded-2xl border flex items-center gap-4 transition-all shadow-lg", theme.btn, theme.border)}
                            >
                                <div style={{ color: theme.accent }}>{action.icon}</div>
                                <span className={cn("flex-1 text-center font-black text-sm uppercase tracking-widest", theme.btnText)}>{action.label}</span>
                            </motion.a>
                        ))}
                    </div>

                    {/* Bio Paragraph */}
                    {profile.bio && (
                        <p className={cn("text-center text-xs font-medium leading-relaxed px-4", theme.subtext)}>
                            {profile.bio}
                        </p>
                    )}

                    {/* Testimonials Slider */}
                    <div className="pt-4 overflow-hidden relative">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className={cn("text-[10px] font-black uppercase tracking-[0.2em] opacity-40", theme.text)}>Müşteri Yorumları</h3>
                            <button
                                onClick={() => setIsReviewModalOpen(true)}
                                className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                                style={{ color: theme.accent }}
                            >
                                + Yorum Yaz
                            </button>
                        </div>

                        <div className="relative h-40">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentReviewIndex}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className={cn("absolute inset-0 p-5 rounded-3xl border flex flex-col justify-between", theme.card, theme.border)}
                                >
                                    <div className="flex gap-4">
                                        <img src={reviews[currentReviewIndex].image} className="w-12 h-12 rounded-full border border-white/10 object-cover" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className={cn("text-xs font-black", theme.text)}>{reviews[currentReviewIndex].name}</h4>
                                                    <p className={cn("text-[10px] opacity-40", theme.text)}>{reviews[currentReviewIndex].title}</p>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} className={i < reviews[currentReviewIndex].rating ? "fill-current text-amber-400" : "text-white/10"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className={cn("text-[11px] leading-relaxed mt-2 line-clamp-2 italic opacity-80", theme.text)}>
                                                "{reviews[currentReviewIndex].content}"
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-1.5 mt-4">
                            {reviews.map((_: any, i: number) => (
                                <div
                                    key={i}
                                    className="h-1 rounded-full transition-all"
                                    style={{
                                        width: i === currentReviewIndex ? '16px' : '4px',
                                        background: i === currentReviewIndex ? theme.accent : 'rgba(255,255,255,0.1)'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex justify-center flex-wrap gap-6 pt-2">
                        {socialLinks.slice(0, 10).map((l: any, i: number) => {
                            const platform = l.platform.toLowerCase()
                            return (
                                <a key={i} href={l.url} target="_blank" className={cn("transition-all hover:scale-125 opacity-60 hover:opacity-100", theme.text)}>
                                    {platform === 'instagram' && <Instagram size={24} />}
                                    {platform === 'linkedin' && <Linkedin size={24} />}
                                    {platform === 'twitter' && <Twitter size={24} />}
                                    {platform === 'github' && <Github size={24} />}
                                    {platform === 'youtube' && <Youtube size={24} />}
                                    {(platform === 'phone' || platform === 'whatsapp') && <Phone size={24} />}
                                    {platform === 'mail' && <Mail size={24} />}
                                    {platform === 'location' && <QrCode size={24} />}
                                    {(!['instagram', 'linkedin', 'twitter', 'github', 'youtube', 'phone', 'whatsapp', 'mail', 'location'].includes(platform)) && <Globe size={24} />}
                                </a>
                            )
                        })}
                    </div>

                    <div className="pt-8 border-t border-white/5 text-center flex gap-4">
                        <button
                            onClick={handleShare}
                            className="flex-1 py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 text-white shadow-xl bg-white/5 border border-white/10"
                        >
                            <Share2 size={20} /> Paylaş
                        </button>

                        <a
                            href={profile.cvUrl || "#"}
                            target="_blank"
                            className="flex-1 py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 text-white shadow-xl"
                            style={{
                                background: `linear-gradient(45deg, ${(theme as any).cvAccent || theme.accent}, ${(theme as any).cvAccent || theme.accent}cc)`,
                                boxShadow: `0 10px 30px -10px ${(theme as any).cvAccent || theme.accent}60`
                            }}
                        >
                            <FileText size={20} /> CV Görüntüle
                        </a>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}

function ReviewModal({ isOpen, onClose, onSubmit, themeColor }: any) {
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        content: "",
        rating: 5,
        image: `https://i.pravatar.cc/150?u=${Math.random()}`
    })

    if (!isOpen) return null

    const handleSubmit = () => {
        if (!formData.name || !formData.content) return
        onSubmit({ ...formData, id: Date.now() })
        setFormData({
            name: "",
            title: "",
            content: "",
            rating: 5,
            image: `https://i.pravatar.cc/150?u=${Math.random()}`
        })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: themeColor }} />

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Yorum Bırak</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setFormData({ ...formData, rating: star })}
                                className="transition-all hover:scale-125"
                            >
                                <Star
                                    size={32}
                                    className={cn(
                                        star <= formData.rating ? "fill-current text-amber-400" : "text-white/10"
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Adınız Soyadınız"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Ünvanınız (Örn: Yazılım Geliştirici)"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <textarea
                            rows={4}
                            placeholder="Yorumunuz..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full py-5 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 shadow-xl"
                        style={{ background: themeColor }}
                    >
                        Yorumu Yayınla
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
