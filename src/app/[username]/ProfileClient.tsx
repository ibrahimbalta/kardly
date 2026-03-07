"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useMotionValue, useTransform, animate, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"
import html2canvas from 'html2canvas'
import {
    Eye,
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
    Layout,
    TrendingUp,
    Brain,
    Flame,
    Bot,
    Send,
    ChevronLeft,
    ChevronRight,
    Image,
    Dribbble,
    Monitor,
    Rss,
    RefreshCw
} from "lucide-react"
import BusinessCardGenerator from "@/components/BusinessCardGenerator"
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
        { id: '1', name: "Fatih Yaman", title: "CEO, XYZ Şirketi", content: "Şirketimizin test sürecini mükemmel bir şekilde yönetti. Kesinlikle tavsiye ederim!", rating: 5, gender: 'male', image: "https://ui-avatars.com/api/?name=Fatih+Yaman&background=0d0d0e&color=fff&size=128" },
        { id: '2', name: "Zeynep Kaya", title: "Yazılım Müdürü", content: "Teknik bilgisi ve problem çözme hızı gerçekten etkileyici.", rating: 5, gender: 'female', image: "https://ui-avatars.com/api/?name=Zeynep+Kaya&background=0d0d0e&color=fff&size=128" },
        { id: '3', name: "Ali Yılmaz", title: "Proje Yöneticisi", content: "İletişimi çok güçlü ve teslimatları her zaman zamanında yapıyor.", rating: 4, gender: 'male', image: "https://ui-avatars.com/api/?name=Ali+Yilmaz&background=0d0d0e&color=fff&size=128" }
    ])
    const [reviewStatus, setReviewStatus] = useState<string | null>(null)
    const [leadStatus, setLeadStatus] = useState<string | null>(null)
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
    const [isQrOpen, setIsQrOpen] = useState(false)
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
    const [qrDataUrl, setQrDataUrl] = useState<string>("")
    const [isAIChatOpen, setIsAIChatOpen] = useState(false)
    const [chatMessages, setChatMessages] = useState<{ role: string, content: string }[]>([])
    const [isEmbedMode, setIsEmbedMode] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            if (params.get('embed') === 'true') {
                setIsEmbedMode(true)
            }
        }
    }, [])

    const aiConfig = useMemo(() => {
        const block = profile.blocks?.find((b: any) => b.type === 'ai_assistant')
        const content = block?.content || {
            isEnabled: true,
            assistantName: "Kardly AI",
            greeting: "",
            instructions: ""
        }

        const systemPrompt = `
        Sen ${profile.user.name}'in dijital asistanısın${content.assistantName !== 'Kardly AI' ? ` (Adın: ${content.assistantName})` : ""}. Görevin, profil sayfasını ziyaret eden kişilerin sorularını yanıtlamak ve onlara yardımcı olmaktır.
        
        === PROFİL SAHİBİ BİLGİLERİ ===
        - İsim: ${profile.user.name}
        - Meslek/Unvan: ${profile.occupation || "Belirtilmedi"}
        - Slogan: ${profile.slogan || "Belirtilmedi"}
        - Biyografi: ${profile.bio || "Belirtilmedi"}
        - Hizmetler: ${JSON.stringify(profile.services || [])}
        - Sosyal Medya: ${JSON.stringify(profile.socialLinks || [])}
        
        === KURALLAR ===
        1. Her zaman nazik, profesyonel ve yardımcı ol.
        2. ${profile.user.name} adına konuşuyormuş gibi değil, onun asistanı gibi konuş (Örn: "İbrahim Bey şu an...", "Size bu konuda yardımcı olabilirim").
        3. Yanıtlarını kısa ve öz tut.
        4. Eğer kullanıcı randevu almak isterse, sayfadaki "Randevu Al" butonunu kullanabileceğini söyle.
        5. Eğer iletişim kurmak isterse, "İletişime Geç" butonuna tıklamasını veya mail/telefon bilgilerini paylaşabileceğini belirt.
        6. Bilmediğin konularda uydurma yapma, "Bu konuda İbrahim Bey'e danışıp size dönebiliriz" de.
        7. Yanıtlarda emojiler kullanabilirsin ama aşırıya kaçma.
        ${content.instructions ? `\n=== ÖZEL TALİMATLAR ===\n${content.instructions}` : ""}
        
        Kullanıcının dili neyse (Türkçe veya İngilizce) o dilde cevap ver.
        `.trim()

        return {
            ...content,
            systemPrompt: systemPrompt
        }
    }, [profile.blocks, profile.user.name, profile.occupation, profile.slogan, profile.bio, profile.services, profile.socialLinks])

    const t = translations[lang as keyof typeof translations] || translations.tr

    useEffect(() => {
        setMounted(true)

        // Auto-language detection
        const detectLanguage = () => {
            const savedLang = localStorage.getItem('lang')
            if (savedLang) {
                setLang(savedLang)
                return
            }

            const browserLang = navigator.language.toLowerCase()
            if (browserLang.startsWith('tr')) {
                setLang('tr')
            } else {
                setLang('en')
            }
        }
        detectLanguage()

        // Page view track
        if (profile.id) {
            fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileId: profile.id, type: "view" })
            }).catch(console.error)

            // Dynamic QR Code Generation
            const generateQr = async () => {
                try {
                    const QRCode = (await import('qrcode')).default
                    const url = `${window.location.origin}/${profile.username}`
                    const dataUrl = await QRCode.toDataURL(url, {
                        margin: 2,
                        width: 400,
                        color: {
                            dark: '#000000',
                            light: '#ffffff'
                        }
                    })
                    setQrDataUrl(dataUrl)
                } catch (err) {
                    console.error("QR generating error:", err)
                }
            }
            generateQr()
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
        const phone = (profile.socialLinks as any[])?.find((l: any) => l.platform === 'phone')?.url || profile.phone || ""
        const website = `${window.location.origin}/${profile.username}`
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.user.name}
N:${profile.user.name.split(" ").reverse().join(";") || ""};;;;
ORG:${profile.occupation || ""}
TEL;TYPE=CELL:${phone}
EMAIL:${profile.user.email || ""}
URL:${website}
NOTE:${profile.bio || profile.slogan || ""}
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

    const props = { profile, t, lang, setLang, setIsAppointmentOpen, isAppointmentOpen, handleShare, handleCVView, handleAddToContacts, reviews, setIsReviewModalOpen, isReviewModalOpen, trackEvent, setReviewStatus, reviewStatus, setIsQrOpen, isWalletModalOpen, setIsWalletModalOpen, qrDataUrl, isQrOpen, copied, setIsLeadModalOpen, isLeadModalOpen, setLeadStatus, leadStatus, isAIChatOpen, setIsAIChatOpen, chatMessages, setChatMessages, aiConfig, isEmbedMode }

    // Get active accent color for review modal
    const getActiveAccent = (): string => {
        if (profile.themeColor) return profile.themeColor;
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

    const toneStyle = getToneStyle(profile.tone || "profesyonel")

    // Template Selector Logic
    const renderTemplate = () => {
        const tone = profile.tone?.toLowerCase() || "profesyonel"
        const templateId = profile.templateId || "black"

        return <NeonModernTemplate {...props} colorScheme={templateId} tone={tone} toneStyle={toneStyle} />;
    }

    return (
        <>
            {renderTemplate()}
        </>
    )
}




