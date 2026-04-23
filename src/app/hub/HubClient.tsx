"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Search, 
    Sparkles, 
    Compass, 
    Zap, 
    Star, 
    User, 
    TrendingUp,
    LayoutGrid,
    Users,
    Send,
    X,
    Briefcase
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
        <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-rose-50/50 to-transparent pointer-events-none" />
            <div className="absolute top-40 right-[-10%] w-[40%] h-[40%] bg-rose-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute top-80 left-[-10%] w-[30%] h-[30%] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-rose-100 mb-6"
                    >
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {networkUsers.length} {t('activeProfessionals')}
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tighter mb-6 leading-[0.9]"
                    >
                        {t('hubHeroTitle')} <br /> <span className="text-rose-500 italic">{t('hubHeroTitleItalic')}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-10"
                    >
                        {t('hubHeroSub')}
                    </motion.p>

                    {/* Search Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-3xl mx-auto bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-rose-200/20 border border-white flex flex-col sm:flex-row items-center gap-2"
                    >
                        <div className="relative flex-1 w-full group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder={t('hubSearchPlaceholder')}
                                value={networkSearch}
                                onChange={(e) => setNetworkSearch(e.target.value)}
                                className="w-full h-14 pl-16 pr-6 bg-transparent text-slate-900 font-bold placeholder:text-slate-300 outline-none"
                            />
                        </div>
                        <button 
                            onClick={() => setIsHubAiOpen(true)}
                            className="w-full sm:w-auto h-14 px-8 bg-slate-950 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-rose-500 transition-all active:scale-95 shrink-0"
                        >
                            <Sparkles size={16} />
                            {t('hubAiSearchBtn')}
                        </button>
                    </motion.div>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-8 mb-12 px-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
                                selectedCategory === cat.id 
                                    ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200" 
                                    : "bg-white text-slate-500 border-slate-100 hover:border-rose-200"
                            )}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar - Stats & Trending */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-sm tracking-tight uppercase leading-none">{t('hubTrendingTitle')}</h3>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t('hubTrendingSub')}</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {[...networkUsers].sort((a, b) => (b.profile?.totalViews || 0) - (a.profile?.totalViews || 0)).slice(0, 4).map((u, i) => (
                                    <Link key={i} href={`/${u.profile?.username || u.name}`} className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 group-hover:border-rose-500 transition-all">
                                            <img src={u.image || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-black text-slate-900 truncate group-hover:text-rose-500 transition-colors uppercase italic">{u.name}</div>
                                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{u.profile?.occupation}</div>
                                        </div>
                                        <div className="flex items-center gap-1 text-[9px] font-black text-amber-500">
                                            <Star size={10} fill="currentColor" />
                                            {u.profile?.avgRating || "5.0"}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <Sparkles className="text-rose-500 mb-6" size={32} />
                                <h3 className="text-xl font-black tracking-tighter mb-4 leading-tight">{t('hubAiAssistTitle')}</h3>
                                <p className="text-sm text-slate-400 font-medium mb-8">{t('hubAiAssistSub')}</p>
                                <Link href="/register" className="flex items-center justify-center w-full h-12 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:scale-105 transition-all">
                                    {t('hubJoinBtn')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Profiles Grid */}
                    <div className="lg:col-span-9">
                        {isNetworkLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-80 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse" />
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
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ y: -8 }}
                                            className={cn(
                                                "group relative rounded-[2.5rem] border overflow-hidden flex flex-col transition-all duration-500 shadow-xl shadow-slate-200/20",
                                                tpl.bg,
                                                isLight ? "border-slate-100" : "border-white/10",
                                                tpl.text
                                            )}
                                            style={{
                                                background: tpl.colors ? `linear-gradient(135deg, ${tpl.colors[0]}, ${tpl.colors[1] || tpl.colors[0]})` : undefined,
                                                backgroundColor: tpl.colors ? undefined : (tpl.hex || undefined)
                                            }}
                                        >
                                            <div className="p-6 flex flex-col h-full">
                                                <div className="flex items-start gap-4 mb-6">
                                                    <div className="relative">
                                                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg group-hover:rotate-3 transition-transform">
                                                            <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-black text-sm uppercase tracking-tight italic line-clamp-1">{user.name}</h4>
                                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{user.profile?.occupation}</p>
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            <Star size={10} fill="currentColor" />
                                                            <span className="text-[10px] font-black">{user.profile?.avgRating || "5.0"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {user.profile?.slogan && (
                                                    <p className="text-[11px] font-medium italic opacity-70 mb-8 line-clamp-2">
                                                        "{user.profile.slogan}"
                                                    </p>
                                                )}

                                                <div className="mt-auto pt-6 border-t border-current/10 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 opacity-50">
                                                        <Users size={12} />
                                                        <span className="text-[10px] font-black">{user.profile?.totalViews || 0} {t('hubViews')}</span>
                                                    </div>
                                                    <Link 
                                                        href={`/${user.profile?.username || user.name}`}
                                                        className={cn(
                                                            "h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center transition-all",
                                                            isLight ? "bg-slate-900 text-white hover:bg-rose-500" : "bg-white text-slate-900 hover:bg-slate-100"
                                                        )}
                                                    >
                                                        {t('visitProfile')}
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                        
                        {!isNetworkLoading && filteredUsers.length === 0 && (
                            <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                                <Compass className="w-16 h-16 mx-auto mb-6 text-slate-200" />
                                <h3 className="text-xl font-black text-slate-900 mb-2">{t('hubNoUsersTitle')}</h3>
                                <p className="text-sm text-slate-400 font-medium">{t('hubNoUsersSub')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Assistant Modal */}
            <AnimatePresence>
                {isHubAiOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsHubAiOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-2xl h-[80vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative z-10"
                        >
                            {/* AI Header */}
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight">{t('hubAiChatTitle')}</h3>
                                        <div className="flex items-center gap-1.5">
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
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                                {hubAiChat.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-slate-400 font-medium italic">"{t('hubAiChatGreeting')}"</p>
                                    </div>
                                )}
                                {hubAiChat.map((msg, idx) => (
                                    <div key={idx} className={cn(
                                        "flex gap-4 max-w-[85%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}>
                                        <div className={cn(
                                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                                            msg.role === 'user' ? "bg-slate-100 text-slate-500" : "bg-rose-500 text-white"
                                        )}>
                                            {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                                        </div>
                                        <div className={cn(
                                            "p-5 rounded-2xl text-[13px] font-medium leading-relaxed",
                                            msg.role === 'user' ? "bg-slate-50 text-slate-900 rounded-tr-none" : "bg-rose-50 text-slate-900 rounded-tl-none border border-rose-100"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isHubAiLoading && (
                                    <div className="flex gap-4 mr-auto">
                                        <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                                            <Sparkles size={14} className="animate-spin" />
                                        </div>
                                        <div className="p-5 rounded-2xl bg-rose-50 text-slate-900 rounded-tl-none border border-rose-100 italic text-[13px]">
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
                                        className="w-full h-14 pl-6 pr-16 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-rose-100 transition-all outline-none"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!hubAiMessage.trim() || isHubAiLoading}
                                        className="absolute right-2 top-2 w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center hover:bg-rose-600 transition-colors disabled:opacity-50"
                                    >
                                        <Send size={18} />
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
