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
    Layout
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function HubClient({ initialUsers = [] }: { initialUsers: any[] }) {
    const { t } = useTranslation()
    const router = useRouter()
    const [networkUsers, setNetworkUsers] = useState<any[]>(initialUsers)
    const [networkSearch, setNetworkSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [isNetworkLoading, setIsNetworkLoading] = useState(initialUsers.length === 0)
    
    const [activeNav, setActiveNav] = useState('ana-sayfa')

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
        { id: "software", name: "Yazılım & Teknoloji", icon: <Monitor size={20} className="text-sky-500" />, bg: "bg-sky-50" },
        { id: "design", name: "Tasarım & Kreatif", icon: <PenTool size={20} className="text-purple-500" />, bg: "bg-purple-50" },
        { id: "consulting", name: "Danışmanlık", icon: <Briefcase size={20} className="text-amber-500" />, bg: "bg-amber-50" },
        { id: "marketing", name: "Pazarlama & Satış", icon: <Megaphone size={20} className="text-rose-500" />, bg: "bg-rose-50" },
    ]

    const filteredUsers = useMemo(() => {
        return networkUsers.filter(u => {
            const searchLower = networkSearch.toLowerCase()
            const matchesSearch = (
                u.name?.toLowerCase().includes(searchLower) ||
                u.profile?.occupation?.toLowerCase().includes(searchLower) ||
                u.profile?.username?.toLowerCase().includes(searchLower)
            )
            const matchesCategory = selectedCategory === "all" || 
                u.profile?.occupation?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                (selectedCategory === "software" && u.profile?.occupation?.toLowerCase().includes("yazılım")) ||
                (selectedCategory === "design" && u.profile?.occupation?.toLowerCase().includes("tasarım")) ||
                (selectedCategory === "marketing" && u.profile?.occupation?.toLowerCase().includes("pazarlama"))
            
            return matchesSearch && matchesCategory
        })
    }, [networkUsers, networkSearch, selectedCategory])

    const projects = [
        {
            id: 1,
            title: "E-Ticaret Sitesi Geliştirme",
            desc: "Modern, hızlı ve yönetimi kolay bir e-ticaret sitesi geliştirmek istiyoruz.",
            tags: ["Yazılım", "Web Geliştirme", "E-Ticaret"],
            budget: "₺50.000 - ₺80.000",
            time: "3 gün önce",
            icon: <ShoppingBag size={28} className="text-rose-500" />,
            iconBg: "bg-rose-100"
        },
        {
            id: 2,
            title: "Sosyal Medya İçerik Tasarımı",
            desc: "Markamız için aylık sosyal medya içerik tasarımları hazırlayacak kreatif birini arıyoruz.",
            tags: ["Tasarım", "Sosyal Medya", "Branding"],
            budget: "₺8.000 - ₺15.000",
            time: "1 hafta önce",
            icon: <PenTool size={28} className="text-sky-500" />,
            iconBg: "bg-sky-100"
        },
        {
            id: 3,
            title: "Google Ads Danışmanlığı",
            desc: "Google Ads kampanyalarımızı optimize edecek, dönüşüm odaklı çalışacak bir uzmana ihtiyaç var.",
            tags: ["Pazarlama", "Google Ads", "Dijital Reklam"],
            budget: "₺10.000 - ₺20.000",
            time: "2 gün önce",
            icon: <Megaphone size={28} className="text-emerald-500" />,
            iconBg: "bg-emerald-100"
        }
    ]

    const popularPros = useMemo(() => {
        return [...networkUsers].sort((a, b) => (b.profile?.totalViews || 0) - (a.profile?.totalViews || 0)).slice(0, 5)
    }, [networkUsers])

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex">
            {/* Left Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col sticky top-0 h-screen p-8">
                {/* Brand Logo - Updated to match image 2 */}
                <Link href="/" className="flex items-center gap-3 mb-12 group">
                    <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-200 transition-transform group-hover:scale-110">
                        <Layout size={24} />
                    </div>
                    <div>
                        <div className="flex items-baseline gap-0.5">
                            <span className="font-black text-slate-900 text-2xl tracking-tighter">Kardly</span>
                            <span className="font-black text-rose-500 text-2xl tracking-tighter">.site</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1">link to success</p>
                    </div>
                </Link>

                <div className="flex-1 overflow-y-auto no-scrollbar -mx-2 px-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-5 opacity-60">Kategoriler</p>
                    <nav className="space-y-2">
                        {[
                            { id: "all", name: "Tümü", icon: <LayoutGrid size={18} />, color: "text-slate-400", bg: "bg-slate-50" },
                            { id: "software", name: "Yazılım & Teknoloji", icon: <Monitor size={18} />, color: "text-sky-500", bg: "bg-sky-50" },
                            { id: "design", name: "Tasarım & Kreatif", icon: <PenTool size={18} />, color: "text-rose-500", bg: "bg-rose-50" },
                            { id: "marketing", name: "Pazarlama & Satış", icon: <Megaphone size={18} />, color: "text-emerald-500", bg: "bg-emerald-50" },
                            { id: "writing", name: "Yazı & Çeviri", icon: <FileText size={18} />, color: "text-amber-500", bg: "bg-amber-50" },
                            { id: "consulting", name: "Danışmanlık", icon: <Briefcase size={18} />, color: "text-indigo-500", bg: "bg-indigo-50" },
                        ].map((cat) => (
                            <button 
                                key={cat.id} 
                                onClick={() => setSelectedCategory(cat.id === "all" ? "" : cat.id)}
                                className={cn(
                                    "w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] text-[14px] font-bold transition-all group",
                                    (cat.id === "all" && !selectedCategory) || selectedCategory === cat.id
                                        ? "bg-rose-500 text-white shadow-lg shadow-rose-200"
                                        : "text-slate-500 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                                    (cat.id === "all" && !selectedCategory) || selectedCategory === cat.id
                                        ? "bg-white/20"
                                        : cat.bg + " " + cat.color
                                )}>
                                    {cat.icon}
                                </div>
                                <span className="truncate">{cat.name}</span>
                                {((cat.id === "all" && !selectedCategory) || selectedCategory === cat.id) && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div>
                    <div className="bg-slate-950 p-7 rounded-3xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                        <Sparkles className="text-rose-500 mb-5" size={28} />
                        <h4 className="text-[14px] font-black mb-2 uppercase leading-tight">Burada yer almak ister misin?</h4>
                        <p className="text-[11px] text-slate-400 font-medium mb-6 leading-relaxed">Yeteneğini sergile, fırsatları yakala ve büyümeye başla.</p>
                        <button 
                            onClick={() => router.push('/register')}
                            className="w-full h-11 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all shadow-xl active:scale-95"
                        >
                            Profil Oluştur
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-50">
                    <div className="max-w-xl w-full relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                            type="text" 
                            placeholder="Kişi, yetenek veya hizmet ara..." 
                            value={networkSearch}
                            onChange={(e) => setNetworkSearch(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 bg-slate-50 rounded-2xl text-[14px] font-medium border-none outline-none focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="hidden xl:flex items-center gap-10 text-[13px] font-black text-slate-500 uppercase tracking-widest">
                            <Link href="/hub" className="hover:text-rose-500 transition-colors">Keşfet</Link>
                            <Link href="#" className="hover:text-rose-500 transition-colors">Projeler</Link>
                            <Link href="#" className="hover:text-rose-500 transition-colors">Kişiler</Link>
                            <Link href="/register" className="hover:text-rose-500 transition-colors">İlan Ver</Link>
                        </div>
                        <div className="flex items-center gap-5 border-l border-slate-100 pl-10">
                            <button className="p-2.5 text-slate-400 hover:text-rose-500 transition-all relative">
                                <MessageSquare size={22} />
                            </button>
                            <button className="p-2.5 text-slate-400 hover:text-rose-500 transition-all relative">
                                <Bell size={22} />
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-[3px] border-white" />
                            </button>
                            <div 
                                onClick={() => router.push('/dashboard')}
                                className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer shadow-sm hover:ring-4 hover:ring-slate-50 transition-all"
                            >
                                <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-12 max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <section className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-7">
                            <div className="flex items-center gap-2 text-sky-600 bg-sky-50 px-4 py-2 rounded-full w-fit mb-10 border border-sky-100 shadow-sm">
                                <Plus size={16} strokeWidth={3} />
                                <span className="text-[11px] font-black uppercase tracking-widest">Profesyoneller için doğru yerdesin</span>
                            </div>
                            <h2 className="text-6xl font-black text-slate-900 leading-[1.05] tracking-tighter mb-10">
                                Profesyonel dünyayı keşfet, <br /><span className="text-rose-500">fırsatları yakala.</span>
                            </h2>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-xl">
                                Kardly Business Hub, iş birlikleri kurmak, projeler bulmak ve profesyonel ağını büyütmek için tasarlandı.
                            </p>
                            <div className="flex items-center gap-6">
                                <button 
                                    onClick={() => router.push('/register')}
                                    className="px-12 h-16 bg-slate-950 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-950/20 hover:bg-rose-500 transition-all active:scale-95"
                                >
                                    Ücretsiz Katıl
                                </button>
                                <button 
                                    onClick={() => router.push('/register')}
                                    className="px-12 h-16 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
                                >
                                    İlan Ver
                                </button>
                            </div>
                        </div>
                        
                        <div className="lg:col-span-5 relative hidden lg:block">
                            <div className="relative w-full aspect-square">
                                {/* Network Visualization */}
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.03] via-transparent to-sky-500/[0.03] rounded-full blur-[100px] animate-pulse" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-72 h-72 border-2 border-slate-100 rounded-full flex items-center justify-center relative animate-spin-slow">
                                        <div className="w-5 h-5 bg-rose-500 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.6)]" />
                                        {popularPros.slice(0, 3).map((u, i) => {
                                            const angles = [0, 120, 240]
                                            return (
                                                <div key={i} className="absolute w-14 h-14 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5" style={{ 
                                                    transform: `rotate(${angles[i]}deg) translate(144px) rotate(-${angles[i]}deg)`
                                                }}>
                                                    <img src={u.image || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-full h-full rounded-[10px] object-cover" alt="" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                {/* Floating Updates */}
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-0 right-0 bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4 max-w-[240px]">
                                    <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                                        <ShoppingBag size={24} className="text-rose-500" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-900 uppercase leading-none">Yeni Proje</p>
                                        <p className="text-[10px] text-slate-400 font-medium mt-1.5 line-clamp-2">E-ticaret sitesi geliştiricisi aranıyor.</p>
                                    </div>
                                </motion.div>
                                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute bottom-10 left-0 bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4 max-w-[220px]">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                        <Users size={24} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-900 uppercase leading-none">Yeni Üye</p>
                                        <p className="text-[10px] text-slate-400 font-medium mt-1.5">Selin Yılmaz katıldı.</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Categories Bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-20">
                        {categories.map((cat) => (
                            <button 
                                key={cat.id} 
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    "flex items-center gap-5 p-5 bg-white rounded-3xl border transition-all group",
                                    selectedCategory === cat.id ? "border-rose-500 shadow-xl shadow-rose-500/5 ring-4 ring-rose-50" : "border-slate-100 hover:border-rose-200 hover:shadow-xl hover:shadow-slate-200/30"
                                )}
                            >
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 group-hover:rotate-6", cat.bg)}>
                                    {cat.icon}
                                </div>
                                <span className="text-[14px] font-black text-slate-800 uppercase tracking-tight">{cat.name}</span>
                            </button>
                        ))}
                        <button 
                            onClick={() => setSelectedCategory("all")}
                            className="flex items-center justify-center p-5 bg-white rounded-3xl border border-slate-100 hover:border-rose-500 transition-all group"
                        >
                            <span className="text-[14px] font-black text-slate-500 flex items-center gap-3 group-hover:text-rose-500">Tümü <ArrowUpRight size={18} /></span>
                        </button>
                    </div>

                    {/* Content Feed */}
                    <section className="mb-20">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Öne Çıkan Projeler</h3>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sizin için seçilen en yeni iş ilanları</p>
                            </div>
                            <button className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-rose-500 transition-all">
                                Tüm Projeleri Gör <ArrowUpRight size={16} />
                            </button>
                        </div>
                        
                        <div className="space-y-5">
                            {projects.map((proj) => (
                                <div key={proj.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-rose-500/20 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all group cursor-pointer">
                                    <div className="flex flex-col xl:flex-row gap-10 items-start xl:items-center">
                                        <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform", proj.iconBg)}>
                                            {proj.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h4 className="text-xl font-black text-slate-900 group-hover:text-rose-500 transition-colors uppercase italic">{proj.title}</h4>
                                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-full border border-emerald-100">Yeni</span>
                                            </div>
                                            <p className="text-[15px] text-slate-500 font-medium leading-relaxed mb-6 max-w-3xl">{proj.desc}</p>
                                            <div className="flex flex-wrap items-center gap-3">
                                                {proj.tags.map(tag => (
                                                    <span key={tag} className="px-4 py-1.5 bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-widest rounded-xl border border-slate-100">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-row xl:flex-col items-center xl:items-end gap-10 xl:gap-3 shrink-0">
                                            <div className="text-left xl:text-right">
                                                <div className="text-2xl font-black text-slate-900 tracking-tighter">{proj.budget}</div>
                                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tahmini Bütçe</div>
                                            </div>
                                            <div className="text-left xl:text-right">
                                                <div className="text-[15px] font-black text-slate-900 tracking-tight">{proj.time}</div>
                                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">İlan Tarihi</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0 w-full xl:w-auto">
                                            <button className="flex-1 xl:flex-none h-14 px-10 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-rose-500 transition-all active:scale-95">
                                                Teklif Ver
                                            </button>
                                            <button className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-100">
                                                <Bookmark size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-12 text-center">
                            <button className="px-10 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3 mx-auto hover:text-rose-500 transition-all bg-white rounded-2xl border border-slate-100 hover:shadow-xl shadow-slate-100">
                                Daha Fazla Proje Yükle <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {/* Right Sidebar */}
            <aside className="w-96 bg-[#F8F9FB] border-l border-slate-100 hidden 2xl:flex flex-col sticky top-0 h-screen p-10 space-y-10 overflow-y-auto no-scrollbar">
                {/* Popular Pros */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-tight italic">Popüler Profesyoneller</h3>
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-all">Tümü <ArrowUpRight size={12} /></button>
                    </div>
                    <div className="space-y-8">
                        {popularPros.map((pro, i) => (
                            <div 
                                key={i} 
                                onClick={() => window.open(`https://${pro.profile?.username || pro.name}.kardly.site`, '_blank')}
                                className="flex items-center gap-5 group cursor-pointer"
                            >
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shadow-sm group-hover:border-rose-500 transition-all relative">
                                    <img src={pro.image || `https://ui-avatars.com/api/?name=${pro.name}&background=random`} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[13px] font-black text-slate-900 truncate group-hover:text-rose-500 transition-colors uppercase italic tracking-tight">{pro.profile?.displayName || pro.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate mt-0.5">{pro.profile?.occupation}</p>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                    <Star size={11} fill="currentColor" />
                                    {pro.profile?.avgRating || "5.0"}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={() => setSelectedCategory("all")}
                        className="w-full h-14 border-2 border-slate-50 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest mt-10 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-100 transition-all active:scale-95"
                    >
                        Tüm Profesyonelleri Keşfet
                    </button>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-tight italic">Yeni Aktiviteler</h3>
                    </div>
                    <div className="space-y-8">
                        {networkUsers.slice(0, 5).map((act, i) => {
                            const actions = ["yeni bir proje yayınladı", "projeye teklif verdi", "profilini güncelledi", "yeni üye olarak katıldı", "yeni bir makale paylaştı"]
                            return (
                                <div key={i} className="flex items-start gap-5 group cursor-pointer">
                                    <div className="w-11 h-11 rounded-2xl overflow-hidden border border-slate-50 shrink-0 group-hover:ring-4 group-hover:ring-slate-50 transition-all">
                                        <img src={act.image || `https://ui-avatars.com/api/?name=${act.name}&background=random`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[13px] font-medium leading-[1.4]">
                                            <span className="font-black text-slate-900 group-hover:text-rose-500 transition-colors uppercase italic text-[11px]">{act.profile?.displayName || act.name}</span> <span className="text-slate-500">{actions[i % actions.length]}</span>
                                        </p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                            <Globe2 size={10} />
                                            {i + 2} dakika önce
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <button className="w-full h-14 border-2 border-slate-50 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest mt-10 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-100 transition-all active:scale-95">
                        Tüm Aktiviteleri Gör
                    </button>
                </div>
            </aside>
        </div>
    )
}
