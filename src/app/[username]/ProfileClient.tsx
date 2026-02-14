"use client"

import { useState, useEffect, useRef } from "react"
import {
    Layout,
    MessageCircle,
    Phone,
    Share2,
    UserPlus,
    QrCode,
    Calendar,
    CheckCircle2,
    ShoppingBag,
    Instagram,
    Twitter,
    Linkedin,
    ArrowRight,
    ExternalLink,
    Globe,
    Sparkles,
    MapPin,
    Star,
    ChevronDown,
    Mail,
    Briefcase,
    Award
} from "lucide-react"
import { AppointmentModal } from "@/components/AppointmentModal"
import { translations } from "@/lib/i18n"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"

// Floating Particle Component
function FloatingParticles({ color }: { color: string }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: Math.random() * 4 + 2,
                        height: Math.random() * 4 + 2,
                        background: `${color}${Math.random() > 0.5 ? '40' : '20'}`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 4 + 3,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    )
}

// Animated Grid Background
function AnimatedGrid({ color }: { color: string }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />
        </div>
    )
}

// Glowing Orb Component
function GlowingOrbs({ color }: { color: string }) {
    return (
        <>
            <motion.div
                className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[128px]"
                style={{ background: `${color}15` }}
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[128px]"
                style={{ background: `${color}10` }}
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px]"
                style={{ background: `#a855f710` }}
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
        </>
    )
}

// Animated Ring around avatar
function AnimatedRing({ color }: { color: string }) {
    return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 160">
            <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="1" />
                    <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.3" />
                </linearGradient>
            </defs>
            <motion.circle
                cx="80"
                cy="80"
                r="76"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="200 280"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "center" }}
            />
            <motion.circle
                cx="80"
                cy="80"
                r="72"
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="100 380"
                opacity="0.3"
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "center" }}
            />
        </svg>
    )
}

