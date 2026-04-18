// Vercel Deployment Trigger: 2026-04-14
"use client"

import React, { useState, useEffect, useRef, useMemo, ReactElement, cloneElement } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"
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
    Droplets,
    Monitor,
    Rss,
    RefreshCw,
    Plus,
    Check,
    Coffee,
    Heart,
    CreditCard,
    Facebook,
    Award,
    ExternalLink,
    Clock,
    Crown,
    UserCheck
} from "lucide-react"
import BusinessCardGenerator, { TEMPLATES } from "@/components/BusinessCardGenerator"
import { AppointmentModal } from "@/components/AppointmentModal"
import { translations } from "@/lib/i18n"

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
    businessCardTemplateId?: string;
    businessCardOrientation?: string;
    buttonLayout?: string;
    buttonColor?: string;
    buttonShape?: string;
    articles?: { id: string; title: string; slug: string; excerpt: string; content: string; coverImage: string; createdAt: string; isActive: boolean }[];
}

const hexToRgb = (hex: string) => {
    hex = hex.replace("#", "")
    if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join("")
    }
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `${r}, ${g}, ${b}`
}

const XIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
        aria-hidden="true"
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
)

const MailWithBadge = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
        <Mail size={size} />
        <div 
            className="absolute bg-red-500 rounded-full flex items-center justify-center border border-white shadow-sm"
            style={{ 
                width: `${Math.max(10, size * 0.55)}px`, 
                height: `${Math.max(10, size * 0.55)}px`,
                top: `-${size * 0.15}px`,
                right: `-${size * 0.2}px`,
                fontSize: `${Math.max(7, size * 0.35)}px`,
                lineHeight: 1
            }}
        >
            <span className="text-white font-bold leading-none">1</span>
        </div>
    </div>
)

const getHeroIcon = (platform: string = "", size: number = 20, url: string = "") => {
    const p = platform.toLowerCase().trim();
    const u = (url || "").toLowerCase().trim();
    
    // Auto-detect from URL if platform is not clear or is an generic link
    if (p === 'website' || p === 'globe' || !p || p === 'custom') {
        const u = (url || "").toLowerCase().trim();
        if (u.includes('twitter.com') || u.includes('x.com')) return <XIcon size={size} />;
        if (u.includes('instagram.com')) return <Instagram size={size} />;
        if (u.includes('linkedin.com')) return <Linkedin size={size} />;
        if (u.includes('youtube.com') || u.includes('youtu.be')) return <Youtube size={size} />;
        if (u.includes('github.com')) return <Github size={size} />;
        if (u.includes('facebook.com')) return <Facebook size={size} />;
        // Enhanced email detection: mailto:, email: or contains @ and doesn't look like a website
        if (u.includes('mailto:') || u.includes('email:') || (u.includes('@') && !u.startsWith('http') && !u.includes('/'))) return <MailWithBadge size={size} />;
    }

    switch (p) {
        case 'instagram': return <Instagram size={size} />;
        case 'whatsapp': return <MessageCircle size={size} />;
        case 'twitter': case 'x': return <XIcon size={size} />;
        case 'linkedin': return <Linkedin size={size} />;
        case 'youtube': return <Youtube size={size} />;
        case 'github': return <Github size={size} />;
        case 'website': return <Globe size={size} />;
        case 'email': case 'mail': return <MailWithBadge size={size} />;
        case 'phone': return <Phone size={size} />;
        case 'facebook': return <Facebook size={size} />;
        case 'dribbble': return <Dribbble size={size} />;
        case 'behance': return <Palette size={size} />;
        case 'tiktok': return <Sparkles size={size} />;
        case 'telegram': return <Send size={size} />;
        case 'snapchat': return <Target size={size} />;
        default: return <Globe size={size} />;
    }
}


// ─── HELPERS ─────────────────────────────────────────────────────

const isDarkColor = (color: string) => {
    if (!color || color === 'transparent' || color.startsWith('var')) return false;
    try {
        let hex = color;
        if (color.startsWith('#')) hex = color.slice(1);
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        if (hex.length !== 6) return false;
        
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        
        // standard luminance formula
        const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luma < 0.6; // Slightly higher threshold for icon contrast
    } catch (e) {
        return false;
    }
};

const getContrastingAccent = (accentColor: string, isLightBg: boolean) => {
    if (!accentColor || accentColor === 'transparent') return isLightBg ? '#1a1a1a' : '#ffffff';
    
    const isAccentDark = isDarkColor(accentColor);
    
    if (isLightBg) {
        // If background is light, we MUST have a dark accent.
        // If current accent is light (not dark), return a strong dark color.
        return isAccentDark ? accentColor : '#1a1a1a';
    } else {
        // If background is dark, we MUST have a light accent.
        // If current accent is dark, return white.
        return isAccentDark ? '#ffffff' : accentColor;
    }
};

