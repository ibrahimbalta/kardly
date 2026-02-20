"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useMotionValue, useTransform, animate, useSpring } from "framer-motion"
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
    Shield,
    UserPlus,
    ShoppingBag,
    Activity,
    Volume2,
    VolumeX,
    Sparkles,
    Layers,
    TrendingUp,
    Brain,
    Flame
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
    isCatalog?: boolean;
    paymentLink?: string;
    paymentType?: string;
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────

export default function ProfileClient({ profile }: { profile: any }) {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
    const [lang, setLang] = useState("tr")
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [reviews, setReviews] = useState(profile.reviews?.length > 0 ? profile.reviews : [
        { id: '1', name: "Fatih Yaman", title: "CEO, XYZ Şirketi", content: "Şirketimizin test sürecini mükemmel bir şekilde yönetti. Kesinlikle tavsiye ederim!", rating: 5, gender: 'male', image: "https://avatar.iran.liara.run/public/31" },
        { id: '2', name: "Zeynep Kaya", title: "Yazılım Müdürü", content: "Teknik bilgisi ve problem çözme hızı gerçekten etkileyici.", rating: 5, gender: 'female', image: "https://avatar.iran.liara.run/public/65" },
        { id: '3', name: "Ali Yılmaz", title: "Proje Yöneticisi", content: "İletişimi çok güçlü ve teslimatları her zaman zamanında yapıyor.", rating: 4, gender: 'male', image: "https://avatar.iran.liara.run/public/48" }
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

    const handleAddToContacts = () => {
        trackEvent("vcard")
        const phone = profile.socialLinks?.find((l: any) => l.platform === 'phone')?.url || ""
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.user.name}
ORG:${profile.occupation || ""}
TEL;TYPE=CELL:${phone}
EMAIL:${profile.user.email || ""}
END:VCARD`

        const blob = new Blob([vcard], { type: "text/vcard" })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `${profile.user.name}.vcf`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    if (!mounted) return <div className="min-h-screen bg-[#020617] flex items-center justify-center font-sans"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>

    const props = { profile, t, lang, setIsAppointmentOpen, isAppointmentOpen, handleShare, handleCVView, handleAddToContacts, reviews, setIsReviewModalOpen, trackEvent }

    // Get active accent color for review modal
    const getActiveAccent = (): string => {
        const colorMap: Record<string, string> = {
            black: "#0ea5e9", white: "#3b82f6", blue: "#38bdf8", green: "#22c55e", purple: "#a855f7",
            red: "#ef4444", gold: "#fbbf24", rose: "#f43f5e", cyan: "#06b6d4", pink: "#ec4899",
            amber: "#f59e0b", emerald: "#10b981", sky: "#0ea5e9", lime: "#84cc16", indigo: "#6366f1",
            crimson: "#dc2626", teal: "#14b8a6", fuchsia: "#d946ef", violet: "#8b5cf6", orange: "#f97316",
            gs: "#fbbf24", fb: "#fbbf24", ts: "#38bdf8", bjk: "#ffffff", tr: "#ffffff",
            neon_cyber: "#0ef", neon_galaxy: "#a855f7", neon_acid: "#bef264", neon_candy: "#f472b6", neon_aurora: "#2dd4bf",
            greenwhite: "#ffffff", greenblack: "#22c55e", orangeblack: "#f97316", pinkwhite: "#f43f5e",
            greywhite: "#475569", blueblack: "#3b82f6", purplexwhite: "#a855f7", yellowwhite: "#f59e0b",
            mintgreen: "#10b981", electricviolet: "#8b5cf6", crimson_dark: "#dc2626", ocean_light: "#0ea5e9",
            sunset_rose: "#f43f5e", pro_dietitian: "#22c55e", pro_lawyer: "#d4af37", pro_architect: "#0ea5e9",
            pro_realestate: "#fbbf24", pro_artistic: "#f472b6", pro_software: "#10b981", pro_doctor: "#0ea5e9",
            pro_chef: "#f97316", pro_barber: "#ffffff", pro_fitness: "#84cc16", pro_photographer: "#000000",
            pro_musician: "#6366f1", pro_beauty: "#f43f5e", pro_finance: "#334155", pro_gamer: "#00ff9f",
            retro_mac: "#94a3b8", retro_news: "#000000", retro_synth: "#f472b6", luxury_gold: "#fbbf24",
            luxury_silver: "#94a3b8", luxury_marble: "#18181b", life_gamer: "#ef4444", life_travel: "#d97706",
            life_zen: "#22c55e", future_holo: "#06b6d4", future_glass: "#38bdf8",
            dream_mist: "#f472b6", dream_nebula: "#a855f7", dark_onyx: "#0ea5e9",
            dark_stealth: "#ef4444", light_prism: "#38bdf8", light_solar: "#fbbf24",
            cyber_glitch: "#0ef", cyber_vapor: "#f472b6", antique_gold: "#fbbf24",
            antique_myth: "#94a3b8", liquid_lava: "#ef4444", liquid_ocean: "#38bdf8",
            pop_comic: "#fbbf24", pop_graffiti: "#a855f7", zen_garden: "#22c55e",
            zen_focus: "#6366f1", adventure_peak: "#38bdf8", adventure_safari: "#d97706",
            celestial_star: "#fbbf24", celestial_sun: "#FACC15", minimal_pure: "#000000",
            minimal_graphite: "#4b5563", ind_concrete: "#64748b", ind_rusty: "#b45309",
            vibe_bolt: "#facc15", vibe_pulse: "#ef4444", royal_velvet: "#a855f7",
            royal_emerald: "#10b981", tech_core: "#38bdf8", tech_atom: "#6366f1",
            meta_portal: "#f472b6", meta_pixel: "#38bdf8"
        };
        const schemeKey = (profile.templateId || "neon_black").replace("neon_", "");
        return colorMap[schemeKey] || colorMap[profile.templateId || ""] || "#0ea5e9";
    };
    const activeAccent = getActiveAccent();

    // Template Selector Logic
    const renderTemplate = () => {
        const tone = profile.tone?.toLowerCase() || "profesyonel"

        const validPrefixes = ["pattern_", "pro_", "retro_", "luxury_", "life_", "future_", "dream_", "dark_", "light_", "cyber_", "antique_", "liquid_", "pop_", "zen_", "adventure_", "celestial_", "minimal_", "ind_", "vibe_", "royal_", "tech_", "meta_"];
        if (validPrefixes.some(p => profile.templateId?.startsWith(p))) {
            return <NeonModernTemplate {...props} colorScheme={profile.templateId} tone={tone} />;
        }

        return <NeonModernTemplate {...props} colorScheme="black" tone={tone} />;
    }

    return (
        <>
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
                themeColor={activeAccent}
                t={t}
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

function BackgroundMusicPlayer({ theme, tone }: any) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play error:", e));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <audio ref={audioRef} loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
            <motion.button
                onClick={togglePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn("w-12 h-12 flex items-center justify-center border shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all", theme.btn, theme.border, "rounded-full")}
            >
                {isPlaying && (
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0"
                        style={{ backgroundColor: theme.accent }}
                    />
                )}
                <div className="relative z-10">
                    {isPlaying ? <Volume2 size={20} style={{ color: theme.accent }} /> : <VolumeX size={20} className="opacity-40" />}
                </div>
            </motion.button>
        </div>
    );
}

function NeonModernTemplate({ profile, colorScheme, handleShare, handleCVView, handleAddToContacts, reviews, setIsReviewModalOpen, setIsAppointmentOpen, isAppointmentOpen, t, trackEvent, tone }: any) {
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

    const getYoutubeEmbedUrl = (url: string) => {
        if (!url) return ""
        let videoId = ""
        if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0]
        else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0]
        else if (url.includes("embed/")) videoId = url.split("embed/")[1].split("?")[0]
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=0` : ""
    }

    const formatUrl = (url?: string) => {
        if (!url) return ""
        const trimmed = url.trim()
        if (!trimmed) return ""
        if (
            trimmed.startsWith('http://') ||
            trimmed.startsWith('https://') ||
            trimmed.startsWith('tel:') ||
            trimmed.startsWith('mailto:')
        ) {
            return trimmed
        }
        return `https://${trimmed}`
    }

    // Dynamic Tone Style Logic
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
                    rounded: "rounded-[3rem]",
                    border: "border-double border-4",
                    headerSize: "text-2xl uppercase tracking-[0.5em]",
                    expertiseStyle: "slow-rotate"
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

    const getIcon = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes('satış') || t.includes('sales') || t.includes('pazar') || t.includes('mağaza') || t.includes('market')) return <ShoppingBag size={14} />;
        if (t.includes('strateji') || t.includes('strategy') || t.includes('plan') || t.includes('yönetim')) return <Target size={14} />;
        if (t.includes('inovasyon') || t.includes('innovation') || t.includes('süreç') || t.includes('process') || t.includes('teknoloji')) return <Zap size={14} />;
        if (t.includes('müşteri') || t.includes('customer') || t.includes('crm') || t.includes('destek')) return <Users size={14} />;
        if (t.includes('yazılım') || t.includes('code') || t.includes('software') || t.includes('geliştirme') || t.includes('bilişim')) return <Code size={14} />;
        if (t.includes('tasarım') || t.includes('design') || t.includes('grafik') || t.includes('sanat')) return <Palette size={14} />;
        if (t.includes('hukuk') || t.includes('law') || t.includes('legal') || t.includes('adalet')) return <Shield size={14} />;
        if (t.includes('finans') || t.includes('money') || t.includes('bank') || t.includes('yatırım')) return <Briefcase size={14} />;
        if (t.includes('eğitim') || t.includes('ders') || t.includes('okul') || t.includes('akadem')) return <Trophy size={14} />;
        if (t.includes('sağlık') || t.includes('tıp') || t.includes('doctor') || t.includes('doktor')) return <Activity size={14} />;
        return <Zap size={14} />;
    };

    const themes: Record<string, any> = {
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
        },
        cyber: {
            bg: "bg-[#00050a]",
            card: "bg-black/40",
            text: "text-[#0ef]",
            subtext: "text-pink-400/60",
            border: "border-[#0ef]/30",
            glow: "shadow-[0_0_30px_rgba(0,238,255,0.4)]",
            accent: "#0ef",
            btn: "bg-black/40 border-pink-500/30",
            btnText: "text-[#0ef]",
            icon: "text-[#f0f]",
            special: "cyber"
        },
        galaxy: {
            bg: "bg-[#050010]",
            card: "bg-black/40",
            text: "text-[#a855f7]",
            subtext: "text-cyan-300/60",
            border: "border-purple-500/30",
            glow: "shadow-[0_0_30px_rgba(168,85,247,0.4)]",
            accent: "#a855f7",
            btn: "bg-black/40 border-cyan-500/30",
            btnText: "text-white",
            icon: "text-cyan-400",
            special: "galaxy"
        },
        acid: {
            bg: "bg-[#051000]",
            card: "bg-black/40",
            text: "text-[#bef264]",
            subtext: "text-yellow-200/60",
            border: "border-lime-500/30",
            glow: "shadow-[0_0_30px_rgba(190,242,100,0.4)]",
            accent: "#bef264",
            btn: "bg-black/40 border-yellow-500/30",
            btnText: "text-[#bef264]",
            icon: "text-yellow-400",
            special: "acid"
        },
        candy: {
            bg: "bg-[#10000a]",
            card: "bg-black/40",
            text: "text-[#f472b6]",
            subtext: "text-violet-200/60",
            border: "border-pink-500/30",
            glow: "shadow-[0_0_30px_rgba(244,114,182,0.4)]",
            accent: "#f472b6",
            btn: "bg-black/40 border-violet-500/30",
            btnText: "text-white",
            icon: "text-violet-400",
            special: "candy"
        },
        aurora: {
            bg: "bg-[#000a0a]",
            card: "bg-black/40",
            text: "text-[#2dd4bf]",
            subtext: "text-indigo-200/60",
            border: "border-teal-500/30",
            glow: "shadow-[0_0_30px_rgba(45,212,191,0.4)]",
            accent: "#2dd4bf",
            btn: "bg-black/40 border-indigo-500/30",
            btnText: "text-white",
            icon: "text-indigo-400",
            special: "aurora"
        },
        // Artistic & Patterned Themes
        pattern_ottoman: {
            bg: "bg-[#0c1421]",
            card: "bg-black/60",
            text: "text-amber-200",
            subtext: "text-amber-500/60",
            border: "border-amber-500/30",
            glow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]",
            accent: "#d4af37",
            btn: "bg-black/40 border-amber-500/30",
            btnText: "text-amber-200",
            icon: "text-amber-400",
            special: "ottoman"
        },
        pattern_geometric: {
            bg: "bg-slate-950",
            card: "bg-slate-900/40",
            text: "text-white",
            subtext: "text-slate-400",
            border: "border-slate-800",
            glow: "shadow-[0_0_30px_rgba(255,255,255,0.1)]",
            accent: "#ffffff",
            btn: "bg-white/5 border-white/10",
            btnText: "text-white",
            icon: "text-white",
            special: "geometric"
        },
        pattern_marble: {
            bg: "bg-zinc-100",
            card: "bg-white/80",
            text: "text-zinc-900",
            subtext: "text-zinc-500",
            border: "border-zinc-200",
            glow: "shadow-[0_0_20px_rgba(0,0,0,0.05)]",
            accent: "#18181b",
            btn: "bg-white border-zinc-200",
            btnText: "text-zinc-900",
            icon: "text-zinc-900",
            special: "marble"
        },
        pattern_topo: {
            bg: "bg-[#050505]",
            card: "bg-black/40",
            text: "text-emerald-400",
            subtext: "text-emerald-900",
            border: "border-emerald-900/30",
            glow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]",
            accent: "#10b981",
            btn: "bg-black/40 border-emerald-900/30",
            btnText: "text-emerald-400",
            icon: "text-emerald-500",
            special: "topo"
        },
        pattern_circuit: {
            bg: "bg-[#050505]",
            card: "bg-black/40",
            text: "text-cyan-400",
            subtext: "text-cyan-900",
            border: "border-cyan-900/30",
            glow: "shadow-[0_0_30px_rgba(6,182,212,0.2)]",
            accent: "#06b6d4",
            btn: "bg-black/40 border-cyan-900/30",
            btnText: "text-cyan-400",
            icon: "text-cyan-500",
            special: "circuit"
        },
        pro_dietitian: {
            bg: "bg-[#f0f9f0]",
            card: "bg-white/80",
            text: "text-[#166534]",
            subtext: "text-[#15803d]/60",
            border: "border-[#bbf7d0]",
            glow: "shadow-[0_0_30px_rgba(34,197,94,0.15)]",
            accent: "#22c55e",
            btn: "bg-[#f0f9f0] border-[#bbf7d0]",
            btnText: "text-[#166534]",
            icon: "text-[#22c55e]",
            special: "dietitian"
        },
        pro_lawyer: {
            bg: "bg-[#0f172a]",
            card: "bg-white/5",
            text: "text-[#f8fafc]",
            subtext: "text-[#94a3b8]",
            border: "border-[#1e293b]",
            glow: "shadow-[0_0_30px_rgba(212,175,55,0.2)]",
            accent: "#d4af37",
            btn: "bg-[#1e293b] border-[#d4af37]/30",
            btnText: "text-[#d4af37]",
            icon: "text-[#d4af37]",
            special: "lawyer"
        },
        pro_architect: {
            bg: "bg-[#1e293b]",
            card: "bg-[#0f172a]/80",
            text: "text-[#38bdf8]",
            subtext: "text-[#7dd3fc]/60",
            border: "border-[#0ea5e9]/30",
            glow: "shadow-[0_0_30px_rgba(14,165,233,0.2)]",
            accent: "#0ea5e9",
            btn: "bg-[#0f172a] border-[#0ea5e9]/30",
            btnText: "text-[#38bdf8]",
            icon: "text-[#38bdf8]",
            special: "architect"
        },
        pro_realestate: {
            bg: "bg-[#020617]",
            card: "bg-white/5",
            text: "text-white",
            subtext: "text-slate-400",
            border: "border-slate-800",
            glow: "shadow-[0_0_40px_rgba(251,191,36,0.15)]",
            accent: "#fbbf24",
            btn: "bg-slate-900 border-amber-500/30",
            btnText: "text-amber-400",
            icon: "text-amber-400",
            special: "realestate"
        },
        pro_artistic: {
            bg: "bg-[#050505]",
            card: "bg-[#111]/80",
            text: "text-[#f472b6]",
            subtext: "text-zinc-500",
            border: "border-zinc-800",
            glow: "shadow-[0_0_30px_rgba(244,114,182,0.3)]",
            accent: "#f472b6",
            btn: "bg-black border-pink-500/20",
            btnText: "text-pink-400",
            icon: "text-pink-500",
            special: "artistic"
        },
        pro_software: {
            bg: "bg-[#0a0a0b]",
            card: "bg-zinc-900/80",
            text: "text-emerald-400",
            subtext: "text-zinc-500",
            border: "border-emerald-500/20",
            glow: "shadow-[0_0_30px_rgba(16,185,129,0.15)]",
            accent: "#10b981",
            btn: "bg-zinc-950 border-emerald-900/30",
            btnText: "text-emerald-400",
            icon: "text-emerald-500",
            special: "software"
        },
        pro_doctor: {
            bg: "bg-[#f8fafc]",
            card: "bg-white/90",
            text: "text-[#0369a1]",
            subtext: "text-slate-500",
            border: "border-sky-100",
            glow: "shadow-[0_0_30px_rgba(14,165,233,0.1)]",
            accent: "#0ea5e9",
            btn: "bg-white border-sky-200",
            btnText: "text-sky-700",
            icon: "text-sky-500",
            special: "doctor"
        },
        pro_chef: {
            bg: "bg-[#1c1917]",
            card: "bg-stone-900/90",
            text: "text-orange-200",
            subtext: "text-stone-500",
            border: "border-orange-900/30",
            glow: "shadow-[0_0_30px_rgba(249,115,22,0.1)]",
            accent: "#f97316",
            btn: "bg-stone-950 border-orange-800/30",
            btnText: "text-orange-400",
            icon: "text-orange-500",
            special: "chef"
        },
        pro_barber: {
            bg: "bg-[#0c0c0c]",
            card: "bg-[#1a1a1a]/80",
            text: "text-white",
            subtext: "text-neutral-500",
            border: "border-neutral-800",
            glow: "shadow-[0_0_30px_rgba(255,255,255,0.05)]",
            accent: "#ffffff",
            btn: "bg-black border-neutral-700",
            btnText: "text-white",
            icon: "text-white",
            special: "barber"
        },
        pro_fitness: {
            bg: "bg-[#000000]",
            card: "bg-[#111]/90",
            text: "text-[#dcfce7]",
            subtext: "text-zinc-500",
            border: "border-lime-500/30",
            glow: "shadow-[0_0_40px_rgba(132,204,22,0.2)]",
            accent: "#84cc16",
            btn: "bg-black border-lime-500/20",
            btnText: "text-lime-400",
            icon: "text-lime-500",
            special: "fitness"
        },
        pro_photographer: {
            bg: "bg-white",
            card: "bg-white",
            text: "text-black",
            subtext: "text-neutral-400",
            border: "border-neutral-100",
            glow: "shadow-none",
            accent: "#000000",
            btn: "bg-black",
            btnText: "text-white",
            icon: "text-black",
            special: "photographer"
        },
        pro_musician: {
            bg: "bg-[#0f0714]",
            card: "bg-[#1e0d2d]/60",
            text: "text-indigo-200",
            subtext: "text-indigo-400/60",
            border: "border-indigo-500/30",
            glow: "shadow-[0_0_30px_rgba(99,102,241,0.2)]",
            accent: "#6366f1",
            btn: "bg-[#1e0d2d] border-indigo-500/30",
            btnText: "text-indigo-300",
            icon: "text-indigo-400",
            special: "musician"
        },
        pro_beauty: {
            bg: "bg-[#fff1f2]",
            card: "bg-white/80",
            text: "text-rose-900",
            subtext: "text-rose-400",
            border: "border-rose-100",
            glow: "shadow-[0_0_30px_rgba(244,63,94,0.1)]",
            accent: "#f43f5e",
            btn: "bg-white border-rose-200",
            btnText: "text-rose-600",
            icon: "text-rose-500",
            special: "beauty"
        },
        pro_finance: {
            bg: "bg-[#020617]",
            card: "bg-[#0f172a]/80",
            text: "text-slate-100",
            subtext: "text-slate-500",
            border: "border-slate-800",
            glow: "shadow-[0_0_30px_rgba(51,65,85,0.2)]",
            accent: "#334155",
            btn: "bg-slate-900 border-slate-700",
            btnText: "text-slate-300",
            icon: "text-slate-400",
            special: "finance"
        },
        pro_gamer: {
            bg: "bg-[#050505]",
            card: "bg-[#111]/80",
            text: "text-[#00ff9f]",
            subtext: "text-[#00ff9f]/40",
            border: "border-[#00ff9f]/20",
            glow: "shadow-[0_0_30px_rgba(0,255,159,0.2)]",
            accent: "#00ff9f",
            btn: "bg-black border-[#00ff9f]/30",
            btnText: "text-[#00ff9f]",
            icon: "text-[#00ff9f]",
            special: "gamer"
        },

        // Retro & Nostalji
        retro_mac: {
            bg: "bg-[#c0c0c0]",
            card: "bg-[#e0e0e0]",
            text: "text-black",
            subtext: "text-slate-600",
            border: "border-slate-400 border-2",
            glow: "shadow-[4px_4px_0px_#808080]",
            accent: "#475569",
            btn: "bg-[#d4d4d4] border-slate-500 border-2",
            btnText: "text-black",
            icon: "text-slate-700",
            special: "retro_mac"
        },
        retro_news: {
            bg: "bg-[#f4f1ea]",
            card: "bg-white/40",
            text: "text-stone-900",
            subtext: "text-stone-600",
            border: "border-stone-900 border-b-4",
            glow: "none",
            accent: "#1c1917",
            btn: "bg-stone-100 border-stone-800 border",
            btnText: "text-stone-900",
            icon: "text-stone-900",
            special: "retro_news"
        },
        retro_synth: {
            bg: "bg-[#0b031a]",
            card: "bg-purple-900/20",
            text: "text-[#f472b6]",
            subtext: "text-cyan-400",
            border: "border-pink-500/50",
            glow: "shadow-[0_0_40px_rgba(244,114,182,0.4)]",
            accent: "#f472b6",
            btn: "bg-indigo-950/40 border-cyan-400/30",
            btnText: "text-cyan-300",
            icon: "text-pink-400",
            special: "retro_synth"
        },

        // Lüks & Premium
        luxury_gold: {
            bg: "bg-[#0a0a0a]",
            card: "bg-zinc-900/90",
            text: "text-white",
            subtext: "text-amber-500/60",
            border: "border-amber-500/40",
            glow: "shadow-[0_0_50px_rgba(245,158,11,0.1)]",
            accent: "#fbbf24",
            btn: "bg-black border-amber-500/30",
            btnText: "text-amber-400",
            icon: "text-amber-500",
            special: "luxury_gold"
        },
        luxury_silver: {
            bg: "bg-[#0c1421]",
            card: "bg-slate-900/80",
            text: "text-slate-100",
            subtext: "text-slate-400",
            border: "border-slate-500/30",
            glow: "shadow-[0_0_30px_rgba(255,255,255,0.05)]",
            accent: "#94a3b8",
            btn: "bg-slate-800 border-slate-500/30",
            btnText: "text-slate-200",
            icon: "text-slate-300",
            special: "luxury_silver"
        },
        luxury_marble: {
            bg: "bg-white",
            card: "bg-white/80",
            text: "text-zinc-900",
            subtext: "text-zinc-500",
            border: "border-zinc-200",
            glow: "shadow-[0_10px_40px_rgba(0,0,0,0.05)]",
            accent: "#18181b",
            btn: "bg-white border-zinc-200",
            btnText: "text-zinc-900",
            icon: "text-zinc-900",
            special: "luxury_marble"
        },

        // Lifestyle & Hobi
        life_gamer: {
            bg: "bg-[#050505]",
            card: "bg-zinc-900/90",
            text: "text-white",
            subtext: "text-red-500/60",
            border: "border-red-600/30",
            glow: "shadow-[0_0_30px_rgba(239,68,68,0.2)]",
            accent: "#ef4444",
            btn: "bg-black border-red-500/30",
            btnText: "text-red-500",
            icon: "text-red-600",
            special: "life_gamer"
        },
        life_travel: {
            bg: "bg-[#fdf8f1]",
            card: "bg-white/70",
            text: "text-orange-950",
            subtext: "text-orange-900/50",
            border: "border-orange-200",
            glow: "none",
            accent: "#d97706",
            btn: "bg-orange-50 border-orange-200",
            btnText: "text-orange-900",
            icon: "text-orange-700",
            special: "life_travel"
        },
        life_zen: {
            bg: "bg-[#f9fafb]",
            card: "bg-emerald-50/50",
            text: "text-emerald-950",
            subtext: "text-emerald-700/60",
            border: "border-emerald-100",
            glow: "none",
            accent: "#22c55e",
            btn: "bg-white border-emerald-100",
            btnText: "text-emerald-800",
            icon: "text-emerald-600",
            special: "life_zen"
        },

        // Future & Glass
        future_holo: {
            bg: "bg-[#000000]",
            card: "bg-white/5",
            text: "text-[#0ef]",
            subtext: "text-[#0ef]/50",
            border: "border-[#0ef]/30",
            glow: "shadow-[0_0_50px_rgba(0,238,255,0.3)]",
            accent: "#06b6d4",
            btn: "bg-black border-[#0ef]/20",
            btnText: "text-[#0ef]",
            icon: "text-[#0ef]",
            special: "future_holo"
        },
        future_glass: {
            bg: "bg-slate-100",
            card: "bg-white/20",
            text: "text-slate-800",
            subtext: "text-slate-500",
            border: "border-white/40",
            glow: "shadow-[0_20px_60px_rgba(0,0,0,0.05)]",
            accent: "#38bdf8",
            btn: "bg-white/40 border-white/60",
            btnText: "text-slate-700",
            icon: "text-sky-500",
            special: "future_glass"
        },

        // Dream (Büyülü Akış)
        dream_mist: {
            bg: "bg-[#faf5ff]",
            card: "bg-white/60",
            text: "text-purple-900",
            subtext: "text-purple-500",
            border: "border-purple-200/50",
            glow: "shadow-[0_0_40px_rgba(168,85,247,0.1)]",
            accent: "#a855f7",
            btn: "bg-white border-purple-100",
            btnText: "text-purple-700",
            icon: "text-purple-500",
            special: "dream_mist"
        },
        dream_nebula: {
            bg: "bg-[#050010]",
            card: "bg-black/40",
            text: "text-white",
            subtext: "text-indigo-300",
            border: "border-purple-500/20",
            glow: "shadow-[0_0_50px_rgba(139,92,246,0.3)]",
            accent: "#8b5cf6",
            btn: "bg-indigo-950/40 border-purple-500/30",
            btnText: "text-white",
            icon: "text-purple-400",
            special: "dream_nebula"
        },

        // Dark (Gizemli Gece)
        dark_onyx: {
            bg: "bg-black",
            card: "bg-zinc-900/50",
            text: "text-zinc-100",
            subtext: "text-zinc-500",
            border: "border-zinc-800",
            glow: "none",
            accent: "#0ea5e9",
            btn: "bg-zinc-900 border-zinc-800",
            btnText: "text-zinc-300",
            icon: "text-sky-500",
            special: "dark_onyx"
        },
        dark_stealth: {
            bg: "bg-[#050505]",
            card: "bg-black/80",
            text: "text-white",
            subtext: "text-zinc-600",
            border: "border-red-900/30",
            glow: "shadow-[0_0_20px_rgba(239,68,68,0.1)]",
            accent: "#ef4444",
            btn: "bg-zinc-950 border-red-900/20",
            btnText: "text-red-500",
            icon: "text-red-600",
            special: "dark_stealth"
        },

        // Light (Prizmatik Işık)
        light_prism: {
            bg: "bg-slate-50",
            card: "bg-white/90",
            text: "text-slate-900",
            subtext: "text-slate-500",
            border: "border-slate-200",
            glow: "shadow-[0_10px_40px_rgba(56,189,248,0.1)]",
            accent: "#38bdf8",
            btn: "bg-white border-slate-200",
            btnText: "text-slate-800",
            icon: "text-sky-500",
            special: "light_prism"
        },
        light_solar: {
            bg: "bg-orange-50/30",
            card: "bg-white/80",
            text: "text-orange-950",
            subtext: "text-orange-800/60",
            border: "border-orange-200/50",
            glow: "shadow-[0_10px_50px_rgba(245,158,11,0.1)]",
            accent: "#f59e0b",
            btn: "bg-white border-orange-100",
            btnText: "text-orange-900",
            icon: "text-orange-600",
            special: "light_solar"
        },

        // Siber Gerçeklik
        cyber_glitch: {
            bg: "bg-zinc-950",
            card: "bg-black/80",
            text: "text-[#0ef]",
            subtext: "text-red-500",
            border: "border-[#0ef]/20",
            glow: "shadow-[0_0_30px_rgba(0,238,255,0.2)]",
            accent: "#0ef",
            btn: "bg-black border-red-500/20",
            btnText: "text-[#0ef]",
            icon: "text-red-500",
            special: "cyber_glitch"
        },
        cyber_vapor: {
            bg: "bg-[#0b0b1a]",
            card: "bg-white/5",
            text: "text-[#ff71ce]",
            subtext: "text-[#01cdfe]",
            border: "border-[#05ffa1]/20",
            glow: "shadow-[0_0_40px_rgba(255,113,206,0.3)]",
            accent: "#ff71ce",
            btn: "bg-white/5 border-[#01cdfe]/20",
            btnText: "text-[#05ffa1]",
            icon: "text-[#01cdfe]",
            special: "cyber_vapor"
        },

        // Antik Miras
        antique_gold: {
            bg: "bg-[#1a1405]",
            card: "bg-[#2d230a]/90",
            text: "text-white",
            subtext: "text-amber-500/60",
            border: "border-amber-500/40 border-double border-4",
            glow: "shadow-[0_0_50px_rgba(251,191,36,0.1)]",
            accent: "#fbbf24",
            btn: "bg-[#1a1405] border-amber-600/30",
            btnText: "text-amber-400",
            icon: "text-amber-500",
            special: "antique_gold"
        },
        antique_myth: {
            bg: "bg-[#f4f4f4]",
            card: "bg-white/95",
            text: "text-slate-900",
            subtext: "text-slate-500",
            border: "border-slate-300 border-2",
            glow: "none",
            accent: "#64748b",
            btn: "bg-slate-50 border-slate-300",
            btnText: "text-slate-900",
            icon: "text-slate-600",
            special: "antique_myth"
        },

        // Likit Akış
        liquid_lava: {
            bg: "bg-[#1a0505]",
            card: "bg-black/60",
            text: "text-orange-500",
            subtext: "text-red-900",
            border: "border-red-500/20",
            glow: "shadow-[0_0_40px_rgba(239,68,68,0.2)]",
            accent: "#ef4444",
            btn: "bg-black border-red-900/40",
            btnText: "text-orange-400",
            icon: "text-red-500",
            special: "liquid_lava"
        },
        liquid_ocean: {
            bg: "bg-sky-950",
            card: "bg-white/10",
            text: "text-white",
            subtext: "text-sky-300",
            border: "border-sky-400/20",
            glow: "shadow-[0_0_50px_rgba(56,189,248,0.2)]",
            accent: "#38bdf8",
            btn: "bg-sky-900/40 border-sky-400/30",
            btnText: "text-white",
            icon: "text-sky-300",
            special: "liquid_ocean"
        },

        // Dinamik Pop
        pop_comic: {
            bg: "bg-yellow-400",
            card: "bg-white",
            text: "text-black",
            subtext: "text-black/60",
            border: "border-black border-4",
            glow: "shadow-[8px_8px_0px_#000]",
            accent: "#000",
            btn: "bg-white border-black border-2",
            btnText: "text-black",
            icon: "text-black",
            special: "pop_comic"
        },
        pop_graffiti: {
            bg: "bg-[#0a0a0a]",
            card: "bg-black/60",
            text: "text-[#f472b6]",
            subtext: "text-[#a855f7]",
            border: "border-[#f472b6]/30",
            glow: "shadow-[0_0_30px_rgba(244,114,182,0.3)]",
            accent: "#f472b6",
            btn: "bg-black border-[#a855f7]/20",
            btnText: "text-[#f472b6]",
            icon: "text-[#a855f7]",
            special: "pop_graffiti"
        },

        // Zihinsel Odak
        zen_garden: {
            bg: "bg-[#f5f5f0]",
            card: "bg-white/70",
            text: "text-stone-900",
            subtext: "text-stone-500",
            border: "border-stone-200",
            glow: "none",
            accent: "#166534",
            btn: "bg-stone-50 border-stone-200",
            btnText: "text-stone-800",
            icon: "text-emerald-700",
            special: "zen_garden"
        },
        zen_focus: {
            bg: "bg-slate-950",
            card: "bg-white/5",
            text: "text-indigo-400",
            subtext: "text-slate-600",
            border: "border-indigo-500/20",
            glow: "shadow-[0_0_20px_rgba(99,102,241,0.1)]",
            accent: "#6366f1",
            btn: "bg-black border-indigo-500/20",
            btnText: "text-indigo-300",
            icon: "text-indigo-400",
            special: "zen_focus"
        },

        // Macera Ruhu
        adventure_peak: {
            bg: "bg-[#f1f5f9]",
            card: "bg-white/80",
            text: "text-slate-900",
            subtext: "text-slate-500",
            border: "border-sky-200",
            glow: "shadow-[0_10px_30px_rgba(14,165,233,0.05)]",
            accent: "#0ea5e9",
            btn: "bg-slate-50 border-sky-100",
            btnText: "text-sky-900",
            icon: "text-sky-600",
            special: "adventure_peak"
        },
        adventure_safari: {
            bg: "bg-[#fdf3e7]",
            card: "bg-white/80",
            text: "text-orange-950",
            subtext: "text-orange-800/60",
            border: "border-orange-200",
            glow: "none",
            accent: "#d97706",
            btn: "bg-white border-orange-100",
            btnText: "text-orange-900",
            icon: "text-orange-700",
            special: "adventure_safari"
        },

        // İlahi Işıltı (Celestial)
        celestial_star: {
            bg: "bg-[#020617]",
            card: "bg-white/5",
            text: "text-white",
            subtext: "text-blue-300",
            border: "border-blue-400/20",
            glow: "shadow-[0_0_50px_rgba(30,58,138,1)]",
            accent: "#fbbf24",
            btn: "bg-blue-900/20 border-blue-400/20",
            btnText: "text-blue-200",
            icon: "text-yellow-400",
            special: "celestial_star"
        },
        celestial_sun: {
            bg: "bg-[#713f12]",
            card: "bg-black/40",
            text: "text-yellow-400",
            subtext: "text-orange-300",
            border: "border-yellow-500/30",
            glow: "shadow-[0_0_100px_#713f12]",
            accent: "#FACC15",
            btn: "bg-orange-950/40 border-yellow-500/20",
            btnText: "text-yellow-500",
            icon: "text-yellow-400",
            special: "celestial_sun"
        },

        // Yalın Estetik (Minimal)
        minimal_pure: {
            bg: "bg-white",
            card: "bg-white",
            text: "text-black",
            subtext: "text-slate-400",
            border: "border-slate-100",
            glow: "none",
            accent: "#000000",
            btn: "bg-white border-slate-200",
            btnText: "text-black",
            icon: "text-slate-400",
            special: "minimal_pure"
        },
        minimal_graphite: {
            bg: "bg-[#fafafa]",
            card: "bg-white",
            text: "text-[#333]",
            subtext: "text-slate-400",
            border: "border-slate-200",
            glow: "shadow-[0_4px_20px_rgba(0,0,0,0.03)]",
            accent: "#4b5563",
            btn: "bg-white border-slate-200",
            btnText: "text-slate-600",
            icon: "text-slate-400",
            special: "minimal_graphite"
        },

        // Endüstriyel Hamlık (Industrial)
        ind_concrete: {
            bg: "bg-[#64748b]",
            card: "bg-[#475569]/90",
            text: "text-white",
            subtext: "text-slate-300",
            border: "border-slate-400/30",
            glow: "none",
            accent: "#64748b",
            btn: "bg-slate-700 border-slate-500",
            btnText: "text-slate-200",
            icon: "text-slate-400",
            special: "ind_concrete"
        },
        ind_rusty: {
            bg: "bg-[#1c1917]",
            card: "bg-[#292524]/90",
            text: "text-[#b45309]",
            subtext: "text-[#78350f]",
            border: "border-[#78350f]/30",
            glow: "none",
            accent: "#b45309",
            btn: "bg-[#1c1917] border-[#78350f]/20",
            btnText: "text-[#b45309]",
            icon: "text-[#78350f]",
            special: "ind_rusty"
        },

        // Enerji Patlaması (Vibrant)
        vibe_bolt: {
            bg: "bg-yellow-400",
            card: "bg-black",
            text: "text-yellow-400",
            subtext: "text-white/60",
            border: "border-white/10",
            glow: "shadow-[0_0_40px_rgba(250,204,21,0.2)]",
            accent: "#facc15",
            btn: "bg-zinc-900 border-white/5",
            btnText: "text-yellow-400",
            icon: "text-yellow-400",
            special: "vibe_bolt"
        },
        vibe_pulse: {
            bg: "bg-black",
            card: "bg-black",
            text: "text-red-600",
            subtext: "text-white",
            border: "border-red-600",
            glow: "shadow-[0_0_20px_rgba(220,38,38,0.5)]",
            accent: "#ef4444",
            btn: "bg-red-600 border-red-600",
            btnText: "text-white",
            icon: "text-white",
            special: "vibe_pulse"
        },

        // Hanedan Mirası (Royal)
        royal_velvet: {
            bg: "bg-[#4c1d95]",
            card: "bg-black/30",
            text: "text-white",
            subtext: "text-purple-200",
            border: "border-yellow-500/40 border-2",
            glow: "shadow-[0_0_50px_rgba(168,85,247,0.3)]",
            accent: "#a855f7",
            btn: "bg-purple-950/50 border-yellow-500/20",
            btnText: "text-yellow-400",
            icon: "text-yellow-500",
            special: "royal_velvet"
        },
        royal_emerald: {
            bg: "bg-[#064e3b]",
            card: "bg-black/20",
            text: "text-emerald-400",
            subtext: "text-emerald-200/60",
            border: "border-emerald-500/30",
            glow: "shadow-[0_0_60px_rgba(16,185,129,0.2)]",
            accent: "#10b981",
            btn: "bg-emerald-950/50 border-emerald-500/20",
            btnText: "text-emerald-400",
            icon: "text-emerald-500",
            special: "royal_emerald"
        },

        // Yüksek Teknoloji (Tech)
        tech_core: {
            bg: "bg-[#000d1a]",
            card: "bg-white/5",
            text: "text-[#38bdf8]",
            subtext: "text-[#0ea5e9]/50",
            border: "border-[#38bdf8]/20",
            glow: "shadow-[0_0_100px_rgba(56,189,248,0.1)]",
            accent: "#38bdf8",
            btn: "bg-black border-[#38bdf8]/20",
            btnText: "text-white",
            icon: "text-[#38bdf8]",
            special: "tech_core"
        },
        tech_atom: {
            bg: "bg-[#050510]",
            card: "bg-indigo-950/20",
            text: "text-white",
            subtext: "text-indigo-400",
            border: "border-indigo-500/10",
            glow: "shadow-[0_0_30px_#6366f1]",
            accent: "#6366f1",
            btn: "bg-indigo-950/30 border-indigo-500/20",
            btnText: "text-indigo-200",
            icon: "text-white",
            special: "tech_atom"
        },

        // Metaverse
        meta_portal: {
            bg: "bg-[#0a0a0a]",
            card: "bg-black/80",
            text: "text-white",
            subtext: "text-pink-400",
            border: "border-pink-500/20",
            glow: "shadow-[0_0_50px_rgba(236,72,153,0.3)]",
            accent: "#ec4899",
            btn: "bg-black border-pink-500/20",
            btnText: "text-pink-400",
            icon: "text-pink-500",
            special: "meta_portal"
        },
        meta_pixel: {
            bg: "bg-[#050505]",
            card: "bg-black/90",
            text: "text-[#0ea5e9]",
            subtext: "text-indigo-400",
            border: "border-[#0ea5e9]/20",
            glow: "shadow-[0_0_30px_rgba(14,165,233,0.1)]",
            accent: "#0ea5e9",
            btn: "bg-zinc-950 border-[#0ea5e9]/10",
            btnText: "text-white",
            icon: "text-[#0ea5e9]",
            special: "meta_pixel"
        }
    };
    const baseTheme = themes[colorScheme as string] || themes.black;
    const theme = { ...baseTheme };

    // Override accent color with custom selection if available (except for rainbow/special patterns)
    if (profile.themeColor && !theme.special) {
        theme.accent = profile.themeColor;
    }

    const socialLinks = profile.socialLinks || []

    const mouseX = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });
    const mouseY = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });

    // Automatic animation motion values
    const autoX = useMotionValue(0);
    const autoY = useMotionValue(0);

    useEffect(() => {
        if (profile.animationStyle === 'float') {
            animate(autoY, [-10, 10, -10], { duration: 4, repeat: Infinity, ease: "easeInOut" });
        } else if (profile.animationStyle === '3d-dynamic') {
            animate(autoX, [-15, 15, -15], { duration: 8, repeat: Infinity, ease: "easeInOut" });
            animate(autoY, [-10, 10, -10], { duration: 10, repeat: Infinity, ease: "easeInOut" });
        } else {
            autoX.set(0);
            autoY.set(0);
        }
    }, [profile.animationStyle]);

    // Derived transform values
    const rotateXManual = useTransform(mouseY, [-200, 200], [15, -15]);
    const rotateYManual = useTransform(mouseX, [-200, 200], [-15, 15]);

    const rotateX = profile.animationStyle === 'none' ? 0 :
        (profile.animationStyle === '3d-manual' ? rotateXManual : autoY);
    const rotateY = profile.animationStyle === 'none' ? 0 :
        (profile.animationStyle === '3d-manual' ? rotateYManual : autoX);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (profile.animationStyle !== '3d-manual') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        if (profile.animationStyle !== '3d-manual') return;
        mouseX.set(0);
        mouseY.set(0);
    };

    const customLinksEntry = (socialLinks || []).find((l: any) => l.platform === 'customLinks');
    const customLinks = customLinksEntry?.links || [];

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
        ...customLinks.filter((l: any) => l.isAction).map((l: any) => ({
            label: l.title,
            icon: <Globe size={20} />,
            href: l.url,
            onClick: () => trackEvent("custom_action", l.title),
            active: true
        })),
        { label: "Web Site", icon: <Globe size={20} />, href: formatUrl(socialLinks.find((l: any) => l.platform === 'website')?.url), onClick: () => trackEvent("website"), active: !!socialLinks.find((l: any) => l.platform === 'website')?.url },
        { label: "Konum", icon: <MapPin size={20} />, href: formatUrl(socialLinks.find((l: any) => l.platform === 'location')?.url), onClick: () => trackEvent("location"), active: !!socialLinks.find((l: any) => l.platform === 'location')?.url },
    ].filter(a => a.active)

    return (
        <div className={cn("min-h-screen flex items-center justify-center p-4 relative overflow-hidden", theme.bg, toneStyle.font)}>
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                {/* Subtle brightness overlay — makes the outer area lighter so the card pops */}
                <div className="absolute inset-0 bg-white/[0.06]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(255,255,255,0.08)_100%)]" />
                {theme.special === "cyber" && (
                    <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#0ff2_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#f0f2_0%,transparent_50%)] animate-pulse" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,#000_25%,#111_25%,#111_50%,#000_50%,#000_75%,#111_75%)] bg-[length:20px_20px] opacity-[0.03]" />
                    </>
                )}
                {theme.special === "galaxy" && (
                    <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#a855f722_0%,transparent_70%)] animate-pulse" />
                        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ background: 'radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)), radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0))', backgroundSize: '100px 100px' }} />
                    </>
                )}
                {theme.special === "acid" && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#bef26422_0%,transparent_60%),radial-gradient(circle_at_70%_80%,#eab30822_0%,transparent_60%)] animate-pulse" />
                )}
                {theme.special === "candy" && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#f472b622_0%,transparent_60%),radial-gradient(circle_at_80%_20%,#8b5cf622_0%,transparent_60%)] animate-pulse" />
                )}
                {theme.special === "aurora" && (
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,#2dd4bf11,#6366f111,#2dd4bf11)] animate-spin-slow opacity-50" />
                )}

                {/* ─── NEW UNIQUE TEMPLATE EFFECTS ─── */}

                {theme.special === "dream_mist" && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    x: [Math.random() * 100, Math.random() * 800, Math.random() * 100],
                                    y: [Math.random() * 100, Math.random() * 800, Math.random() * 100],
                                    scale: [1, 1.5, 1],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
                                style={{
                                    background: i === 0 ? '#f472b6' : i === 1 ? '#a855f7' : '#38bdf8',
                                }}
                            />
                        ))}
                    </div>
                )}

                {theme.special === "dream_nebula" && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#4c1d9533_0%,transparent_70%)]" />
                        {[...Array(50)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: Math.random() }}
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    boxShadow: '0 0 5px #fff'
                                }}
                            />
                        ))}
                    </div>
                )}

                {theme.special === "dark_stealth" && (
                    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                        <motion.div
                            animate={{ y: ['-100%', '100%'] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-x-0 h-[20%] bg-gradient-to-b from-transparent via-red-500/10 to-transparent z-10"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                    </div>
                )}

                {theme.special === "dark_onyx" && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,black_100%)]" />
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
                    </div>
                )}

                {theme.special === "light_prism" && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,#38bdf811,#f472b611,#fbbf2411,#38bdf811)] blur-[80px]"
                        />
                    </div>
                )}

                {theme.special === "light_solar" && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-[radial-gradient(circle,#fbbf2433_0%,transparent_70%)] blur-[40px]"
                        />
                    </div>
                )}

                {/* ─── NEW HIGH-END EXPERIMENTAL EFFECTS ─── */}

                {theme.special === "cyber_glitch" && (
                    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,255,255,0.05),rgba(255,0,0,0.03),rgba(0,255,0,0.05))] bg-[length:100%_2px,3px_100%] opacity-20" />
                        <motion.div
                            animate={{ x: ['-2px', '2px', '-1px', '3px', '0px'] }}
                            transition={{ duration: 0.1, repeat: Infinity }}
                            className="absolute inset-0 opacity-10 mix-blend-screen bg-cyan-500/10"
                        />
                    </div>
                )}

                {theme.special === "cyber_vapor" && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#0b0b1a] via-[#1a0b1a] to-[#0b0b1a]">
                        <div className="absolute bottom-0 left-0 w-full h-[300px] bg-[linear-gradient(transparent,#ff71ce33)]" />
                        <motion.div
                            animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#01cdfe22] blur-[120px] rounded-full"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(#ff71ce 1px, transparent 1px), linear-gradient(90deg, #ff71ce 1px, transparent 1px)`, backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) translateY(-50px)' }} />
                    </div>
                )}

                {theme.special === "antique_gold" && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30 L60 0 L60 60 Z M30 30 L0 0 L0 60 Z' fill='%23fbbf24'/%3E%3C/svg%3E")` }} />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#fbbf2422_0%,transparent_50%)]" />
                    </div>
                )}

                {theme.special === "liquid_lava" && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    x: [Math.random() * 100, Math.random() * 500, Math.random() * 100],
                                    y: [Math.random() * 100, Math.random() * 800, Math.random() * 100],
                                    scale: [1.5, 2.5, 1.5]
                                }}
                                transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute w-[300px] h-[300px] bg-red-600/10 blur-[80px] rounded-full"
                            />
                        ))}
                    </div>
                )}

                {theme.special === "pop_comic" && (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='5' fill='%23000'/%3E%3C/svg%3E")`, backgroundSize: '10px 10px' }} />
                )}

                {theme.special === "zen_garden" && (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%23000' fill='none' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='30' stroke='%23000' fill='none' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='20' stroke='%23000' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: '150px 150px' }} />
                )}

                {theme.special === "adventure_peak" && (
                    <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none opacity-[0.05] overflow-hidden">
                        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full fill-slate-900">
                            <path d="M0,300 L0,200 L200,100 L400,250 L600,50 L800,200 L1000,150 L1000,300 Z" />
                        </svg>
                    </div>
                )}

                {/* ─── FINAL TIER SPECIAL EFFECTS ─── */}

                {theme.special === "celestial_star" && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(100)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: Math.random() }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 3 + Math.random() * 5, repeat: Infinity }}
                                className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_5px_#fff]"
                                style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                            />
                        ))}
                    </div>
                )}

                {theme.special === "celestial_sun" && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#713f12_0%,transparent_100%)]">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-50%] left-[-25%] w-[150%] h-[150%] bg-[radial-gradient(circle,#FACC15_0%,transparent_70%)] blur-[100px]"
                        />
                    </div>
                )}

                {theme.special === "ind_concrete" && (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.2]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/pinstriped-suit.png")` }} />
                )}

                {theme.special === "vibe_bolt" && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 5 }}
                            className="absolute inset-0 bg-white/30 z-50 mix-blend-overlay"
                        />
                    </div>
                )}

                {theme.special === "vibe_pulse" && (
                    <div className="absolute inset-0 pointer-events-none">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-red-600 blur-[60px]"
                        />
                    </div>
                )}

                {theme.special === "tech_core" && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: ['100%', '-100%'],
                                    opacity: [0, 0.3, 0]
                                }}
                                transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent shadow-[0_0_20px_#38bdf8]"
                                style={{ top: `${i * 20}%` }}
                            />
                        ))}
                    </div>
                )}

                {theme.special === "tech_atom" && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-indigo-500/10 rounded-full"
                        />
                    </div>
                )}

                {theme.special === "meta_portal" && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-black">
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0.6, 0.3],
                                rotate: [0, 180, 360]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[conic-gradient(from_0deg,#ec489911,#0ea5e911,#ec489911)] rounded-full blur-[60px]"
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-pink-500/10 rounded-full animate-pulse" />
                    </div>
                )}

                {theme.special === "meta_pixel" && (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='2' height='2' x='0' y='0' fill='%230ea5e9'/%3E%3Crect width='2' height='2' x='10' y='10' fill='%236366f1'/%3E%3C/svg%3E")` }} />
                )}

                {/* ─── RESTORED PATTERNS ─── */}
                {theme.special === "retro_mac" && (
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%23000'/%3E%3C/svg%3E")` }} />
                )}
                {theme.special === "retro_news" && (
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/pinstriped-suit.png")` }} />
                )}
                {theme.special === "retro_synth" && (
                    <>
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_bottom,transparent,#8b5cf633)]" />
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(#f472b6 1px, transparent 1px), linear-gradient(90deg, #f472b6 1px, transparent 1px)`, backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) translateY(-100px)' }} />
                    </>
                )}
                {theme.special === "luxury_gold" && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#fbbf2411_0%,transparent_50%)]" />
                )}
                {theme.special === "life_gamer" && (
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L10 10 M10 0 L0 10' stroke='%23ef4444' stroke-width='0.5'/%3E%3C/svg%3E")` }} />
                )}
                {theme.special === "life_travel" && (
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%23d97706' fill='none' stroke-width='1'/%3E%3Cpath d='M50 10 V 90 M 10 50 H 90' stroke='%23d97706' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: '120px 120px' }} />
                )}
                {theme.special === "future_holo" && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0ef11_0%,transparent_70%)] animate-pulse" />
                )}
                {theme.special === "future_glass" && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#38bdf811_0%,transparent_40%),radial-gradient(circle_at_80%_80%,#f472b611_0%,transparent_40%)]" />
                )}

                {/* Patterns Rendering */}
                {theme.special === "ottoman" && (
                    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50 L100 0 L100 100 Z M50 50 L0 0 L0 100 Z' fill='%23d4af37' fill-opacity='0.4'/%3E%3Ccircle cx='50' cy='50' r='10' fill='%23d4af37'/%3E%3Cpath d='M0 50 L50 0 L100 50 L50 100 Z' fill='none' stroke='%23d4af37' stroke-width='1'/%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />
                )}
                {theme.special === "geometric" && (
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ffffff' stroke-width='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 30V20h10V10h10V0h10v10h10v10h10v10H50v10H40v10H30v10H20V50H10V40H0V30h6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                )}
                {theme.special === "marble" && (
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/white-diamond.png")` }} />
                )}
                {theme.special === "topo" && (
                    <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 Q 50 10, 50 50 T 90 90 T 130 130 T 170 170' stroke='%2310b981' fill='transparent'/%3E%3Cpath d='M30 10 Q 70 10, 70 50 T 110 90 T 150 130 T 190 170' stroke='%2310b981' fill='transparent'/%3E%3C/svg%3E")`, backgroundSize: '150px 150px' }} />
                )}
                {theme.special === "circuit" && (
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 H 90 V 90 H 10 Z' fill='none' stroke='%2306b6d4' stroke-width='0.5'/%3E%3Ccircle cx='10' cy='10' r='1' fill='%2306b6d4'/%3E%3Ccircle cx='90' cy='10' r='1' fill='%2306b6d4'/%3E%3Ccircle cx='90' cy='90' r='1' fill='%2306b6d4'/%3E%3Ccircle cx='10' cy='90' r='1' fill='%2306b6d4'/%3E%3C/svg%3E")`, backgroundSize: '40px 40px' }} />
                )}
                {theme.special === "dietitian" && (
                    <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 20 Q 60 40, 50 60 Q 40 40, 50 20 Z M50 60 L 50 80' stroke='%2322c55e' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }} />
                )}
                {theme.special === "lawyer" && (
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 H 100 V 100 H 20 Z M60 20 V 100 M20 60 H 100' stroke='%23d4af37' fill='none' stroke-width='2'/%3E%3C/svg%3E")`, backgroundSize: '100px 100px' }} />
                )}
                {theme.special === "architect" && (
                    <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L 0 60 M 0 0 L 60 0 M 30 0 L 30 60 M 0 30 L 60 30' stroke='%230ea5e9' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")` }} />
                )}
                {theme.special === "realestate" && (
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 100 V 40 L 50 20 L 80 40 V 100' stroke='%23fbbf24' fill='none' stroke-width='2'/%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }} />
                )}
                {theme.special === "artistic" && (
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='40' stroke='%23f472b6' fill='none' stroke-width='1'/%3E%3Cpath d='M20 20 L 100 100 M 100 20 L 20 100' stroke='%23f472b6' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: '120px 120px' }} />
                )}


                {/* Profession-Specific Design Extensions */}
                {theme.special === "realestate" && (
                    <div className="absolute inset-x-0 bottom-0 h-[400px] opacity-[0.03] select-none pointer-events-none z-0 overflow-hidden">
                        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-amber-500">
                            <path d="M0,100 L0,80 L50,80 L50,40 L100,40 L100,70 L150,70 L150,20 L200,20 L200,80 L250,80 L250,40 L300,40 L300,60 L350,60 L350,10 L400,10 L400,80 L450,80 L450,30 L500,30 L500,70 L550,70 L550,0 L600,0 L600,80 L650,80 L650,40 L700,40 L700,60 L750,60 L750,20 L800,20 L800,80 L850,80 L850,50 L900,50 L900,80 L950,80 L950,30 L1000,30 L1000,100 Z" />
                        </svg>
                    </div>
                )}
                {theme.special === "lawyer" && (
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none flex items-center justify-center">
                        <svg width="600" height="600" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="0.1">
                            <path d="M12 3v18M12 3l7 3M12 3L5 6m7 15l7-3m-7 3l-7-3M5 6v12m14-12v12M5 10h14M5 14h14" />
                        </svg>
                    </div>
                )}
                {theme.special === "architect" && (
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none">
                        <div className="absolute top-10 left-10 text-[10px] font-mono text-[#0ea5e9]">R: 12.5m</div>
                        <div className="absolute bottom-20 right-10 text-[10px] font-mono text-[#0ea5e9]">θ: 45°</div>
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#0ea5e9]/20" />
                        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-[#0ea5e9]/20" />
                    </div>
                )}
                {theme.special === "dietitian" && (
                    <div className="absolute inset-0 overflow-hidden opacity-[0.05] pointer-events-none">
                        {Array(5).fill(0).map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [0, -100, 0],
                                    x: [0, i % 2 === 0 ? 50 : -50, 0],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                                className="absolute"
                                style={{
                                    top: `${20 * i}%`,
                                    left: `${15 * i}%`,
                                }}
                            >
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1">
                                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-7 7c-.67 0-1.32-.1-1.94-.27" />
                                    <path d="M11 20c-2.33 0-4.32-1.45-5.12-3.5M11 20c.56 0 1.1-.1 1.6-.3" />
                                </svg>
                            </motion.div>
                        ))}
                    </div>
                )}
                {theme.special === "artistic" && (
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-pink-500/20 to-transparent blur-[100px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-transparent blur-[100px] rounded-full" />
                    </div>
                )}
                {theme.special === "software" && (
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none font-mono text-[10px] text-emerald-500/50 p-10 overflow-hidden leading-relaxed">
                        {`function init() {\n  const system = "Kardly";\n  console.log("Welcome " + user);\n}\n`.repeat(100)}
                    </div>
                )}
                {theme.special === "doctor" && (
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none flex items-center justify-center">
                        <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="0.5">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </div>
                )}
                {theme.special === "chef" && (
                    <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.03] pointer-events-none overflow-hidden">
                        <div className="grid grid-cols-10 gap-10">
                            {Array(100).fill(0).map((_, i) => (
                                <svg key={i} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v11" /><path d="M15 14c-.9-1.1-2-1.3-3.2-1.2h-.1V22h.1c1.2.1 2.3-.1 3.2-1.2 1-1.1 1-2.7 0-3.6" /><path d="M15 14c1.2 1.3 1.2 3.3 0 4.6" /><path d="M15 2v10" />
                                </svg>
                            ))}
                        </div>
                    </div>
                )}
                {theme.special === "fitness" && (
                    <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")` }} />
                )}
                {theme.special === "musician" && (
                    <div className="absolute inset-x-0 bottom-0 h-64 opacity-[0.1] pointer-events-none flex items-end justify-center gap-1">
                        {Array(40).fill(0).map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: [10, 100, 20] }}
                                transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                                className="w-2 bg-indigo-500/30 rounded-full"
                            />
                        ))}
                    </div>
                )}
                {theme.special === "finance" && (
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                        <svg viewBox="0 0 1000 1000" className="w-full h-full stroke-slate-500" fill="none" strokeWidth="0.5">
                            <path d="M0,800 L200,750 L400,780 L600,600 L800,650 L1000,400" />
                            <path d="M0,850 L200,820 L400,830 L600,750 L800,780 L1000,600" />
                        </svg>
                    </div>
                )}
                {theme.special === "gamer" && (
                    <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='2' height='2' x='0' y='0' fill='%2300ff9f' fill-opacity='0.2'/%3E%3C/svg%3E")` }} />
                )}

                {/* New Premium Vibe Backgrounds */}
                {tone === 'lüks' && (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-yellow-600/10 animate-pulse opacity-30" />
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 0 L75 0 L100 50 L75 100 L25 100 L0 50 Z' fill='none' stroke='%23d4af37' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }} />
                    </>
                )}
                {tone === 'yaratıcı' && (
                    <>
                        <div className="absolute inset-0 overflow-hidden opacity-[0.03] select-none pointer-events-none font-mono text-[8px] leading-tight text-white whitespace-pre">
                            {Array(50).fill(0).map((_, i) => (
                                <div key={i} className="animate-marquee-vertical">
                                    {`const project = { name: "Kardly", features: ["3D", "AI", "NFC"] };\n`.repeat(10)}
                                </div>
                            ))}
                        </div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ff00ff10_0%,transparent_50%),radial-gradient(circle_at_bottom_right,#00ffff10_0%,transparent_50%)] animate-pulse" />
                    </>
                )}

                <div className="absolute top-1/4 left-1/4 w-96 h-96 blur-[120px] opacity-30 rounded-full" style={{ background: theme.accent }} />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 blur-[120px] opacity-30 rounded-full" style={{ background: theme.accent }} />
                <div className="absolute top-0 right-0 w-72 h-72 blur-[100px] opacity-15 rounded-full" style={{ background: theme.accent }} />
                <div className="absolute bottom-0 left-0 w-72 h-72 blur-[100px] opacity-15 rounded-full" style={{ background: theme.accent }} />
            </div>

            <style>{`
                @keyframes marquee-vertical {
                    from { transform: translateY(0); }
                    to { transform: translateY(-50%); }
                }
                .animate-marquee-vertical {
                    animation: marquee-vertical 30s linear infinite;
                }
            `}</style>

            {/* Modal integration for dynamic theme */}
            <AppointmentModal
                profile={profile}
                isOpen={isAppointmentOpen}
                onClose={() => setIsAppointmentOpen(false)}
                t={t}
                theme={theme}
                toneStyle={toneStyle}
            />

            <main className="relative z-10 w-full max-w-[420px] space-y-6" style={{ perspective: "1000px" }}>
                <motion.div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ rotateX, rotateY }}
                    className={cn("border p-8 space-y-8 backdrop-blur-3xl shadow-2xl relative transition-all duration-300 ease-out", theme.card, theme.border, toneStyle.rounded, toneStyle.border)}
                >
                    {/* Share Button Top Right */}
                    <div className="absolute top-6 right-6 z-30">
                        <button
                            onClick={handleAddToContacts}
                            className={cn("w-10 h-10 border flex items-center justify-center backdrop-blur-xl transition-all hover:scale-110 active:scale-95", theme.btn, theme.border, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                        >
                            <UserPlus size={18} className={theme.icon} />
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
                                        const radius = 95;
                                        const x = Math.cos(angle) * radius;
                                        const y = Math.sin(angle) * radius;

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
                                                    animate={{ rotate: toneStyle.expertiseStyle === 'slow-rotate' ? -360 : toneStyle.expertiseStyle === 'scattered' ? [-0, -10, 10, 0] : -360 }}
                                                    transition={toneStyle.expertiseStyle === 'slow-rotate' ? { duration: 120, repeat: Infinity, ease: "linear" } : toneStyle.expertiseStyle === 'scattered' ? { duration: 10, repeat: Infinity } : { duration: 60, repeat: Infinity, ease: "linear" }}
                                                    className={cn("w-10 h-10 glass border border-white/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all hover:scale-125 hover:border-white hover:bg-white/10 relative rounded-full")}
                                                    style={{
                                                        color: theme.accent,
                                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                >
                                                    {getIcon(service.title)}

                                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-all duration-300 whitespace-nowrap bg-[#0a0a0a]/95 backdrop-blur-xl px-3 py-1.5 rounded-xl text-[11px] font-bold text-white pointer-events-none border border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.5)] scale-50 group-hover/icon:scale-100 z-50">
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
                                className={cn("w-32 h-32 p-1 border-2 relative z-10 overflow-hidden",
                                    theme.special === 'software' ? 'rounded-xl' :
                                        theme.special === 'photographer' ? 'rounded-sm border-white' :
                                            'rounded-full'
                                )}
                                style={{ borderColor: theme.accent }}
                            >
                                {profile.showVideoAsProfile && profile.youtubeVideoUrl ? (
                                    <iframe
                                        className="w-full h-full object-cover scale-[1.8] pointer-events-none"
                                        src={getYoutubeEmbedUrl(profile.youtubeVideoUrl)}
                                        allow="autoplay; encrypted-media"
                                        frameBorder="0"
                                    />
                                ) : (
                                    <img src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`} className={cn("w-full h-full object-cover")} />
                                )}

                                {/* Profession Overlays */}
                                {theme.special === 'software' && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="absolute top-0 left-0 p-1 text-[8px] font-mono text-emerald-500 bg-black/50">DIV</div>
                                        <div className="absolute bottom-0 right-0 p-1 text-[8px] font-mono text-emerald-500 bg-black/50">/DIV</div>
                                    </div>
                                )}
                                {theme.special === 'photographer' && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-full h-[1px] bg-red-500/30 absolute top-1/2" />
                                        <div className="h-full w-[1px] bg-red-500/30 absolute left-1/2" />
                                        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white" />
                                        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white" />
                                        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white" />
                                        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white" />
                                    </div>
                                )}
                                {theme.special === 'lawyer' && (
                                    <div className="absolute inset-0 border-2 border-amber-500/20 rounded-full scale-90" />
                                )}
                                {theme.special === 'architect' && (
                                    <div className="absolute inset-0 border border-sky-500/30">
                                        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-sky-500/10" />
                                        <div className="absolute left-0 top-1/2 w-full h-[1px] bg-sky-500/10" />
                                    </div>
                                )}
                                {theme.special === 'barber' && (
                                    <div className="absolute inset-0 border-4 border-double border-white/10" />
                                )}
                            </motion.div>

                            {/* External Profession Icons */}
                            {theme.special === 'doctor' && (
                                <div className="absolute -top-4 -right-4 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center border border-sky-100 z-20">
                                    <Activity size={20} className="text-sky-500 animate-pulse" />
                                </div>
                            )}
                            {theme.special === 'chef' && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                                    <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="#f97316">
                                            <path d="M12 3c-4.97 0-9 4.03-9 9 0 4.97 4.03 9 9 9 4.97 0 9-4.03 9-9 0-4.97-4.03-9-9-9zM8.5 15h7c.28 0 .5.22.5.5s-.22.5-.5.5h-7c-.28 0-.5-.22-.5-.5s.22-.5.5-.5z" />
                                        </svg>
                                    </motion.div>
                                </div>
                            )}
                            {theme.special === 'gamer' && (
                                <div className="absolute -bottom-2 inset-x-0 flex justify-center z-20">
                                    <div className="bg-black border border-[#00ff9f]/50 px-2 py-0.5 rounded text-[8px] font-mono text-[#00ff9f] tracking-tighter shadow-[0_0_10px_#00ff9f50]">LVL 99 PRO</div>
                                </div>
                            )}
                            {theme.special === 'dietitian' && (
                                <div className="absolute -top-4 left-0 z-20 opacity-60">
                                    <motion.div animate={{ rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                                            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-7 7" />
                                        </svg>
                                    </motion.div>
                                </div>
                            )}
                            {theme.special === 'beauty' && (
                                <div className="absolute -top-2 -right-2 z-20">
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
                                        <Sparkles size={24} className="text-rose-400" />
                                    </motion.div>
                                </div>
                            )}
                            {theme.special === 'musician' && (
                                <div className="absolute top-1/2 -right-8 -translate-y-1/2 z-20 opacity-20 flex flex-col gap-1">
                                    <div className="w-12 h-[1px] bg-indigo-500" />
                                    <div className="w-12 h-[1px] bg-indigo-500" />
                                    <div className="w-12 h-[1px] bg-indigo-500" />
                                </div>
                            )}

                            <div className="absolute inset-[-10px] rounded-full blur-2xl opacity-20 animate-pulse" style={{ background: theme.accent }} />
                        </div>

                        <div>
                            <div className="flex items-center justify-center gap-3">
                                {theme.special === 'software' && <Code size={20} className="text-emerald-500 opacity-50" />}
                                {theme.special === 'doctor' && <Shield size={20} className="text-sky-500 opacity-50" />}
                                {theme.special === 'chef' && <Zap size={20} className="text-orange-500 opacity-50" />}
                                {theme.special === 'artistic' && <Palette size={20} className="text-pink-500 opacity-50" />}
                                <h1 className={cn("font-black tracking-tight", theme.text, toneStyle.headerSize)}>{profile.user.name}</h1>
                                {theme.special === 'realestate' && <Briefcase size={20} className="text-amber-500 opacity-50" />}
                                {theme.special === 'architect' && <Layers size={20} className="text-sky-500 opacity-50" />}
                                {theme.special === 'barber' && <Star size={20} className="text-white opacity-50" />}
                            </div>

                            <div className="flex items-center justify-center gap-2 mt-2 relative">
                                <div className="h-[1px] w-4 rounded-full opacity-30" style={{ background: theme.accent }} />
                                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80" style={{ color: theme.accent }}>
                                    {profile.occupation || "PROFESSIONAL"}
                                    {theme.special === 'software' && <span className="animate-pulse">_</span>}
                                </p>
                                <div className="h-[1px] w-4 rounded-full opacity-30" style={{ background: theme.accent }} />

                                {theme.special === 'fitness' && (
                                    <div className="absolute -right-12 top-0 flex gap-0.5">
                                        <div className="w-1 h-3 bg-lime-500" />
                                        <div className="w-1 h-3 bg-lime-500" />
                                        <div className="w-1 h-3 bg-lime-500/30" />
                                    </div>
                                )}
                            </div>

                            {theme.special === 'finance' && (
                                <div className="flex items-center justify-center gap-1 mt-1 text-[8px] font-bold text-emerald-500">
                                    <TrendingUp size={10} /> MARKET ACTIVE +4.2%
                                </div>
                            )}

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
                                    <div className={cn("w-[348px] mx-auto border backdrop-blur-md py-4 px-8 mt-4 relative z-20 rounded-[2rem]", theme.card, theme.border)}>
                                        <h3 className={cn("text-[9px] font-black uppercase tracking-[0.3em] text-white text-center mb-4")}>{t.myProjects}</h3>
                                        <div
                                            className="relative h-16 flex items-center overflow-visible"
                                            style={{ clipPath: 'inset(-200px 0 -200px 0)' }} // Clips left/right, allows top/bottom
                                        >
                                            <div className="animate-marquee-right flex gap-6 h-full items-center">
                                                {[...profile.products.filter((p: any) => p.image), ...profile.products.filter((p: any) => p.image), ...profile.products.filter((p: any) => p.image)].map((project: any, i: number) => (
                                                    <a
                                                        key={i}
                                                        href={formatUrl(project.link) || "#"}
                                                        target="_blank"
                                                        onClick={() => trackEvent("product", project.name)}
                                                        className={cn("w-14 h-14 border border-white/20 overflow-visible shadow-lg flex-shrink-0 bg-white/10 backdrop-blur-sm p-1 group/prj transition-all hover:scale-110 cursor-pointer block relative rounded-2xl")}
                                                    >
                                                        <img src={project.image} alt={project.name} className="w-full h-full object-cover rounded-xl" />

                                                        {/* Rich Tooltip - Dynamic Colors */}
                                                        <div
                                                            className={cn("absolute bottom-[calc(100%+15px)] left-1/2 -translate-x-1/2 opacity-0 group-hover/prj:opacity-100 transition-all duration-300 w-56 border p-4 rounded-2xl text-left pointer-events-none shadow-2xl scale-50 group-hover/prj:scale-100 z-[110] backdrop-blur-3xl bg-black/80")}
                                                            style={{
                                                                borderColor: `${theme.accent}60`,
                                                                boxShadow: `0 20px 50px -10px ${theme.accent}40`
                                                            }}
                                                        >
                                                            {/* Theme Tint Overlay */}
                                                            <div className="absolute inset-0 opacity-[0.15] rounded-2xl" style={{ backgroundColor: theme.accent }} />

                                                            <div
                                                                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 border-r border-b rotate-45 bg-black"
                                                                style={{ borderColor: `${theme.accent}60` }}
                                                            />

                                                            <div className="relative z-10">
                                                                <h4 className="text-[11px] font-black text-white uppercase tracking-wider mb-1.5 line-clamp-1">{project.name}</h4>
                                                                {project.description ? (
                                                                    <p className="text-[10px] text-white/80 leading-relaxed line-clamp-4 font-medium">{project.description}</p>
                                                                ) : (
                                                                    <p className="text-[10px] text-white/40 italic font-medium">{t.noProjectDesc}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>

                                            {/* Fading gradients */}
                                            <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none opacity-40 bg-gradient-to-r from-black/20 to-transparent" />
                                            <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none opacity-40 bg-gradient-to-l from-black/20 to-transparent" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Bento Elite Extensions */}
                            {profile.blocks && profile.blocks.filter((b: any) => b.isActive).length > 0 && (
                                <div className="mt-8 px-4 grid grid-cols-2 gap-3">
                                    {profile.blocks.filter((b: any) => b.isActive).map((block: any, i: number) => (
                                        <motion.div
                                            key={block.id || i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + i * 0.1 }}
                                            className={cn(
                                                "p-4 border backdrop-blur-md rounded-3xl flex flex-col gap-3 group relative overflow-hidden",
                                                theme.card, theme.border
                                            )}
                                            style={{ minHeight: '120px' }}
                                        >
                                            {/* Glow effect matching theme accent */}
                                            <div
                                                className="absolute -right-4 -top-4 w-12 h-12 blur-2xl opacity-20 transition-opacity group-hover:opacity-40"
                                                style={{ background: theme.accent }}
                                            />

                                            {block.type === 'ai_assistant' && (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                                                            <Brain size={18} />
                                                        </div>
                                                        <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded-full">ONLINE</div>
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-1">AI Temsilcisi</h4>
                                                        <p className="text-[8px] text-white/50 leading-tight line-clamp-2">Sizin yerinize soruları yanıtlamak için burada.</p>
                                                    </div>
                                                    <motion.button
                                                        whileTap={{ scale: 0.95 }}
                                                        className="mt-auto w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition-all"
                                                    >
                                                        KONUŞMAYA BAŞLA
                                                    </motion.button>
                                                </>
                                            )}

                                            {block.type === 'digital_store' && (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                                                            <ShoppingBag size={18} />
                                                        </div>
                                                        <div className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[8px] font-black rounded-full">SALE</div>
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-1">Dijital Dükkan</h4>
                                                        <p className="text-[8px] text-white/50 leading-tight line-clamp-2">Özel içerik ve dijital ürünlerime göz atın.</p>
                                                    </div>
                                                    <motion.button
                                                        whileTap={{ scale: 0.95 }}
                                                        className="mt-auto w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition-all"
                                                    >
                                                        DÜKKANI GEZ
                                                    </motion.button>
                                                </>
                                            )}

                                            {block.type === 'stats_live' && (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500 group-hover:scale-110 transition-transform">
                                                            <Flame size={18} />
                                                        </div>
                                                        <div className="px-2 py-0.5 bg-white/5 text-white/40 text-[8px] font-black rounded-full">LIVE</div>
                                                    </div>
                                                    <div className="mt-auto grid grid-cols-2 gap-2 text-center pb-1">
                                                        <div>
                                                            <div className="text-sm font-black text-white">{profile.products?.length || '0'}</div>
                                                            <div className="text-[7px] text-white/40 font-bold uppercase tracking-widest">PROJE</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-white">5+</div>
                                                            <div className="text-[7px] text-white/40 font-bold uppercase tracking-widest">YIL DENEYİM</div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {block.type === 'media_kit' && (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                                                            <Download size={18} />
                                                        </div>
                                                    </div>
                                                    <div className="text-left mt-2">
                                                        <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-1">Media Kit</h4>
                                                        <p className="text-[8px] text-white/50 leading-tight">İş birliği ve detaylar için PDF dosyasını indirin.</p>
                                                    </div>
                                                    <motion.button
                                                        whileTap={{ scale: 0.95 }}
                                                        className="mt-auto w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-400 transition-all"
                                                    >
                                                        İNDİR (PDF)
                                                    </motion.button>
                                                </>
                                            )}

                                            {block.type === 'testimonials_elite' && (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 group-hover:scale-110 transition-transform">
                                                            <Star size={18} />
                                                        </div>
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3].map(s => <Star key={s} size={6} className="fill-amber-500 text-amber-500" />)}
                                                        </div>
                                                    </div>
                                                    <div className="text-left mt-2">
                                                        <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-1">Elite Referanslar</h4>
                                                        <div className="flex -space-x-2 mt-2">
                                                            {[1, 2, 3].map(id => (
                                                                <div key={id} className="w-5 h-5 rounded-full border border-black overflow-hidden bg-zinc-800">
                                                                    <img src={`https://i.pravatar.cc/100?u=${id + 20}`} className="w-full h-full object-cover" alt="" />
                                                                </div>
                                                            ))}
                                                            <div className="w-5 h-5 rounded-full border border-black bg-zinc-800 flex items-center justify-center text-[6px] font-bold text-white">+5</div>
                                                        </div>
                                                    </div>
                                                    <motion.button
                                                        whileTap={{ scale: 0.95 }}
                                                        className="mt-auto w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white"
                                                    >
                                                        İNCELE
                                                    </motion.button>
                                                </>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )
                            }

                            {profile.slogan && <p className={cn("text-sm font-bold mt-4 opacity-70 italic", theme.text)}>“{profile.slogan}”</p>}
                        </div>

                        {(() => {
                            const links = customLinks.filter((l: any) => !l.isAction);
                            if (links.length === 0) return null;
                            return (
                                <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
                                    {links.map((link: any, i: number) => (
                                        <motion.a
                                            key={i}
                                            href={formatUrl(link.url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 + i * 0.1 }}
                                            whileHover={{ scale: 1.2, y: -3 }}
                                            className="relative group/link"
                                            onClick={() => trackEvent("custom_link", link.title)}
                                        >
                                            <div
                                                className={cn("w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-xl transition-all", theme.border)}
                                                style={{
                                                    backgroundColor: `${theme.accent}15`,
                                                    borderColor: `${theme.accent}40`,
                                                    color: theme.accent
                                                }}
                                            >
                                                <Globe size={18} />
                                            </div>
                                            <div
                                                className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/link:opacity-100 transition-all duration-300 whitespace-nowrap px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider pointer-events-none scale-75 group-hover/link:scale-100 z-50"
                                                style={{
                                                    backgroundColor: theme.accent,
                                                    color: '#000',
                                                    boxShadow: `0 0 15px ${theme.accent}40`
                                                }}
                                            >
                                                {link.title}
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" style={{ backgroundColor: theme.accent }} />
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            );
                        })()}
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
                                            href={formatUrl(action.href)}
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
                            <h3 className={cn("text-[10px] font-black uppercase tracking-[0.2em] opacity-40", theme.text)}>{t.reviews}</h3>
                            <button
                                onClick={() => setIsReviewModalOpen(true)}
                                className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 border transition-all", theme.btn, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-full")}
                                style={{ color: theme.accent }}
                            >
                                {t.writeReview}
                            </button>
                        </div>

                        <div className="relative h-32">
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
                                                    src={reviews[currentReviewIndex].image || (reviews[currentReviewIndex].gender === 'female' ? "https://avatar.iran.liara.run/public/65" : "https://avatar.iran.liara.run/public/31")}
                                                    className="w-full h-full object-cover"
                                                    onError={(e: any) => {
                                                        e.target.src = reviews[currentReviewIndex].gender === 'female' ? "https://avatar.iran.liara.run/public/65" : "https://avatar.iran.liara.run/public/31";
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
                                    {t.noReviewsYet}
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
                        {socialLinks.filter((l: any) => l.platform !== 'customLinks').slice(0, 10).map((l: any, i: number) => {
                            const platform = l.platform.toLowerCase()
                            return (
                                <a key={i} href={formatUrl(l.url)} target="_blank" className={cn("transition-all hover:scale-125 opacity-60 hover:opacity-100", theme.text)}>
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

                    {profile.paymentLink && (
                        <div className="pt-8 w-full">
                            <motion.a
                                href={formatUrl(profile.paymentLink)}
                                target="_blank"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn("w-full py-5 flex items-center justify-center gap-4 font-black text-sm uppercase tracking-[0.2em] transition-all text-white shadow-[0_20px_40px_-15px_rgba(245,158,11,0.5)] relative overflow-hidden group", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-3xl")}
                                style={{
                                    background: `linear-gradient(135deg, #f59e0b, #ea580c)`,
                                }}
                                onClick={() => trackEvent("payment_click")}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                                <Zap className="w-5 h-5 fill-white" />
                                {profile.paymentType === 'consulting' ? t.consultingBtn :
                                    profile.paymentType === 'support' ? t.supportBtn :
                                        profile.paymentType === 'pay' ? t.payBtn :
                                            t.coffeeBtn}
                            </motion.a>
                        </div>
                    )}

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
                            <FileText size={20} /> {profile.isCatalog ? (t.viewCatalog || "Katalog Görüntüle") : (t.viewCV || "CV Görüntüle")}
                        </button>
                    </div>
                </motion.div>
            </main>
            <BackgroundMusicPlayer theme={theme} tone={tone} />
        </div>
    )
}

function ReviewModal({ isOpen, onClose, onSubmit, themeColor, t }: any) {
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
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative w-full max-w-[380px] rounded-[2.5rem] p-6 backdrop-blur-2xl overflow-y-auto max-h-[95vh] no-scrollbar"
                style={{
                    background: `linear-gradient(180deg, ${themeColor}18 0%, #0a0a0f 30%, #050508 100%)`,
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: `${themeColor}50`,
                    boxShadow: `0 0 60px ${themeColor}20, 0 32px 64px -16px rgba(0,0,0,0.5)`
                }}
            >
                {/* Top glow accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 rounded-b-full" style={{ background: themeColor, boxShadow: `0 0 20px ${themeColor}80` }} />
                <div className="absolute top-0 left-0 w-full h-[200px] pointer-events-none" style={{ background: `radial-gradient(ellipse at top, ${themeColor}20, transparent 70%)` }} />

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <div className="space-y-0.5">
                            <h3 className="text-xl font-black uppercase tracking-tighter" style={{ color: themeColor }}>{t.leaveComment}</h3>
                            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: `${themeColor}80` }}>{t.leaveCommentSub}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90"
                            style={{ backgroundColor: `${themeColor}15`, borderWidth: '1px', borderStyle: 'solid', borderColor: `${themeColor}30`, color: themeColor }}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="space-y-5">
                        {/* Rating */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col items-center gap-2 py-3 rounded-2xl" style={{ backgroundColor: `${themeColor}10`, borderWidth: '1px', borderStyle: 'solid', borderColor: `${themeColor}40` }}>
                                <span className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: `${themeColor}90` }}>Puan Ver</span>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className="transition-all hover:scale-110"
                                        >
                                            <Star
                                                size={22}
                                                className={cn(
                                                    "transition-colors duration-300",
                                                    star <= formData.rating ? "fill-current" : "text-white/10"
                                                )}
                                                style={star <= formData.rating ? { color: themeColor } : {}}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                                    className="flex-1 relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-300"
                                    style={formData.gender === 'male' ? {
                                        backgroundColor: `${themeColor}15`,
                                        borderWidth: '1px', borderStyle: 'solid', borderColor: `${themeColor}60`,
                                        color: themeColor
                                    } : {
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.08)',
                                        color: 'rgba(255,255,255,0.2)'
                                    }}
                                >
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={formData.gender === 'male' ? { backgroundColor: themeColor, color: 'white' } : { backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                        <User size={16} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider">{t.male}</span>
                                </button>

                                <button
                                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                                    className="flex-1 relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-300"
                                    style={formData.gender === 'female' ? {
                                        backgroundColor: `${themeColor}15`,
                                        borderWidth: '1px', borderStyle: 'solid', borderColor: `${themeColor}60`,
                                        color: themeColor
                                    } : {
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.08)',
                                        color: 'rgba(255,255,255,0.2)'
                                    }}
                                >
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={formData.gender === 'female' ? { backgroundColor: themeColor, color: 'white' } : { backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                        <UserCircle size={16} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider">{t.female}</span>
                                </button>
                            </div>
                        </div>

                        {/* Form Inputs */}
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder={t.yourName}
                                className="w-full rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none transition-all text-xs font-medium"
                                style={{ backgroundColor: `${themeColor}08`, borderWidth: '1px', borderStyle: 'solid', borderColor: `${themeColor}30` }}
                                onFocus={(e) => { e.target.style.borderColor = `${themeColor}80`; e.target.style.boxShadow = `0 0 15px ${themeColor}20`; }}
                                onBlur={(e) => { e.target.style.borderColor = `${themeColor}30`; e.target.style.boxShadow = 'none'; }}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder={t.yourTitle}
                                className="w-full rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none transition-all text-xs font-medium"
                                style={{ backgroundColor: `${themeColor}08`, borderWidth: '1px', borderStyle: 'solid', borderColor: `${themeColor}30` }}
                                onFocus={(e) => { e.target.style.borderColor = `${themeColor}80`; e.target.style.boxShadow = `0 0 15px ${themeColor}20`; }}
                                onBlur={(e) => { e.target.style.borderColor = `${themeColor}30`; e.target.style.boxShadow = 'none'; }}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                            <textarea
                                rows={3}
                                placeholder={t.yourMessage}
                                className="w-full rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none transition-all text-xs font-medium resize-none"
                                style={{ backgroundColor: `${themeColor}08`, borderWidth: '1px', borderStyle: 'solid', borderColor: `${themeColor}30` }}
                                onFocus={(e) => { e.target.style.borderColor = `${themeColor}80`; e.target.style.boxShadow = `0 0 15px ${themeColor}20`; }}
                                onBlur={(e) => { e.target.style.borderColor = `${themeColor}30`; e.target.style.boxShadow = 'none'; }}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!formData.name || !formData.content}
                            className="group relative w-full py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 overflow-hidden"
                            style={{ boxShadow: `0 0 30px ${themeColor}30, 0 10px 30px -10px ${themeColor}40` }}
                        >
                            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}aa)` }} />
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <MessageSquare size={14} />
                                {t.publishReview}
                            </span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

