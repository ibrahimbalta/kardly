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
    ShieldCheck
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
        <div className="min-h-screen bg-[#f1f3f7] pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
            {/* Elite Design Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-slate-200/50 via-[#f1f3f7] to-transparent" />
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-slate-900/[0.03] rounded-full blur-[120px]" />
                
                {/* Professional Mesh Grid */}
                <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#00000008 1px, transparent 1px), linear-gradient(90deg, #00000008 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Header - Professional SaaS Look */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-full shadow-2xl mb-8"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                            {networkUsers.length} {t('activeProfessionals')}
                        </span>
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tighter mb-8 leading-[0.9] uppercase"
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
                        className="text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        {t('hubHeroSub')}
                    </motion.p>

                    {/* Pro Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-4xl mx-auto bg-white p-2.5 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200 flex flex-col sm:flex-row items-center gap-2 group"
                    >
                        <div className="relative flex-1 w-full pl-6 flex items-center">
                            <Search className="text-slate-300 group-focus-within:text-rose-500 transition-colors" size={22} />
                            <input
                                type="text"
                                placeholder={t('hubSearchPlaceholder')}
                                value={networkSearch}
                                onChange={(e) => setNetworkSearch(e.target.value)}
                                className="w-full h-14 pl-4 pr-6 bg-transparent text-slate-900 font-bold placeholder:text-slate-300 outline-none text-md"
                            />
                        </div>
                        <button 
                            onClick={() => setIsHubAiOpen(true)}
                            className="w-full sm:w-auto h-14 px-10 bg-slate-950 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-rose-500 transition-all active:scale-95 shrink-0 shadow-xl"
                        >
                            <Sparkles size={16} />
                            {t('hubAiSearchBtn')}
                        </button>
                    </motion.div>
                </div>

                {/* Categories - Elite Glass Pills */}
                <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar pb-10 mb-14 px-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shrink-0 border relative",
                                selectedCategory === cat.id 
                                    ? "bg-slate-900 text-white border-slate-900 shadow-xl" 
                                    : "bg-white text-slate-500 border-slate-200 hover:border-rose-300 hover:text-rose-500"
                            )}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar - Professional Density */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/[0.03] rounded-full blur-2xl -mr-10 -mt-10" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center border border-slate-100">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 text-sm tracking-tight uppercase leading-none">{t('hubTrendingTitle')}</h3>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t('hubTrendingSub')}</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {[...networkUsers].sort((a, b) => (b.profile?.totalViews || 0) - (a.profile?.totalViews || 0)).slice(0, 4).map((u, i) => (
                                        <Link key={i} href={`/${u.profile?.username || u.name}`} className="flex items-center gap-4 group/item">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 group-hover/item:border-rose-500 transition-all shadow-sm">
                                                <img src={u.image || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[11px] font-black text-slate-900 truncate group-hover/item:text-rose-500 transition-colors uppercase italic">{u.name}</div>
                                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{u.profile?.occupation}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <Sparkles className="text-rose-500 mb-6" size={32} />
                                <h3 className="text-xl font-black tracking-tighter mb-4 leading-tight uppercase">{t('hubAiAssistTitle')}</h3>
                                <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">{t('hubAiAssistSub')}</p>
                                <Link href="/register" className="flex items-center justify-center w-full h-12 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95">
                                    {t('hubJoinBtn')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Elite Profiles Grid - Middle Ground Professionalism */}
                    <div className="lg:col-span-9">
                        {isNetworkLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-80 bg-white rounded-[2.5rem] border border-slate-200 animate-pulse" />
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
                                            whileHover={{ y: -8 }}
                                            className={cn(
                                                "group relative rounded-[2.5rem] border overflow-hidden flex flex-col transition-all duration-500 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.15)] bg-white",
                                                isLight ? "border-slate-100" : "border-slate-200",
                                            )}
                                            onClick={() => window.open(`https://${user.profile?.username || user.name}.kardly.site`, '_blank')}
                                        >
                                            {/* Subtle Elite Accent */}
                                            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-950 group-hover:bg-rose-500 transition-colors duration-500" />
                                            
                                            <div className="p-8 flex flex-col h-full relative z-10">
                                                <div className="flex items-start justify-between mb-8">
                                                    <div className="relative">
                                                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm group-hover:rotate-3 transition-transform duration-500">
                                                            <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-lg" />
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">
                                                            PROFESSIONAL
                                                        </div>
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            <Star size={12} fill="currentColor" />
                                                            <span className="text-[11px] font-black">{user.profile?.avgRating || "5.0"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-8">
                                                    <h4 className="text-lg font-black text-slate-950 uppercase tracking-tight italic mb-1 group-hover:text-rose-500 transition-colors truncate">{user.name}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-rose-500 rounded-full" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">{user.profile?.occupation}</p>
                                                    </div>
                                                </div>

                                                {user.profile?.slogan && (
                                                    <p className="text-[12px] text-slate-400 font-medium italic mb-10 line-clamp-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                                                        "{user.profile.slogan}"
                                                    </p>
                                                )}

                                                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-slate-200 group-hover:text-slate-400 transition-colors">
                                                        <Users size={16} />
                                                        <span className="text-[11px] font-black uppercase tracking-widest">{user.profile?.totalViews || 0} {t('hubViews')}</span>
                                                    </div>
                                                    
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500 flex items-center justify-center shadow-inner group-hover:rotate-12">
                                                        <ArrowUpRight size={22} />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                        
                        {!isNetworkLoading && filteredUsers.length === 0 && (
                            <div className="py-40 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm">
                                <Compass className="w-20 h-20 mx-auto mb-8 text-slate-100" />
                                <h3 className="text-2xl font-black text-slate-950 mb-3 uppercase tracking-widest">{t('hubNoUsersTitle')}</h3>
                                <p className="text-md text-slate-400 font-medium">{t('hubNoUsersSub')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Assistant Modal - Elite Professional Variant */}
            <AnimatePresence>
                {isHubAiOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsHubAiOpen(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.98, opacity: 0, y: 30 }}
                            className="bg-white w-full max-w-3xl h-[85vh] rounded-[4rem] shadow-2xl flex flex-col overflow-hidden relative z-10 border border-slate-100"
                        >
                            {/* AI Header */}
                            <div className="p-10 border-b border-slate-50 flex items-center justify-between shrink-0 bg-gradient-to-r from-slate-50 to-transparent">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-slate-950 text-white rounded-[2rem] flex items-center justify-center shadow-xl">
                                        <Sparkles size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic">{t('hubAiChatTitle')}</h3>
                                        <div className="flex items-center gap-2.5 mt-1">
                                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">{t('hubAiChatStatus')}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsHubAiOpen(false)} className="w-12 h-12 rounded-full bg-white text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-all border border-slate-100 shadow-sm">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* AI Chat Area */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                                {hubAiChat.length === 0 && (
                                    <div className="text-center py-24">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                                            <ShieldCheck className="text-slate-200" size={40} />
                                        </div>
                                        <p className="text-slate-400 font-medium italic text-lg leading-relaxed max-w-sm mx-auto">"{t('hubAiChatGreeting')}"</p>
                                    </div>
                                )}
                                {hubAiChat.map((msg, idx) => (
                                    <div key={idx} className={cn(
                                        "flex gap-6 max-w-[90%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}>
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100",
                                            msg.role === 'user' ? "bg-white text-slate-400" : "bg-slate-950 text-white"
                                        )}>
                                            {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                                        </div>
                                        <div className={cn(
                                            "p-8 rounded-[2.5rem] text-[15px] font-medium leading-relaxed shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)]",
                                            msg.role === 'user' ? "bg-slate-50 text-slate-950 rounded-tr-none" : "bg-white text-slate-900 rounded-tl-none border border-slate-100"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isHubAiLoading && (
                                    <div className="flex gap-6 mr-auto animate-pulse">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center">
                                            <Sparkles size={18} className="animate-spin" />
                                        </div>
                                        <div className="p-8 rounded-[2.5rem] bg-slate-50 text-slate-400 rounded-tl-none border border-slate-100 italic text-[15px]">
                                            {t('hubAiChatSearching')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* AI Input */}
                            <div className="p-10 border-t border-slate-50 shrink-0 bg-slate-50/50">
                                <form 
                                    onSubmit={(e) => { e.preventDefault(); handleHubAiChat(); }}
                                    className="relative"
                                >
                                    <input
                                        type="text"
                                        value={hubAiMessage}
                                        onChange={(e) => setHubAiMessage(e.target.value)}
                                        placeholder={t('hubAiChatPlaceholder')}
                                        className="w-full h-20 pl-10 pr-24 bg-white border border-slate-200 rounded-[2rem] text-lg font-medium text-slate-900 focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none placeholder:text-slate-200 shadow-inner"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!hubAiMessage.trim() || isHubAiLoading}
                                        className="absolute right-3 top-3 w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center hover:bg-rose-500 transition-all disabled:opacity-20 shadow-xl active:scale-95"
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
