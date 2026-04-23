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
    Compass
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
        <div className="min-h-screen bg-[#fafbff] pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
            {/* Soft Professional Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-rose-50/40 via-white to-transparent" />
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-50/30 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] bg-rose-50/20 rounded-full blur-[100px]" />
                
                {/* Minimal Grid */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Header - Scaled Down for Spacing */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-rose-100/50 mb-8"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                            {networkUsers.length} {t('activeProfessionals')}
                        </span>
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight uppercase"
                    >
                        {t('hubHeroTitle')} <br /> 
                        <span className="text-rose-500 italic">
                            {t('hubHeroTitleItalic')}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-md text-slate-400 font-medium max-w-xl mx-auto mb-12 leading-relaxed"
                    >
                        {t('hubHeroSub')}
                    </motion.p>

                    {/* Compact Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-3xl mx-auto bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col sm:flex-row items-center gap-2"
                    >
                        <div className="relative flex-1 w-full pl-5 flex items-center">
                            <Search className="text-slate-300" size={20} />
                            <input
                                type="text"
                                placeholder={t('hubSearchPlaceholder')}
                                value={networkSearch}
                                onChange={(e) => setNetworkSearch(e.target.value)}
                                className="w-full h-12 pl-3 pr-6 bg-transparent text-slate-900 font-bold placeholder:text-slate-200 outline-none text-sm"
                            />
                        </div>
                        <button 
                            onClick={() => setIsHubAiOpen(true)}
                            className="w-full sm:w-auto h-12 px-8 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-500 transition-all active:scale-95 shrink-0 shadow-lg"
                        >
                            <Sparkles size={14} />
                            {t('hubAiSearchBtn')}
                        </button>
                    </motion.div>
                </div>

                {/* Categories - More Compact */}
                <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-10 mb-12 px-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 border",
                                selectedCategory === cat.id 
                                    ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-100" 
                                    : "bg-white text-slate-400 border-slate-100 hover:border-rose-100 hover:text-rose-500"
                            )}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Main Content Grid - More Columns/Compact */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                                    <TrendingUp size={18} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-[11px] tracking-widest uppercase leading-none">{t('hubTrendingTitle')}</h3>
                                    <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-1">{t('hubTrendingSub')}</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {[...networkUsers].sort((a, b) => (b.profile?.totalViews || 0) - (a.profile?.totalViews || 0)).slice(0, 4).map((u, i) => (
                                    <Link key={i} href={`/${u.profile?.username || u.name}`} className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-50 group-hover:border-rose-500 transition-all shadow-sm">
                                            <img src={u.image || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[10px] font-black text-slate-800 truncate group-hover:text-rose-500 transition-colors uppercase italic tracking-tight">{u.name}</div>
                                            <div className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.1em] truncate mt-0.5">{u.profile?.occupation}</div>
                                        </div>
                                        <div className="flex items-center gap-1 text-[9px] font-black text-amber-500">
                                            <Star size={9} fill="currentColor" />
                                            {u.profile?.avgRating || "5.0"}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
                            <div className="relative z-10">
                                <Sparkles className="text-rose-500 mb-6" size={28} />
                                <h3 className="text-lg font-black tracking-tighter mb-3 uppercase leading-tight">{t('hubAiAssistTitle')}</h3>
                                <p className="text-[11px] text-slate-400 font-medium mb-8 leading-relaxed">{t('hubAiAssistSub')}</p>
                                <Link href="/register" className="flex items-center justify-center w-full h-11 bg-rose-500 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-rose-500/20 hover:scale-[1.02] transition-all">
                                    {t('hubJoinBtn')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Profiles Grid - More Items Visible */}
                    <div className="lg:col-span-9">
                        {isNetworkLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-72 bg-white rounded-3xl border border-slate-50 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                                            whileHover={{ y: -6 }}
                                            className={cn(
                                                "group relative rounded-3xl border overflow-hidden flex flex-col transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 bg-white",
                                                isLight ? "border-slate-50" : "border-slate-100",
                                            )}
                                            onClick={() => window.open(`https://${user.profile?.username || user.name}.kardly.site`, '_blank')}
                                        >
                                            <div className="p-6 flex flex-col h-full relative z-10">
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="relative">
                                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-500">
                                                            <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1.5">
                                                        <div className="px-2.5 py-1 bg-slate-50 rounded-lg text-[8px] font-black text-rose-500 uppercase tracking-widest border border-slate-100">
                                                            PRO
                                                        </div>
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            <Star size={10} fill="currentColor" />
                                                            <span className="text-[10px] font-black">{user.profile?.avgRating || "5.0"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-6">
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic mb-1 group-hover:text-rose-500 transition-colors truncate">{user.name}</h4>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 truncate">{user.profile?.occupation}</p>
                                                </div>

                                                {user.profile?.slogan && (
                                                    <p className="text-[11px] text-slate-400 font-medium italic mb-8 line-clamp-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                                                        "{user.profile.slogan}"
                                                    </p>
                                                )}

                                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-slate-200 group-hover:text-slate-400 transition-colors">
                                                        <Users size={14} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{user.profile?.totalViews || 0} {t('hubViews')}</span>
                                                    </div>
                                                    
                                                    <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-300 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 flex items-center justify-center">
                                                        <ArrowUpRight size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                        
                        {!isNetworkLoading && filteredUsers.length === 0 && (
                            <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-100">
                                <Compass className="w-16 h-16 mx-auto mb-6 text-slate-100" />
                                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-widest">{t('hubNoUsersTitle')}</h3>
                                <p className="text-sm text-slate-300 font-medium">{t('hubNoUsersSub')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Assistant Modal - Light Variant */}
            <AnimatePresence>
                {isHubAiOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsHubAiOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.98, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-2xl h-[80vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative z-10"
                        >
                            {/* AI Header */}
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0 bg-gradient-to-r from-rose-50/30 to-transparent">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-rose-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-rose-200">
                                        <Sparkles size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">{t('hubAiChatTitle')}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{t('hubAiChatStatus')}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsHubAiOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* AI Chat Area */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                                {hubAiChat.length === 0 && (
                                    <div className="text-center py-16">
                                        <p className="text-slate-300 font-medium italic text-md leading-relaxed max-w-xs mx-auto">"{t('hubAiChatGreeting')}"</p>
                                    </div>
                                )}
                                {hubAiChat.map((msg, idx) => (
                                    <div key={idx} className={cn(
                                        "flex gap-4 max-w-[85%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}>
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                            msg.role === 'user' ? "bg-slate-50 text-slate-400 border border-slate-100" : "bg-rose-500 text-white"
                                        )}>
                                            {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                                        </div>
                                        <div className={cn(
                                            "p-6 rounded-[2rem] text-[14px] font-medium leading-relaxed",
                                            msg.role === 'user' ? "bg-slate-50 text-slate-800 rounded-tr-none border border-slate-100/50" : "bg-rose-50 text-slate-900 rounded-tl-none border border-rose-100"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isHubAiLoading && (
                                    <div className="flex gap-4 mr-auto animate-pulse">
                                        <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                                            <Sparkles size={16} className="animate-spin" />
                                        </div>
                                        <div className="p-6 rounded-[2rem] bg-rose-50 text-slate-400 rounded-tl-none border border-rose-100 italic text-[14px]">
                                            {t('hubAiChatSearching')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* AI Input */}
                            <div className="p-8 border-t border-slate-50 shrink-0">
                                <form 
                                    onSubmit={(e) => { e.preventDefault(); handleHubAiChat(); }}
                                    className="relative"
                                >
                                    <input
                                        type="text"
                                        value={hubAiMessage}
                                        onChange={(e) => setHubAiMessage(e.target.value)}
                                        placeholder={t('hubAiChatPlaceholder')}
                                        className="w-full h-16 pl-6 pr-20 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium text-slate-900 focus:ring-4 focus:ring-rose-100 focus:border-rose-200 transition-all outline-none placeholder:text-slate-200"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!hubAiMessage.trim() || isHubAiLoading}
                                        className="absolute right-2 top-2 w-12 h-12 bg-rose-500 text-white rounded-xl flex items-center justify-center hover:bg-rose-600 transition-all disabled:opacity-30 shadow-lg shadow-rose-200 active:scale-95"
                                    >
                                        <Send size={20} />
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
