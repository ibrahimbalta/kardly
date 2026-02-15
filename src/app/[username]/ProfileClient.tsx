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
    Shield,
    Download
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

function MeshGradientBG({ light = false }: { light?: boolean }) {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#F8FAFC]">
            {/* Soft Glowing Orbs */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-40"
                style={{ background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)' }}
                animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, 40, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-30"
                style={{ background: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)' }}
                animate={{ scale: [1.1, 1, 1.1], x: [0, -40, 0], y: [0, -40, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-20"
                style={{ background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)' }}
            />
            {!light && <div className="absolute inset-0 bg-[#030712]/40" />}
        </div>
    )
}

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

function SkillRadarSVG({ color, data }: { color: string, data: any[] }) {
    // Default values if data as passed is incomplete or missing
    const defaultSkills = [
        { title: "Yaratıcılık", value: 85 },
        { title: "Teknik", value: 90 },
        { title: "Hız", value: 75 },
        { title: "İletişim", value: 95 },
        { title: "Kalite", value: 80 }
    ]

    const skills = data && data.length >= 5 ? data.map(s => ({ title: s.title, value: parseInt(s.description) || 85 })) : defaultSkills;

    // Calculate radar path based on values
    const getPoint = (val: number, angle: number) => {
        const r = (val / 100) * 40;
        const x = 50 + r * Math.cos(angle);
        const y = 50 + r * Math.sin(angle);
        return `${x} ${y}`;
    }

    const path = skills.map((s, i) => {
        const angle = (i * 2 * Math.PI) / skills.length - Math.PI / 2;
        return (i === 0 ? "M " : "L ") + getPoint(s.value, angle);
    }).join(" ") + " Z";

    return (
        <div className="relative w-full aspect-square flex items-center justify-center p-6">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="1" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#F1F5F9" strokeWidth="1" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="#F1F5F9" strokeWidth="1" />

                {skills.map((_, i) => {
                    const angle = (i * 2 * Math.PI) / skills.length - Math.PI / 2;
                    return <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(angle)} y2={50 + 40 * Math.sin(angle)} stroke="#F1F5F9" strokeWidth="1" />
                })}

                <motion.path
                    d={path}
                    fill={color}
                    fillOpacity="0.2"
                    stroke={color}
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />

                {skills.map((s, i) => {
                    const angle = (i * 2 * Math.PI) / skills.length - Math.PI / 2;
                    const r = 48; // Slightly outside the circles
                    return (
                        <text
                            key={i}
                            x={50 + r * Math.cos(angle)}
                            y={50 + r * Math.sin(angle)}
                            textAnchor="middle"
                            fontSize="5"
                            fontWeight="900"
                            fill="#94A3B8"
                            className="uppercase"
                        >
                            {s.title}
                        </text>
                    )
                })}
            </svg>
        </div>
    )
}

// ─── TEMPLATES ───────────────────────────────────────────────────

function BentoTemplate({ profile, t, setIsAppointmentOpen, lang, handleShare }: any) {
    const themeColor = profile.themeColor || "#6366f1"
    const services = (profile.services as any[]) || []

    // Service options colors from image
    const serviceColors = [
        'bg-[#FBBF24]', // Orange/Yellow
        'bg-[#60A5FA]', // Blue
        'bg-[#4ADE80]', // Green
        'bg-[#A78BFA]', // Purple
    ]

    return (
        <div className="min-h-screen bg-transparent text-slate-800 p-6 md:p-12 font-sans selection:bg-indigo-100 relative overflow-x-hidden">
            <MeshGradientBG light />

            <div className="max-w-[480px] mx-auto relative z-10 space-y-8">

                {/* Header Section */}
                <header className="flex flex-col items-center text-center space-y-4 pt-10">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
                        <div className="w-28 h-28 rounded-full p-1 bg-white shadow-2xl relative z-10 overflow-hidden">
                            <img
                                src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`}
                                className="w-full h-full rounded-full object-cover"
                                alt={profile.user.name}
                            />
                        </div>
                        {/* Status Badges */}
                        <div className="absolute top-2 -right-8 z-20 flex gap-2">
                            <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-xl shadow-lg border border-white/50 flex items-center gap-1.5">
                                <span className="text-[10px] font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">AI</span>
                            </div>
                            <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-white/50">
                                <QrCode size={12} className="text-slate-900" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{profile.user.name}</h1>
                        <p className="text-slate-400 font-bold text-sm tracking-wide">{profile.occupation}</p>
                    </motion.div>
                </header>

                {/* Bento Grid */}
                <div className="grid grid-cols-2 gap-5">

                    {/* Intro Card */}
                    <RevealSection className="col-span-1 glass-card p-5 rounded-[2.5rem] flex flex-col justify-between aspect-square relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl z-0" />
                        <div className="relative z-10 w-full h-full flex flex-col justify-between">
                            <div className="relative h-28 w-full rounded-[1.8rem] overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
                                <img src={profile.user.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3 text-[9px] font-black text-white leading-tight opacity-90">
                                    {profile.slogan || "Digital Experience Mimarı"}
                                </div>
                            </div>
                            <button className="bg-[#6366f1] text-white py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black hover:bg-[#4f46e5] shadow-lg shadow-indigo-100 transition-all active:scale-95">
                                <Play size={12} fill="currentColor" /> Play Intro
                            </button>
                        </div>
                    </RevealSection>

                    {/* Skill Radar Card */}
                    <RevealSection delay={0.1} className="col-span-1 glass-card p-4 rounded-[2.5rem] aspect-square relative overflow-hidden flex flex-col items-center">
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl z-0" />
                        <div className="relative z-10 w-full h-full flex flex-col">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mt-2">AI Skill Radar</h3>
                            <SkillRadarSVG color="#6366f1" data={services.slice(4, 9)} />
                        </div>
                    </RevealSection>

                    {/* Services/Categories Buttons */}
                    <div className="col-span-2 grid grid-cols-4 gap-4">
                        {(services.length > 0 ? services : [
                            { title: 'Digital Strategy' }, { title: 'UX/UI Design' }, { title: 'Full-Stack' }, { title: 'Gorvsal Kimlik' }
                        ]).slice(0, 4).map((service, i) => (
                            <RevealSection key={i} delay={0.1 * i} className={`${serviceColors[i % 4]} h-[72px] rounded-[1.5rem] flex flex-col items-center justify-center text-[10px] text-white font-black shadow-lg shadow-black/5 hover:brightness-105 transition-all cursor-pointer active:scale-95 text-center px-1`}>
                                <div className="bg-white/20 p-1.5 rounded-xl mb-1 flex items-center justify-center">
                                    <Zap size={10} fill="currentColor" />
                                </div>
                                <span className="leading-tight">{service.title}</span>
                            </RevealSection>
                        ))}
                    </div>

                    {/* Trust Score Card */}
                    <RevealSection delay={0.2} className="col-span-1 glass-card p-6 rounded-[2.5rem] relative overflow-hidden h-[180px] flex flex-col justify-between">
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl z-0" />
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Trust Score</h3>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-end gap-1.5">
                                    <span className="text-5xl font-black text-slate-900 leading-none">5.0</span>
                                    <div className="flex flex-col gap-0.5 mb-1 text-slate-900">
                                        <div className="flex gap-0.5">
                                            <Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" />
                                        </div>
                                        <span className="text-[9px] font-black opacity-30">(85 Reviews)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative z-10 flex gap-1">
                            {['#E2E8F0', '#E2E8F0', '#E2E8F0'].map((c, i) => <div key={i} className="px-2 py-1 rounded bg-slate-100 text-[8px] font-bold text-slate-400">#Tag</div>)}
                        </div>
                    </RevealSection>

                    {/* Status & Appointment Card */}
                    <RevealSection delay={0.3} className="col-span-1 glass-card p-6 rounded-[2.5rem] relative overflow-hidden h-[180px] flex flex-col justify-between">
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl z-0" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Durum</h3>
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-sm shadow-green-200 animate-pulse" />
                            </div>
                            <p className="text-sm font-black text-slate-900 mb-1">Available Now</p>
                            <div className="h-10 w-full flex items-center gap-1 opacity-10">
                                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="flex-1 h-1 bg-slate-900 rounded-full" />)}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAppointmentOpen(true)}
                            className="relative z-10 w-full bg-[#fca311]/10 text-[#fca311] py-3 rounded-2xl font-black text-[10px] hover:bg-[#fca311]/20 transition-all active:scale-95 border border-[#fca311]/20"
                        >
                            BOOK A 20-MIN CALL
                        </button>
                    </RevealSection>

                </div>

                {/* Quick Action Wheel Mock */}
                <RevealSection delay={0.4} className="flex flex-col items-center pt-4">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-slate-200 bg-white/50 backdrop-blur-md" />
                        <div className="relative z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center">
                            <Mail size={18} className="text-slate-900" />
                        </div>
                        {/* Wheel items icons placeholder */}
                        <div className="absolute top-2 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
                            <Instagram size={12} className="text-pink-500" />
                        </div>
                        <div className="absolute right-2 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
                            <Twitter size={12} className="text-sky-500" />
                        </div>
                        <div className="absolute bottom-2 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
                            <Linkedin size={12} className="text-blue-600" />
                        </div>
                        <div className="absolute left-2 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
                            <Phone size={12} className="text-green-500" />
                        </div>
                        <div className="absolute bottom-[-20px] text-[8px] font-black text-slate-300 uppercase tracking-widest">Quick Action Wheel</div>
                    </div>
                </RevealSection>

                {/* Primary Action Button */}
                <RevealSection delay={0.5} className="pt-6">
                    <button
                        onClick={handleShare}
                        className="w-full bg-[#6366f1] text-white py-6 rounded-[2.2rem] font-black shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all active:scale-[0.98] text-lg"
                    >
                        Share My Info
                    </button>
                    <p className="text-center text-slate-300 text-[10px] font-bold uppercase tracking-widest mt-6">
                        Powered by <span className="text-[#6366f1] underline">Kardly</span>. Made With AI.
                    </p>
                </RevealSection>

            </div>

            <style jsx>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.8);
                    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
                }
            `}</style>
        </div>
    )
}

function MinimalTemplate() { return <div className="p-20 text-center">Minimal Teması (Yakında...)</div> }
function ModernTemplateOld() { return <div className="p-20 text-center">Modern Teması (Yakında...)</div> }

// ─── MAIN COMPONENT ─────────────────────────────────────────────

export default function ProfileClient({ profile }: { profile: any }) {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
    const [lang, setLang] = useState("tr")
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)
    const t = translations[lang] || translations.tr

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

    if (!mounted) return <div className="min-h-screen bg-slate-50" />

    const props = { profile, t, lang, setIsAppointmentOpen, isAppointmentOpen, handleShare }

    return (
        <>
            <AppointmentModal profile={profile} isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} t={t} />
            <BentoTemplate {...props} />
            {/* Success Toast */}
            <AnimatePresence>
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-8 py-4 rounded-full font-black shadow-2xl flex items-center gap-3"
                    >
                        <Check size={20} className="text-green-500" /> Link Kopyalandı!
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