export default function ProfileClient({ profile }: any) {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
    const [lang, setLang] = useState("tr")
    const [mounted, setMounted] = useState(false)
    const t = translations[lang]

    const themeColor = profile.themeColor || "#6366f1"
    const { scrollYProgress } = useScroll()
    const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
    const headerScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95])

    useEffect(() => setMounted(true), [])

    const logEvent = async (type: string, value?: string) => {
        try {
            await fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileId: profile.id, type, value })
            })
        } catch (e) {
            console.error("Event error:", e)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.3 }
        }
    }

    const itemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.7, ease: "easeOut" as const }
        }
    }

    const slideInLeft = {
        hidden: { x: -60, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    }

    const slideInRight = {
        hidden: { x: 60, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    }

    return (
        <div className="min-h-screen bg-[#030712] text-white selection:bg-primary/30 overflow-x-hidden relative">

            {/* === BACKGROUND EFFECTS === */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <GlowingOrbs color={themeColor} />
                <AnimatedGrid color={themeColor} />
                {mounted && <FloatingParticles color={themeColor} />}

                {/* Noise texture */}
                <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* === LANGUAGE SWITCHER === */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="fixed top-6 right-6 z-50"
            >
                <div className="flex gap-1 p-1 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl">
                    <button
                        onClick={() => setLang("tr")}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black tracking-wider transition-all duration-300 ${lang === "tr" ? "text-white shadow-lg" : "text-white/30 hover:text-white/60"}`}
                        style={lang === "tr" ? { backgroundColor: themeColor } : {}}
                    >TR</button>
                    <button
                        onClick={() => setLang("en")}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black tracking-wider transition-all duration-300 ${lang === "en" ? "text-white shadow-lg" : "text-white/30 hover:text-white/60"}`}
                        style={lang === "en" ? { backgroundColor: themeColor } : {}}
                    >EN</button>
                </div>
            </motion.div>

            {/* === APPOINTMENT MODAL === */}
            <AppointmentModal
                profile={profile}
                isOpen={isAppointmentOpen}
                onClose={() => setIsAppointmentOpen(false)}
                t={t}
            />

            {/* === MAIN CONTENT === */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-lg mx-auto px-6 pt-16 pb-24"
            >

                {/* ==================== HERO / PROFILE HEADER ==================== */}
                <motion.div
                    style={{ opacity: headerOpacity, scale: headerScale }}
                    className="flex flex-col items-center text-center mb-16"
                >
                    {/* Avatar with Animated Ring */}
                    <motion.div
                        variants={itemVariants}
                        className="relative mb-10 w-40 h-40"
                    >
                        <AnimatedRing color={themeColor} />

                        <motion.div
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute inset-3 rounded-full overflow-hidden shadow-2xl"
                            style={{ boxShadow: `0 0 80px ${themeColor}30, 0 0 40px ${themeColor}15` }}
                        >
                            <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                                {profile.user.image ? (
                                    <img src={profile.user.image} alt={profile.user.name || ""} className="w-full h-full object-cover" />
                                ) : (
                                    <span
                                        className="text-6xl font-black"
                                        style={{ color: themeColor }}
                                    >
                                        {profile.user.name?.[0]?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        {/* Status Indicator */}
                        <motion.div
                            className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center z-20"
                            style={{ backgroundColor: themeColor, boxShadow: `0 0 20px ${themeColor}80` }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                        </motion.div>
                    </motion.div>

                    {/* Name & Title */}
                    <motion.div variants={itemVariants}>
                        <h1 className="text-5xl font-black mb-3 tracking-tight bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                            {profile.user.name}
                        </h1>
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Briefcase className="w-4 h-4" style={{ color: themeColor }} />
                            <p className="text-lg font-medium text-white/50">{profile.occupation}</p>
                        </div>
                    </motion.div>

                    {/* Availability Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="mb-8"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                            </span>
                            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/60">{t.available}</span>
                        </motion.div>
                    </motion.div>

                    {/* Social Links */}
                    {(profile.socialLinks as any[])?.length > 0 && (
                        <motion.div variants={itemVariants} className="flex justify-center gap-3">
                            {(profile.socialLinks as any[]).filter(link => link.url).map((link: any, idx: number) => (
                                <motion.a
                                    key={link.platform}
                                    whileHover={{ y: -6, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + idx * 0.1 }}
                                    href={link.url}
                                    target="_blank"
                                    onClick={() => logEvent("click_social", link.platform)}
                                    className="w-14 h-14 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl text-white/40 hover:text-white hover:border-white/20 transition-all duration-300 group"
                                    style={{ ['--hover-shadow' as any]: `0 10px 40px ${themeColor}30` }}
                                >
                                    {link.platform === "instagram" && <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                    {link.platform === "twitter" && <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                    {link.platform === "linkedin" && <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                </motion.a>
                            ))}
                        </motion.div>
                    )}
                </motion.div>


                {/* ==================== SLOGAN & BIO CARD ==================== */}
                <motion.div
                    variants={itemVariants}
                    className="mb-10 relative group"
                >
                    <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `linear-gradient(135deg, ${themeColor}08, transparent)` }} />

                    <div className="relative p-10 rounded-[2rem] border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl overflow-hidden">
                        {/* Accent line */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 h-[2px]"
                            style={{ background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)` }}
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />

                        {/* Quote icon */}
                        <div className="text-6xl font-black leading-none mb-4 opacity-10" style={{ color: themeColor }}>&ldquo;</div>

                        <p className="text-2xl leading-tight font-black mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            {profile.slogan}
                        </p>

                        <div className="h-[2px] w-20 mb-6 rounded-full" style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }} />

                        <p className="text-[15px] leading-relaxed text-white/40 font-medium">
                            {profile.bio}
                        </p>
                    </div>
                </motion.div>


                {/* ==================== ACTION BUTTONS ==================== */}
                <motion.div variants={itemVariants} className="space-y-4 mb-14">

                    {/* Primary CTA - Book Appointment */}
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsAppointmentOpen(true)}
                        className="w-full group relative overflow-hidden flex items-center justify-between p-7 rounded-[1.75rem] font-black transition-all"
                        style={{
                            background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                            boxShadow: `0 20px 60px -12px ${themeColor}50`
                        }}
                    >
                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)` }}
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <span className="text-lg">{t.bookAppointment}</span>
                        </div>
                        <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform relative z-10" />
                    </motion.button>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.a
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => logEvent("click_vcard")}
                            href={`/api/vcard?username=${profile.username}`}
                            className="flex flex-col items-center justify-center gap-4 p-8 rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] group"
                        >
                            <motion.div
                                whileHover={{ rotate: 12 }}
                                className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white text-black shadow-xl"
                            >
                                <UserPlus className="w-6 h-6" />
                            </motion.div>
                            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white/50 group-hover:text-white/80 transition-colors">{t.addToContacts}</span>
                        </motion.a>

                        <motion.button
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => logEvent("click_share")}
                            className="flex flex-col items-center justify-center gap-4 p-8 rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] group"
                        >
                            <motion.div
                                whileHover={{ rotate: -12 }}
                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl"
                                style={{ backgroundColor: themeColor }}
                            >
                                <Share2 className="w-6 h-6" />
                            </motion.div>
                            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white/50 group-hover:text-white/80 transition-colors">{t.share}</span>
                        </motion.button>
                    </div>
                </motion.div>


                {/* ==================== PRODUCTS SECTION ==================== */}
                {profile.products?.length > 0 && (
                    <motion.div variants={itemVariants} className="mb-16">
                        <div className="flex items-center justify-between mb-8 px-1">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
                                    <ShoppingBag className="w-5 h-5" style={{ color: themeColor }} />
                                </div>
                                <h2 className="text-2xl font-black">{t.products}</h2>
                            </div>
                            <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/30">{profile.products.length}</div>
                        </div>

                        <div className="flex overflow-x-auto gap-5 pb-8 no-scrollbar -mx-6 px-6 snap-x snap-mandatory">
                            {profile.products.map((product: any, idx: number) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.1 }}
                                    whileHover={{ y: -8 }}
                                    className="min-w-[300px] w-[300px] rounded-[2rem] border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl overflow-hidden flex flex-col group snap-start"
                                >
                                    <div className="aspect-square bg-white/5 relative overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-10">
                                                <ShoppingBag className="w-16 h-16" />
                                            </div>
                                        )}
                                        {/* Price badge */}
                                        <div className="absolute top-5 right-5 px-5 py-2.5 rounded-full text-sm font-black bg-white/90 text-black backdrop-blur-xl shadow-2xl">
                                            ₺{product.price}
                                        </div>
                                        {/* Gradient overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#030712] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                    <div className="p-7 flex flex-col flex-1">
                                        <h3 className="font-black text-lg mb-2">{product.name}</h3>
                                        <p className="text-sm mb-6 line-clamp-2 flex-1 leading-relaxed text-white/35">{product.description}</p>
                                        <a
                                            onClick={() => logEvent("click_product", product.name)}
                                            href={product.link || `https://wa.me/${profile.phone}?text=${encodeURIComponent(`${product.name} ile ilgileniyorum.`)}`}
                                            target="_blank"
                                            className="w-full py-4 rounded-xl text-center text-sm font-black transition-all hover:scale-[1.03] active:scale-95 text-white"
                                            style={{
                                                backgroundColor: themeColor,
                                                boxShadow: `0 8px 30px ${themeColor}30`
                                            }}
                                        >
                                            {t.buyNow}
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}


                {/* ==================== SERVICES SECTION ==================== */}
                {profile.services?.length > 0 && (
                    <motion.div variants={itemVariants} className="mb-16">
                        <div className="flex items-center gap-3 mb-8 px-1">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
                                <Award className="w-5 h-5" style={{ color: themeColor }} />
                            </div>
                            <h2 className="text-2xl font-black">{t.services}</h2>
                        </div>

                        <div className="space-y-3">
                            {(profile.services as any[])?.map((service: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + i * 0.08 }}
                                    whileHover={{ x: 8, scale: 1.01 }}
                                    onClick={() => logEvent("click_service", service.title)}
                                    className="p-7 rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl transition-all group cursor-pointer relative overflow-hidden"
                                >
                                    {/* Hover gradient */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${themeColor}05, transparent)` }} />

                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="flex items-center gap-5 flex-1 pr-4">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 group-hover:rotate-6"
                                                style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                                            >
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black mb-1 group-hover:text-white transition-colors">{service.title}</h3>
                                                <p className="text-sm text-white/30 leading-relaxed">{service.description}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-white/50 transform group-hover:translate-x-1 transition-all" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}


                {/* ==================== CONTACT SECTION ==================== */}
                <motion.div variants={itemVariants} className="mb-16">
                    <div className="flex items-center gap-3 mb-8 px-1">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
                            <Phone className="w-5 h-5" style={{ color: themeColor }} />
                        </div>
                        <h2 className="text-2xl font-black">{lang === 'tr' ? 'İletişim' : 'Contact'}</h2>
                    </div>

                    <div className="space-y-3">
                        {/* WhatsApp */}
                        <motion.a
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => logEvent("click_whatsapp")}
                            href={`https://wa.me/${profile.phone?.replace(/\s/g, "")}`}
                            target="_blank"
                            className="flex items-center gap-5 p-6 rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl transition-all group hover:border-emerald-500/20"
                        >
                            <div className="w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
                                <MessageCircle className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-white/25 font-black uppercase tracking-[0.25em] mb-1">WhatsApp</p>
                                <p className="font-black text-lg text-white/80 group-hover:text-white transition-colors">{t.whatsApp}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                        </motion.a>

                        {/* Phone */}
                        <motion.a
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => logEvent("click_phone")}
                            href={`tel:${profile.phone?.replace(/\s/g, "")}`}
                            className="flex items-center gap-5 p-6 rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl transition-all group"
                            style={{ ['--border-hover' as any]: `${themeColor}30` }}
                        >
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-shadow"
                                style={{
                                    backgroundColor: themeColor,
                                    boxShadow: `0 10px 30px -5px ${themeColor}40`
                                }}
                            >
                                <Phone className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-white/25 font-black uppercase tracking-[0.25em] mb-1">{lang === 'tr' ? 'Telefon' : 'Phone'}</p>
                                <p className="font-black text-lg text-white/80 group-hover:text-white transition-colors">{profile.phone}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                        </motion.a>
                    </div>
                </motion.div>


                {/* ==================== FOOTER BRANDING ==================== */}
                {profile.user.subscription?.plan === "free" && (
                    <motion.div variants={itemVariants} className="text-center pt-8">
                        <a
                            href="https://kardly.vercel.app"
                            target="_blank"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/[0.05] bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-white/15 hover:text-white/40 transition-all duration-500 backdrop-blur-xl group"
                        >
                            <span>Powered by</span>
                            <span className="text-white/30 group-hover:text-white/60 transition-colors">Kardly</span>
                            <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: themeColor }} />
                        </a>
                    </motion.div>
                )}

            </motion.div>


            {/* === GLOBAL STYLES === */}
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

                /* Smooth scroll */
                html { scroll-behavior: smooth; }

                /* Custom selection */
                ::selection { background: ${themeColor}40; }
            `}</style>
        </div>
    )
}
