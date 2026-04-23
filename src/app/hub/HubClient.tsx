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
    Bookmark,
    Home,
    Compass,
    PlusCircle,
    ShoppingBag,
    PenTool,
    Briefcase as BriefcaseIcon,
    Megaphone,
    MoreHorizontal,
    Plus,
    Layout
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
    
    // Sidebar active state
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
        { id: "software", name: "Yazılım & Teknoloji", icon: <ShoppingBag size={20} className="text-sky-500" />, bg: "bg-sky-50" },
        { id: "design", name: "Tasarım & Kreatif", icon: <PenTool size={20} className="text-purple-500" />, bg: "bg-purple-50" },
        { id: "consulting", name: "Danışmanlık", icon: <BriefcaseIcon size={20} className="text-amber-500" />, bg: "bg-amber-50" },
        { id: "marketing", name: "Pazarlama & Satış", icon: <Megaphone size={20} className="text-rose-500" />, bg: "bg-rose-50" },
    ]

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

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex">
            {/* Left Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col sticky top-0 h-screen p-6">
                <div className="flex items-center gap-2 mb-10 pl-2">
                    <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-200">K</div>
                    <div>
                        <h1 className="font-black text-slate-900 text-lg leading-none tracking-tight">Kardly</h1>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Business Hub</p>
                    </div>
                </div>

                <nav className="space-y-1 mb-10">
                    {[
                        { id: 'ana-sayfa', label: 'Ana Sayfa', icon: <Home size={18} /> },
                        { id: 'kesfet', label: 'Keşfet', icon: <Compass size={18} /> },
                        { id: 'projeler', label: 'Projeler', icon: <Layout size={18} /> },
                        { id: 'kisiler', label: 'Kişiler', icon: <Users size={18} /> },
                        { id: 'mesajlar', label: 'Mesajlar', icon: <MessageSquare size={18} /> },
                        { id: 'bildirimler', label: 'Bildirimler', icon: <Bell size={18} /> },
                        { id: 'favoriler', label: 'Favoriler', icon: <Heart size={18} /> },
                        { id: 'kaydedilenler', label: 'Kaydedilenler', icon: <Bookmark size={18} /> },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveNav(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                activeNav === item.id 
                                    ? "bg-rose-50 text-rose-600 shadow-sm" 
                                    : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mb-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Kategoriler</p>
                    <div className="space-y-1">
                        {["Yazılım & Teknoloji", "Tasarım & Kreatif", "Pazarlama & Satış", "Yazı & Çeviri", "Danışmanlık"].map((cat) => (
                            <button key={cat} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-[13px] font-bold text-slate-500 hover:bg-slate-50 transition-all">
                                {cat}
                            </button>
                        ))}
                        <button className="w-full flex items-center justify-between px-4 py-2 rounded-xl text-[13px] font-bold text-slate-500 hover:bg-slate-50 transition-all">
                            Tümü <ArrowUpRight size={14} className="rotate-90" />
                        </button>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="bg-slate-950 p-6 rounded-2xl text-white relative overflow-hidden">
                        <Sparkles className="text-rose-500 mb-4" size={24} />
                        <h4 className="text-[13px] font-black mb-2 uppercase leading-tight">Burada yer almak ister misin?</h4>
                        <p className="text-[11px] text-slate-400 font-medium mb-4">Yeteneğini sergile, fırsatları yakala ve büyümeye başla.</p>
                        <button className="w-full h-10 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-xl">
                            Profil Oluştur
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-50">
                    <div className="max-w-2xl w-full relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                            type="text" 
                            placeholder="Kişi, yetenek veya hizmet ara..." 
                            className="w-full h-11 pl-12 pr-4 bg-slate-50 rounded-xl text-sm font-medium border-none outline-none focus:ring-2 focus:ring-rose-500/10 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-600 uppercase tracking-widest">
                            <Link href="#" className="hover:text-rose-500">Keşfet</Link>
                            <Link href="#" className="hover:text-rose-500">Projeler</Link>
                            <Link href="#" className="hover:text-rose-500">Kişiler</Link>
                            <Link href="#" className="hover:text-rose-500">İlan Ver</Link>
                        </div>
                        <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
                            <button className="p-2 text-slate-400 hover:text-rose-500 relative transition-all">
                                <MessageSquare size={20} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-rose-500 relative transition-all">
                                <Bell size={20} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                            </button>
                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden ml-2 cursor-pointer shadow-sm">
                                <img src="https://ui-avatars.com/api/?name=Ibrahim+Balta&background=random" alt="User" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <section className="mb-14 relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-2 text-sky-500 bg-sky-50 px-3 py-1.5 rounded-full w-fit mb-8 border border-sky-100 shadow-sm">
                                <Plus size={14} strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Profesyoneller için doğru yerdesin</span>
                            </div>
                            <h2 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-8">
                                Profesyonel dünyayı keşfet, <span className="text-rose-500">fırsatları yakala.</span>
                            </h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-lg">
                                Kardly Business Hub, iş birlikleri kurmak, projeler bulmak ve profesyonel ağını büyütmek için tasarlandı.
                            </p>
                            <div className="flex items-center gap-4">
                                <button className="px-10 h-14 bg-slate-950 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-950/20 hover:bg-rose-500 transition-all active:scale-95">
                                    Ücretsiz Katıl
                                </button>
                                <button className="px-10 h-14 bg-white text-slate-900 border-2 border-slate-100 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                                    İlan Ver
                                </button>
                            </div>
                        </div>
                        <div className="relative hidden lg:block">
                            {/* Network Visualization Mockup */}
                            <div className="relative w-full aspect-square flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-sky-500/5 rounded-full blur-3xl animate-pulse" />
                                <div className="w-64 h-64 border-2 border-slate-100 rounded-full flex items-center justify-center relative animate-spin-slow">
                                    <div className="w-4 h-4 bg-rose-500 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.5)]" />
                                    {/* Rotating avatars icons */}
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-white shadow-xl border border-slate-100 p-1">
                                        <img src="https://ui-avatars.com/api/?name=User+1&background=random" className="w-full h-full rounded-xl object-cover" alt="" />
                                    </div>
                                    <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white shadow-xl border border-slate-100 p-1">
                                        <img src="https://ui-avatars.com/api/?name=User+2&background=random" className="w-full h-full rounded-xl object-cover" alt="" />
                                    </div>
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-white shadow-xl border border-slate-100 p-1">
                                        <img src="https://ui-avatars.com/api/?name=User+3&background=random" className="w-full h-full rounded-xl object-cover" alt="" />
                                    </div>
                                </div>
                                {/* Activity Popups */}
                                <div className="absolute top-0 right-0 bg-white p-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                                        <img src="https://ui-avatars.com/api/?name=P&background=random" alt="" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-900 uppercase leading-none">Yeni Proje Yayınlandı</p>
                                        <p className="text-[9px] text-slate-400 font-medium mt-1">E-Ticaret sitesi için yazılım geliştirici aranıyor.</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-10 left-0 bg-white p-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 animate-bounce">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                                        <img src="https://ui-avatars.com/api/?name=U&background=random" alt="" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-900 uppercase leading-none">Yeni Üye</p>
                                        <p className="text-[9px] text-slate-400 font-medium mt-1">Selin Yılmaz aramıza katıldı.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Categories Row */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
                        {categories.map((cat) => (
                            <button key={cat.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-rose-500 hover:shadow-xl hover:shadow-rose-500/5 transition-all group">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", cat.bg)}>
                                    {cat.icon}
                                </div>
                                <span className="text-[13px] font-bold text-slate-700">{cat.name}</span>
                            </button>
                        ))}
                        <button className="flex items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 hover:border-rose-500 hover:shadow-xl hover:shadow-rose-500/5 transition-all group">
                            <span className="text-[13px] font-bold text-slate-500 flex items-center gap-2">Tümü <ArrowUpRight size={16} /></span>
                        </button>
                    </div>

                    {/* Featured Projects */}
                    <section className="mb-14">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Öne Çıkan Projeler</h3>
                            <button className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-rose-500 transition-colors">
                                Tüm Projeleri Gör <ArrowUpRight size={14} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {projects.map((proj) => (
                                <div key={proj.id} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-rose-500/20 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative">
                                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", proj.iconBg)}>
                                            {proj.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-rose-500 transition-colors">{proj.title}</h4>
                                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-4 max-w-2xl">{proj.desc}</p>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {proj.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-row md:flex-col items-start md:items-end gap-6 md:gap-2 shrink-0">
                                            <div className="text-right">
                                                <div className="text-lg font-black text-slate-900">{proj.budget}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Bütçe</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[13px] font-black text-slate-900">{proj.time}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Son Tarih</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
                                            <button className="h-12 px-8 bg-slate-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-rose-500 transition-all">
                                                Teklif Ver
                                            </button>
                                            <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-100">
                                                <Bookmark size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 text-center">
                            <button className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mx-auto hover:text-rose-500 transition-colors">
                                Daha Fazla Proje Yükle
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {/* Right Sidebar */}
            <aside className="w-80 bg-[#F8F9FB] border-l border-slate-100 hidden xl:flex flex-col sticky top-0 h-screen p-8 space-y-10 overflow-y-auto no-scrollbar">
                {/* Popular Professionals */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">Popüler Profesyoneller</h3>
                        <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">Tümü <ArrowUpRight size={10} /></button>
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: "İbrahim Balta", title: "Full Stack Developer", rating: "4.9" },
                            { name: "S. Cahit Demir", title: "UI/UX Designer", rating: "4.8" },
                            { name: "Selin Yılmaz", title: "Dijital Pazarlama Uzmanı", rating: "4.9" },
                            { name: "Birkan Kocatürk", title: "Mobil Uygulama Geliştirici", rating: "4.7" },
                        ].map((pro, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-100 shadow-sm group-hover:border-rose-500 transition-all">
                                    <img src={`https://ui-avatars.com/api/?name=${pro.name}&background=random`} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[11px] font-black text-slate-900 truncate group-hover:text-rose-500 transition-colors uppercase italic">{pro.name}</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{pro.title}</p>
                                </div>
                                <div className="flex items-center gap-1 text-[9px] font-black text-amber-500">
                                    <Star size={10} fill="currentColor" />
                                    {pro.rating}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full h-12 border-2 border-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest mt-8 hover:bg-slate-50 hover:text-slate-600 transition-all">
                        Tüm Profesyonelleri Keşfet
                    </button>
                </div>

                {/* New Activities */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tight mb-8">Yeni Aktiviteler</h3>
                    <div className="space-y-6">
                        {[
                            { name: "Ali Yılmaz", action: "yeni bir proje yayınladı", time: "2 dakika önce" },
                            { name: "Zeynep A.", action: "projeye teklif verdi", time: "15 dakika önce" },
                            { name: "Mert K.", action: "profilini güncelledi", time: "1 saat önce" },
                            { name: "Ayşe D.", action: "yeni üye olarak katıldı", time: "2 saat önce" },
                        ].map((act, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-50 shrink-0">
                                    <img src={`https://ui-avatars.com/api/?name=${act.name}&background=random`} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium leading-relaxed">
                                        <span className="font-black text-slate-900">{act.name}</span> <span className="text-slate-500">{act.action}</span>
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full h-12 border-2 border-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest mt-8 hover:bg-slate-50 hover:text-slate-600 transition-all">
                        Tüm Aktiviteleri Gör
                    </button>
                </div>
            </aside>
        </div>
    )
}
