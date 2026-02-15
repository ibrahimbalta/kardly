"use client"

import { useState, useEffect, useRef } from "react"
import {
    MessageCircle,
    Phone,
    Share2,
    UserPlus,
    Calendar,
    CheckCircle2,
    ShoppingBag,
    Instagram,
    Twitter,
    Linkedin,
    ArrowRight,
    Sparkles,
    Star,
    Mail,
    Briefcase,
    Award,
    Clock,
    MapPin,
    Globe,
    Heart,
    Zap,
    ChevronDown,
    ExternalLink,
    Copy,
    Check,
    Play,
    QrCode,
    Activity,
    Shield
} from "lucide-react"
import { AppointmentModal } from "@/components/AppointmentModal"
import { translations } from "@/lib/i18n"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"

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
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────

function MeshGradientBG({ color }: { color: string }) {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <motion.div
                className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[160px]"
                style={{ background: `${color}18` }}
                animate={{ scale: [1, 1.3, 1], x: [0, 80, 0], y: [0, 40, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[140px]"
                style={{ background: `${color}12` }}
                animate={{ scale: [1.2, 1, 1.2], x: [0, -60, 0], y: [0, -50, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 opacity-[0.025]" style={{
                backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
                backgroundSize: '80px 80px',
            }} />
        </div>
    )
}

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: "easeOut", delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (isInView) {
            let start = 0
            const end = value
            const duration = 1500
            const increment = end / (duration / 16)
            const timer = setInterval(() => {
                start += increment
                if (start >= end) { setCount(end); clearInterval(timer); }
                else { setCount(Math.floor(start)); }
            }, 16)
            return () => clearInterval(timer)
        }
    }, [isInView, value])
    return <span ref={ref}>{count}{suffix}</span>
}

// ─── BENTO TEMPLATE COMPONENTS ──────────────────────────────────

function SkillRadar({ color }: { color: string }) {
    return (
        <div className="relative w-full aspect-square flex items-center justify-center p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
                <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" /><circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" /><circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" /><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" /><line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
                <motion.path d="M50 20 L80 40 L70 70 L30 75 L20 45 Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2, delay: 0.5 }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-1">AI Skill Radar</div>
            </div>
        </div>
    )
}

function QuickActionWheel({ color, onAction }: { color: string, onAction: (type: string) => void }) {
    return (
        <div className="relative w-40 h-40 flex items-center justify-center">
            <motion.div className="absolute inset-0 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-xl" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
            <div className="relative z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20"><Mail className="w-5 h-5" /></div>
            {[
                { icon: <MessageCircle className="w-4 h-4" />, angle: 0, color: "#25D366", id: "whatsapp" },
                { icon: <Phone className="w-4 h-4" />, angle: 72, color: "#3b82f6", id: "phone" },
                { icon: <Share2 className="w-4 h-4" />, angle: 144, color: "#f59e0b", id: "share" },
                { icon: <Copy className="w-4 h-4" />, angle: 216, color: "#10b981", id: "copy" },
                { icon: <UserPlus className="w-4 h-4" />, angle: 288, color: "#8b5cf6", id: "vcard" },
            ].map((item, i) => (
                <motion.button key={i} whileHover={{ scale: 1.2, backgroundColor: item.color }} onClick={() => onAction(item.id)} className="absolute w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-colors"
                    style={{ transform: `rotate(${item.angle}deg) translateY(-60px) rotate(-${item.angle}deg)` }}
                >{item.icon}</motion.button>
            ))}
            <div className="absolute -bottom-6 text-[8px] font-black uppercase tracking-[0.3em] text-white/30">Quick Action Wheel</div>
        </div>
    )
}

// ─── TEMPLATES ───────────────────────────────────────────────────

