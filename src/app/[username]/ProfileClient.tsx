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
    ArrowRight
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

    const props = { profile, t, lang, setIsAppointmentOpen, isAppointmentOpen, handleShare }

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

function NeonModernTemplate({ profile, colorScheme, handleShare, setIsAppointmentOpen }: any) {
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

                    {/* Social Icons */}
                    <div className="flex justify-center gap-6 pt-2">
                        {socialLinks.slice(0, 6).map((l: any, i: number) => {
                            const platform = l.platform.toLowerCase()
                            return (
                                <a key={i} href={l.url} target="_blank" className={cn("transition-all hover:scale-125 opacity-60 hover:opacity-100", theme.text)}>
                                    {platform === 'instagram' && <Instagram size={24} />}
                                    {platform === 'linkedin' && <Linkedin size={24} />}
                                    {platform === 'twitter' && <Twitter size={24} />}
                                    {platform === 'github' && <Github size={24} />}
                                    {platform === 'youtube' && <Youtube size={24} />}
                                    {(!['instagram', 'linkedin', 'twitter', 'github', 'youtube'].includes(platform)) && <Globe size={24} />}
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
                                background: `linear-gradient(45deg, ${theme.accent}, ${theme.accent}cc)`,
                                boxShadow: `0 10px 30px -10px ${theme.accent}60`
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