const checkIfBgIsLight = (bgClass: string) => {
    if (!bgClass) return false;
    const lower = bgClass.toLowerCase();
    
    // Explicit light tailwind classes
    const lightClasses = ['-white', '-slate-50', '-slate-100', '-gray-50', '-gray-100', '-zinc-50', '-zinc-100', '-amber-50', '-orange-50', '-yellow-50', '-rose-50', '-blue-50', '-sky-50', '-emerald-50', '-green-50', '-cyan-50'];
    if (lightClasses.some(c => lower.includes(c)) || lower === 'bg-white') return true;
    
    // Hex detection in tailwind bg-[#...]
    const hexMatch = lower.match(/#([a-f0-9]{6}|[a-f0-9]{3})/);
    if (hexMatch) {
        const hex = hexMatch[1];
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else {
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
        }
        const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luma > 0.65; // Threshold for background to be considered "light"
    }
    
    return false;
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────


export default function ProfileClient({ profile }: { profile: any }) {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
    const [lang, setLang] = useState("tr")
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [isCVModalOpen, setIsCVModalOpen] = useState(false)
    const [cvViewUrl, setCvViewUrl] = useState("")
    const [isCvLoading, setIsCvLoading] = useState(false)
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
    const [selectedProject, setSelectedProject] = useState<any>(null)
    const [currentArticle, setCurrentArticle] = useState<any>(null)
    const [isArticleOpen, setIsArticleOpen] = useState(false)

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

        const ownerName = profile?.user?.name || profile?.displayName || "Kullanıcı"

        const systemPrompt = `
        Sen ${ownerName}'in dijital asistanısın${content.assistantName !== 'Kardly AI' ? ` (Adın: ${content.assistantName})` : ""}. Görevin, profil sayfasını ziyaret eden kişilerin sorularını yanıtlamak ve onlara yardımcı olmaktır.
        
        === PROFİL SAHİBİ BİLGİLERİ ===
        - İsim: ${ownerName}
        - Meslek/Unvan: ${profile.occupation || "Belirtilmedi"}
        - Slogan: ${profile.slogan || "Belirtilmedi"}
        - Biyografi: ${profile.bio || "Belirtilmedi"}
        - Hizmetler: ${JSON.stringify(profile.services || [])}
        - Sosyal Medya: ${JSON.stringify(profile.socialLinks || [])}
        
        === KURALLAR ===
        1. Her zaman nazik, profesyonel ve yardımcı ol.
        2. ${ownerName} adına konuşuyormuş gibi değil, onun asistanı gibi konuş (Örn: "${ownerName} Bey şu an...", "Size bu konuda yardımcı olabilirim").
        3. Yanıtlarını kısa ve öz tut.
        4. Eğer kullanıcı randevu almak isterse, sayfadaki "Randevu Al" butonunu kullanabileceğini söyle.
        5. Eğer iletişim kurmak isterse, "İletişime Geç" butonuna tıklamasını veya mail/telefon bilgilerini paylaşabileceğini belirt.
        6. Bilmediğin konularda uydurma yapma, "Bu konuda ${ownerName} Bey'e danışıp size dönebiliriz" de.
        7. Yanıtlarda emojiler kullanabilirsin ama aşırıya kaçma.
        ${content.instructions ? `\n=== ÖZEL TALİMATLAR ===\n${content.instructions}` : ""}
        
        Kullanıcının dili neyse (Türkçe veya İngilizce) o dilde cevap ver.
        `.trim()

        return {
            ...content,
            systemPrompt: systemPrompt
        }
    }, [profile.blocks, profile?.user?.name, profile.occupation, profile.slogan, profile.bio, profile.services, profile.socialLinks])


    const t = translations[lang as keyof typeof translations] || translations.tr

    const translateText = (text: string) => {
        if (!text || typeof text !== 'string') return "";
        if (lang === 'tr') return text;
        const mapping: Record<string, string> = {
            "Dış Doktoru": "Dentist",
            "Gülüşünüzü Aydınlatın": "Brighten Your Smile",
            "Yazılım Mimarı": "Software Architect",
            "Tasarımcı": "Designer"
        };
        return mapping[text] || text;
    };

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

        const url = profile.cvUrl.trim();
        
        // Proxy URL'sini oluştur
        let finalUrl = url;
        if (url.includes('res.cloudinary.com')) {
            finalUrl = `/api/cv-proxy?url=${encodeURIComponent(url)}`;
        }

        setCvViewUrl(finalUrl);
        setIsCVModalOpen(true);
    }

    const handleAddToContacts = () => {
        trackEvent("vcard")
        const phone = (profile.socialLinks as any[])?.find((l: any) => l.platform === 'phone')?.url || profile.phone || ""
        const website = `${window.location.origin}/${profile.username}`
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.user?.name || ""}
N:${(profile.user?.name || "").split(" ").reverse().join(";") || ""};;;;
ORG:${profile.occupation || ""}
TEL;TYPE=CELL:${phone}
EMAIL:${profile.user?.email || ""}
URL:${website}
NOTE:${profile.bio || profile.slogan || ""}
END:VCARD`

        const blob = new Blob([vcard], { type: "text/vcard" })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `${profile.user?.name || "contact"}.vcf`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    if (!mounted) return <div className="min-h-screen bg-[#020617] flex items-center justify-center font-sans"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>

    const props = { profile, t, lang, setLang, setIsAppointmentOpen, isAppointmentOpen, handleShare, handleCVView, handleAddToContacts, reviews, setIsReviewModalOpen, isReviewModalOpen, trackEvent, setReviewStatus, reviewStatus, setIsQrOpen, isWalletModalOpen, setIsWalletModalOpen, qrDataUrl, isQrOpen, copied, setIsLeadModalOpen, isLeadModalOpen, setLeadStatus, leadStatus, isAIChatOpen, setIsAIChatOpen, chatMessages, setChatMessages, aiConfig, isEmbedMode, isCVModalOpen, setIsCVModalOpen, cvViewUrl, selectedProject, setSelectedProject, setCurrentArticle, isArticleOpen, setIsArticleOpen }

    // Get active accent color for review modal
    const getActiveAccent = (scheme?: any): string => {
        if (profile.themeColor) return profile.themeColor;
        
        // If we have a theme object passed, use its accent
        if (scheme?.accent) return scheme.accent;

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
            meta_portal: "#f472b6", meta_pixel: "#38bdf8",
            tour_resort: "#009688", tour_adventure: "#ff6d00", tour_yacht: "#1976d2",
            tour_guide: "#6d4c41", tour_agency: "#3f51b5", tour_winter: "#1e88e5",
            masters_plumber: "#0ea5e9", masters_electrician: "#facc15",
            masters_painter: "#ec4899", masters_carpenter: "#92400e",
            masters_auto: "#dc2626", masters_renovation: "#4b5563"
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
                    expertiseStyle: "slow-rotate",
                    shadow: "shadow-sm",
                    glass: "backdrop-blur-md bg-white/5"
                };
            case "samimi":
                return {
                    font: "font-sans",
                    rounded: "rounded-[4rem]",
                    border: "border-none",
                    headerSize: "text-3xl",
                    expertiseStyle: "floating",
                    shadow: "shadow-2xl shadow-primary/20",
                    glow: "animate-pulse-slow",
                    glass: "backdrop-blur-2xl bg-white/10"
                };
            case "yaratıcı":
                return {
                    font: "font-mono",
                    rounded: "rounded-[2.2rem] rotate-[-1deg]",
                    border: "border-dashed border-2",
                    headerSize: "text-3xl italic",
                    expertiseStyle: "scattered",
                    shadow: "shadow-[8px_8px_0px_rgba(0,0,0,0.2)]",
                    glass: "backdrop-blur-lg bg-white/5 border-primary/30"
                };
            case "lüks":
                return {
                    font: "font-serif",
                    rounded: "rounded-[3rem]",
                    border: "border-double border-2",
                    headerSize: "text-2xl uppercase tracking-[0.4em] italic",
                    expertiseStyle: "slow-rotate",
                    shadow: "shadow-[20px_20px_50px_rgba(0,0,0,0.5)]",
                    glass: "backdrop-blur-2xl bg-black/40 border-gold/40 shadow-inner",
                    shimmer: "animate-shimmer"
                };
            default:
                return {
                    font: "font-sans",
                    rounded: "rounded-[2.5rem]",
                    border: "border-solid",
                    headerSize: "text-3xl",
                    expertiseStyle: "rotate",
                    shadow: "shadow-xl",
                    glass: "backdrop-blur-xl bg-white/5"
                };
        }
    }

    const toneStyle = getToneStyle(profile.tone || "profesyonel")

    // Template Selector Logic
    const renderTemplate = () => {
        const tone = profile.tone?.toLowerCase() || "profesyonel"
        const templateId = profile.templateId || "black"

        if (templateId.startsWith('elite_')) {
            return <EliteModernTemplate {...props} colorScheme={templateId} tone={tone} toneStyle={toneStyle} translateText={translateText} />;
        }

        if (templateId.startsWith('athletic_')) {
            return <AthleticProTemplate {...props} colorScheme={templateId} tone={tone} toneStyle={toneStyle} translateText={translateText} />;
        }

        if (templateId.startsWith('tour_')) {
            return <TourismTravelTemplate {...props} colorScheme={templateId} tone={tone} toneStyle={toneStyle} translateText={translateText} />;
        }

        if (templateId.startsWith('masters_') || templateId.startsWith('uni_')) {
            return <MastersCraftTemplate {...props} colorScheme={templateId} tone={tone} toneStyle={toneStyle} translateText={translateText} />;
        }

        return <NeonModernTemplate {...props} colorScheme={templateId} tone={tone} toneStyle={toneStyle} translateText={translateText} />;
    }

    const animationStyle = profile.animationStyle || "none";

    return (
        <div 
            className="min-h-screen relative bg-[#030712] overflow-x-hidden"
            style={{ 
                '--profile-accent': activeAccent,
                '--profile-accent-rgb': hexToRgb(activeAccent)
            } as any}
        >
            <MeshBackground activeAccent={activeAccent} />
            
            <div className="relative z-10 w-full h-full">
                <MotionWrapper style={animationStyle} activeAccent={activeAccent}>
                    {renderTemplate()}
                </MotionWrapper>
            </div>
            
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full sm:max-w-md bg-[#0a0a0f] border border-white/10 rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl z-10 mx-auto pb-20 sm:pb-0"
                            style={{ boxShadow: `0 30px 100px -20px ${activeAccent}40` }}
                        >
                            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto my-5 sm:hidden shrink-0" />
                            
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors shadow-2xl"
                            >
                                <X size={18} />
                            </button>

                            <div className="aspect-video w-full overflow-hidden relative">
                                <img
                                    src={selectedProject.image}
                                    alt={selectedProject.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />
                            </div>

                            <div className="p-8 sm:p-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: activeAccent }} />
                                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight italic leading-tight">
                                        {translateText(selectedProject.name)}
                                    </h3>
                                </div>
                                <p className="text-white/60 text-[14px] leading-relaxed font-medium break-words overflow-hidden opacity-80">
                                    {translateText(selectedProject.description) || t.noProjectDesc}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Article Reader Modal - must be inside ProfileClient's return */}
            <ArticleReaderModal 
                isOpen={isArticleOpen} 
                onClose={() => setIsArticleOpen(false)} 
                article={currentArticle} 
                theme={{ accent: activeAccent, card: 'bg-[#0a0a0f]', border: 'border-white/10', isLight: false }}
                t={t} 
                lang={lang} 
            />
        </div>
    )
}

function MeshBackground({ activeAccent }: { activeAccent: string }) {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[40px]"
                style={{ backgroundColor: `${activeAccent}33` }}
            />
            <motion.div
                animate={{
                    x: [0, -80, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[40px]"
                style={{ backgroundColor: `${activeAccent}22` }}
            />
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, -100, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -bottom-[10%] left-[20%] w-[55%] h-[55%] rounded-full blur-[40px]"
                style={{ backgroundColor: `${activeAccent}11` }}
            />
        </div>
    );
}

function MotionWrapper({ children, style, activeAccent }: { children: React.ReactNode, style: string, activeAccent?: string }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    const springConfig = { damping: 25, stiffness: 150 };
    const dx = useSpring(rotateX, springConfig);
    const dy = useSpring(rotateY, springConfig);

    // Subtle gloss highlight that moves with the tilt
    const glossX = useTransform(x, [-100, 100], ["-20%", "120%"]);
    const glossY = useTransform(y, [-100, 100], ["-20%", "120%"]);

    function handleMouseMove(event: any) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    if (style === "3d-manual") {
        return (
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ 
                    rotateX: dx, 
                    rotateY: dy, 
                    perspective: 1200,
                    transformStyle: "preserve-3d"
                }}
                className="w-full h-full relative group/tilt"
            >
                <div className="relative z-10 w-full h-full">
                    {children}
                </div>
                
                {/* Dynamic Gloss Interaction */}
                <motion.div 
                    className="absolute inset-0 z-20 pointer-events-none rounded-[inherit] opacity-0 group-hover/tilt:opacity-40 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(circle at ${glossX} ${glossY}, rgba(255,255,255,0.15) 0%, transparent 80%)`,
                    }}
                />
            </motion.div>
        );
    }


    if (style === "glow") {
        return (
            <div className="relative w-full h-full">
                <motion.div
                    animate={{ 
                        opacity: [0.15, 0.35, 0.15],
                        scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="absolute inset-0 blur-[100px] rounded-full pointer-events-none z-0"
                    style={{ backgroundColor: activeAccent || "#6366f1" }}
                />
                <div className="relative z-10 w-full h-full">
                    {children}
                </div>
            </div>
        );
    }

    if (style === "shine") {
        return (
            <div className="relative w-full h-full overflow-hidden">
                <div className="relative z-10 w-full h-full">
                    {children}
                </div>
                <motion.div
                    animate={{ 
                        left: ["-100%", "200%"]
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        repeatDelay: 3,
                        ease: "linear" 
                    }}
                    className="absolute top-0 bottom-0 w-48 skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-50"
                />
            </div>
        );
    }

    return <div className="w-full h-full">{children}</div>;
}




function NeonModernTemplate({ profile, colorScheme, handleShare, handleCVView, handleAddToContacts, reviews, isReviewModalOpen, setIsReviewModalOpen, setIsAppointmentOpen, isAppointmentOpen, t, trackEvent, tone, setReviewStatus, reviewStatus, setIsQrOpen, lang, setLang, isWalletModalOpen, setIsWalletModalOpen, qrDataUrl, isQrOpen, toneStyle, copied, setIsLeadModalOpen, isLeadModalOpen, setLeadStatus, leadStatus, isAIChatOpen, setIsAIChatOpen, chatMessages, setChatMessages, aiConfig, isEmbedMode, translateText, isCVModalOpen, setIsCVModalOpen, cvViewUrl, selectedProject, setSelectedProject, setCurrentArticle, isArticleOpen, setIsArticleOpen }: any) {
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


    const getIcon = (title: string = "") => {
        const t = (title || "").toLowerCase();
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
        // Masters & Services Themes
        masters_plumber: {
            bg: "bg-[#0c1e35]",
            card: "bg-blue-900/20",
            text: "text-white",
            subtext: "text-blue-200/60",
            border: "border-blue-500/30",
            glow: "shadow-[0_0_30px_rgba(56,189,248,0.4)]",
            accent: "#38bdf8",
            btn: "bg-blue-900/40 border-blue-500/30",
            btnText: "text-white",
            icon: "text-[#38bdf8]",
            special: "master_plumber"
        },
        masters_electrician: {
            bg: "bg-[#0f0a05]",
            card: "bg-amber-900/10",
            text: "text-white",
            subtext: "text-amber-200/60",
            border: "border-amber-500/30",
            glow: "shadow-[0_0_30px_rgba(245,158,11,0.4)]",
            accent: "#f59e0b",
            btn: "bg-amber-900/30 border-amber-500/30",
            btnText: "text-white",
            icon: "text-[#f59e0b]",
            special: "master_electrician"
        },
        masters_painter: {
            bg: "bg-[#0a0510]",
            card: "bg-purple-900/10",
            text: "text-white",
            subtext: "text-purple-200/60",
            border: "border-pink-500/30",
            glow: "shadow-[0_0_30px_rgba(236,72,153,0.4)]",
            accent: "#ec4899",
            btn: "bg-pink-900/20 border-pink-500/30",
            btnText: "text-white",
            icon: "text-[#ec4899]",
            special: "master_painter"
        },
        masters_carpenter: {
            bg: "bg-[#140f0a]",
            card: "bg-orange-900/10",
            text: "text-white",
            subtext: "text-orange-200/60",
            border: "border-orange-500/30",
            glow: "shadow-[0_0_30px_rgba(217,119,6,0.4)]",
            accent: "#d97706",
            btn: "bg-orange-950/40 border-orange-500/30",
            btnText: "text-white",
            icon: "text-[#d97706]",
            special: "master_carpenter"
        },
        masters_auto: {
            bg: "bg-[#0a0a0b]",
            card: "bg-zinc-900/30",
            text: "text-white",
            subtext: "text-zinc-400",
            border: "border-red-500/30",
            glow: "shadow-[0_0_30px_rgba(239,68,68,0.4)]",
            accent: "#ef4444",
            btn: "bg-red-950/20 border-red-500/30",
            btnText: "text-white",
            icon: "text-[#ef4444]",
            special: "master_auto"
        },
        masters_renovation: {
            bg: "bg-[#050505]",
            card: "bg-yellow-950/10",
            text: "text-white",
            subtext: "text-slate-400",
            border: "border-yellow-500/30",
            glow: "shadow-[0_0_30px_rgba(234,179,8,0.4)]",
            accent: "#eab308",
            btn: "bg-yellow-950/20 border-yellow-500/30",
            btnText: "text-white",
            icon: "text-[#eab308]",
            special: "master_renovation"
        },
        uni_blue: {
            bg: "bg-[#0c1e35]",
            card: "bg-[#0d1f3c]/40",
            text: "text-white",
            subtext: "text-blue-200/60",
            border: "border-blue-500/30",
            glow: "shadow-[0_0_30px_rgba(56,189,248,0.4)]",
            accent: "#38bdf8",
            btn: "bg-[#0d1f3c]/60 border-blue-500/30",
            btnText: "text-white",
            icon: "text-[#38bdf8]",
            special: "universal"
        },
        uni_emerald: {
            bg: "bg-[#06140e]",
            card: "bg-emerald-900/10",
            text: "text-white",
            subtext: "text-emerald-200/60",
            border: "border-emerald-500/30",
            glow: "shadow-[0_0_30px_rgba(16,185,129,0.4)]",
            accent: "#10b981",
            btn: "bg-emerald-950/20 border-emerald-500/30",
            btnText: "text-white",
            icon: "text-[#10b981]",
            special: "universal"
        },
        uni_purple: {
            bg: "bg-[#0a0510]",
            card: "bg-purple-900/10",
            text: "text-white",
            subtext: "text-purple-200/60",
            border: "border-purple-500/30",
            glow: "shadow-[0_0_30px_rgba(168,85,247,0.4)]",
            accent: "#a855f7",
            btn: "bg-purple-950/20 border-purple-500/30",
            btnText: "text-white",
            icon: "text-[#a855f7]",
            special: "universal"
        },
        uni_amber: {
            bg: "bg-[#0f0a05]",
            card: "bg-amber-900/10",
            text: "text-white",
            subtext: "text-amber-200/60",
            border: "border-amber-500/30",
            glow: "shadow-[0_0_30px_rgba(245,158,11,0.4)]",
            accent: "#f59e0b",
            btn: "bg-amber-950/20 border-amber-500/30",
            btnText: "text-white",
            icon: "text-[#f59e0b]",
            special: "universal"
        },
        uni_slate: {
            bg: "bg-[#0a0a0b]",
            card: "bg-zinc-900/10",
            text: "text-white",
            subtext: "text-zinc-400",
            border: "border-white/20",
            glow: "shadow-[0_0_30px_rgba(255,255,255,0.1)]",
            accent: "#ffffff",
            btn: "bg-zinc-800/40 border-white/20",
            btnText: "text-white",
            icon: "text-white",
            special: "universal"
        },
        uni_midnight: {
            bg: "bg-[#050505]",
            card: "bg-black/60",
            text: "text-amber-200",
            subtext: "text-amber-500/40",
            border: "border-amber-500/30",
            glow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]",
            accent: "#d4af37",
            btn: "bg-black/80 border-amber-500/30",
            btnText: "text-amber-200",
            icon: "text-[#d4af37]",
            special: "universal"
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
        pro_software: {
            bg: profile.themeColor ? `dynamic-bg` : "bg-[#02040a]",
            card: profile.themeColor ? 'dynamic-card' : "bg-[#0d1117]/90",
            text: "text-emerald-300",
            subtext: "text-emerald-500/40",
            border: "border-emerald-500/25",
            glow: "shadow-[0_0_60px_rgba(16,185,129,0.25),0_0_120px_rgba(16,185,129,0.08)]",
            accent: profile.themeColor || "#10b981",
            btn: "bg-[#0d1117]/80 border-emerald-500/30",
            btnText: "text-emerald-300",
            icon: "text-emerald-400",
            special: "software"
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
            card: "bg-white/[0.01] backdrop-blur-2xl",
            text: "text-white",
            subtext: "text-indigo-300/40",
            border: "border-indigo-500/20",
            glow: "shadow-[0_30px_100px_rgba(99,102,241,0.15)]",
            accent: "#6366f1",
            btn: "rounded-full bg-indigo-500/10 border-indigo-500/30 backdrop-blur-2xl shadow-[0_10px_30px_rgba(99,102,241,0.1)] hover:bg-indigo-500/20 transition-all",
            btnText: "text-indigo-100",
            icon: "text-indigo-400",
            special: "3d_quantum"
        },

        // Turizm & Seyahat
        tour_resort: {
            bg: "bg-[#e0f7fa]",
            card: "bg-white/80",
            text: "text-[#00695c]",
            subtext: "text-[#00897b]/60",
            border: "border-[#80cbc4]",
            glow: "shadow-[0_0_30px_rgba(0,150,136,0.15)]",
            accent: "#009688",
            btn: "bg-white border-[#80cbc4]",
            btnText: "text-[#00695c]",
            icon: "text-[#009688]",
            special: "tour_resort"
        },
        tour_adventure: {
            bg: "bg-[#1a0f00]",
            card: "bg-[#2d1a05]/80",
            text: "text-[#ffb74d]",
            subtext: "text-[#ff9800]/50",
            border: "border-[#e65100]/30",
            glow: "shadow-[0_0_40px_rgba(230,81,0,0.2)]",
            accent: "#ff6d00",
            btn: "bg-[#1a0f00] border-[#e65100]/30",
            btnText: "text-[#ffb74d]",
            icon: "text-[#ff9800]",
            special: "tour_adventure"
        },
        tour_yacht: {
            bg: "bg-[#0a1628]",
            card: "bg-[#0d1f3c]/80",
            text: "text-white",
            subtext: "text-[#90caf9]/60",
            border: "border-[#1565c0]/30",
            glow: "shadow-[0_0_40px_rgba(21,101,192,0.2)]",
            accent: "#1976d2",
            btn: "bg-[#0d1f3c] border-[#1565c0]/30",
            btnText: "text-[#90caf9]",
            icon: "text-[#42a5f5]",
            special: "tour_yacht"
        },
        tour_guide: {
            bg: "bg-[#fff8e1]",
            card: "bg-white/80",
            text: "text-[#4e342e]",
            subtext: "text-[#6d4c41]/60",
            border: "border-[#bcaaa4]",
            glow: "shadow-[0_0_20px_rgba(78,52,46,0.08)]",
            accent: "#6d4c41",
            btn: "bg-white border-[#bcaaa4]",
            btnText: "text-[#4e342e]",
            icon: "text-[#8d6e63]",
            special: "tour_guide"
        },
        tour_agency: {
            bg: "bg-[#e8eaf6]",
            card: "bg-white/80",
            text: "text-[#283593]",
            subtext: "text-[#3949ab]/60",
            border: "border-[#9fa8da]",
            glow: "shadow-[0_0_30px_rgba(40,53,147,0.1)]",
            accent: "#3f51b5",
            btn: "bg-white border-[#9fa8da]",
            btnText: "text-[#283593]",
            icon: "text-[#5c6bc0]",
            special: "tour_agency"
        },
        tour_winter: {
            bg: "bg-[#e3f2fd]",
            card: "bg-white/80",
            text: "text-[#0d47a1]",
            subtext: "text-[#1565c0]/60",
            border: "border-[#90caf9]",
            glow: "shadow-[0_0_40px_rgba(13,71,161,0.1)]",
            accent: "#1e88e5",
            btn: "bg-white border-[#90caf9]",
            btnText: "text-[#0d47a1]",
            icon: "text-[#42a5f5]",
            special: "tour_winter"
        }
    };
    const baseTheme = themes[colorScheme as string] || themes.black;
    const isLightBg = checkIfBgIsLight(baseTheme.bg || "");
                      
    const theme = { 
        ...baseTheme, 
        isLight: isLightBg,
        accent: getContrastingAccent(profile.themeColor || baseTheme.accent, isLightBg)
    };

    // Dinamik renk düzeltmeleri (Eğer kullanıcı renk seçmişse)
    if (profile.themeColor) {
        theme.glow = `shadow-[0_0_20px_rgba(${hexToRgb(theme.accent)},0.5)]`;
        theme.icon = `text-[${theme.accent}]`;
        if (theme.btn && theme.btn.includes('border-')) {
             // Opsiyonel: Buton border rengini de dinamik yapabiliriz ama tailwind sınıflarıyla zor.
             // Şimdilik glow ve icon en belirgin olanlar.
        }
    }

    const getDynamicBg = (hex: string) => {
        if (!hex) return '#02040a';
        try {
            const h = hex.replace('#', '');
            const r = parseInt(h.substring(0, 2), 16);
            const g = parseInt(h.substring(2, 4), 16);
            const b = parseInt(h.substring(4, 6), 16);
            return `rgba(${Math.round(r * 0.04)}, ${Math.round(g * 0.04)}, ${Math.round(b * 0.08)}, 1)`;
        } catch (e) {
            return '#02040a';
        }
    };

    // Helper for card background specifically
    const getDynamicCardBg = (hex: string) => {
        if (!hex) return 'rgba(13, 17, 23, 0.9)';
        try {
            const h = hex.replace('#', '');
            const r = parseInt(h.substring(0, 2), 16);
            const g = parseInt(h.substring(2, 4), 16);
            const b = parseInt(h.substring(4, 6), 16);
            return `rgba(${Math.round(r * 0.08)}, ${Math.round(g * 0.08)}, ${Math.round(b * 0.12)}, 0.9)`;
        } catch (e) {
            return 'rgba(13, 17, 23, 0.9)';
        }
    };

    const CraftDecorations = () => {
        switch (theme.special) {
            case "master_plumber":
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 800, opacity: [0, 1, 0] }}
                                transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
                                className="absolute text-blue-400/30"
                                style={{ left: `${Math.random() * 100}%` }}
                            >
                                <Droplets size={24 + Math.random() * 24} />
                            </motion.div>
                        ))}
                    </div>
                );
            case "master_electrician":
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ 
                                    opacity: [0, 0.5, 0],
                                    scale: [0.8, 1.2, 0.8],
                                    rotate: [0, 15, -15, 0]
                                }}
                                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2 + Math.random() * 5 }}
                                className="absolute text-yellow-400/40"
                                style={{ 
                                    top: `${Math.random() * 80}%`, 
                                    left: `${Math.random() * 80}%` 
                                }}
                            >
                                <Zap size={48} />
                            </motion.div>
                        ))}
                    </div>
                );
            case "master_painter":
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-10 blur-3xl overflow-hidden">
                        <div className="absolute top-0 -left-20 w-80 h-80 bg-pink-500 rounded-full" />
                        <div className="absolute top-1/2 -right-20 w-64 h-64 bg-cyan-500 rounded-full" />
                        <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-yellow-500 rounded-full" />
                    </div>
                );
            case "master_carpenter":
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden" 
                         style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 40px)' }} 
                    />
                );
            case "master_auto":
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-20 -right-20 text-zinc-600"
                        >
                            <Settings size={200} />
                        </motion.div>
                        <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute top-40 -left-20 text-zinc-600"
                        >
                            <Settings size={120} />
                        </motion.div>
                    </div>
                );
            case "master_renovation":
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.05] overflow-hidden">
                        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(yellow 1px, transparent 1px), linear-gradient(90deg, yellow 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
                    </div>
                );
            default:
                return null;
        }
    };

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

    const platformButtons = (socialLinks || [])
        .filter((l: any) => l.url && l.platform && l.isHero && l.platform !== 'customLinks' && !['phone', 'whatsapp', 'website', 'location'].includes(l.platform.toLowerCase()))
        .map((l: any) => ({
            label: l.platform ? l.platform.charAt(0).toUpperCase() + l.platform.slice(1) : "Link",
            icon: getHeroIcon(l.platform, 20, l.url),
            href: formatUrl(l.url),
            onClick: () => trackEvent("social_button", l.platform),
            active: true
        }))

    const customButtons = customLinks
        .filter((l: any) => l.isAction)
        .map((l: any) => ({
        label: l.title,
        icon: <Globe size={20} />,
        href: formatUrl(l.url),
        onClick: () => trackEvent("custom_button", l.title),
        active: true
    }))

    const actions = [
        {
            label: t.phoneCallsBtn || "Call",
            icon: <Phone size={20} />,
            href: `tel:${socialLinks.find((l: any) => l.platform === 'phone')?.url || profile.phone}`,
            onClick: () => trackEvent("phone"),
            active: !!(socialLinks.find((l: any) => l.platform === 'phone')?.url || profile.phone)
        },
        {
            label: t.waMessagesBtn || "WhatsApp",
            icon: <MessageCircle size={20} />,
            href: `https://wa.me/${(socialLinks.find((l: any) => l.platform === 'whatsapp')?.url || socialLinks.find((l: any) => l.platform === 'phone')?.url || profile.phone || "").replace(/\D/g, '')}`,
            onClick: () => trackEvent("whatsapp"),
            active: !!(socialLinks.find((l: any) => l.platform === 'whatsapp')?.url || socialLinks.find((l: any) => l.platform === 'phone')?.url || profile.phone)
        },
        {
            label: t.contactMeTitle,
            icon: <MessageSquare size={20} />,
            onClick: () => {
                trackEvent("contact_form")
                setIsLeadModalOpen(true)
            },
            active: true
        },
        { label: t.emailBtn || "E-Mail", icon: <MailWithBadge size={20} />, href: `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.user?.email || ""}`, onClick: () => trackEvent("email"), active: !!profile.user?.email },
        {
            label: t.bookAppointment, icon: <Calendar size={20} />, onClick: () => {
                trackEvent("appointment")
                setIsAppointmentOpen(true)
            }, active: !!profile.showAppointmentBtn
        },
        ...platformButtons,
        ...customButtons,
        { label: t.website, icon: <Globe size={20} />, href: formatUrl(socialLinks.find((l: any) => l.platform === 'website')?.url), onClick: () => trackEvent("website"), active: !!socialLinks.find((l: any) => l.platform === 'website')?.url },
        { label: t.locationsBtn, icon: <MapPin size={20} />, href: formatUrl(socialLinks.find((l: any) => l.platform === 'location')?.url), onClick: () => trackEvent("location"), active: !!socialLinks.find((l: any) => l.platform === 'location')?.url },
    ].filter(a => a.active).filter((v, i, a) => a.findIndex(t => (t.label === v.label || (t.href && v.href && t.href === v.href))) === i);

    return (
        <div 
            className={cn("min-h-screen flex items-center justify-center p-4 relative overflow-hidden", theme.bg !== 'dynamic-bg' ? theme.bg : "", toneStyle.font)}
            style={theme.bg === 'dynamic-bg' ? { backgroundColor: getDynamicBg(theme.accent) } : {}}
        >
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
                {/* Masters & Services Background Decorations */}
                {theme.special === "master_plumber" && (
                    <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 800, opacity: [0, 1, 0] }}
                                transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
                                className="absolute"
                                style={{ left: `${Math.random() * 100}%`, color: theme.accent }}
                            >
                                <Droplets size={24 + Math.random() * 24} />
                            </motion.div>
                        ))}
                    </div>
                )}
                {theme.special === "master_electrician" && (
                    <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ 
                                    opacity: [0, 0.5, 0],
                                    scale: [0.8, 1.2, 0.8],
                                    rotate: [0, 15, -15, 0]
                                }}
                                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2 + Math.random() * 5 }}
                                className="absolute"
                                style={{ 
                                    top: `${Math.random() * 80}%`, 
                                    left: `${Math.random() * 80}%`,
                                    color: theme.accent
                                }}
                            >
                                <Zap size={48} />
                            </motion.div>
                        ))}
                    </div>
                )}
                {theme.special === "master_painter" && (
                    <div className="absolute inset-0 pointer-events-none opacity-10 blur-[80px] overflow-hidden">
                        <div className="absolute top-0 -left-20 w-80 h-80 bg-pink-500 rounded-full" />
                        <div className="absolute top-1/2 -right-20 w-64 h-64 bg-cyan-500 rounded-full" />
                        <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-yellow-500 rounded-full" />
                    </div>
                )}
                {theme.special === "master_carpenter" && (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden" 
                         style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fbbf24 0px, #fbbf24 2px, transparent 2px, transparent 40px)' }} 
                    />
                )}
                {theme.special === "master_auto" && (
                    <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-20 -right-20 text-zinc-600"
                        >
                            <Settings size={200} />
                        </motion.div>
                        <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute top-40 -left-20 text-zinc-600"
                        >
                            <Settings size={120} />
                        </motion.div>
                    </div>
                )}
                {theme.special === "master_renovation" && (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.05] overflow-hidden">
                        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(yellow 1px, transparent 1px), linear-gradient(90deg, yellow 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
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
                    <>
                        {/* Animated Matrix Code Rain Background */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <style>{`
                                @keyframes sw-code-rain {
                                    0% { transform: translateY(-100%); opacity: 0; }
                                    10% { opacity: 1; }
                                    90% { opacity: 0.6; }
                                    100% { transform: translateY(100vh); opacity: 0; }
                                }
                                @keyframes sw-glow-pulse {
                                    0%, 100% { opacity: 0.03; }
                                    50% { opacity: 0.08; }
                                }
                                @keyframes sw-scan-line {
                                    0% { transform: translateY(-100%); }
                                    100% { transform: translateY(100vh); }
                                }
                                @keyframes sw-flicker {
                                    0%, 95%, 100% { opacity: 1; }
                                    96% { opacity: 0.8; }
                                    97% { opacity: 1; }
                                    98% { opacity: 0.6; }
                                }
                                .sw-code-column {
                                    animation: sw-code-rain var(--duration) linear infinite;
                                    animation-delay: var(--delay);
                                }
                            `}</style>
                            {/* Code rain columns */}
                            {Array(15).fill(0).map((_, i) => (
                                <div key={`rain-${i}`} className="absolute top-0 font-mono text-[9px] leading-[1.4] whitespace-pre sw-code-column" style={{
                                    left: `${(i * 7) + Math.random() * 3}%`,
                                    color: `${theme.accent}30`,
                                    '--duration': `${15 + Math.random() * 20}s`,
                                    '--delay': `${-Math.random() * 15}s`,
                                    textShadow: `0 0 8px ${theme.accent}20`
                                } as React.CSSProperties}>
                                    {`const x = 0;
let data = [];
for(i=0;i<n;i++){
  arr.push(i);
}
return result;
if(true) {
  run();
}
`.repeat(8)}
                                </div>
                            ))}
                        </div>
                        {/* Horizontal scan line */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ animation: 'sw-flicker 8s ease-in-out infinite' }}>
                            <div className="absolute left-0 right-0 h-[2px] opacity-[0.06]" style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`, animation: 'sw-scan-line 6s linear infinite' }} />
                        </div>
                        {/* Grid overlay */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `linear-gradient(${theme.accent}15 1px, transparent 1px), linear-gradient(90deg, ${theme.accent}15 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                        {/* Corner terminal decorations */}
                        <div className="absolute top-6 left-6 font-mono text-[9px] pointer-events-none" style={{ color: `${theme.accent}40` }}>
                            <div>┌─── system.init() ───</div>
                            <div>│ status: <span style={{ color: theme.accent }}>online</span></div>
                            <div>│ build: <span className="opacity-50">v3.2.1</span></div>
                            <div>└────────────────────</div>
                        </div>
                        <div className="absolute bottom-6 right-6 font-mono text-[9px] text-right pointer-events-none" style={{ color: `${theme.accent}30` }}>
                            <div>───── EOF ─────┐</div>
                            <div>process.exit(0) │</div>
                            <div>────────────────┘</div>
                        </div>
                        {/* Large glowing accents */}
                        <div className="absolute top-0 left-0 w-[600px] h-[600px] blur-[200px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${theme.accent}12, transparent 70%)`, animation: 'sw-glow-pulse 6s ease-in-out infinite' }} />
                        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] blur-[180px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${theme.accent}0a, transparent 70%)`, animation: 'sw-glow-pulse 8s ease-in-out infinite 2s' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] blur-[150px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, #06b6d408, transparent 70%)`, animation: 'sw-glow-pulse 10s ease-in-out infinite 4s' }} />
                    </>
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

                {/* Turizm & Seyahat Background Effects */}
                {theme.special === "tour_resort" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #e0f7fa 0%, #b2ebf2 30%, #80deea 50%, #4dd0e1 70%, #00acc1 100%)' }} />
                        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(0,150,136,0.4) 0%, transparent 60%), radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.5) 0%, transparent 50%)' }} />
                        {/* Wave effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-[30%] opacity-20 pointer-events-none overflow-hidden">
                            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-[200%] h-full" style={{ fill: '#00695c' }}>
                                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"/>
                                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"/>
                                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"/>
                            </svg>
                        </div>
                        {/* Palm tree patterns */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-[20vw] font-black opacity-[0.03] select-none pointer-events-none text-center whitespace-nowrap uppercase tracking-tighter" style={{ color: theme.accent }}>
                            RESORT
                        </div>
                    </>
                )}
                {theme.special === "tour_adventure" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #1a0f00 0%, #2d1a05 20%, #4a2c0a 40%, #6b3e10 55%, #c4722a 70%, #e8a54c 85%, #f5c76e 100%)' }} />
                        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(255,165,0,0.3) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(139,69,19,0.3) 0%, transparent 50%)' }} />
                        {/* Savanna silhouette */}
                        <div className="absolute bottom-0 left-0 right-0 h-[25%] opacity-10 pointer-events-none">
                            <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full" style={{ fill: '#ff6d00' }}>
                                <path d="M0,200 L0,150 C50,120 80,80 100,60 C110,70 120,90 130,100 C140,90 150,70 160,50 C165,60 170,80 180,90 C200,120 220,140 250,160 L300,170 C320,160 340,130 350,100 C355,110 360,130 370,140 L400,160 L500,170 L600,165 C620,160 640,130 650,80 C655,100 660,120 680,140 L700,150 L800,160 L900,155 C920,140 940,100 950,60 C960,80 970,120 990,140 L1000,155 L1100,165 L1200,160 L1200,200 Z"/>
                            </svg>
                        </div>
                        {/* Dust particles */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-[20vw] font-black opacity-[0.03] select-none pointer-events-none text-center whitespace-nowrap uppercase tracking-tighter" style={{ color: theme.accent }}>
                            SAFARI
                        </div>
                    </>
                )}
                {theme.special === "tour_yacht" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0d2040 25%, #102a55 45%, #1565c0 65%, #1976d2 80%, #42a5f5 95%, #90caf9 100%)' }} />
                        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 60%, rgba(25,118,210,0.4) 0%, transparent 50%)' }} />
                        {/* Ocean wave lines */}
                        <div className="absolute bottom-0 left-0 right-0 h-[40%] opacity-15 pointer-events-none overflow-hidden">
                            <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full">
                                <path d="M0,80 Q150,40 300,80 T600,80 T900,80 T1200,80 L1200,200 L0,200 Z" fill="#90caf9" opacity="0.3"/>
                                <path d="M0,100 Q150,60 300,100 T600,100 T900,100 T1200,100 L1200,200 L0,200 Z" fill="#64b5f6" opacity="0.4"/>
                                <path d="M0,130 Q150,90 300,130 T600,130 T900,130 T1200,130 L1200,200 L0,200 Z" fill="#42a5f5" opacity="0.5"/>
                            </svg>
                        </div>
                        {/* Compass rose */}
                        <div className="absolute top-10 right-10 opacity-[0.06] pointer-events-none">
                            <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="45" stroke="#90caf9" fill="none" strokeWidth="1"/>
                                <circle cx="50" cy="50" r="35" stroke="#90caf9" fill="none" strokeWidth="0.5"/>
                                <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M82 18 L18 82" stroke="#90caf9" strokeWidth="0.5" fill="none"/>
                                <polygon points="50,10 45,50 50,15 55,50" fill="#42a5f5" opacity="0.5"/>
                            </svg>
                        </div>
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-[15vw] font-black opacity-[0.03] select-none pointer-events-none text-center whitespace-nowrap uppercase tracking-tighter" style={{ color: theme.accent }}>
                            YACHTING
                        </div>
                    </>
                )}
                {theme.special === "tour_guide" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #fff8e1 0%, #ffecb3 30%, #ffe082 60%, #ffd54f 85%, #ffca28 100%)' }} />
                        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.6) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(109,76,65,0.15) 0%, transparent 50%)' }} />
                        {/* Map grid pattern */}
                        <div className="absolute inset-0 opacity-[0.06]" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%236d4c41' fill='none' stroke-width='0.5'/%3E%3Cpath d='M50 10 V 90 M 10 50 H 90' stroke='%236d4c41' stroke-width='0.3'/%3E%3Ccircle cx='50' cy='50' r='20' stroke='%236d4c41' fill='none' stroke-width='0.3'/%3E%3C/svg%3E")`,
                            backgroundSize: '120px 120px'
                        }} />
                        {/* Location pins */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-[20vw] font-black opacity-[0.03] select-none pointer-events-none text-center whitespace-nowrap uppercase tracking-tighter" style={{ color: theme.accent }}>
                            GUIDE
                        </div>
                    </>
                )}
                {theme.special === "tour_agency" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 30%, #9fa8da 60%, #7986cb 85%, #5c6bc0 100%)' }} />
                        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.5) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(63,81,181,0.2) 0%, transparent 50%)' }} />
                        {/* World grid */}
                        <div className="absolute inset-0 opacity-[0.06]" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='80' stroke='%233f51b5' fill='none' stroke-width='0.5'/%3E%3Cellipse cx='100' cy='100' rx='80' ry='40' stroke='%233f51b5' fill='none' stroke-width='0.5'/%3E%3Cellipse cx='100' cy='100' rx='40' ry='80' stroke='%233f51b5' fill='none' stroke-width='0.5'/%3E%3Cpath d='M20 100 H 180 M100 20 V 180' stroke='%233f51b5' stroke-width='0.3'/%3E%3C/svg%3E")`,
                            backgroundSize: '200px 200px'
                        }} />
                        {/* Plane trail */}
                        <div className="absolute top-[15%] left-0 right-0 h-[2px] opacity-[0.08] pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, #3f51b5 30%, #3f51b5 70%, transparent)` }} />
                        <div className="absolute top-[15%] right-[15%] opacity-[0.08] pointer-events-none">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="#3f51b5"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                        </div>
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-[20vw] font-black opacity-[0.03] select-none pointer-events-none text-center whitespace-nowrap uppercase tracking-tighter" style={{ color: theme.accent }}>
                            TRAVEL
                        </div>
                    </>
                )}
                {theme.special === "tour_winter" && (
                    <>
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 70%, #42a5f5 85%, #1e88e5 100%)' }} />
                        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.7) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(30,136,229,0.3) 0%, transparent 50%)' }} />
                        {/* Snow mountain silhouette */}
                        <div className="absolute bottom-0 left-0 right-0 h-[35%] opacity-10 pointer-events-none">
                            <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full" style={{ fill: '#0d47a1' }}>
                                <path d="M0,200 L0,160 L100,100 L200,140 L300,60 L400,120 L500,40 L600,100 L700,30 L800,90 L900,50 L1000,110 L1100,70 L1200,130 L1200,200 Z"/>
                            </svg>
                        </div>
                        {/* Snowflakes */}
                        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 5 L20 35 M5 20 L35 20 M9 9 L31 31 M31 9 L9 31' stroke='%231e88e5' fill='none' stroke-width='0.5'/%3E%3Ccircle cx='20' cy='20' r='3' stroke='%231e88e5' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: '50px 50px' }} />
                        {/* Animated snowfall */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {Array(8).fill(0).map((_, i) => (
                                <motion.div
                                    key={`snow-${i}`}
                                    animate={{
                                        y: [-20, 800],
                                        x: [0, i % 2 === 0 ? 30 : -30, 0],
                                        opacity: [0, 0.15, 0]
                                    }}
                                    transition={{ duration: 6 + i * 1.5, repeat: Infinity, delay: i * 0.8, ease: "linear" }}
                                    className="absolute w-2 h-2 rounded-full bg-white"
                                    style={{ left: `${10 + i * 12}%`, top: '-5%' }}
                                />
                            ))}
                        </div>
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-[20vw] font-black opacity-[0.03] select-none pointer-events-none text-center whitespace-nowrap uppercase tracking-tighter" style={{ color: theme.accent }}>
                            WINTER
                        </div>
                    </>
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
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
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
                                        <img src={profile?.user?.image || `https://ui-avatars.com/api/?name=${profile?.user?.name || "User"}`} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <h2 className={cn("text-xl font-black mb-1", theme.text)}>{profile?.user?.name || ""}</h2>
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
                            ...(theme.card === 'dynamic-card' ? { backgroundColor: getDynamicCardBg(theme.accent) } : {}),
                            ...(profile.profileBgImage ? {
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${profile.profileBgImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            } : {})
                        }}
                        className={cn("border p-8 space-y-8 backdrop-blur-2xl shadow-2xl relative transition-all duration-300 ease-out overflow-hidden", (profile.profileBgImage || theme.card === 'dynamic-card') ? "bg-transparent" : theme.card, theme.border, toneStyle.rounded, toneStyle.border)}
                    >
                        {/* CRT Scanline Overlay for Software Theme */}
                        {theme.special === 'software' && (
                            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[100]" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%' }} />
                        )}

                        {/* Floating Buttons: QA (Top Left) & Share (Top Right) */}
                        <div className="absolute top-6 left-6 z-30">
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsQrOpen(true)}
                                className={cn("w-10 h-10 border flex items-center justify-center backdrop-blur-xl transition-all relative group", theme.btn, theme.border, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity animate-pulse" />
                                <QrCode size={18} style={{ color: theme.accent, filter: theme.isLight ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' : 'none' }} />
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
                                <UserPlus size={18} style={{ color: theme.accent, filter: theme.isLight ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' : 'none' }} />
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
                                        <img src={profile?.user?.image || `https://ui-avatars.com/api/?name=${profile?.user?.name || "User"}`} className={cn("w-full h-full object-cover")} loading="lazy" decoding="async" />
                                    )}

                                    {/* Profession Overlays */}
                                    {theme.special === 'software' && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            {/* Glowing border pulse */}
                                            <div className="absolute inset-0 rounded-xl" style={{ boxShadow: `inset 0 0 20px ${theme.accent}15, 0 0 15px ${theme.accent}10` }} />
                                            {/* Terminal tags */}
                                            <div className="absolute -top-1 -left-1 px-1.5 py-0.5 text-[7px] font-mono rounded-sm" style={{ background: `${theme.accent}20`, color: theme.accent, border: `1px solid ${theme.accent}30` }}>&lt;dev&gt;</div>
                                            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[7px] font-mono rounded-sm" style={{ background: `${theme.accent}20`, color: theme.accent, border: `1px solid ${theme.accent}30` }}>&lt;/dev&gt;</div>
                                            {/* Scanning line */}
                                            <div className="absolute inset-x-0 top-0 h-full overflow-hidden rounded-xl">
                                                <div className="w-full h-[1px] animate-pulse" style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}40, transparent)`, animation: 'sw-scan-line 3s linear infinite' }} />
                                            </div>
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
                                    {theme.special === 'software' && <><Code size={20} className="text-emerald-400 animate-pulse" /><span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${theme.accent}15`, color: `${theme.accent}80`, border: `1px solid ${theme.accent}20` }}>DEV</span></>}
                                    {theme.special === 'doctor' && <Shield size={20} className="text-sky-500 opacity-50" />}
                                    {theme.special === 'chef' && <Zap size={20} className="text-orange-500 opacity-50" />}
                                    {theme.special === 'artistic' && <Palette size={20} className="text-pink-500 opacity-50" />}
                                    <h1 className={cn("font-black tracking-tight", theme.text, toneStyle.headerSize)}>{profile.user.name}</h1>
                                    {theme.special === 'realestate' && <Briefcase size={20} className="text-amber-500 opacity-50" />}
                                    {theme.special === 'architect' && <Layers size={20} className="text-sky-500 opacity-50" />}
                                    {theme.special === 'barber' && <Star size={20} className="text-white opacity-50" />}
                                </div>

                                <SocialIconsBar 
                                    profile={profile} 
                                    socialLinks={socialLinks} 
                                    t={t} 
                                    trackEvent={trackEvent} 
                                    getHeroIcon={getHeroIcon} 
                                    formatUrl={formatUrl}
                                    theme={theme}
                                />

                                <div className="flex items-center justify-center gap-2 mt-2 relative">
                                    <div className="h-[1px] w-4 rounded-full opacity-30" style={{ background: theme.accent }} />
                                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80" style={{ color: theme.accent }}>
                                        {translateText(profile.occupation) || "PROFESSIONAL"}
                                        {theme.special === 'software' && <span className="inline-flex items-center ml-1"><span className="w-[6px] h-[14px] inline-block animate-pulse" style={{ background: theme.accent, boxShadow: `0 0 8px ${theme.accent}60` }} /></span>}
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
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            className={cn("w-full max-w-[348px] mx-auto border backdrop-blur-2xl py-7 px-4 sm:px-8 mt-10 relative z-20 overflow-visible group/gallery transition-all duration-700", theme.card, theme.border, toneStyle.rounded)}
                                            style={{ 
                                                backgroundColor: theme.special === 'software' ? '#0d1117' : `${theme.accent}0c`,
                                                borderColor: theme.special === 'software' ? `${theme.accent}30` : `${theme.accent}30`,
                                                boxShadow: theme.special === 'software' ? `0 40px 80px -20px rgba(0,0,0,0.6), 0 0 40px ${theme.accent}15` : `0 30px 70px -15px ${theme.accent}35, inset 0 0 30px ${theme.accent}08`
                                            }}
                                        >
                                            {/* Terminal Header Decoration */}
                                            {theme.special === 'software' && (
                                                <div className="absolute top-0 left-0 right-0 h-6 bg-[#161b22] border-b border-emerald-500/20 rounded-t-xl flex items-center px-3 gap-1.5 pointer-events-none">
                                                    <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                                                    <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                                                    <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                                                    <div className="ml-2 font-mono text-[7px] opacity-40 uppercase tracking-widest text-emerald-500">~/projects - bash</div>
                                                </div>
                                            )}

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
                                                            <motion.div
                                                                key={i}
                                                                onClick={() => {
                                                                    trackEvent("product", project.name);
                                                                    if (project.link) {
                                                                        window.open(formatUrl(project.link), "_blank");
                                                                    } else {
                                                                        setSelectedProject(project);
                                                                    }
                                                                }}
                                                                className={cn("w-14 h-14 border border-white/20 overflow-visible shadow-lg flex-shrink-0 bg-white/10 backdrop-blur-sm p-1 group/prj transition-all hover:scale-110 cursor-pointer block relative", toneStyle.rounded)}
                                                            >
                                                                <img src={project.image} alt={project.name} className={cn("w-full h-full object-cover", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-xl")} loading="lazy" decoding="async" />

                                                                <div
                                                                    className={cn("absolute bottom-[calc(100%+15px)] left-1/2 -translate-x-1/2 opacity-0 group-hover/prj:opacity-100 transition-all duration-300 w-56 border p-4 rounded-2xl text-left pointer-events-none shadow-2xl scale-50 group-hover/prj:scale-100 z-[110] backdrop-blur-2xl bg-black/80")}
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
                                                            </motion.div>
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
                                                            className={cn("aspect-square relative group cursor-pointer overflow-hidden border border-white/10 shadow-lg", toneStyle.rounded)}
                                                            onClick={() => {
                                                                trackEvent("product_grid", project.name);
                                                                if (project.link) {
                                                                    window.open(formatUrl(project.link), "_blank");
                                                                } else {
                                                                    setSelectedProject(project);
                                                                }
                                                            }}
                                                        >
                                                                <img
                                                                    src={project.image}
                                                                    alt={project.name}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-3"
                                                                    loading="lazy"
                                                                    decoding="async"
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
                                        </motion.div>
                                    </div>
                                )}


                                {profile.slogan && (
                                    <p className={cn("font-bold mt-4 opacity-70 italic", !profile.sloganColor && theme.text)}
                                       style={{ 
                                           color: profile.sloganColor || undefined,
                                           fontSize: profile.sloganFontSize || "14px",
                                           fontFamily: profile.sloganFontFamily || "inherit"
                                       }}>
                                        “{translateText(profile.slogan)}”
                                    </p>
                                )}
                            </div>


                            <div className={cn(
                                profile.buttonLayout === 'grid' ? "grid grid-cols-2 gap-3" : 
                                profile.buttonLayout === 'balanced' ? "grid grid-cols-2 gap-3 [&>*:last-child:nth-child(odd)]:col-span-2" : 
                                "space-y-3"
                            )}>
                                {
                                    actions.map((action, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            whileHover={{ scale: 1.02, x: (profile.buttonLayout === 'stack' || !profile.buttonLayout) ? 5 : 0 }}
                                            className="relative group/btn"
                                        >
                                            {action.href ? (
                                                <a
                                                    href={formatUrl(action.href)}
                                                    target="_blank"
                                                    onClick={() => {
                                                        if (action.onClick) action.onClick()
                                                    }}
                                                    className={cn(
                                                        "w-full px-6 border flex items-center gap-4 transition-all shadow-lg cursor-pointer relative overflow-hidden",
                                                        (profile.buttonLayout === 'stack' || !profile.buttonLayout) ? "py-4" : "py-3 flex-col text-center",
                                                        theme.btn, theme.border, 
                                                        profile.buttonShape === 'pill' ? "rounded-full" : 
                                                        profile.buttonShape === 'rounded' ? "rounded-2xl" : 
                                                        profile.buttonShape === 'square' ? "rounded-none" : 
                                                        toneStyle.rounded
                                                    )}
                                                    style={theme.special === 'software' ? {
                                                        backdropFilter: 'blur(16px)',
                                                        background: profile.buttonColor ? `linear-gradient(135deg, ${profile.buttonColor}20, ${profile.buttonColor}10)` : `linear-gradient(135deg, ${theme.accent}08, ${theme.accent}03)`,
                                                        borderColor: profile.buttonColor ? `${profile.buttonColor}40` : `${theme.accent}25`,
                                                        boxShadow: `0 0 0 1px ${theme.accent}08, 0 4px 20px ${theme.accent}06`
                                                    } : {
                                                        backgroundColor: profile.buttonColor ? `${profile.buttonColor}` : undefined,
                                                        borderColor: profile.buttonColor ? `${profile.buttonColor}` : undefined,
                                                        color: profile.buttonColor ? (isDarkColor(profile.buttonColor) ? '#fff' : '#000') : undefined
                                                    }}
                                                >
                                                    {theme.special === 'software' && (
                                                        <>
                                                            <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" style={{ background: profile.buttonColor ? `linear-gradient(135deg, ${profile.buttonColor}20, transparent)` : `linear-gradient(135deg, ${theme.accent}12, transparent)`, boxShadow: `inset 0 0 30px ${theme.accent}08` }} />
                                                            <div className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover/btn:opacity-40 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${profile.buttonColor || theme.accent}, transparent)` }} />
                                                            <span className="absolute left-2 text-[7px] font-mono opacity-0 group-hover/btn:opacity-30 transition-all" style={{ color: profile.buttonColor || theme.accent }}>{'>'}_</span>
                                                        </>
                                                    )}
                                                    <div style={{ color: profile.buttonColor ? (isDarkColor(profile.buttonColor) ? '#fff' : '#000') : theme.accent }} className={cn("relative z-10", (profile.buttonLayout !== 'stack' && profile.buttonLayout) && "scale-110")}>{action.icon}</div>
                                                    <span className={cn(
                                                        "flex-1 font-black text-sm uppercase tracking-widest relative z-10",
                                                        (profile.buttonLayout === 'stack' || !profile.buttonLayout) ? "text-center" : "text-[10px]",
                                                        profile.buttonColor ? (isDarkColor(profile.buttonColor) ? 'text-white' : 'text-black') : theme.btnText, 
                                                        theme.special === 'software' && "font-mono"
                                                    )}>{action.label}</span>
                                                </a>
                                            ) : (
                                                <button
                                                    onClick={action.onClick}
                                                    className={cn(
                                                        "w-full px-6 border flex items-center gap-4 transition-all shadow-lg cursor-pointer relative overflow-hidden",
                                                        (profile.buttonLayout === 'stack' || !profile.buttonLayout) ? "py-4" : "py-3 flex-col text-center",
                                                        theme.btn, theme.border, 
                                                        profile.buttonShape === 'pill' ? "rounded-full" : 
                                                        profile.buttonShape === 'rounded' ? "rounded-2xl" : 
                                                        profile.buttonShape === 'square' ? "rounded-none" : 
                                                        toneStyle.rounded
                                                    )}
                                                    style={theme.special === 'software' ? {
                                                        backdropFilter: 'blur(16px)',
                                                        background: profile.buttonColor ? `linear-gradient(135deg, ${profile.buttonColor}20, ${profile.buttonColor}10)` : `linear-gradient(135deg, ${theme.accent}08, ${theme.accent}03)`,
                                                        borderColor: profile.buttonColor ? `${profile.buttonColor}40` : `${theme.accent}25`,
                                                        boxShadow: `0 0 0 1px ${theme.accent}08, 0 4px 20px ${theme.accent}06`
                                                    } : {
                                                        backgroundColor: profile.buttonColor ? `${profile.buttonColor}` : undefined,
                                                        borderColor: profile.buttonColor ? `${profile.buttonColor}` : undefined,
                                                        color: profile.buttonColor ? (isDarkColor(profile.buttonColor) ? '#fff' : '#000') : undefined
                                                    }}
                                                >
                                                    {theme.special === 'software' && (
                                                        <>
                                                            <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" style={{ background: profile.buttonColor ? `linear-gradient(135deg, ${profile.buttonColor}20, transparent)` : `linear-gradient(135deg, ${theme.accent}12, transparent)`, boxShadow: `inset 0 0 30px ${theme.accent}08` }} />
                                                            <div className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover/btn:opacity-40 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${profile.buttonColor || theme.accent}, transparent)` }} />
                                                            <span className="absolute left-2 text-[7px] font-mono opacity-0 group-hover/btn:opacity-30 transition-all" style={{ color: profile.buttonColor || theme.accent }}>{'>'}_</span>
                                                        </>
                                                    )}
                                                    <div style={{ color: profile.buttonColor ? (isDarkColor(profile.buttonColor) ? '#fff' : '#000') : theme.accent }} className={cn("relative z-10", (profile.buttonLayout !== 'stack' && profile.buttonLayout) && "scale-110")}>{action.icon}</div>
                                                    <span className={cn(
                                                        "flex-1 font-black text-sm uppercase tracking-widest relative z-10",
                                                        (profile.buttonLayout === 'stack' || !profile.buttonLayout) ? "text-center" : "text-[10px]",
                                                        profile.buttonColor ? (isDarkColor(profile.buttonColor) ? 'text-white' : 'text-black') : theme.btnText, 
                                                        theme.special === 'software' && "font-mono"
                                                    )}>{action.label}</span>
                                                </button>
                                            )}
                                        </motion.div>
                                    ))
                                }
                            </div>

                            {/* Bio */}
                            {
                                profile.bio && (
                                    <div className="relative pt-4">
                                        {theme.special === 'software' && (
                                            <div className="mb-2 flex items-center gap-2 opacity-50 px-4">
                                                <div className="h-[1px] flex-1 bg-emerald-500/30" />
                                                <span className="font-mono text-[8px] text-emerald-500">cat README.md</span>
                                                <div className="h-[1px] w-4 bg-emerald-500/30" />
                                            </div>
                                        )}
                                        <p className={cn("text-center font-medium leading-relaxed px-4", !profile.bioColor && theme.subtext, theme.special === 'software' && "font-mono text-emerald-400/80 text-left")}
                                           style={{ 
                                               color: profile.bioColor || undefined,
                                               fontSize: profile.bioFontSize || "12px",
                                               fontFamily: profile.bioFontFamily || "inherit"
                                           }}>
                                            {theme.special === 'software' ? `> ${profile.bio}` : profile.bio}
                                        </p>
                                    </div>
                                )
                            }


                            {/* Testimonials */}
                            <div className="pt-6 overflow-hidden relative group/reviews">
                                <div className="flex items-center justify-between mb-6 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 rounded-full" style={{ background: theme.accent }} />
                                        <h3 className={cn("text-[11px] font-black uppercase tracking-[0.25em] opacity-50", theme.text)}>
                                            {theme.special === 'software' ? '/* feedback.log */' : t.reviews}
                                        </h3>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsReviewModalOpen(true)}
                                        className={cn("text-[10px] font-black uppercase tracking-widest px-4 py-2 border backdrop-blur-md transition-all flex items-center gap-2", theme.btn, toneStyle.rounded)}
                                        style={{ color: theme.accent, borderColor: `${theme.accent}40` }}
                                    >
                                        <Plus size={12} />
                                        {t.writeReview}
                                    </motion.button>
                                </div>

                                <div className="relative min-h-[160px]">
                                    {reviews.length > 0 ? (
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentReviewIndex}
                                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                                className={cn("absolute inset-0 p-6 border flex flex-col backdrop-blur-2xl shadow-2xl relative overflow-hidden", theme.card, theme.border, toneStyle.rounded)}
                                                style={{ 
                                                    boxShadow: theme.special === 'software' ? `0 20px 50px -12px rgba(0,0,0,0.5), inset 0 0 40px ${theme.accent}05` : `0 20px 50px -12px rgba(0,0,0,0.5), 0 0 20px ${theme.accent}10`,
                                                    backgroundColor: theme.special === 'software' ? '#0d1117' : undefined
                                                }}
                                            >
                                                {/* Review Terminal Header */}
                                                {theme.special === 'software' && (
                                                    <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/20" />
                                                )}
                                                {/* Decorative Quote Icon */}
                                                <div className="absolute top-4 right-6 opacity-5 pointer-events-none">
                                                    <Quote size={64} style={{ color: theme.accent }} />
                                                </div>

                                                <div className="flex gap-5 relative z-10">
                                                    <div className="relative">
                                                        <div className={cn("w-14 h-14 border-2 p-1 overflow-hidden flex items-center justify-center relative z-10 bg-black/20", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")} style={{ borderColor: `${theme.accent}30` }}>
                                                                <img
                                                                    src={reviews[currentReviewIndex].image?.includes('avatar.iran.liara.run') ? `https://ui-avatars.com/api/?name=${encodeURIComponent(reviews[currentReviewIndex].name)}&background=1a1a2e&color=e94560&bold=true&size=128` : (reviews[currentReviewIndex].image || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviews[currentReviewIndex].name)}&background=1a1a2e&color=e94560&bold=true&size=128`)}
                                                                    className="w-full h-full object-cover rounded-xl"
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                    onError={(e: any) => {
                                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reviews[currentReviewIndex].name)}&background=1a1a2e&color=e94560&bold=true&size=128`;
                                                                }}
                                                                alt={reviews[currentReviewIndex].name}
                                                            />
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center z-20">
                                                            <Check size={10} className="text-white" />
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <div className="overflow-hidden">
                                                                <h4 className={cn("text-sm font-black truncate", theme.text, theme.special === 'software' && "font-mono text-emerald-300")}>
                                                                    {theme.special === 'software' ? `// @${reviews[currentReviewIndex].name.toLowerCase().replace(/\s+/g, '_')}` : reviews[currentReviewIndex].name}
                                                                </h4>
                                                                <p className={cn("text-[10px] opacity-40 font-bold truncate tracking-tight uppercase", theme.text, theme.special === 'software' && "font-mono")}>
                                                                    {theme.special === 'software' ? `[${translateText(reviews[currentReviewIndex].title) || 'TESTIMONIAL'}]` : translateText(reviews[currentReviewIndex].title)}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-0.5 bg-black/20 px-2 py-1 rounded-lg backdrop-blur-md">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={10} className={i < reviews[currentReviewIndex].rating ? "fill-current text-amber-400" : "text-white/10"} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="relative mt-3">
                                                            <p className={cn("text-xs leading-relaxed italic opacity-90 line-clamp-3", theme.special === 'software' ? "font-mono text-emerald-400/70" : theme.text)}>
                                                                {theme.special === 'software' ? '/*' : '“'}{translateText(reviews[currentReviewIndex].content)}{theme.special === 'software' ? ' */' : '”'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    ) : (
                                        <div className={cn("absolute inset-0 p-8 border flex items-center justify-center italic opacity-40 text-xs text-center backdrop-blur-xl", theme.card, theme.border, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-[2rem]")}>
                                            <div className="flex flex-col items-center gap-3">
                                                <MessageSquare className="opacity-20" size={32} />
                                                {t.noReviewsYet}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination Dots */}
                                <div className="flex justify-center gap-2 mt-6">
                                    {reviews.map((_: any, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentReviewIndex(i)}
                                            className="h-1.5 transition-all outline-none"
                                            style={{
                                                width: i === currentReviewIndex ? '24px' : '6px',
                                                background: i === currentReviewIndex ? theme.accent : 'rgba(255,255,255,0.1)',
                                                borderRadius: '99px',
                                                boxShadow: i === currentReviewIndex ? `0 0 10px ${theme.accent}40` : 'none'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>





                            {
                                profile.paymentLink && (
                                    <div className="pt-8 w-full max-w-[340px] mx-auto">
                                        <motion.a
                                            href={formatUrl(profile.paymentLink)}
                                            target="_blank"
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                "w-full py-4.5 px-6 flex items-center justify-between font-black text-[11px] uppercase tracking-[0.25em] transition-all relative overflow-hidden group border-2 shadow-2xl",
                                                toneStyle.rounded
                                            )}
                                            style={{
                                                backgroundColor: `${theme.accent}15`,
                                                borderColor: `${theme.accent}40`,
                                                color: theme.text === "text-white" ? "#fff" : theme.accent,
                                                boxShadow: `0 20px 40px -15px ${theme.accent}30, inset 0 0 20px ${theme.accent}10`
                                            }}
                                            onClick={() => trackEvent("payment_click")}
                                        >
                                            {/* Modern Animated Glow Background */}
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                style={{
                                                    background: `radial-gradient(circle at center, ${theme.accent}20 0%, transparent 70%)`
                                                }}
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                                            <div className="flex items-center gap-4 relative z-10">
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md border transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                                                    style={{
                                                        backgroundColor: `${theme.accent}25`,
                                                        borderColor: `${theme.accent}50`,
                                                        color: theme.accent
                                                    }}
                                                >
                                                    {profile.paymentType === 'consulting' ? <Briefcase size={20} fill={`${theme.accent}33`} /> :
                                                        profile.paymentType === 'support' ? <Heart size={20} fill={`${theme.accent}33`} /> :
                                                            profile.paymentType === 'pay' ? <CreditCard size={20} fill={`${theme.accent}33`} /> :
                                                                <Coffee size={20} fill={`${theme.accent}33`} />}
                                                </div>
                                                <div className="flex flex-col items-start gap-0.5">
                                                    <span className="opacity-40 text-[7px] font-black tracking-[0.4em]">
                                                        {profile.paymentType === 'consulting' ? "PROFESSIONAL" :
                                                            profile.paymentType === 'support' ? "CONTRIBUTION" :
                                                                profile.paymentType === 'pay' ? "TRANSACTION" :
                                                                    "APPRECIATION"}
                                                    </span>
                                                    <span className="drop-shadow-sm text-sm">
                                                        {profile.paymentType === 'consulting' ? t.consultingBtn :
                                                            profile.paymentType === 'support' ? t.supportBtn :
                                                                profile.paymentType === 'pay' ? t.payBtn :
                                                                    t.coffeeBtn}
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center border transition-all group-hover:bg-white/10 relative z-10"
                                                style={{ borderColor: `${theme.accent}30` }}
                                            >
                                                <Zap
                                                    size={16}
                                                    className="group-hover:animate-pulse"
                                                    style={{ color: theme.accent }}
                                                    fill={theme.accent}
                                                />
                                            </div>
                                        </motion.a>
                                    </div>
                                )
                            }

                            <div className="pt-10 border-t border-white/5 text-center flex flex-col gap-6">
                                <div className="flex items-stretch gap-3">
                                    <button
                                        onClick={handleShare}
                                        className={cn("flex-1 h-[60px] border flex items-center justify-center gap-2.5 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-white/10 active:translate-y-[4px] active:shadow-none backdrop-blur-xl", theme.border, theme.text, toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                                        style={{ 
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            boxShadow: '0 4px 0 0 rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        <Share2 size={16} style={{ color: theme.accent }} /> {t.shareLabel}
                                    </button>

                                    <button
                                        onClick={handleCVView}
                                        className={cn("flex-[1.5] h-[60px] flex items-center justify-center gap-2.5 font-black text-[10px] uppercase tracking-[0.15em] transition-all hover:brightness-110 active:translate-y-[4px] active:shadow-none shadow-xl", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                                        style={{
                                            background: `linear-gradient(135deg, ${(theme as any).cvAccent || theme.accent}, ${(theme as any).cvAccent || theme.accent}cc)`,
                                            boxShadow: `0 4px 0 0 ${(theme as any).cvAccent || theme.accent}66, 0 12px 24px -10px ${(theme as any).cvAccent || theme.accent}70`,
                                            color: isDarkColor((theme as any).cvAccent || theme.accent) ? '#ffffff' : '#1a1a1a'
                                        }}
                                    >
                                        <FileText size={16} /> {profile.isCatalog ? t.viewCatalog : t.viewCV}
                                    </button>

                                    {/* Sabit AI Assistant Butonu */}
                                    {aiConfig?.isEnabled && (
                                        <button
                                            onClick={() => setIsAIChatOpen(true)}
                                            className={cn("w-[62px] h-[60px] flex-shrink-0 flex items-center justify-center shadow-xl transition-all hover:brightness-110 active:translate-y-[4px] active:shadow-none", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-2xl")}
                                            style={{
                                                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)`,
                                                boxShadow: `0 4px 0 0 ${theme.accent}66, 0 12px 24px -10px ${theme.accent}70`,
                                                color: isDarkColor(theme.accent) ? '#ffffff' : '#1a1a1a'
                                            }}
                                            title={aiConfig.assistantName}
                                        >
                                            <Bot size={24} />
                                        </button>
                                    )}
                                </div>

                                 {/* Widget Dock - Daha Estetik ve Derli Toplu */}
                                 {!isEmbedMode && profile.blocks?.filter((b: any) => b.type === 'external_widget').length > 0 && (
                                     <div className={cn("p-2 bg-white/[0.03] border border-white/5 backdrop-blur-2xl flex flex-wrap justify-center gap-2.5", toneStyle.rounded === "rounded-none" ? "rounded-none" : "rounded-3xl")}>
                                         {profile.blocks?.filter((b: any) => b.type === 'external_widget').map((block: any) => (
                                             <ExternalWidget key={block.id} block={block} theme={theme} toneStyle={toneStyle} t={t} className="w-[54px] h-[54px] flex-shrink-0" isMini={true} />
                                         ))}
                                     </div>
                                 )}
                             </div>
                         </div>
                     </motion.div>
                 )}
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
                profileName={profile?.user?.name || ""}
            />

            <SocialProof t={t} theme={theme} />

            <AnimatePresence>
                {reviewStatus && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={cn("fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] backdrop-blur-2xl px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 border transition-all", theme.card, theme.border)}
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
                        className={cn("fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] backdrop-blur-2xl px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 border transition-all", theme.card, theme.border)}
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
                        className={cn("fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] backdrop-blur-2xl px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 border transition-all", theme.card, theme.border)}
                    >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
                            <CheckCircle2 size={14} />
                        </div>
                        <span className={theme.text}>{t.copiedLabel}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <SocialProof t={t} theme={theme} />

            <CVPreviewModal 
                isOpen={isCVModalOpen} 
                onClose={() => setIsCVModalOpen(false)} 
                url={cvViewUrl} 
                theme={theme} 
                t={t} 
                toneStyle={toneStyle} 
                profile={profile}
            />
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

function EliteModernTemplate({ profile, colorScheme, handleShare, handleCVView, handleAddToContacts, reviews, isReviewModalOpen, setIsReviewModalOpen, setIsAppointmentOpen, isAppointmentOpen, t, trackEvent, tone, setReviewStatus, reviewStatus, setIsQrOpen, lang, setLang, isWalletModalOpen, setIsWalletModalOpen, qrDataUrl, isQrOpen, toneStyle, copied, setIsLeadModalOpen, isLeadModalOpen, setLeadStatus, leadStatus, isAIChatOpen, setIsAIChatOpen, chatMessages, setChatMessages, aiConfig, isEmbedMode, translateText, isCVModalOpen, setIsCVModalOpen, cvViewUrl, selectedProject, setSelectedProject, setCurrentArticle, isArticleOpen, setIsArticleOpen }: any) {
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
    const [layoutMode, setLayoutMode] = useState<'marquee' | 'grid'>('grid')

    const getIcon = (title: string = "") => {
        const t = (title || "").toLowerCase();
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
        elite_pink: {
            header: "bg-gradient-to-r from-[#ec4899] to-[#fb923c]",
            body: "bg-white",
            btn: "bg-slate-900",
            btnText: "text-white",
            card: "bg-slate-50",
            text: "text-slate-900",
            accent: "#ec4899",
            glow: "shadow-[0_0_20px_rgba(236,72,153,0.3)]"
        },
        elite_blue: {
            header: "bg-gradient-to-r from-[#06b6d4] to-[#3b82f6]",
            body: "bg-white",
            btn: "bg-slate-900",
            btnText: "text-white",
            card: "bg-slate-50",
            text: "text-slate-900",
            accent: "#3b82f6",
            glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        },
        elite_purple: {
            header: "bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]",
            body: "bg-white",
            btn: "bg-slate-900",
            btnText: "text-white",
            card: "bg-slate-50",
            text: "text-slate-900",
            accent: "#a855f7",
            glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        },
        elite_emerald: {
            header: "bg-gradient-to-r from-[#10b981] to-[#3b82f6]",
            body: "bg-white",
            btn: "bg-slate-900",
            btnText: "text-white",
            card: "bg-slate-50",
            text: "text-slate-900",
            accent: "#10b981",
            glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        },
        elite_sunset: {
            header: "bg-gradient-to-r from-[#f59e0b] to-[#ef4444]",
            body: "bg-white",
            btn: "bg-slate-900",
            btnText: "text-white",
            card: "bg-slate-50",
            text: "text-slate-900",
            accent: "#f59e0b",
            glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        }
    };

    const baseTheme = themes[colorScheme] || themes.elite_pink;
    const isLightBg = true; // Elite themes are always light in this template
    const theme = { 
        ...baseTheme, 
        isLight: isLightBg,
        accent: getContrastingAccent(profile.themeColor || baseTheme.accent, isLightBg)
    };

    // Dinamik renk düzeltmeleri (Eğer kullanıcı renk seçmişse)
    if (profile.themeColor) {
        theme.headerStyle = { background: `linear-gradient(to right, ${theme.accent}, ${theme.accent}dd)` };
        theme.glow = `shadow-[0_0_20px_rgba(${hexToRgb(theme.accent)},0.3)]`;
    }
    const socialLinks = profile.socialLinks || [];

    const formatUrl = (url?: string) => {
        if (!url) return "";
        const trimmed = url.trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('tel:') || trimmed.startsWith('mailto:')) return trimmed;
        return `https://${trimmed}`;
    };

    const customLinksEntry = (socialLinks || []).find((l: any) => l.platform === 'customLinks');
    const customLinks = customLinksEntry?.links || [];

    const otherSocialActions = (socialLinks || [])
        .filter((l: any) => l.url && l.platform && l.isHero && l.platform !== 'customLinks' && !['phone', 'whatsapp', 'website', 'location'].includes(l.platform.toLowerCase()))
        .map((l: any) => ({
            label: l.platform ? l.platform.charAt(0).toUpperCase() + l.platform.slice(1) : "Link",
            icon: getHeroIcon(l.platform, 18, l.url),
            href: formatUrl(l.url),
            onClick: () => trackEvent("social_button", l.platform),
            active: true
        }))

    const customButtons = customLinks
        .filter((l: any) => l.isAction)
        .map((l: any) => ({
        label: l.title,
        icon: <Globe size={18} />,
        href: formatUrl(l.url),
        onClick: () => trackEvent("custom_button", l.title),
        active: true
    }))

    const actionButtons = [
        {
            label: t.phoneCallsBtn || "ARA",
            icon: <Phone size={profile.buttonLayout === 'stack' ? 24 : 18} />,
            href: `tel:${socialLinks.find((l: any) => l.platform === 'phone')?.url || profile.phone}`,
            onClick: () => trackEvent("phone"),
            active: !!(socialLinks.find((l: any) => l.platform === 'phone')?.url || profile.phone),
            color: profile.buttonColor || "rgb(15, 23, 42)"
        },
        {
            label: t.waMessagesBtn || "WHATSAPP",
            icon: <MessageCircle size={profile.buttonLayout === 'stack' ? 24 : 18} />,
            href: `https://wa.me/${(socialLinks.find((l: any) => l.platform === 'whatsapp')?.url || socialLinks.find((l: any) => l.platform === 'phone')?.url || profile.phone || "").replace(/\D/g, '')}`,
            onClick: () => trackEvent("whatsapp"),
            active: !!(socialLinks.find((l: any) => l.platform === 'whatsapp')?.url || socialLinks.find((l: any) => l.platform === 'phone')?.url || profile.phone),
            color: profile.buttonColor || theme.accent
        },
        {
            label: t.contactMeTitle || "İLETİŞİME GEÇ",
            icon: <MessageSquare size={profile.buttonLayout === 'stack' ? 18 : 16} />,
            onClick: () => {
                trackEvent("contact_form");
                setIsLeadModalOpen(true);
            },
            active: true
        },
        {
            label: t.emailBtn || "E-MAIL",
            icon: <MailWithBadge size={profile.buttonLayout === 'stack' ? 18 : 16} />,
            href: `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.user?.email || ""}`,
            onClick: () => trackEvent("email"),
            active: !!profile.user?.email
        },
        ...otherSocialActions,
        ...customButtons,
        {
            label: t.website || "WEB SİTE",
            icon: <Globe size={profile.buttonLayout === 'stack' ? 18 : 16} />,
            href: formatUrl(socialLinks.find((l: any) => l.platform === 'website')?.url),
            onClick: () => trackEvent("website"),
            active: !!socialLinks.find((l: any) => l.platform === 'website')?.url
        },
        {
            label: t.locationsBtn || "KONUM",
            icon: <MapPin size={profile.buttonLayout === 'stack' ? 18 : 16} />,
            href: formatUrl(socialLinks.find((l: any) => l.platform === 'location')?.url),
            onClick: () => trackEvent("location"),
            active: !!socialLinks.find((l: any) => l.platform === 'location')?.url
        },
    ].filter(a => a.active).filter((v, i, a) => a.findIndex(t => (t.label === v.label || (t.href && v.href && t.href === v.href))) === i);

    return (
        <div className={cn("min-h-screen pb-40 relative overflow-x-hidden", theme.body, toneStyle.font)}>
            {/* Top Navigation Icons */}
            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
                <button onClick={() => setIsQrOpen(true)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg">
                    <QrCode size={18} />
                </button>
                <div className="flex gap-3">
                    <button onClick={() => setIsWalletModalOpen(true)} className="w-10 h-10 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center text-white/80">
                        <UserPlus size={18} />
                    </button>
                    <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="w-10 h-10 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center text-white/80 font-black text-[10px]">
                        {lang.toUpperCase()}
                    </button>
                </div>
            </div>

            {/* Header Curve */}
            <div 
                className={cn("relative h-64 sm:h-80 w-full overflow-hidden", !profile.themeColor && theme.header)}
                style={theme.headerStyle}
            >
                <div className="absolute inset-0 bg-black/10" />
                <svg className="absolute bottom-[-1px] w-full h-24 text-white fill-current" preserveAspectRatio="none" viewBox="0 0 1440 320">
                    <path d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,192C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>

            {/* Main Content */}
            <main className="max-w-md mx-auto px-6 -mt-32 relative z-10 flex flex-col items-center w-full">
                <MotionWrapper style="3d-manual">
                    <div className="flex flex-col items-center w-full">
                        {/* Avatar with Glow and Floating Expertise Icons */}
                        <div className="relative">
                            {toneStyle.expertiseStyle !== 'minimal' && (
                                <motion.div
                                    className="absolute inset-0 z-20 pointer-events-none"
                                    animate={toneStyle.expertiseStyle === 'slow-rotate' ? { rotate: 360 } : toneStyle.expertiseStyle === 'scattered' ? { rotate: [0, 10, -10, 0] } : { rotate: 360 }}
                                    transition={toneStyle.expertiseStyle === 'slow-rotate' ? { duration: 120, repeat: Infinity, ease: "linear" } : toneStyle.expertiseStyle === 'scattered' ? { duration: 10, repeat: Infinity } : { duration: 60, repeat: Infinity, ease: "linear" }}
                                >
                                    {(profile.services || []).slice(0, 6).map((service: any, i: number, arr: any[]) => {
                                        const angle = (i * (360 / arr.length) - 90) * (Math.PI / 180);
                                        const radius = 100; // Increased radius for Elite avatar size
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
                                                    className={cn("w-10 h-10 glass border border-slate-200/50 flex items-center justify-center shadow-lg transition-all hover:scale-125 hover:border-slate-300 hover:bg-white/90 relative rounded-full")}
                                                    style={{
                                                        color: theme.accent,
                                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                >
                                                    {getIcon(service.title)}

                                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-all duration-300 whitespace-nowrap bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-800 pointer-events-none border border-slate-100 shadow-xl scale-50 group-hover/icon:scale-100 z-50 uppercase tracking-widest">
                                                        {translateText(service.title)}
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={cn("w-40 h-40 rounded-full bg-white p-2 shadow-2xl relative z-10", theme.glow)}
                            >
                                <img src={profile.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.user.name)}&background=0d0d0e&color=fff&size=128`} className="w-full h-full object-cover rounded-full" alt={profile.user.name} loading="lazy" decoding="async" />
                            </motion.div>
                        </div>

                        {/* Profile Information */}
                        <div className="text-center mt-6 space-y-1">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                                <Sparkles size={18} style={{ color: theme.accent }} /> {profile.user.name}
                            </h1>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                <span className="w-6 h-[1px] bg-slate-200"></span>
                                {translateText(profile.occupation)}
                                <span className="w-6 h-[1px] bg-slate-200"></span>
                            </p>
                            {profile.slogan && (
                                <p className="font-medium mt-3 max-w-[280px] mx-auto italic leading-relaxed px-4"
                                   style={{ 
                                       color: profile.sloganColor || "rgb(100, 116, 139)",
                                       fontSize: profile.sloganFontSize || "11px",
                                       fontFamily: profile.sloganFontFamily || "inherit"
                                   }}>
                                    "{translateText(profile.slogan)} 🚀"
                                </p>
                            )}
                            <SocialIconsBar 
                                profile={profile} 
                                socialLinks={socialLinks} 
                                t={t} 
                                trackEvent={trackEvent} 
                                getHeroIcon={getHeroIcon} 
                                formatUrl={formatUrl}
                                theme={theme}
                            />
                        </div>
                    </div>
                </MotionWrapper>


                {/* Unified Action Grid */}
                <div className={cn(
                    "w-full mt-10",
                    profile.buttonLayout === 'grid' ? "grid grid-cols-2 gap-4" : 
                    profile.buttonLayout === 'balanced' ? "grid grid-cols-2 gap-4 [&>*:last-child:nth-child(odd)]:col-span-2" : 
                    "space-y-4"
                )}>
                    {actionButtons.map((action, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                if (action.onClick) action.onClick();
                                if (action.href) window.location.href = action.href;
                            }}
                            style={{ 
                                backgroundColor: action.color || (profile.buttonColor ? profile.buttonColor : theme.accent),
                                color: (action.color || profile.buttonColor) ? (isDarkColor(action.color || profile.buttonColor) ? '#fff' : '#000') : '#fff'
                            }}
                            className={cn(
                                "flex items-center transition-all shadow-xl",
                                (profile.buttonLayout === 'stack' || !profile.buttonLayout) ? "py-6 px-10 rounded-[2rem] gap-6" : "py-7 flex-col text-center justify-center gap-3 rounded-[2rem]",
                                profile.buttonShape === 'pill' ? "rounded-full" : 
                                profile.buttonShape === 'rounded' ? "rounded-2xl" : 
                                profile.buttonShape === 'square' ? "rounded-none" : ""
                            )}
                        >
                            <span className={cn(
                                "p-3 bg-white/10 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform",
                                (profile.buttonLayout === 'stack' || !profile.buttonLayout) ? "" : "scale-110"
                            )}>
                                {action.icon}
                            </span>
                            <span className={cn(
                                "font-black uppercase tracking-widest",
                                (profile.buttonLayout === 'stack' || !profile.buttonLayout) ? "text-xs flex-1 text-center" : "text-[10px]"
                            )}>{action.label}</span>
                        </motion.button>
                    ))}
                </div>

                 {/* Widget Dock - Elite Style */}
                 {!isEmbedMode && profile.blocks?.filter((b: any) => b.type === 'external_widget').length > 0 && (
                     <div className="w-full mt-6 p-4 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex flex-wrap justify-center gap-3">
                         {profile.blocks?.filter((b: any) => b.type === 'external_widget').map((block: any) => (
                             <ExternalWidget key={block.id} block={block} theme={theme} toneStyle={toneStyle} t={t} className="w-[60px] h-[60px] flex-shrink-0" isMini={true} />
                         ))}
                     </div>
                 )}

                {/* Bio Section */}
                {profile.bio && (
                    <div className="w-full mt-12 px-4 text-center">
                        <p className="leading-relaxed font-medium opacity-80 whitespace-pre-wrap"
                           style={{ 
                               color: profile.bioColor || "rgb(100, 116, 139)",
                               fontSize: profile.bioFontSize || "12px",
                               fontFamily: profile.bioFontFamily || "inherit"
                           }}>
                            {profile.bio}
                        </p>
                    </div>
                )}

                {/* Expertise Areas (Services) */}
                {profile.services && profile.services.length > 0 && (
                    <div className="w-full mt-12 space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <span className="w-1 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.servicesTitle || "UZMANLIK ALANLARI"}</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {profile.services.map((service: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-start gap-4 group hover:bg-white hover:shadow-xl transition-all"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <Award size={18} style={{ color: theme.accent }} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-black text-slate-900 mb-1">{service.title}</h4>
                                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{service.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Section */}
                {profile.products && profile.products.filter((p: any) => p.image).length > 0 && (
                    <div className="w-full mt-24 space-y-8">
                        <div className="flex items-center justify-between px-2">
                             <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.myProjects || "PROJELER"}</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {(profile.products || []).filter((p: any) => p.image).map((project: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -5 }}
                                    className={cn("bg-white overflow-hidden shadow-xl border transition-all duration-500 group cursor-pointer", toneStyle.rounded)}
                                    style={{ 
                                        borderColor: `${theme.accent}15`,
                                        boxShadow: `0 20px 40px -15px ${theme.accent}25`
                                    }}
                                    onClick={() => {
                                        trackEvent("product_grid", project.name);
                                        if (project.link) {
                                            window.open(formatUrl(project.link), "_blank");
                                        } else {
                                            setSelectedProject(project);
                                        }
                                    }}
                                >
                                    <div className="aspect-video relative overflow-hidden">
                                        <img src={project.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" decoding="async" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                                            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                                <span className="text-[10px] font-black text-white">{project.price > 0 ? `${project.price} ₺` : "PROJE"}</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg transform translate-y-20 group-hover:translate-y-0 transition-all duration-300">
                                                <ExternalLink size={16} className="text-slate-900" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-sm font-black text-slate-900 mb-2">{project.name}</h4>
                                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">{project.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                {reviews.length > 0 && (
                    <div className="w-full mt-12 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <span className="w-1 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.reviewsTitle}</h3>
                            </div>
                            <button onClick={() => setIsReviewModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-[8px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                                <Plus size={10} /> {t.writeReview}
                            </button>
                        </div>
                        <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 relative group overflow-hidden">
                            <Quote className="absolute top-10 right-6 opacity-[0.03] text-slate-900 group-hover:scale-110 transition-transform" size={80} />
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={reviews[0]?.name || 'review'}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4 relative z-10"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-1 shadow-sm">
                                            <img src={reviews[0]?.image} className="w-full h-full object-cover rounded-xl" loading="lazy" decoding="async" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-[11px] font-black text-slate-900">{reviews[0]?.name}</h4>
                                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{reviews[0]?.title || "Müşteri"}</p>
                                        </div>
                                        <div className="flex gap-0.5 text-amber-400">
                                            {[...Array(5)].map((_, j) => <Star key={j} size={10} fill={j < (reviews[0]?.rating || 5) ? "currentColor" : "none"} />)}
                                        </div>
                                    </div>
                                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic">"{reviews[0]?.content}"</p>
                                    {reviews[0]?.isVerified && (
                                        <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-emerald-500 pt-2">
                                            <CheckCircle2 size={12} /> DOĞRULANMIŞ GÖRÜŞ
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Horizontal Social Row */}


                {/* Main CTA Button */}
                {profile.showAppointmentBtn && (
                    <motion.button
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsAppointmentOpen(true)}
                        className="w-full mt-12 py-6 rounded-[2.5rem] bg-slate-900 text-white font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Briefcase size={20} />
                        </div>
                        <span className="flex-1 text-center pr-10">{t.bookAppointment || "DANIŞMANLIK AL"}</span>
                        <Zap size={18} className="text-amber-400 animate-pulse" />
                    </motion.button>
                )}

                {/* Footer Logo */}
                <div className="py-16 opacity-30 hover:opacity-100 transition-opacity">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
                            <Layout className="text-white w-3 h-3" />
                        </div>
                        <span className="text-sm font-black tracking-tighter">Kardly<span className="text-rose-500">.site</span></span>
                    </Link>
                </div>

                {/* Articles Module */}
                <ArticlesSection 
                    articles={profile?.articles || []} 
                    t={t} 
                    theme={theme} 
                    setCurrentArticle={setCurrentArticle} 
                    setIsArticleOpen={setIsArticleOpen} 
                    trackEvent={trackEvent} 
                />

            </main>

            {/* Sticky Bottom Footer Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[360px] px-6 z-[100]">
                <div className="bg-white/90 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-2.5">
                    <button
                        onClick={handleShare}
                        className="flex-1 h-[60px] flex items-center justify-center gap-2 rounded-[2rem] bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-100 transition-all border border-slate-100 active:translate-y-[4px] active:shadow-none shadow-[0_4px_0_0_#e2e8f0]"
                    >
                        <Share2 size={14} /> {t.shareLabel || "PAYLAŞ"}
                    </button>
                    <button
                        onClick={handleCVView}
                        className={cn("flex-[1.5] h-[60px] flex items-center justify-center gap-2 rounded-[2rem] bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white hover:bg-black transition-all active:translate-y-[4px] active:shadow-none shadow-[0_4px_0_0_#0f172a]")}
                    >
                        <FileText size={16} /> {profile?.isCatalog ? (t.viewCatalog || "KATALOG GÖRÜNTÜLE") : (t.viewCV || "CV GÖRÜNTÜLE")}
                    </button>
                    {aiConfig?.isEnabled && (
                        <button
                            onClick={() => setIsAIChatOpen(true)}
                            className="w-[60px] h-[60px] rounded-full bg-slate-900 text-white flex items-center justify-center transition-all active:translate-y-[4px] active:shadow-none shadow-[0_4px_0_0_#0f172a] hover:brightness-110"
                            title={aiConfig?.assistantName || "AI Assistant"}
                        >
                            <Bot size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Components & Modals */}
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
            <QrModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} theme={theme} profile={profile} t={t} />
            <LeadModal 
                isOpen={isLeadModalOpen} 
                onClose={() => setIsLeadModalOpen(false)} 
                onSubmit={(data: any) => {
                    console.log("Lead submitted:", data);
                    setIsLeadModalOpen(false);
                    if (setLeadStatus) setLeadStatus({ type: 'success', message: 'Mesajınız iletildi!' });
                }}
                theme={theme} 
                t={t} 
                lang={lang}
                toneStyle={toneStyle}
                profileName={profile?.user?.name || ""}
            />
            <AppointmentModal isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} profile={profile} t={t} lang={lang} />
            <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} onSubmit={() => { }} theme={theme} t={t} toneStyle={toneStyle} />
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
    );
}

function TourismTravelTemplate({ profile, colorScheme, handleShare, handleCVView, handleAddToContacts, reviews, isReviewModalOpen, setIsReviewModalOpen, setIsAppointmentOpen, isAppointmentOpen, t, trackEvent, tone, setReviewStatus, reviewStatus, setIsQrOpen, lang, setLang, isWalletModalOpen, setIsWalletModalOpen, qrDataUrl, isQrOpen, toneStyle, copied, setIsLeadModalOpen, isLeadModalOpen, setLeadStatus, leadStatus, isAIChatOpen, setIsAIChatOpen, chatMessages, setChatMessages, aiConfig, isEmbedMode, translateText, isCVModalOpen, setIsCVModalOpen, cvViewUrl, selectedProject, setSelectedProject }: any) {
    const themes: any = {
        tour_resort: {
            bg: "bg-[#e0f7fa]",
            card: "bg-white/90 shadow-[0_20px_50px_rgba(0,105,92,0.1)]",
            text: "text-[#004d40]",
            subtext: "text-[#00796b]",
            accent: "#009688",
            border: "border-[#b2dfdb]",
            btn: "bg-white border-[#80cbc4]",
            special: "tour_resort",
            icon: "🌴"
        },
        tour_adventure: {
            bg: "bg-[#1a0f00]",
            card: "bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
            text: "text-[#ffcc80]",
            subtext: "text-[#ffb74d]/60",
            accent: "#ff9800",
            border: "border-orange-900/40",
            btn: "bg-orange-950 border-orange-700/30",
            special: "tour_adventure",
            icon: "🦁"
        },
        tour_yacht: {
            bg: "bg-[#0a1628]",
            card: "bg-white/5 backdrop-blur-2xl border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.4)]",
            text: "text-white",
            subtext: "text-blue-300/60",
            accent: "#1976d2",
            border: "border-blue-500/20",
            btn: "bg-blue-900/20 border-blue-400/20",
            special: "tour_yacht",
            icon: "⚓"
        },
        tour_guide: {
            bg: "bg-[#fff8e1]",
            card: "bg-white/95 shadow-[0_15px_40px_rgba(78,52,46,0.05)]",
            text: "text-[#3e2723]",
            subtext: "text-[#5d4037]",
            accent: "#795548",
            border: "border-[#d7ccc8]",
            btn: "bg-white border-[#bcaaa4]",
            special: "tour_guide",
            icon: "📍"
        },
        tour_agency: {
            bg: "bg-[#e8eaf6]",
            card: "bg-white/90 shadow-[0_20px_50px_rgba(63,81,181,0.1)]",
            text: "text-[#1a237e]",
            subtext: "text-[#303f9f]",
            accent: "#3f51b5",
            border: "border-[#c5cae9]",
            btn: "bg-indigo-50 border-indigo-200",
            special: "tour_agency",
            icon: "✈️"
        },
        tour_winter: {
            bg: "bg-[#e3f2fd]",
            card: "bg-white/40 backdrop-blur-2xl border-white/40 shadow-[0_20px_60px_rgba(13,71,161,0.05)]",
            text: "text-[#01579b]",
            subtext: "text-[#0277bd]",
            accent: "#039be5",
            border: "border-blue-100",
            btn: "bg-white/60 border-blue-200",
            special: "tour_winter",
            icon: "❄️"
        }
    };

    const baseTheme = themes[colorScheme] || themes.tour_resort;
    const isLightBg = checkIfBgIsLight(baseTheme.bg || "");
    const theme = { 
        ...baseTheme, 
        isLight: isLightBg,
        accent: getContrastingAccent(profile.themeColor || baseTheme.accent, isLightBg)
    };

    // Dinamik renk düzeltmeleri (Eğer kullanıcı renk seçmişse)
    if (profile.themeColor) {
        theme.card = theme.card.replace(/rgba\(.*?\)/g, `rgba(${hexToRgb(theme.accent)}, 0.1)`);
    }
    const socialLinks = profile.socialLinks || [];
    const props = { profile, colorScheme, handleShare, handleCVView, handleAddToContacts, reviews, isReviewModalOpen, setIsReviewModalOpen, setIsAppointmentOpen, isAppointmentOpen, t, trackEvent, tone, setReviewStatus, reviewStatus, setIsQrOpen, lang, setLang, isWalletModalOpen, setIsWalletModalOpen, qrDataUrl, isQrOpen, toneStyle, copied, setIsLeadModalOpen, isLeadModalOpen, setLeadStatus, leadStatus, isAIChatOpen, setIsAIChatOpen, chatMessages, setChatMessages, aiConfig, isEmbedMode, translateText, isCVModalOpen, setIsCVModalOpen, cvViewUrl, selectedProject, setSelectedProject };

    return (
        <div className={cn("min-h-screen relative overflow-x-hidden", theme.bg, toneStyle.font)}>
            {/* Dedicated Tourism Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {theme.special === "tour_resort" && (
                    <div className="absolute inset-0">
                         {/* Water flow effect */}
                         <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#009688]/20 to-transparent" />
                         <div className="absolute top-[10%] left-[10%] w-64 h-64 rounded-full bg-white opacity-40 blur-3xl animate-pulse" />
                    </div>
                )}
                {theme.special === "tour_adventure" && (
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-10" />
                        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-orange-950/40 to-transparent" />
                    </div>
                )}
                {theme.special === "tour_guide" && (
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 H100 V100 H0 Z' fill='none' stroke='%233e2723' stroke-width='0.5'/%3E%3C/svg%3E")` }} />
                )}
            </div>

            {/* In-component Background Overlay (Reusing logic from NeonModernTemplate but specialized) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                 {/* Reusing existing tour backgrounds from NeonModern - wait, I'll just use the same theme objects */}
            </div>

            {/* Specialized Tourism Layout */}
            <NeonModernTemplate {...props} colorScheme={colorScheme} tone={tone} toneStyle={toneStyle} translateText={translateText} />
        </div>
    );
}

function AthleticProTemplate({ profile, colorScheme, handleShare, handleCVView, handleAddToContacts, reviews, isReviewModalOpen, setIsReviewModalOpen, setIsAppointmentOpen, isAppointmentOpen, t, trackEvent, tone, setReviewStatus, reviewStatus, setIsQrOpen, lang, setLang, isWalletModalOpen, setIsWalletModalOpen, qrDataUrl, isQrOpen, toneStyle, copied, setIsLeadModalOpen, isLeadModalOpen, setLeadStatus, leadStatus, isAIChatOpen, setIsAIChatOpen, chatMessages, setChatMessages, aiConfig, isEmbedMode, translateText, isCVModalOpen, setIsCVModalOpen, cvViewUrl, selectedProject, setSelectedProject, setCurrentArticle, isArticleOpen, setIsArticleOpen }: any) {
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    useEffect(() => {
        if (reviews?.length > 1) {
            const interval = setInterval(() => {
                setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [reviews?.length]);

    const themes: any = {
        "athletic_pro": {
            bg: "bg-[#0a0a0a]",
            card: "bg-black/60",
            accent: profile.themeColor || "#ff3131",
            text: "text-white",
            subtext: "text-white/40",
            border: "border-white/10",
            overlay: "bg-black/60",
            image: "url('/images/athletic/general_bg.png')"
        },
        "athletic_football": {
            bg: "bg-[#050805]",
            card: "bg-black/60",
            accent: "#00ff66",
            text: "text-white",
            subtext: "text-green-500/30",
            border: "border-green-500/20",
            overlay: "bg-black/60",
            image: "url('/images/athletic/football_bg.png')"
        },
        "athletic_basketball": {
            bg: "bg-[#0a0503]",
            card: "bg-black/60",
            accent: "#f97316",
            text: "text-white",
            subtext: "text-orange-500/30",
            border: "border-orange-500/20",
            overlay: "bg-black/60",
            image: "url('/images/athletic/basketball_bg.png')"
        },
        "athletic_tennis": {
            bg: "bg-[#070803]",
            card: "bg-black/60",
            accent: "#eab308",
            text: "text-white",
            subtext: "text-yellow-400/30",
            border: "border-yellow-400/20",
            overlay: "bg-black/60",
            image: "url('/images/athletic/tennis_bg.png')"
        }
    }

    const baseTheme = themes[colorScheme] || themes.athletic_pro;
    const isLightBg = false; // Athletic themes are dark
    const theme = { 
        ...baseTheme, 
        isLight: isLightBg,
        accent: getContrastingAccent(profile.themeColor || baseTheme.accent, isLightBg)
    };

    // Dinamik renk düzeltmeleri (Eğer kullanıcı renk seçmişse)
    if (profile.themeColor) {
        theme.glow = `shadow-[0_0_40px_rgba(${hexToRgb(theme.accent)},0.2)]`;
    }
    const socialLinks = profile.socialLinks || [];

    const formatUrl = (url?: string) => {
        if (!url) return "#";
        if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) return url;
        return `https://${url}`;
    };

    const customLinksEntry = socialLinks.find((l: any) => l.platform === 'customLinks');
    const customLinks = customLinksEntry?.links || [];

    const otherSocialActions = (socialLinks || [])
        .filter((l: any) => l.url && l.isHero && l.platform !== 'customLinks' && !['phone', 'whatsapp', 'website', 'location'].includes(l.platform.toLowerCase()))
        .map((l: any) => ({
            label: l.platform.charAt(0).toUpperCase() + l.platform.slice(1),
            icon: getHeroIcon(l.platform, 20, l.url),
            href: formatUrl(l.url),
            onClick: () => trackEvent("social_button", l.platform),
            active: true
        }))

    const customButtons = customLinks
        .filter((l: any) => l.isAction)
        .map((l: any) => ({
        label: l.title,
        icon: <Globe size={20} />,
        href: formatUrl(l.url),
        onClick: () => trackEvent("custom_button", l.title),
        active: true
    }))

    const actionButtons = [
        { label: t.phoneCallsBtn || "ARA", icon: <Phone size={20} />, href: `tel:${socialLinks.find((l: any) => l.platform === 'phone')?.url || profile.phone}`, active: !!(socialLinks.find((l: any) => l.platform === 'phone')?.url || profile.phone) },
        { label: "WHATSAPP", icon: <MessageCircle size={20} />, href: `https://wa.me/${(socialLinks.find((l: any) => l.platform === 'whatsapp')?.url || socialLinks.find((l: any) => l.platform === 'phone')?.url || profile.phone || "").replace(/\D/g, '')}`, active: !!(socialLinks.find((l: any) => l.platform === 'whatsapp')?.url || socialLinks.find((l: any) => l.platform === 'phone')?.url || profile.phone) },
        { label: t.contactMeTitle || "İLETİŞİME GEÇ", icon: <MessageSquare size={20} />, onClick: () => setIsLeadModalOpen(true), active: true },
        { label: t.emailBtn || "E-MAIL", icon: <MailWithBadge size={20} />, href: `https://mail.google.com/mail/?view=cm&fs=1&to=${profile?.user?.email || ""}`, active: !!profile?.user?.email },
        ...otherSocialActions,
        ...customButtons,
        { label: t.website || "WEB SİTE", icon: <Globe size={20} />, href: formatUrl(socialLinks.find((l: any) => l.platform === 'website')?.url), active: !!socialLinks.find((l: any) => l.platform === 'website')?.url },
        { label: t.locationsBtn || "KONUM", icon: <MapPin size={20} />, onClick: () => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' }), active: !!profile.blocks?.find((b: any) => b.type === 'map') }
    ].filter(a => a.active).filter((v, i, a) => a.findIndex(t => (t.label === v.label || (t.href && v.href && t.href === v.href))) === i);

    return (
        <div className={cn("min-h-screen relative overflow-x-hidden selection:bg-white/20", theme.bg, toneStyle.font)}>
            {/* Thematic Background visual */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute inset-0 bg-no-repeat bg-cover bg-center transition-all duration-1000 grayscale-[0.2] brightness-[0.35] saturate-[0.9]"
                    style={{ backgroundImage: theme.image, backgroundAttachment: 'fixed' }}
                />
                <div className={cn("absolute inset-0 opacity-50 mix-blend-overlay", theme.overlay)} />
                <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] blur-[120px] rounded-full opacity-10" style={{ backgroundColor: theme.accent }} />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] blur-[120px] rounded-full opacity-10" style={{ backgroundColor: theme.accent }} />
            </div>

            {/* Navigation Header (Requested layout) */}
            <header className="sticky top-0 left-0 right-0 z-[100] px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-2xl border-b border-white/5">
                <div className="flex gap-2">
                    <button onClick={() => setIsQrOpen(true)} className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/10 transition-all shadow-lg active:scale-95">
                        <QrCode size={18} />
                    </button>
                    {aiConfig?.isEnabled && (
                        <button onClick={() => setIsAIChatOpen(true)} className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/10 transition-all shadow-lg group active:scale-95">
                            <Bot size={18} className="group-hover:animate-bounce" />
                        </button>
                    )}
                </div>
                <div className="flex gap-3 items-center">
                    <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">
                        {lang.toUpperCase()}
                    </button>
                    <button onClick={() => setIsWalletModalOpen(true)} className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/10 transition-all shadow-lg active:scale-95">
                        <UserPlus size={18} />
                    </button>
                </div>
            </header>

            <main className="relative z-10 w-full max-w-lg mx-auto px-6 py-10 pb-48 space-y-12">
                <MotionWrapper style="3d-manual">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="relative w-32 h-32 group">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={cn("w-32 h-32 p-1 border-2 relative z-10 overflow-hidden", theme.isLight ? "rounded-full" : "rounded-2xl")}
                                style={{ borderColor: theme.accent, boxShadow: `0 0 40px ${theme.accent}33` }}
                            >
                                <img src={profile?.user?.image || `https://ui-avatars.com/api/?name=${profile?.user?.name || "User"}`} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
                            </motion.div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-2xl">
                                {profile.user.name}
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">
                                {translateText(profile.occupation)}
                            </p>
                            <SocialIconsBar 
                                profile={profile} 
                                socialLinks={socialLinks} 
                                t={t} 
                                trackEvent={trackEvent} 
                                getHeroIcon={getHeroIcon} 
                                formatUrl={formatUrl}
                                theme={theme}
                            />
                            {profile.slogan && (
                                <p className="text-[13px] font-medium text-white/60 italic leading-relaxed max-w-[280px] mx-auto">
                                    “{translateText(profile.slogan)}”
                                </p>
                            )}
                        </div>
                    </div>
                </MotionWrapper>

                {/* Grid/List Interactive Buttons (Main Actions) */}
                 <div className={cn(
                     "w-full",
                     profile.buttonLayout === "grid" ? "grid grid-cols-2 gap-4" : 
                     profile.buttonLayout === "balanced" ? "flex flex-wrap justify-center gap-4" : 
                     "space-y-4"
                 )}>
                     {actionButtons.map((btn, i) => (
                         <motion.a
                             key={i}
                             href={btn.href}
                             onClick={(e) => {
                                  if (btn.onClick) btn.onClick();
                                  if (!btn.href) e.preventDefault();
                              }}
                             initial={{ opacity: 0, y: 10 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             viewport={{ once: true }}
                             transition={{ delay: i * 0.05 }}
                             className={cn(
                                 "border flex items-center transition-all hover:bg-white/[0.08] active:scale-[0.98] group relative overflow-hidden shadow-2xl shadow-black/40", 
                                 (profile.buttonLayout === "stack" || !profile.buttonLayout) ? "w-full py-5.5 px-10 gap-6" : "w-full py-4 px-6 gap-3 flex-col text-center justify-center", 
                                 theme.card, 
                                 theme.border,
                                 profile.buttonShape === 'pill' ? "rounded-full" : 
                                 profile.buttonShape === 'rounded' ? "rounded-[2.5rem]" : 
                                 profile.buttonShape === 'square' ? "rounded-none" : "rounded-[2.5rem]"
                             )}
                             style={{
                                 backgroundColor: profile.buttonColor ? `${profile.buttonColor}20` : undefined,
                                 borderColor: profile.buttonColor ? `${profile.buttonColor}40` : undefined,
                             }}
                         >
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000" />
                             <div 
                                 className={cn(
                                     "rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12 shadow-inner shrink-0",
                                     (profile.buttonLayout === "stack" || !profile.buttonLayout) ? "w-12 h-12" : "w-10 h-10"
                                 )} 
                                 style={{ color: profile.buttonColor || theme.accent, backgroundColor: `${profile.buttonColor || theme.accent}15` }}
                             >
                                  {cloneElement(btn.icon as any, { size: (profile.buttonLayout === "stack" || !profile.buttonLayout) ? 22 : 18 })}
                             </div>
                             <span className={cn(
                                 profile.buttonLayout === "stack" ? "text-[12px]" : "text-[10px]"
                             )}>
                                {btn.label}
                             </span>
                         </motion.a>
                     ))}
                 </div>

                 {/* Widget Dock - Athletic Pro Style */}
                 {!isEmbedMode && profile.blocks?.filter((b: any) => b.type === 'external_widget').length > 0 && (
                     <div className="flex flex-wrap justify-center gap-4 pt-4">
                         {profile.blocks?.filter((b: any) => b.type === 'external_widget').map((block: any) => (
                             <ExternalWidget key={block.id} block={block} theme={theme} toneStyle={toneStyle} t={t} className="w-[64px] h-[64px] flex-shrink-0" isMini={true} />
                         ))}
                     </div>
                 )}

                 {/* Modular Content Blocks */}
                 <div className="space-y-12">
                     {profile.blocks?.filter((b: any) => b.isActive && b.type !== 'map' && b.type !== 'external_widget').sort((a: any, b: any) => a.order - b.order).map((block: any) => (
                        <div key={block.id} className="space-y-6">
                            <div className="flex items-center gap-4 px-2">
                                <div className="w-1.5 h-6 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ backgroundColor: theme.accent }} />
                                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-white/40 italic drop-shadow-lg">{block.title || block.type}</h3>
                                <div className="flex-1 h-[1px] bg-white/10" />
                            </div>
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className={cn("rounded-[3.5rem] border p-10 transition-all hover:bg-white/[0.04] relative overflow-hidden backdrop-blur-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]", theme.card, theme.border)}>
                                {block.type === 'expertise' && <SkillsWidget skills={block.content?.skills || []} theme={{ ...theme, accent: theme.accent }} t={t} toneStyle={toneStyle} />}
                                {block.type === 'portfolio' && <PortfolioWidget images={block.content?.images || []} githubUrl={block.content?.githubUrl} theme={theme} t={t} toneStyle={toneStyle} />}
                                {block.type === 'video' && <VideoWidget url={block.content?.url} theme={theme} t={t} toneStyle={toneStyle} />}
                                {block.type === 'text' && <div className="prose prose-invert max-w-none text-sm text-white/60 leading-relaxed font-bold italic antialiased" dangerouslySetInnerHTML={{ __html: block.content?.text }} />}
                                {block.type === 'image' && <img src={block.content?.url} className="w-full rounded-[2.5rem] border border-white/5 shadow-2xl" alt="" />}
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* Services / Expertise Areas */}
                {profile.services && profile.services.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <div className="w-1.5 h-6 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ backgroundColor: theme.accent }} />
                            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-white/40 italic drop-shadow-lg">{t.servicesTitle || "UZMANLIK ALANLARI"}</h3>
                            <div className="flex-1 h-[1px] bg-white/10" />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {profile.services.map((service: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className={cn("p-6 rounded-[2.5rem] border backdrop-blur-2xl relative overflow-hidden group hover:bg-white/[0.06] transition-all shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]", theme.card, theme.border)}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000" />
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner shrink-0" style={{ color: theme.accent, backgroundColor: `${theme.accent}15` }}>
                                            <Award size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-black text-white mb-1.5 tracking-wide">{translateText(service.title)}</h4>
                                            <p className="text-[12px] text-white/40 font-medium leading-relaxed">{translateText(service.description)}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Products / Portfolio Gallery */}
                {profile.products && profile.products.filter((p: any) => p.image).length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <div className="w-1.5 h-6 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ backgroundColor: theme.accent }} />
                            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-white/40 italic drop-shadow-lg">{t.myProjects || "ÇALIŞMALARIM"}</h3>
                            <div className="flex-1 h-[1px] bg-white/10" />
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {profile.products.map((project: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className={cn("overflow-hidden group cursor-pointer backdrop-blur-2xl transition-all duration-500", theme.card, theme.border, toneStyle.rounded)}
                                    style={{ 
                                        backgroundColor: `${theme.accent}0a`,
                                        borderColor: `${theme.accent}25`,
                                        boxShadow: `0 40px 100px -20px ${theme.accent}30`
                                    }}
                                    onClick={() => {
                                        trackEvent("product_click", project.name);
                                        if (project.link) {
                                            const url = project.link.startsWith('http') ? project.link : `https://${project.link}`;
                                            window.open(url, "_blank");
                                        } else {
                                            setSelectedProject(project);
                                        }
                                    }}
                                >
                                    {project.image && (
                                        <div className="aspect-video relative overflow-hidden">
                                            <img src={project.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter contrast-[1.1] brightness-[0.9]" alt={project.name} loading="lazy" decoding="async" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                                                {project.price > 0 && (
                                                    <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10">
                                                        <span className="text-[11px] font-black text-white tracking-wider">{project.price} ₺</span>
                                                    </div>
                                                )}
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-2xl translate-y-16 group-hover:translate-y-0 transition-all duration-500" style={{ backgroundColor: theme.accent }}>
                                                    <ExternalLink size={16} className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-8">
                                        <h4 className="text-sm font-black text-white mb-2 tracking-wide">{translateText(project.name)}</h4>
                                        {project.description && (
                                            <p className="text-[12px] text-white/40 font-medium leading-relaxed line-clamp-2">{translateText(project.description)}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
                
                {/* Articles Module */}
                <ArticlesSection 
                    articles={profile?.articles || []} 
                    t={t} 
                    theme={theme} 
                    setCurrentArticle={setCurrentArticle} 
                    setIsArticleOpen={setIsArticleOpen} 
                    trackEvent={trackEvent} 
                />




                {/* Payment Link Section */}
                {profile.paymentLink && (
                    <section className="pt-8 w-full">
                        <motion.a
                            href={formatUrl(profile.paymentLink)}
                            target="_blank"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                                "w-full py-6 px-10 flex items-center justify-between font-black text-[12px] uppercase tracking-[0.25em] transition-all relative overflow-hidden group border-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] rounded-[2.5rem]",
                                theme.card,
                                theme.border
                            )}
                            style={{
                                backgroundColor: `${theme.accent}15`,
                                borderColor: `${theme.accent}40`,
                                color: "#fff",
                                boxShadow: `0 20px 40px -15px ${theme.accent}30, inset 0 0 20px ${theme.accent}10`
                            }}
                            onClick={() => trackEvent("payment_click")}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000" />
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-2xl border transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-inner"
                                     style={{ backgroundColor: `${theme.accent}25`, borderColor: `${theme.accent}50`, color: theme.accent }}>
                                    {profile.paymentType === 'consulting' ? <Briefcase size={22} fill={`${theme.accent}33`} /> :
                                     profile.paymentType === 'support' ? <Heart size={22} fill={`${theme.accent}33`} /> :
                                     profile.paymentType === 'pay' ? <CreditCard size={22} fill={`${theme.accent}33`} /> :
                                     <Coffee size={22} fill={`${theme.accent}33`} />}
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    <span className="opacity-40 text-[8px] font-black tracking-[0.4em]">
                                        {profile.paymentType === 'consulting' ? "PROFESSIONAL" :
                                         profile.paymentType === 'support' ? "CONTRIBUTION" :
                                         profile.paymentType === 'pay' ? "TRANSACTION" :
                                         "APPRECIATION"}
                                    </span>
                                    <span className="text-sm font-black tracking-widest">
                                        {profile.paymentType === 'consulting' ? t.consultingBtn :
                                         profile.paymentType === 'support' ? t.supportBtn :
                                         profile.paymentType === 'pay' ? t.payBtn :
                                         t.coffeeBtn}
                                    </span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center border transition-all group-hover:bg-white/10 relative z-10"
                                 style={{ borderColor: `${theme.accent}30` }}>
                                <Zap size={18} className="group-hover:animate-pulse" style={{ color: theme.accent }} fill={theme.accent} />
                            </div>
                        </motion.a>
                    </section>
                )}

                {/* Slogan Text Center Banner */}
                {profile.bio && (
                    <div className="text-center px-8 py-12 border-y border-white/5 bg-white/[0.01] backdrop-blur-md rounded-3xl">
                        <p className="font-medium leading-relaxed italic max-w-xs mx-auto drop-shadow-md"
                           style={{ 
                               color: profile.bioColor || "rgba(255,255,255,0.3)",
                               fontSize: profile.bioFontSize || "14px",
                               fontFamily: profile.bioFontFamily || "inherit"
                           }}>
                            “{translateText(profile.bio)}” 🏔️
                        </p>
                    </div>
                )}

                {/* Reviews Performance Section */}
                {reviews?.length > 0 && (
                    <section className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-7 rounded-full" style={{ background: theme.accent }} />
                                <h3 className="text-[13px] font-black uppercase tracking-[0.25em] text-white/40">{t.reviews || "YORUMLAR"}</h3>
                            </div>
                            <button onClick={() => setIsReviewModalOpen(true)} className="text-[11px] font-black uppercase tracking-widest px-6 py-3 border rounded-full text-white/50 hover:text-white transition-all hover:bg-white/5 shadow-[0_0_20px_rgba(0,0,0,0.3)]" style={{ borderColor: `${theme.accent}30` }}>
                                <Plus size={12} className="inline mr-2" /> {t.writeReview || "YORUM YAZ"}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentReviewIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className={cn("p-12 rounded-[4rem] border flex flex-col gap-8 relative overflow-hidden backdrop-blur-2xl shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)]", theme.card, theme.border)}
                            >
                                <div className="absolute top-10 right-14 opacity-10 pointer-events-none">
                                    <Quote size={100} style={{ color: theme.accent }} />
                                </div>
                                <div className="flex gap-7 relative z-10">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-[1.8rem] overflow-hidden border-2 p-1.5 shadow-2xl" style={{ borderColor: `${theme.accent}40` }}>
                                            <img src={reviews[currentReviewIndex].image || `https://ui-avatars.com/api/?name=${reviews[currentReviewIndex].name}`} className="w-full h-full object-cover rounded-[1.4rem]" alt="" loading="lazy" decoding="async" />
            </div>
                                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-[3px] border-zinc-950 flex items-center justify-center text-white shadow-xl">
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex flex-col justify-center">
                                        <h4 className="text-[17px] font-black text-white truncate drop-shadow-xl">{reviews[currentReviewIndex].name}</h4>
                                        <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.25em] truncate mt-1">{reviews[currentReviewIndex].title}</p>
                                        <div className="flex gap-1 mt-3.5">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={13} className={cn("fill-current", i < reviews[currentReviewIndex].rating ? "text-orange-400" : "text-white/10")} />)}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[15px] font-medium text-white/70 italic leading-relaxed relative z-10 antialiased font-serif drop-shadow-md">“{reviews[currentReviewIndex].content}”</p>
                            </motion.div>
                        </AnimatePresence>
                    </section>
                )}

                {/* Map Display */}
                {profile.blocks?.find((b: any) => b.type === 'map') && (
                    <div id="map-section" className="space-y-6 pb-12">
                        <div className="flex items-center gap-4 px-2">
                             <div className="w-1.5 h-7 rounded-full" style={{ backgroundColor: theme.accent }} />
                             <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-white/40 italic">KONUM</h3>
                        </div>
                        <div className={cn("rounded-[3.5rem] border p-2.5 relative overflow-hidden aspect-video shadow-[0_50px_100px_rgba(0,0,0,0.6)]", theme.card, theme.border)}>
                            <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={`https://www.google.com/maps?q=${encodeURIComponent(profile.blocks?.find((b: any) => b.type === 'map')?.content?.location || "")}&output=embed`} allowFullScreen className="rounded-[3rem] grayscale brightness-50 contrast-125 invert-[0.1]"></iframe>
                        </div>
                    </div>
                )}

                {/* Social Networks Grid (Accent Outlined Style) */}


                {/* Articles Module */}
                <ArticlesSection 
                    articles={profile?.articles || []} 
                    t={t} 
                    theme={theme} 
                    setCurrentArticle={setCurrentArticle} 
                    setIsArticleOpen={setIsArticleOpen} 
                    trackEvent={trackEvent} 
                />

            </main>

            {/* Premium Floating High-Performance Action Bar */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[420px] px-6 z-[150]">
                <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-3 shadow-[0_40px_100px_rgba(0,0,0,1)] flex items-center justify-between gap-3 border-t-white/20">
                    <button 
                        onClick={handleShare} 
                        className="w-[60px] h-[60px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all active:translate-y-[4px] active:shadow-none shadow-[0_4px_0_0_rgba(255,255,255,0.1)] group relative"
                    >
                        <div className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity" style={{ backgroundColor: theme.accent }} />
                        <Share2 size={22} className="group-hover:rotate-12 transition-transform relative z-10" />
                    </button>

                    <button
                        onClick={handleCVView}
                        className={cn("flex-1 h-[60px] rounded-full flex items-center justify-center gap-4 text-white text-[12px] font-black uppercase tracking-[0.3em] relative overflow-hidden group transition-all active:translate-y-[4px] active:shadow-none")}
                        style={{ 
                            backgroundColor: profile.buttonColor || theme.accent,
                            color: isDarkColor(profile.buttonColor || theme.accent) ? '#fff' : '#000',
                            boxShadow: `0 4px 0 0 ${(profile.buttonColor || theme.accent)}66`
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full duration-1000" />
                        <FileText size={20} className="fill-white drop-shadow-lg" />
                        <span className="drop-shadow-lg">{profile.isCatalog ? t.viewCatalog || "KATALOG" : t.viewCvBtn || "CV GÖRÜNTÜLE"}</span>
                    </button>

                    <button
                        onClick={() => setIsAppointmentOpen(true)}
                        className="w-[60px] h-[60px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all active:translate-y-[4px] active:shadow-none shadow-[0_4px_0_0_rgba(255,255,255,0.15)] group overflow-hidden"
                    >
                        <Zap size={22} className="group-hover:scale-125 transition-transform" />
                    </button>
                    
                    {aiConfig?.isEnabled && (
                        <button 
                            onClick={() => setIsAIChatOpen(true)} 
                            className="w-[60px] h-[60px] rounded-full bg-white border-[4px] flex items-center justify-center text-black hover:brightness-110 transition-all active:translate-y-[4px] active:shadow-none shadow-[0_4px_0_0_#cbd5e1] relative group" 
                            style={{ borderColor: profile.buttonColor || theme.accent }}
                        >
                            <Bot size={26} className="group-hover:animate-bounce" />
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-[3px] border-black animate-ping opacity-75" />
                        </button>
                    )}
                </div>
            </div>

            {/* Global Modals */}
            <AnimatePresence>
                {isWalletModalOpen && <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} profile={profile} t={t} handleAddToContacts={handleAddToContacts} theme={theme} toneStyle={toneStyle} />}
            </AnimatePresence>
            <QrModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} theme={theme} profile={profile} t={t} />
            <LeadModal 
                isOpen={isLeadModalOpen} 
                onClose={() => setIsLeadModalOpen(false)} 
                onSubmit={(data: any) => {
                    console.log("Lead submitted:", data);
                    setIsLeadModalOpen(false);
                    if (setLeadStatus) setLeadStatus({ type: 'success', message: 'Mesajınız iletildi!' });
                }}
                theme={theme} 
                t={t} 
                lang={lang}
                toneStyle={toneStyle}
                profileName={profile?.user?.name || ""}
            />
            <AppointmentModal isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} profile={profile} t={t} lang={lang} />
            <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} onSubmit={() => { }} theme={theme} t={t} toneStyle={toneStyle} />
            <CVPreviewModal 
                isOpen={isCVModalOpen} 
                onClose={() => setIsCVModalOpen(false)} 
                url={cvViewUrl} 
                theme={theme} 
                t={t} 
                toneStyle={toneStyle} 
                profile={profile}
            />
            <SocialProof t={t} theme={theme} />

            <AIChatAssistant isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} profile={profile} t={t} theme={theme} toneStyle={toneStyle} messages={chatMessages} setMessages={setChatMessages} aiConfig={aiConfig} />
        </div>
    );
}


function ReviewModal({ isOpen, onClose, onSubmit, theme, profile, t, toneStyle }: any) {
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
        const image = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1a1a2e&color=${theme.accent.replace('#', '')}&bold=true&size=128`
        onSubmit({ ...formData, image, id: Date.now() })
        setFormData({ name: "", title: "", content: "", rating: 5, gender: "male" })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={onClose}
            />
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 350 }}
                className={cn(
                    "relative w-full sm:max-w-[400px] p-4 sm:p-8 backdrop-blur-2xl no-scrollbar overflow-y-auto max-h-[90vh] border shadow-2xl transition-all rounded-t-[2.5rem] sm:rounded-[2.5rem] pb-24 sm:pb-10",
                    theme.card, theme.border, toneStyle?.font
                )}
                style={{
                    boxShadow: `0 30px 60px -12px rgba(0,0,0,0.6), 0 0 40px ${theme.accent}20`
                }}
            >
                <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-6 sm:hidden shrink-0" />
                
                <button 
                    onClick={onClose} 
                    className={cn("absolute top-5 right-5 z-[100] flex w-10 h-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all opacity-40 hover:opacity-100", theme.text)}
                >
                    <X size={18} />
                </button>
                
                <div className="relative z-10 w-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1 text-left">
                            <h3 className={cn("text-lg font-black uppercase tracking-tight leading-tight", theme.text)}>{t.leaveComment}</h3>
                            <div className="flex items-center gap-1.5">
                                <div className="w-4 h-[1.5px]" style={{ background: theme.accent }} />
                                <p className={cn("text-[8px] font-black uppercase tracking-[0.2em] opacity-40", theme.text)}>{t.leaveCommentSub}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Rating Section */}
                        <div className={cn("flex flex-col items-center gap-1.5 py-3 rounded-2xl border bg-black/20 backdrop-blur-xl shrink-0 shadow-inner", theme.border)} style={{ borderColor: `${theme.accent}10` }}>
                            <span className={cn("text-[8px] font-black uppercase tracking-[0.25em] opacity-30", theme.text)}>{t.rateLabel}</span>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <motion.button
                                        key={star}
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="transition-all"
                                    >
                                        <Star
                                            size={24}
                                            className={cn(
                                                "transition-all duration-500 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]",
                                                star <= formData.rating ? "fill-current" : "text-white/5"
                                            )}
                                            style={star <= formData.rating ? { color: '#fbbf24' } : {}}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Gender Pill Toggle */}
                        <div className={cn("flex p-1 rounded-2xl border bg-black/10 backdrop-blur-xl", theme.border)}>
                            {[
                                { id: 'male', icon: <User size={14} />, label: t.male },
                                { id: 'female', icon: <UserCircle size={14} />, label: t.female }
                            ].map((g) => (
                                <button
                                    key={g.id}
                                    onClick={() => setFormData({ ...formData, gender: g.id })}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-500 text-[9px] font-black uppercase tracking-widest",
                                        formData.gender === g.id ? "bg-white/10 shadow-lg" : "opacity-30 hover:opacity-100"
                                    )}
                                    style={formData.gender === g.id ? { color: theme.accent } : { color: 'currentColor' }}
                                >
                                    {g.icon}
                                    {g.label}
                                </button>
                            ))}
                        </div>

                        {/* Form Inputs */}
                        <div className="space-y-3">
                            <div className="space-y-1 text-left">
                                <label className={cn("text-[8px] font-black uppercase tracking-widest ml-3 opacity-40", theme.text)}>{t.yourName}</label>
                                <input
                                    type="text"
                                    placeholder={t.yourName}
                                    className={cn("w-full px-4 py-3.5 rounded-2xl focus:outline-none transition-all text-sm font-bold border backdrop-blur-xl", theme.border, theme.text)}
                                    style={{ backgroundColor: `rgba(255,255,255,0.03)`, borderColor: `rgba(255,255,255,0.06)` }}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1 text-left">
                                <label className={cn("text-[8px] font-black uppercase tracking-widest ml-3 opacity-40", theme.text)}>{t.yourTitle}</label>
                                <input
                                    type="text"
                                    placeholder={t.yourTitle}
                                    className={cn("w-full px-4 py-3.5 rounded-2xl focus:outline-none transition-all text-sm font-bold border backdrop-blur-xl", theme.border, theme.text)}
                                    style={{ backgroundColor: `rgba(255,255,255,0.03)`, borderColor: `rgba(255,255,255,0.06)` }}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1 text-left">
                                <label className={cn("text-[8px] font-black uppercase tracking-widest ml-3 opacity-40", theme.text)}>{t.yourMessage}</label>
                                <textarea
                                    rows={2}
                                    placeholder={t.yourMessage}
                                    className={cn("w-full px-4 py-3.5 rounded-[1.2rem] focus:outline-none transition-all text-sm font-medium resize-none border backdrop-blur-xl leading-relaxed", theme.border, theme.text)}
                                    style={{ backgroundColor: `rgba(255,255,255,0.03)`, borderColor: `rgba(255,255,255,0.06)` }}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={!formData.name || !formData.content}
                            className={cn("w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all disabled:opacity-20 flex items-center justify-center gap-3 relative overflow-hidden group", toneStyle?.font)}
                            style={{
                                backgroundColor: (profile?.buttonColor || theme.accent),
                                color: isDarkColor(profile?.buttonColor || theme.accent) ? '#fff' : '#000',
                                boxShadow: `0 15px 35px ${(profile?.buttonColor || theme.accent)}40`
                            }}
                        >
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                            <Send size={18} className="relative z-10" />
                            <span className="relative z-10">{t.publishReview}</span>
                        </motion.button>
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
            const w = window.innerWidth;
            // Portrait card is 340x600, scale to fit
            const scaleH = (h - 260) / 600;
            const scaleW = (w - 60) / 340;
            setScale(Math.min(scaleH, scaleW, 0.95));
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
            const wrapperEl = cardExportRef.current;
            if (!wrapperEl) { setIsDownloading(false); return; }

            const cardEl = wrapperEl.querySelector('[data-card-actual]') as HTMLElement;
            if (!cardEl) { setIsDownloading(false); return; }

            // Temporarily reset scale to 1 for clean capture
            const originalTransform = wrapperEl.style.transform;
            wrapperEl.style.transform = 'scale(1)';
            wrapperEl.style.transition = 'none';

            // Wait for browser to repaint
            await new Promise(r => setTimeout(r, 500));

            const htmlToImage = await import('html-to-image');

            const currentTpl = TEMPLATES.find(t => t.id === profile.businessCardTemplateId) || TEMPLATES[0];
            const pixelPerfectBg = currentTpl.hex || '#ffffff';

            // Try toJpeg first, then toPng as fallback
            let dataUrl: string;
            try {
                dataUrl = await htmlToImage.toJpeg(cardEl, {
                    quality: 0.95,
                    pixelRatio: 2,
                    backgroundColor: pixelPerfectBg,
                    cacheBust: true,
                    skipAutoScale: true,
                    filter: (node: any) => {
                        // Skip elements that cause CORS issues
                        if (node.tagName === 'LINK' || node.tagName === 'STYLE') return true;
                        return true;
                    }
                });
            } catch (jpegErr) {
                console.warn('JPEG failed, trying PNG:', jpegErr);
                dataUrl = await htmlToImage.toPng(cardEl, {
                    pixelRatio: 2,
                    backgroundColor: pixelPerfectBg,
                    cacheBust: true,
                    skipAutoScale: true,
                });
            }

            // Restore scale
            wrapperEl.style.transform = originalTransform;
            wrapperEl.style.transition = '';

            // Trigger download
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `kardly-${profile.username || 'card'}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setActionDone('download');
            setTimeout(() => setActionDone(null), 2500);
        } catch (err) {
            console.error('Card download error:', err);
            // Restore scale even on error
            if (cardExportRef.current) {
                cardExportRef.current.style.transform = `scale(${scale})`;
                cardExportRef.current.style.transition = '';
            }
            alert('İndirme hatası oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShareCard = async () => {
        if (isSharing) return;
        setIsSharing(true);
        try {
            const wrapperEl = cardExportRef.current;
            if (!wrapperEl) { setIsSharing(false); return; }

            const cardEl = wrapperEl.querySelector('[data-card-actual]') as HTMLElement;
            if (!cardEl) { setIsSharing(false); return; }

            const htmlToImage = await import('html-to-image');
            const currentTpl = TEMPLATES.find(t => t.id === profile.businessCardTemplateId) || TEMPLATES[0];
            const pixelPerfectBg = currentTpl.hex || '#ffffff';

            const dataUrl = await htmlToImage.toPng(cardEl, {
                pixelRatio: 2,
                backgroundColor: pixelPerfectBg,
                cacheBust: true,
                skipAutoScale: true,
            });

            const [header, base64Data] = dataUrl.split(',');
            const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
            const binary = atob(base64Data);
            const array = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                array[i] = binary.charCodeAt(i);
            }
            const blob = new Blob([array], { type: mime });
            const file = new File([blob], `kardly-card.png`, { type: mime });

            const profileUrl = `${window.location.origin}/${profile.username}`;
            const shareData = {
                files: [file],
                title: profile.displayName || profile.user?.name || 'Kardly',
                text: `${profile.displayName || profile.user?.name}'in dijital kartviziti`,
            };

            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else if (navigator.share) {
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
            console.error('Share error:', err);
            // Final fallback to URL share on error
            try {
                const profileUrl = `${window.location.origin}/${profile.username}`;
                if (navigator.share) {
                    await navigator.share({
                        title: profile.displayName || profile.user?.name || 'Kardly',
                        text: `${profile.displayName || profile.user?.name}'in dijital kartviziti`,
                        url: profileUrl
                    });
                }
            } catch (e) {}
        } finally {
            setIsSharing(false);
        }
    };

    const modalBg = theme.bg || theme.body || "bg-[#030308]/95";

    return (
        <div className={cn("fixed inset-0 z-[1000] flex flex-col backdrop-blur-2xl overflow-hidden transition-all duration-700", modalBg)}>
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-[35%] h-[35%] blur-[150px] opacity-[0.08] rounded-full" style={{ backgroundColor: theme.accent }} />
                <div className="absolute bottom-[10%] right-[15%] w-[30%] h-[30%] blur-[120px] opacity-[0.06] rounded-full" style={{ backgroundColor: theme.accent }} />
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] blur-[200px] opacity-[0.04] rounded-full" style={{ backgroundColor: theme.accent }} />
            </div>

            {/* Top Bar */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative z-[1001] flex items-center justify-between px-8 py-6 pt-10 shrink-0"
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }} />
                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-30" style={{ backgroundColor: theme.accent }} />
                    </div>
                    <span className={cn("text-[11px] font-black uppercase tracking-[0.4em] opacity-40", theme.text)}>DİJİTAL KARTVİZİT</span>
                </div>
                <button
                    onClick={onClose}
                    className={cn("w-12 h-12 flex items-center justify-center rounded-2xl border transition-all active:scale-90 backdrop-blur-2xl z-[2000] group", theme.btn, theme.border)}
                >
                    <X size={24} className={cn("transition-transform group-hover:rotate-90 duration-300", theme.btnText || theme.text)} />
                </button>
            </motion.div>

            {/* Main Content Area - Card Centered */}
            <div className="flex-1 relative flex flex-col items-center justify-center min-h-0 px-4">
                <motion.div
                    initial={{ scale: 0.85, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 250, delay: 0.15 }}
                    className="relative flex flex-col items-center"
                >
                    {/* Card Wrapper - Portrait Only */}
                    <div
                        ref={cardExportRef}
                        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
                        className="transition-transform duration-500 ease-out"
                    >
                        <BusinessCardGenerator
                            mode="modal"
                            profileData={profile}
                            selectedTemplateId={profile.businessCardTemplateId}
                            orientation="portrait"
                            user={{
                                name: profile.displayName || profile.user?.name || 'Kullanıcı',
                                occupation: profile.occupation || '',
                                phone: profile.phone || '',
                                email: profile.email || profile.user?.email || '',
                                username: profile.username,
                                image: profile.image || profile.user?.image || ''
                            }}
                        />
                    </div>

                    {/* Success Toast Overlay */}
                    <AnimatePresence>
                        {actionDone && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 1.05 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl z-50 flex items-center gap-4 border border-slate-100"
                            >
                                <CheckCircle2 size={24} className="text-emerald-500" />
                                <span>{actionDone === 'download' ? 'Görsel Kaydedildi' : 'Bağlantı Kopyalandı'}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Modern Floating Action Bar */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative z-[1001] p-8 pb-14 shrink-0 flex items-center justify-center"
            >
                <div className={cn("backdrop-blur-2xl rounded-[2.5rem] p-2.5 flex items-center gap-3 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.6)] border", theme.card, theme.border)}>
                    <button
                        onClick={handleDownloadCard}
                        disabled={isDownloading}
                        className="flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-50 group shadow-lg"
                    >
                        {isDownloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download size={20} className="group-hover:-translate-y-0.5 transition-transform" />}
                        Görsel İndir
                    </button>
                    <button
                        onClick={handleShareCard}
                        className={cn("w-14 h-14 flex items-center justify-center rounded-full border transition-all hover:scale-110 active:scale-90", theme.btn, theme.border)}
                    >
                        <Share2 size={24} className={cn("transition-opacity", theme.btnText || theme.text)} />
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
                        "fixed bottom-6 left-6 z-[180] backdrop-blur-2xl border px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-[240px] transition-all",
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

// Vercel redeploy trigger: 2026-03-07 21:02


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

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-20 hidden md:block" />
}

function WalletModal({ isOpen, onClose, profile, t, handleAddToContacts, theme, toneStyle }: any) {
    if (!isOpen) return null

    const isLight = theme.body === "bg-white" || theme.bg?.includes("white") || theme.bg?.includes("slate-50")
    const textColor = theme.text || (isLight ? "text-slate-900" : "text-white")
    const subTextColor = theme.subtext || (isLight ? "text-slate-500" : "text-white/60")

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 350 }}
                className={cn(
                    "relative w-full sm:max-w-[400px] p-5 sm:p-8 no-scrollbar overflow-y-auto max-h-[85vh] border backdrop-blur-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl pb-20 sm:pb-10 transition-all", 
                    theme.card, theme.border, toneStyle?.font
                )}
                style={{
                    boxShadow: `0 30px 60px -12px ${theme.accent}25`
                }}
            >
                <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-6 sm:hidden shrink-0" />
                
                <button 
                    onClick={onClose} 
                    className={cn("absolute top-5 right-5 z-[100] flex w-10 h-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all opacity-40 hover:opacity-100", textColor)}
                >
                    <X size={18} />
                </button>

                {/* Visual Flair */}
                <div className="absolute -top-16 -right-16 w-32 h-32 blur-[60px] opacity-[0.08] rounded-full" style={{ backgroundColor: theme.accent }} />

                <div className="flex flex-col items-center text-center space-y-4 relative z-10 w-full">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden group border"
                        style={{ 
                            backgroundColor: `${theme.accent}10`,
                            borderColor: `${theme.accent}20`
                        }}
                    >
                        <div className="absolute inset-0 blur-xl opacity-20" style={{ background: theme.accent }} />
                        <Smartphone size={22} style={{ color: theme.accent }} className="relative z-10" />
                    </div>

                    <div className="space-y-1">
                        <h3 className={cn("text-xl font-black px-2 leading-tight uppercase tracking-tight", toneStyle?.font, textColor)}>
                            {t.addToWallet || "CÜZDANA EKLE"}
                        </h3>
                        <p className={cn("text-[8px] font-black tracking-[0.25em] uppercase opacity-30 px-4", subTextColor)}>
                            {t.savePassDesc || "KARTINIZI TELEFONUNUZA KAYDEDİN"}
                        </p>
                    </div>

                    <div className="w-full space-y-2">
                        {[
                            {
                                icon: <UserPlus size={16} style={{ color: theme.accent }} />,
                                label: t.vcfLabel || "Rehbere Kaydet (VCF)",
                                action: handleAddToContacts,
                                iconBgStyle: { backgroundColor: `${theme.accent}10` }
                            },
                            {
                                icon: <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black shadow-sm"><Smartphone size={16} /></div>,
                                label: "Apple Wallet",
                                action: handleAddToContacts,
                                badge: "POPÜLER",
                                iconBgStyle: { backgroundColor: "transparent" }
                            },
                            {
                                icon: <Globe size={16} style={{ color: theme.accent }} />,
                                label: "Google Wallet",
                                action: handleAddToContacts,
                                iconBgStyle: { backgroundColor: `${theme.accent}10` }
                            }
                        ].map((btn, idx) => (
                            <button
                                key={idx}
                                onClick={() => { btn.action(); onClose(); }}
                                className={cn(
                                    "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group active:scale-[0.98] relative overflow-hidden border",
                                    isLight ? "bg-slate-50/50 border-slate-100 hover:bg-slate-100" : "bg-white/[0.03] border-white/5 hover:bg-white/[0.08]"
                                )}
                            >
                                <div className="flex items-center gap-3.5 z-10">
                                    <div 
                                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all border"
                                        style={{ ...btn.iconBgStyle, borderColor: 'rgba(255,255,255,0.02)' }}
                                    >
                                        {btn.icon}
                                    </div>
                                    <span 
                                        className={cn("text-[12px] font-bold tracking-tight transition-colors", textColor)}
                                    >
                                        {btn.label}
                                    </span>
                                </div>
                                
                                {btn.badge ? (
                                    <span 
                                        className="text-[7px] font-black opacity-40 tracking-widest px-2 py-1 bg-white/5 rounded-full border border-white/5"
                                        style={{ color: isLight ? '#000' : theme.accent }}
                                    >
                                        {btn.badge}
                                    </span>
                                ) : (
                                    <ArrowRight size={14} className={cn("opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all", textColor)} />
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className={cn("text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 pt-4 opacity-30 hover:opacity-100", subTextColor)}
                    >
                        {t.cancel || "VAZGEÇ"}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

function LeadModal({ isOpen, onClose, onSubmit, theme, t, lang, toneStyle, isEmbed = false, profile, profileName }: any) {
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
        <div className="relative z-10 w-full text-left">
            <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="flex flex-col items-center text-center w-full gap-1">
                    <h3 className={cn("text-lg sm:text-2xl font-black uppercase tracking-tight leading-tight mb-1", theme.text, toneStyle?.font)}>
                        {t.contactMeTitle}
                    </h3>
                    <p className={cn("text-[9px] font-bold uppercase tracking-[0.25em] opacity-40 px-6", theme.text)}>
                        {t.contactMeSub}
                    </p>
                </div>
            </div>

            <div className="space-y-3.5">
                <div className="space-y-1 text-left">
                    <label className={cn("text-[8px] font-black uppercase tracking-widest ml-3 opacity-40", theme.text)}>{t.fullNameLabel}</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={cn("w-full border px-4 py-3.5 text-sm focus:outline-none transition-all font-bold rounded-2xl", theme.btn, theme.border, theme.text)}
                        placeholder="..."
                    />
                </div>

                <div className="space-y-1 text-left">
                    <label className={cn("text-[8px] font-black uppercase tracking-widest ml-3 opacity-40", theme.text)}>{t.phoneNumberLabel}</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={cn("w-full border px-4 py-3.5 text-sm focus:outline-none transition-all font-bold rounded-2xl", theme.btn, theme.border, theme.text)}
                        placeholder="+90 ..."
                    />
                </div>

                <div className="space-y-1 text-left">
                    <label className={cn("text-[8px] font-black uppercase tracking-widest ml-3 opacity-40", theme.text)}>{t.yourMessage}</label>
                    <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={cn("w-full border px-4 py-3.5 text-sm focus:outline-none transition-all font-medium min-h-[100px] resize-none rounded-[1.2rem] leading-relaxed", theme.btn, theme.border, theme.text)}
                        placeholder={t.helpMessagePlaceholder}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.phone}
                    className={cn("w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] relative overflow-hidden group active:scale-[0.98] transition-all disabled:opacity-40 shadow-xl text-white mt-2 flex items-center justify-center gap-3")}
                    style={{ background: theme.accent, boxShadow: `0 15px 35px ${theme.accent}40`, color: '#000' }}
                >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500" />
                    <Send size={18} className="relative z-10" />
                    <span className="relative z-10">{t.sendMyInfoBtn}</span>
                </button>

                {/* Legal Safeguard (KVKK/GDPR Shield) */}
                <div className="mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                    <p className={cn("text-[8px] leading-relaxed opacity-30 font-medium", theme.text)}>
                        {lang === 'tr' ? (
                            <>Bu form aracılığıyla iletilen veriler KVKK kapsamında bizzat <strong>{profileName}</strong> tarafından işlenmektedir. Kardly.site sadece teknik altyapı hizmeti vermektedir.</>
                        ) : (
                            <>Data submitted via this form is processed by <strong>{profileName}</strong>. Kardly.site serves only as a technical infrastructure provider.</>
                        )}
                    </p>
                </div>
            </div>
        </div>
    )

    if (isEmbed) {
        return (
            <div className={cn("relative w-full p-8 overflow-hidden border backdrop-blur-2xl rounded-[2rem] shadow-xl", theme.card, theme.border)}>
                {content}
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={onClose}
            />
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 350 }}
                className={cn("relative w-full sm:max-w-[400px] p-5 sm:p-8 no-scrollbar overflow-y-auto max-h-[90vh] border backdrop-blur-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl pb-24 sm:pb-10 transition-all", theme.card, theme.border, toneStyle?.font)}
                style={{
                    boxShadow: `0 30px 60px -12px ${theme.accent}30`
                }}
            >
                <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-6 sm:hidden shrink-0" />
                
                <button 
                    onClick={onClose} 
                    className={cn("absolute top-5 right-5 z-[100] flex w-10 h-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all opacity-40 hover:opacity-100", theme.text)}
                >
                    <X size={18} />
                </button>

                <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }} />
                <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-[0.05]" style={{ background: theme.accent }} />

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
            <div className={cn("p-5 sm:p-6 pb-3 flex items-center justify-between border-b relative z-10", theme.border)}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
                        <Bot size={20} className="relative z-10" />
                        <div className="absolute inset-0 animate-pulse opacity-20" style={{ background: theme.accent }} />
                    </div>
                    <div className="text-left">
                        <h3 className={cn("text-[12px] font-black uppercase tracking-tight", theme.text, toneStyle?.font)}>{aiConfig?.assistantName || "Kardly AI"}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span className={cn("text-[7px] font-black uppercase tracking-widest opacity-40", theme.text)}>{t.onlineStatus || "AKTİF"}</span>
                        </div>
                    </div>
                </div>
                {!isEmbed && (
                    <button onClick={onClose} className={cn("w-9 h-9 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all opacity-40 hover:opacity-100", theme.text)}>
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 no-scrollbar relative z-10">
                {messages.map((m: any, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className={cn(
                            "max-w-[85%] p-3.5 sm:p-4 text-[11px] sm:text-[12px] font-medium leading-relaxed shadow-sm",
                            m.role === "user"
                                ? cn("ml-auto border", theme.btn, theme.border, theme.text, "rounded-2xl rounded-tr-none text-right bubble-user")
                                : cn("border backdrop-blur-2xl", theme.border, theme.text, "rounded-2xl rounded-tl-none text-left bubble-ai")
                        )}
                        style={m.role === "assistant" && !m.isError ? { 
                            borderColor: `${theme.accent}20`, 
                            backgroundColor: `${theme.accent}05`,
                        } : {}}
                    >
                        {m.content}
                    </motion.div>
                ))}
                {isLoading && (
                    <div className={cn("flex gap-1 p-3 border rounded-2xl w-14 items-center justify-center shadow-inner mt-2", theme.btn, theme.border)}>
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce" />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 sm:p-6 pt-2 relative z-10">
                <div 
                    className={cn("relative flex items-center border transition-all pl-2 pr-2 py-0.5 gap-2 rounded-[1.2rem] bg-white/[0.03] backdrop-blur-xl", theme.border)}
                    style={{ borderColor: `${theme.accent}20` }}
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder={t.askSomething}
                        className={cn("bg-transparent border-none focus:ring-0 text-[11px] sm:text-[12px] p-2.5 flex-1 placeholder:opacity-20 font-medium", theme.text)}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className={cn("w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:grayscale disabled:opacity-20 shadow-lg")}
                        style={{ 
                            backgroundColor: profile.buttonColor || theme.accent, 
                            color: isDarkColor(profile.buttonColor || theme.accent) ? '#fff' : '#000' 
                        }}
                    >
                        <Send size={16} />
                    </button>
                </div>
                <p className={cn("text-[7px] font-black uppercase tracking-widest opacity-20 text-center mt-3", theme.text)}>
                    Kardly AI can make mistakes. Check important info.
                </p>
            </div>
        </div>
    )

    if (isEmbed) {
        return (
            <div className={cn("relative w-full h-full overflow-hidden border backdrop-blur-2xl rounded-[2.5rem] shadow-xl", theme.card, theme.border)}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />
                {content}
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={onClose}
            />
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 350 }}
                className={cn(
                    "relative w-full sm:max-w-[400px] h-[80vh] sm:h-[580px] overflow-hidden no-scrollbar border backdrop-blur-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col transition-all", 
                    theme.card, 
                    theme.border, 
                    toneStyle?.font
                )}
                style={{
                    boxShadow: `0 30px 60px -12px ${theme.accent}30`
                }}
            >
                <div className="w-10 h-1.5 bg-white/10 rounded-full mx-auto mt-3 absolute top-0 left-1/2 -translate-x-1/2 sm:hidden shrink-0 z-[100]" />
                
                {/* Visual Flair */}
                <div className="absolute -top-32 -left-32 w-64 h-64 blur-[80px] opacity-[0.05] rounded-full pointer-events-none" style={{ backgroundColor: theme.accent }} />

                {content}
            </motion.div>
        </div>
    )
}

function ExternalWidget({ block, theme, toneStyle, className, t, isMini = false }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptInjected = useRef(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const codeStr = block.content.code || "";
    const isFloating = codeStr.includes('data-style="floating"') || isMini;
    const isKardlyWidget = codeStr.includes('/api/widget.js');

    // Extract attributes for Kardly widgets (supports both double and single quotes)
    const extractAttr = (attr: string) => {
        const match = codeStr.match(new RegExp(`${attr}=["']([^"']*)["']`));
        return match ? match[1] : "";
    };

    const extractedType = extractAttr('data-type');
    
    // Fallback: detect widget type from title if data-type extraction fails
    const detectTypeFromTitle = (titleStr: string): string => {
        if (!titleStr) return '';
        const t2 = titleStr.toLowerCase();
        if (t2.includes('randevu') || t2.includes('booking') || t2.includes('appointment')) return 'booking';
        if (t2.includes('iletişim') || t2.includes('iletisim') || t2.includes('lead') || t2.includes('contact')) return 'lead';
        if (t2.includes('ai') || t2.includes('asistan') || t2.includes('assistant') || t2.includes('sohbet')) return 'ai';
        if (t2.includes('video') || t2.includes('izle')) return 'video';
        if (t2.includes('yetenek') || t2.includes('skill')) return 'skills';
        if (t2.includes('geri sayım') || t2.includes('countdown') || t2.includes('sayım')) return 'countdown';
        if (t2.includes('portfolyo') || t2.includes('portfolio') || t2.includes('galeri')) return 'portfolio';
        if (t2.includes('yazılımcı') || t2.includes('yazilimci') || t2.includes('tech') || t2.includes('teknoloji')) return 'tech';
        if (t2.includes('blog') || t2.includes('rss') || t2.includes('makale')) return 'blog';
        return '';
    };
    
    const widgetType = extractedType || detectTypeFromTitle(block.content?.title || '') || 'booking';
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
                        src={`/${widgetUser}?widget=${widgetType}&embed=true`}
                        className={`w-full ${iframeHeight} border-none`}
                        allow="autoplay; fullscreen"
                        style={{ borderRadius: 'inherit' }}
                    />
                );
            default:
                return (
                    <iframe
                        src={`/${widgetUser}?widget=${widgetType}&embed=true`}
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
                                    "relative w-full max-w-[400px] h-fit max-h-[85vh] overflow-hidden shadow-2xl border backdrop-blur-2xl",
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
                                            src={`/${widgetUser}?widget=${widgetType}&embed=true`}
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

    // ─── INLINE MODE: Action Buttons for interactive widgets, compact blocks for informational ones ───
    const isInteractiveWidget = ['booking', 'lead', 'ai', 'chat', 'video'].includes(widgetType);

    if (isInteractiveWidget) {
        // Render as a sleek action button that opens a modal
        const typeConfig: Record<string, { icon: any; label: string; desc: string }> = {
            booking: { icon: <Calendar size={20} />, label: block.content?.title || t.bookingLabel || 'Randevu', desc: t.bookAppointmentDesc || 'Hemen randevu oluşturun' },
            lead: { icon: <MessageSquare size={20} />, label: block.content?.title || t.leadLabel || 'İletişim', desc: t.sendMessageDesc || 'Mesaj gönderin' },
            ai: { icon: <Bot size={20} />, label: block.content?.title || t.aiLabel || 'AI Asistan', desc: t.askAIDesc || 'Yapay zeka ile sohbet edin' },
            chat: { icon: <Bot size={20} />, label: block.content?.title || t.aiLabel || 'AI Asistan', desc: t.askAIDesc || 'Yapay zeka ile sohbet edin' },
            video: { icon: <Play size={20} />, label: block.content?.title || t.videoLabel || 'Video', desc: t.watchVideoDesc || 'Videoyu izleyin' },
        };
        const config = typeConfig[widgetType] || typeConfig.booking;

        return (
            <>
                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className={cn(
                        "w-full flex items-center gap-4 p-4 sm:p-5 border backdrop-blur-xl transition-all cursor-pointer group",
                        toneStyle.rounded
                    )}
                    style={{
                        background: `linear-gradient(135deg, ${theme.accent}12, ${theme.accent}06)`,
                        borderColor: `${theme.accent}25`,
                        boxShadow: `0 4px 20px -8px ${theme.accent}20`,
                    }}
                >
                    <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                        style={{ background: `${theme.accent}18`, color: theme.accent }}
                    >
                        {config.icon}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                        <h4 className={cn("text-[11px] font-black uppercase tracking-widest truncate", theme.text)}>
                            {config.label}
                        </h4>
                        <p className={cn("text-[9px] font-bold uppercase tracking-wider opacity-40 truncate", theme.text)}>
                            {config.desc}
                        </p>
                    </div>
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 opacity-40 group-hover:opacity-100 transition-all"
                        style={{ color: theme.accent }}
                    >
                        <ExternalLink size={16} />
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
                                    "relative w-full max-w-[400px] h-fit max-h-[85vh] overflow-hidden shadow-2xl border backdrop-blur-2xl",
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
                                    {renderInternalWidget(true)}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        );
    }

    // ─── NON-INTERACTIVE (informational) widgets: render directly but compact ───
    return (
        <div className={cn("w-full p-0 flex flex-col items-center gap-4 relative", isKardlyWidget ? "" : cn("p-6 border text-center", theme.card, theme.border, toneStyle.rounded))} id="external-inline-widget">
            {!isKardlyWidget && (
                <>
                    {block.content?.title && (
                        <div className="flex items-center gap-2 w-full mb-1">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${theme.accent}15`, color: theme.accent }}>
                                {widgetType === 'skills' ? <Zap size={14} /> : widgetType === 'countdown' ? <Clock size={14} /> : widgetType === 'tech' ? <Code size={14} /> : widgetType === 'portfolio' ? <Image size={14} /> : widgetType === 'blog' ? <Rss size={14} /> : <Zap size={14} />}
                            </div>
                            <h4 className={cn("text-[10px] font-black uppercase tracking-[0.2em] opacity-60", theme.text)}>
                                {block.content.title}
                            </h4>
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
                    <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full sm:max-w-4xl aspect-video bg-black rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 z-10"
                        >
                            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto my-5 sm:hidden shrink-0 absolute top-0 left-1/2 -translate-x-1/2 z-20" />
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="absolute top-6 right-6 text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center z-20"
                            >
                                <X size={24} />
                            </button>
                            <iframe 
                                src={getEmbedUrl(url)} 
                                className="w-full h-full relative z-10" 
                                allow="autoplay; fullscreen" 
                            />
                        </motion.div>
                    </div>
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
        <div 
            className={cn("w-full p-8 flex flex-col gap-6 border shadow-2xl relative overflow-hidden transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]", theme.card, theme.border, toneStyle.rounded)}
            style={{ 
                backgroundColor: `${theme.accent}0a`,
                borderColor: `${theme.accent}20`,
                boxShadow: `0 30px 60px -15px ${theme.accent}20` 
            }}
        >
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

            <div className={cn("relative aspect-square w-full overflow-hidden group shadow-2xl border", toneStyle.rounded)} style={{ borderColor: `${theme.accent}20` }}>
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
        <div 
            className={cn("w-full p-10 flex flex-col gap-8 border shadow-2xl relative overflow-hidden transition-all duration-500", theme.card, theme.border, toneStyle.rounded)}
            style={{ 
                backgroundColor: `${theme.accent}0a`,
                borderColor: `${theme.accent}25`,
                boxShadow: `0 30px 70px -15px ${theme.accent}25`
            }}
        >
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
                        className={cn("px-5 py-2.5 text-[10px] font-black uppercase tracking-widest border transition-all hover:scale-105 shadow-sm", theme.card, theme.border, toneStyle.rounded)}
                        style={{ borderColor: `${theme.accent}30`, backgroundColor: `${theme.accent}10` }}
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
                                {post.thumbnail && !post.thumbnail.includes('medium.com/isArticleOpen/') && (
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

function CVPreviewModal({ url, isOpen, onClose, t, theme, toneStyle, profile }: any) {
    if (!url) return null;

    const embedUrl = url.startsWith('data:') 
        ? url 
        : `https://docs.google.com/gview?url=${encodeURIComponent(url.startsWith('/') ? `https://www.kardly.site${url}` : url)}&embedded=true`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />
                    
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 350 }}
                        className={cn(
                            "relative w-full sm:max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl border overflow-hidden rounded-t-[2.5rem] sm:rounded-[2.5rem] pb-20 sm:pb-0",
                            theme.card, theme.border, toneStyle.font
                        )}
                    >
                        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto my-5 sm:hidden shrink-0" />

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 sm:p-6 border-b border-white/5 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${theme.accent}15`, color: theme.accent }}>
                                    <FileText size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className={cn("text-[11px] font-black uppercase tracking-widest", theme.text)}>
                                        {t.cvPreviewTitle || "BELGE ÖNİZLEME"}
                                    </h3>
                                    <p className="text-[7px] font-bold uppercase tracking-widest opacity-30">KARDLY SECURE VIEW</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={async () => {
                                        try {
                                            const res = await fetch(url);
                                            const blob = await res.blob();
                                            const contentType = res.headers.get('content-type') || 'application/pdf';
                                            const ext = contentType.includes('pdf') ? '.pdf' 
                                                : contentType.includes('word') || contentType.includes('docx') ? '.docx'
                                                : contentType.includes('doc') ? '.doc'
                                                : '.pdf';
                                            const downloadBlob = new Blob([blob], { type: contentType });
                                            const blobUrl = URL.createObjectURL(downloadBlob);
                                            const link = document.createElement('a');
                                            link.href = blobUrl;
                                            link.download = `kardly-cv${ext}`;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            URL.revokeObjectURL(blobUrl);
                                        } catch (e) {
                                            window.open(url, '_blank');
                                        }
                                    }}
                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                                    title={t.download || "İndir"}
                                >
                                    <Download size={20} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className={cn("w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all opacity-40 hover:opacity-100", theme.text)}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-white relative overflow-hidden">
                            <iframe 
                                src={embedUrl}
                                className="w-full h-full border-none"
                                title="CV Preview"
                            />
                            {/* Loading Overlay */}
                            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center gap-4 bg-zinc-950/10 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                                <div className="w-10 h-10 rounded-full border-b-2 border-white/20 animate-spin" style={{ borderBottomColor: theme.accent }} />
                            </div>
                        </div>

                        {/* Footer (Mobile Only Shortcut) */}
                        <div className="px-8 py-5 sm:hidden border-t bg-black/20 backdrop-blur-xl border-white/5 flex items-center justify-center">
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.25em] shadow-2xl active:scale-95 transition-all w-full justify-center"
                                style={{ 
                                    backgroundColor: profile.buttonColor || theme.accent, 
                                    color: (profile.buttonColor || theme.accent) === 'transparent' ? 'currentColor' : (isDarkColor(profile.buttonColor || theme.accent) ? '#fff' : '#000') 
                                }}
                            >
                                {t.download || "İndir"}
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}



function MastersCraftTemplate({ profile, colorScheme, handleShare, handleCVView, handleAddToContacts, reviews, isReviewModalOpen, setIsReviewModalOpen, setIsAppointmentOpen, isAppointmentOpen, t, trackEvent, tone, setReviewStatus, reviewStatus, setIsQrOpen, lang, setLang, isWalletModalOpen, setIsWalletModalOpen, qrDataUrl, isQrOpen, toneStyle, copied, setIsLeadModalOpen, isLeadModalOpen, setLeadStatus, leadStatus, isAIChatOpen, setIsAIChatOpen, chatMessages, setChatMessages, aiConfig, isEmbedMode, translateText, isCVModalOpen, setIsCVModalOpen, cvViewUrl, selectedProject, setSelectedProject, setCurrentArticle, isArticleOpen, setIsArticleOpen }: any) {
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    useEffect(() => {
        if (reviews?.length > 1) {
            const interval = setInterval(() => {
                setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [reviews?.length]);

    const craftConfigs: Record<string, any> = {
        masters_plumber: {
            bg: "bg-gradient-to-b from-[#0c1e35] via-[#0a1628] to-[#060d17]",
            card: "bg-[#0d1f3c]/80 backdrop-blur-2xl",
            headerBg: "from-[#0369a1] to-[#0284c7]",
            accent: "#38bdf8",
            accentDark: "#0369a1",
            text: "text-white",
            subtext: "text-blue-200/60",
            border: "border-blue-500/20",
            icon: "💧",
            craftIcon: <Droplets size={28} />,
            craftName: lang === 'tr' ? "Su Tesisatçısı" : "Plumber",
            ctaLabel: lang === 'tr' ? "ACİL SERVİS" : "EMERGENCY SERVICE",
            ctaIcon: <Phone size={20} />,
            quoteLabel: lang === 'tr' ? "TEKLİF AL" : "GET A QUOTE",
            patternType: "water",
            tagline: lang === 'tr' ? "Güvenilir Tesisat Çözümleri" : "Reliable Plumbing Solutions",
            badges: lang === 'tr' ? ["7/24 Acil", "Garantili İş", "Ücretsiz Keşif"] : ["24/7 Emergency", "Guaranteed", "Free Inspection"],
        },
        masters_electrician: {
            bg: "bg-gradient-to-b from-[#1a1005] via-[#0f0a05] to-[#050300]",
            card: "bg-[#1a1005]/80 backdrop-blur-2xl",
            headerBg: "from-[#b45309] to-[#d97706]",
            accent: "#f59e0b",
            accentDark: "#92400e",
            text: "text-white",
            subtext: "text-amber-200/60",
            border: "border-amber-500/20",
            icon: "⚡",
            craftIcon: <Zap size={28} />,
            craftName: lang === 'tr' ? "Elektrik Ustası" : "Electrician",
            ctaLabel: lang === 'tr' ? "ACİL ELEKTRİK" : "EMERGENCY POWER",
            ctaIcon: <Zap size={20} />,
            quoteLabel: lang === 'tr' ? "TEKLİF AL" : "GET A QUOTE",
            patternType: "circuit",
            tagline: lang === 'tr' ? "Güvenli Elektrik Tesisat Çözümleri" : "Safe Electrical Solutions",
            badges: lang === 'tr' ? ["Lisanslı Usta", "7/24 Arıza", "Sertifikalı"] : ["Licensed", "24/7 Repair", "Certified"],
        },
        masters_painter: {
            bg: "bg-gradient-to-b from-[#1a0520] via-[#0f0315] to-[#050108]",
            card: "bg-[#1a0520]/60 backdrop-blur-2xl",
            headerBg: "from-[#be185d] to-[#ec4899]",
            accent: "#ec4899",
            accentDark: "#9d174d",
            text: "text-white",
            subtext: "text-pink-200/60",
            border: "border-pink-500/20",
            icon: "🎨",
            craftIcon: <Palette size={28} />,
            craftName: lang === 'tr' ? "Boya & Badana Ustası" : "Painter",
            ctaLabel: lang === 'tr' ? "RENK DANIŞMANLIĞI" : "COLOR CONSULTING",
            ctaIcon: <Palette size={20} />,
            quoteLabel: lang === 'tr' ? "ÜCRETSİZ KEŞİF" : "FREE ESTIMATE",
            patternType: "splash",
            tagline: lang === 'tr' ? "Yaratıcı Boya & Dekorasyon" : "Creative Paint & Decoration",
            badges: lang === 'tr' ? ["İtalyan Boya", "Özel Efekt", "Dış Cephe"] : ["Premium Paint", "Special Effects", "Exterior"],
        },
        masters_carpenter: {
            bg: "bg-gradient-to-b from-[#1c1208] via-[#140f0a] to-[#0a0704]",
            card: "bg-[#1c1208]/80 backdrop-blur-2xl",
            headerBg: "from-[#92400e] to-[#b45309]",
            accent: "#d97706",
            accentDark: "#78350f",
            text: "text-white",
            subtext: "text-orange-200/60",
            border: "border-orange-500/20",
            icon: "🪵",
            craftIcon: <Briefcase size={28} />,
            craftName: lang === 'tr' ? "Mobilya & Marangoz" : "Carpenter",
            ctaLabel: lang === 'tr' ? "ÖZEL SİPARİŞ" : "CUSTOM ORDER",
            ctaIcon: <Briefcase size={20} />,
            quoteLabel: lang === 'tr' ? "FİYAT TEKLİFİ" : "GET A QUOTE",
            patternType: "wood",
            tagline: lang === 'tr' ? "El İşçiliği & Ahşap Sanatı" : "Handcrafted Woodwork",
            badges: lang === 'tr' ? ["Masif Ahşap", "Özel Tasarım", "Montaj Dahil"] : ["Solid Wood", "Custom Design", "Installation"],
        },
        masters_auto: {
            bg: "bg-gradient-to-b from-[#0f0505] via-[#0a0a0b] to-[#050505]",
            card: "bg-zinc-900/60 backdrop-blur-2xl",
            headerBg: "from-[#991b1b] to-[#dc2626]",
            accent: "#ef4444",
            accentDark: "#7f1d1d",
            text: "text-white",
            subtext: "text-zinc-400",
            border: "border-red-500/20",
            icon: "🔧",
            craftIcon: <Settings size={28} />,
            craftName: lang === 'tr' ? "Oto Servis & Bakım" : "Auto Service",
            ctaLabel: lang === 'tr' ? "RANDEVU AL" : "BOOK SERVICE",
            ctaIcon: <Calendar size={20} />,
            quoteLabel: lang === 'tr' ? "ARAÇ KONTROL" : "CAR CHECK",
            patternType: "gear",
            tagline: lang === 'tr' ? "Profesyonel Araç Bakım & Onarım" : "Professional Auto Care",
            badges: lang === 'tr' ? ["Orijinal Parça", "Garantili", "Ücretsiz Check-up"] : ["OEM Parts", "Warranty", "Free Check-up"],
        },
        masters_renovation: {
            bg: "bg-gradient-to-b from-[#0a0a05] via-[#050505] to-[#020202]",
            card: "bg-[#111]/80 backdrop-blur-2xl",
            headerBg: "from-[#a16207] to-[#ca8a04]",
            accent: "#eab308",
            accentDark: "#854d0e",
            text: "text-white",
            subtext: "text-slate-400",
            border: "border-yellow-500/20",
            icon: "👷",
            craftIcon: <Shield size={28} />,
            craftName: lang === 'tr' ? "İnşaat & Tadilat" : "Construction",
            ctaLabel: lang === 'tr' ? "ÜCRETSİZ KEŞİF" : "FREE SURVEY",
            ctaIcon: <MapPin size={20} />,
            quoteLabel: lang === 'tr' ? "PROJE TEKLİFİ" : "PROJECT QUOTE",
            patternType: "blueprint",
            tagline: lang === 'tr' ? "Anahtar Teslim Tadilat" : "Turnkey Renovation",
            badges: lang === 'tr' ? ["Anahtar Teslim", "Proje Yönetimi", "Sözleşmeli"] : ["Turnkey", "Managed", "Contract"],
        },
        uni_blue: {
            bg: "bg-gradient-to-b from-[#0c1e35] via-[#0a1628] to-[#060d17]",
            card: "bg-[#0d1f3c]/80 backdrop-blur-2xl",
            headerBg: "from-[#1e40af] to-[#3b82f6]",
            accent: "#60a5fa",
            accentDark: "#1e3a8a",
            text: "text-white",
            subtext: "text-blue-200/60",
            border: "border-blue-500/20",
            icon: "💎",
            craftIcon: <Briefcase size={28} />,
            craftName: lang === 'tr' ? "Profesyonel Profil" : "Professional Profile",
            ctaLabel: lang === 'tr' ? "İLETİŞİME GEÇ" : "GET IN TOUCH",
            ctaIcon: <Phone size={20} />,
            quoteLabel: lang === 'tr' ? "TEKLİF AL" : "GET A QUOTE",
            patternType: "mesh",
            tagline: "",
            badges: [],
        },
        uni_emerald: {
            bg: "bg-gradient-to-b from-[#06140e] via-[#040d09] to-[#020604]",
            card: "bg-[#06140e]/80 backdrop-blur-2xl",
            headerBg: "from-[#065f46] to-[#10b981]",
            accent: "#34d399",
            accentDark: "#064e3b",
            text: "text-white",
            subtext: "text-emerald-200/60",
            border: "border-emerald-500/20",
            icon: "🌿",
            craftIcon: <Sparkles size={28} />,
            craftName: lang === 'tr' ? "Business Pro" : "Business Pro",
            ctaLabel: lang === 'tr' ? "BİZE ULAŞIN" : "CONTACT US",
            ctaIcon: <MessageCircle size={20} />,
            quoteLabel: lang === 'tr' ? "RANDEVU AL" : "BOOK NOW",
            patternType: "dots",
            tagline: "",
            badges: [],
        },
        uni_purple: {
            bg: "bg-gradient-to-b from-[#1a0520] via-[#0f0315] to-[#050108]",
            card: "bg-[#1a0520]/80 backdrop-blur-2xl",
            headerBg: "from-[#6b21a8] to-[#a855f7]",
            accent: "#c084fc",
            accentDark: "#4c1d95",
            text: "text-white",
            subtext: "text-purple-200/60",
            border: "border-purple-500/20",
            icon: "✨",
            craftIcon: <Award size={28} />,
            craftName: lang === 'tr' ? "Premium Elite" : "Premium Elite",
            ctaLabel: lang === 'tr' ? "PRESTİJ ÇÖZÜMLER" : "PRESTIGE SOLUTIONS",
            ctaIcon: <Star size={20} />,
            quoteLabel: lang === 'tr' ? "TEKLİF AL" : "GET A QUOTE",
            patternType: "mesh",
            tagline: "",
            badges: [],
        },
        uni_amber: {
            bg: "bg-gradient-to-b from-[#1a1005] via-[#0f0a05] to-[#050300]",
            card: "bg-[#1a1005]/80 backdrop-blur-2xl",
            headerBg: "from-[#92400e] to-[#f59e0b]",
            accent: "#fbbf24",
            accentDark: "#78350f",
            text: "text-white",
            subtext: "text-amber-200/60",
            border: "border-amber-500/20",
            icon: "🌅",
            craftIcon: <Zap size={28} />,
            craftName: lang === 'tr' ? "Dynamic Edge" : "Dynamic Edge",
            ctaLabel: lang === 'tr' ? "ENERJİNİ YÜKSELT" : "BOOST ENERGY",
            ctaIcon: <Activity size={20} />,
            quoteLabel: lang === 'tr' ? "HEMEN BAŞLA" : "START NOW",
            patternType: "circuit",
            tagline: "",
            badges: [],
        },
        uni_slate: {
            bg: "bg-gradient-to-b from-[#0f172a] via-[#020617] to-[#000000]",
            card: "bg-slate-900/60 backdrop-blur-2xl",
            headerBg: "from-[#334155] to-[#64748b]",
            accent: "#cbd5e1",
            accentDark: "#0f172a",
            text: "text-white",
            subtext: "text-slate-400",
            border: "border-slate-700/50",
            icon: "🌑",
            craftIcon: <Shield size={28} />,
            craftName: lang === 'tr' ? "Pure Minimal" : "Pure Minimal",
            ctaLabel: lang === 'tr' ? "KEŞFET" : "EXPLORE",
            ctaIcon: <Globe size={20} />,
            quoteLabel: lang === 'tr' ? "İLETİŞİM" : "CONTACT",
            patternType: "dots",
            tagline: "",
            badges: [],
        },
        uni_midnight: {
            bg: "bg-gradient-to-b from-[#000000] via-[#050505] to-[#080808]",
            card: "bg-zinc-900/80 backdrop-blur-2xl",
            headerBg: "from-[#111] to-[#333]",
            accent: "#d4af37",
            accentDark: "#000000",
            text: "text-amber-100",
            subtext: "text-amber-500/30",
            border: "border-amber-500/20",
            icon: "🌌",
            craftIcon: <Crown size={28} />,
            craftName: lang === 'tr' ? "Midnight Gold" : "Midnight Gold",
            ctaLabel: lang === 'tr' ? "AYRICALIKLI HİZMET" : "EXCLUSIVE SERVICE",
            ctaIcon: <UserCheck size={20} />,
            quoteLabel: lang === 'tr' ? "TEKLİF AL" : "GET A QUOTE",
            patternType: "mesh",
            tagline: "",
            badges: [],
        }
    };

    const craft = craftConfigs[colorScheme] || craftConfigs.masters_plumber;

    const theme = {
        ...craft,
        isLight: false,
        accent: getContrastingAccent(profile.themeColor || craft.accent, false),
        body: craft.bg,
        btn: "bg-white/10 border-white/10 hover:bg-white/20",
        btnText: "text-white"
    };

    // Dinamik renk düzeltmeleri (Eğer kullanıcı renk seçmişse)
    if (profile.themeColor) {
        theme.headerBg = theme.accent;
        theme.accentDark = theme.accent;
        theme.glow = `shadow-[0_0_50px_rgba(${hexToRgb(theme.accent)},0.3)]`;
    }
    const socialLinks = profile.socialLinks || [];
    const phoneNumber = socialLinks.find((l: any) => l.platform === 'phone')?.url || profile.phone;
    const whatsappNumber = (socialLinks.find((l: any) => l.platform === 'whatsapp')?.url || phoneNumber || "").replace(/\D/g, '');

    const formatUrl = (url?: string) => {
        if (!url) return "";
        const trimmed = url.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('tel:') || trimmed.startsWith('mailto:')) return trimmed;
        return `https://${trimmed}`;
    };

    const customLinksEntry = (socialLinks || []).find((l: any) => l.platform === 'customLinks');
    const customLinks = customLinksEntry?.links || [];

    // Filter out email from socials if it matches profile email to avoid duplicates
    const platformButtons = (socialLinks || [])
        .filter((l: any) => {
            if (!l.url) return false;
            if (l.platform === 'customLinks') return false;
            if (['phone', 'whatsapp', 'location', 'email'].includes(l.platform.toLowerCase())) return false;
            return true;
        })
        .map((l: any) => ({
            id: l.platform.toLowerCase(),
            label: l.platform.charAt(0).toUpperCase() + l.platform.slice(1),
            icon: getHeroIcon(l.platform, 20, l.url),
            href: formatUrl(l.url),
            onClick: () => trackEvent("social_button", l.platform),
            active: true
        }));

    const customButtons = customLinks.map((l: any, idx: number) => ({
        id: `custom-${idx}`,
        label: l.title,
        icon: <Globe size={20} />,
        href: formatUrl(l.url),
        onClick: () => trackEvent("custom_button", l.title),
        active: true
    }));

    const actions = [
        { 
            id: 'phone',
            label: craft.ctaLabel, 
            subLabel: "7/24",
            icon: craft.ctaIcon, 
            href: `tel:${phoneNumber}`, 
            onClick: () => trackEvent("phone"),
            active: !!phoneNumber,
            isPrimary: true
        },
        { 
            id: 'whatsapp',
            label: craft.quoteLabel, 
            subLabel: "WHATSAPP",
            icon: <MessageCircle size={22} />, 
            href: `https://wa.me/${whatsappNumber}`, 
            onClick: () => trackEvent("whatsapp"),
            active: !!whatsappNumber,
            isWhatsApp: true
        },
        { 
            id: 'contact',
            label: t.contactMeTitle, 
            icon: <MessageSquare size={20} />, 
            onClick: () => { trackEvent("contact_form"); setIsLeadModalOpen(true); },
            active: true
        },
        { 
            id: 'appointment',
            label: t.appointmentBtn || "RANDEVU AL", 
            subLabel: "REZEVASYON",
            icon: <Calendar size={20} />, 
            onClick: () => { trackEvent("appointment_click"); setIsAppointmentOpen(true); },
            active: !!profile.showAppointmentBtn
        },
        { 
            id: 'email',
            label: t.emailBtn || "E-MAIL", 
            subLabel: "EMAIL",
            icon: <Mail size={22} />, 
            href: `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.user?.email}`,
            onClick: () => trackEvent("email"),
            active: !!profile.user?.email
        },
        ...platformButtons,
        ...customButtons,
        { 
            id: 'location',
            label: t.locationsBtn || "ADRES", 
            subLabel: "KONUM",
            icon: <MapPin size={22} />, 
            href: formatUrl(socialLinks.find((l: any) => l.platform === 'location')?.url),
            onClick: () => trackEvent("location"),
            active: !!socialLinks.find((l: any) => l.platform === 'location')?.url
        }
    ].filter(a => a.active);

    const buttonRadiusClass = profile.buttonShape === 'square' ? 'rounded-none' : profile.buttonShape === 'pill' ? 'rounded-full' : 'rounded-2xl';
    const iconRadiusClass = profile.buttonShape === 'square' ? 'rounded-none' : profile.buttonShape === 'pill' ? 'rounded-2xl' : 'rounded-xl';


    // Craft-specific background patterns
    const CraftBackground = () => {
        switch (craft.patternType) {
            case "water":
                return (
                    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 to-transparent" />
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: -30, opacity: 0 }}
                                animate={{ y: [0, 800], opacity: [0, 0.3, 0] }}
                                transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 8, ease: "linear" }}
                                className="absolute"
                                style={{ left: `${5 + Math.random() * 90}%`, color: `${theme.accent}40` }}
                            >
                                <Droplets size={16 + Math.random() * 20} />
                            </motion.div>
                        ))}
                        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t" style={{ backgroundImage: `linear-gradient(to top, ${theme.accent}20, transparent)` }} />
                    </div>
                );
            case "circuit":
                return (
                    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(${theme.accent}60 1px, transparent 1px), linear-gradient(90deg, ${theme.accent}60 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.3, 0.5] }}
                                transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 + Math.random() * 6 }}
                                className="absolute"
                                style={{ top: `${Math.random() * 90}%`, left: `${Math.random() * 90}%`, color: theme.accent }}
                            >
                                <Zap size={40 + Math.random() * 30} />
                            </motion.div>
                        ))}
                    </div>
                );
            case "splash":
                return (
                    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-[120px] bg-pink-500" />
                        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.12, 0.06] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute top-1/2 -right-20 w-80 h-80 rounded-full blur-[100px] bg-cyan-400" />
                        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 12, repeat: Infinity, delay: 4 }} className="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full blur-[120px] bg-yellow-400" />
                        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }} transition={{ duration: 9, repeat: Infinity, delay: 1 }} className="absolute top-1/4 left-1/3 w-60 h-60 rounded-full blur-[80px] bg-purple-500" />
                    </div>
                );
            case "wood":
                return (
                    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${theme.accent} 0px, transparent 1px, transparent 8px, ${theme.accent} 9px), repeating-linear-gradient(0deg, transparent 0px, transparent 30px, ${theme.accent}10 30px, ${theme.accent}10 31px)`, backgroundSize: '9px 31px' }} />
                        <div className="absolute bottom-0 inset-x-0 h-60 bg-gradient-to-t" style={{ backgroundImage: `linear-gradient(to top, ${theme.accent}20, transparent)` }} />
                    </div>
                );
            case "gear":
                return (
                    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -top-32 -right-32 opacity-[0.06]" style={{ color: theme.accent }}>
                            <Settings size={280} />
                        </motion.div>
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute top-1/2 -left-24 opacity-[0.04]" style={{ color: theme.accent }}>
                            <Settings size={180} />
                        </motion.div>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -bottom-20 right-10 opacity-[0.03]" style={{ color: theme.accent }}>
                            <Settings size={120} />
                        </motion.div>
                        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle, ${theme.accent}30 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                    </div>
                );
            case "blueprint":
                return (
                    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `linear-gradient(${theme.accent}50 1px, transparent 1px), linear-gradient(90deg, ${theme.accent}50 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${theme.accent}30 1px, transparent 1px), linear-gradient(90deg, ${theme.accent}30 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to bottom, ${theme.accent}08, transparent)` }} />
                    </div>
                );
            case "mesh":
                return (
                    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.4]" style={{ 
                            background: `radial-gradient(circle at 20% 20%, ${theme.accent}15 0%, transparent 40%), radial-gradient(circle at 80% 80%, ${theme.accent}15 0%, transparent 40%)` 
                        }} />
                        <div className="absolute inset-0 opacity-[0.03]" style={{ 
                            backgroundImage: `linear-gradient(${theme.accent} 1px, transparent 1px), linear-gradient(90deg, ${theme.accent} 1px, transparent 1px)`,
                            backgroundSize: '40px 40px' 
                        }} />
                    </div>
                );
            case "dots":
                return (
                    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.05]" style={{ 
                            backgroundImage: `radial-gradient(${theme.accent} 1px, transparent 1px)`,
                            backgroundSize: '24px 24px' 
                        }} />
                        <motion.div 
                            animate={{ opacity: [0.02, 0.05, 0.02] }} 
                            transition={{ duration: 5, repeat: Infinity }} 
                            className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" 
                        />
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className={cn("min-h-screen relative overflow-x-hidden pb-32", craft.bg, toneStyle.font)}>
            <CraftBackground />

            {/* === CRAFT HEADER === */}
            <div className="relative z-10">
                {/* Diagonal Header Banner */}
                <div className={cn("relative h-56 overflow-hidden")} style={{ background: `linear-gradient(135deg, ${theme.accentDark}, ${theme.accent})` }}>
                    {/* Diagonal stripe pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }} />
                    
                    {/* Large craft icon watermark */}
                    <div className="absolute top-4 right-4 opacity-20 text-white">
                        <span className="text-[100px] leading-none">{craft.icon}</span>
                    </div>

                    {/* Hazard/Industry stripe at bottom */}
                    <div className="absolute bottom-0 inset-x-0 h-3" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${theme.accent}, ${theme.accent} 10px, transparent 10px, transparent 20px)`, opacity: 0.6 }} />

                    {/* Top navigation */}
                    <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
                        <button onClick={() => setIsQrOpen(true)} className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                            <QrCode size={18} />
                        </button>
                        <div className="flex gap-2">
                            <button onClick={() => setIsWalletModalOpen(true)} className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                <UserPlus size={18} />
                            </button>
                            <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center text-white font-black text-[10px] border border-white/20">
                                {lang.toUpperCase()}
                            </button>
                        </div>
                    </div>

                    {/* Craft badge centered */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="px-5 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center gap-2 text-white"
                        >
                            <span className="text-lg">{craft.icon}</span>
                            <span className="font-black text-[10px] uppercase tracking-[0.2em]">{craft.craftName}</span>
                        </motion.div>
                    </div>
                </div>

                {/* Profile Card - overlapping header */}
                <main className="max-w-md mx-auto px-4 -mt-16 relative z-20">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={cn("rounded-3xl border p-6 relative overflow-hidden", theme.card, theme.border)}
                        style={{ boxShadow: `0 25px 60px -15px ${theme.accent}30` }}
                    >
                        {/* Subtle accent line at top of card */}
                        <div className="absolute top-0 inset-x-0 h-1 rounded-t-3xl" style={{ background: `linear-gradient(to right, ${theme.accent}, ${theme.accentDark})` }} />

                        {/* Avatar + Name */}
                        <div className="flex flex-col items-center text-center pt-2">
                            <div className="relative mb-4">
                                <div className="w-24 h-24 rounded-2xl border-2 overflow-hidden shadow-2xl" style={{ borderColor: `${theme.accent}60` }}>
                                    <img
                                        src={profile.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.user?.name || 'U')}&background=1a1a2e&color=fff&bold=true&size=256`}
                                        className="w-full h-full object-cover"
                                        alt={profile.user?.name}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                {/* Online / verified badge */}
                                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: theme.accent }}>
                                    {craft.craftIcon ? <Check size={14} /> : <Zap size={14} />}
                                </div>
                            </div>

                            <h1 className={cn("text-xl font-black uppercase tracking-tight", theme.text)}>
                                {profile.user?.name || "Usta"}
                            </h1>
                            <p className={cn("text-[11px] font-bold uppercase tracking-[0.2em] mt-1", theme.subtext)}>
                                {profile.occupation || craft.craftName}
                            </p>

                            {/* Craft Tagline */}
                            {craft.tagline && (
                                <div className="mt-3 px-4 py-1.5 rounded-full border flex items-center gap-2" style={{ borderColor: `${theme.accent}30`, backgroundColor: `${theme.accent}10` }}>
                                    <div style={{ color: theme.accent }}>{craft.craftIcon}</div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.15em]" style={{ color: theme.accent }}>{craft.tagline}</span>
                                </div>
                            )}

                            <SocialIconsBar 
                                profile={profile} 
                                socialLinks={socialLinks} 
                                t={t} 
                                trackEvent={trackEvent} 
                                getHeroIcon={getHeroIcon} 
                                formatUrl={formatUrl}
                                theme={theme}
                            />
                        </div>

                        {/* Badges row */}
                        <div className="flex justify-center gap-2 mt-5 flex-wrap">
                            {craft.badges.map((badge: string, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="px-3 py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5"
                                    style={{ borderColor: `${theme.accent}30`, backgroundColor: `${theme.accent}08`, color: theme.accent }}
                                >
                                    <Check size={10} />
                                    {badge}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* === ACTION BUTTONS === */}
                    <div className={cn(
                        "mt-5",
                        profile.buttonLayout === 'grid' ? "grid grid-cols-2 gap-3" : 
                        profile.buttonLayout === 'balanced' ? "grid grid-cols-2 gap-3 [&>*:last-child:nth-child(odd)]:col-span-2" : 
                        "space-y-3"
                    )}>
                        {actions.map((action, i) => (
                            <motion.div
                                key={action.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 + (i * 0.05) }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full"
                            >
                                {action.href ? (
                                    <a
                                        href={action.href}
                                        target={action.id !== 'phone' ? "_blank" : undefined}
                                        onClick={action.onClick}
                                        className={cn(
                                            "w-full flex items-center gap-4 font-black transition-all relative overflow-hidden",
                                            profile.buttonLayout === 'stack' ? cn("py-4 px-5", buttonRadiusClass) : cn("py-4 px-3 flex-col text-center", buttonRadiusClass),
                                            action.isPrimary ? "text-white shadow-2xl" : cn("border", theme.text, theme.border)
                                        )}
                                        style={action.isPrimary ? { 
                                            background: profile.buttonColor ? profile.buttonColor : `linear-gradient(135deg, ${theme.accentDark}, ${theme.accent})`, 
                                            boxShadow: profile.buttonLayout === 'stack' ? `0 10px 30px -10px ${profile.buttonColor || theme.accent}80` : `0 5px 15px -5px ${profile.buttonColor || theme.accent}50`
                                        } : {
                                            backgroundColor: profile.buttonColor ? `${profile.buttonColor}15` : (action.isWhatsApp ? `${theme.accent}10` : action.id === 'email' ? `${theme.accent}10` : action.id === 'appointment' ? `${theme.accent}12` : action.id === 'location' ? `${theme.accent}10` : `${theme.accent}08`),
                                            borderColor: profile.buttonColor ? `${profile.buttonColor}40` : undefined
                                        }}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center backdrop-blur-sm",
                                            profile.buttonLayout === 'stack' ? cn("w-12 h-12", iconRadiusClass) : cn("w-10 h-10", iconRadiusClass),
                                            action.isPrimary ? "bg-white/20" : "border",
                                        )} style={!action.isPrimary ? { 
                                            borderColor: profile.buttonColor ? `${profile.buttonColor}40` : `${theme.accent}40`, 
                                            backgroundColor: profile.buttonColor ? `${profile.buttonColor}15` : `${theme.accent}15`, 
                                            color: profile.buttonColor || theme.accent 
                                        } : {}}>
                                            {action.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            {action.subLabel && <span className={cn("opacity-60 tracking-[0.3em]", profile.buttonLayout === 'stack' ? "text-[7px]" : "text-[6px]")}>{action.subLabel}</span>}
                                            <span className={cn("uppercase tracking-widest", profile.buttonLayout === 'stack' ? "text-sm" : "text-[10px]")}>{action.label}</span>
                                        </div>
                                        {profile.buttonLayout === 'stack' && (
                                            action.isPrimary ? (
                                                <div className="ml-auto flex items-center gap-1 text-white/60">
                                                    <Phone size={16} className="animate-pulse" />
                                                </div>
                                            ) : (
                                                <ArrowRight size={18} className="ml-auto opacity-40" style={{ color: theme.accent }} />
                                            )
                                        )}
                                        {action.isPrimary && (
                                            <motion.div
                                                animate={{ x: ['-100%', '200%'] }}
                                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                                                className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                                            />
                                        )}
                                    </a>
                                ) : (
                                    <button
                                        onClick={action.onClick}
                                        className={cn(
                                            "w-full flex items-center gap-4 font-black transition-all relative overflow-hidden",
                                            profile.buttonLayout === 'stack' ? cn("py-4 px-5", buttonRadiusClass) : cn("py-4 px-3 flex-col text-center", buttonRadiusClass),
                                            cn("border", theme.text, theme.border)
                                        )}
                                        style={{ 
                                            backgroundColor: profile.buttonColor ? `${profile.buttonColor}15` : (action.id === 'appointment' ? `${theme.accent}12` : `${theme.accent}08`),
                                            borderColor: profile.buttonColor ? `${profile.buttonColor}40` : undefined
                                        }}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center border",
                                            profile.buttonLayout === 'stack' ? cn("w-12 h-12", iconRadiusClass) : cn("w-10 h-10", iconRadiusClass),
                                        )} style={{ borderColor: profile.buttonColor ? `${profile.buttonColor}30` : `${theme.accent}30`, color: profile.buttonColor || theme.accent }}>
                                            {action.icon}
                                        </div>
                                        <div className="flex flex-col">
                                             {action.subLabel && <span className={cn("opacity-40 tracking-[0.3em]", profile.buttonLayout === 'stack' ? "text-[7px]" : "text-[6px]")}>{action.subLabel}</span>}
                                             <span className={cn("uppercase tracking-widest", profile.buttonLayout === 'stack' ? "text-sm" : "text-[10px]", profile.buttonColor ? "" : theme.text)} style={profile.buttonColor ? { color: profile.buttonColor } : {}}>{action.label}</span>
                                        </div>
                                        {profile.buttonLayout === 'stack' && <ArrowRight size={18} className="ml-auto opacity-40" style={{ color: profile.buttonColor || theme.accent }} />}
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* === SERVICES SECTION - Work Order Style === */}
                    {profile.services?.length > 0 && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className={cn("mt-8 rounded-3xl border p-6 relative overflow-hidden", craft.card, craft.border)}
                        >
                            {/* Section Header */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${craft.accent}20`, color: craft.accent }}>
                                    <Briefcase size={16} />
                                </div>
                                <div>
                                    <h3 className={cn("text-xs font-black uppercase tracking-[0.2em]", craft.text)}>{t.services}</h3>
                                    <p className={cn("text-[9px] uppercase tracking-wider", craft.subtext)}>{lang === 'tr' ? 'Hizmet Alanlarımız' : 'Our Service Areas'}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {(profile.services || []).map((service: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: -10, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-3 p-3 rounded-xl border transition-all hover:border-opacity-50"
                                        style={{ borderColor: `${craft.accent}15`, backgroundColor: `${craft.accent}05` }}
                                    >
                                        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5" style={{ backgroundColor: `${craft.accent}15`, color: craft.accent }}>
                                            <Check size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={cn("text-[11px] font-black uppercase tracking-wider", craft.text)}>{translateText(service.title)}</h4>
                                            <p className={cn("text-[10px] mt-0.5 leading-relaxed", craft.subtext)}>{translateText(service.description)}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* === BIO === */}
                    {profile.bio && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className={cn("mt-6 rounded-3xl border p-6", craft.card, craft.border)}
                        >
                            <p className={cn("text-xs leading-relaxed text-center", craft.subtext)} style={{ color: profile.bioColor || undefined, fontSize: profile.bioFontSize || "12px" }}>
                                {profile.bio}
                            </p>
                            {profile.slogan && (
                                <p className={cn("text-center font-bold mt-3 italic text-sm")} style={{ color: profile.sloganColor || craft.accent }}>
                                    "{translateText(profile.slogan)}"
                                </p>
                            )}
                        </motion.div>
                    )}

                    {/* === PORTFOLIO / PROJECTS === */}
                    {profile.products?.filter((p: any) => p.image)?.length > 0 && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className={cn("mt-6 rounded-3xl border p-6", craft.card, craft.border)}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${craft.accent}20`, color: craft.accent }}>
                                    <Eye size={16} />
                                </div>
                                <h3 className={cn("text-xs font-black uppercase tracking-[0.2em]", craft.text)}>
                                    {lang === 'tr' ? 'İşlerimiz' : 'Our Work'}
                                </h3>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {profile.products.filter((p: any) => p.image).map((project: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer border"
                                        style={{ borderColor: `${craft.accent}20` }}
                                        onClick={() => {
                                            trackEvent("product_grid", project.name);
                                            if (project.link) window.open(formatUrl(project.link), "_blank");
                                            else setSelectedProject(project);
                                        }}
                                    >
                                        <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" decoding="async" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-2">
                                            <p className="text-[8px] font-black text-white uppercase tracking-tight line-clamp-2">{project.name}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* === REVIEWS === */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className={cn("mt-6 rounded-3xl border p-6", theme.card, theme.border)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
                                    <Star size={16} />
                                </div>
                                <h3 className={cn("text-xs font-black uppercase tracking-[0.2em]", theme.text)}>{t.reviews}</h3>
                            </div>
                            <button
                                onClick={() => setIsReviewModalOpen(true)}
                                className="px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5"
                                style={{ borderColor: `${theme.accent}30`, color: theme.accent }}
                            >
                                <Plus size={10} /> {t.writeReview}
                            </button>
                        </div>

                        {reviews.length > 0 ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentReviewIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 rounded-2xl border"
                                    style={{ borderColor: `${theme.accent}15`, backgroundColor: `${theme.accent}05` }}
                                >
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden border flex-shrink-0" style={{ borderColor: `${theme.accent}30` }}>
                                            <img
                                                src={reviews[currentReviewIndex].image?.includes('avatar.iran.liara.run') ? `https://ui-avatars.com/api/?name=${encodeURIComponent(reviews[currentReviewIndex].name)}&background=1a1a2e&color=e94560&bold=true&size=128` : (reviews[currentReviewIndex].image || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviews[currentReviewIndex].name)}&background=1a1a2e&color=e94560&bold=true&size=128`)}
                                                className="w-full h-full object-cover"
                                                alt={reviews[currentReviewIndex].name}
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between">
                                                <h4 className={cn("text-[11px] font-black", theme.text)}>{reviews[currentReviewIndex].name}</h4>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} className={i < reviews[currentReviewIndex].rating ? "fill-current text-amber-400" : "text-white/10"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className={cn("text-[10px] mt-1 italic leading-relaxed line-clamp-3", theme.subtext)}>
                                                &ldquo;{translateText(reviews[currentReviewIndex].content)}&rdquo;
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className={cn("p-6 rounded-2xl border text-center", theme.subtext)} style={{ borderColor: `${theme.accent}10` }}>
                                <MessageSquare size={24} className="mx-auto mb-2 opacity-20" />
                                <p className="text-[10px]">{t.noReviewsYet}</p>
                            </div>
                        )}
                        {reviews.length > 1 && (
                            <div className="flex justify-center gap-1.5 mt-3">
                                {reviews.map((_: any, i: number) => (
                                    <button key={i} onClick={() => setCurrentReviewIndex(i)} className="h-1.5 rounded-full transition-all" style={{ width: i === currentReviewIndex ? '20px' : '6px', background: i === currentReviewIndex ? theme.accent : 'rgba(255,255,255,0.1)' }} />
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* === BOTTOM ACTIONS === */}
                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={handleShare}
                            className={cn("flex-1 py-4 rounded-2xl border flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all", theme.text, theme.border)}
                            style={{ backgroundColor: `${theme.accent}08` }}
                        >
                            <Share2 size={14} style={{ color: theme.accent }} /> {t.shareLabel}
                        </button>
                        <button
                            onClick={handleCVView}
                            className="flex-[1.5] py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest text-white shadow-xl"
                            style={{ background: `linear-gradient(135deg, ${theme.accentDark}, ${theme.accent})`, boxShadow: `0 8px 20px -8px ${theme.accent}80` }}
                        >
                            <FileText size={14} /> {profile.isCatalog ? t.viewCatalog : t.viewCV}
                        </button>
                        {aiConfig?.isEnabled && (
                            <button
                                onClick={() => setIsAIChatOpen(true)}
                                className="w-14 py-4 rounded-2xl flex items-center justify-center text-white shadow-xl"
                                style={{ background: `linear-gradient(135deg, ${theme.accentDark}, ${theme.accent})` }}
                            >
                                <Bot size={20} />
                            </button>
                        )}
                    </div>

                {/* Articles Module */}
                <ArticlesSection 
                    articles={profile?.articles || []} 
                    t={t} 
                    theme={theme} 
                    setCurrentArticle={setCurrentArticle} 
                    setIsArticleOpen={setIsArticleOpen} 
                    trackEvent={trackEvent} 
                />

                </main>
            </div>

            {/* === MODALS === */}
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={async (newReview: any) => {
                    try {
                        const res = await fetch("/api/review/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newReview, profileId: profile.id }) });
                        if (res.ok) { setReviewStatus(t.reviewSuccessMsg); setTimeout(() => setReviewStatus(null), 5000); }
                    } catch (err) { console.error(err); }
                }}
                theme={theme} t={t} toneStyle={toneStyle}
            />
            <AppointmentModal isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} profile={profile} t={t} lang={lang} />
            <LeadModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                onSubmit={async (leadData: any) => {
                    try {
                        const res = await fetch("/api/leads/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...leadData, profileId: profile.id }) });
                        if (res.ok) { setLeadStatus(t.leadSuccessMsg); setTimeout(() => setLeadStatus(null), 5000); handleAddToContacts(); }
                    } catch (err) { console.error(err); }
                }}
                theme={theme} t={t} lang={lang} toneStyle={toneStyle} profileName={profile?.user?.name || ""}
            />
            <CVPreviewModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} url={cvViewUrl} theme={theme} t={t} toneStyle={toneStyle} profile={profile} />
            <AIChatAssistant isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} profile={profile} t={t} theme={theme} toneStyle={toneStyle} messages={chatMessages} setMessages={setChatMessages} aiConfig={aiConfig} />

            {/* Status toasts */}
            <AnimatePresence>
                {reviewStatus && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] backdrop-blur-2xl px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 border" style={{ borderColor: `${theme.accent}30`, backgroundColor: `${theme.accent}15`, color: theme.accent }}>
                        <CheckCircle2 size={14} /> {reviewStatus}
                    </motion.div>
                )}
                {leadStatus && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] backdrop-blur-2xl px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 border" style={{ borderColor: `${theme.accent}30`, backgroundColor: `${theme.accent}15`, color: theme.accent }}>
                        <CheckCircle2 size={14} /> {leadStatus}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Digital Business Card Modal (Shared) */}
            <QrModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} theme={theme} profile={profile} t={t} />

            {/* Wallet / Add to Contacts Modal (Shared) */}
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

            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelectedProject(null)}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 350 }}
                            className={cn("relative rounded-t-[2.5rem] sm:rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto border shadow-2xl pb-10 sm:pb-0", theme.card, theme.border)}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/10">
                                <X size={16} />
                            </button>

                            {/* Image */}
                            {selectedProject.image && (
                                <div className="aspect-video w-full overflow-hidden relative rounded-t-3xl sm:rounded-t-3xl">
                                    <img src={selectedProject.image} alt={selectedProject.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                </div>
                            )}

                            <div className="p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: craft.accent }} />
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{translateText(selectedProject.name)}</h3>
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed">{translateText(selectedProject.description) || t.noProjectDesc}</p>

                                {selectedProject.link && (
                                    <a
                                        href={formatUrl(selectedProject.link)}
                                        target="_blank"
                                        className="mt-5 w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg"
                                        style={{ background: `linear-gradient(135deg, ${craft.accentDark}, ${craft.accent})` }}
                                    >
                                        <Globe size={16} /> {lang === 'tr' ? 'Projeyi Görüntüle' : 'View Project'}
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <SocialProof t={t} theme={theme} />
        </div>
    );
}



function SocialIconsBar({ profile, socialLinks, t, trackEvent, getHeroIcon, formatUrl, theme }: any) {
    const barLinks = (socialLinks || [])
        .filter((l: any) => l.url && l.platform && l.platform !== 'customLinks' && !['phone', 'whatsapp', 'website', 'location'].includes(l.platform.toLowerCase()))
        .map((l: any) => ({
            platform: l.platform,
            url: formatUrl(l.url),
            icon: getHeroIcon(l.platform, 18, l.url)
        }));

    const customBarLinks = (socialLinks.find((l: any) => l.platform === 'customLinks')?.links || [])
        .filter((l: any) => l.url)
        .map((l: any) => ({
            platform: 'custom',
            title: l.title,
            url: formatUrl(l.url),
            icon: <Globe size={18} />
        }));

    const allIcons = [...barLinks, ...customBarLinks];
    if (allIcons.length === 0) return null;

    const isLight = theme?.isLight;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex flex-wrap justify-center gap-3 py-2 px-4 rounded-2xl backdrop-blur-md border mt-2",
                isLight ? "bg-black/5 border-black/10" : "bg-white/5 border-white/10"
            )}
        >
            {allIcons.map((icon, i) => (
                <motion.a
                    key={i}
                    href={icon.url}
                    target="_blank"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => trackEvent("social_icon_bar", icon.platform)}
                    className={cn(
                        "transition-colors p-1",
                        isLight ? "text-black/60 hover:text-black" : "text-white/60 hover:text-white"
                    )}
                    title={icon.platform !== 'custom' ? icon.platform : (icon as any).title}
                >
                    {icon.icon}
                </motion.a>
            ))}
        </motion.div>
    );
}

function ArticlesSection({ articles, t, theme, setCurrentArticle, setIsArticleOpen, trackEvent }: any) {
    const displayArticles = Array.isArray(articles) ? articles : [];
    
    if (displayArticles.length === 0) return null;

    return (
        <section className="space-y-6 pt-10">
            <div className="flex items-center gap-4 px-2">
                <div className="w-1.5 h-6 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ backgroundColor: theme?.accent || '#6366f1' }} />
                <h3 className={cn("text-[12px] font-black uppercase tracking-[0.3em] italic drop-shadow-md", theme?.isLight ? "text-slate-900/40" : "text-white/40")}>{t?.articlesTitle || "YAZILARIM"}</h3>
                <div className={cn("flex-1 h-[1px]", theme?.isLight ? "bg-slate-200" : "bg-white/10")} />
            </div>
            <div className="grid grid-cols-1 gap-6">
                {displayArticles.map((article: any, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className={cn("overflow-hidden group cursor-pointer backdrop-blur-2xl transition-all duration-500 rounded-[2.5rem] border", theme.card, theme.border)}
                        style={{ 
                            backgroundColor: `${theme.accent}0a`,
                            borderColor: `${theme.accent}25`,
                            boxShadow: `0 40px 100px -20px ${theme.accent}30`
                        }}
                        onClick={() => {
                            trackEvent("article_click", article.title);
                            setCurrentArticle(article);
                            setIsArticleOpen(true);
                        }}
                    >
                        {article.coverImage && (
                            <div className="aspect-video relative overflow-hidden">
                                <img src={article.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={article.title} loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            </div>
                        )}
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={cn("text-[10px] font-black uppercase tracking-widest", theme?.isLight ? "text-slate-400" : "text-white/40")}>
                                    {new Date(article.createdAt).toLocaleDateString()}
                                </span>
                                <div className={cn("w-1 h-1 rounded-full", theme?.isLight ? "bg-slate-200" : "bg-white/20")} />
                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accent }}>MAKALE</span>
                            </div>
                            <h4 className={cn("text-lg font-black mb-2 tracking-tight leading-tight group-hover:text-primary transition-colors", theme?.isLight ? "text-slate-900" : "text-white")}>{article.title}</h4>
                            {article.excerpt && (
                                <p className={cn("text-[13px] font-medium leading-relaxed line-clamp-2", theme?.isLight ? "text-slate-500" : "text-white/60")}>{article.excerpt}</p>
                            )}
                            <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accent }}>
                                DEVAMINI OKU <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function ArticleReaderModal({ isOpen, onClose, article, theme, t, lang }: any) {
    if (!isOpen || !article) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cn("absolute inset-0 backdrop-blur-2xl", theme?.isLight ? "bg-black/20" : "bg-black/95")} />
                <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 30, stiffness: 350 }}
                    className={cn(
                        "relative w-full sm:max-w-3xl border rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl z-10 mx-auto max-h-screen sm:max-h-[85vh] flex flex-col transition-colors duration-500",
                        theme?.isLight ? "bg-white border-black/5" : "bg-[#0a0a0f] border-white/10"
                    )}
                    onClick={(e) => e.stopPropagation()}
                    style={{ boxShadow: `0 30px 100px -20px ${theme.accent}40` }}
                >
                    <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto my-5 sm:hidden shrink-0" />
                    
                    <header className="flex items-center justify-between px-8 py-5 border-b border-white/5 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
                                <FileText size={16} />
                            </div>
                            <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", theme?.isLight ? "text-slate-400" : "text-white/40")}>{t.articleReading || "MAKALE OKUNUYOR"}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className={cn("w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:rotate-90 duration-300 shadow-sm", theme?.isLight ? "bg-black/5 border-black/10 text-slate-600" : "bg-white/5 border-white/10 text-white/60 hover:text-white")}
                        >
                            <X size={18} />
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8 sm:p-12 no-scrollbar">
                        {article.coverImage && (
                            <img src={article.coverImage} alt={article.title} className="w-full aspect-video object-cover rounded-[2rem] mb-10 shadow-2xl border border-white/5" />
                        )}

                        <div className="max-w-2xl mx-auto space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest")} style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
                                        BLOG
                                    </span>
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                        {new Date(article.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h2 className={cn("text-3xl sm:text-4xl font-black tracking-tighter leading-tight italic", theme?.isLight ? "text-slate-900" : "text-white")}>
                                    {article.title}
                                </h2>
                            </div>

                            <div className="h-1 w-20 rounded-full" style={{ backgroundColor: theme.accent }} />

                            <div 
                                className={cn(
                                    "prose max-w-none antialiased font-medium text-[15px] sm:text-[16px] transition-colors duration-500",
                                    theme?.isLight ? "prose-slate prose-p:text-slate-600 prose-headings:text-slate-900 prose-strong:text-slate-900" : "prose-invert prose-p:text-white/70 prose-headings:text-white prose-strong:text-white",
                                    "prose-img:rounded-[2rem] prose-a:text-primary prose-a:no-underline hover:prose-a:underline font-sans"
                                )}
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>
                        
                        <div className="h-20" /> {/* Extra space for scroll */}
                    </div>

                    <footer className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl shrink-0">
                        <button 
                            onClick={onClose}
                            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white/60 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all active:scale-95"
                        >
                            {t.closeReader || "OKUMAYI BİTİR"}
                        </button>
                    </footer>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}


