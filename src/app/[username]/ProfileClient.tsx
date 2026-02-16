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
    FileText
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
            case "aurora": return <AuroraTemplate {...props} />;
            case "cyber": return <CyberTacticalTemplate {...props} />;
            case "zen": return <OrganicZenTemplate {...props} />;
            case "retro": return <RetroSynthTemplate {...props} />;
            case "cosmic": return <CosmicGlitchTemplate {...props} />;
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
        }
    }[colorScheme as 'black' | 'white' | 'blue' | 'green'] || {
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

// ─── AURORA TEMPLATE ───────────────────────────────────────────
function AuroraTemplate({ profile, handleShare, setIsAppointmentOpen }: any) {
    const socialLinks = profile.socialLinks || []
    return (
        <div className="min-h-screen bg-[#020617] font-sans flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[150px] animate-pulse" />
            </div>
            <main className="relative z-10 w-full max-w-[420px]">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-[3rem] p-1 shadow-2xl overflow-hidden">
                    <div className="bg-[#050B1B]/60 backdrop-blur-2xl rounded-[2.9rem] p-8 space-y-8 border border-white/5">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-3xl rotate-3 overflow-hidden border-2 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                                <img src={profile.user.image} className="w-full h-full object-cover -rotate-3 scale-110" />
                            </div>
                            <h1 className="text-3xl font-black mt-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">{profile.user.name}</h1>
                            <p className="text-purple-400 font-bold tracking-[0.3em] text-[10px] uppercase mt-2">{profile.occupation}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {socialLinks.slice(0, 4).map((l: any, i: number) => (
                                <a key={i} href={l.url} className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all group">
                                    <div className="text-purple-400 group-hover:scale-110 transition-transform"><Globe size={20} /></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{l.platform}</span>
                                </a>
                            ))}
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleShare} className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold text-xs uppercase tracking-widest">Paylaş</button>
                            <a href={profile.cvUrl} className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-bold text-xs uppercase tracking-widest text-center">CV İndir</a>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}

// ─── CYBER TACTICAL TEMPLATE ──────────────────────────────────
function CyberTacticalTemplate({ profile, handleShare, setIsAppointmentOpen }: any) {
    return (
        <div className="min-h-screen bg-[#050505] text-[#00FF41] font-mono flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <main className="w-full max-w-[420px] relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-[#00FF41]" />
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-[#00FF41]" />
                <div className="bg-[#0A0A0A] border border-[#00FF41]/30 p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 text-[10px] opacity-40">SYSTEM_ID: {profile.username}</div>
                    <div className="flex gap-6 items-center border-b border-[#00FF41]/20 pb-6">
                        <div className="w-24 h-24 border border-[#00FF41] p-1">
                            <img src={profile.user.image} className="w-full h-full grayscale hover:grayscale-0 transition-all" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold uppercase tracking-tighter">{profile.user.name}</h1>
                            <p className="text-xs opacity-60 mt-1">&gt; {profile.occupation}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {profile.socialLinks.map((l: any, i: number) => (
                            <a key={i} href={l.url} className="block border border-[#00FF41]/20 p-3 hover:bg-[#00FF41]/10 transition-all flex justify-between items-center group">
                                <span className="text-xs">[ {l.platform.toUpperCase()} ]</span>
                                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100" />
                            </a>
                        ))}
                    </div>
                    <button onClick={handleShare} className="w-full border-2 border-[#00FF41] py-3 text-xs font-bold uppercase hover:bg-[#00FF41] hover:text-black transition-all">TERMINATE &amp; SHARE</button>
                </div>
            </main>
        </div>
    )
}

// ─── ORGANIC ZEN TEMPLATE ──────────────────────────────────────
function OrganicZenTemplate({ profile, handleShare }: any) {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#4A443F] font-sans flex items-center justify-center p-6">
            <main className="w-full max-w-[380px] space-y-12">
                <div className="text-center space-y-6">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-32 h-40 bg-[#E5E1DA] mx-auto rounded-full overflow-hidden shadow-sm">
                        <img src={profile.user.image} className="w-full h-full object-cover mix-blend-multiply" />
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-serif lowercase tracking-tight">{profile.user.name}</h1>
                        <p className="text-[10px] uppercase tracking-[0.4em] opacity-40">{profile.occupation}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {profile.socialLinks.map((l: any, i: number) => (
                        <a key={i} href={l.url} className="flex items-center gap-4 py-4 border-b border-[#4A443F]/10 hover:opacity-50 transition-opacity">
                            <span className="text-[10px] opacity-30">0{i + 1}</span>
                            <span className="text-sm font-medium">{l.platform}</span>
                            <div className="ml-auto w-1 h-1 bg-[#4A443F]/20 rounded-full" />
                        </a>
                    ))}
                </div>
                <button onClick={handleShare} className="w-full py-5 rounded-full border border-[#4A443F] text-xs font-bold uppercase tracking-widest hover:bg-[#4A443F] hover:text-white transition-all">Bağlantı Kur</button>
            </main>
        </div>
    )
}

// ─── RETRO SYNTH TEMPLATE ──────────────────────────────────────
function RetroSynthTemplate({ profile, handleShare }: any) {
    return (
        <div className="min-h-screen bg-[#1A0B2E] text-white flex items-center justify-center p-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,0,255,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline" />
            <div className="absolute bottom-1/2 w-full h-[1px] bg-cyan-500/30 shadow-[0_0_20px_cyan]" />
            <main className="w-full max-w-[400px] relative z-10">
                <div className="bg-[#120422] border-4 border-pink-600 shadow-[0_0_40px_rgba(219,39,119,0.5)] p-0 flex flex-col items-center">
                    <div className="w-full h-2 bg-gradient-to-r from-pink-600 via-cyan-500 to-pink-600" />
                    <div className="p-8 w-full space-y-8">
                        <div className="relative">
                            <div className="w-32 h-32 mx-auto bg-cyan-500 p-1 rotate-3">
                                <img src={profile.user.image} className="w-full h-full object-cover -rotate-3 border-2 border-[#120422]" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-pink-500 drop-shadow-[2px_2px_0_#FFF]">{profile.user.name}</h1>
                            <p className="font-mono text-cyan-400 text-xs mt-2 uppercase tracking-widest">LVL.99 {profile.occupation}</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {profile.socialLinks.map((l: any, i: number) => (
                                <a key={i} href={l.url} className="px-5 py-2 border border-cyan-500/50 hover:bg-cyan-500 hover:text-black font-black italic text-xs uppercase animate-pulse transition-all">{l.platform}</a>
                            ))}
                        </div>
                        <button onClick={handleShare} className="w-full py-4 bg-pink-600 text-white font-black italic tracking-widest hover:translate-y-[-4px] hover:shadow-[0_8px_0_#9D174D] active:translate-y-0 transition-all">ACTIVATE SHARE</button>
                    </div>
                </div>
            </main>
        </div>
    )
}

// ─── COSMIC GLITCH TEMPLATE ────────────────────────────────────
function CosmicGlitchTemplate({ profile, handleShare }: any) {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)]" />
            <main className="w-full max-w-[350px] space-y-12">
                <div className="relative">
                    <motion.div animate={{ skew: [0, -2, 2, 0] }} transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }} className="w-full aspect-square border-2 border-white/10 p-2 relative">
                        <img src={profile.user.image} className="w-full h-full object-cover grayscale brightness-125 contrast-125" />
                        <div className="absolute inset-0 bg-red-500/20 mix-blend-screen opacity-0 hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <div className="absolute -top-4 -right-4 font-black italic text-[80px] opacity-5 select-none leading-none">NOOS</div>
                </div>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">{profile.user.name}</h1>
                        <p className="text-[10px] mt-4 font-mono opacity-50 tracking-[0.5em]">{profile.occupation}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        {profile.socialLinks.map((l: any, i: number) => (
                            <a key={i} href={l.url} className="text-sm font-bold border-l-2 border-white/10 pl-4 py-2 hover:border-white transition-all">/{l.platform}</a>
                        ))}
                    </div>
                </div>
                <div className="pt-10 flex border-t border-white/20 items-center justify-between">
                    <p className="text-[10px] font-mono opacity-20">EST. 2026</p>
                    <button onClick={handleShare} className="w-12 h-12 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition-all">
                        <Share2 size={16} />
                    </button>
                </div>
            </main>
        </div>
    )
}

