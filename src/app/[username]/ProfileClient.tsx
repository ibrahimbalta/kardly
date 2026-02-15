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
    Download,
    Smartphone
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

// ─── MODULE COMPONENTS ──────────────────────────────────────────

function BlockSkillRadar({ profile }: any) {
    const services = (profile.services as any[]) || []
    return (
        <RevealSection delay={0.1} className="col-span-1 glass-card p-4 rounded-[2.5rem] aspect-square relative overflow-hidden flex flex-col items-center border-2 border-white/50 bg-white/40">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Analysis Board</h3>
            <SkillRadarSVG color="#4f46e5" data={services.slice(4, 9)} />
        </RevealSection>
    )
}

function BlockPortfolioGallery({ profile }: any) {
    return (
        <RevealSection className="col-span-2 glass-card p-2 rounded-[2.5rem] relative overflow-hidden group border-2 border-white/50 bg-slate-900 h-[240px]">
            <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded bg-indigo-500 text-[8px] font-black text-white uppercase">Portfolyo</span>
                    <span className="text-[10px] font-bold text-white/60">12 Yeni Proje</span>
                </div>
                <h4 className="text-xl font-black text-white leading-tight mb-4">Interaktif Çalışmalar & Dijital Tasarımlar</h4>
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/10" />)}
                    <button className="ml-auto w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </RevealSection>
    )
}

function BlockTrustScore({ profile }: any) {
    return (
        <RevealSection className="col-span-1 glass-card p-6 rounded-[2.5rem] border-2 border-white/50 bg-indigo-600 text-white flex flex-col justify-between">
            <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><CheckCircle2 size={20} /></div>
                <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">TrustScore</span>
            </div>
            <div>
                <div className="text-4xl font-black mb-1">A+</div>
                <p className="text-[10px] font-bold opacity-80 leading-relaxed">Yüksek müşteri memnuniyeti ve hızlı teslimat performansı.</p>
            </div>
        </RevealSection>
    )
}

function BlockTimeline({ profile }: any) {
    return (
        <RevealSection className="col-span-1 glass-card p-6 rounded-[2.5rem] border-2 border-white/50 bg-white/40 flex flex-col justify-between">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">İŞ SÜRECİ</h3>
            <div className="space-y-3">
                {[
                    { t: 'Analiz', s: 'done' },
                    { t: 'Tasarım', s: 'active' },
                    { t: 'Geliştirme', s: 'pending' }
                ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${step.s === 'done' ? 'bg-green-500' : step.s === 'active' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-200'}`} />
                        <span className={`text-[11px] font-black ${step.s === 'pending' ? 'text-slate-300' : 'text-slate-800'}`}>{step.t}</span>
                    </div>
                ))}
            </div>
        </RevealSection>
    )
}

function BlockTimelineMock({ profile }: any) {
    return (
        <RevealSection className="col-span-2 glass-card p-6 rounded-[2.5rem] border-2 border-white/50 bg-indigo-50/30 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Proje Zaman Çizelgesi</h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-[8px] font-black text-indigo-600">CANLI TAKİP</span>
            </div>
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex-1 flex flex-col gap-2">
                        <div className={`h-1.5 rounded-full ${i <= 2 ? 'bg-indigo-500' : 'bg-indigo-200'}`} />
                        <span className="text-[8px] font-black text-slate-400 uppercase">Aşama {i}</span>
                    </div>
                ))}
            </div>
        </RevealSection>
    )
}

// ─── TEMPLATES ───────────────────────────────────────────────────

