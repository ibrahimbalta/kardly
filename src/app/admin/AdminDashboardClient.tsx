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
    LogOut
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { signOut } from "next-auth/react"

export default function AdminDashboardClient({ users, payments, stats }: any) {
    const [activeTab, setActiveTab] = useState("overview")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredUsers = users.filter((u: any) =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#020617] text-white flex">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r border-white/5 p-6 flex flex-col gap-8 bg-[#0b0f1a]">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <ShieldCheck className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-lg font-bold block leading-none">Admin</span>
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Kontrol Paneli</span>
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    <AdminNavItem
                        icon={<BarChart3 className="w-5 h-5" />}
                        label="Genel Bakış"
                        active={activeTab === "overview"}
                        onClick={() => setActiveTab("overview")}
                    />
                    <AdminNavItem
                        icon={<Users className="w-5 h-5" />}
                        label="Kullanıcılar"
                        active={activeTab === "users"}
                        onClick={() => setActiveTab("users")}
                    />
                    <AdminNavItem
                        icon={<CreditCard className="w-5 h-5" />}
                        label="Ödemeler"
                        active={activeTab === "payments"}
                        onClick={() => setActiveTab("payments")}
                    />
                    <hr className="border-white/5 my-4" />
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-white/40 hover:text-white transition-all">
                        <ArrowLeft className="w-4 h-4" /> Kullanıcı Paneline Dön
                    </Link>
                    <hr className="border-white/5 my-4" />
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                        <LogOut className="w-4 h-4" /> Çıkış Yap
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-auto">
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Sistem Özeti</h1>
                        <p className="text-white/40">Kardly platformunun genel performansı ve yönetimi.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-sm font-bold animate-pulse">
                            Sistem Çevrimiçi
                        </div>
                    </div>
                </header>

                {activeTab === "overview" && (
                    <div className="space-y-10">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <AdminStatCard icon={<Users />} label="Toplam Kullanıcı" value={stats.totalUsers} color="text-blue-400" />
                            <AdminStatCard icon={<TrendingUp />} label="Toplam Ciro" value={`₺${stats.totalRevenue}`} color="text-emerald-400" />
                            <AdminStatCard icon={<BadgeCheck />} label="Pro Aboneler" value={stats.activeSubscriptions} color="text-purple-400" />
                            <AdminStatCard icon={<BarChart3 />} label="Sayfa Gösterimi" value={stats.totalViews} color="text-amber-400" />
                        </div>

                        {/* Recent Payments Table */}
                        <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-white/5">
                            <h3 className="text-xl font-bold mb-6">Son Başarılı Ödemeler</h3>
                            <div className="overflow-hidden rounded-2xl border border-white/5">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                        <tr>
                                            <th className="px-6 py-4">Kullanıcı</th>
                                            <th className="px-6 py-4">Tutar</th>
                                            <th className="px-6 py-4">Tarih</th>
                                            <th className="px-6 py-4">Durum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {payments.slice(0, 5).map((p: any) => (
                                            <tr key={p.id} className="text-sm">
                                                <td className="px-6 py-4 font-medium">{p.user?.email}</td>
                                                <td className="px-6 py-4 font-bold text-emerald-400">₺{p.amount}</td>
                                                <td className="px-6 py-4 opacity-40">{new Date(p.createdAt).toLocaleDateString('tr-TR')}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-bold uppercase">Başarılı</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "users" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 max-w-md">
                            <Search className="text-white/20 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="E-posta veya isimle ara..."
                                className="bg-transparent border-none outline-none text-sm w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="glass rounded-[2rem] border-white/5 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                    <tr>
                                        <th className="px-6 py-4">Kullanıcı</th>
                                        <th className="px-6 py-4">Profil</th>
                                        <th className="px-6 py-4">Plan</th>
                                        <th className="px-6 py-4">Kayıt Tarihi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredUsers.map((u: any) => (
                                        <tr key={u.id} className="text-xs hover:bg-white/[0.02] transition-all group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold flex items-center gap-2">
                                                    {u.name || 'İsimsiz'}
                                                    {u.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                                                </div>
                                                <div className="opacity-40">{u.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.profile ? (
                                                    <Link href={`/${u.profile.username}`} target="_blank" className="flex items-center gap-1 text-primary hover:underline">
                                                        @{u.profile.username} <ExternalLink className="w-3 h-3" />
                                                    </Link>
                                                ) : (
                                                    <span className="opacity-20 italic">Profil Yok</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-2 py-1 rounded text-[10px] font-bold uppercase",
                                                    u.subscription?.plan === 'pro' ? 'bg-purple-500/10 text-purple-400' : 'bg-white/5 text-white/40'
                                                )}>
                                                    {u.subscription?.plan || 'free'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 opacity-40">
                                                {u.id.substring(0, 8)}...
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "payments" && (
                    <div className="glass rounded-[2rem] border-white/5 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                <tr>
                                    <th className="px-6 py-4">Kullanıcı</th>
                                    <th className="px-6 py-4">İşlem ID</th>
                                    <th className="px-6 py-4">Tutar</th>
                                    <th className="px-6 py-4">Tarih</th>
                                    <th className="px-6 py-4">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {payments.map((p: any) => (
                                    <tr key={p.id} className="text-xs">
                                        <td className="px-6 py-4">{p.user?.email}</td>
                                        <td className="px-6 py-4 font-mono opacity-40">{p.id}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-400">₺{p.amount}</td>
                                        <td className="px-6 py-4 opacity-40">{new Date(p.createdAt).toLocaleString('tr-TR')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${p.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {payments.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center opacity-20 italic">Henüz hiç işlem kaydı yok.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}

function AdminNavItem({ icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/40 hover:bg-white/5 hover:text-white"
            )}
        >
            {icon}
            {label}
        </button>
    )
}

function AdminStatCard({ icon, label, value, color }: any) {
    return (
        <div className="glass p-6 rounded-3xl border-white/5 bg-white/5">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 bg-white/5 rounded-xl ${color}`}>
                    {icon}
                </div>
            </div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black">{value}</p>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}