function ModernTemplate({ profile, t, lang, logEvent, setIsAppointmentOpen, isAppointmentOpen, handleShare, handleCopyLink, copied, setLang }: any) {
    const themeColor = profile.themeColor || "#6366f1"
    const { scrollYProgress } = useScroll()
    const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -60])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

    const socialIcons: any = { instagram: <Instagram />, twitter: <Twitter />, linkedin: <Linkedin /> }
    const socialColors: any = { instagram: "from-pink-500 to-purple-600", twitter: "from-sky-400 to-blue-500", linkedin: "from-blue-600 to-blue-800" }

    return (
        <div className="min-h-screen bg-[#030712] text-white selection:bg-primary/30 relative">
            <MeshGradientBG color={themeColor} />

            <div className="relative z-10 max-w-lg mx-auto px-5 pt-12 pb-20">
                <motion.div style={{ y: heroParallax, opacity: heroOpacity }} className="flex flex-col items-center text-center mb-12">
                    <div className="relative mb-8 w-44 h-44">
                        <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-spin-slow" style={{ borderTopColor: themeColor }} />
                        <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl bg-white/5 flex items-center justify-center">
                            {profile.user.image ? <img src={profile.user.image} className="w-full h-full object-cover" /> : <span className="text-7xl font-black">{profile.user.name?.[0]}</span>}
                        </div>
                    </div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">{profile.user.name}</h1>
                    <p className="text-white/50 mb-6">{profile.occupation}</p>
                    <div className="flex gap-3">
                        {(profile.socialLinks as any[])?.filter(l => l.url).map((link, idx) => (
                            <motion.a key={idx} whileHover={{ y: -5 }} href={link.url} target="_blank" className={`w-12 h-12 rounded-xl bg-gradient-to-br ${socialColors[link.platform] || "from-gray-700 to-gray-800"} flex items-center justify-center shadow-lg font-bold`}>
                                {socialIcons[link.platform] || <Globe />}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                <RevealSection className="mb-10">
                    <div className="p-8 rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)` }} />
                        <p className="text-xl font-black mb-4 leading-snug">{profile.slogan}</p>
                        <p className="text-sm text-white/40 leading-relaxed font-medium">{profile.bio}</p>
                    </div>
                </RevealSection>

                <RevealSection className="mb-10">
                    <div className="space-y-3">
                        <button onClick={() => setIsAppointmentOpen(true)} className="w-full py-6 rounded-2xl font-black flex items-center justify-between px-8 text-white transition-all shadow-xl" style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}cc)` }}>
                            <span>{t.bookAppointment}</span> <ArrowRight className="w-5 h-5" />
                        </button>
                        <div className="grid grid-cols-3 gap-3">
                            <button onClick={handleShare} className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-[10px] uppercase tracking-widest text-white/40"><Share2 className="w-5 h-5 mb-1" /> {t.share}</button>
                            <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-[10px] uppercase tracking-widest text-white/40"><Copy className="w-5 h-5 mb-1" /> {copied ? 'Copied' : 'Link'}</button>
                            <a href={`/api/vcard?username=${profile.username}`} className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-[10px] uppercase tracking-widest text-white/40"><UserPlus className="w-5 h-5 mb-1" /> Save</a>
                        </div>
                    </div>
                </RevealSection>

                {/* Products & Services section abbreviated for Modern template in ProfileClient */}
                {profile.products?.length > 0 && (
                    <RevealSection className="mb-12">
                        <h2 className="text-xl font-black mb-6">{t.products}</h2>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                            {profile.products.map((p: any, i: number) => (
                                <div key={i} className="min-w-[240px] rounded-2xl bg-white/5 p-4 border border-white/10">
                                    <img src={p.image} className="w-full aspect-square object-cover rounded-xl mb-4" />
                                    <h3 className="font-bold mb-1">{p.name}</h3>
                                    <p className="text-primary font-black">₺{p.price}</p>
                                </div>
                            ))}
                        </div>
                    </RevealSection>
                )}
            </div>
        </div>
    )
}

function BentoTemplate({ profile, t, logEvent, setIsAppointmentOpen, isAppointmentOpen, handleShare, handleCopyLink, copied }: any) {
    const themeColor = profile.themeColor || "#6366f1"
    return (
        <div className="min-h-screen bg-[#020617] text-white relative">
            <MeshGradientBG color={themeColor} />
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <header className="flex flex-col items-center text-center mb-10">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full border-2 border-white/10 p-1 bg-gradient-to-br from-white/10 to-transparent">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
                                {profile.user.image ? <img src={profile.user.image} className="w-full h-full object-cover" /> : <span className="text-4xl font-black">{profile.user.name?.[0]}</span>}
                            </div>
                        </div>
                        <div className="absolute top-0 -right-2 bg-black border border-white/10 px-2 py-0.5 rounded text-[10px] font-black flex items-center gap-1"><span className="text-primary">AI</span> <span>Certified</span></div>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-1">{profile.user.name}</h1>
                    <p className="text-sm font-medium text-white/40">{profile.occupation}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[160px]">
                    <RevealSection className="lg:col-span-2 lg:row-span-2 rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-3xl group relative p-8 flex flex-col justify-end">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                        <p className="text-lg font-bold z-20 mb-4">{profile.slogan}</p>
                        <button className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-black flex items-center gap-2 z-20 w-fit"><Play className="w-3 h-3 fill-current" /> Play Intro</button>
                    </RevealSection>

                    <RevealSection className="lg:col-span-2 lg:row-span-2 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-6 flex flex-col justify-between">
                        <SkillRadar color={themeColor} />
                    </RevealSection>

                    {profile.services?.slice(0, 4).map((s: any, i: number) => (
                        <RevealSection key={i} className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl p-6 flex flex-col items-center justify-center text-center group transition-all">
                            <Activity className="w-6 h-6 text-primary mb-3" />
                            <span className="text-[10px] font-black">{s.title}</span>
                        </RevealSection>
                    ))}

                    <RevealSection className="lg:col-span-2 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-2xl p-8 flex justify-between items-center">
                        <div className="text-4xl font-black">5.0 <span className="text-xs text-white/20 ml-2 font-bold">Trust Score</span></div>
                        <div className="flex gap-1 text-yellow-500"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div>
                    </RevealSection>

                    <RevealSection className="lg:col-span-2 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-8 relative flex flex-col justify-center">
                        <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-xl font-bold mb-4">Available Now</p>
                        <button onClick={() => setIsAppointmentOpen(true)} className="w-full py-3 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Book Now</button>
                    </RevealSection>

                    <RevealSection className="lg:col-span-4 row-span-2 flex items-center justify-center p-12">
                        <QuickActionWheel color={themeColor} onAction={(id) => {
                            if (id === "whatsapp") window.open(`https://wa.me/${profile.phone}`, '_blank');
                            if (id === "phone") window.location.href = `tel:${profile.phone}`;
                            if (id === "share") handleShare();
                            if (id === "copy") handleCopyLink();
                            if (id === "vcard") window.location.href = `/api/vcard?username=${profile.username}`;
                        }} />
                    </RevealSection>

                    <RevealSection className="lg:col-span-4">
                        <button onClick={handleShare} className="w-full py-6 rounded-[2rem] bg-primary text-white font-black text-lg shadow-2xl hover:scale-[1.01] transition-all">Share My Info</button>
                    </RevealSection>
                </div>
            </div>
        </div>
    )
}

