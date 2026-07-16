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
    MessageSquare,
    Bell,
    Heart,
    ShoppingBag,
    PenTool,
    Megaphone,
    Monitor,
    FileText,
    Layout,
    Plus,
    Bookmark,
    Eye,
    ChevronRight,
    CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function HubClient({ initialUsers = [] }: { initialUsers: any[] }) {
    const { data: session, status } = useSession()
    const { t } = useTranslation()
    const router = useRouter()
    const [networkUsers, setNetworkUsers] = useState<any[]>(initialUsers)
    const [hubAds, setHubAds] = useState<any[]>([])
    const [networkSearch, setNetworkSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [isNetworkLoading, setIsNetworkLoading] = useState(initialUsers.length === 0)
    const [activeFeedTab, setActiveFeedTab] = useState<"people" | "projects">("people")
    
    useEffect(() => {
        if (initialUsers.length === 0) {
            fetchNetwork()
        }
        fetchAds()
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

    const fetchAds = async () => {
        try {
            const res = await fetch("/api/hub-ads")
            if (!res.ok) throw new Error("Ads error")
            const data = await res.json()
            if (Array.isArray(data)) setHubAds(data)
        } catch (err) {
            console.error("Fetch ads error:", err)
        }
    }

    const categories = [
        { id: "all", name: "Tümü", icon: <LayoutGrid size={18} />, color: "text-slate-500", bg: "bg-slate-100" },
        { id: "software", name: "Yazılım & Teknoloji", icon: <Monitor size={18} />, color: "text-sky-500", bg: "bg-sky-50" },
        { id: "design", name: "Tasarım & Kreatif", icon: <PenTool size={18} />, color: "text-rose-500", bg: "bg-rose-50" },
        { id: "marketing", name: "Pazarlama & Satış", icon: <Megaphone size={18} />, color: "text-emerald-500", bg: "bg-emerald-50" },
        { id: "consulting", name: "Danışmanlık", icon: <Briefcase size={18} />, color: "text-amber-500", bg: "bg-amber-50" },
    ]

    const filteredUsers = useMemo(() => {
        return networkUsers.filter(u => {
            const searchLower = networkSearch.toLowerCase()
            const matchesSearch = (
                u.name?.toLowerCase().includes(searchLower) ||
                u.profile?.displayName?.toLowerCase().includes(searchLower) ||
                u.profile?.occupation?.toLowerCase().includes(searchLower) ||
                u.profile?.username?.toLowerCase().includes(searchLower)
            )
            const matchesCategory = selectedCategory === "all" || 
                u.profile?.occupation?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                (selectedCategory === "software" && u.profile?.occupation?.toLowerCase().includes("yazılım")) ||
                (selectedCategory === "design" && u.profile?.occupation?.toLowerCase().includes("tasarım")) ||
                (selectedCategory === "marketing" && u.profile?.occupation?.toLowerCase().includes("pazarlama")) ||
                (selectedCategory === "consulting" && u.profile?.occupation?.toLowerCase().includes("danışmanlık"))
            
            return matchesSearch && matchesCategory
        })
    }, [networkUsers, networkSearch, selectedCategory])

    const filteredAds = useMemo(() => {
        return hubAds.filter(ad => {
            const searchLower = networkSearch.toLowerCase()
            const matchesSearch = (
                ad.title?.toLowerCase().includes(searchLower) ||
                ad.description?.toLowerCase().includes(searchLower) ||
                ad.tags?.toLowerCase().includes(searchLower)
            )
            const matchesCategory = selectedCategory === "all" || ad.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [hubAds, networkSearch, selectedCategory])

    const getAdIcon = (category: string) => {
        switch(category) {
            case 'software': return { icon: <Monitor size={22} className="text-sky-500" />, bg: "bg-sky-50" };
            case 'design': return { icon: <PenTool size={22} className="text-purple-500" />, bg: "bg-purple-50" };
            case 'marketing': return { icon: <Megaphone size={22} className="text-rose-500" />, bg: "bg-rose-50" };
            case 'consulting': return { icon: <Briefcase size={22} className="text-amber-500" />, bg: "bg-amber-50" };
            default: return { icon: <ShoppingBag size={22} className="text-slate-500" />, bg: "bg-slate-50" };
        }
    }

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return "Bugün";
        if (diffInDays === 1) return "Dün";
        if (diffInDays < 7) return `${diffInDays} gün önce`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} hafta önce`;
        return `${Math.floor(diffInDays / 30)} ay önce`;
    }

    const popularPros = useMemo(() => {
        return [...networkUsers].sort((a, b) => (b.profile?.totalViews || 0) - (a.profile?.totalViews || 0)).slice(0, 5)
    }, [networkUsers])

    return (
        <div className="min-h-screen bg-[#fcfbfc] flex flex-col lg:flex-row relative z-10 font-sans antialiased">
            
            {/* ─── MESH GRADIENTS FOR HUB ─── */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.06),transparent_65%)] blur-[80px] pointer-events-none z-0" />
            <div className="absolute top-[20%] left-0 w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.04),transparent_65%)] blur-[75px] pointer-events-none z-0" />

            {/* Left Sidebar */}
            <aside className="w-76 bg-white border-r border-slate-100 hidden lg:flex flex-col sticky top-0 h-screen p-8 shrink-0 z-20">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-3 mb-10 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-550 flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-all">
                        <Layout className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-baseline gap-0.5">
                            <span className="font-black text-slate-800 text-lg tracking-tighter">Kardly</span>
                            <span className="font-black text-rose-500 text-lg tracking-tighter">.site</span>
                        </div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em] -mt-0.5">link to success</p>
                    </div>
                </Link>

                {/* Sidebar Navigation */}
                <div className="flex-1 overflow-y-auto no-scrollbar -mx-2 px-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-4 opacity-70">
                        Kategoriler
                    </p>
                    <nav className="space-y-1">
                        {categories.map((cat) => {
                            const isActive = selectedCategory === cat.id
                            return (
                                <button 
                                    key={cat.id} 
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all relative group",
                                        isActive
                                            ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
                                        isActive ? "bg-white/10" : cat.bg + " " + cat.color
                                    )}>
                                        {cat.icon}
                                    </div>
                                    <span className="truncate">{cat.name}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                    )}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Sidebar Banner */}
                <div className="mt-auto">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-[2rem] text-white relative overflow-hidden group shadow-lg shadow-slate-950/15">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                        <Sparkles className="text-rose-500 mb-4" size={24} />
                        <h4 className="text-xs font-black mb-1.5 uppercase leading-tight tracking-wider">Burada yer al</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mb-5 leading-relaxed">Yeteneğini sergile, iş teklifleri al ve ağını büyüt.</p>
                        <button 
                            onClick={() => router.push('/register')}
                            className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-md active:scale-95"
                        >
                            Profil Oluştur
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 min-w-0">
                {/* Header Navbar */}
                <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-30 gap-4">
                    {/* Search Input */}
                    <div className="flex-1 max-w-lg w-full relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="İsim, yetenek veya uzmanlık ara..." 
                            value={networkSearch}
                            onChange={(e) => setNetworkSearch(e.target.value)}
                            className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-rose-450/40 focus:ring-4 focus:ring-rose-50 transition-all placeholder:text-slate-300"
                        />
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8 shrink-0">
                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <Link href="/hub" className="text-slate-900 border-b-2 border-rose-500 pb-1">Keşfet</Link>
                            <Link href="/register" className="hover:text-rose-500 transition-colors">Proje Talebi</Link>
                        </div>

                        {/* User Profile / Login */}
                        <div className="flex items-center gap-4 border-l border-slate-100 pl-4 sm:pl-8">
                            {status === 'loading' ? (
                                <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse" />
                            ) : status === 'authenticated' ? (
                                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                                    <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-500 transition-colors">YÖNETİM</span>
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer shadow-sm hover:ring-4 hover:ring-rose-50 transition-all">
                                        <img 
                                            src={session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name || 'User'}&background=random`} 
                                            alt="User" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </Link>
                            ) : (
                                <button 
                                    onClick={() => router.push('/login')}
                                    className="px-6 h-11 bg-slate-950 hover:bg-rose-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-md transition-all active:scale-95"
                                >
                                    Giriş Yap
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full pb-24 lg:pb-12">
                    
                    {/* Welcome Banner Card */}
                    <div className="relative rounded-[2.5rem] bg-gradient-to-br from-rose-500 to-indigo-650 p-8 sm:p-12 mb-10 overflow-hidden shadow-xl shadow-rose-500/10">
                        {/* Shimmer background design */}
                        <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-black/10 blur-3xl pointer-events-none" />
                        
                        <div className="max-w-xl relative z-10 text-white">
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 text-[9px] font-black uppercase tracking-widest">
                                <Sparkles size={11} className="text-pink-300 animate-pulse" />
                                <span>Kardly Business Hub</span>
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black leading-[1.1] mb-4 tracking-tight">
                                Profesyonel dünyayı <br />keşfet, ağını büyüt.
                            </h2>
                            <p className="text-white/80 text-xs sm:text-sm font-semibold mb-8 max-w-md leading-relaxed">
                                Uzmanlarla doğrudan iletişime geçin, iş birlikleri kurun ve projelerinize en uygun profesyoneli bulun.
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <button 
                                    onClick={() => router.push('/register')}
                                    className="px-8 py-3.5 bg-white text-slate-950 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-md hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    Profilini Ekle
                                </button>
                                <button 
                                    onClick={() => router.push('/register')}
                                    className="px-8 py-3.5 bg-black/35 hover:bg-black/50 text-white border border-white/25 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95"
                                >
                                    İş İlanı Ver
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Filter / Switcher Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-8 gap-4">
                        {/* Feed Tab Swapping */}
                        <div className="flex bg-slate-50 p-1.5 rounded-2xl w-fit border border-slate-100 shrink-0">
                            {[
                                { id: "people", label: "Uzmanlar", icon: <Users size={14} /> },
                                { id: "projects", label: "Proje İlanları", icon: <Briefcase size={14} /> },
                            ].map((tab) => {
                                const isCurrent = activeFeedTab === tab.id
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveFeedTab(tab.id as any)}
                                        className={cn(
                                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                            isCurrent 
                                                ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" 
                                                : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        {tab.icon}
                                        <span>{tab.label}</span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Search result stats */}
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest sm:text-right">
                            {activeFeedTab === "people" 
                                ? `${filteredUsers.length} uzman listeleniyor` 
                                : `${filteredAds.length} aktif proje listeleniyor`
                            }
                        </div>
                    </div>

                    {/* DUAL FEED RENDER */}
                    {activeFeedTab === "people" ? (
                        /* ─── FEED 1: PROFESSIONALS GRID ─── */
                        <div>
                            {filteredUsers.length === 0 ? (
                                <div className="bg-white p-16 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-slate-300">
                                        <Users size={32} />
                                    </div>
                                    <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">Kullanıcı Bulunamadı</h4>
                                    <p className="text-slate-400 text-xs font-semibold mt-1">Arama kriterlerinize uygun uzman bulunamadı.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredUsers.map((user) => (
                                        <div 
                                            key={user.id} 
                                            className="bg-white rounded-[2rem] border border-slate-100 hover:border-rose-200 hover:shadow-xl hover:shadow-slate-200/25 transition-all duration-300 overflow-hidden flex flex-col group"
                                        >
                                            {/* Cover header area with soft gradient mesh */}
                                            <div className="h-20 bg-gradient-to-r from-slate-50 to-slate-100 relative group-hover:from-rose-50 group-hover:to-indigo-50 transition-colors">
                                                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-slate-100/50 backdrop-blur-md text-[9px] font-black text-amber-500 shadow-sm">
                                                    <Star size={10} fill="currentColor" />
                                                    <span>{user.profile?.avgRating || "5.0"}</span>
                                                </div>
                                            </div>

                                            {/* Profile contents wrapper */}
                                            <div className="px-6 pb-6 relative flex-1 flex flex-col">
                                                {/* Centered avatar overlapping the cover header */}
                                                <div className="w-18 h-18 rounded-2xl border-4 border-white bg-slate-100 shadow-md overflow-hidden -mt-9 mb-4 mx-auto relative group-hover:scale-105 transition-transform duration-300">
                                                    <img 
                                                        src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                                                        alt={user.name} 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                                                </div>

                                                {/* Name & Title */}
                                                <div className="text-center mb-4">
                                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-rose-500 transition-colors truncate">
                                                        {user.profile?.displayName || user.name}
                                                    </h3>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate mt-0.5">
                                                        {user.profile?.occupation || "Profesyonel Üye"}
                                                    </p>
                                                </div>

                                                {/* Bio / Description */}
                                                <p className="text-xs text-slate-500 text-center font-medium leading-relaxed mb-6 line-clamp-2 px-2 flex-1">
                                                    {user.profile?.bio || "Kardly üyesi profesyonel dijital kartvizit sahibi."}
                                                </p>

                                                {/* Skill / Specialty Pills */}
                                                <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                                                    {(user.profile?.occupation?.split(' ') || ["Uzman"]).slice(0, 3).map((tag: string) => (
                                                        <span 
                                                            key={tag} 
                                                            className="px-3 py-1 bg-slate-50 text-slate-400 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-wider"
                                                        >
                                                            {tag.replace(/[^a-zA-Z0-9ığüşöçİĞÜŞÖÇ]/g, "")}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Actions */}
                                                <div className="grid grid-cols-5 gap-2 mt-auto pt-4 border-t border-slate-50">
                                                    <button 
                                                        onClick={() => window.open(`/${user.profile?.username || user.name}`, '_blank')}
                                                        className="col-span-4 py-3 bg-slate-900 hover:bg-rose-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
                                                    >
                                                        Profili İncele
                                                        <ArrowUpRight size={12} />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            if (status === 'unauthenticated') {
                                                                router.push(`/login?callbackUrl=/dashboard?tab=messages&userId=${user.id}`)
                                                            } else {
                                                                router.push(`/dashboard?tab=messages&userId=${user.id}`)
                                                            }
                                                        }}
                                                        className="col-span-1 py-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 rounded-xl flex items-center justify-center border border-slate-100 transition-all"
                                                        title="Mesaj Gönder"
                                                    >
                                                        <MessageSquare size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ─── FEED 2: PROJECTS/JOBS LIST ─── */
                        <div className="space-y-4">
                            {filteredAds.length === 0 ? (
                                <div className="bg-white p-16 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-slate-300">
                                        <Briefcase size={32} />
                                    </div>
                                    <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">İlan Bulunamadı</h4>
                                    <p className="text-slate-400 text-xs font-semibold mt-1">Seçili kategoriye uygun aktif proje ilanı bulunmuyor.</p>
                                </div>
                            ) : (
                                filteredAds.map((proj) => {
                                    const { icon, bg } = getAdIcon(proj.category)
                                    return (
                                        <div 
                                            key={proj.id} 
                                            className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/25 transition-all group"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                                {/* Icon badge */}
                                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform", bg)}>
                                                    {icon}
                                                </div>

                                                {/* Mid: Title, Description, Tags */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <h4 className="text-sm sm:text-base font-black text-slate-800 group-hover:text-rose-500 transition-colors uppercase tracking-tight">
                                                            {proj.title}
                                                        </h4>
                                                        {new Date(proj.createdAt).getTime() > Date.now() - 86400000 * 3 && (
                                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-md border border-emerald-100/50">Yeni</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4 line-clamp-2">
                                                        {proj.description}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {(proj.tags || "İlan, İş Birliği").split(',').map((tag: string) => (
                                                            <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-wider rounded-lg border border-slate-100">
                                                                {tag.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Right Info: Budget, Time, Actions */}
                                                <div className="flex flex-row lg:flex-col lg:items-end justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 gap-4 shrink-0">
                                                    <div className="lg:text-right">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Bütçe</span>
                                                        <span className="text-sm font-black text-slate-800">
                                                            {proj.budget ? (proj.budget.includes('₺') || proj.budget.includes('$') ? proj.budget : `₺${proj.budget}`) : "Görüşülür"}
                                                        </span>
                                                    </div>
                                                    <div className="lg:text-right">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Tarih</span>
                                                        <span className="text-xs font-bold text-slate-700">{getTimeAgo(proj.createdAt)}</span>
                                                    </div>
                                                </div>

                                                {/* Proposal button */}
                                                <div className="shrink-0 w-full lg:w-auto">
                                                    <button 
                                                        onClick={() => {
                                                            if (status === 'unauthenticated') {
                                                                router.push(`/login?callbackUrl=/dashboard?tab=network&adId=${proj.id}`)
                                                            } else {
                                                                router.push(`/dashboard?tab=network&adId=${proj.id}`)
                                                            }
                                                        }}
                                                        className="w-full lg:w-auto px-6 py-3 bg-slate-900 hover:bg-rose-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-md transition-all active:scale-95"
                                                    >
                                                        Teklif Ver
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Right Sidebar */}
            <aside className="w-80 bg-slate-50/50 border-l border-slate-100 hidden xl:flex flex-col sticky top-0 h-screen p-8 space-y-8 shrink-0 z-20 overflow-y-auto no-scrollbar">
                
                {/* Popular Pros Widget */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Popüler Uzmanlar</h3>
                        <Users size={16} className="text-slate-300" />
                    </div>
                    <div className="space-y-5">
                        {popularPros.map((pro, i) => (
                            <div 
                                key={i} 
                                onClick={() => window.open(`/${pro.profile?.username || pro.name}`, '_blank')}
                                className="flex items-center gap-3.5 group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm group-hover:border-rose-500 transition-all relative shrink-0">
                                    <img src={pro.image || `https://ui-avatars.com/api/?name=${pro.name}&background=random`} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-black text-slate-855 truncate group-hover:text-rose-500 transition-colors uppercase tracking-tight">
                                        {pro.profile?.displayName || pro.name}
                                    </h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate mt-0.5">
                                        {pro.profile?.occupation || "Üye"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-0.5 text-[9px] font-black text-amber-500 shrink-0">
                                    <Star size={10} fill="currentColor" />
                                    <span>{pro.profile?.avgRating || "5.0"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Yeni Aktiviteler</h3>
                    </div>
                    <div className="space-y-5">
                        {networkUsers.slice(0, 4).map((act, i) => {
                            const actions = ["proje yayınladı", "teklif verdi", "profilini güncelledi", "aramıza katıldı"]
                            return (
                                <div key={i} className="flex items-start gap-3 group cursor-pointer">
                                    <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-100 shrink-0 group-hover:ring-4 group-hover:ring-slate-50 transition-all">
                                        <img src={act.image || `https://ui-avatars.com/api/?name=${act.name}&background=random`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-medium leading-[1.3] text-slate-600">
                                            <span className="font-black text-slate-800 group-hover:text-rose-500 transition-colors uppercase text-[10px]">
                                                {act.profile?.displayName || act.name}
                                            </span>{" "}
                                            {actions[i % actions.length]}
                                        </p>
                                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                            <Globe size={9} />
                                            {i + 1}dk önce
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40 px-2 pb-[env(safe-area-inset-bottom)]">
                <div className="flex items-center justify-around h-16">
                    <button onClick={() => setSelectedCategory("all")} className={cn("flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all", selectedCategory === "all" ? "text-rose-500" : "text-slate-400")}>
                        <LayoutGrid size={18} />
                        <span className="text-[8px] font-black uppercase tracking-wider">Tümü</span>
                    </button>
                    <button onClick={() => setSelectedCategory("software")} className={cn("flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all", selectedCategory === "software" ? "text-rose-500" : "text-slate-400")}>
                        <Monitor size={18} />
                        <span className="text-[8px] font-black uppercase tracking-wider">Yazılım</span>
                    </button>
                    <button onClick={() => setSelectedCategory("design")} className={cn("flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all", selectedCategory === "design" ? "text-rose-500" : "text-slate-400")}>
                        <PenTool size={18} />
                        <span className="text-[8px] font-black uppercase tracking-wider">Tasarım</span>
                    </button>
                    <button onClick={() => router.push('/register')} className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl text-slate-400 transition-all">
                        <Plus size={18} />
                        <span className="text-[8px] font-black uppercase tracking-wider">Katıl</span>
                    </button>
                </div>
            </nav>
        </div>
    )
}
