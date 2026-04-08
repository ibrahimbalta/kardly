"use client"

import { cn } from "@/lib/utils"
import {
    Instagram,
    Twitter,
    Linkedin,
    Mail,
    Phone,
    Globe,
    Youtube,
    Github,
    MessageCircle,
    Facebook,
    Dribbble,
    Palette,
    Sparkles,
    Send,
    Target,
    ShoppingBag,
    Zap,
    Users,
    Code,
    Shield,
    Briefcase,
    Trophy,
    Activity,
} from "lucide-react"

// ─── TYPES ───────────────────────────────────────────────────────

export interface Profile {
    id: string;
    username: string;
    occupation: string;
    slogan: string;
    bio: string;
    phone: string;
    themeColor: string;
    templateId: string;
    tone: string;
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
    [key: string]: any;
}

// ─── ICON COMPONENTS ─────────────────────────────────────────────

export const XIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
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

export const MailWithBadge = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
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

// ─── HELPER FUNCTIONS ────────────────────────────────────────────

export const getHeroIcon = (platform: string = "", size: number = 20, url: string = "") => {
    const p = platform.toLowerCase().trim();
    
    if (p === 'website' || p === 'globe' || !p || p === 'custom') {
        const u = (url || "").toLowerCase().trim();
        if (u.includes('twitter.com') || u.includes('x.com')) return <XIcon size={size} />;
        if (u.includes('instagram.com')) return <Instagram size={size} />;
        if (u.includes('linkedin.com')) return <Linkedin size={size} />;
        if (u.includes('youtube.com') || u.includes('youtu.be')) return <Youtube size={size} />;
        if (u.includes('github.com')) return <Github size={size} />;
        if (u.includes('facebook.com')) return <Facebook size={size} />;
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

export const isDarkColor = (color: string) => {
    if (!color || color === 'transparent' || color.startsWith('var')) return false;
    try {
        let hex = color;
        if (color.startsWith('#')) hex = color.slice(1);
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        if (hex.length !== 6) return false;
        
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        
        const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luma < 0.6;
    } catch (e) {
        return false;
    }
};

export const getContrastingAccent = (accentColor: string, isLightBg: boolean) => {
    if (!accentColor || accentColor === 'transparent') return isLightBg ? '#1a1a1a' : '#ffffff';
    
    const isAccentDark = isDarkColor(accentColor);
    
    if (isLightBg) {
        return isAccentDark ? accentColor : '#1a1a1a';
    } else {
        return isAccentDark ? '#ffffff' : accentColor;
    }
};

export const checkIfBgIsLight = (bgClass: string) => {
    if (!bgClass) return false;
    const lower = bgClass.toLowerCase();
    
    const lightClasses = ['-white', '-slate-50', '-slate-100', '-gray-50', '-gray-100', '-zinc-50', '-zinc-100', '-amber-50', '-orange-50', '-yellow-50', '-rose-50', '-blue-50', '-sky-50', '-emerald-50', '-green-50', '-cyan-50'];
    if (lightClasses.some(c => lower.includes(c)) || lower === 'bg-white') return true;
    
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
        return luma > 0.65;
    }
    
    return false;
};

export const formatUrl = (url?: string) => {
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

export const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return ""
    let videoId = ""
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0]
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0]
    else if (url.includes("embed/")) videoId = url.split("embed/")[1].split("?")[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=0` : ""
}

export const getServiceIcon = (title: string = "") => {
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