function MinimalTemplate({ profile, handleShare, setIsAppointmentOpen }: any) {
    return (
        <div className="min-h-screen bg-white text-black font-sans p-8 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-3xl bg-gray-50 mb-6 overflow-hidden shadow-xl border border-gray-100">
                {profile.user.image && <img src={profile.user.image} className="w-full h-full object-cover" />}
            </div>
            <h1 className="text-3xl font-black mb-2">{profile.user.name}</h1>
            <p className="text-gray-400 mb-10 font-medium">{profile.occupation}</p>
            <div className="w-full max-w-xs space-y-3">
                <button onClick={() => setIsAppointmentOpen(true)} className="w-full py-4 rounded-2xl bg-black text-white font-bold transition-all">Book Appointment</button>
                <button onClick={handleShare} className="w-full py-4 rounded-2xl bg-gray-100 text-black font-bold transition-all">Share Profile</button>
            </div>
        </div>
    )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────

export default function ProfileClient({ profile }: { profile: Profile }) {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
    const [lang, setLang] = useState("tr")
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)
    const t = translations[lang]

    useEffect(() => { setMounted(true) }, [])

    const handleShare = async () => {
        const url = `${window.location.origin}/${profile.username}`
        if (navigator.share) { try { await navigator.share({ title: profile.user.name, text: profile.slogan, url }) } catch { } }
        else { alert("URL: " + url) }
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/${profile.username}`)
        setCopied(true); setTimeout(() => setCopied(false), 2000)
    }

    if (!mounted) return <div className="min-h-screen bg-black" />

    const props = { profile, t, lang, setIsAppointmentOpen, isAppointmentOpen, handleShare, handleCopyLink, copied, setLang }

    switch (profile.templateId) {
        case "bento": return <><AppointmentModal profile={profile} isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} t={t} /><BentoTemplate {...props} /></>
        case "minimal_ios": return <><AppointmentModal profile={profile} isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} t={t} /><MinimalTemplate {...props} /></>
        default: return <><AppointmentModal profile={profile} isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} t={t} /><ModernTemplate {...props} /></>
    }
}
