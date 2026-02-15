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
    Check
} from "lucide-react"
import { AppointmentModal } from "@/components/AppointmentModal"
import { translations } from "@/lib/i18n"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"

// ─── ANIMATED BACKGROUND ELEMENTS ────────────────────────────────

function MeshGradientBG({ color }: { color: string }) {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {/* Main gradient orbs */}
            <motion.div
                className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[160px]"
                style={{ background: `${color}18` }}
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, 80, 0],
                    y: [0, 40, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[140px]"
                style={{ background: `${color}12` }}
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -60, 0],
                    y: [0, -50, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full blur-[120px]"
                style={{ background: `#a855f708` }}
                animate={{
                    scale: [1, 1.4, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full blur-[100px]"
                style={{ background: `#06b6d408` }}
                animate={{
                    scale: [1.3, 1, 1.3],
                    x: [0, 40, 0],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Animated grid */}
            <div className="absolute inset-0 opacity-[0.025]" style={{
                backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
                backgroundSize: '80px 80px',
            }} />

            {/* Noise texture */}
            <div className="absolute inset-0 opacity-[0.012]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }} />
        </div>
    )
}

function FloatingParticles({ color }: { color: string }) {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: Math.random() * 5 + 2,
                        height: Math.random() * 5 + 2,
                        background: `${color}${Math.random() > 0.5 ? '30' : '15'}`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        x: [0, Math.random() * 30 - 15, 0],
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.2, 0],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 4,
                        repeat: Infinity,
                        delay: Math.random() * 8,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    )
}

// ─── ANIMATED AVATAR RING ────────────────────────────────────────

function AnimatedRing({ color }: { color: string }) {
    return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
            <defs>
                <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="1" />
                    <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="ringGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.1" />
                </linearGradient>
            </defs>
            <motion.circle cx="100" cy="100" r="96" fill="none" stroke="url(#ringGrad1)" strokeWidth="2" strokeLinecap="round" strokeDasharray="180 320"
                animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "center" }}
            />
            <motion.circle cx="100" cy="100" r="92" fill="none" stroke="url(#ringGrad2)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="120 400" opacity="0.4"
                animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "center" }}
            />
            <motion.circle cx="100" cy="100" r="88" fill="none" stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeDasharray="60 500" opacity="0.2"
                animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "center" }}
            />
        </svg>
    )
}

// ─── SECTION REVEAL ANIMATION ────────────────────────────────────

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// ─── ANIMATED COUNTER ────────────────────────────────────────────

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
                if (start >= end) {
                    setCount(end)
                    clearInterval(timer)
                } else {
                    setCount(Math.floor(start))
                }
            }, 16)
            return () => clearInterval(timer)
        }
    }, [isInView, value])

    return <span ref={ref}>{count}{suffix}</span>
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────

