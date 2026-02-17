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
    User,
    UserCircle,
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
    tone: string; // Added tone
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
    showAppointmentBtn?: boolean;
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────

export default function ProfileClient({ profile }: { profile: any }) {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
    const [lang, setLang] = useState("tr")
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [reviews, setReviews] = useState(profile.reviews?.length > 0 ? profile.reviews : [
        { id: '1', name: "Fatih Yaman", title: "CEO, XYZ Şirketi", content: "Şirketimizin test sürecini mükemmel bir şekilde yönetti. Kesinlikle tavsiye ederim!", rating: 5, image: "https://avatar.iran.liara.run/public/31" },
        { id: '2', name: "Zeynep Kaya", title: "Yazılım Müdürü", content: "Teknik bilgisi ve problem çözme hızı gerçekten etkileyici.", rating: 5, image: "https://avatar.iran.liara.run/public/65" },
        { id: '3', name: "Ali Yılmaz", title: "Proje Yöneticisi", content: "İletişimi çok güçlü ve teslimatları her zaman zamanında yapıyor.", rating: 4, image: "https://avatar.iran.liara.run/public/48" }
    ])
    const [reviewStatus, setReviewStatus] = useState<string | null>(null)
    const t = translations[lang as keyof typeof translations] || translations.tr

    useEffect(() => {
        setMounted(true)
        // Page view track
        if (profile.id) {
            fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileId: profile.id, type: "view" })
            }).catch(console.error)
        }
    }, [])

    const trackEvent = async (type: string, value?: string) => {
        try {
            await fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileId: profile.id, type: `click_${type}`, value })
            })
        } catch (err) {
            console.error(err)
        }
    }

    const handleShare = async () => {
        const url = `${window.location.origin}/${profile.username}`
        trackEvent("share")
        if (navigator.share) {
            try { await navigator.share({ title: profile.user.name, text: profile.slogan, url }) } catch { }
        } else {
            navigator.clipboard.writeText(url)
            setCopied(true); setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleCVView = () => {
        if (!profile.cvUrl) return;
        trackEvent("cv")

        // Eğer data URL ise (base64), Blob'a çevirip güvenli bir şekilde açalım
        if (profile.cvUrl.startsWith('data:')) {
            try {
                const parts = profile.cvUrl.split(';');
                const contentType = parts[0].split(':')[1];
                const base64Data = profile.cvUrl.split(',')[1];

                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: contentType });
                const blobUrl = URL.createObjectURL(blob);

                window.open(blobUrl, '_blank');
            } catch (err) {
                console.error("CV açma hatası:", err);
                window.open(profile.cvUrl, '_blank');
            }
        } else {
            window.open(profile.cvUrl, '_blank');
        }
    }

    if (!mounted) return <div className="min-h-screen bg-[#020617] flex items-center justify-center font-sans"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>

    const props = { profile, t, lang, setIsAppointmentOpen, isAppointmentOpen, handleShare, handleCVView, reviews, setIsReviewModalOpen, trackEvent }

    // Template Selector Logic
    const renderTemplate = () => {
        const tone = profile.tone?.toLowerCase() || "profesyonel"
        switch (profile.templateId) {
            case "neon_black": return <NeonModernTemplate {...props} colorScheme="black" tone={tone} />;
            case "neon_white": return <NeonModernTemplate {...props} colorScheme="white" tone={tone} />;
            case "neon_blue": return <NeonModernTemplate {...props} colorScheme="blue" tone={tone} />;
            case "neon_green": return <NeonModernTemplate {...props} colorScheme="green" tone={tone} />;
            case "neon_purple": return <NeonModernTemplate {...props} colorScheme="purple" tone={tone} />;
            case "neon_red": return <NeonModernTemplate {...props} colorScheme="red" tone={tone} />;
            case "neon_gold": return <NeonModernTemplate {...props} colorScheme="gold" tone={tone} />;
            case "neon_rose": return <NeonModernTemplate {...props} colorScheme="rose" tone={tone} />;
            case "neon_cyan": return <NeonModernTemplate {...props} colorScheme="cyan" tone={tone} />;
            case "neon_pink": return <NeonModernTemplate {...props} colorScheme="pink" tone={tone} />;
            case "neon_amber": return <NeonModernTemplate {...props} colorScheme="amber" tone={tone} />;
            case "neon_emerald": return <NeonModernTemplate {...props} colorScheme="emerald" tone={tone} />;
            case "neon_sky": return <NeonModernTemplate {...props} colorScheme="sky" tone={tone} />;
            case "neon_lime": return <NeonModernTemplate {...props} colorScheme="lime" tone={tone} />;
            case "neon_indigo": return <NeonModernTemplate {...props} colorScheme="indigo" tone={tone} />;
            case "neon_crimson": return <NeonModernTemplate {...props} colorScheme="crimson" tone={tone} />;
            case "neon_teal": return <NeonModernTemplate {...props} colorScheme="teal" tone={tone} />;
            case "neon_fuchsia": return <NeonModernTemplate {...props} colorScheme="fuchsia" tone={tone} />;
            case "neon_violet": return <NeonModernTemplate {...props} colorScheme="violet" tone={tone} />;
            case "neon_orange": return <NeonModernTemplate {...props} colorScheme="orange" tone={tone} />;
            case "neon_gs": return <NeonModernTemplate {...props} colorScheme="gs" tone={tone} />;
            case "neon_fb": return <NeonModernTemplate {...props} colorScheme="fb" tone={tone} />;
            case "neon_ts": return <NeonModernTemplate {...props} colorScheme="ts" tone={tone} />;
            case "neon_bjk": return <NeonModernTemplate {...props} colorScheme="bjk" tone={tone} />;
            case "neon_tr": return <NeonModernTemplate {...props} colorScheme="tr" tone={tone} />;
            default: return <NeonModernTemplate {...props} colorScheme="black" tone={tone} />;
        }
    }

    return (
        <>
            <AppointmentModal profile={profile} isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} t={t} />
            {renderTemplate()}

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={async (newReview: any) => {
                    try {
                        const res = await fetch("/api/review/create", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ...newReview, profileId: profile.id })
                        })
                        if (res.ok) {
                            setReviewStatus("Yorumunuz iletildi, onay sonrası yayınlanacaktır!")
                            setTimeout(() => setReviewStatus(null), 5000)
                        }
                    } catch (err) {
                        console.error(err)
                    }
                }}
                themeColor={profile.themeColor || "#0ea5e9"}
            />

            <AnimatePresence>
                {reviewStatus && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-8 py-4 rounded-full font-black shadow-2xl flex items-center gap-3 border border-emerald-400"
                    >
                        <CheckCircle2 size={20} /> {reviewStatus}
                    </motion.div>
                )}
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

