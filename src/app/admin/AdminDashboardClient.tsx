"use client"

import { useState } from "react"
import {
    Users,
    CreditCard,
    BarChart3,
    ShieldCheck,
    Search,
    ArrowLeft,
    TrendingUp,
    ExternalLink,
    Mail,
    Calendar,
    BadgeCheck,
    LogOut,
    Menu,
    X,
    Activity,
    ChevronRight,
    ArrowUpRight
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"

export default function AdminDashboardClient({ users, payments, stats }: any) {
    const [activeTab, setActiveTab] = useState("overview")
    const [searchQuery, setSearchQuery] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const filteredUsers = users.filter((u: any) =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0b0f1a]/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <ShieldCheck className="text-white w-5 h-5" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-tighter">Admin Panel</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 transition-all hover:bg-white/5 rounded-xl text-white/80"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Admin Sidebar */}
            <AnimatePresence>
                {(isSidebarOpen || true) && (
                    <aside className={cn(
                        "fixed lg:relative inset-y-0 left-0 z-[60] w-72 border-r border-white/5 p-6 flex flex-col gap-8 bg-[#0b0f1a] transition-transform duration-300 lg:translate-x-0",
                        isSidebarOpen ? "translate-x-0 shadow-2xl shadow-emerald-500/10" : "-translate-x-full lg:translate-x-0"
                    )}>
                        <div className="flex items-center justify-between lg:justify-start gap-3 px-2 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
                                    <ShieldCheck className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-lg font-black block leading-none tracking-tighter">SaaS <span className="text-emerald-500">ADMIN</span></span>
                                    <span className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1 block">Yönetim Merkesi</span>
                                </div>
                            </div>
                            <button className="lg:hidden p-2 text-white/20 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-1.5 flex-1">
                            <div className="mb-2 px-4 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Ana Menü</div>
                            <AdminNavItem
                                icon={<Activity className="w-5 h-5" />}
                                label="Genel Bakış"
                                active={activeTab === "overview"}
                                onClick={() => { setActiveTab("overview"); setIsSidebarOpen(false); }}
                            />
                            <AdminNavItem
                                icon={<Users className="w-5 h-5" />}
                                label="Kullanıcı Yönetimi"
                                active={activeTab === "users"}
                                onClick={() => { setActiveTab("users"); setIsSidebarOpen(false); }}
                            />
                            <AdminNavItem
                                icon={<CreditCard className="w-5 h-5" />}
                                label="Ödeme Kayıtları"
                                active={activeTab === "payments"}
                                onClick={() => { setActiveTab("payments"); setIsSidebarOpen(false); }}
                            />

                            <div className="mt-8 mb-2 px-4 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Hızlı Erişim</div>
                            <Link href="/dashboard" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-white/40 hover:bg-white/5 hover:text-white transition-all group">
                                <div className="flex items-center gap-3">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    <span>Kullanıcı Paneli</span>
                                </div>
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </nav>

                        <div className="mt-auto p-4 rounded-[2rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/10 relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Hesap Güvenliği</p>
                                <p className="text-xs text-white/60 mb-4 leading-relaxed">Admin oturumu aktif. İşlem sonrası güvenli çıkış yapın.</p>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="w-full py-3 bg-white/5 hover:bg-rose-500 hover:text-white border border-white/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" /> Güvenli Çıkış
                                </button>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-emerald-500/10 blur-2xl rounded-full" />
                        </div>
                    </aside>
                )}
            </AnimatePresence>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-12 pt-24 lg:pt-12 no-scrollbar">
                <header className="mb-10 lg:flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">Sistem <span className="gradient-text">Özeti.</span></h1>
                        <p className="text-white/40 text-sm font-medium">Platform performansı and kullanıcı analitiği.</p>
                    </motion.div>
                    <div className="mt-4 lg:mt-0 flex items-center gap-3">
                        <div className="flex -space-x-2 mr-4 hidden sm:flex">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-white/5 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                                    <img src={`https://avatar.iran.liara.run/public/${i + 30}`} alt="Admin" />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-[10px] font-black uppercase tracking-[0.1em]">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                            Sistem Devrede
                        </div>
                    </div>
                </header>

                <div className="space-y-12 pb-12">
                    {activeTab === "overview" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-10"
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <AdminStatCard icon={<Users className="w-6 h-6" />} label="Toplam Kullanıcı" value={stats.totalUsers} color="text-blue-400" bgColor="bg-blue-400/10" />
                                <AdminStatCard icon={<TrendingUp className="w-6 h-6" />} label="Toplam Ciro" value={`₺${stats.totalRevenue}`} color="text-emerald-400" bgColor="bg-emerald-400/10" />
                                <AdminStatCard icon={<BadgeCheck className="w-6 h-6" />} label="Premium Üyeler" value={stats.activeSubscriptions} color="text-purple-400" bgColor="bg-purple-400/10" />
                                <AdminStatCard icon={<Activity className="w-6 h-6" />} label="Etkileşim" value={stats.totalViews} color="text-amber-400" bgColor="bg-amber-400/10" />
                            </div>

                            {/* Main Content Area */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-2 glass p-8 rounded-[3rem] border-white/5 bg-white/[0.02] relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h3 className="text-xl font-black tracking-tight mb-1 uppercase tracking-tighter">Son İşlemler</h3>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest text-emerald-500">Ödeme Geçmişi</p>
                                        </div>
                                        <button className="text-xs font-bold text-white/40 hover:text-white transition-all flex items-center gap-1">
                                            Tümü <ArrowUpRight size={14} />
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto no-scrollbar">
                                        <table className="w-full text-left min-w-[500px]">
                                            <thead>
                                                <tr className="border-b border-white/5">
                                                    <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-white/20 italic">Yatırımcı / Kullanıcı</th>
                                                    <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-white/20 italic">Tutar</th>
                                                    <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-white/20 italic">Tarih</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {payments.slice(0, 5).map((p: any) => (
                                                    <tr key={p.id} className="group hover:bg-white/[0.02] transition-all">
                                                        <td className="px-4 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
                                                                    <Mail size={14} />
                                                                </div>
                                                                <div className="truncate text-xs font-bold opacity-80 group-hover:opacity-100 transition-all">{p.user?.email}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-5 font-black text-emerald-400 text-sm italic">₺{p.amount}</td>
                                                        <td className="px-4 py-5 text-[10px] font-bold opacity-40 uppercase tracking-tighter">{new Date(p.createdAt).toLocaleDateString('tr-TR')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Glass Decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                                </div>

                                <div className="glass p-8 rounded-[3rem] border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-500/5">
                                        <ShieldCheck className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">Güvenli SaaS</h3>
                                    <p className="text-sm text-white/40 mb-8 leading-relaxed">Platform üzerindeki tüm işlemler şifrelenmiş ve denetim altındadır.</p>
                                    <div className="w-full h-[1px] bg-white/5 mb-8" />
                                    <div className="grid grid-cols-2 gap-4 w-full text-left">
                                        <div>
                                            <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1 italic">Uptime</p>
                                            <p className="text-sm font-bold text-emerald-500">99.9%</p>
                                        </div>
                                        <div>
                                            <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1 italic">Hatalar</p>
                                            <p className="text-sm font-bold text-rose-500">0</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "users" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                                <h1 className="text-2xl font-black uppercase tracking-tighter">Kullanıcı Listesi</h1>
                                <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-[2rem] border border-white/5 w-full sm:max-w-md group focus-within:border-emerald-500/30 transition-all">
                                    <Search className="text-white/20 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="E-posta veya isimle ara..."
                                        className="bg-transparent border-none outline-none text-sm w-full font-bold placeholder:font-normal placeholder:opacity-20"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="glass rounded-[3.5rem] border-white/5 bg-white/[0.01] overflow-hidden p-4">
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left min-w-[700px]">
                                        <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                                            <tr>
                                                <th className="px-8 py-5">Kullanıcı Bilgisi</th>
                                                <th className="px-8 py-5">Dijital Kimlik / Username</th>
                                                <th className="px-8 py-5">Abonelik</th>
                                                <th className="px-8 py-5 text-right">Referans ID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.03]">
                                            {filteredUsers.map((u: any) => (
                                                <tr key={u.id} className="group hover:bg-white/[0.02] transition-all">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:bg-emerald-500 group-hover:text-white transition-all overflow-hidden duration-500">
                                                                <img src={u.image || `https://avatar.iran.liara.run/username?username=${u.name || 'User'}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-sm tracking-tight flex items-center gap-2">
                                                                    {u.name || 'İsimsiz'}
                                                                    {u.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                                                                </div>
                                                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest truncate max-w-[150px]">{u.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        {u.profile ? (
                                                            <Link href={`/${u.profile.username}`} target="_blank" className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-black hover:bg-indigo-500 hover:text-white transition-all uppercase tracking-widest">
                                                                @{u.profile.username} <ExternalLink className="w-3 h-3" />
                                                            </Link>
                                                        ) : (
                                                            <span className="text-[10px] font-black text-white/10 uppercase italic tracking-widest">Profil Oluşturulmadı</span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={cn(
                                                            "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg",
                                                            u.subscription?.plan === 'pro' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400 shadow-purple-500/10' : 'bg-white/5 border border-white/10 text-white/40'
                                                        )}>
                                                            {u.subscription?.plan || 'free'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="text-[10px] font-mono text-white/20 group-hover:text-white/40 transition-colors uppercase italic font-bold">#USR-{u.id.substring(0, 6)}</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "payments" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                                <h1 className="text-2xl font-black uppercase tracking-tighter italic text-emerald-500 tracking-tighter">İşlem Kayıtları (₺)</h1>
                                <div className="flex gap-3">
                                    <div className="px-4 py-2 bg-emerald-500/10 rounded-xl text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/10 flex items-center gap-2">
                                        <Activity size={12} /> Canlı Kayıtlar
                                    </div>
                                </div>
                            </div>

                            <div className="glass rounded-[3.5rem] border-white/5 bg-white/[0.01] overflow-hidden p-4">
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left min-w-[800px]">
                                        <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                                            <tr>
                                                <th className="px-8 py-5 italic">İşlem Sahibi</th>
                                                <th className="px-8 py-5 italic">İşlem Kimliği (UUID)</th>
                                                <th className="px-8 py-5 italic">Tutar</th>
                                                <th className="px-8 py-5 italic">Tarih / Saat</th>
                                                <th className="px-8 py-5 text-right italic">Durum</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.03]">
                                            {payments.map((p: any) => (
                                                <tr key={p.id} className="group hover:bg-white/[0.02] transition-all">
                                                    <td className="px-8 py-6">
                                                        <div className="text-xs font-black tracking-tight group-hover:text-emerald-500 transition-colors">{p.user?.email}</div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="text-[10px] font-mono font-bold text-white/20 group-hover:text-white/40 transition-colors truncate max-w-[120px]">
                                                            {p.id}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="text-sm font-black text-emerald-400">₺{p.amount}</div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-white/30 truncate">
                                                            {new Date(p.createdAt).toLocaleString('tr-TR')}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${p.status === 'success'
                                                            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
                                                            : 'bg-rose-500/20 border border-rose-500/30 text-rose-400 shadow-rose-500/10'
                                                            }`}>
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {payments.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-8 py-20 text-center text-white/10 font-black uppercase tracking-[0.5em] italic">İşlem Bulunamadı</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    )
}

function AdminNavItem({ icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-[1.2rem] transition-all text-sm font-bold group w-full",
                active
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/20"
                    : "text-white/30 hover:bg-white/5 hover:text-white/80"
            )}
        >
            <div className={cn(
                "transition-all duration-500",
                active ? "scale-110" : "group-hover:scale-110"
            )}>
                {icon}
            </div>
            <span className="truncate">{label}</span>
            {active && (
                <motion.div
                    layoutId="active-nav"
                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff]"
                />
            )}
        </button>
    )
}

function AdminStatCard({ icon, label, value, color, bgColor }: any) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass p-8 rounded-[2.5rem] border-white/5 bg-white/[0.03] relative overflow-hidden group"
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${bgColor} ${color} transition-all group-hover:scale-110 duration-500`}>
                    {icon}
                </div>
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center -rotate-45 opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-0">
                    <ArrowUpRight size={18} className="text-white/20" />
                </div>
            </div>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
            <p className="text-3xl font-black tracking-tighter">{value}</p>

            {/* Decoration */}
            <div className={`absolute -bottom-4 -right-4 w-20 h-20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full ${bgColor}`} />
        </motion.div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}

