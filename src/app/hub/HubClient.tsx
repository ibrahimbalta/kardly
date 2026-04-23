"use client"

import React, { useState, useEffect } from "react"
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
    Globe,
    Compass,
    ArrowUpRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"
import { TEMPLATES } from "@/components/BusinessCardGenerator"
import Link from "next/link"

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
        { id: "Health", name: t('hubCatHealth'), icon: <Zap size={14} /> },
        { id: "Law", name: t('hubCatLaw'), icon: <Briefcase size={14} /> },
    ]

    const filteredUsers = networkUsers.filter(u => {
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
                body: JSON.stringify({
                    message: userMsg,
                    history: hubAiChat,
                    profiles: networkContext
                })
            })
            
            const data = await res.json()
            if (data.reply) {
                setHubAiChat([...currentChat, { role: 'assistant' as const, content: data.reply }])
            } else {
                setHubAiChat([...currentChat, { role: 'assistant' as const, content: "Üzgünüm, şu an yanıt veremiyorum." }])
            }
        } catch (err) {
            console.error(err)
            setHubAiChat([...currentChat, { role: 'assistant' as const, content: "Bağlantı hatası oluştu." }])
        } finally {
            setIsHubAiLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden selection:bg-rose-500/30">
            {/* Elite Background System */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-[1000px] bg-gradient-to-b from-rose-950/20 via-black to-transparent" />
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-rose-500/10 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                
                {/* Subtle Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Header - Premium Variant */}
                <div className="text-center mb-20 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-8 shadow-2xl"
                    >
                        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                            {networkUsers.length} {t('activeProfessionals')}
                        </span>
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl sm:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.85] uppercase"
                    >
                        {t('hubHeroTitle')} <br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-400 to-rose-600 italic">
                            {t('hubHeroTitleItalic')}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg sm:text-xl text-white/40 font-medium max-w-2xl mx-auto mb-14 leading-relaxed"
                    >
                        {t('hubHeroSub')}
                    </motion.p>

                    {/* Elite Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-4xl mx-auto bg-white/[0.03] backdrop-blur-3xl p-3 rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col sm:flex-row items-center gap-3 group"
                    >
                        <div className="relative flex-1 w-full pl-6 flex items-center">
                            <Search className="text-white/20 group-focus-within:text-rose-500 transition-colors" size={24} />
                            <input
                                type="text"
                                placeholder={t('hubSearchPlaceholder')}
                                value={networkSearch}
                                onChange={(e) => setNetworkSearch(e.target.value)}
                                className="w-full h-16 pl-4 pr-6 bg-transparent text-white text-lg font-bold placeholder:text-white/10 outline-none"
                            />
                        </div>
                        <button 
                            onClick={() => setIsHubAiOpen(true)}
                            className="w-full sm:w-auto h-16 px-10 bg-rose-500 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-rose-600 transition-all active:scale-95 shrink-0 shadow-2xl shadow-rose-500/20"
                        >
                            <Sparkles size={18} />
                            {t('hubAiSearchBtn')}
                        </button>
                    </motion.div>
                </div>

                {/* Categories - Elite Pill Style */}
                <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar pb-12 mb-16 px-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shrink-0 border relative overflow-hidden group",
                                selectedCategory === cat.id 
                                    ? "bg-white text-black border-white shadow-[0_15px_40px_-10px_rgba(255,255,255,0.3)]" 
                                    : "bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white"
                            )}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {cat.icon}
                                {cat.name}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Elite Sidebar */}
                    <div className="lg:col-span-3 space-y-10">
                        {/* Trending Section */}
                        <div className="bg-white/[0.02] backdrop-blur-2xl p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-white/5 text-rose-500 rounded-2xl flex items-center justify-center border border-white/10">
                                    <TrendingUp size={22} />
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-md tracking-widest uppercase leading-none">{t('hubTrendingTitle')}</h3>
                                    <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em] mt-2">{t('hubTrendingSub')}</p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                {[...networkUsers].sort((a, b) => (b.profile?.totalViews || 0) - (a.profile?.totalViews || 0)).slice(0, 4).map((u, i) => (
                                    <Link key={i} href={`/${u.profile?.username || u.name}`} className="flex items-center gap-5 group">
                                        <div className="relative shrink-0">
                                            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 group-hover:border-rose-500 transition-all shadow-xl">
                                                <img src={u.image || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                                            </div>
                                            {i === 0 && (
                                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-lg border border-black">
                                                    1
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[11px] font-black text-white/80 truncate group-hover:text-rose-500 transition-colors uppercase italic tracking-tight">{u.name}</div>
                                            <div className="text-[9px] text-white/20 font-bold uppercase tracking-[0.15em] truncate mt-1">{u.profile?.occupation}</div>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-black text-amber-500/80">
                                            <Star size={10} fill="currentColor" />
                                            {u.profile?.avgRating || "5.0"}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Join Hub Promo */}
                        <div className="bg-gradient-to-br from-rose-600 to-rose-700 p-10 rounded-[3rem] text-white relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(244,63,94,0.4)]">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-black/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                                    <Sparkles className="text-white" size={28} />
                                </div>
                                <h3 className="text-2xl font-black tracking-tighter mb-5 leading-[1.1] uppercase">{t('hubAiAssistTitle')}</h3>
                                <p className="text-[13px] text-white/80 font-medium mb-10 leading-relaxed">{t('hubAiAssistSub')}</p>
                                <Link href="/register" className="flex items-center justify-center w-full h-14 bg-white text-rose-600 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.03] transition-all active:scale-95">
                                    {t('hubJoinBtn')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Elite Profiles Grid */}
                    <div className="lg:col-span-9">
                        {isNetworkLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-96 bg-white/[0.02] rounded-[3rem] border border-white/5 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredUsers.map((user) => {
                                    const userTplId = user.profile?.businessCardTemplateId || "minimal_white";
                                    const tpl = TEMPLATES.find(t => t.id === userTplId) || TEMPLATES[0];
                                    const isLight = tpl.hex === '#ffffff' || tpl.bg.includes('white') || tpl.bg.includes('slate-50');

                                    return (
                                        <motion.div
                                            key={user.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ y: -12 }}
                                            className={cn(
                                                "group relative rounded-[3rem] border overflow-hidden flex flex-col transition-all duration-700 shadow-2xl",
                                                isLight ? "bg-[#ffffff03] border-white/5" : "bg-[#ffffff05] border-white/10",
                                            )}
                                            onClick={() => window.open(`https://${user.profile?.username || user.name}.kardly.site`, '_blank')}
                                        >
                                            {/* Decorative Background for Card */}
                                            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-indigo-500/5" />
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full" />
                                            </div>

                                            <div className="p-8 flex flex-col h-full relative z-10">
                                                <div className="flex items-start justify-between mb-8">
                                                    <div className="relative">
                                                        <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-2 border-white/10 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                                            <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" alt="" />
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-[#0a0a0a] rounded-full shadow-xl" />
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/5 text-[9px] font-black text-rose-500 uppercase tracking-widest shadow-inner">
                                                            PRO
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/5 px-2.5 py-1 rounded-xl border border-amber-500/10">
                                                            <Star size={12} fill="currentColor" />
                                                            <span className="text-[11px] font-black">{user.profile?.avgRating || "5.0"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-8">
                                                    <h4 className="text-xl font-black text-white uppercase tracking-tight italic mb-1 group-hover:text-rose-500 transition-colors">{user.name}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{user.profile?.occupation}</p>
                                                    </div>
                                                </div>

                                                {user.profile?.slogan && (
                                                    <p className="text-[12px] text-white/50 font-medium italic mb-10 line-clamp-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                                                        "{user.profile.slogan}"
                                                    </p>
                                                )}

                                                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-white/20 group-hover:text-white/40 transition-colors">
                                                        <Users size={16} />
                                                        <span className="text-[11px] font-black uppercase tracking-widest">{user.profile?.totalViews || 0} {t('hubViews')}</span>
                                                    </div>
                                                    
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition-all duration-500 group-hover:rotate-12">
                                                        <ArrowUpRight size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                        
                        {!isNetworkLoading && filteredUsers.length === 0 && (
                            <div className="py-40 text-center bg-white/[0.02] rounded-[4rem] border border-dashed border-white/5">
                                <Compass className="w-20 h-20 mx-auto mb-8 text-white/5" />
                                <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-widest">{t('hubNoUsersTitle')}</h3>
                                <p className="text-md text-white/20 font-medium">{t('hubNoUsersSub')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Elite AI Assistant Modal */}
            <AnimatePresence>
                {isHubAiOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsHubAiOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="bg-[#0a0a0a] w-full max-w-3xl h-[85vh] rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(244,63,94,0.3)] flex flex-col overflow-hidden relative z-10 border border-white/10"
                        >
                            {/* AI Header */}
                            <div className="p-10 border-b border-white/5 flex items-center justify-between shrink-0 bg-gradient-to-r from-rose-500/10 to-transparent">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-rose-500 text-white rounded-[2rem] flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)]">
                                        <Sparkles size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">{t('hubAiChatTitle')}</h3>
                                        <div className="flex items-center gap-2.5 mt-1">
                                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                            <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em]">{t('hubAiChatStatus')}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsHubAiOpen(false)} className="w-12 h-12 rounded-full bg-white/5 text-white/40 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all border border-white/5">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* AI Chat Area */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                                {hubAiChat.length === 0 && (
                                    <div className="text-center py-20">
                                        <Compass className="w-16 h-16 mx-auto mb-8 text-white/5" />
                                        <p className="text-white/20 font-medium italic text-lg leading-relaxed max-w-sm mx-auto">"{t('hubAiChatGreeting')}"</p>
                                    </div>
                                )}
                                {hubAiChat.map((msg, idx) => (
                                    <div key={idx} className={cn(
                                        "flex gap-6 max-w-[90%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}>
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xl",
                                            msg.role === 'user' ? "bg-white/5 text-white/20 border border-white/5" : "bg-rose-500 text-white"
                                        )}>
                                            {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                                        </div>
                                        <div className={cn(
                                            "p-7 rounded-[2.5rem] text-[15px] font-medium leading-relaxed shadow-2xl",
                                            msg.role === 'user' ? "bg-white/5 text-white/90 rounded-tr-none border border-white/5" : "bg-rose-500/5 text-white rounded-tl-none border border-rose-500/10"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isHubAiLoading && (
                                    <div className="flex gap-6 mr-auto animate-pulse">
                                        <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center">
                                            <Sparkles size={18} className="animate-spin" />
                                        </div>
                                        <div className="p-7 rounded-[2.5rem] bg-rose-500/5 text-white/40 rounded-tl-none border border-rose-500/10 italic text-[15px]">
                                            {t('hubAiChatSearching')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* AI Input */}
                            <div className="p-10 border-t border-white/5 shrink-0 bg-black/50">
                                <form 
                                    onSubmit={(e) => { e.preventDefault(); handleHubAiChat(); }}
                                    className="relative"
                                >
                                    <input
                                        type="text"
                                        value={hubAiMessage}
                                        onChange={(e) => setHubAiMessage(e.target.value)}
                                        placeholder={t('hubAiChatPlaceholder')}
                                        className="w-full h-20 pl-10 pr-24 bg-white/5 border border-white/10 rounded-[2rem] text-lg font-medium text-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500/50 transition-all outline-none placeholder:text-white/10 shadow-inner"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!hubAiMessage.trim() || isHubAiLoading}
                                        className="absolute right-3 top-3 w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center hover:bg-rose-600 transition-all disabled:opacity-20 shadow-xl shadow-rose-500/20 active:scale-90"
                                    >
                                        <Send size={24} />
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
