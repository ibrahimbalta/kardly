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
        <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden">
            {/* Minimal Grid Background */}
            <div className="absolute inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero - More Compact */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4 uppercase"
                    >
                        {t('hubHeroTitle')} <span className="text-rose-500 italic">{t('hubHeroTitleItalic')}</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-xl mx-auto bg-white p-1.5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col sm:flex-row items-center gap-1"
                    >
                        <div className="relative flex-1 w-full pl-4 flex items-center">
                            <Search className="text-slate-300" size={16} />
                            <input
                                type="text"
                                placeholder={t('hubSearchPlaceholder')}
                                value={networkSearch}
                                onChange={(e) => setNetworkSearch(e.target.value)}
                                className="w-full h-10 pl-2.5 pr-4 bg-transparent text-slate-900 font-bold placeholder:text-slate-200 outline-none text-[13px]"
                            />
                        </div>
                        <button 
                            onClick={() => setIsHubAiOpen(true)}
                            className="w-full sm:w-auto h-10 px-6 bg-slate-950 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500 transition-all active:scale-95"
                        >
                            <Sparkles size={12} />
                            {t('hubAiSearchBtn')}
                        </button>
                    </motion.div>
                </div>

                {/* Categories */}
                <div className="flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar pb-8 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all shrink-0 border",
                                selectedCategory === cat.id 
                                    ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                                    : "bg-white text-slate-400 border-slate-200 hover:border-rose-200 hover:text-rose-500"
                            )}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Profiles Grid - High Density & Card Templates */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {isNetworkLoading ? (
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                            <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-slate-100" />
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
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    className={cn(
                                        "group relative rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer",
                                        tpl.bg,
                                        tpl.text,
                                        isLight ? "border-slate-100" : "border-white/10"
                                    )}
                                    style={{
                                        background: tpl.colors ? `linear-gradient(135deg, ${tpl.colors[0]}, ${tpl.colors[1] || tpl.colors[0]})` : undefined,
                                        backgroundColor: tpl.colors ? undefined : (tpl.hex || undefined)
                                    }}
                                    onClick={() => window.open(`https://${user.profile?.username || user.name}.kardly.site`, '_blank')}
                                >
                                    <div className="p-4 flex flex-col h-full relative z-10">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="relative">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl overflow-hidden border-2 shadow-sm group-hover:rotate-3 transition-transform",
                                                    isLight ? "border-slate-100" : "border-white/20"
                                                )}>
                                                    <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-current rounded-full" />
                                            </div>
                                            <div className="flex items-center gap-0.5 text-[8px] font-black text-amber-500 bg-black/5 px-1.5 py-0.5 rounded-md">
                                                <Star size={7} fill="currentColor" />
                                                <span>{user.profile?.avgRating || "5.0"}</span>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <h4 className={cn(
                                                "text-[11px] font-black uppercase tracking-tight italic truncate",
                                                tpl.text
                                            )}>{user.name}</h4>
                                            <p className={cn(
                                                "text-[7px] font-black uppercase tracking-[0.1em] opacity-60 truncate",
                                                tpl.text
                                            )}>{user.profile?.occupation}</p>
                                        </div>

                                        {user.profile?.slogan && (
                                            <p className={cn(
                                                "text-[9px] font-medium italic line-clamp-2 leading-relaxed opacity-50 mb-3",
                                                tpl.text
                                            )}>
                                                "{user.profile.slogan}"
                                            </p>
                                        )}

                                        <div className={cn(
                                            "mt-auto pt-3 border-t flex items-center justify-between",
                                            isLight ? "border-slate-100" : "border-white/10"
                                        )}>
                                            <div className="flex items-center gap-1.5 opacity-40">
                                                <Users size={10} />
                                                <span className="text-[7px] font-black uppercase tracking-widest">{user.profile?.totalViews || 0}</span>
                                            </div>
                                            
                                            <div className={cn(
                                                "w-6 h-6 rounded-lg transition-all duration-300 flex items-center justify-center",
                                                isLight ? "bg-slate-900 text-white" : "bg-white text-slate-900"
                                            )}>
                                                <ArrowUpRight size={10} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </div>

                {!isNetworkLoading && filteredUsers.length === 0 && (
                    <div className="py-20 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200">
                        <Compass className="w-10 h-10 mx-auto mb-4 text-slate-200" />
                        <h3 className="text-sm font-black text-slate-900 mb-1 uppercase tracking-widest">{t('hubNoUsersTitle')}</h3>
                        <p className="text-[9px] text-slate-300 font-medium">{t('hubNoUsersSub')}</p>
                    </div>
                )}
            </div>

            {/* AI Assistant Button - Floating Mini */}
            <button 
                onClick={() => setIsHubAiOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-slate-950 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-rose-500 transition-all hover:scale-110 group z-50"
            >
                <Sparkles size={24} />
                <div className="absolute right-full mr-4 px-4 py-2 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {t('hubAiSearchBtn')}
                </div>
            </button>

            {/* AI Assistant Modal - Compact */}
            <AnimatePresence>
                {isHubAiOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsHubAiOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.99, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.99, opacity: 0, y: 10 }}
                            className="bg-white w-full max-w-lg h-[70vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative z-10"
                        >
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center">
                                        <Sparkles size={20} />
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 tracking-tighter uppercase italic">{t('hubAiChatTitle')}</h3>
                                </div>
                                <button onClick={() => setIsHubAiOpen(false)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                                {hubAiChat.map((msg, idx) => (
                                    <div key={idx} className={cn(
                                        "flex gap-3 max-w-[90%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}>
                                        <div className={cn(
                                            "p-4 rounded-2xl text-[12px] font-medium leading-relaxed shadow-sm",
                                            msg.role === 'user' ? "bg-slate-50 text-slate-800 rounded-tr-none" : "bg-rose-50 text-slate-900 rounded-tl-none border border-rose-100"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isHubAiLoading && (
                                    <div className="flex gap-3 mr-auto animate-pulse">
                                        <div className="p-4 rounded-2xl bg-rose-50 text-slate-400 rounded-tl-none border border-rose-100 italic text-[12px]">
                                            {t('hubAiChatSearching')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-slate-50 shrink-0">
                                <form 
                                    onSubmit={(e) => { e.preventDefault(); handleHubAiChat(); }}
                                    className="relative"
                                >
                                    <input
                                        type="text"
                                        value={hubAiMessage}
                                        onChange={(e) => setHubAiMessage(e.target.value)}
                                        placeholder={t('hubAiChatPlaceholder')}
                                        className="w-full h-12 pl-5 pr-14 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-medium text-slate-900 outline-none"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!hubAiMessage.trim() || isHubAiLoading}
                                        className="absolute right-1 top-1 w-10 h-10 bg-rose-500 text-white rounded-lg flex items-center justify-center hover:bg-rose-600 transition-all"
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