export default function ProfileClient({ profile }: any) {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
    const [lang, setLang] = useState("tr")
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)
    const [showShareMenu, setShowShareMenu] = useState(false)
    const t = translations[lang]

    const themeColor = profile.themeColor || "#6366f1"
    const { scrollYProgress } = useScroll()
    const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -60])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

    useEffect(() => setMounted(true), [])

    const logEvent = async (type: string, value?: string) => {
        try {
            await fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileId: profile.id, type, value })
            })
        } catch (e) { console.error("Event error:", e) }
    }

    const handleShare = async () => {
        const url = `${window.location.origin}/${profile.username}`
        if (navigator.share) {
            try {
                await navigator.share({ title: profile.user.name, text: profile.slogan, url })
                logEvent("share")
            } catch { }
        } else {
            setShowShareMenu(true)
        }
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/${profile.username}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        logEvent("copy_link")
    }

    const socialIcons: Record<string, any> = {
        instagram: <Instagram className="w-5 h-5" />,
        twitter: <Twitter className="w-5 h-5" />,
        linkedin: <Linkedin className="w-5 h-5" />,
    }

    const socialColors: Record<string, string> = {
        instagram: "from-pink-500 to-purple-600",
        twitter: "from-sky-400 to-blue-500",
        linkedin: "from-blue-600 to-blue-800",
    }

    // Working hours display
    const workingHours = (profile.workingHours as string[]) || []
    const hasWorkingHours = workingHours.length > 0

    return (
        <div className="min-h-screen bg-[#030712] text-white selection:bg-primary/30 overflow-x-hidden relative">

            {/* ═══ BACKGROUND ═══ */}
            <MeshGradientBG color={themeColor} />
            {mounted && <FloatingParticles color={themeColor} />}

            {/* ═══ LANGUAGE SWITCHER ═══ */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="fixed top-5 right-5 z-50"
            >
                <div className="flex gap-1 p-1 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl">
                    <button onClick={() => setLang("tr")}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black tracking-wider transition-all duration-300 ${lang === "tr" ? "text-white shadow-lg" : "text-white/30 hover:text-white/60"}`}
                        style={lang === "tr" ? { backgroundColor: themeColor } : {}}
                    >TR</button>
                    <button onClick={() => setLang("en")}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black tracking-wider transition-all duration-300 ${lang === "en" ? "text-white shadow-lg" : "text-white/30 hover:text-white/60"}`}
                        style={lang === "en" ? { backgroundColor: themeColor } : {}}
                    >EN</button>
                </div>
            </motion.div>

            {/* ═══ APPOINTMENT MODAL ═══ */}
            <AppointmentModal profile={profile} isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} t={t} />

            {/* ═══ MAIN CONTENT ═══ */}
            <div className="relative z-10 max-w-lg mx-auto px-5 pt-12 pb-20">

                {/* ═══════════════ HERO SECTION ═══════════════ */}
                <motion.div
                    style={{ y: heroParallax, opacity: heroOpacity }}
                    className="flex flex-col items-center text-center mb-12"
                >
                    {/* Animated Avatar */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                        className="relative mb-8 w-44 h-44"
                    >
                        <AnimatedRing color={themeColor} />
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="absolute inset-4 rounded-full overflow-hidden shadow-2xl"
                            style={{ boxShadow: `0 0 100px ${themeColor}25, 0 0 50px ${themeColor}10` }}
                        >
                            <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                                {profile.user.image ? (
                                    <img src={profile.user.image} alt={profile.user.name || ""} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-7xl font-black" style={{ color: themeColor }}>
                                        {profile.user.name?.[0]?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        {/* Online status pulse */}
                        <motion.div
                            className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-20"
                            style={{ backgroundColor: "#22c55e", boxShadow: `0 0 20px #22c55e80` }}
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                        </motion.div>
                    </motion.div>

                    {/* Name with gradient */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                    >
                        <h1 className="text-4xl sm:text-5xl font-black mb-2 tracking-tight">
                            <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
                                {profile.user.name}
                            </span>
                        </h1>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Briefcase className="w-4 h-4" style={{ color: themeColor }} />
                            <p className="text-base font-medium text-white/50">{profile.occupation}</p>
                        </div>
                    </motion.div>

                    {/* Availability badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mb-6"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">{t.available}</span>
                        </div>
                    </motion.div>

                    {/* Social Links - Animated */}
                    {(profile.socialLinks as any[])?.filter((l: any) => l.url).length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex justify-center gap-3"
                        >
                            {(profile.socialLinks as any[]).filter((link: any) => link.url).map((link: any, idx: number) => (
                                <motion.a
                                    key={link.platform}
                                    whileHover={{ y: -6, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + idx * 0.1 }}
                                    href={link.url}
                                    target="_blank"
                                    onClick={() => logEvent("click_social", link.platform)}
                                    className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${socialColors[link.platform] || "from-gray-600 to-gray-800"} text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
                                >
                                    {socialIcons[link.platform] || <Globe className="w-5 h-5" />}
                                </motion.a>
                            ))}
                        </motion.div>
                    )}
                </motion.div>


                {/* ═══════════════ SLOGAN & BIO ═══════════════ */}
                <RevealSection className="mb-10">
                    <div className="relative p-8 rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl overflow-hidden group">
                        {/* Top accent gradient line */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 h-[2px]"
                            style={{ background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)` }}
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        {/* Side glow on hover */}
                        <div className="absolute -left-2 top-0 bottom-0 w-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: themeColor, boxShadow: `0 0 20px ${themeColor}` }} />

                        <div className="text-5xl font-black leading-none mb-4 opacity-10" style={{ color: themeColor }}>&ldquo;</div>

                        <p className="text-xl sm:text-2xl leading-snug font-black mb-5 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            {profile.slogan}
                        </p>

                        <div className="h-[2px] w-16 mb-5 rounded-full" style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }} />

                        <p className="text-sm leading-relaxed text-white/40 font-medium">
                            {profile.bio}
                        </p>
                    </div>
                </RevealSection>


                {/* ═══════════════ QUICK ACTION BUTTONS ═══════════════ */}
                <RevealSection className="mb-10" delay={0.1}>
                    <div className="space-y-3">
                        {/* Primary CTA - Book Appointment */}
                        <motion.button
                            whileHover={{ scale: 1.02, y: -3 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsAppointmentOpen(true)}
                            className="w-full group relative overflow-hidden flex items-center justify-between p-6 rounded-2xl font-black transition-all"
                            style={{
                                background: `linear-gradient(135deg, ${themeColor}, ${themeColor}cc)`,
                                boxShadow: `0 20px 50px -12px ${themeColor}50`
                            }}
                        >
                            {/* Shimmer */}
                            <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)` }}
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <span className="text-base">{t.bookAppointment}</span>
                            </div>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform relative z-10" />
                        </motion.button>

                        {/* Action Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            {/* Add to Contacts */}
                            <motion.a
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => logEvent("click_vcard")}
                                href={`/api/vcard?username=${profile.username}`}
                                className="flex flex-col items-center gap-3 py-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] group"
                            >
                                <motion.div whileHover={{ rotate: 12 }} className="w-11 h-11 rounded-xl flex items-center justify-center bg-white text-black shadow-lg">
                                    <UserPlus className="w-5 h-5" />
                                </motion.div>
                                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/40 group-hover:text-white/70 transition-colors text-center px-1">{t.addToContacts}</span>
                            </motion.a>

                            {/* Share */}
                            <motion.button
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleShare}
                                className="flex flex-col items-center gap-3 py-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] group"
                            >
                                <motion.div whileHover={{ rotate: -12 }} className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: themeColor }}>
                                    <Share2 className="w-5 h-5" />
                                </motion.div>
                                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/40 group-hover:text-white/70 transition-colors">{t.share}</span>
                            </motion.button>

                            {/* Copy Link */}
                            <motion.button
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCopyLink}
                                className="flex flex-col items-center gap-3 py-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] group"
                            >
                                <motion.div whileHover={{ rotate: 12 }} className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </motion.div>
                                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/40 group-hover:text-white/70 transition-colors">
                                    {copied ? (lang === "tr" ? "Kopyalandı!" : "Copied!") : (lang === "tr" ? "Link Kopyala" : "Copy Link")}
                                </span>
                            </motion.button>
                        </div>
                    </div>
                </RevealSection>


                {/* ═══════════════ PRODUCTS ═══════════════ */}
                {profile.products?.length > 0 && (
                    <RevealSection className="mb-12" delay={0.1}>
                        <div className="flex items-center justify-between mb-6 px-1">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
                                    <ShoppingBag className="w-5 h-5" style={{ color: themeColor }} />
                                </div>
                                <h2 className="text-xl font-black">{t.products}</h2>
                            </div>
                            <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/30">{profile.products.length}</div>
                        </div>

                        <div className="flex overflow-x-auto gap-4 pb-6 no-scrollbar -mx-5 px-5 snap-x snap-mandatory">
                            {profile.products.map((product: any, idx: number) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, x: 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -6 }}
                                    className="min-w-[260px] w-[260px] rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden flex flex-col group snap-start"
                                >
                                    <div className="aspect-[4/3] bg-white/5 relative overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-10">
                                                <ShoppingBag className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 px-4 py-1.5 rounded-full text-sm font-black bg-white/90 text-black backdrop-blur-xl shadow-lg">
                                            ₺{product.price}
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#030712] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-black text-base mb-1.5">{product.name}</h3>
                                        <p className="text-xs mb-4 line-clamp-2 flex-1 leading-relaxed text-white/35">{product.description}</p>
                                        <a
                                            onClick={() => logEvent("click_product", product.name)}
                                            href={product.link || `https://wa.me/${profile.phone}?text=${encodeURIComponent(`${product.name} ile ilgileniyorum.`)}`}
                                            target="_blank"
                                            className="w-full py-3 rounded-xl text-center text-xs font-black transition-all hover:scale-[1.03] active:scale-95 text-white flex items-center justify-center gap-2"
                                            style={{ backgroundColor: themeColor, boxShadow: `0 8px 25px ${themeColor}25` }}
                                        >
                                            {t.buyNow} <ArrowRight className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </RevealSection>
                )}


                {/* ═══════════════ SERVICES ═══════════════ */}
                {(profile.services as any[])?.length > 0 && (
                    <RevealSection className="mb-12" delay={0.1}>
                        <div className="flex items-center gap-3 mb-6 px-1">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
                                <Award className="w-5 h-5" style={{ color: themeColor }} />
                            </div>
                            <h2 className="text-xl font-black">{t.services}</h2>
                        </div>

                        <div className="space-y-2.5">
                            {(profile.services as any[]).map((service: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    whileHover={{ x: 6, scale: 1.01 }}
                                    className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl transition-all group cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${themeColor}08, transparent)` }} />
                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="flex items-center gap-4 flex-1 pr-4">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 group-hover:rotate-6"
                                                style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                                            >
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black mb-0.5 group-hover:text-white transition-colors">{service.title}</h3>
                                                <p className="text-xs text-white/30 leading-relaxed">{service.description}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white/50 transform group-hover:translate-x-1 transition-all" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </RevealSection>
                )}


                {/* ═══════════════ WORKING HOURS ═══════════════ */}
                {hasWorkingHours && (
                    <RevealSection className="mb-12" delay={0.1}>
                        <div className="flex items-center gap-3 mb-6 px-1">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10">
                                <Clock className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-black">{lang === "tr" ? "Çalışma Saatleri" : "Working Hours"}</h2>
                        </div>

                        <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                            <div className="flex flex-wrap gap-2">
                                {workingHours.sort().map((hour: string, i: number) => (
                                    <motion.div
                                        key={hour}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ scale: 1.08 }}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-emerald-500/30 transition-all cursor-default"
                                    >
                                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-sm font-bold">{hour}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <p className="text-[11px] text-white/20 mt-4 flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                {lang === "tr" ? "Randevu alınabilecek saatler" : "Available appointment times"}
                            </p>
                        </div>
                    </RevealSection>
                )}


                {/* ═══════════════ STATS / TRUST ═══════════════ */}
                <RevealSection className="mb-12" delay={0.1}>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { value: 150, suffix: "+", label: lang === "tr" ? "Mutlu Müşteri" : "Happy Clients", icon: <Heart className="w-4 h-4" /> },
                            { value: 5, suffix: "★", label: lang === "tr" ? "Puan" : "Rating", icon: <Star className="w-4 h-4" /> },
                            { value: 99, suffix: "%", label: lang === "tr" ? "Memnuniyet" : "Satisfaction", icon: <Zap className="w-4 h-4" /> },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="text-center p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3 transition-all group-hover:scale-110" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
                                    {stat.icon}
                                </div>
                                <div className="text-2xl font-black mb-1" style={{ color: themeColor }}>
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </RevealSection>


                {/* ═══════════════ CONTACT SECTION ═══════════════ */}
                <RevealSection className="mb-12" delay={0.1}>
                    <div className="flex items-center gap-3 mb-6 px-1">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
                            <Phone className="w-5 h-5" style={{ color: themeColor }} />
                        </div>
                        <h2 className="text-xl font-black">{lang === 'tr' ? 'İletişim' : 'Contact'}</h2>
                    </div>

                    <div className="space-y-2.5">
                        {/* WhatsApp */}
                        <motion.a
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => logEvent("click_whatsapp")}
                            href={`https://wa.me/${profile.phone?.replace(/\s/g, "")}`}
                            target="_blank"
                            className="flex items-center gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl transition-all group hover:border-emerald-500/20"
                        >
                            <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mb-0.5">WhatsApp</p>
                                <p className="font-bold text-white/80 group-hover:text-white transition-colors">{t.whatsApp}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                        </motion.a>

                        {/* Phone */}
                        <motion.a
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => logEvent("click_phone")}
                            href={`tel:${profile.phone?.replace(/\s/g, "")}`}
                            className="flex items-center gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-shadow" style={{ backgroundColor: themeColor, boxShadow: `0 10px 25px -5px ${themeColor}40` }}>
                                <Phone className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mb-0.5">{lang === 'tr' ? 'Telefon' : 'Phone'}</p>
                                <p className="font-bold text-white/80 group-hover:text-white transition-colors">{profile.phone}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                        </motion.a>

                        {/* Email */}
                        {profile.user.email && (
                            <motion.a
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => logEvent("click_email")}
                                href={`mailto:${profile.user.email}`}
                                className="flex items-center gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/25">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mb-0.5">E-posta</p>
                                    <p className="font-bold text-white/80 group-hover:text-white transition-colors">{profile.user.email}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                            </motion.a>
                        )}
                    </div>
                </RevealSection>


                {/* ═══════════════ SHARE SHEET ═══════════════ */}
                <AnimatePresence>
                    {showShareMenu && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[200] flex items-end justify-center p-4"
                            onClick={() => setShowShareMenu(false)}
                        >
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative w-full max-w-lg bg-[#111827] rounded-t-3xl p-8 border-t border-white/10"
                            >
                                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
                                <h3 className="text-lg font-black mb-6 text-center">{lang === "tr" ? "Profili Paylaş" : "Share Profile"}</h3>
                                <div className="grid grid-cols-4 gap-4 mb-6">
                                    {[
                                        { name: "WhatsApp", color: "bg-[#25D366]", icon: <MessageCircle className="w-6 h-6" />, url: `https://wa.me/?text=${encodeURIComponent(`${profile.user.name} - ${window?.location?.origin}/${profile.username}`)}` },
                                        { name: "Twitter", color: "bg-sky-500", icon: <Twitter className="w-6 h-6" />, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${profile.user.name} - ${window?.location?.origin}/${profile.username}`)}` },
                                        { name: "LinkedIn", color: "bg-blue-600", icon: <Linkedin className="w-6 h-6" />, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window?.location?.origin}/${profile.username}`)}` },
                                        { name: "E-posta", color: "bg-violet-600", icon: <Mail className="w-6 h-6" />, url: `mailto:?subject=${encodeURIComponent(profile.user.name)}&body=${encodeURIComponent(`${window?.location?.origin}/${profile.username}`)}` },
                                    ].map((item, i) => (
                                        <a key={i} href={item.url} target="_blank" className="flex flex-col items-center gap-2 group">
                                            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                                {item.icon}
                                            </div>
                                            <span className="text-[10px] font-bold text-white/40">{item.name}</span>
                                        </a>
                                    ))}
                                </div>
                                <button
                                    onClick={() => { handleCopyLink(); setShowShareMenu(false) }}
                                    className="w-full py-4 rounded-xl border border-white/10 bg-white/5 text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <Copy className="w-4 h-4" />
                                    {lang === "tr" ? "Bağlantıyı Kopyala" : "Copy Link"}
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>


                {/* ═══════════════ FOOTER / BRANDING ═══════════════ */}
                {profile.user.subscription?.plan === "free" && (
                    <RevealSection className="text-center pt-8">
                        <a
                            href="https://kardly.vercel.app"
                            target="_blank"
                            className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-white/[0.05] bg-white/[0.02] text-[9px] font-black uppercase tracking-[0.3em] text-white/15 hover:text-white/40 transition-all duration-500 backdrop-blur-xl group"
                        >
                            <span>Powered by</span>
                            <span className="text-white/30 group-hover:text-white/60 transition-colors">Kardly</span>
                            <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: themeColor }} />
                        </a>
                    </RevealSection>
                )}
            </div>


            {/* ═══ GLOBAL STYLES ═══ */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

                @keyframes bounce-in {
                    0% { transform: translate(-50%, -100%); opacity: 0; }
                    70% { transform: translate(-50%, 10%); opacity: 1; }
                    100% { transform: translate(-50%, 0); opacity: 1; }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
                }

                html { scroll-behavior: smooth; }
                ::selection { background: ${themeColor}40; }

                /* Custom scrollbar for the whole page */
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: ${themeColor}30; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: ${themeColor}50; }
            `}</style>
        </div>
    )
}
