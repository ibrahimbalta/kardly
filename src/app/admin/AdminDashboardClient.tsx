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
    const [localUsers, setLocalUsers] = useState(users)
    const [loadingUserId, setLoadingUserId] = useState<string | null>(null)

    const filteredUsers = localUsers.filter((u: any) =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        setLoadingUserId(userId)
        try {
            const response = await fetch('/api/admin/users/toggle-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, isActive: !currentStatus })
            })

            if (response.ok) {
                setLocalUsers(localUsers.map((u: any) =>
                    u.id === userId ? { ...u, isActive: !currentStatus } : u
                ))
            }
        } catch (error) {
            console.error("Status toggle error:", error)
        } finally {
            setLoadingUserId(null)
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                        <ShieldCheck className="text-white w-5 h-5" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-tighter">Admin Panel</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 transition-all hover:bg-slate-100 rounded-xl text-slate-600"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Admin Sidebar */}
            <AnimatePresence>
                {(isSidebarOpen || true) && (
                    <aside className={cn(
                        "fixed lg:relative inset-y-0 left-0 z-[60] w-72 border-r border-slate-200 p-6 flex flex-col gap-8 bg-white transition-transform duration-300 lg:translate-x-0",
                        isSidebarOpen ? "translate-x-0 shadow-2xl shadow-slate-200/50" : "-translate-x-full lg:translate-x-0"
                    )}>
                        <div className="flex items-center justify-between lg:justify-start gap-3 px-2 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
                                    <ShieldCheck className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-lg font-black block leading-none tracking-tighter">SaaS <span className="text-primary">ADMIN</span></span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 block">Yönetim Merkezi</span>
                                </div>
                            </div>
                            <button className="lg:hidden p-2 text-slate-300 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-1.5 flex-1">
                            <div className="mb-2 px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Ana Menü</div>
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

                            <div className="mt-8 mb-2 px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Hızlı Erişim</div>
                            <Link href="/dashboard" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all group">
                                <div className="flex items-center gap-3">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    <span>Kullanıcı Paneli</span>
                                </div>
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </nav>

                        <div className="mt-auto p-4 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Hesap Güvenliği</p>
                                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Admin oturumu aktif. İşlem sonrası güvenli çıkış yapın.</p>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="w-full py-3 bg-white hover:bg-rose-500 hover:text-white border border-slate-200 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <LogOut className="w-4 h-4" /> Güvenli Çıkış
                                </button>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary/10 blur-2xl rounded-full" />
                        </div>
                    </aside>
                )}
            </AnimatePresence>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] lg:hidden"
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
                        <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2 text-slate-900">Sistem <span className="gradient-text">Özeti.</span></h1>
                        <p className="text-slate-400 text-sm font-medium">Platform performansı ve kullanıcı analitiği.</p>
                    </motion.div>
                    <div className="mt-4 lg:mt-0 flex items-center gap-3">
                        <div className="flex -space-x-2 mr-4 hidden sm:flex">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-sm">
                                    <img src={`https://avatar.iran.liara.run/public/${i + 30}`} alt="Admin" />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.1em]">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
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
                                <AdminStatCard icon={<Users className="w-6 h-6" />} label="Toplam Kullanıcı" value={stats.totalUsers} color="text-blue-600" bgColor="bg-blue-50" />
                                <AdminStatCard icon={<TrendingUp className="w-6 h-6" />} label="Toplam Ciro" value={`₺${stats.totalRevenue}`} color="text-emerald-600" bgColor="bg-emerald-50" />
                                <AdminStatCard icon={<BadgeCheck className="w-6 h-6" />} label="Premium Üyeler" value={stats.activeSubscriptions} color="text-purple-600" bgColor="bg-purple-50" />
                                <AdminStatCard icon={<Activity className="w-6 h-6" />} label="Etkileşim" value={stats.totalViews} color="text-amber-600" bgColor="bg-amber-50" />
                            </div>

                            {/* Main Content Area */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h3 className="text-xl font-black tracking-tight mb-1 uppercase tracking-tighter text-slate-900">Son İşlemler</h3>
                                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest uppercase">Ödeme Geçmişi</p>
                                        </div>
                                        <button className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-all flex items-center gap-1">
                                            Tümü <ArrowUpRight size={14} />
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto no-scrollbar">
                                        <table className="w-full text-left min-w-[500px]">
                                            <thead>
                                                <tr className="border-b border-slate-100">
                                                    <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Yatırımcı / Kullanıcı</th>
                                                    <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Tutar</th>
                                                    <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Tarih</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {payments.slice(0, 5).map((p: any) => (
                                                    <tr key={p.id} className="group hover:bg-slate-50 transition-all">
                                                        <td className="px-4 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                                    <Mail size={14} />
                                                                </div>
                                                                <div className="truncate text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-all">{p.user?.email}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-5 font-black text-emerald-600 text-sm italic">₺{p.amount}</td>
                                                        <td className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(p.createdAt).toLocaleDateString('tr-TR')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                                </div>

                                <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
                                        <ShieldCheck className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-black mb-2 uppercase tracking-tighter text-slate-900">Güvenli SaaS</h3>
                                    <p className="text-sm text-slate-400 mb-8 leading-relaxed px-4">Platform üzerindeki tüm işlemler şifrelenmiş ve denetim altındadır.</p>
                                    <div className="w-full h-[1px] bg-slate-100 mb-8" />
                                    <div className="grid grid-cols-2 gap-4 w-full text-left px-4">
                                        <div>
                                            <p className="text-slate-300 text-[9px] font-black uppercase tracking-widest mb-1 italic">Uptime</p>
                                            <p className="text-sm font-bold text-emerald-600">99.9%</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-300 text-[9px] font-black uppercase tracking-widest mb-1 italic">Hatalar</p>
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
                                <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Kullanıcı Listesi</h1>
                                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-[2rem] border border-slate-200 w-full sm:max-w-md group focus-within:border-primary/30 transition-all shadow-sm">
                                    <Search className="text-slate-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="E-posta veya isimle ara..."
                                        className="bg-transparent border-none outline-none text-sm w-full font-bold placeholder:font-normal placeholder:text-slate-300 text-slate-700"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden p-4">
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left min-w-[700px]">
                                        <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                            <tr>
                                                <th className="px-8 py-5">Kullanıcı Bilgisi</th>
                                                <th className="px-8 py-5">Dijital Kimlik / Username</th>
                                                <th className="px-8 py-5">Abonelik</th>
                                                <th className="px-8 py-5">Durum</th>
                                                <th className="px-8 py-5 text-right">Referans ID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredUsers.map((u: any) => (
                                                <tr key={u.id} className="group hover:bg-slate-50/50 transition-all">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all overflow-hidden duration-500 shadow-sm border border-slate-200">
                                                                <img src={u.image || `https://avatar.iran.liara.run/username?username=${u.name || 'User'}`} className="w-full h-full object-cover" alt={u.name} />
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-sm tracking-tight flex items-center gap-2 text-slate-700 group-hover:text-slate-900">
                                                                    {u.name || 'İsimsiz'}
                                                                    {u.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                                                                </div>
                                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">{u.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        {u.profile ? (
                                                            <Link href={`/${u.profile.username}`} target="_blank" className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest shadow-sm">
                                                                @{u.profile.username} <ExternalLink className="w-3 h-3" />
                                                            </Link>
                                                        ) : (
                                                            <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">Profil Oluşturulmadı</span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={cn(
                                                            "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm",
                                                            u.subscription?.plan === 'pro' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-slate-100 border border-slate-200 text-slate-500'
                                                        )}>
                                                            {u.subscription?.plan || 'free'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <button
                                                            onClick={() => handleToggleStatus(u.id, u.isActive !== false)}
                                                            disabled={loadingUserId === u.id}
                                                            className={cn(
                                                                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border shadow-sm",
                                                                u.isActive !== false
                                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100"
                                                                    : "bg-rose-50 text-rose-600 border-rose-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100"
                                                            )}
                                                        >
                                                            {loadingUserId === u.id ? (
                                                                <span className="w-2 h-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <span className={cn(
                                                                    "w-2 h-2 rounded-full",
                                                                    u.isActive !== false ? "bg-emerald-500" : "bg-rose-500"
                                                                )} />
                                                            )}
                                                            {u.isActive !== false ? 'AKTİF' : 'PASİF'}
                                                        </button>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="text-[10px] font-mono text-slate-300 group-hover:text-slate-500 transition-colors uppercase italic font-bold">#USR-{u.id.substring(0, 6)}</div>
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
                                <h1 className="text-2xl font-black uppercase tracking-tighter italic text-primary tracking-tighter">İşlem Kayıtları (₺)</h1>
                                <div className="flex gap-3">
                                    <div className="px-4 py-2 bg-emerald-50 rounded-xl text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2 shadow-sm">
                                        <Activity size={12} /> Canlı Kayıtlar
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden p-4">
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left min-w-[800px]">
                                        <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                            <tr>
                                                <th className="px-8 py-5 italic">İşlem Sahibi</th>
                                                <th className="px-8 py-5 italic">İşlem Kimliği (UUID)</th>
                                                <th className="px-8 py-5 italic">Tutar</th>
                                                <th className="px-8 py-5 italic">Tarih / Saat</th>
                                                <th className="px-8 py-5 text-right italic">Durum</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {payments.map((p: any) => (
                                                <tr key={p.id} className="group hover:bg-slate-50 transition-all">
                                                    <td className="px-8 py-6">
                                                        <div className="text-xs font-black tracking-tight text-slate-600 group-hover:text-primary transition-colors">{p.user?.email}</div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="text-[10px] font-mono font-bold text-slate-300 group-hover:text-slate-500 transition-colors truncate max-w-[120px]">
                                                            {p.id}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="text-sm font-black text-emerald-600">₺{p.amount}</div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">
                                                            {new Date(p.createdAt).toLocaleString('tr-TR')}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${p.status === 'success'
                                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                                                            }`}>
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {payments.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-200 font-black uppercase tracking-[0.5em] italic">İşlem Bulunamadı</td>
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
                    ? "bg-gradient-to-r from-primary to-rose-600 text-white shadow-xl shadow-primary/20"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
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
            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group"
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${bgColor} ${color} transition-all group-hover:scale-110 duration-500`}>
                    {icon}
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center -rotate-45 opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-0 border border-slate-100">
                    <ArrowUpRight size={18} className="text-slate-300" />
                </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
            <p className="text-3xl font-black tracking-tighter text-slate-900">{value}</p>

            {/* Decoration */}
            <div className={`absolute -bottom-4 -right-4 w-20 h-20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full ${bgColor}`} />
        </motion.div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}

