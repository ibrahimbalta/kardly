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
    ArrowUpRight,
    Compass,
    CheckCircle2
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
        { id: "all", name: t('categoryAll'), icon: <LayoutGrid size={12} /> },
        { id: "Software", name: t('hubCatSoftware'), icon: <Zap size={12} /> },
        { id: "Design", name: t('hubCatDesign'), icon: <Sparkles size={12} /> },
        { id: "Marketing", name: t('hubCatMarketing'), icon: <TrendingUp size={12} /> },
        { id: "Health", name: t('hubCatHealth'), icon: <Zap size={12} /> },
        { id: "Law", name: t('hubCatLaw'), icon: <Briefcase size={12} /> },
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
        <div className="min-h-screen bg-[#fff8fb] pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
            {/* Subtle Rose/Lavender Background Pattern */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-rose-100/30 via-[#fff8fb] to-transparent" />
                <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-rose-50/40 rounded-full blur-[140px]" />
                <div className="absolute top-[20%] left-[-5%] w-[40%] h-[40%] bg-indigo-50/30 rounded-full blur-[120px]" />
                
                {/* Micro Dots Pattern */}
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#f43f5e 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Header - Ultra Refined */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-rose-200/50 mb-6"
                    >
                        <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-rose-400">
                            {networkUsers.length} {t('activeProfessionals')}
                        </span>
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4 leading-tight uppercase"
                    >
                        {t('hubHeroTitle')} <br /> 
                        <span className="text-rose-500 italic">
                            {t('hubHeroTitleItalic')}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm text-slate-400 font-medium max-w-lg mx-auto mb-10 leading-relaxed"
                    >
                        {t('hubHeroSub')}
                    </motion.p>

                    {/* Minimalist Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl shadow-rose-200/20 border border-white flex flex-col sm:flex-row items-center gap-1.5"
                    >
                        <div className="relative flex-1 w-full pl-4 flex items-center">
                            <Search className="text-rose-200" size={18} />
                            <input
                                type="text"
                                placeholder={t('hubSearchPlaceholder')}
                                value={networkSearch}
                                onChange={(e) => setNetworkSearch(e.target.value)}
                                className="w-full h-10 pl-2.5 pr-4 bg-transparent text-slate-900 font-bold placeholder:text-slate-200 outline-none text-xs"
                            />
                        </div>
                        <button 
                            onClick={() => setIsHubAiOpen(true)}
                            className="w-full sm:w-auto h-10 px-6 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500 transition-all active:scale-95 shrink-0"
                        >
                            <Sparkles size={12} />
                            {t('hubAiSearchBtn')}
                        </button>
                    </motion.div>
                </div>

                {/* Categories - Compact Pills */}
                <div className="flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar pb-8 mb-10 px-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] transition-all shrink-0 border",
                                selectedCategory === cat.id 
                                    ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-100" 
                                    : "bg-white/50 text-slate-400 border-rose-100/50 hover:border-rose-300 hover:text-rose-500"
                            )}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar - Refined Compact */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-7 h-7 bg-rose-100 text-rose-500 rounded-lg flex items-center justify-center">
                                    <TrendingUp size={14} />
                                </div>
                                <h3 className="font-black text-slate-900 text-[10px] tracking-widest uppercase">{t('hubTrendingTitle')}</h3>
                            </div>
                            <div className="space-y-4">
                                {[...networkUsers].sort((a, b) => (b.profile?.totalViews || 0) - (a.profile?.totalViews || 0)).slice(0, 4).map((u, i) => (
                                    <Link key={i} href={`/${u.profile?.username || u.name}`} className="flex items-center gap-3 group">
                                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-white shadow-sm group-hover:scale-110 transition-transform">
                                            <img src={u.image || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[9px] font-black text-slate-800 truncate group-hover:text-rose-500 transition-colors uppercase italic">{u.name}</div>
                                            <div className="text-[7px] text-slate-400 font-bold uppercase tracking-[0.1em] truncate">{u.profile?.occupation}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-rose-500 p-6 rounded-3xl text-white relative overflow-hidden group shadow-xl shadow-rose-200/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-xl -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-700" />
                            <div className="relative z-10">
                                <Sparkles className="text-white/80 mb-4" size={20} />
                                <h3 className="text-md font-black tracking-tighter mb-2 uppercase leading-tight">{t('hubAiAssistTitle')}</h3>
                                <p className="text-[9px] text-white/70 font-medium mb-6 leading-relaxed">{t('hubAiAssistSub')}</p>
                                <Link href="/register" className="flex items-center justify-center w-full h-10 bg-white text-rose-500 rounded-lg font-black text-[8px] uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] transition-all">
                                    {t('hubJoinBtn')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Profiles Grid - Ultra Compact & Interesting Cards */}
                    <div className="lg:col-span-9">
                        {isNetworkLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="h-60 bg-white/20 rounded-2xl border border-white animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
                                            whileHover={{ y: -4, scale: 1.02 }}
                                            className={cn(
                                                "group relative rounded-2xl border overflow-hidden flex flex-col transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-rose-100 cursor-pointer h-full bg-white",
                                                isLight ? "border-rose-50" : "border-slate-100",
                                            )}
                                            onClick={() => window.open(`https://${user.profile?.username || user.name}.kardly.site`, '_blank')}
                                        >
                                            {/* Top Accents */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500/10 group-hover:bg-rose-500 transition-colors" />
                                            
                                            <div className="p-4 flex flex-col h-full relative z-10">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm group-hover:rotate-3 transition-transform duration-500">
                                                            <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <div className="flex items-center gap-1 text-[8px] font-black text-amber-500">
                                                            <Star size={8} fill="currentColor" />
                                                            <span>{user.profile?.avgRating || "5.0"}</span>
                                                        </div>
                                                        {user.profile?.totalViews > 100 && (
                                                            <CheckCircle2 size={12} className="text-indigo-500" />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic mb-0.5 group-hover:text-rose-500 transition-colors truncate">{user.name}</h4>
                                                    <div className="flex items-center gap-1">
                                                        <span className="w-1 h-1 rounded-full bg-rose-500/30" />
                                                        <p className="text-[7px] font-black uppercase tracking-[0.1em] text-slate-300 truncate">{user.profile?.occupation}</p>
                                                    </div>
                                                </div>

                                                {user.profile?.slogan && (
                                                    <p className="text-[9px] text-slate-400 font-medium italic line-clamp-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity mb-4">
                                                        "{user.profile.slogan}"
                                                    </p>
                                                )}

                                                <div className="mt-auto pt-4 border-t border-rose-50 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 text-slate-200 group-hover:text-rose-300 transition-colors">
                                                        <Users size={10} />
                                                        <span className="text-[8px] font-black uppercase tracking-widest">{user.profile?.totalViews || 0}</span>
                                                    </div>
                                                    
                                                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-300 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 flex items-center justify-center">
                                                        <ArrowUpRight size={12} />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                        
                        {!isNetworkLoading && filteredUsers.length === 0 && (
                            <div className="py-24 text-center bg-white/40 rounded-[2.5rem] border border-dashed border-rose-200">
                                <Compass className="w-12 h-12 mx-auto mb-4 text-rose-100" />
                                <h3 className="text-md font-black text-slate-900 mb-1 uppercase tracking-widest">{t('hubNoUsersTitle')}</h3>
                                <p className="text-[10px] text-slate-300 font-medium">{t('hubNoUsersSub')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Assistant Modal - Ultra Compact Variant */}
            <AnimatePresence>
                {isHubAiOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsHubAiOpen(false)}
                            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.99, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.99, opacity: 0, y: 15 }}
                            className="bg-white w-full max-w-xl h-[75vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative z-10 border border-rose-50"
                        >
                            {/* AI Header */}
                            <div className="p-6 border-b border-rose-50 flex items-center justify-between shrink-0 bg-gradient-to-r from-rose-50/20 to-transparent">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-md font-black text-slate-900 tracking-tighter uppercase italic">{t('hubAiChatTitle')}</h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{t('hubAiChatStatus')}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsHubAiOpen(false)} className="w-9 h-9 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* AI Chat Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                                {hubAiChat.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-slate-300 font-medium italic text-sm leading-relaxed max-w-[200px] mx-auto">"{t('hubAiChatGreeting')}"</p>
                                    </div>
                                )}
                                {hubAiChat.map((msg, idx) => (
                                    <div key={idx} className={cn(
                                        "flex gap-3 max-w-[90%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}>
                                        <div className={cn(
                                            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                            msg.role === 'user' ? "bg-slate-100 text-slate-400" : "bg-rose-500 text-white"
                                        )}>
                                            {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                                        </div>
                                        <div className={cn(
                                            "p-4 rounded-2xl text-[12px] font-medium leading-relaxed shadow-sm",
                                            msg.role === 'user' ? "bg-slate-50 text-slate-800 rounded-tr-none" : "bg-rose-50/50 text-slate-900 rounded-tl-none border border-rose-100/50"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isHubAiLoading && (
                                    <div className="flex gap-3 mr-auto animate-pulse">
                                        <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center">
                                            <Sparkles size={14} className="animate-spin" />
                                        </div>
                                        <div className="p-4 rounded-2xl bg-rose-50/50 text-slate-400 rounded-tl-none border border-rose-100/50 italic text-[12px]">
                                            {t('hubAiChatSearching')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* AI Input */}
                            <div className="p-6 border-t border-rose-50 shrink-0">
                                <form 
                                    onSubmit={(e) => { e.preventDefault(); handleHubAiChat(); }}
                                    className="relative"
                                >
                                    <input
                                        type="text"
                                        value={hubAiMessage}
                                        onChange={(e) => setHubAiMessage(e.target.value)}
                                        placeholder={t('hubAiChatPlaceholder')}
                                        className="w-full h-12 pl-5 pr-16 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-medium text-slate-900 outline-none placeholder:text-slate-200"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!hubAiMessage.trim() || isHubAiLoading}
                                        className="absolute right-1.5 top-1.5 w-9 h-9 bg-rose-500 text-white rounded-lg flex items-center justify-center hover:bg-rose-600 transition-all disabled:opacity-20 shadow-md shadow-rose-100 active:scale-95"
                                    >
                                        <Send size={16} />
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