function NeonModernTemplate({ profile, colorScheme, handleShare, handleCVView, handleAddToContacts, reviews, isReviewModalOpen, setIsReviewModalOpen, setIsAppointmentOpen, isAppointmentOpen, t, trackEvent, tone, setReviewStatus, reviewStatus, setIsQrOpen, lang, setLang, isWalletModalOpen, setIsWalletModalOpen, qrDataUrl, isQrOpen, toneStyle, copied, setIsLeadModalOpen, isLeadModalOpen, setLeadStatus, leadStatus, isAIChatOpen, setIsAIChatOpen, chatMessages, setChatMessages, aiConfig, isEmbedMode }: any) {
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
    const [layoutMode, setLayoutMode] = useState<'marquee' | 'grid'>('grid') // Default to grid for demo visibility


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
        neon_cyber: {
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
        neon_galaxy: {
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
        neon_acid: {
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
        neon_candy: {
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
        neon_aurora: {
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
        neon_black: {
            bg: "bg-[#020617]",
            card: "bg-black/80",
            text: "text-white",
            subtext: "text-white/40",
            border: "border-blue-500/30",
            glow: "shadow-[0_0_40px_rgba(59,130,246,0.5)]",
            accent: "#3b82f6",
            btn: "bg-black/60 border-blue-500/40",
            btnText: "text-white",
            icon: "text-[#3b82f6]",
            special: "neon_modern"
        },
        neon_blue: {
            bg: "bg-[#0c1e35]",
            card: "bg-[#0f2a4a]/40",
            text: "text-white",
            subtext: "text-blue-200/60",
            border: "border-blue-500/20",
            glow: "shadow-[0_0_20px_rgba(56,189,248,0.5)]",
            accent: "#38bdf8",
            btn: "bg-[#0f2a4a]/60 border-blue-500/30",
            btnText: "text-white",
            icon: "text-[#38bdf8]",
            special: "neon_blue"
        },
        neon_purple: {
            bg: "bg-[#13072e]",
            card: "bg-[#1a0b3d]/40",
            text: "text-white",
            subtext: "text-purple-200/60",
            border: "border-purple-500/20",
            glow: "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
            accent: "#a855f7",
            btn: "bg-[#1a0b3d]/60 border-purple-500/30",
            btnText: "text-white",
            icon: "text-[#a855f7]",
            special: "neon_purple"
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
        },
        minimal_glass: {
            bg: "bg-[#f8fafc]",
            card: "bg-white/10",
            text: "text-slate-900",
            subtext: "text-slate-500",
            border: "border-white/40",
            glow: "shadow-[0_20px_50px_rgba(0,0,0,0.05)]",
            accent: "#38bdf8",
            btn: "bg-white/20 border-white/60",
            btnText: "text-slate-900",
            icon: "text-sky-500",
            special: "minimal_glass"
        },
        nature_dawn: {
            bg: "bg-[#fdfcf0]",
            card: "bg-white/80",
            text: "text-emerald-950",
            subtext: "text-amber-800/60",
            border: "border-emerald-100",
            glow: "shadow-[0_0_40px_rgba(52,211,153,0.1)]",
            accent: "#059669",
            btn: "bg-emerald-50 border-emerald-100",
            btnText: "text-emerald-900",
            icon: "text-emerald-600",
            special: "nature_dawn"
        },

        // 3D Immersive Series
        "3d_frost": {
            bg: "bg-[#0a1628]",
            card: "bg-[#0d1f3c]/80",
            text: "text-[#c8e6ff]",
            subtext: "text-[#7eb8e0]/60",
            border: "border-[#38bdf8]/20",
            glow: "shadow-[0_0_60px_rgba(56,189,248,0.25),0_0_120px_rgba(147,197,253,0.1)]",
            accent: "#38bdf8",
            btn: "bg-[#0c1a2e]/90 border-[#38bdf8]/25",
            btnText: "text-[#93c5fd]",
            icon: "text-[#60a5fa]",
            special: "3d_frost"
        },
        "3d_magma": {
            bg: "bg-[#1a0a1e]",
            card: "bg-[#2d1035]/70",
            text: "text-[#fcd6ff]",
            subtext: "text-[#d946ef]/50",
            border: "border-[#d946ef]/25",
            glow: "shadow-[0_0_60px_rgba(217,70,239,0.3),0_0_120px_rgba(249,115,22,0.15)]",
            accent: "#d946ef",
            btn: "bg-gradient-to-r from-[#7c3aed]/80 to-[#db2777]/80 border-[#d946ef]/30",
            btnText: "text-white",
            icon: "text-[#f0abfc]",
            special: "3d_magma"
        },
        "3d_cyber": {
            bg: "bg-[#020a14]",
            card: "bg-[#071320]/80",
            text: "text-[#22d3ee]",
            subtext: "text-[#06b6d4]/40",
            border: "border-[#06b6d4]/20",
            glow: "shadow-[0_0_60px_rgba(6,182,212,0.25),0_0_120px_rgba(139,92,246,0.1)]",
            accent: "#06b6d4",
            btn: "bg-[#050e1a]/90 border-[#06b6d4]/25",
            btnText: "text-[#67e8f9]",
            icon: "text-[#22d3ee]",
            special: "3d_cyber"
        },
        "3d_aurora": {
            bg: "bg-[#020818]",
            card: "bg-[#0a1a2e]/70",
            text: "text-white",
            subtext: "text-emerald-300/50",
            border: "border-emerald-400/15",
            glow: "shadow-[0_0_80px_rgba(52,211,153,0.2),0_0_160px_rgba(139,92,246,0.15)]",
            accent: "#34d399",
            btn: "bg-gradient-to-r from-emerald-500/20 to-violet-500/20 border-emerald-400/20 backdrop-blur-xl",
            btnText: "text-white",
            icon: "text-emerald-400",
            special: "3d_aurora"
        },
        "3d_neoncity": {
            bg: "bg-[#0a0012]",
            card: "bg-[#150025]/60",
            text: "text-[#ff2d95]",
            subtext: "text-[#ff2d95]/40",
            border: "border-[#ff2d95]/15",
            glow: "shadow-[0_0_60px_rgba(255,45,149,0.25),0_0_120px_rgba(0,200,255,0.15)]",
            accent: "#ff2d95",
            btn: "bg-[#12001f]/80 border-[#ff2d95]/30 shadow-[inset_0_1px_0_rgba(255,45,149,0.2),0_4px_20px_rgba(255,45,149,0.15)]",
            btnText: "text-[#ff6db8]",
            icon: "text-[#ff2d95]",
            special: "3d_neoncity"
        },
        "3d_galaxy": {
            bg: "bg-[#030108]",
            card: "bg-[#0d0520]/70",
            text: "text-white",
            subtext: "text-purple-300/50",
            border: "border-purple-500/15",
            glow: "shadow-[0_0_80px_rgba(168,85,247,0.3),0_0_160px_rgba(56,189,248,0.1)]",
            accent: "#a855f7",
            btn: "bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-purple-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)]",
            btnText: "text-purple-200",
            icon: "text-purple-400",
            special: "3d_galaxy"
        },
        "3d_luxegold": {
            bg: "bg-[#080604]",
            card: "bg-[#141008]/80",
            text: "text-[#fbbf24]",
            subtext: "text-[#d4a017]/40",
            border: "border-[#fbbf24]/15",
            glow: "shadow-[0_0_60px_rgba(251,191,36,0.2),0_0_120px_rgba(217,119,6,0.1)]",
            accent: "#fbbf24",
            btn: "bg-gradient-to-r from-[#b8860b]/30 to-[#d4a017]/20 border-[#fbbf24]/25 shadow-[inset_0_1px_0_rgba(251,191,36,0.3),0_4px_15px_rgba(251,191,36,0.1)]",
            btnText: "text-[#fcd34d]",
            icon: "text-[#fbbf24]",
            special: "3d_luxegold"
        },
        "3d_hologram": {
            bg: "bg-[#050510]",
            card: "bg-white/[0.03]",
            text: "text-white",
            subtext: "text-sky-300/40",
            border: "border-white/10",
            glow: "shadow-[0_0_60px_rgba(56,189,248,0.15),0_0_120px_rgba(236,72,153,0.15)]",
            accent: "#38bdf8",
            btn: "bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-pink-500/10 border-white/10 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]",
            btnText: "text-white",
            icon: "text-sky-400",
            special: "3d_hologram"
        },
        "3d_quantum": {
            bg: "bg-[#020205]",
            card: "bg-white/[0.01] backdrop-blur-3xl",
            text: "text-white",
            subtext: "text-indigo-300/40",
            border: "border-indigo-500/20",
            glow: "shadow-[0_30px_100px_rgba(99,102,241,0.15)]",
            accent: "#6366f1",
            btn: "rounded-full bg-indigo-500/10 border-indigo-500/30 backdrop-blur-2xl shadow-[0_10px_30px_rgba(99,102,241,0.1)] hover:bg-indigo-500/20 transition-all",
            btnText: "text-indigo-100",
            icon: "text-indigo-400",
            special: "3d_quantum"
        }
    };
    const baseTheme = themes[colorScheme as string] || themes.black;
    const theme = { ...baseTheme };

    // Override accent color with custom selection if available
    if (profile.themeColor) {
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

    const translateText = (text: string) => {
        if (lang === 'tr' || !text) return text;
        const mapping: Record<string, string> = {
            "Dış Doktoru": "Dentist",
            "Gülüşünüzü Aydınlatın": "Brighten Your Smile",
            "Yazılım Mimarı": "Software Architect",
            "Tasarımcı": "Designer"
        };
        return mapping[text] || text;
    };

    const actions = [
        { label: t.phoneCallsBtn || "Call", icon: <Phone size={20} />, href: `tel:${socialLinks.find((l: any) => l.platform === 'phone')?.url}`, onClick: () => trackEvent("phone"), active: !!socialLinks.find((l: any) => l.platform === 'phone')?.url },
        { label: t.waMessagesBtn || "WhatsApp", icon: <MessageCircle size={20} />, href: `https://wa.me/${socialLinks.find((l: any) => l.platform === 'phone')?.url?.replace(/\D/g, '')}`, onClick: () => trackEvent("whatsapp"), active: !!socialLinks.find((l: any) => l.platform === 'phone')?.url },
        {
            label: t.contactMeTitle,
            icon: <MessageSquare size={20} />,
            onClick: () => {
                trackEvent("contact_form")
                setIsLeadModalOpen(true)
            },
            active: true
        },
        { label: t.emailBtn || "E-Mail", icon: <Mail size={20} />, href: `mailto:${profile.user.email}`, onClick: () => trackEvent("email"), active: !!profile.user.email },
        {
            label: t.bookAppointment, icon: <Calendar size={20} />, onClick: () => {
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
        { label: t.website, icon: <Globe size={20} />, href: formatUrl(socialLinks.find((l: any) => l.platform === 'website')?.url), onClick: () => trackEvent("website"), active: !!socialLinks.find((l: any) => l.platform === 'website')?.url },
        { label: t.locationsBtn, icon: <MapPin size={20} />, href: formatUrl(socialLinks.find((l: any) => l.platform === 'location')?.url), onClick: () => trackEvent("location"), active: !!socialLinks.find((l: any) => l.platform === 'location')?.url },
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
                        <div className="absolute inset-0 animate-pulse" style={{ background: `radial-gradient(circle at 20% 30%, ${theme.accent}22 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${theme.accent}22 0%, transparent 50%)` }} />
                        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,#000_25%,#111_25%,#111_50%,#000_50%,#000_75%,#111_75%)] bg-[length:20px_20px] opacity-[0.03]" />
                    </>
                )}
                {theme.special === "galaxy" && (
                    <>
                        <div className="absolute inset-0 animate-pulse" style={{ background: `radial-gradient(circle at 50% 50%, ${theme.accent}22 0%, transparent 70%)` }} />
                        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ background: `radial-gradient(2px 2px at 20px 30px, ${theme.accent}, rgba(0,0,0,0)), radial-gradient(2px 2px at 40px 70px, white, rgba(0,0,0,0)), radial-gradient(2px 2px at 50px 160px, ${theme.accent}, rgba(0,0,0,0))`, backgroundSize: '100px 100px' }} />
                    </>
                )}
                {theme.special === "acid" && (
                    <div className="absolute inset-0 animate-pulse" style={{ background: `radial-gradient(circle at 30% 20%, ${theme.accent}22 0%, transparent 60%), radial-gradient(circle at 70% 80%, ${theme.accent}11 0%, transparent 60%)` }} />
                )}
                {theme.special === "candy" && (
                    <div className="absolute inset-0 animate-pulse" style={{ background: `radial-gradient(circle at 20% 80%, ${theme.accent}22 0%, transparent 60%), radial-gradient(circle at 80% 20%, ${theme.accent}22 0%, transparent 60%)` }} />
                )}
                {theme.special === "aurora" && (
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,#2dd4bf11,#6366f111,#2dd4bf11)] animate-spin-slow opacity-50" />
                )}
                {theme.special === "neon_modern" && (
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 animate-pulse" style={{ background: `radial-gradient(circle at 50% 50%, ${theme.accent}11 0%, transparent 70%)` }} />
                        <div className="absolute inset-x-0 top-0 h-[2px] opacity-50" style={{ background: `linear-gradient(to right, transparent, ${theme.accent}, transparent)` }} />
                        <div className="absolute inset-x-0 bottom-0 h-[2px] opacity-50" style={{ background: `linear-gradient(to right, transparent, ${theme.accent}, transparent)` }} />
                    </div>
                )}
                {theme.special === "neon_blue" && (
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 20% 20%, ${theme.accent}22 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${theme.accent}11 0%, transparent 50%)` }} />
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
                    </div>
                )}
                {theme.special === "neon_purple" && (
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 animate-pulse" style={{ background: `radial-gradient(circle at 50% 50%, ${theme.accent}22 0%, transparent 80%)` }} />
                        <div className="absolute top-0 left-0 w-full h-full" style={{ background: `radial-gradient(circle at 20% 30%, ${theme.accent}11 0%, transparent 40%), radial-gradient(circle at 80% 70%, ${theme.accent}11 0%, transparent 40%)` }} />
                    </div>
                )}
                {theme.special === "nature_dawn" && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,#fef3c7_0%,transparent_50%),radial-gradient(circle_at_100%_0%,#d1fae5_0%,transparent_50%)] opacity-40" />
                        <motion.div
                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 8, repeat: Infinity }}
                            className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-yellow-400/20 blur-[100px] rounded-full"
                        />
                    </div>
                )}
                {theme.special === "minimal_glass" && (
                    <div className="absolute inset-0 z-0 overflow-hidden bg-white/20">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[100px] rounded-full" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 blur-[100px] rounded-full" />
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
                    </div>
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
                            className="absolute inset-x-0 h-[20%] z-10"
                            style={{ background: `linear-gradient(to bottom, transparent, ${theme.accent}15, transparent)` }}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                    </div>
                )}

                {theme.special === "dark_onyx" && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,black_100%)]" />
                        <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${theme.accent}80, transparent)` }} />
                        <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${theme.accent}80, transparent)` }} />
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
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                    </div>
                )}

                {theme.special === "pop_comic" && (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='5' fill='%23000'/%3E%3C/svg%3E")`, backgroundSize: '10px 10px' }} />
                )}

                {theme.special === "zen_garden" && (
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%23000' fill='none' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='30' stroke='%23000' fill='none' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='20' stroke='%23000' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: '150px 150px' }} />
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
                    <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/pinstriped-suit.png")` }} />
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
                                className="absolute inset-x-0 h-1 z-10"
                                style={{
                                    top: `${i * 20}%`,
                                    background: `linear-gradient(to right, transparent, ${theme.accent}, transparent)`,
                                    boxShadow: `0 0 20px ${theme.accent}`
                                }}
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
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border rounded-full"
                            style={{ borderColor: `${theme.accent}15` }}
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
                    <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='2' height='2' x='0' y='0' fill='${encodeURIComponent(theme.accent)}'/%3E%3Crect width='2' height='2' x='10' y='10' fill='${encodeURIComponent(theme.accent)}'/%3E%3C/svg%3E")` }} />
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
                        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full" style={{ fill: theme.accent }}>
                            <path d="M0,100 L0,80 L50,80 L50,40 L100,40 L100,70 L150,70 L150,20 L200,20 L200,80 L250,80 L250,40 L300,40 L300,60 L350,60 L350,10 L400,10 L400,80 L450,80 L450,30 L500,30 L500,70 L550,70 L550,0 L600,0 L600,80 L650,80 L650,40 L700,40 L700,60 L750,60 L750,20 L800,20 L800,80 L850,80 L850,50 L900,50 L900,80 L950,80 L950,30 L1000,30 L1000,100 Z" />
                        </svg>
                    </div>
                )}
                {theme.special === "lawyer" && (
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none flex items-center justify-center">
                        <svg width="600" height="600" viewBox="0 0 24 24" fill="none" style={{ stroke: theme.accent }} strokeWidth="0.1">
                            <path d="M12 3v18M12 3l7 3M12 3L5 6m7 15l7-3m-7 3l-7-3M5 6v12m14-12v12M5 10h14M5 14h14" />
                        </svg>
                    </div>
                )}
                {theme.special === "architect" && (
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none">
                        <div className="absolute top-10 left-10 text-[10px] font-mono" style={{ color: theme.accent }}>R: 12.5m</div>
                        <div className="absolute bottom-20 right-10 text-[10px] font-mono" style={{ color: theme.accent }}>θ: 45°</div>
                        <div className="absolute top-1/2 left-0 w-full h-[1px]" style={{ background: `${theme.accent}33` }} />
                        <div className="absolute left-1/2 top-0 h-full w-[1px]" style={{ background: `${theme.accent}33` }} />
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
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ stroke: theme.accent }} strokeWidth="1">
                                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-7 7c-.67 0-1.32-.1-1.94-.27" />
                                    <path d="M11 20c-2.33 0-4.32-1.45-5.12-3.5M11 20c.56 0 1.1-.1 1.6-.3" />
                                </svg>
                            </motion.div>
                        ))}
                    </div>
                )}
                {theme.special === "artistic" && (
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] blur-[100px] rounded-full" style={{ background: `linear-gradient(to left, ${theme.accent}33, transparent)` }} />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] blur-[100px] rounded-full" style={{ background: `linear-gradient(to right, ${theme.accent}33, transparent)` }} />
                    </div>
                )}
                {theme.special === "software" && (
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none font-mono text-[10px] p-10 overflow-hidden leading-relaxed" style={{ color: `${theme.accent}80` }}>
                        {`function init() {\n  const system = "Kardly";\n  console.log("Welcome " + user);\n}\n`.repeat(100)}
                    </div>
                )}
                {theme.special === "doctor" && (
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none flex items-center justify-center">
                        <svg width="400" height="400" viewBox="0 0 24 24" fill="none" style={{ stroke: theme.accent }} strokeWidth="0.5">
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
                                className="w-2 rounded-full"
                                style={{ backgroundColor: `${theme.accent}4D` }}
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

                {/* 3D Frost Background */}
                {theme.special === "3d_frost" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0d2847 30%, #1a3a5c 50%, #2d5a7b 70%, #c8dce8 100%)' }} />
                        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(56,189,248,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(147,197,253,0.2) 0%, transparent 50%)' }} />
                        <div className="absolute bottom-0 left-0 right-0 h-[40%] opacity-30" style={{ background: 'linear-gradient(to top, rgba(200,230,255,0.3), transparent)', filter: 'blur(20px)' }} />
                        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%2393c5fd' fill-opacity='0.4'/%3E%3C/svg%3E")`, backgroundSize: '12px 12px' }} />
                    </>
                )}

                {/* 3D Magma Background */}
                {theme.special === "3d_magma" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #1a0a1e 0%, #2d1035 25%, #4a1942 45%, #8b3a62 65%, #c4564a 80%, #f97316 100%)' }} />
                        <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(ellipse at 50% 70%, rgba(249,115,22,0.4) 0%, transparent 60%), radial-gradient(ellipse at 30% 30%, rgba(168,85,247,0.3) 0%, transparent 50%)' }} />
                        <div className="absolute bottom-0 left-0 right-0 h-[35%] animate-pulse opacity-40" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.6) 0%, transparent 70%)' }} />
                        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%23d946ef' fill-opacity='0.3'/%3E%3C/svg%3E")`, backgroundSize: '8px 8px' }} />
                    </>
                )}

                {/* 3D Cyber Background */}
                {theme.special === "3d_cyber" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #020a14 0%, #071520 30%, #0a2035 50%, #0d2a4a 70%, #102040 100%)' }} />
                        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(6,182,212,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.2) 0%, transparent 50%)' }} />
                        <div className="absolute bottom-0 left-0 right-0 h-[40%] opacity-20" style={{ background: 'linear-gradient(to top, rgba(6,182,212,0.4), transparent)' }} />
                        <div className="absolute inset-0 opacity-[0.04]" style={{
                            backgroundImage: `linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }} />
                        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='3' height='3' viewBox='0 0 3 3' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%2306b6d4' fill-opacity='0.3'/%3E%3C/svg%3E")`, backgroundSize: '6px 6px' }} />
                    </>
                )}

                {/* 3D Aurora Background */}
                {theme.special === "3d_aurora" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #020818 0%, #051530 25%, #0a2540 50%, #082838 75%, #0d3530 100%)' }} />
                        <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(ellipse at 40% 30%, rgba(52,211,153,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.25) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(56,189,248,0.2) 0%, transparent 40%)' }} />
                        <div className="absolute top-[15%] left-0 right-0 h-[40%] opacity-40 animate-pulse" style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.3) 20%, rgba(139,92,246,0.3) 50%, rgba(56,189,248,0.3) 80%, transparent)', filter: 'blur(30px)', transform: 'skewY(-5deg)' }} />
                        <div className="absolute top-[25%] left-0 right-0 h-[30%] opacity-25" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,243,208,0.4) 30%, rgba(196,181,253,0.3) 60%, transparent)', filter: 'blur(20px)', transform: 'skewY(3deg)', animation: 'pulse 4s ease-in-out infinite alternate' }} />
                    </>
                )}

                {/* 3D Neon City Background */}
                {theme.special === "3d_neoncity" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a0012 0%, #150020 30%, #1a0030 50%, #200040 70%, #0a0015 100%)' }} />
                        <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(ellipse at 30% 70%, rgba(255,45,149,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(0,200,255,0.2) 0%, transparent 50%)' }} />
                        <div className="absolute bottom-0 left-0 right-0 h-[50%] opacity-30" style={{ background: 'linear-gradient(to top, rgba(255,45,149,0.3), transparent)' }} />
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                            backgroundImage: `linear-gradient(rgba(255,45,149,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.2) 1px, transparent 1px)`,
                            backgroundSize: '60px 60px'
                        }} />
                        <style>{`
                            @keyframes neonrain {
                                0% { transform: translateY(-100%); opacity: 0; }
                                10% { opacity: 1; }
                                90% { opacity: 1; }
                                100% { transform: translateY(100vh); opacity: 0; }
                            }
                        `}</style>
                        {Array(8).fill(0).map((_, i) => (
                            <div key={`neonrain-${i}`} className="absolute w-[1px] opacity-20" style={{
                                left: `${10 + i * 12}%`,
                                height: '30%',
                                background: i % 2 === 0 ? 'linear-gradient(to bottom, transparent, #ff2d95, transparent)' : 'linear-gradient(to bottom, transparent, #00c8ff, transparent)',
                                animation: `neonrain ${3 + i * 0.5}s ease-in-out ${i * 0.8}s infinite`
                            }} />
                        ))}
                    </>
                )}

                {/* 3D Galaxy Background */}
                {theme.special === "3d_galaxy" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, #0d0520 0%, #030108 100%)' }} />
                        <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(circle at 30% 40%, rgba(168,85,247,0.3) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(56,189,248,0.2) 0%, transparent 35%), radial-gradient(circle at 50% 20%, rgba(236,72,153,0.15) 0%, transparent 30%)' }} />
                        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='0.5' fill='white' fill-opacity='0.5'/%3E%3C/svg%3E")`, backgroundSize: '40px 40px' }} />
                        <div className="absolute top-[20%] left-[10%] w-[80%] h-[60%] opacity-20 animate-spin" style={{ background: 'conic-gradient(from 0deg, transparent, rgba(168,85,247,0.3) 25%, transparent 50%, rgba(56,189,248,0.2) 75%, transparent)', animationDuration: '60s', filter: 'blur(40px)' }} />
                    </>
                )}

                {/* 3D Luxe Gold Background */}
                {theme.special === "3d_luxegold" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #080604 0%, #0f0c06 30%, #1a150a 50%, #0f0c06 70%, #080604 100%)' }} />
                        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(251,191,36,0.15) 0%, transparent 50%), radial-gradient(ellipse at 30% 80%, rgba(217,119,6,0.1) 0%, transparent 40%)' }} />
                        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23fbbf24' stroke-width='0.3'/%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />
                        <div className="absolute top-0 left-0 right-0 h-[1px] opacity-30" style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }} />
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] opacity-30" style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }} />
                    </>
                )}

                {/* 3D Hologram Background */}
                {theme.special === "3d_hologram" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #050510 0%, #0a0520 25%, #050510 50%, #050515 75%, #050510 100%)' }} />
                        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(56,189,248,0.2) 0%, transparent 40%), radial-gradient(circle at 70% 70%, rgba(236,72,153,0.2) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(168,85,247,0.15) 0%, transparent 30%)' }} />
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                            backgroundSize: '30px 30px'
                        }} />
                        <style>{`
                            @keyframes holoshift {
                                0%, 100% { opacity: 0.15; background-position: 0% 0%; }
                                50% { opacity: 0.25; background-position: 100% 100%; }
                            }
                        `}</style>
                        <div className="absolute inset-0" style={{
                            background: 'linear-gradient(45deg, rgba(56,189,248,0.05) 0%, rgba(168,85,247,0.05) 25%, rgba(236,72,153,0.05) 50%, rgba(52,211,153,0.05) 75%, rgba(56,189,248,0.05) 100%)',
                            backgroundSize: '200% 200%',
                            animation: 'holoshift 8s ease-in-out infinite'
                        }} />
                    </>
                )}

                {/* 3D Quantum Liquid Background */}
                {theme.special === "3d_quantum" && (
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-[#020205]" />
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={`quantum-${i}`}
                                animate={{
                                    x: [
                                        Math.random() * 200 - 100,
                                        Math.random() * 400 - 200,
                                        Math.random() * 200 - 100,
                                    ],
                                    y: [
                                        Math.random() * 200 - 100,
                                        Math.random() * 500 - 250,
                                        Math.random() * 200 - 100,
                                    ],
                                    scale: [1, 1.5, 0.8, 1.2, 1],
                                    rotate: [0, 90, 180, 270, 360],
                                }}
                                transition={{
                                    duration: 20 + i * 10,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-[120px] opacity-[0.15]"
                                style={{
                                    width: `${400 + i * 100}px`,
                                    height: `${400 + i * 100}px`,
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    background: i % 2 === 0 ? '#4f46e5' : '#818cf8',
                                }}
                            />
                        ))}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                        <div className="absolute inset-0 mix-blend-overlay opacity-[0.02]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")` }} />
                    </div>
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

                {/* Particle Systems Mapping */}
                {theme.special === "software" && <ParticleBackground type="matrix" color={theme.accent || "#10b981"} />}
                {theme.special === "finance" && <ParticleBackground type="finance" color={theme.accent || "#334155"} />}
                {theme.special === "cyber_glitch" && <ParticleBackground type="matrix" color={theme.accent || "#0ef"} />}
                {theme.special === "gamer" && <ParticleBackground type="matrix" color={theme.accent || "#00ff9f"} />}
                {theme.special === "3d_frost" && <ParticleBackground type="starfield" color={"#93c5fd"} />}
                {theme.special === "3d_magma" && <ParticleBackground type="bubbles" color={"#d946ef"} />}
                {theme.special === "3d_cyber" && <ParticleBackground type="matrix" color={"#06b6d4"} />}
                {theme.special === "3d_aurora" && <ParticleBackground type="bubbles" color={"#34d399"} />}
                {theme.special === "3d_neoncity" && <ParticleBackground type="matrix" color={"#ff2d95"} />}
                {theme.special === "3d_galaxy" && <ParticleBackground type="starfield" color={"#a855f7"} />}
                {theme.special === "3d_luxegold" && <ParticleBackground type="starfield" color={"#fbbf24"} />}
                {theme.special === "3d_hologram" && <ParticleBackground type="starfield" color={"#38bdf8"} />}
                {theme.special === "3d_quantum" && <ParticleBackground type="bubbles" color={"#6366f1"} />}

                {tone === 'yaratıcı' && !["software", "finance", "gamer"].includes(theme.special) && <ParticleBackground type="matrix" color={theme.accent || "#0f0"} />}
                {tone === 'lüks' && <ParticleBackground type="starfield" color={theme.accent || "#fff"} />}
                {tone === 'profesyonel' && !["software", "finance"].includes(theme.special) && <ParticleBackground type="bubbles" color={theme.accent || "#3b82f6"} />}
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

            <AnimatePresence>
                {isWalletModalOpen && (
                    <WalletModal
                        isOpen={isWalletModalOpen}
                        onClose={() => setIsWalletModalOpen(false)}
                        profile={profile}
                        t={t}
                        handleAddToContacts={handleAddToContacts}
                        theme={theme}
                        toneStyle={toneStyle}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isQrOpen && (
                    <QrModal
                        isOpen={isQrOpen}
                        onClose={() => setIsQrOpen(false)}
                        theme={theme}
                        profile={profile}
                        t={t}
                    />
                )}
            </AnimatePresence>

            <main className="relative z-10 w-full max-w-[420px] space-y-6" style={{ perspective: "1000px" }}>
                {isEmbedMode ? (
                    <div className="flex flex-col gap-6 w-full px-4">
                        {/* In embed mode, we prioritize showing the requested widget */}
                        {(() => {
                            const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
                            const requestedWidget = urlParams?.get('widget');

                            if (requestedWidget === 'booking') {
                                return (
                                    <div className={cn("p-8 border shadow-xl relative overflow-hidden", theme.card, theme.border, toneStyle.rounded)}>
                                        <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ background: theme.accent }} />
                                        <h2 className={cn("text-lg font-black mb-6 uppercase tracking-tight text-center", theme.text)}>
                                            {t.widgetBooking || "Randevu Al"}
                                        </h2>
                                        <AppointmentModal
                                            isOpen={true}
                                            onClose={() => { }}
                                            profile={profile}
                                            lang={lang}
                                            t={t}
                                            theme={theme}
                                            toneStyle={toneStyle}
                                            isEmbed={true}
                                        />
                                    </div>
                                )
                            }

                            if (requestedWidget === 'lead') {
                                return (
                                    <div className={cn("p-8 border shadow-xl relative overflow-hidden", theme.card, theme.border, toneStyle.rounded)}>
                                        <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ background: theme.accent }} />
                                        <LeadModal
                                            isOpen={true}
                                            onClose={() => { }}
                                            onSubmit={async (leadData: any) => {
                                                try {
                                                    const res = await fetch("/api/leads/create", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ ...leadData, profileId: profile.id })
                                                    })
                                                    if (res.ok) {
                                                        setLeadStatus(t.leadSuccessMsg)
                                                        setTimeout(() => setLeadStatus(null), 5000)
                                                    }
                                                } catch (err) {
                                                    console.error(err)
                                                }
                                            }}
                                            theme={theme}
                                            t={t}
                                            lang={lang}
                                            toneStyle={toneStyle}
                                            isEmbed={true}
                                        />
                                    </div>
                                )
                            }

                            if (requestedWidget === 'chat' || requestedWidget === 'ai') {
                                return (
                                    <AIChatAssistant
                                        isOpen={true}
                                        onClose={() => { }}
                                        profile={profile}
                                        t={t}
                                        theme={theme}
                                        toneStyle={toneStyle}
                                        messages={chatMessages}
                                        setMessages={setChatMessages}
                                        aiConfig={aiConfig}
                                        isEmbed={true}
                                    />
                                )
                            }

                            if (requestedWidget === 'video') {
                                const vUrl = urlParams?.get('vUrl') || "";
                                const btnText = urlParams?.get('btn') || t.izleLabel;
                                return <VideoWidget url={vUrl} btnText={btnText} theme={theme} toneStyle={toneStyle} />;
                            }

                            if (requestedWidget === 'skills') {
                                const sList = urlParams?.get('sList') || "";
                                return <SkillsWidget skills={sList} theme={theme} toneStyle={toneStyle} t={t} />;
                            }

                            if (requestedWidget === 'countdown') {
                                const date = urlParams?.get('date') || "";
                                const title = urlParams?.get('title') || "";
                                return <CountdownWidget targetDate={date} title={title} theme={theme} toneStyle={toneStyle} t={t} />;
                            }

                            if (requestedWidget === 'portfolio') {
                                const images = urlParams?.get('pImages') || "";
                                const githubUrl = urlParams?.get('ghUrl') || "";
                                const dribbbleUrl = urlParams?.get('drUrl') || "";
                                const behanceUrl = urlParams?.get('bhUrl') || "";
                                return <PortfolioWidget images={images} githubUrl={githubUrl} dribbbleUrl={dribbbleUrl} behanceUrl={behanceUrl} theme={theme} toneStyle={toneStyle} t={t} />;
                            }

                            if (requestedWidget === 'blog') {
                                const rssUrl = urlParams?.get('rssUrl') || "";
                                return <BlogWidget rssUrl={rssUrl} theme={theme} toneStyle={toneStyle} t={t} lang={lang} />;
                            }

                            if (requestedWidget === 'tech') {
                                const tech = urlParams?.get('tList') || "";
                                return <TechStackWidget technologies={tech} theme={theme} toneStyle={toneStyle} t={t} />;
                            }

                            return (
                                <div className={cn("text-center p-8 border", theme.card, theme.border, toneStyle.rounded)}>
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2" style={{ borderColor: theme.accent }}>
                                        <img src={profile.user.image} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <h2 className={cn("text-xl font-black mb-1", theme.text)}>{profile.user.name}</h2>
                                    <p className={cn("text-xs opacity-60 mb-8 uppercase tracking-widest font-bold", theme.text)}>{translateText(profile.occupation)}</p>
                                    <button
                                        onClick={() => setIsAppointmentOpen(true)}
                                        className={cn("w-full py-4 px-8 font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 active:scale-95", toneStyle.rounded)}
                                        style={{ background: theme.accent }}
                                    >
                                        {t.bookAppointment}
                                    </button>
                                </div>
                            )
                        })()}
                    </div>
                ) : (
                    <motion.div
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            rotateX,
                            rotateY,
                            ...(profile.profileBgImage ? {
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${profile.profileBgImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            } : {})
                        }}
                        className={cn("border p-8 space-y-8 backdrop-blur-3xl shadow-2xl relative transition-all duration-300 ease-out", profile.profileBgImage ? "bg-transparent" : theme.card, theme.border, toneStyle.rounded, toneStyle.border)}
                    >
                        {/* Floating Buttons: QA (Top Left) & Share (Top Right) */}
                        <div className="absolute top-6 left-6 z-30">
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsQrOpen(true)}
                                className={cn("w-10 h-10 border flex items-center justify-center backdrop-blur-xl transition-all relative group", theme.btn, theme.border, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity animate-pulse" />
                                <QrCode size={18} style={{ color: theme.accent }} />
                            </motion.button>
                        </div>

                        <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
                            <button
                                onClick={() => {
                                    const newLang = lang === 'tr' ? 'en' : 'tr';
                                    setLang(newLang);
                                    localStorage.setItem('lang', newLang);
                                }}
                                className={cn("w-10 h-10 border flex items-center justify-center backdrop-blur-xl transition-all hover:scale-110 active:scale-95 text-[10px] font-black uppercase", theme.btn, theme.border, theme.text, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                            >
                                {lang === 'tr' ? 'EN' : 'TR'}
                            </button>
                            <button
                                onClick={() => setIsWalletModalOpen(true)}
                                className={cn("w-10 h-10 border flex items-center justify-center backdrop-blur-xl transition-all hover:scale-110 active:scale-95", theme.btn, theme.border, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                            >
                                <UserPlus size={18} style={{ color: theme.accent }} />
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
                                                            {translateText(service.title)}
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
                                    {/* 3D Glowing Ring Effects */}
                                    {theme.special === '3d_frost' && (
                                        <>
                                            <div className="absolute -inset-2 rounded-full animate-spin" style={{ background: 'conic-gradient(from 0deg, #38bdf8, #93c5fd, #dbeafe, #38bdf8)', animationDuration: '4s', opacity: 0.6, filter: 'blur(4px)' }} />
                                            <div className="absolute -inset-1 rounded-full bg-[#0a1628]" />
                                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                                {profile.showVideoAsProfile && profile.youtubeVideoUrl ? (
                                                    <iframe className="w-full h-full object-cover scale-[1.8] pointer-events-none" src={getYoutubeEmbedUrl(profile.youtubeVideoUrl)} allow="autoplay; encrypted-media" frameBorder="0" />
                                                ) : (
                                                    <img src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {theme.special === '3d_magma' && (
                                        <>
                                            <div className="absolute -inset-2 rounded-full animate-spin" style={{ background: 'conic-gradient(from 0deg, #d946ef, #f97316, #ec4899, #8b5cf6, #d946ef)', animationDuration: '3s', opacity: 0.7, filter: 'blur(5px)' }} />
                                            <div className="absolute -inset-1 rounded-full bg-[#1a0a1e]" />
                                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                                {profile.showVideoAsProfile && profile.youtubeVideoUrl ? (
                                                    <iframe className="w-full h-full object-cover scale-[1.8] pointer-events-none" src={getYoutubeEmbedUrl(profile.youtubeVideoUrl)} allow="autoplay; encrypted-media" frameBorder="0" />
                                                ) : (
                                                    <img src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {theme.special === '3d_cyber' && (
                                        <>
                                            <div className="absolute -inset-2 rounded-full animate-spin" style={{ background: 'conic-gradient(from 0deg, #06b6d4, #8b5cf6, #22d3ee, #06b6d4)', animationDuration: '5s', opacity: 0.6, filter: 'blur(4px)' }} />
                                            <div className="absolute -inset-1 rounded-full bg-[#020a14]" />
                                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                                {profile.showVideoAsProfile && profile.youtubeVideoUrl ? (
                                                    <iframe className="w-full h-full object-cover scale-[1.8] pointer-events-none" src={getYoutubeEmbedUrl(profile.youtubeVideoUrl)} allow="autoplay; encrypted-media" frameBorder="0" />
                                                ) : (
                                                    <img src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {theme.special === '3d_aurora' && (
                                        <>
                                            <div className="absolute -inset-2 rounded-full animate-spin" style={{ background: 'conic-gradient(from 0deg, #34d399, #8b5cf6, #3b82f6, #34d399)', animationDuration: '6s', opacity: 0.6, filter: 'blur(5px)' }} />
                                            <div className="absolute -inset-1 rounded-full bg-[#020818]" />
                                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                                {profile.showVideoAsProfile && profile.youtubeVideoUrl ? (
                                                    <iframe className="w-full h-full object-cover scale-[1.8] pointer-events-none" src={getYoutubeEmbedUrl(profile.youtubeVideoUrl)} allow="autoplay; encrypted-media" frameBorder="0" />
                                                ) : (
                                                    <img src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {theme.special === '3d_neoncity' && (
                                        <>
                                            <div className="absolute -inset-2 rounded-full animate-spin" style={{ background: 'conic-gradient(from 0deg, #ff2d95, #00c8ff, #ff2d95)', animationDuration: '4s', opacity: 0.7, filter: 'blur(4px)' }} />
                                            <div className="absolute -inset-1 rounded-full bg-[#0a0012]" />
                                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                                {profile.showVideoAsProfile && profile.youtubeVideoUrl ? (
                                                    <iframe className="w-full h-full object-cover scale-[1.8] pointer-events-none" src={getYoutubeEmbedUrl(profile.youtubeVideoUrl)} allow="autoplay; encrypted-media" frameBorder="0" />
                                                ) : (
                                                    <img src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {theme.special === '3d_galaxy' && (
                                        <>
                                            <div className="absolute -inset-2 rounded-full animate-spin" style={{ background: 'conic-gradient(from 0deg, #a855f7, #6366f1, #d946ef, #a855f7)', animationDuration: '8s', opacity: 0.6, filter: 'blur(6px)' }} />
                                            <div className="absolute -inset-1 rounded-full bg-[#030108]" />
                                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                                {profile.showVideoAsProfile && profile.youtubeVideoUrl ? (
                                                    <iframe className="w-full h-full object-cover scale-[1.8] pointer-events-none" src={getYoutubeEmbedUrl(profile.youtubeVideoUrl)} allow="autoplay; encrypted-media" frameBorder="0" />
                                                ) : (
                                                    <img src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {theme.special === '3d_luxegold' && (
                                        <>
                                            <div className="absolute -inset-2 rounded-full animate-spin" style={{ background: 'conic-gradient(from 0deg, #fbbf24, #d4a017, #fef3c7, #fbbf24)', animationDuration: '5s', opacity: 0.7, filter: 'blur(4px)' }} />
                                            <div className="absolute -inset-1 rounded-full bg-[#080604]" />
                                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                                {profile.showVideoAsProfile && profile.youtubeVideoUrl ? (
                                                    <iframe className="w-full h-full object-cover scale-[1.8] pointer-events-none" src={getYoutubeEmbedUrl(profile.youtubeVideoUrl)} allow="autoplay; encrypted-media" frameBorder="0" />
                                                ) : (
                                                    <img src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {theme.special === '3d_hologram' && (
                                        <>
                                            <div className="absolute -inset-2 rounded-full animate-spin" style={{ background: 'conic-gradient(from 0deg, #38bdf8, #ec4899, #a855f7, #34d399, #38bdf8)', animationDuration: '7s', opacity: 0.5, filter: 'blur(5px)' }} />
                                            <div className="absolute -inset-1 rounded-full bg-[#050510]" />
                                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                                {profile.showVideoAsProfile && profile.youtubeVideoUrl ? (
                                                    <iframe className="w-full h-full object-cover scale-[1.8] pointer-events-none" src={getYoutubeEmbedUrl(profile.youtubeVideoUrl)} allow="autoplay; encrypted-media" frameBorder="0" />
                                                ) : (
                                                    <img src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {theme.special === '3d_quantum' && (
                                        <>
                                            <div className="absolute -inset-[12px] rounded-full animate-spin-slow" style={{ background: 'conic-gradient(from 0deg, #6366f1, #a855f7, #6366f1)', opacity: 0.8, filter: 'blur(8px)' }} />
                                            <div className="absolute -inset-[6px] rounded-full animate-pulse" style={{ background: 'linear-gradient(45deg, #6366f1, #a855f7)', opacity: 0.4, filter: 'blur(4px)' }} />
                                            <div className="absolute -inset-1 rounded-full bg-[#020205]" />
                                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                                {profile.showVideoAsProfile && profile.youtubeVideoUrl ? (
                                                    <iframe className="w-full h-full object-cover scale-[1.8] pointer-events-none" src={getYoutubeEmbedUrl(profile.youtubeVideoUrl)} allow="autoplay; encrypted-media" frameBorder="0" />
                                                ) : (
                                                    <img src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        </>
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
                                        {translateText(profile.occupation) || "PROFESSIONAL"}
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
                                        <div className={cn("w-[348px] mx-auto border backdrop-blur-md py-4 px-6 mt-4 relative z-20 rounded-[2rem] overflow-visible", theme.card, theme.border)}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                                    <h3 className={cn("text-[9px] font-black uppercase tracking-[0.3em] text-white")}>
                                                        {layoutMode === 'grid' ? t.portfolioView : t.myProjects}
                                                    </h3>
                                                </div>
                                                <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                                                    <button
                                                        onClick={() => setLayoutMode('marquee')}
                                                        className={cn("p-1.5 rounded-lg transition-all", layoutMode === 'marquee' ? "bg-white/20 text-white shadow-lg" : "text-white/40 hover:text-white/60")}
                                                        title={t.standardView}
                                                    >
                                                        <Layers size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setLayoutMode('grid')}
                                                        className={cn("p-1.5 rounded-lg transition-all", layoutMode === 'grid' ? "bg-white/20 text-white shadow-lg" : "text-white/40 hover:text-white/60")}
                                                        title={t.portfolioView}
                                                    >
                                                        <Layout size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {layoutMode === 'marquee' ? (
                                                <div
                                                    className="relative h-16 flex items-center overflow-visible"
                                                    style={{ clipPath: 'inset(-300px 0 -300px 0)' }} // Sadece dikeyde taşmaya izin verir, yanları keser
                                                >
                                                    <div className="animate-marquee-right flex gap-6 h-full items-center overflow-visible">
                                                        {[...profile.products.filter((p: any) => p.image), ...profile.products.filter((p: any) => p.image), ...profile.products.filter((p: any) => p.image)].map((project: any, i: number) => (
                                                            <a
                                                                key={i}
                                                                href={formatUrl(project.link) || "#"}
                                                                target="_blank"
                                                                onClick={() => trackEvent("product", project.name)}
                                                                className={cn("w-14 h-14 border border-white/20 overflow-visible shadow-lg flex-shrink-0 bg-white/10 backdrop-blur-sm p-1 group/prj transition-all hover:scale-110 cursor-pointer block relative rounded-2xl")}
                                                            >
                                                                <img src={project.image} alt={project.name} className="w-full h-full object-cover rounded-xl" />

                                                                <div
                                                                    className={cn("absolute bottom-[calc(100%+15px)] left-1/2 -translate-x-1/2 opacity-0 group-hover/prj:opacity-100 transition-all duration-300 w-56 border p-4 rounded-2xl text-left pointer-events-none shadow-2xl scale-50 group-hover/prj:scale-100 z-[110] backdrop-blur-3xl bg-black/80")}
                                                                    style={{
                                                                        borderColor: `${theme.accent}60`,
                                                                        boxShadow: `0 20px 50px -10px ${theme.accent}40`
                                                                    }}
                                                                >
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

                                                    <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none opacity-40 bg-gradient-to-r from-black/20 to-transparent" />
                                                    <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none opacity-40 bg-gradient-to-l from-black/20 to-transparent" />
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-3 gap-2 pb-2">
                                                    {profile.products.filter((p: any) => p.image).map((project: any, i: number) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                            transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
                                                            className="aspect-square relative group cursor-pointer overflow-hidden rounded-xl border border-white/10 shadow-lg"
                                                            onClick={() => {
                                                                trackEvent("product_grid", project.name);
                                                                if (project.link) window.open(formatUrl(project.link), "_blank");
                                                            }}
                                                        >
                                                            <img
                                                                src={project.image}
                                                                alt={project.name}
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-3"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-2 text-center pb-3">
                                                                <p className="text-[7px] font-black text-white uppercase tracking-tighter leading-tight line-clamp-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                                    {project.name}
                                                                </p>
                                                                <div className="w-4 h-[1px] bg-white/40 mt-1 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                                                            </div>

                                                            {/* Premium Glass Shine Effect */}
                                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000" />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}


                                {profile.slogan && <p className={cn("text-sm font-bold mt-4 opacity-70 italic", theme.text)}>“{translateText(profile.slogan)}”</p>}
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
                                                            src={reviews[currentReviewIndex].image?.includes('avatar.iran.liara.run') ? `https://ui-avatars.com/api/?name=${encodeURIComponent(reviews[currentReviewIndex].name)}&background=1a1a2e&color=e94560&bold=true&size=128` : (reviews[currentReviewIndex].image || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviews[currentReviewIndex].name)}&background=1a1a2e&color=e94560&bold=true&size=128`)}
                                                            className="w-full h-full object-cover"
                                                            onError={(e: any) => {
                                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reviews[currentReviewIndex].name)}&background=1a1a2e&color=e94560&bold=true&size=128`;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className={cn("text-xs font-black", theme.text)}>{reviews[currentReviewIndex].name}</h4>
                                                                <p className={cn("text-[10px] opacity-40", theme.text)}>{translateText(reviews[currentReviewIndex].title)}</p>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={10} className={i < reviews[currentReviewIndex].rating ? "fill-current text-amber-400" : "text-white/10"} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className={cn("text-[11px] leading-relaxed mt-2 line-clamp-2 italic opacity-80", theme.text)}>
                                                            "{translateText(reviews[currentReviewIndex].content)}"
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


                            <div className="flex justify-center flex-wrap gap-6 pt-2">
                                {socialLinks.filter((l: any) => l.platform !== 'customLinks' && !['phone', 'location'].includes(l.platform.toLowerCase())).slice(0, 10).map((l: any, i: number) => {
                                    const platform = l.platform.toLowerCase()
                                    return (
                                        <a key={i} href={formatUrl(l.url)} target="_blank" className={cn("transition-all hover:scale-125 opacity-60 hover:opacity-100")} style={{ color: theme.accent }}>
                                            {platform === 'instagram' && <Instagram size={24} />}
                                            {platform === 'linkedin' && <Linkedin size={24} />}
                                            {platform === 'twitter' && <Twitter size={24} />}
                                            {platform === 'github' && <Github size={24} />}
                                            {platform === 'youtube' && <Youtube size={24} />}
                                            {platform === 'whatsapp' && <MessageCircle size={24} />}
                                            {platform === 'mail' && <Mail size={24} />}
                                            {platform === 'medium' && <FileText size={24} />}
                                            {(!['instagram', 'linkedin', 'twitter', 'github', 'youtube', 'whatsapp', 'mail', 'medium'].includes(platform)) && <Globe size={24} />}
                                        </a>
                                    )
                                })}
                            </div>

                            {
                                profile.paymentLink && (
                                    <div className="pt-8 w-full">
                                        <motion.a
                                            href={formatUrl(profile.paymentLink)}
                                            target="_blank"
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn("w-full py-5 flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.3em] transition-all text-white relative overflow-hidden group border border-white/10", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-[2rem]")}
                                            style={{
                                                background: `linear-gradient(135deg, #f59e0b, #f97316, #ea580c)`,
                                                boxShadow: `0 20px 40px -15px rgba(234, 88, 12, 0.4), inset 0 0 20px rgba(255,255,255,0.1)`
                                            }}
                                            onClick={() => trackEvent("payment_click")}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20">
                                                <Zap className="w-5 h-5 fill-white" />
                                            </div>
                                            <span className="drop-shadow-md">
                                                {profile.paymentType === 'consulting' ? t.consultingBtn :
                                                    profile.paymentType === 'support' ? t.supportBtn :
                                                        profile.paymentType === 'pay' ? t.payBtn :
                                                            t.coffeeBtn}
                                            </span>
                                        </motion.a>
                                    </div>
                                )
                            }

                            <div className="pt-10 border-t border-white/5 text-center flex flex-col gap-6" >
                                <div className="flex items-stretch gap-3">
                                    <button
                                        onClick={handleShare}
                                        className={cn("flex-1 py-4 border flex items-center justify-center gap-2.5 font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-white/5 active:scale-[0.97] backdrop-blur-xl", theme.border, theme.text, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                                        style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                                    >
                                        <Share2 size={16} className="opacity-60" /> {t.shareLabel}
                                    </button>

                                    <button
                                        onClick={handleCVView}
                                        className={cn("flex-[1.5] py-4 flex items-center justify-center gap-2.5 font-black text-[10px] uppercase tracking-[0.15em] transition-all hover:brightness-110 active:scale-[0.97] text-white shadow-xl", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                                        style={{
                                            background: `linear-gradient(135deg, ${(theme as any).cvAccent || theme.accent}, ${(theme as any).cvAccent || theme.accent}cc)`,
                                            boxShadow: `0 12px 24px -10px ${(theme as any).cvAccent || theme.accent}70`
                                        }}
                                    >
                                        <FileText size={16} /> {profile.isCatalog ? t.viewCatalog : t.viewCV}
                                    </button>

                                    {/* Sabit AI Assistant Butonu */}
                                    {aiConfig?.isEnabled && (
                                        <button
                                            onClick={() => setIsAIChatOpen(true)}
                                            className={cn("w-[62px] h-[54px] flex-shrink-0 flex items-center justify-center text-white shadow-xl transition-all hover:brightness-110 active:scale-[0.97]", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                                            style={{
                                                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)`,
                                                boxShadow: `0 12px 24px -10px ${theme.accent}70`
                                            }}
                                            title={aiConfig.assistantName}
                                        >
                                            <Bot size={24} />
                                        </button>
                                    )}
                                </div>

                                {/* Widget Dock - Daha Estetik ve Derli Toplu */}
                                {!isEmbedMode && profile.blocks?.filter((b: any) => b.type === 'external_widget' && b.content?.position === 'inline' && b.content?.code?.includes('data-style="floating"')).length > 0 && (
                                    <div className={cn("p-2 bg-white/[0.03] border border-white/5 backdrop-blur-2xl flex flex-wrap justify-center gap-2.5", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-3xl")}>
                                        {profile.blocks?.filter((b: any) => b.type === 'external_widget' && b.content?.position === 'inline' && b.content?.code?.includes('data-style="floating"')).map((block: any) => (
                                            <ExternalWidget key={block.id} block={block} theme={theme} toneStyle={toneStyle} t={t} className="w-[54px] h-[54px] flex-shrink-0" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* External Widgets (Embedded/Inline Block) - Only show non-floating ones */}
                {!isEmbedMode && profile.blocks?.filter((b: any) => b.type === 'external_widget' && b.content?.position === 'inline' && !b.content?.code?.includes('data-style="floating"')).map((block: any) => (
                    <ExternalWidget key={block.id} block={block} theme={theme} toneStyle={toneStyle} t={t} />
                ))}
            </main>

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
                            setReviewStatus(t.reviewSuccessMsg)
                            setTimeout(() => setReviewStatus(null), 5000)
                        }
                    } catch (err) {
                        console.error(err)
                    }
                }}
                theme={theme}
                t={t}
                toneStyle={toneStyle}
            />

            <LeadModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                onSubmit={async (leadData: any) => {
                    try {
                        const res = await fetch("/api/leads/create", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ...leadData, profileId: profile.id })
                        })
                        if (res.ok) {
                            setLeadStatus(t.leadSuccessMsg)
                            setTimeout(() => setLeadStatus(null), 5000)
                            // Form sonrası vCard indirmeyi teklif et/başlat
                            handleAddToContacts()
                        }
                    } catch (err) {
                        console.error(err)
                    }
                }}
                theme={theme}
                t={t}
                lang={lang}
                toneStyle={toneStyle}
            />

            <SocialProof t={t} theme={theme} />

            <AnimatePresence>
                {reviewStatus && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={cn("fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] backdrop-blur-3xl px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 border transition-all", theme.card, theme.border)}
                    >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
                            <CheckCircle2 size={14} />
                        </div>
                        <span className={theme.text}>{reviewStatus}</span>
                    </motion.div>
                )}
                {leadStatus && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={cn("fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] backdrop-blur-3xl px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 border transition-all", theme.card, theme.border)}
                    >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
                            <CheckCircle2 size={14} />
                        </div>
                        <span className={theme.text}>{leadStatus}</span>
                    </motion.div>
                )}
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={cn("fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] backdrop-blur-3xl px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 border transition-all", theme.card, theme.border)}
                    >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
                            <CheckCircle2 size={14} />
                        </div>
                        <span className={theme.text}>{t.copiedLabel}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <SocialProof t={t} theme={theme} />

            <AIChatAssistant
                isOpen={isAIChatOpen}
                onClose={() => setIsAIChatOpen(false)}
                profile={profile}
                t={t}
                theme={theme}
                toneStyle={toneStyle}
                messages={chatMessages}
                setMessages={setChatMessages}
                aiConfig={aiConfig}
            />
        </div>
    )
}

function ReviewModal({ isOpen, onClose, onSubmit, theme, t, toneStyle }: any) {
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
        const image = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1a1a2e&color=${theme.accent.replace('#', '')}&bold=true&size=128`

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
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={onClose}
            />
            <motion.div
                initial={{ scale: 0.98, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.98, opacity: 0, y: 10 }}
                className={cn(
                    "relative w-full max-w-[340px] p-5 backdrop-blur-3xl overflow-y-auto max-h-[90vh] no-scrollbar rounded-[2rem] border shadow-2xl transition-all",
                    theme.card,
                    theme.border,
                    toneStyle?.font
                )}
                style={{
                    boxShadow: `0 20px 50px -12px rgba(0,0,0,0.5), 0 0 30px ${theme.accent}15`
                }}
            >
                {/* Micro Glow */}
                <div className="absolute -top-16 -right-16 w-32 h-32 blur-[60px] opacity-15 rounded-full" style={{ backgroundColor: theme.accent }} />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-5">
                        <div className="space-y-0.5">
                            <h3 className={cn("text-lg font-black uppercase tracking-tight", theme.text)}>{t.leaveComment}</h3>
                            <p className={cn("text-[8px] font-bold uppercase tracking-[0.2em] opacity-40", theme.text)}>{t.leaveCommentSub}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className={cn("w-7 h-7 flex items-center justify-center rounded-full transition-all active:scale-90 opacity-30 hover:opacity-100", theme.text)}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Rating */}
                        <div className="space-y-4">
                            <div className={cn("flex flex-col items-center gap-2 py-3 rounded-2xl border bg-white/5", theme.border)} style={{ borderColor: `${theme.accent}15` }}>
                                <span className={cn("text-[8px] font-black uppercase tracking-[0.2em] opacity-40", theme.text)}>{t.rateLabel}</span>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className="transition-all hover:scale-110"
                                        >
                                            <Star
                                                size={20}
                                                className={cn(
                                                    "transition-colors duration-300",
                                                    star <= formData.rating ? "fill-current" : "text-white/5"
                                                )}
                                                style={star <= formData.rating ? { color: theme.accent } : {}}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                                    className={cn(
                                        "flex-1 flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-300",
                                        theme.border
                                    )}
                                    style={formData.gender === 'male' ? {
                                        backgroundColor: `${theme.accent}15`,
                                        borderColor: `${theme.accent}40`
                                    } : {
                                        backgroundColor: 'rgba(255,255,255,0.02)',
                                        borderColor: 'rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={formData.gender === 'male' ? { backgroundColor: theme.accent, color: '#000' } : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' }}>
                                        <User size={14} />
                                    </div>
                                    <span className={cn("text-[9px] font-black uppercase tracking-wider", formData.gender === 'male' ? "opacity-100" : "opacity-30", theme.text)}>{t.male}</span>
                                </button>

                                <button
                                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                                    className={cn(
                                        "flex-1 flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-300",
                                        theme.border
                                    )}
                                    style={formData.gender === 'female' ? {
                                        backgroundColor: `${theme.accent}15`,
                                        borderColor: `${theme.accent}40`
                                    } : {
                                        backgroundColor: 'rgba(255,255,255,0.02)',
                                        borderColor: 'rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={formData.gender === 'female' ? { backgroundColor: theme.accent, color: '#000' } : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' }}>
                                        <UserCircle size={14} />
                                    </div>
                                    <span className={cn("text-[9px] font-black uppercase tracking-wider", formData.gender === 'female' ? "opacity-100" : "opacity-30", theme.text)}>{t.female}</span>
                                </button>
                            </div>
                        </div>

                        {/* Form Inputs */}
                        <div className="space-y-2.5">
                            <input
                                type="text"
                                placeholder={t.yourName}
                                className={cn("w-full px-4 py-3 rounded-xl focus:outline-none transition-all text-xs font-bold border", theme.border, theme.text)}
                                style={{ backgroundColor: `${theme.accent}05`, borderColor: `${theme.accent}15` }}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder={t.yourTitle}
                                className={cn("w-full px-4 py-3 rounded-xl focus:outline-none transition-all text-xs font-bold border", theme.border, theme.text)}
                                style={{ backgroundColor: `${theme.accent}05`, borderColor: `${theme.accent}15` }}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                            <textarea
                                rows={3}
                                placeholder={t.yourMessage}
                                className={cn("w-full px-4 py-3 rounded-xl focus:outline-none transition-all text-xs font-bold resize-none border", theme.border, theme.text)}
                                style={{ backgroundColor: `${theme.accent}05`, borderColor: `${theme.accent}15` }}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!formData.name || !formData.content}
                            className={cn("w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all disabled:opacity-30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2", toneStyle?.font)}
                            style={{
                                backgroundColor: theme.accent,
                                color: '#000',
                                boxShadow: `0 10px 25px -5px ${theme.accent}40`
                            }}
                        >
                            <MessageSquare size={14} />
                            {t.publishReview}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

function QrModal({ isOpen, onClose, theme, profile, t }: any) {
    const cardExportRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [actionDone, setActionDone] = useState<string | null>(null);
    const [scale, setScale] = useState(0.8);

    // Dynamic scaling based on window height
    useEffect(() => {
        if (!isOpen) return;
        const handleResize = () => {
            const h = window.innerHeight;
            if (h < 650) setScale(0.55);
            else if (h < 750) setScale(0.65);
            else if (h < 850) setScale(0.75);
            else if (h < 950) setScale(0.85);
            else setScale(0.95);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleDownloadCard = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        try {
            const cardEl = cardExportRef.current?.querySelector('[data-card-actual]') as HTMLElement;
            if (!cardEl) return;
            await new Promise(r => setTimeout(r, 600));
            const htmlToImage = await import('html-to-image');
            const dataUrl = await htmlToImage.toJpeg(cardEl, {
                quality: 0.98,
                pixelRatio: 3,
                backgroundColor: '#000000',
                cacheBust: true,
            });
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `kardly-${profile.username || 'card'}.jpg`;
            link.click();
            setActionDone('download');
            setTimeout(() => setActionDone(null), 2500);
        } catch (err) {
            console.error('Card download error:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShareCard = async () => {
        if (isSharing) return;
        setIsSharing(true);
        try {
            const profileUrl = `${window.location.origin}/${profile.username}`;
            if (navigator.share) {
                await navigator.share({
                    title: profile.displayName || profile.user?.name || 'Kardly',
                    text: `${profile.displayName || profile.user?.name}'in dijital kartviziti`,
                    url: profileUrl
                });
            } else {
                await navigator.clipboard.writeText(profileUrl);
                setActionDone('share');
                setTimeout(() => setActionDone(null), 2500);
            }
        } catch (err) {
            console.log('Share error:', err);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex flex-col bg-[#05050a] backdrop-blur-3xl overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] opacity-[0.15] rounded-full" style={{ backgroundColor: theme.accent }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] opacity-[0.1] rounded-full" style={{ backgroundColor: theme.accent }} />
            </div>

            {/* Top Bar with Close Button */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-[1001] flex items-center justify-between p-7 pt-10 shrink-0"
            >
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.6)]" style={{ backgroundColor: theme.accent }} />
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/50">Dijital Kartvizit</span>
                </div>
                <button
                    onClick={onClose}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all active:scale-90 backdrop-blur-2xl shadow-2xl group"
                >
                    <X size={24} className="transition-transform group-hover:rotate-90" />
                </button>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-4 min-h-0">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative flex flex-col items-center"
                >
                    {/* Card Wrapper with Scale */}
                    <div
                        ref={cardExportRef}
                        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
                        className="transition-transform duration-500 ease-out"
                    >
                        <BusinessCardGenerator
                            mode="modal"
                            profileData={profile}
                            theme={theme}
                            user={{
                                name: profile.displayName || profile.user?.name || 'Kullanıcı',
                                occupation: profile.occupation || '',
                                phone: profile.phone || '',
                                email: profile.email || profile.user?.email || '',
                                username: profile.username
                            }}
                        />
                    </div>

                    {/* Quick Action Overlay Success */}
                    <AnimatePresence>
                        {actionDone && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl z-50 flex items-center gap-2"
                            >
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                {actionDone === 'download' ? 'Görsel Kaydedildi' : 'Bağlantı Kopyalandı'}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Bottom Floating Island Action Bar */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-[1001] p-8 pb-12 shrink-0 flex items-center justify-center"
            >
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl rounded-[2.5rem] p-3 flex items-center gap-3 shadow-2xl">
                    <button
                        onClick={handleDownloadCard}
                        disabled={isDownloading}
                        className="flex items-center gap-3 pl-6 pr-5 py-3.5 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 group"
                    >
                        {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />}
                        İndir
                    </button>
                    <button
                        onClick={handleShareCard}
                        className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.1] text-white hover:bg-white/[0.1] transition-all hover:scale-110 active:scale-90"
                    >
                        <Share2 size={20} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function SocialProof({ t, theme }: { t: any, theme: any }) {
    const [isVisible, setIsVisible] = useState(false)
    const [currentProof, setCurrentProof] = useState<any>(null)

    const proofs = [
        { type: 'visit', icon: <Eye size={12} />, text: (count: number) => typeof t.proofVisit === 'function' ? t.proofVisit(count) : `${count} views` },
        { type: 'vcard', icon: <UserPlus size={12} />, text: () => t.proofVcard || "Saved to contacts! 🚀" },
        { type: 'share', icon: <Share2 size={12} />, text: () => t.proofShare || "Profile just shared." },
        { type: 'location', icon: <MapPin size={12} />, text: (city: string) => typeof t.proofLocation === 'function' ? t.proofLocation(city) : `Visit from ${city}` }
    ]

    const cities = ["İstanbul", "Ankara", "İzmir", "Berlin", "London", "New York", "Dubai", "Bursa", "Antalya"]

    useEffect(() => {
        const showTimeout = setTimeout(() => {
            const randomProof = proofs[Math.floor(Math.random() * proofs.length)]
            let text = ""
            if (randomProof.type === 'visit') text = (randomProof.text as any)(Math.floor(Math.random() * 150) + 50)
            else if (randomProof.type === 'location') text = (randomProof.text as any)(cities[Math.floor(Math.random() * cities.length)])
            else text = (randomProof.text as any)()

            setCurrentProof({ ...randomProof, displayedText: text })
            setIsVisible(true)

            setTimeout(() => {
                setIsVisible(false)
            }, 5000)
        }, 8000)

        return () => clearTimeout(showTimeout)
    }, [])

    return (
        <AnimatePresence>
            {isVisible && currentProof && (
                <motion.div
                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -30, scale: 0.95 }}
                    className={cn(
                        "fixed bottom-6 left-6 z-[180] backdrop-blur-3xl border px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-[240px] transition-all",
                        theme.card,
                        theme.border
                    )}
                >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent, borderColor: `${theme.accent}20` }}>
                        {currentProof.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <p className={cn("text-[9px] font-bold leading-tight truncate", theme.text)}>
                            {currentProof.displayedText}
                        </p>
                        <p className={cn("text-[7px] uppercase tracking-widest mt-0.5 font-black opacity-30", theme.text)}>
                            {t.justNow}
                        </p>
                    </div>
                    <button onClick={() => setIsVisible(false)} className={cn("ml-1 transition-colors opacity-20 hover:opacity-100", theme.text)}>
                        <X size={10} />
                    </button>
                    <div className="absolute -bottom-[1.5px] left-3 right-3 h-[2px] rounded-full overflow-hidden opacity-30">
                        <div className="h-full animate-proof-progress bg-current" style={{ color: theme.accent }} />
                    </div>
                </motion.div>
            )}
            <style>{`
                @keyframes proof-progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .animate-proof-progress {
                    animation: proof-progress 6s linear forwards;
                }
            `}</style>
        </AnimatePresence>
    )
}

function ParticleBackground({ type, color }: { type: 'matrix' | 'starfield' | 'bubbles' | 'finance', color: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        const w = window.innerWidth
        const h = window.innerHeight
        canvas.width = w
        canvas.height = h

        let particles: any[] = []

        if (type === 'matrix') {
            const columns = Math.floor(w / 15)
            const drops: number[] = new Array(columns).fill(1)
            const chars = "ｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890"

            const draw = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
                ctx.fillRect(0, 0, w, h)
                ctx.fillStyle = color
                ctx.font = '12px monospace'

                for (let i = 0; i < drops.length; i++) {
                    const text = chars[Math.floor(Math.random() * chars.length)]
                    ctx.fillText(text, i * 15, drops[i] * 15)
                    if (drops[i] * 15 > h && Math.random() > 0.98) drops[i] = 0
                    drops[i]++
                }
                animationFrameId = requestAnimationFrame(draw)
            }
            draw()
        } else if (type === 'finance') {
            // Real-time scrolling charts
            let ticker = 0
            const data: number[] = Array.from({ length: 100 }, () => Math.random() * 200 + 100)

            const draw = () => {
                ctx.clearRect(0, 0, w, h)
                ctx.strokeStyle = color
                ctx.lineWidth = 1
                ctx.beginPath()

                ticker++
                if (ticker % 10 === 0) {
                    data.shift()
                    const last = data[data.length - 1]
                    data.push(Math.max(50, Math.min(h - 50, last + (Math.random() - 0.5) * 40)))
                }

                const spacing = w / (data.length - 1)
                for (let i = 0; i < data.length; i++) {
                    const x = i * spacing
                    const y = data[i]
                    if (i === 0) ctx.moveTo(x, y)
                    else ctx.lineTo(x, y)

                    // Draw "candles" occasionally
                    if (i % 5 === 0) {
                        ctx.fillStyle = i % 10 === 0 ? '#10b98122' : '#ef444422'
                        ctx.fillRect(x - 2, y - 20, 4, 40)
                    }
                }
                ctx.stroke()

                // Add glowing endpoint
                ctx.fillStyle = color
                const lastX = w
                const lastY = data[data.length - 1]
                ctx.beginPath()
                ctx.arc(lastX, lastY, 4, 0, Math.PI * 2)
                ctx.fill()

                animationFrameId = requestAnimationFrame(draw)
            }
            draw()
        } else if (type === 'starfield') {
            particles = Array.from({ length: 200 }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1
            }))

            const draw = () => {
                ctx.clearRect(0, 0, w, h)
                ctx.fillStyle = color
                particles.forEach(p => {
                    ctx.beginPath()
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                    ctx.fill()
                    p.y += p.speed
                    if (p.y > h) p.y = 0
                })
                animationFrameId = requestAnimationFrame(draw)
            }
            draw()
        } else if (type === 'bubbles') {
            particles = Array.from({ length: 50 }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 10 + 5,
                speed: Math.random() * 1 + 0.5,
                opacity: Math.random() * 0.5
            }))

            const draw = () => {
                ctx.clearRect(0, 0, w, h)
                particles.forEach(p => {
                    ctx.fillStyle = `${color}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`
                    ctx.beginPath()
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                    ctx.fill()
                    p.y -= p.speed
                    if (p.y < -20) p.y = h + 20
                })
                animationFrameId = requestAnimationFrame(draw)
            }
            draw()
        }

        return () => cancelAnimationFrame(animationFrameId)
    }, [type, color])

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-20" />
}

function WalletModal({ isOpen, onClose, profile, t, handleAddToContacts, theme, toneStyle }: any) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                className={cn(
                    "relative w-full max-w-[300px] p-5 rounded-[2rem] shadow-2xl overflow-hidden border backdrop-blur-3xl transition-all",
                    theme.card,
                    theme.border
                )}
            >
                {/* Micro Glows */}
                <div
                    className="absolute -top-10 -right-10 w-24 h-24 blur-[40px] opacity-20 rounded-full"
                    style={{ background: theme.accent }}
                />

                <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm relative overflow-hidden group border"
                        style={{
                            color: theme?.accent,
                            backgroundColor: `${theme?.accent}10`,
                            borderColor: `${theme?.accent}20`
                        }}
                    >
                        <Smartphone size={18} className="relative z-10" />
                    </div>

                    <div className="space-y-1">
                        <h3 className={cn("text-lg font-black px-2 leading-tight uppercase tracking-tight", theme.text, toneStyle?.font)}>
                            {t.addToWallet}
                        </h3>
                        <p className={cn("text-[8px] font-bold tracking-[0.2em] uppercase opacity-40", theme.text)}>
                            {t.savePassDesc}
                        </p>
                    </div>

                    <div className="w-full space-y-1.5">
                        {[
                            { icon: <UserPlus size={16} />, label: t.vcfLabel, action: handleAddToContacts },
                            { icon: <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black shadow-sm"><Smartphone size={16} /></div>, label: "Apple Wallet", action: handleAddToContacts, badge: t.current },
                            { icon: <Globe size={16} />, label: "Google Wallet", action: handleAddToContacts }
                        ].map((btn, idx) => (
                            <button
                                key={idx}
                                onClick={() => { btn.action(); onClose(); }}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 border rounded-xl transition-all group active:scale-[0.98] relative overflow-hidden",
                                    theme.btn,
                                    theme.border
                                )}
                            >
                                <div className="flex items-center gap-2.5 z-10">
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-white/5", !btn.badge && "text-opacity-100")} style={!btn.badge ? { color: theme?.accent } : {}}>
                                        {btn.icon}
                                    </div>
                                    <span className={cn("text-[11px] font-bold", theme.text, toneStyle?.font)}>{btn.label}</span>
                                </div>
                                {btn.badge ? (
                                    <span className="text-[7px] font-black opacity-30 tracking-widest">{btn.badge}</span>
                                ) : (
                                    <ArrowRight size={12} className="opacity-10 group-hover:opacity-100 transition-opacity mr-1 z-10" />
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className={cn("text-[8px] font-black uppercase tracking-[0.5em] transition-all pt-2 opacity-30 hover:opacity-100", theme.text)}
                    >
                        {t.cancel}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
function LeadModal({ isOpen, onClose, onSubmit, theme, t, lang, toneStyle, isEmbed = false }: any) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: ""
    })

    if (!isOpen && !isEmbed) return null

    const handleSubmit = () => {
        if (!formData.name || !formData.phone) return
        onSubmit(formData)
        setFormData({ name: "", phone: "", email: "", message: "" })
        if (onClose) onClose()
    }

    const content = (
        <div className="relative z-10 w-full">
            <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col items-center text-center w-full gap-1">
                    <h3 className={cn("text-lg font-black uppercase tracking-tight leading-none mb-1", theme.text, toneStyle?.font)}>
                        {t.contactMeTitle}
                    </h3>
                    <p className={cn("text-[8px] font-bold uppercase tracking-[0.3em] opacity-40", theme.text)}>
                        {t.contactMeSub}
                    </p>
                </div>
                {!isEmbed && (
                    <button onClick={onClose} className={cn("absolute top-0 right-0 p-1.5 rounded-full hover:bg-white/5 transition-colors opacity-40 hover:opacity-100", theme.text)}>
                        <X size={18} />
                    </button>
                )}
            </div>

            <div className="space-y-3">
                <div className="space-y-1">
                    <label className={cn("text-[8px] font-black uppercase tracking-widest ml-2 opacity-40", theme.text)}>{t.fullNameLabel}</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={cn("w-full border px-4 py-3 text-xs focus:outline-none transition-all font-medium rounded-xl", theme.btn, theme.border, theme.text)}
                        placeholder="..."
                    />
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                        <label className={cn("text-[8px] font-black uppercase tracking-widest ml-2 opacity-40", theme.text)}>{t.phoneNumberLabel}</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={cn("w-full border px-4 py-3 text-xs focus:outline-none transition-all font-medium rounded-xl", theme.btn, theme.border, theme.text)}
                            placeholder="+90 ..."
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className={cn("text-[8px] font-black uppercase tracking-widest ml-2 opacity-40", theme.text)}>{t.messageLabel}</label>
                    <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={cn("w-full border px-4 py-3 text-xs focus:outline-none transition-all font-medium min-h-[80px] resize-none rounded-xl", theme.btn, theme.border, theme.text)}
                        placeholder={t.helpMessagePlaceholder}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.phone}
                    className={cn("w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] relative overflow-hidden group active:scale-[0.98] transition-all disabled:opacity-40 shadow-lg text-white")}
                    style={{ background: theme.accent, boxShadow: `0 8px 25px ${theme.accent}30` }}
                >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500" />
                    <span className="relative z-10">{t.sendMyInfoBtn}</span>
                </button>
            </div>
        </div>
    )

    if (isEmbed) {
        return content
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
                className={cn("relative w-full max-w-[320px] p-6 overflow-hidden border backdrop-blur-3xl", theme.card, theme.border, toneStyle?.rounded || "rounded-[2rem]")}
                style={{
                    boxShadow: `0 20px 50px -12px ${theme.accent}20`
                }}
            >
                {/* Decorative */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }} />
                <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ background: theme.accent }} />

                {content}
            </motion.div>
        </div>
    )
}

function AIChatAssistant({ isOpen, onClose, profile, t, theme, toneStyle, messages, setMessages, aiConfig, isEmbed = false }: any) {
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isLoading])

    useEffect(() => {
        if ((isOpen || isEmbed) && messages.length === 0) {
            const defaultGreeting = t.aiGreetingTemplate(profile.user.name)

            setMessages([{
                role: "assistant",
                content: aiConfig?.greeting || defaultGreeting
            }])
        }
    }, [isOpen, isEmbed, messages, profile.user.name, profile.lang, setMessages, aiConfig])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMsg = { role: "user", content: input }
        const newMessages = [...messages, userMsg]
        setMessages(newMessages)
        setInput("")
        setIsLoading(true)

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages, profile })
            })
            const data = await res.json()
            if (data.text) {
                setMessages([...newMessages, { role: "assistant", content: data.text }])
            } else if (data.error) {
                setMessages([...newMessages, { role: "assistant", isError: true, content: data.error }])
            }
        } catch (error) {
            console.error("Chat Error:", error)
            setMessages([...newMessages, { role: "assistant", isError: true, content: t.connectionError }])
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen && !isEmbed) return null

    const content = (
        <div className={cn("flex flex-col h-full w-full relative z-10", isEmbed ? "" : "")}>
            {/* Header */}
            <div className={cn("p-5 pb-3 flex items-center justify-between border-b relative z-10", theme.border)}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
                        <Bot size={20} />
                        <div className="absolute inset-0 animate-pulse opacity-20" style={{ background: theme.accent }} />
                    </div>
                    <div className="text-left">
                        <h3 className={cn("text-[11px] font-black uppercase tracking-tight", theme.text, toneStyle?.font)}>{aiConfig?.assistantName || "Kardly AI"}</h3>
                        <div className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span className={cn("text-[7px] font-bold uppercase tracking-widest opacity-40", theme.text)}>{t.onlineStatus}</span>
                        </div>
                    </div>
                </div>
                {!isEmbed && (
                    <button onClick={onClose} className={cn("w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors opacity-40 hover:opacity-100", theme.text)}>
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3 no-scrollbar relative z-10">
                {messages.map((m: any, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={cn(
                            "max-w-[85%] p-3.5 text-[11px] font-medium leading-relaxed",
                            m.role === "user"
                                ? cn("ml-auto border", theme.btn, theme.border, theme.text, "rounded-[1.2rem] rounded-tr-none text-right")
                                : cn("border", theme.btn, theme.border, theme.text, "rounded-[1.2rem] rounded-tl-none text-left")
                        )}
                        style={m.role === "assistant" && !m.isError ? { borderColor: `${theme.accent}20`, backgroundColor: `${theme.accent}10` } : {}}
                    >
                        {m.content}
                    </motion.div>
                ))}
                {isLoading && (
                    <div className={cn("flex gap-1 p-3 border rounded-2xl w-14 items-center justify-center text-left", theme.btn, theme.border)}>
                        <span className="w-0.5 h-0.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-0.5 h-0.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-0.5 h-0.5 bg-current rounded-full animate-bounce" />
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-5 pt-2 relative z-10">
                <div className={cn("relative flex items-center border transition-all pr-1.5 rounded-2xl", theme.btn, theme.border)}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder={t.askSomething}
                        className={cn("bg-transparent border-none focus:ring-0 text-[11px] p-3.5 flex-1 placeholder:opacity-20", theme.text)}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:scale-105 active:scale-95 shadow-lg"
                        style={{ backgroundColor: theme.accent, color: 'white' }}
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    )

    if (isEmbed) {
        return (
            <div className={cn("relative w-full h-[500px] flex flex-col overflow-hidden", theme.card, theme.border, toneStyle?.rounded || "rounded-[2rem]")}>
                {content}
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4 text-left">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.98 }}
                className={cn("relative w-full max-w-[380px] h-[540px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border backdrop-blur-3xl transition-all", theme.card, theme.border, toneStyle?.rounded || "rounded-[2rem]")}
            >
                {content}
            </motion.div>
        </div>
    )
}

function ExternalWidget({ block, theme, toneStyle, className, t }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptInjected = useRef(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const codeStr = block.content.code || "";
    const isFloating = codeStr.includes('data-style="floating"');
    const isKardlyWidget = codeStr.includes('/api/widget.js');

    // Extract attributes for Kardly widgets
    const extractAttr = (attr: string) => {
        const match = codeStr.match(new RegExp(`${attr}="([^"]*)"`));
        return match ? match[1] : "";
    };

    const widgetType = extractAttr('data-type') || 'booking';
    const widgetUser = extractAttr('data-user');
    const vUrl = extractAttr('data-vUrl');
    const btnText = extractAttr('data-btn');
    const sList = extractAttr('data-sList');
    const date = extractAttr('data-date');
    const title = extractAttr('data-title');
    const pImages = extractAttr('data-pImages');
    const githubUrl = extractAttr('data-ghUrl');
    const dribbbleUrl = extractAttr('data-drUrl');
    const behanceUrl = extractAttr('data-bhUrl');
    const tList = extractAttr('data-tList');
    const rss = extractAttr('data-rss');

    useEffect(() => {
        if (!codeStr || scriptInjected.current || !containerRef.current) return;
        if (isFloating || isKardlyWidget) return; // Don't inject script for floating or internal widgets

        const range = document.createRange();
        const documentFragment = range.createContextualFragment(codeStr);

        const scripts = Array.from(documentFragment.querySelectorAll('script'));
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            document.body.appendChild(newScript);
        });

        documentFragment.querySelectorAll(':not(script)').forEach(node => {
            containerRef.current?.appendChild(node);
        });

        scriptInjected.current = true;
    }, [block, isFloating, isKardlyWidget, codeStr]);

    if (!codeStr || !block.isActive) return null;

    const renderInternalWidget = (isModal = false) => {
        const commonProps = { theme, toneStyle, t };
        const iframeHeight = isModal ? 'h-[600px]' : 'min-h-[650px]';
        switch (widgetType) {
            case 'video':
                return <VideoWidget url={vUrl} btnText={btnText || t.izleLabel} {...commonProps} />;
            case 'skills':
                return <SkillsWidget skills={sList} {...commonProps} />;
            case 'portfolio':
                return <PortfolioWidget images={pImages} githubUrl={githubUrl} dribbbleUrl={dribbbleUrl} behanceUrl={behanceUrl} {...commonProps} />;
            case 'blog':
                return <BlogWidget rssUrl={rss} {...commonProps} />;
            case 'tech':
                return <TechStackWidget technologies={tList} {...commonProps} />;
            case 'countdown':
                return <CountdownWidget targetDate={date} title={title} {...commonProps} />;
            case 'lead':
            case 'booking':
            case 'ai':
            case 'chat':
                return (
                    <iframe
                        src={`https://www.kardly.site/${widgetUser}?widget=${widgetType}&embed=true`}
                        className={`w-full ${iframeHeight} border-none`}
                        allow="autoplay; fullscreen"
                        style={{ borderRadius: 'inherit' }}
                    />
                );
            default:
                return (
                    <iframe
                        src={`https://www.kardly.site/${widgetUser}?widget=${widgetType}&embed=true`}
                        className={`w-full ${iframeHeight} border-none`}
                        allow="autoplay; fullscreen"
                        style={{ borderRadius: 'inherit' }}
                    />
                );
        }
    };

    if (isFloating) {
        const typeConfig: Record<string, { icon: any; label: string }> = {
            booking: { icon: <Calendar size={22} />, label: t.bookingLabel },
            lead: { icon: <MessageSquare size={22} />, label: t.leadLabel },
            chat: { icon: <Bot size={22} />, label: t.aiLabel },
            ai: { icon: <Bot size={22} />, label: t.aiLabel },
            video: { icon: <Play size={22} />, label: t.videoLabel },
            skills: { icon: <Zap size={22} />, label: t.skillsLabel },
            portfolio: { icon: <Image size={22} />, label: t.portfolioLabel },
            tech: { icon: <Code size={22} />, label: t.techLabel },
            countdown: { icon: <Target size={22} />, label: t.countdownLabel },
            blog: { icon: <Rss size={22} />, label: t.blogLabel },
        };

        const config = typeConfig[widgetType] || typeConfig.booking;

        return (
            <>
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className={cn(
                        "h-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-xl border border-white/10",
                        toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl",
                        className
                    )}
                    style={{
                        background: `linear-gradient(135deg, ${theme.accent}33, ${theme.accent}11)`,
                        boxShadow: `0 8px 25px -10px ${theme.accent}30`,
                        color: theme.accent
                    }}
                    title={block.content?.title || config.label}
                >
                    <div className="relative">
                        <div className="absolute inset-0 blur-md opacity-40 scale-150" style={{ color: theme.accent }}>{config.icon}</div>
                        <div className="relative z-10">{config.icon}</div>
                    </div>
                </motion.button>

                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className={cn(
                                    "relative w-full max-w-[400px] h-fit max-h-[85vh] overflow-hidden shadow-2xl border backdrop-blur-3xl",
                                    theme.card, theme.border, toneStyle?.rounded || "rounded-[2rem]"
                                )}
                            >
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-4 right-4 z-[600] w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                    style={{ background: `${theme.accent}20`, color: theme.accent }}
                                >
                                    <X size={16} />
                                </button>
                                <div className="w-full h-full overflow-y-auto no-scrollbar">
                                    {isKardlyWidget ? renderInternalWidget(true) : (
                                        <iframe
                                            src={`https://www.kardly.site/${widgetUser}?widget=${widgetType}&embed=true`}
                                            className="w-full h-[600px] border-none"
                                            allow="autoplay; fullscreen"
                                        />
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        );
    }

    return (
        <div className={cn("w-full p-0 flex flex-col items-center gap-4 relative", isKardlyWidget ? "" : cn("p-8 border text-center", theme.card, theme.border, toneStyle.rounded))} id="external-inline-widget">
            {!isKardlyWidget && (
                <>
                    <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ background: theme.accent }} />
                    {block.content?.title && (
                        <div className="space-y-1 mb-2">
                            <h4 className={cn("text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-1", theme.text)}>
                                {block.content.title}
                            </h4>
                            <div className="w-8 h-[2px] mx-auto rounded-full opacity-40" style={{ background: theme.accent }} />
                        </div>
                    )}
                </>
            )}

            {isKardlyWidget ? (
                <div className="w-full">
                    {renderInternalWidget()}
                </div>
            ) : (
                <div ref={containerRef} className="w-full flex justify-center" />
            )}
        </div>
    );
}

function VideoWidget({ url, btnText, theme, toneStyle, t }: any) {
    const [isOpen, setIsOpen] = useState(false);

    const getEmbedUrl = (url: string) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const id = url.split('v=')[1] || url.split('/').pop();
            return `https://www.youtube.com/embed/${id}?autoplay=1`;
        }
        if (url.includes('vimeo.com')) {
            const id = url.split('/').pop();
            return `https://player.vimeo.com/video/${id}?autoplay=1`;
        }
        return url;
    };

    return (
        <div className={cn("w-full p-8 flex flex-col items-center justify-center gap-6 text-center border shadow-xl relative overflow-hidden h-[300px]", theme.card, theme.border, toneStyle.rounded)}>
            <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ background: theme.accent }} />
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 animate-pulse" style={{ background: `${theme.accent}15`, color: theme.accent }}>
                <Play size={32} fill="currentColor" />
            </div>
            <h3 className={cn("text-lg font-black uppercase tracking-widest", theme.text)}>{btnText}</h3>
            <button
                onClick={() => setIsOpen(true)}
                className={cn("px-8 py-4 text-white font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105 active:scale-95", toneStyle.rounded)}
                style={{ background: theme.accent }}
            >
                {t.watchNow}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                    >
                        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                            <X size={32} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            <iframe src={getEmbedUrl(url)} className="w-full h-full" allow="autoplay; fullscreen" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SkillsWidget({ skills, theme, toneStyle, t }: any) {
    const skillList = skills.split(',').map((s: string) => {
        const [name, percent] = s.split(':');
        return { name: name?.trim(), percent: parseInt(percent) || 0 };
    }).filter((s: any) => s.name);

    return (
        <div className={cn("w-full p-8 flex flex-col gap-6 border shadow-xl relative overflow-hidden", theme.card, theme.border, toneStyle.rounded)}>
            <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ background: theme.accent }} />
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${theme.accent}15`, color: theme.accent }}>
                    <Zap size={18} />
                </div>
                <h3 className={cn("text-sm font-black uppercase tracking-widest", theme.text)}>{t.skillsTitle}</h3>
            </div>
            <div className="space-y-6">
                {skillList.map((skill: any, idx: number) => (
                    <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <span className={cn("text-[10px] font-black uppercase tracking-widest opacity-60", theme.text)}>{skill.name}</span>
                            <span className={cn("text-[10px] font-black tracking-widest", theme.text)} style={{ color: theme.accent }}>%{skill.percent}</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.percent}%` }}
                                transition={{ duration: 1.5, delay: idx * 0.1, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{ background: `linear-gradient(90deg, ${theme.accent}dd, ${theme.accent})` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CountdownWidget({ targetDate, title, theme, toneStyle, t }: any) {
    const [timeLeft, setTimeLeft] = useState<any>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            if (difference > 0) {
                return {
                    [t.days]: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    [t.hours]: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    [t.minutes]: Math.floor((difference / 1000 / 60) % 60),
                    [t.seconds]: Math.floor((difference / 1000) % 60)
                };
            }
            return null;
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        setTimeLeft(calculateTimeLeft());
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className={cn("w-full p-8 flex flex-col items-center justify-center gap-6 text-center border shadow-xl relative overflow-hidden", theme.card, theme.border, toneStyle.rounded)}>
            <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ background: theme.accent }} />
            <div className="space-y-1">
                <h3 className={cn("text-xs font-black uppercase tracking-[0.2em] opacity-40", theme.text)}>{title || t.dontMissOut}</h3>
                <div className="w-12 h-1 mx-auto rounded-full" style={{ background: theme.accent }} />
            </div>

            {timeLeft ? (
                <div className="flex gap-4 sm:gap-6">
                    {Object.entries(timeLeft).map(([label, value]: any) => (
                        <div key={label} className="flex flex-col items-center">
                            <div className={cn("text-3xl sm:text-4xl font-black tabular-nums transition-all", theme.text)} style={{ color: theme.accent }}>
                                {value.toString().padStart(2, '0')}
                            </div>
                            <span className={cn("text-[8px] font-black uppercase tracking-widest opacity-40", theme.text)}>{label}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    <p className={cn("text-2xl font-black", theme.text)}>{t.timeIsUp}</p>
                    <div className="w-8 h-[2px] mx-auto opacity-20" style={{ background: theme.accent }} />
                    <p className={cn("text-[8px] font-bold uppercase tracking-[0.4em] opacity-40", theme.text)}>KARDLY URGENCY TOOL</p>
                </div>
            )}
        </div>
    );
}

// ─── COMPONENT DEFINITIONS FOR EMBED & NORMAL BLOCKS ─────────────────────────────────────────────

function PortfolioWidget({ images, githubUrl, dribbbleUrl, behanceUrl, theme, toneStyle, t }: any) {
    const imagesList = images.split('|').filter((i: string) => i.trim());
    const [activeIdx, setActiveIdx] = useState(0);

    const getSafeUrl = (url: string) => {
        if (!url) return "";
        try {
            const decoded = decodeURIComponent(url);
            return decoded.startsWith('http') ? decoded : `https://${decoded}`;
        } catch {
            return url.startsWith('http') ? url : `https://${url}`;
        }
    };

    return (
        <div className={cn("w-full p-6 flex flex-col gap-6 border shadow-xl relative overflow-hidden", theme.card, theme.border, toneStyle.rounded)}>
            <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ background: theme.accent }} />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image size={18} className="text-primary" style={{ color: theme.accent }} />
                    <h3 className={cn("text-[10px] font-black uppercase tracking-[0.2em]", theme.text)}>{t.portfolioGallery}</h3>
                </div>

                {/* İsteğe bağlı sosyal medya / portfolyo bağlantıları */}
                <div className="flex items-center gap-2">
                    {githubUrl && (
                        <a href={getSafeUrl(githubUrl)} target="_blank" title="GitHub" className={cn("opacity-60 hover:opacity-100 hover:scale-110 transition-all", theme.text)}>
                            <Github size={14} />
                        </a>
                    )}
                    {dribbbleUrl && (
                        <a href={getSafeUrl(dribbbleUrl)} target="_blank" title="Dribbble" className={cn("opacity-60 hover:opacity-100 hover:scale-110 transition-all", theme.text)}>
                            <Dribbble size={14} />
                        </a>
                    )}
                    {behanceUrl && (
                        <a href={getSafeUrl(behanceUrl)} target="_blank" title="Behance" className={cn("opacity-60 hover:opacity-100 hover:scale-110 transition-all", theme.text)}>
                            <Palette size={14} />
                        </a>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-center gap-1">
                {imagesList.map((_: any, idx: number) => (
                    <div key={idx} className="w-1 h-1 rounded-full transition-all" style={{ background: idx === activeIdx ? theme.accent : `${theme.accent}15`, width: idx === activeIdx ? '12px' : '4px' }} />
                ))}
            </div>

            <div className="relative aspect-square w-full rounded-2xl overflow-hidden group">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={activeIdx}
                        src={imagesList[activeIdx]}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>

                {imagesList.length > 1 && (
                    <>
                        <button
                            onClick={() => setActiveIdx((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1))}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => setActiveIdx((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function TechStackWidget({ technologies, theme, toneStyle, t }: any) {
    const techList = technologies.split(',').map((t: string) => t.trim()).filter(Boolean);

    return (
        <div className={cn("w-full p-8 flex flex-col gap-6 border shadow-xl relative overflow-hidden", theme.card, theme.border, toneStyle.rounded)}>
            <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ background: theme.accent }} />
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${theme.accent}15`, color: theme.accent }}>
                    <Code size={18} />
                </div>
                <h3 className={cn("text-sm font-black uppercase tracking-widest", theme.text)}>{t.techStack}</h3>
            </div>

            <div className="flex flex-wrap gap-2">
                {techList.map((tech: string, idx: number) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn("px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all hover:scale-105", theme.card, theme.border)}
                        style={{ borderColor: `${theme.accent}20` }}
                    >
                        <span style={{ color: theme.accent }}>{tech}</span>
                    </motion.div>
                ))}
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between opacity-40">
                <span className={cn("text-[8px] font-bold uppercase tracking-[0.3em]", theme.text)}>Kardly Dev Tools</span>
                <Github size={12} className={theme.text} />
            </div>
        </div>
    );
}

function BlogWidget({ rssUrl, theme, toneStyle, t, lang }: any) {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRss = async () => {
            if (!rssUrl) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/rss?url=${encodeURIComponent(rssUrl)}`);
                const data = await res.json();
                if (data.status === 'ok' && data.items) {
                    setPosts(data.items.slice(0, 3));
                }
            } catch (err) {
                console.error('RSS fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRss();
    }, [rssUrl]);

    return (
        <div className={cn("w-full p-6 flex flex-col gap-6 border shadow-xl relative overflow-hidden", theme.card, theme.border, toneStyle.rounded)}>
            <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ background: theme.accent }} />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Rss size={18} className="text-primary" style={{ color: theme.accent }} />
                    <h3 className={cn("text-[10px] font-black uppercase tracking-[0.2em]", theme.text)}>{t.latestPosts}</h3>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4">
                            <div className="w-16 h-16 bg-slate-200/50 rounded-xl shrink-0" />
                            <div className="space-y-2 flex-1 pt-1">
                                <div className="h-3 w-full bg-slate-200/50 rounded-full" />
                                <div className="h-3 w-2/3 bg-slate-200/50 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : posts.length > 0 ? (
                <div className="space-y-4">
                    {posts.map((post, i) => (
                        <a key={i} href={post.link} target="_blank" rel="noopener noreferrer" className={cn("group flex flex-col p-4 rounded-2xl border transition-all hover:scale-[1.02]", theme.bg, theme.border)}>
                            <div className="flex gap-4 items-center">
                                {post.thumbnail && !post.thumbnail.includes('medium.com/v2/') && (
                                    <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-slate-100 hidden sm:block">
                                        <img src={post.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="flex-1 space-y-1 overflow-hidden">
                                    <h4 className={cn("text-xs font-bold line-clamp-2 leading-snug", theme.text)}>{post.title}</h4>
                                    <p className={cn("text-[8px] opacity-60 uppercase tracking-widest font-black truncate", theme.text)}>
                                        {new Date(post.pubDate).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')} • {post.author || t.authorLabel}
                                    </p>
                                </div>
                                <ArrowRight size={14} className={cn("opacity-40 group-hover:opacity-100 transition-opacity shrink-0", theme.text)} />
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className={cn("text-xs font-medium opacity-60", theme.text)}>{t.noPostsYet}</p>
                </div>
            )}
        </div>
    );
}