function BentoTemplate({ profile, t, setIsAppointmentOpen, lang, handleShare }: any) {
    const themeColor = profile.themeColor || "#6366f1"
    const services = (profile.services as any[]) || []
    const blocks = (profile.blocks as any[]) || []
    const serviceColors = ['bg-[#FBBF24]', 'bg-[#60A5FA]', 'bg-[#4ADE80]', 'bg-[#A78BFA]']

    // Eğer hiç blok yoksa varsayılan görünümü oluştur
    const renderBlocks = () => {
        if (blocks.length === 0) {
            return (
                <div className="grid grid-cols-2 gap-5">
                    <RevealSection className="col-span-1 glass-card p-5 rounded-[2.5rem] flex flex-col justify-between aspect-square relative overflow-hidden group border-2 border-white/50">
                        <div className="relative z-10 w-full h-full flex flex-col justify-between">
                            <div className="relative h-28 w-full rounded-[1.8rem] overflow-hidden shadow-sm">
                                <img src={profile.user.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3 text-[10px] font-black text-white leading-tight">
                                    {profile.slogan || "Müşteri Odaklı Çözümler"}
                                </div>
                            </div>
                            <button className="bg-slate-900 text-white py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black shadow-lg transition-all active:scale-95">
                                <Briefcase size={12} /> View Portfolio
                            </button>
                        </div>
                    </RevealSection>

                    <BlockSkillRadar profile={profile} />

                    <div className="col-span-2 grid grid-cols-4 gap-4">
                        {(services.slice(0, 4).length > 0 ? services.slice(0, 4) : [{ title: 'Digital' }, { title: 'Design' }, { title: 'Coding' }, { title: 'SEO' }]).map((service, i) => (
                            <RevealSection key={i} delay={0.1 * i} className={`${serviceColors[i % 4]} h-[72px] rounded-[1.5rem] flex flex-col items-center justify-center text-[10px] text-white font-black shadow-lg hover:brightness-105 transition-all text-center px-1`}>
                                <div className="bg-white/20 p-1.5 rounded-xl mb-1"><Zap size={10} fill="currentColor" /></div>
                                <span className="leading-tight">{service.title}</span>
                            </RevealSection>
                        ))}
                    </div>

                    <BlockTrustScore profile={profile} />
                    <BlockTimeline profile={profile} />
                </div>
            )
        }

        return (
            <div className="grid grid-cols-2 gap-5">
                {blocks.map((block, i) => {
                    switch (block.type) {
                        case 'skill_radar': return <BlockSkillRadar key={i} profile={profile} />;
                        case 'portfolio_gallery': return <BlockPortfolioGallery key={i} profile={profile} />;
                        case 'trust_score': return <BlockTrustScore key={i} profile={profile} />;
                        case 'timeline_process': return <BlockTimelineMock key={i} profile={profile} />;
                        case 'appointment_calendar': return (
                            <RevealSection key={i} className="col-span-2 glass-card p-6 rounded-[2.5rem] border-2 border-white/50 bg-indigo-600 text-white flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black">Randevu Al</h3>
                                    <p className="text-[10px] font-bold opacity-60">Müsaitlik durumunu kontrol et.</p>
                                </div>
                                <button onClick={() => setIsAppointmentOpen(true)} className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all">
                                    TAKVİMİ AÇ
                                </button>
                            </RevealSection>
                        );
                        default: return null;
                    }
                })}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white text-slate-800 p-6 md:p-12 font-sans selection:bg-indigo-100 relative overflow-x-hidden">
            <MeshGradientBG light />
            <div className="max-w-[480px] mx-auto relative z-10 space-y-8 pb-10">
                <header className="flex flex-col items-center text-center space-y-4 pt-10">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
                        <div className="w-32 h-32 rounded-3xl p-1 bg-white shadow-2xl relative z-10 overflow-hidden border-4 border-white">
                            <img src={profile.user.image || `https://ui-avatars.com/api/?name=${profile.user.name}`} className="w-full h-full rounded-2xl object-cover" alt={profile.user.name} />
                        </div>
                        <div className="absolute top-2 -right-10 z-20 flex flex-col gap-2">
                            <div className="bg-indigo-600 px-3 py-1 rounded-lg shadow-xl border border-white/20 flex items-center justify-center">
                                <span className="text-[10px] font-black text-white">PRO HQ</span>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{profile.user.name}</h1>
                        <p className="text-indigo-600 font-black text-xs uppercase tracking-widest">{profile.occupation || "PROFESSIONAL"}</p>
                    </motion.div>
                </header>

                {renderBlocks()}


                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    {profile.socialLinks?.map((l: any, i: number) => (
                        <a key={i} href={l.url} target="_blank" className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-slate-600 border border-white/80">
                            {l.platform === 'instagram' && <Instagram size={20} />}
                            {l.platform === 'twitter' && <Twitter size={20} />}
                            {l.platform === 'linkedin' && <Linkedin size={20} />}
                        </a>
                    ))}
                </div>

                <button onClick={handleShare} className="w-full bg-slate-900 text-white py-6 rounded-[2.2rem] font-black shadow-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all text-lg">
                    <Share2 size={24} /> Get Digital Card
                </button>
            </div>
        </div>
    )
}

function BusinessTemplate({ profile, t, setIsAppointmentOpen, lang, handleShare }: any) {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
            {/* Professional Office Header */}
            <div className="h-48 bg-slate-900 relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0">
                    <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
                        <img src={profile.user.image} className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pt-20 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">{profile.user.name}</h1>
                        <p className="text-blue-600 font-black flex items-center gap-2 mt-1">
                            <Shield size={16} /> {profile.occupation || "Independent Professional"}
                        </p>
                        <div className="flex items-center gap-3 mt-4 text-slate-400 text-sm font-bold">
                            <span className="flex items-center gap-1"><MapPin size={14} /> {profile.phone || "Global Office"}</span>
                            <span className="flex items-center gap-1"><Globe size={14} /> Available Worldwide</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleShare} className="px-6 py-3 rounded-xl border-2 border-slate-200 font-black text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                            <Share2 size={16} /> SHARE
                        </button>
                        <button onClick={() => setIsAppointmentOpen(true)} className="px-8 py-3 rounded-xl bg-slate-900 text-white font-black text-sm shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                            <Calendar size={16} /> START PROJECT
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Office Mission */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity size={16} className="text-blue-600" /> Mission & Bio
                            </h2>
                            <p className="text-lg font-bold text-slate-700 leading-relaxed italic mb-6">"{profile.slogan}"</p>
                            <p className="text-slate-500 font-medium leading-relaxed">{profile.bio || "No bio information provided yet."}</p>
                        </section>

                        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {profile.services?.slice(0, 4).map((s: any, i: number) => (
                                <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all text-center group">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <Zap size={20} fill="currentColor" />
                                    </div>
                                    <h3 className="font-black text-[11px] uppercase tracking-tight text-slate-800">{s.title}</h3>
                                </div>
                            ))}
                        </section>

                        {/* Awards/Corporate Stats Segment */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Projects', val: '120+', icon: <Briefcase size={16} /> },
                                { label: 'Experience', val: '8 YRS', icon: <Clock size={16} /> },
                                { label: 'Certificates', val: '15+', icon: <Award size={16} /> }
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col items-center text-center">
                                    <div className="text-white/40 mb-2">{stat.icon}</div>
                                    <div className="text-2xl font-black">{stat.val}</div>
                                    <div className="text-[9px] font-extrabold opacity-40 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Office Contacts */}
                    <div className="space-y-6">
                        <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200">
                            <h3 className="font-black text-lg mb-4">Direct Office Line</h3>
                            <div className="space-y-4">
                                {profile.socialLinks?.map((l: any, i: number) => (
                                    <a key={i} href={l.url} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                                        <div className="flex items-center gap-3">
                                            {l.platform === 'instagram' && <Instagram size={18} />}
                                            {l.platform === 'linkedin' && <Linkedin size={18} />}
                                            {l.platform === 'twitter' && <Twitter size={18} />}
                                            <span className="font-black text-xs uppercase">{l.platform}</span>
                                        </div>
                                        <ArrowRight size={14} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border border-slate-100 rounded-3xl bg-white text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Scan vCard</p>
                            <div className="w-40 h-40 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center p-4">
                                <QrCode size={120} className="text-slate-900 opacity-20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LuxuryTemplate({ profile, handleShare }: any) {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center font-serif">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="fixed inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] z-0 pointer-events-none" />
            <div className="relative z-10 space-y-8 max-w-lg">
                <div className="w-32 h-32 rounded-full border-2 border-[#D4AF37] p-1 mx-auto relative overflow-hidden">
                    <img src={profile.user.image} className="w-full h-full rounded-full object-cover grayscale Contrast-125" />
                </div>
                <div>
                    <h1 className="text-4xl font-light tracking-[0.2em] uppercase text-[#D4AF37]">{profile.user.name}</h1>
                    <p className="text-xs tracking-[0.4em] opacity-40 mt-4 uppercase font-sans font-bold">{profile.occupation || "ARTISAN"}</p>
                </div>
                <p className="text-lg italic opacity-80 leading-relaxed font-sans font-bold">"{profile.slogan}"</p>
                <div className="flex gap-8 justify-center opacity-30">
                    <button onClick={handleShare} className="hover:opacity-100 transition-all"><Share2 size={24} /></button>
                    <Smartphone size={24} />
                    <Mail size={24} />
                </div>
                <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-12" />
                <p className="text-[10px] uppercase tracking-widest opacity-20 font-sans font-black">Private Selection by Kardly</p>
            </div>
        </div>
    )
}

function MinimalIOSTemplate({ profile, handleShare }: any) {
    return (
        <div className="min-h-screen bg-[#F2F2F7] text-black font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] p-6">
            <div className="max-w-md mx-auto pt-16 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center space-y-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-slate-50 shadow-inner">
                        <img src={profile.user.image} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{profile.user.name}</h1>
                        <p className="text-slate-400 font-semibold">{profile.occupation || "Apple Enthusiast"}</p>
                    </div>
                    <div className="flex gap-4 w-full pt-4">
                        <button onClick={handleShare} className="flex-1 bg-[#007AFF] text-white py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all">Siri Suggests</button>
                        <button className="flex-1 bg-white border border-slate-100 text-black py-3 rounded-2xl font-bold shadow-sm active:scale-95 transition-all">Connect</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {profile.services?.slice(0, 4).map((s: any, i: number) => (
                        <div key={i} className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-2 border border-white/40">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-500">
                                <Zap size={20} fill="currentColor" />
                            </div>
                            <span className="text-[11px] font-black uppercase text-slate-800 tracking-tight">{s.title}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">About Me</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">{profile.bio}</p>
                </div>
            </div>
        </div>
    )
}

function CreativeTemplate({ profile }: any) {
    return <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fuchsia-600 text-white flex items-center justify-center font-black italic text-4xl p-10 leading-tight">
        UNDER CONSTRUCTION: CREATIVE GLASS THEME
        <br />
        <span className="text-2xl mt-4 opacity-50">{profile.user.name}</span>
    </div>
}

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

    if (!mounted) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

    const props = { profile, t, lang, setIsAppointmentOpen, isAppointmentOpen, handleShare }

    // Template Selector Logic
    const renderTemplate = () => {
        switch (profile.templateId) {
            case "bento": return <BentoTemplate {...props} />;
            case "business": return <BusinessTemplate {...props} />;
            case "luxury": return <LuxuryTemplate {...props} />;
            case "creative": return <CreativeTemplate {...props} />;
            case "minimal_ios": return <MinimalIOSTemplate {...props} />;
            case "modern": return <BentoTemplate {...props} />; // Fallback for now
            default: return <BentoTemplate {...props} />;
        }
    }

    return (
        <>
            <AppointmentModal profile={profile} isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} t={t} />
            {renderTemplate()}

            {/* Success Toast */}
            <AnimatePresence>
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-4 rounded-full font-black shadow-2xl flex items-center gap-3 border border-white/20"
                    >
                        <CheckCircle2 size={20} className="text-green-500" /> Link Kopyalandı!
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

