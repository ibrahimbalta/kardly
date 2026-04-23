"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Search, 
    Sparkles, 
    Zap, 
    Star, 
    User, 
    TrendingUp,
    LayoutGrid,
    Users,
    Send,
    X,
    Briefcase,
    ArrowUpRight,
    Globe,
    ShieldCheck,
    MessageSquare,
    Target,
    Award,
    Cpu
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"
import { TEMPLATES } from "@/components/BusinessCardGenerator"
import Link from "next/link"

// Elite Gradient Animation Background
const EliteBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#020205]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-500/20 rounded-full blur-[160px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        {/* Animated Mesh Grid */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: 'linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    </div>
)

export default function HubClient({ initialUsers = [] }: { initialUsers: any[] }) {
    const { t } = useTranslation()
    const [networkUsers, setNetworkUsers] = useState<any[]>(initialUsers)
    const [networkSearch, setNetworkSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [isNetworkLoading, setIsNetworkLoading] = useState(initialUsers.length === 0)
    const [isHubAiOpen, setIsHubAiOpen] = useState(false)
    const [hubAiMessage, setHubAiMessage] = useState("")
    const [hubAiChat, setHubAiChat] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
    const [isHubAiLoading, setIsHubAiLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'trending'>('all')

    useEffect(() => {
        if (initialUsers.length === 0) {
            fetchNetwork()
        }
    }, [])

    const fetchNetwork = async () => {
        setIsNetworkLoading(true)
        try {
            const res = await fetch("/api/network")
            if (!res.ok) throw new Error("Network error")
            const data = await res.json()
            if (Array.isArray(data)) setNetworkUsers(data)
        } catch (err) {
            console.error(err)
        } finally {
            setIsNetworkLoading(false)
        }
    }

    const categories = [
        { id: "all", name: t('categoryAll'), icon: <LayoutGrid size={14} /> },
        { id: "Software", name: t('hubCatSoftware'), icon: <Zap size={14} /> },
        { id: "Design", name: t('hubCatDesign'), icon: <Sparkles size={14} /> },
        { id: "Marketing", name: t('hubCatMarketing'), icon: <TrendingUp size={14} /> },
        { id: "Law", name: t('hubCatLaw'), icon: <Briefcase size={14} /> },
    ]

    const filteredUsers = useMemo(() => {
        return networkUsers.filter(u => {
            const searchLower = networkSearch.toLowerCase()
            const matchesSearch = (
                u.name?.toLowerCase().includes(searchLower) ||
                u.profile?.occupation?.toLowerCase().includes(searchLower) ||
                u.profile?.username?.toLowerCase().includes(searchLower) ||
                u.profile?.displayName?.toLowerCase().includes(searchLower) ||
                u.profile?.bio?.toLowerCase().includes(searchLower)
            )
            const matchesCategory = selectedCategory === "all" || u.profile?.occupation?.toLowerCase().includes(selectedCategory.toLowerCase())
            return matchesSearch && matchesCategory
        })
    }, [networkUsers, networkSearch, selectedCategory])

    const matchOfTheDay = useMemo(() => networkUsers[Math.floor(Math.random() * networkUsers.length)], [networkUsers])

    const handleHubAiChat = async () => {
        if (!hubAiMessage.trim() || isHubAiLoading) return
        const userMsg = hubAiMessage
        setHubAiMessage("")
        const currentChat = [...hubAiChat, { role: 'user' as const, content: userMsg }]
        setHubAiChat(currentChat)
        setIsHubAiLoading(true)
        try {
            const networkContext = networkUsers.map(u => ({
                name: u.profile?.displayName || u.name,
                occupation: u.profile?.occupation,
                bio: u.profile?.bio,
                username: u.profile?.username
            }))
            const res = await fetch("/api/ai/hub-assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg, history: hubAiChat, profiles: networkContext })
            })
            const data = await res.json()
            if (data.reply) setHubAiChat([...currentChat, { role: 'assistant' as const, content: data.reply }])
        } catch (err) {
            console.error(err)
        } finally {
            setIsHubAiLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 sm:px-10 relative">
            <EliteBackground />

            <div className="max-w-[1600px] mx-auto relative z-10">
                {/* Header Section - Modern Architectural Design */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-center">
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 mb-10 shadow-2xl"
                        >
                            <Cpu className="text-rose-500 animate-spin-slow" size={18} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
                                AI Powered Professional Network
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl sm:text-[100px] font-black text-white leading-[0.85] tracking-tighter uppercase mb-10"
                        >
                            Professional <br /> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-500 italic">
                                Discovery.
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/40 font-medium max-w-2xl leading-relaxed mb-12"
                        >
                            Kardly Business Hub is a future-ready network designed for elite professionals. Find partners, grow your business, and dominate your industry.
                        </motion.p>
                        
                        {/* Interactive Search Console */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/[0.03] backdrop-blur-3xl p-3 rounded-[2.5rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex items-center gap-4 group"
                        >
                            <div className="relative flex-1 pl-6 flex items-center">
                                <Search className="text-white/20 group-focus-within:text-rose-500 transition-colors" size={24} />
                                <input
                                    type="text"
                                    placeholder="Search by name, skill or expertise..."
                                    value={networkSearch}
                                    onChange={(e) => setNetworkSearch(e.target.value)}
                                    className="w-full h-16 pl-5 text-white font-black text-lg bg-transparent placeholder:text-white/5 outline-none"
                                />
                            </div>
                            <button 
                                onClick={() => setIsHubAiOpen(true)}
                                className="h-16 px-10 bg-white text-black rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-2xl"
                            >
                                <Sparkles size={18} />
                                Start AI Search
                            </button>
                        </motion.div>
                    </div>

                    {/* Elite Stats Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 hidden lg:block"
                    >
                        <div className="bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10 grid grid-cols-2 gap-10">
                                <div>
                                    <div className="text-4xl font-black text-white mb-2">{networkUsers.length}</div>
                                    <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Active Members</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-white mb-2">5.0</div>
                                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Global Satisfaction</div>
                                </div>
                                <div className="col-span-2 pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Live Activity Feed</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-[11px] text-white/60">
                                            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">1</div>
                                            A new partner joined from <b>London, UK</b>
                                        </div>
                                        <div className="flex items-center gap-3 text-[11px] text-white/60">
                                            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">2</div>
                                            <b>Software</b> category is trending today
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Navigation & Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16 px-4">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    "flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shrink-0 border relative overflow-hidden group",
                                    selectedCategory === cat.id 
                                        ? "bg-rose-500 text-white border-rose-500 shadow-[0_15px_40px_-10px_rgba(244,63,94,0.5)]" 
                                        : "bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white"
                                )}
                            >
                                {cat.icon}
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                        {['all', 'featured', 'trending'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                    activeTab === tab ? "bg-white text-black shadow-xl" : "text-white/30 hover:text-white"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid - High Density Cinematic Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {isNetworkLoading ? (
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                            <div key={i} className="h-80 bg-white/[0.02] rounded-[2.5rem] border border-white/5 animate-pulse" />
                        ))
                    ) : (
                        filteredUsers.map((user) => {
                            const userTplId = user.profile?.businessCardTemplateId || "minimal_white";
                            const tpl = TEMPLATES.find(t => t.id === userTplId) || TEMPLATES[0];
                            const isLight = tpl.hex === '#ffffff' || tpl.bg.includes('white') || tpl.bg.includes('slate-50');

                            return (
                                <motion.div
                                    key={user.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -12, scale: 1.05 }}
                                    className={cn(
                                        "group relative rounded-[2.5rem] border overflow-hidden flex flex-col transition-all duration-700 shadow-2xl cursor-pointer aspect-[3/4]",
                                        tpl.bg,
                                        tpl.text,
                                        isLight ? "border-white/5" : "border-white/10"
                                    )}
                                    style={{
                                        background: tpl.colors ? `linear-gradient(135deg, ${tpl.colors[0]}, ${tpl.colors[1] || tpl.colors[0]})` : undefined,
                                        backgroundColor: tpl.colors ? undefined : (tpl.hex || undefined)
                                    }}
                                    onClick={() => window.open(`https://${user.profile?.username || user.name}.kardly.site`, '_blank')}
                                >
                                    {/* Premium Glossy Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    
                                    <div className="p-8 flex flex-col h-full relative z-10">
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="relative">
                                                <div className={cn(
                                                    "w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500",
                                                    isLight ? "border-black/5" : "border-white/20"
                                                )}>
                                                    <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-[#020205] rounded-full shadow-2xl" />
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-500 drop-shadow-lg">
                                                    <Star size={12} fill="currentColor" />
                                                    <span>{user.profile?.avgRating || "5.0"}</span>
                                                </div>
                                                {user.profile?.totalViews > 500 && (
                                                    <div className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-[7px] font-black uppercase tracking-widest">Verified</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h4 className={cn(
                                                "text-lg font-black uppercase tracking-tight italic line-clamp-1 mb-1",
                                                tpl.text
                                            )}>{user.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                                <p className={cn(
                                                    "text-[9px] font-black uppercase tracking-[0.2em] opacity-60 truncate",
                                                    tpl.text
                                                )}>{user.profile?.occupation}</p>
                                            </div>
                                        </div>

                                        {user.profile?.slogan && (
                                            <p className={cn(
                                                "text-[12px] font-medium italic line-clamp-3 leading-relaxed opacity-40 group-hover:opacity-100 transition-opacity mb-8",
                                                tpl.text
                                            )}>
                                                "{user.profile.slogan}"
                                            </p>
                                        )}

                                        <div className={cn(
                                            "mt-auto pt-8 border-t flex items-center justify-between",
                                            isLight ? "border-black/5" : "border-white/10"
                                        )}>
                                            <div className="flex items-center gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                                                <Users size={18} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{user.profile?.totalViews || 0}</span>
                                            </div>
                                            
                                            <div className={cn(
                                                "w-12 h-12 rounded-[1.2rem] transition-all duration-700 flex items-center justify-center shadow-inner group-hover:rotate-12",
                                                isLight ? "bg-black text-white" : "bg-white text-black"
                                            )}>
                                                <ArrowUpRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </div>

                {/* AI Spotlight - New Feature */}
                {!isNetworkLoading && filteredUsers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-32 p-16 bg-gradient-to-br from-indigo-950/40 via-black to-rose-950/40 rounded-[5rem] border border-white/5 relative overflow-hidden text-center shadow-3xl"
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <div className="w-20 h-20 bg-white/5 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-2xl">
                                <Target className="text-rose-500" size={36} />
                            </div>
                            <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
                                Meet Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500">Perfect Partner.</span>
                            </h2>
                            <p className="text-lg text-white/40 font-medium mb-12">
                                Let our AI analyze your goals and match you with the top 1% of our professional network instantly.
                            </p>
                            <button 
                                onClick={() => setIsHubAiOpen(true)}
                                className="px-14 py-6 bg-white text-black rounded-[2rem] font-black text-[13px] uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-3xl shadow-white/5"
                            >
                                Unlock AI Recommendations
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Futuristic Floating AI Button */}
            <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsHubAiOpen(true)}
                className="fixed bottom-10 right-10 w-20 h-20 bg-white text-black rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(255,255,255,0.5)] flex items-center justify-center group z-[100] border-4 border-black"
            >
                <Sparkles size={32} className="group-hover:rotate-12 transition-transform" />
                <div className="absolute right-full mr-6 px-6 py-3 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 pointer-events-none shadow-2xl border border-black/5">
                    Ask AI Assistant
                </div>
            </motion.button>

            {/* AI Console - Cyber Design */}
            <AnimatePresence>
                {isHubAiOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsHubAiOpen(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="bg-[#050505] w-full max-w-5xl h-[85vh] rounded-[4rem] shadow-[0_100px_200px_-50px_rgba(244,63,94,0.3)] flex flex-col overflow-hidden relative z-10 border border-white/10"
                        >
                            {/* AI Console Header */}
                            <div className="p-12 border-b border-white/5 flex items-center justify-between shrink-0 bg-gradient-to-r from-rose-500/10 via-transparent to-transparent">
                                <div className="flex items-center gap-8">
                                    <div className="w-20 h-20 bg-rose-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(244,63,94,0.5)]">
                                        <Sparkles size={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">Kardly Intelligence</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                                            <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em]">Quantum Mode Active</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsHubAiOpen(false)} className="w-16 h-16 rounded-full bg-white/5 text-white/40 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all border border-white/5">
                                    <X size={32} />
                                </button>
                            </div>

                            {/* AI Chat Console */}
                            <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar">
                                {hubAiChat.length === 0 && (
                                    <div className="text-center py-20 max-w-xl mx-auto">
                                        <Award className="text-white/5 mx-auto mb-10" size={80} />
                                        <p className="text-white/40 font-black italic text-2xl leading-tight uppercase tracking-tight">"Tell me your business goals, and I will find your next power partner."</p>
                                    </div>
                                )}
                                {hubAiChat.map((msg, idx) => (
                                    <div key={idx} className={cn(
                                        "flex gap-8 max-w-[85%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}>
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl border",
                                            msg.role === 'user' ? "bg-white/5 text-white/20 border-white/5" : "bg-rose-500 text-white border-rose-400"
                                        )}>
                                            {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
                                        </div>
                                        <div className={cn(
                                            "p-10 rounded-[3rem] text-lg font-medium leading-relaxed shadow-3xl",
                                            msg.role === 'user' ? "bg-white/5 text-white/90 rounded-tr-none border border-white/10" : "bg-white/5 text-white rounded-tl-none border border-white/10"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isHubAiLoading && (
                                    <div className="flex gap-8 mr-auto animate-pulse">
                                        <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center">
                                            <Sparkles size={20} className="animate-spin" />
                                        </div>
                                        <div className="p-10 rounded-[3rem] bg-white/5 text-white/20 rounded-tl-none border border-white/10 italic text-lg">
                                            Scanning global professional database...
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* AI Input Console */}
                            <div className="p-12 border-t border-white/5 bg-black/50">
                                <form 
                                    onSubmit={(e) => { e.preventDefault(); handleHubAiChat(); }}
                                    className="relative max-w-4xl mx-auto"
                                >
                                    <input
                                        type="text"
                                        value={hubAiMessage}
                                        onChange={(e) => setHubAiMessage(e.target.value)}
                                        placeholder="Type your strategic query here..."
                                        className="w-full h-24 pl-12 pr-32 bg-white/5 border border-white/10 rounded-[2.5rem] text-2xl font-black text-white focus:ring-8 focus:ring-rose-500/10 focus:border-rose-500/50 transition-all outline-none placeholder:text-white/5"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!hubAiMessage.trim() || isHubAiLoading}
                                        className="absolute right-4 top-4 w-16 h-16 bg-white text-black rounded-[1.8rem] flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all disabled:opacity-20 shadow-2xl active:scale-90"
                                    >
                                        <Send size={32} />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