function NeonModernTemplate({ profile, colorScheme, handleShare, handleCVView, reviews, setIsReviewModalOpen, setIsAppointmentOpen, trackEvent, tone }: any) {
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [reviews.length])

    // Tone specific styling
    const getToneStyle = (tone: string) => {
        switch (tone?.toLowerCase()) {
            case "profesyonel":
                return {
                    font: "font-sans",
                    rounded: "rounded-[2rem]",
                    border: "border-solid",
                    headerSize: "text-2xl",
                    expertiseStyle: "slow-rotate"
                };
            case "samimi":
                return {
                    font: "font-sans",
                    rounded: "rounded-[4rem]",
                    border: "border-none",
                    headerSize: "text-3xl",
                    expertiseStyle: "floating"
                };
            case "yaratıcı":
                return {
                    font: "font-mono",
                    rounded: "rounded-xl skew-x-1",
                    border: "border-dashed",
                    headerSize: "text-3xl",
                    expertiseStyle: "scattered"
                };
            case "lüks":
                return {
                    font: "font-serif",
                    rounded: "rounded-none",
                    border: "border-double border-4",
                    headerSize: "text-2xl uppercase tracking-[0.5em]",
                    expertiseStyle: "minimal"
                };
            default:
                return {
                    font: "font-sans",
                    rounded: "rounded-[3rem]",
                    border: "border-solid",
                    headerSize: "text-3xl",
                    expertiseStyle: "rotate"
                };
        }
    }

    const toneStyle = getToneStyle(tone)

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
        pink: {
            bg: "bg-[#1a0514]",
            card: "bg-[#2d0a21]/40",
            text: "text-white",
            subtext: "text-pink-200/60",
            border: "border-pink-500/20",
            glow: "shadow-[0_0_20px_rgba(236,72,153,0.5)]",
            accent: "#ec4899",
            btn: "bg-[#2d0a21]/60 border-pink-500/30",
            btnText: "text-white",
            icon: "text-[#ec4899]"
        },
        amber: {
            bg: "bg-[#1a1005]",
            card: "bg-[#2d1c0a]/40",
            text: "text-white",
            subtext: "text-amber-200/60",
            border: "border-amber-500/20",
            glow: "shadow-[0_0_20px_rgba(245,158,11,0.5)]",
            accent: "#f59e0b",
            btn: "bg-[#2d1c0a]/60 border-amber-500/30",
            btnText: "text-white",
            icon: "text-[#f59e0b]"
        },
        emerald: {
            bg: "bg-[#051a0f]",
            card: "bg-[#0a2d1c]/40",
            text: "text-white",
            subtext: "text-emerald-200/60",
            border: "border-emerald-500/20",
            glow: "shadow-[0_0_20px_rgba(16,185,129,0.5)]",
            accent: "#10b981",
            btn: "bg-[#0a2d1c]/60 border-emerald-500/30",
            btnText: "text-white",
            icon: "text-[#10b981]"
        },
        sky: {
            bg: "bg-[#05141a]",
            card: "bg-[#0a212d]/40",
            text: "text-white",
            subtext: "text-sky-200/60",
            border: "border-sky-500/20",
            glow: "shadow-[0_0_20px_rgba(14,165,233,0.5)]",
            accent: "#0ea5e9",
            btn: "bg-[#0a212d]/60 border-sky-500/30",
            btnText: "text-white",
            icon: "text-[#0ea5e9]"
        },
        lime: {
            bg: "bg-[#0f1a05]",
            card: "bg-[#1c2d0a]/40",
            text: "text-white",
            subtext: "text-lime-200/60",
            border: "border-lime-500/20",
            glow: "shadow-[0_0_20px_rgba(132,204,22,0.5)]",
            accent: "#84cc16",
            btn: "bg-[#1c2d0a]/60 border-lime-500/30",
            btnText: "text-white",
            icon: "text-[#84cc16]"
        },
        indigo: {
            bg: "bg-[#0a112d]",
            card: "bg-[#111c4a]/40",
            text: "text-white",
            subtext: "text-indigo-200/60",
            border: "border-indigo-500/20",
            glow: "shadow-[0_0_20px_rgba(99,102,241,0.5)]",
            accent: "#6366f1",
            btn: "bg-[#111c4a]/60 border-indigo-500/30",
            btnText: "text-white",
            icon: "text-[#6366f1]"
        },
        crimson: {
            bg: "bg-[#1a0505]",
            card: "bg-[#2d0a0a]/40",
            text: "text-white",
            subtext: "text-red-200/60",
            border: "border-[#dc2626]/20",
            glow: "shadow-[0_0_20px_rgba(220,38,38,0.5)]",
            accent: "#dc2626",
            btn: "bg-[#2d0a0a]/60 border-[#dc2626]/30",
            btnText: "text-white",
            icon: "text-[#dc2626]"
        },
        teal: {
            bg: "bg-[#051a1a]",
            card: "bg-[#0a2d2d]/40",
            text: "text-white",
            subtext: "text-teal-200/60",
            border: "border-teal-500/20",
            glow: "shadow-[0_0_20px_rgba(20,184,166,0.5)]",
            accent: "#14b8a6",
            btn: "bg-[#0a2d2d]/60 border-teal-500/30",
            btnText: "text-white",
            icon: "text-[#14b8a6]"
        },
        fuchsia: {
            bg: "bg-[#1a051a]",
            card: "bg-[#2d0a2d]/40",
            text: "text-white",
            subtext: "text-fuchsia-200/60",
            border: "border-fuchsia-500/20",
            glow: "shadow-[0_0_20px_rgba(217,70,239,0.5)]",
            accent: "#d946ef",
            btn: "bg-[#2d0a2d]/60 border-fuchsia-500/30",
            btnText: "text-white",
            icon: "text-[#d946ef]"
        },
        violet: {
            bg: "bg-[#11051a]",
            card: "bg-[#1d0a2d]/40",
            text: "text-white",
            subtext: "text-violet-200/60",
            border: "border-violet-500/20",
            glow: "shadow-[0_0_20px_rgba(139,92,246,0.5)]",
            accent: "#8b5cf6",
            btn: "bg-[#1d0a2d]/60 border-violet-500/30",
            btnText: "text-white",
            icon: "text-[#8b5cf6]"
        },
        orange: {
            bg: "bg-[#1a0f05]",
            card: "bg-[#2d1c0a]/40",
            text: "text-white",
            subtext: "text-orange-200/60",
            border: "border-orange-500/20",
            glow: "shadow-[0_0_20px_rgba(249,115,22,0.5)]",
            accent: "#f97316",
            btn: "bg-[#2d1c0a]/60 border-orange-500/30",
            btnText: "text-white",
            icon: "text-[#f97316]"
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
        },
        pinkwhite: {
            bg: "bg-rose-200",
            card: "bg-white/95",
            text: "text-rose-950",
            subtext: "text-rose-600",
            border: "border-rose-300/50",
            glow: "shadow-[0_0_20px_rgba(244,63,94,0.3)]",
            accent: "#f43f5e",
            btn: "bg-white border-rose-200",
            btnText: "text-rose-900",
            icon: "text-[#f43f5e]"
        },
        greywhite: {
            bg: "bg-slate-200",
            card: "bg-white/95",
            text: "text-slate-900",
            subtext: "text-slate-600",
            border: "border-slate-300",
            glow: "shadow-[0_0_20px_rgba(71,85,105,0.3)]",
            accent: "#475569",
            btn: "bg-white border-slate-300",
            btnText: "text-slate-900",
            icon: "text-[#475569]"
        },
        blueblack: {
            bg: "bg-[#020617]",
            card: "bg-[#1e293b]/40",
            text: "text-white",
            subtext: "text-blue-300/60",
            border: "border-blue-500/30",
            glow: "shadow-[0_0_30px_rgba(59,130,246,0.5)]",
            accent: "#3b82f6",
            btn: "bg-[#1e293b]/60 border-blue-500/40",
            btnText: "text-white",
            icon: "text-[#3b82f6]"
        },
        purplexwhite: {
            bg: "bg-purple-200",
            card: "bg-white/95",
            text: "text-purple-950",
            subtext: "text-purple-600",
            border: "border-purple-300/50",
            glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
            accent: "#a855f7",
            btn: "bg-white border-purple-200",
            btnText: "text-purple-900",
            icon: "text-[#a855f7]"
        },
        yellowwhite: {
            bg: "bg-amber-200",
            card: "bg-white/95",
            text: "text-amber-950",
            subtext: "text-amber-700",
            border: "border-amber-300/50",
            glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
            accent: "#f59e0b",
            btn: "bg-white border-amber-200",
            btnText: "text-amber-900",
            icon: "text-[#f59e0b]"
        },
        mintgreen: {
            bg: "bg-emerald-200",
            card: "bg-white/95",
            text: "text-emerald-950",
            subtext: "text-emerald-700",
            border: "border-emerald-300/50",
            glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
            accent: "#10b981",
            btn: "bg-white border-emerald-200",
            btnText: "text-emerald-900",
            icon: "text-[#10b981]"
        },
        electricviolet: {
            bg: "bg-[#05010d]",
            card: "bg-[#1a0b3d]/40",
            text: "text-white",
            subtext: "text-violet-300/60",
            border: "border-violet-500/30",
            glow: "shadow-[0_0_30px_rgba(139,92,246,0.6)]",
            accent: "#8b5cf6",
            btn: "bg-[#1a0b3d]/60 border-violet-500/40",
            btnText: "text-white",
            icon: "text-[#8b5cf6]"
        },
        crimson_dark: {
            bg: "bg-[#0a0000]",
            card: "bg-[#2d0a0a]/40",
            text: "text-white",
            subtext: "text-red-300/60",
            border: "border-red-500/30",
            glow: "shadow-[0_0_30px_rgba(220,38,38,0.5)]",
            accent: "#dc2626",
            btn: "bg-[#2d0a0a]/60 border-red-500/40",
            btnText: "text-white",
            icon: "text-[#dc2626]"
        },
        ocean_light: {
            bg: "bg-sky-200",
            card: "bg-white/95",
            text: "text-sky-950",
            subtext: "text-sky-700",
            border: "border-sky-300/50",
            glow: "shadow-[0_0_20px_rgba(14,165,233,0.3)]",
            accent: "#0ea5e9",
            btn: "bg-white border-sky-200",
            btnText: "text-sky-900",
            icon: "text-[#0ea5e9]"
        },
        sunset_rose: {
            bg: "bg-[#030712]",
            card: "bg-black/60",
            text: "text-[#f43f5e]",
            subtext: "text-orange-300/60",
            border: "border-[#f43f5e]/30",
            glow: "shadow-[0_0_30px_rgba(244,63,94,0.4)]",
            accent: "#f43f5e",
            btn: "bg-black/60 border-[#f43f5e]/40",
            btnText: "text-[#f43f5e]",
            icon: "text-[#f43f5e]"
        }
    }[colorScheme as 'black' | 'white' | 'blue' | 'green' | 'purple' | 'red' | 'gold' | 'rose' | 'cyan' | 'gs' | 'fb' | 'ts' | 'bjk' | 'tr' | 'greenwhite' | 'greenblack' | 'orangeblack' | 'pinkwhite' | 'greywhite' | 'blueblack' | 'purplexwhite' | 'yellowwhite' | 'mintgreen' | 'electricviolet' | 'crimson_dark' | 'ocean_light' | 'sunset_rose'] || {
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
        { label: "Ara", icon: <Phone size={20} />, href: `tel:${socialLinks.find((l: any) => l.platform === 'phone')?.url}`, onClick: () => trackEvent("phone"), active: !!socialLinks.find((l: any) => l.platform === 'phone')?.url },
        { label: "WhatsApp", icon: <MessageCircle size={20} />, href: `https://wa.me/${socialLinks.find((l: any) => l.platform === 'phone')?.url?.replace(/\D/g, '')}`, onClick: () => trackEvent("whatsapp"), active: !!socialLinks.find((l: any) => l.platform === 'phone')?.url },
        { label: "E-Mail", icon: <Mail size={20} />, href: `mailto:${profile.user.email}`, onClick: () => trackEvent("email"), active: !!profile.user.email },
        {
            label: "Randevu Al", icon: <Calendar size={20} />, onClick: () => {
                trackEvent("appointment")
                setIsAppointmentOpen(true)
            }, active: !!profile.showAppointmentBtn
        },
        { label: "Web Site", icon: <Globe size={20} />, href: socialLinks.find((l: any) => l.platform === 'website')?.url, onClick: () => trackEvent("website"), active: !!socialLinks.find((l: any) => l.platform === 'website')?.url },
        { label: "Konum", icon: <MapPin size={20} />, href: socialLinks.find((l: any) => l.platform === 'location')?.url, onClick: () => trackEvent("location"), active: !!socialLinks.find((l: any) => l.platform === 'location')?.url },
    ].filter(a => a.active)

    return (
        <div className={cn("min-h-screen flex items-center justify-center p-4 relative overflow-hidden", theme.bg, toneStyle.font)}>
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 blur-[120px] opacity-20 rounded-full" style={{ background: theme.accent }} />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 blur-[120px] opacity-20 rounded-full" style={{ background: theme.accent }} />
            </div>

            <main className="relative z-10 w-full max-w-[420px] space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("border p-8 space-y-8 backdrop-blur-3xl shadow-2xl relative", theme.card, theme.border, toneStyle.rounded, toneStyle.border)}
                >
                    {/* Share Button Top Right */}
                    <div className="absolute top-6 right-6 z-30">
                        <button
                            onClick={handleShare}
                            className={cn("w-10 h-10 border flex items-center justify-center backdrop-blur-xl transition-all hover:scale-110 active:scale-95", theme.btn, theme.border, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                        >
                            <Share2 size={18} className={theme.icon} />
                        </button>
                    </div>

                    {/* Profile Section */}
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="relative w-32 h-32 group">
                            {/* Expertise Icons Container */}
                            {toneStyle.expertiseStyle !== 'minimal' && (
                                <motion.div
                                    className="absolute inset-0 z-20 pointer-events-none"
                                    animate={toneStyle.expertiseStyle === 'slow-rotate' ? { rotate: 360 } : toneStyle.expertiseStyle === 'scattered' ? { rotate: [0, 10, -10, 0] } : { rotate: 360 }}
                                    transition={toneStyle.expertiseStyle === 'slow-rotate' ? { duration: 120, repeat: Infinity, ease: "linear" } : toneStyle.expertiseStyle === 'scattered' ? { duration: 10, repeat: Infinity } : { duration: 60, repeat: Infinity, ease: "linear" }}
                                >
                                    {(profile.services || []).slice(0, 6).map((service: any, i: number, arr: any[]) => {
                                        const angle = (i * (360 / arr.length) - 90) * (Math.PI / 180);
                                        const radius = 80;
                                        const x = Math.cos(angle) * radius;
                                        const y = Math.sin(angle) * radius;

                                        const getIcon = (title: string) => {
                                            const t = title.toLowerCase();
                                            if (t.includes('satış') || t.includes('sales') || t.includes('pazar') || t.includes('market')) return <Trophy size={14} />;
                                            if (t.includes('strateji') || t.includes('strategy') || t.includes('plan')) return <Target size={14} />;
                                            if (t.includes('inovasyon') || t.includes('innovation') || t.includes('süreç') || t.includes('process')) return <Zap size={14} />;
                                            if (t.includes('müşteri') || t.includes('customer') || t.includes('crm') || t.includes('ilişki')) return <Users size={14} />;
                                            if (t.includes('yazılım') || t.includes('code') || t.includes('software') || t.includes('geliştirme')) return <Code size={14} />;
                                            if (t.includes('tasarım') || t.includes('design') || t.includes('grafik')) return <Palette size={14} />;
                                            if (t.includes('hukuk') || t.includes('law') || t.includes('legal')) return <Shield size={14} />;
                                            if (t.includes('finans') || t.includes('money') || t.includes('bank')) return <Briefcase size={14} />;
                                            return <Zap size={14} />;
                                        };

                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={toneStyle.expertiseStyle === 'floating' ? {
                                                    opacity: 1, scale: 1,
                                                    y: [0, -10, 0],
                                                    transition: { delay: 0.5 + i * 0.1, y: { duration: 3 + i, repeat: Infinity } }
                                                } : { opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.5 + i * 0.1 }}
                                                className="absolute flex flex-col items-center gap-1 pointer-events-auto group/icon"
                                                style={{
                                                    left: `calc(50% + ${x}px)`,
                                                    top: `calc(50% + ${y}px)`,
                                                    transform: 'translate(-50%, -50%)'
                                                }}
                                            >
                                                <motion.div
                                                    animate={{ rotate: -360 }}
                                                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                                    className={cn("w-8 h-8 glass border border-white/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all hover:scale-125 hover:border-white hover:bg-white/10 relative", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-full")}
                                                    style={{
                                                        color: theme.accent,
                                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                >
                                                    {getIcon(service.title)}

                                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-all duration-300 whitespace-nowrap bg-black/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-black text-white pointer-events-none border border-white/10 shadow-2xl scale-50 group-hover/icon:scale-100">
                                                        {service.title}
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}

                            <motion.div
                                animate={{
                                    boxShadow: [
                                        `0 0 0px ${theme.accent}00`,
                                        `0 0 20px ${theme.accent}40`,
                                        `0 0 0px ${theme.accent}00`
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className={cn("w-32 h-32 p-1 border-2 relative z-10 overflow-hidden", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-full")}
                                style={{ borderColor: theme.accent }}
                            >
                                <img src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`} className={cn("w-full h-full object-cover", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-full")} />
                            </motion.div>
                            <div className="absolute inset-[-10px] rounded-full blur-2xl opacity-20 animate-pulse" style={{ background: theme.accent }} />
                        </div>

                        <div>
                            <h1 className={cn("font-black tracking-tight", theme.text, toneStyle.headerSize)}>{profile.user.name}</h1>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <div className="h-[1px] w-4 rounded-full opacity-30" style={{ background: theme.accent }} />
                                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80" style={{ color: theme.accent }}>{profile.occupation || "WEB DEVELOPER"}</p>
                                <div className="h-[1px] w-4 rounded-full opacity-30" style={{ background: theme.accent }} />
                            </div>

                            {/* Project Marquee Section */}
                            {profile.products && profile.products.filter((p: any) => p.image).length > 0 && (
                                <div className="mt-6 space-y-4 group/marquee">
                                    <style>{`
                                        @keyframes marquee-right {
                                            0% { transform: translateX(-50%); }
                                            100% { transform: translateX(0); }
                                        }
                                        .animate-marquee-right {
                                            display: flex;
                                            width: max-content;
                                            animation: marquee-right 20s linear infinite;
                                        }
                                        .group\\/marquee:hover .animate-marquee-right {
                                            animation-play-state: paused;
                                        }
                                    `}</style>
                                    <h3 className={cn("text-[9px] font-black uppercase tracking-[0.3em] opacity-40", theme.text)}>Projelerim</h3>
                                    <div className="relative -mt-24 pt-24 pb-4 overflow-hidden w-full max-w-[320px] mx-auto">
                                        <div className="animate-marquee-right flex gap-4">
                                            {[...profile.products.filter((p: any) => p.image), ...profile.products.filter((p: any) => p.image), ...profile.products.filter((p: any) => p.image)].map((project: any, i: number) => (
                                                <a
                                                    key={i}
                                                    href={project.link || "#"}
                                                    target="_blank"
                                                    onClick={() => trackEvent("product", project.name)}
                                                    className={cn("w-10 h-10 border border-white/20 overflow-visible shadow-lg flex-shrink-0 bg-white/5 backdrop-blur-sm p-0.5 group/prj transition-all hover:scale-125 cursor-pointer block relative", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-full")}
                                                >
                                                    <img src={project.image} alt={project.name} className={cn("w-full h-full object-cover", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-full")} />

                                                    {/* Rich Tooltip */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover/prj:opacity-100 transition-all duration-300 w-48 bg-[#0f172a] border border-white/10 p-4 rounded-2xl text-left pointer-events-none shadow-[0_20px_50px_rgba(0,0,0,0.8)] scale-50 group-hover/prj:scale-100 z-[110] backdrop-blur-3xl">
                                                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0f172a] border-r border-b border-white/10 rotate-45" />
                                                        <h4 className="text-[11px] font-black text-white uppercase tracking-wider mb-1.5 line-clamp-1">{project.name}</h4>
                                                        {project.description ? (
                                                            <p className="text-[10px] text-white/60 leading-relaxed line-clamp-4 font-medium">{project.description}</p>
                                                        ) : (
                                                            <p className="text-[10px] text-white/40 italic font-medium">Bu proje için açıklama girilmemiş.</p>
                                                        )}
                                                    </div>
                                                </a>
                                            ))}
                                        </div>

                                        {/* Fading gradients */}
                                        <div className="absolute inset-y-0 left-0 w-12 z-10 pointer-events-none opacity-50" style={{ background: `linear-gradient(to right, ${theme.bg.replace('bg-[', '').replace(']', '')}, transparent)` }} />
                                        <div className="absolute inset-y-0 right-0 w-12 z-10 pointer-events-none opacity-50" style={{ background: `linear-gradient(to left, ${theme.bg.replace('bg-[', '').replace(']', '')}, transparent)` }} />
                                    </div>
                                </div>
                            )}

                            {profile.slogan && <p className={cn("text-sm font-bold mt-4 opacity-70 italic", theme.text)}>“{profile.slogan}”</p>}
                        </div>
                    </div >

                    <div className="space-y-3">
                        {
                            actions.map((action, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                >
                                    {action.href ? (
                                        <a
                                            href={action.href}
                                            target="_blank"
                                            onClick={() => {
                                                if (action.onClick) action.onClick()
                                            }}
                                            className={cn("w-full py-4 px-6 border flex items-center gap-4 transition-all shadow-lg cursor-pointer", theme.btn, theme.border, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                                        >
                                            <div style={{ color: theme.accent }}>{action.icon}</div>
                                            <span className={cn("flex-1 text-center font-black text-sm uppercase tracking-widest", theme.btnText)}>{action.label}</span>
                                        </a>
                                    ) : (
                                        <button
                                            onClick={action.onClick}
                                            className={cn("w-full py-4 px-6 border flex items-center gap-4 transition-all shadow-lg cursor-pointer", theme.btn, theme.border, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                                        >
                                            <div style={{ color: theme.accent }}>{action.icon}</div>
                                            <span className={cn("flex-1 text-center font-black text-sm uppercase tracking-widest", theme.btnText)}>{action.label}</span>
                                        </button>
                                    )}
                                </motion.div>
                            ))
                        }
                    </div>

                    {/* Bio */}
                    {
                        profile.bio && (
                            <p className={cn("text-center text-xs font-medium leading-relaxed px-4", theme.subtext)}>
                                {profile.bio}
                            </p>
                        )
                    }

                    {/* Testimonials */}
                    <div className="pt-4 overflow-hidden relative">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className={cn("text-[10px] font-black uppercase tracking-[0.2em] opacity-40", theme.text)}>Yorumlar</h3>
                            <button
                                onClick={() => setIsReviewModalOpen(true)}
                                className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 border transition-all", theme.btn, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-full")}
                                style={{ color: theme.accent }}
                            >
                                + Yorum Yaz
                            </button>
                        </div>

                        <div className="relative h-40">
                            {reviews.length > 0 ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentReviewIndex}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        className={cn("absolute inset-0 p-5 border flex flex-col justify-between", theme.card, theme.border, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-3xl")}
                                    >
                                        <div className="flex gap-4">
                                            <div className={cn("w-12 h-12 border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center relative", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-full")}>
                                                <img
                                                    src={reviews[currentReviewIndex].image || `https://ui-avatars.com/api/?name=${reviews[currentReviewIndex].name}&background=random&color=fff`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e: any) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${reviews[currentReviewIndex].name}&background=random&color=fff`;
                                                    }}
                                                />
                                            </div>
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
                            ) : (
                                <div className={cn("absolute inset-0 p-5 border flex items-center justify-center italic opacity-40 text-xs", theme.card, theme.border, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-3xl")}>
                                    Henüz yorum yapılmamış.
                                </div>
                            )}
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-1.5 mt-4">
                            {reviews.map((_: any, i: number) => (
                                <div
                                    key={i}
                                    className="h-1 transition-all"
                                    style={{
                                        width: i === currentReviewIndex ? '16px' : '4px',
                                        background: i === currentReviewIndex ? theme.accent : 'rgba(255,255,255,0.1)',
                                        borderRadius: '99px'
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
                            className={cn("flex-1 py-5 border flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 shadow-xl", theme.btn, theme.btnText, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                        >
                            <Share2 size={20} /> Paylaş
                        </button>

                        <button
                            onClick={handleCVView}
                            className={cn("flex-1 py-5 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 text-white shadow-xl", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                            style={{
                                background: `linear-gradient(45deg, ${(theme as any).cvAccent || theme.accent}, ${(theme as any).cvAccent || theme.accent}cc)`,
                                boxShadow: `0 10px 30px -10px ${(theme as any).cvAccent || theme.accent}60`
                            }}
                        >
                            <FileText size={20} /> CV Görüntüle
                        </button>
                    </div>
                </motion.div >
            </main >
        </div >
    )
}

function ReviewModal({ isOpen, onClose, onSubmit, themeColor }: any) {
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        content: "",
        rating: 5,
        gender: "male" // male or female
    })

    if (!isOpen) return null

    const handleSubmit = () => {
        if (!formData.name || !formData.content) return

        // Modern 3D/Glass Style Avatars based on gender
        const image = formData.gender === 'female'
            ? "https://avatar.iran.liara.run/public/65" // Standard female avatar
            : "https://avatar.iran.liara.run/public/31" // Standard male avatar

        onSubmit({ ...formData, image, id: Date.now() })
        setFormData({
            name: "",
            title: "",
            content: "",
            rating: 5,
            gender: "male"
        })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative w-full max-w-md bg-slate-900/90 border border-white/10 rounded-[3rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden"
            >
                {/* Glow Effect */}
                <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-20" style={{ background: themeColor }} />

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-10">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Deneyimini Paylaş</h3>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Görüşleriniz bizim için değerlidir</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-white/40 transition-all active:scale-90"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Rating Section */}
                        <div className="flex flex-col items-center gap-4 py-4 bg-white/5 rounded-3xl border border-white/5">
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Puanın</span>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="transition-all hover:scale-125 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                    >
                                        <Star
                                            size={28}
                                            className={cn(
                                                "transition-colors duration-300",
                                                star <= formData.rating ? "fill-amber-400 text-amber-400" : "text-white/10"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gender selection with Icons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setFormData({ ...formData, gender: 'male' })}
                                className={cn(
                                    "group relative flex flex-col items-center gap-3 py-6 rounded-3xl border transition-all duration-300 overflow-hidden",
                                    formData.gender === 'male'
                                        ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                                        : "bg-white/5 border-white/5 text-white/20 hover:bg-white/10 hover:border-white/10"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                                    formData.gender === 'male' ? "bg-blue-500 text-white shadow-lg" : "bg-white/5 text-white/20"
                                )}>
                                    <User size={24} />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-wider">Erkek</span>
                                {formData.gender === 'male' && <motion.div layoutId="gender_active" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />}
                            </button>

                            <button
                                onClick={() => setFormData({ ...formData, gender: 'female' })}
                                className={cn(
                                    "group relative flex flex-col items-center gap-3 py-6 rounded-3xl border transition-all duration-300 overflow-hidden",
                                    formData.gender === 'female'
                                        ? "bg-rose-600/20 border-rose-500 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.1)]"
                                        : "bg-white/5 border-white/5 text-white/20 hover:bg-white/10 hover:border-white/10"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                                    formData.gender === 'female' ? "bg-rose-500 text-white shadow-lg" : "bg-white/5 text-white/20"
                                )}>
                                    <UserCircle size={24} />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-wider">Bayan</span>
                                {formData.gender === 'female' && <motion.div layoutId="gender_active" className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />}
                            </button>
                        </div>

                        {/* Form Inputs */}
                        <div className="space-y-4">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Adınız Soyadınız"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/10 transition-all text-sm font-medium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Ünvanınız (Örn: Yazılım Geliştirici)"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/10 transition-all text-sm font-medium"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="relative group">
                                <textarea
                                    rows={4}
                                    placeholder="Yorumunuz..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/10 transition-all text-sm font-medium resize-none"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!formData.name || !formData.content}
                            className="group relative w-full py-6 rounded-[2rem] text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-2xl overflow-hidden"
                            style={{ background: themeColor }}
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                <MessageSquare size={18} />
                                Yorumu Yayınla
                            </span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
