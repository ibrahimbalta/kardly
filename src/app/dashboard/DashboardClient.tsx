"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
    Layout,
    Settings,
    BarChart3,
    Calendar,
    CreditCard,
    QrCode,
    ExternalLink,
    Eye,
    MousePointer2,
    Users,
    CheckCircle2,
    XCircle,
    ShoppingBag,
    Plus,
    Trash2,
    Instagram,
    Twitter,
    Linkedin,
    Github,
    Link as LinkIcon,
    Smartphone,
    Download
} from "lucide-react"
import Link from "next/link"
import { QRCodeCard } from "@/components/QRCodeCard"

export default function DashboardClient({ session, profile, subscription, appointments, products, stats }: any) {
    const searchParams = useSearchParams()
    const [showToast, setShowToast] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("edit")
    const [profileData, setProfileData] = useState(profile)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slogan: profileData.slogan,
                    bio: profileData.bio,
                    phone: profileData.phone,
                    socialLinks: profileData.socialLinks,
                    themeColor: profileData.themeColor
                })
            })
            if (res.ok) {
                setShowToast("Değişiklikler kaydedildi!")
                setTimeout(() => setShowToast(null), 3000)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsSaving(false)
        }
    }

    const updateSocialLink = (platform: string, url: string) => {
        const currentLinks = Array.isArray(profileData.socialLinks) ? [...profileData.socialLinks] : []
        const index = currentLinks.findIndex((l: any) => l.platform === platform)

        if (index > -1) {
            currentLinks[index] = { platform, url }
        } else {
            currentLinks.push({ platform, url })
        }

        setProfileData({ ...profileData, socialLinks: currentLinks })
    }

    const getSocialUrl = (platform: string) => {
        return (profileData.socialLinks as any[])?.find((l: any) => l.platform === platform)?.url || ""
    }

    useEffect(() => {
        const payment = searchParams.get("payment")
        if (payment === "success") {
            setShowToast("success")
            setTimeout(() => setShowToast(null), 5000)
        } else if (payment === "failed") {
            setShowToast("failed")
            setTimeout(() => setShowToast(null), 5000)
        }
    }, [searchParams])

    const currentPlan = subscription?.plan || "free"

    return (
        <div className="min-h-screen bg-background flex">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${showToast === "success" ? "bg-emerald-500 border-emerald-400 text-white" : "bg-rose-500 border-rose-400 text-white"
                        }`}>
                        {showToast === "success" ? <CheckCircle2 /> : <XCircle />}
                        <span className="font-bold">
                            {showToast === "success" ? "Ödeme Başarılı! Planınız güncellendi." : "Ödeme Başarısız. Lütfen tekrar deneyin."}
                        </span>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 p-6 flex flex-col gap-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Layout className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold">Kardly<span className="text-primary">.</span></span>
                </Link>

                {/* Plan Badge */}
                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Mevcut Plan</p>
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-primary capitalize">{currentPlan}</span>
                        {currentPlan === "free" && (
                            <Link href="/dashboard/upgrade" className="text-[10px] bg-white text-black px-2 py-0.5 rounded-md font-bold hover:scale-105 transition-transform">YÜKSELT</Link>
                        )}
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    <NavItem
                        icon={<Layout className="w-5 h-5" />}
                        label="Sayfa Düzenle"
                        active={activeTab === "edit"}
                        onClick={() => setActiveTab("edit")}
                    />
                    <NavItem
                        icon={<ShoppingBag className="w-5 h-5" />}
                        label="Ürünler"
                        active={activeTab === "products"}
                        onClick={() => setActiveTab("products")}
                    />
                    <NavItem
                        icon={<Calendar className="w-5 h-5" />}
                        label="Randevular"
                        active={activeTab === "appointments"}
                        onClick={() => setActiveTab("appointments")}
                    />
                    <NavItem
                        icon={<BarChart3 className="w-5 h-5" />}
                        label="İstatistikler"
                        active={activeTab === "statistics"}
                        onClick={() => setActiveTab("statistics")}
                    />
                    <NavItem
                        icon={<QrCode className="w-5 h-5" />}
                        label="QR Kod"
                        active={activeTab === "qrcode"}
                        onClick={() => setActiveTab("qrcode")}
                    />
                    <hr className="border-white/5 my-2" />
                    <NavItem
                        icon={<CreditCard className="w-5 h-5" />}
                        label="Abonelik"
                        active={activeTab === "subscription"}
                        onClick={() => setActiveTab("subscription")}
                    />
                    <NavItem
                        icon={<Settings className="w-5 h-5" />}
                        label="Ayarlar"
                        active={activeTab === "settings"}
                        onClick={() => setActiveTab("settings")}
                    />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-bold">Hoş geldin, {session?.user?.name} 👋</h1>
                        <p className="text-foreground/50">Dijital kartvizitini buradan yönetebilirsin.</p>
                    </div>
                    {profile && (
                        <a
                            href={`/${profile.username}`}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all font-medium text-sm"
                        >
                            Canlı Siteni Gör <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </header>

                {activeTab === "edit" ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            <StatCard icon={<Eye />} label="Toplam Görüntülenme" value={stats?.totalViews?.toString() || "0"} trend="+0%" />
                            <StatCard icon={<MousePointer2 />} label="Tıklama Oranı" value={stats?.clickRate || "0%"} trend="+0%" />
                            <StatCard icon={<Users />} label="Rehbere Ekleyenler" value={stats?.vCardClicks?.toString() || "0"} trend="+0%" />

                            <div className="glass p-6 rounded-3xl border-white/5 flex flex-col items-center justify-center">
                                <QRCodeCard username={profile?.username || "demo"} />
                            </div>
                        </div>

                        {/* Editor Preview Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Simple Editor Controls */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold">Hızlı Düzenleme</h3>
                                <div className="glass p-8 rounded-3xl space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 opacity-60">Slogan</label>
                                        <input
                                            type="text"
                                            value={profileData?.slogan || ""}
                                            onChange={(e) => setProfileData({ ...profileData, slogan: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 opacity-60">Telefon</label>
                                        <input
                                            type="text"
                                            value={profileData?.phone || ""}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            placeholder="+90 5xx xxx xx xx"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 opacity-60">Bio</label>
                                        <textarea
                                            rows={3}
                                            value={profileData?.bio || ""}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-white/5">
                                        <label className="block text-sm font-medium mb-4 opacity-60">Sosyal Medya Linkleri</label>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-rose-400">
                                                    <Instagram className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Instagram URL"
                                                    value={getSocialUrl("instagram")}
                                                    onChange={(e) => updateSocialLink("instagram", e.target.value)}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-sky-400">
                                                    <Twitter className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Twitter URL"
                                                    value={getSocialUrl("twitter")}
                                                    onChange={(e) => updateSocialLink("twitter", e.target.value)}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-blue-500">
                                                    <Linkedin className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="LinkedIn URL"
                                                    value={getSocialUrl("linkedin")}
                                                    onChange={(e) => updateSocialLink("linkedin", e.target.value)}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-6 py-2 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform disabled:opacity-50"
                                    >
                                        {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                                    </button>
                                </div>
                            </div>

                            {/* Preview Mockup */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative glass rounded-[3rem] p-4 border-white/10 shadow-2xl h-[600px] overflow-hidden">
                                    <div className="w-full h-full bg-[#020617] rounded-[2.5rem] overflow-hidden flex flex-col p-8 pointer-events-none">
                                        <div className="w-20 h-20 bg-primary/20 rounded-[1.5rem] mx-auto mb-6 flex items-center justify-center overflow-hidden">
                                            {session?.user?.image ? (
                                                <img src={session.user.image} className="w-full h-full object-cover" />
                                            ) : (
                                                <Layout className="text-primary w-8 h-8" />
                                            )}
                                        </div>
                                        <div className="text-center mb-6">
                                            <div className="h-4 w-32 bg-white/20 rounded-full mx-auto mb-2" />
                                            <p className="text-[10px] text-white/40 font-bold uppercase truncate">{profileData?.occupation || "Meslek"}</p>
                                        </div>
                                        <div className="text-center mb-8">
                                            <p className="text-[8px] text-white/60 italic line-clamp-2">"{profileData?.slogan || "Sloganınız..."}"</p>
                                        </div>

                                        {/* Mockup Social Icons */}
                                        <div className="flex justify-center gap-2 mb-8">
                                            {(profileData.socialLinks as any[])?.filter(l => l.url)?.map((link: any) => (
                                                <div key={link.platform} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                                    {link.platform === "instagram" && <Instagram className="w-4 h-4 text-rose-400" />}
                                                    {link.platform === "twitter" && <Twitter className="w-4 h-4 text-sky-400" />}
                                                    {link.platform === "linkedin" && <Linkedin className="w-4 h-4 text-blue-500" />}
                                                </div>
                                            ))}
                                            {(!profileData.socialLinks || profileData.socialLinks.length === 0) && (
                                                <div className="flex gap-2">
                                                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-white/5 border border-white/5" />)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-14 bg-white/5 rounded-2xl border border-white/10" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-[3rem]">
                                        <p className="font-bold text-lg">Önizleme</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : activeTab === "products" ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Ürünler ve Hizmetler</h2>
                                <p className="text-sm text-foreground/50">Burada listelediğiniz ürünler profilinizde şık birer kart olarak görünecektir.</p>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                                <Plus className="w-5 h-5" /> Yeni Ürün Ekle
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product: any) => (
                                <div key={product.id} className="glass rounded-[2rem] border-white/5 overflow-hidden group">
                                    <div className="aspect-video bg-white/5 relative">
                                        {product.image ? (
                                            <img src={product.image} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-10 h-10 text-white/10" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <button className="p-2 bg-rose-500/20 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold">{product.name}</h3>
                                            <span className="font-black text-primary">₺{product.price}</span>
                                        </div>
                                        <p className="text-sm text-foreground/50 mb-4 line-clamp-2">{product.description}</p>
                                        <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">Düzenle</button>
                                    </div>
                                </div>
                            ))}

                            {products.length === 0 && (
                                <div className="col-span-full py-20 text-center glass rounded-[2.5rem] border-white/5">
                                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-white/10" />
                                    <p className="text-lg font-bold">Henüz Ürün Eklememişsin</p>
                                    <p className="text-sm text-foreground/40 mt-2">İlk ürününü ekleyerek satış yapmaya veya hizmetlerini tanıtmaya başla.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === "appointments" ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Randevu Talepleri</h2>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white/40">Tümü</span>
                                <span className="px-3 py-1 bg-primary/20 border border-primary/20 rounded-full text-xs font-bold text-primary">Bekleyen</span>
                            </div>
                        </div>

                        <div className="glass rounded-[2rem] border-white/5 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Müşteri</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Tarih / Saat</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Durum</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {appointments.map((appointment: any) => (
                                        <tr key={appointment.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold">{appointment.clientName}</div>
                                                <div className="text-xs text-white/40">{appointment.clientEmail}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{new Date(appointment.date).toLocaleDateString('tr-TR')}</div>
                                                <div className="text-xs text-white/40">{new Date(appointment.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${appointment.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                                                    }`}>
                                                    {appointment.status === 'pending' ? 'Bekliyor' : 'Onaylandı'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-xs font-bold text-primary hover:text-white transition-colors">Yönet</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {appointments.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-white/20">
                                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                                <p className="font-bold uppercase tracking-widest text-xs">Henüz randevu talebi yok</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : activeTab === "qrcode" ? (
                    <div className="space-y-8 max-w-2xl mx-auto text-center py-12">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold mb-2">Dijital Kartvizit QR Kodunuz</h2>
                            <p className="text-foreground/50">Bu kodu fiziksel kartvizitinize basabilir veya telefonunuzdan hızlıca okutabilirsiniz.</p>
                        </div>

                        <div className="glass p-12 rounded-[3rem] border-white/5 inline-block mx-auto relative group">
                            <div className="absolute inset-0 bg-primary/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <QRCodeCard username={profile?.username || "demo"} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                            <div className="glass p-6 rounded-3xl border-white/5 text-left flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                    <Smartphone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold">Hızlı Erişim</p>
                                    <p className="text-xs text-foreground/40">Kameranızla okutun</p>
                                </div>
                            </div>
                            <div className="glass p-6 rounded-3xl border-white/5 text-left flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                    <Download className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="font-bold">Yüksek Çözünürlük</p>
                                    <p className="text-xs text-foreground/40">Baskı için PNG formatı</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : activeTab === "settings" ? (
                    <div className="max-w-4xl space-y-8">
                        <div>
                            <h2 className="text-xl font-bold">Hesap Ayarları</h2>
                            <p className="text-sm text-foreground/50">Profilinizin genel ayarlarını ve görünüm tercihlerini yönetin.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-indigo-400" /> Görünüm Ayarları
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium mb-4 opacity-60">Profil Tema Rengi</label>
                                    <div className="flex gap-3">
                                        {["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#a855f7"].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setProfileData({ ...profileData, themeColor: color })}
                                                className={`w-10 h-10 rounded-full border-2 transition-all ${profileData.themeColor === color ? "border-white scale-110 shadow-lg" : "border-transparent"
                                                    }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all"
                                >
                                    Ayarları Kaydet
                                </button>
                            </div>

                            <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                                <h3 className="font-bold flex items-center gap-2 text-rose-500">
                                    <Trash2 className="w-5 h-5" /> Tehlikeli Bölge
                                </h3>
                                <p className="text-xs text-foreground/40">Profilinizi silmek tüm verilerinizi, ürünlerinizi ve randevu geçmişinizi kalıcı olarak kaldıracaktır.</p>
                                <button className="w-full py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-sm font-bold hover:bg-rose-500/20 transition-all">
                                    Profili Tamamen Sil
                                </button>
                            </div>
                        </div>
                    </div>
                ) : activeTab === "subscription" ? (
                    <div className="max-w-4xl space-y-8">
                        <div>
                            <h2 className="text-xl font-bold">Abonelik Yönetimi</h2>
                            <p className="text-sm text-foreground/50">Mevcut planınızı görüntüleyin ve özelliklerinizi yükseltin.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Free Plan */}
                            <div className={`glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden ${currentPlan === "free" ? "ring-2 ring-primary" : "opacity-60"}`}>
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg">Başlangıç</h3>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-3xl font-black">₺0</span>
                                        <span className="text-xs opacity-40">/aylık</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 mb-8 text-sm">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Temel Profil</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> QR Kod</li>
                                    <li className="flex items-center gap-2 text-white/20"><XCircle className="w-4 h-4" /> Özel Ürünler</li>
                                    <li className="flex items-center gap-2 text-white/20"><XCircle className="w-4 h-4" /> Randevu Sistemi</li>
                                </ul>
                                {currentPlan === "free" ? (
                                    <div className="w-full py-3 bg-white/10 rounded-xl text-center text-xs font-bold">Mevcut Plan</div>
                                ) : (
                                    <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10">Seç</button>
                                )}
                            </div>

                            {/* Pro Plan */}
                            <div className={`glass p-8 rounded-[2.5rem] border-primary/20 bg-primary/5 relative overflow-hidden ${currentPlan === "pro" ? "ring-2 ring-primary" : ""}`}>
                                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">Popüler</div>
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg">Pro</h3>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-3xl font-black">₺99</span>
                                        <span className="text-xs opacity-40">/aylık</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 mb-8 text-sm">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sınırsız Ürün</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Randevu Yönetimi</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Analitik Raporlar</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Beyaz Etiket (No Logo)</li>
                                </ul>
                                {currentPlan === "pro" ? (
                                    <div className="w-full py-3 bg-primary/20 rounded-xl text-center text-xs font-bold text-primary">Mevcut Plan</div>
                                ) : (
                                    <Link href="/dashboard/upgrade" className="block w-full py-4 bg-primary text-white rounded-2xl text-center text-xs font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Şimdi Yükselt</Link>
                                )}
                            </div>

                            {/* Business Plan */}
                            <div className={`glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden ${currentPlan === "business" ? "ring-2 ring-primary" : "opacity-60"}`}>
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg">Business</h3>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-3xl font-black">₺249</span>
                                        <span className="text-xs opacity-40">/aylık</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 mb-8 text-sm">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Çoklu Profil</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Özel Alan Adı</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> CRM Entegrasyonu</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Öncelikli Destek</li>
                                </ul>
                                <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10" disabled>Çok Yakında</button>
                            </div>
                        </div>

                        <div className="glass p-8 rounded-[2.5rem] border-white/5">
                            <h3 className="font-bold mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-indigo-400" /> Fatura Geçmişi
                            </h3>
                            <div className="text-center py-10 opacity-40 italic text-sm">
                                Henüz bir fatura bulunmamaktadır.
                            </div>
                        </div>
                    </div>
                ) : activeTab === "statistics" ? (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Detaylı İstatistikler</h2>
                                <p className="text-sm text-foreground/50">Sayfanızın performansını ve ziyaretçi etkileşimlerini takip edin.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass p-8 rounded-[2.5rem] border-white/5 h-fit">
                                <h3 className="font-bold mb-6 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-indigo-400" /> Tıklama Dağılımı
                                </h3>
                                <div className="space-y-6">
                                    <StatBar
                                        label="vCard İndirme"
                                        count={stats.vCardClicks}
                                        total={stats.totalViews}
                                        color="bg-indigo-500"
                                    />
                                    <StatBar
                                        label="WhatsApp"
                                        count={stats.recentAnalytics.filter((a: any) => a.type === 'click_whatsapp').length}
                                        total={stats.totalViews}
                                        color="bg-emerald-500"
                                    />
                                    <StatBar
                                        label="Telefon"
                                        count={stats.recentAnalytics.filter((a: any) => a.type === 'click_phone').length}
                                        total={stats.totalViews}
                                        color="bg-blue-500"
                                    />
                                    <StatBar
                                        label="Ürünler"
                                        count={stats.recentAnalytics.filter((a: any) => a.type === 'click_product').length}
                                        total={stats.totalViews}
                                        color="bg-rose-500"
                                    />
                                </div>
                            </div>

                            <div className="glass p-8 rounded-[2.5rem] border-white/5">
                                <h3 className="font-bold mb-6 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-indigo-400" /> Son Aktiviteler
                                </h3>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                                    {stats.recentAnalytics.map((event: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-3 rounded-2xl transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${event.type === 'view' ? 'bg-white/5 text-white/40' :
                                                    event.type === 'click_vcard' ? 'bg-indigo-500/10 text-indigo-400' :
                                                        'bg-primary/10 text-primary'
                                                    }`}>
                                                    {event.type === 'view' ? <Eye className="w-4 h-4" /> : <MousePointer2 className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold capitalize">{event.type.replace('click_', '').replace('_', ' ')}</p>
                                                    <p className="text-[10px] text-white/40">{new Date(event.createdAt).toLocaleString('tr-TR')}</p>
                                                </div>
                                            </div>
                                            {event.value && <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md max-w-[120px] truncate border border-white/5">{event.value}</span>}
                                        </div>
                                    ))}
                                    {stats.recentAnalytics.length === 0 && (
                                        <div className="text-center py-20 opacity-40">Henüz aktivite yok.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </main>
        </div>
    )
}

function StatBar({ label, count, total, color }: any) {
    const percentage = total > 0 ? (count / total * 100).toFixed(0) : 0
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
                <span className="opacity-60">{label}</span>
                <span>{count} ({percentage}%)</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    )
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm",
                active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-foreground/50 hover:bg-white/5 hover:text-foreground"
            )}
        >
            {icon}
            {label}
        </button>
    )
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
    return (
        <div className="glass p-6 rounded-3xl border-white/5">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {icon}
                </div>
                <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-md">
                    {trend}
                </span>
            </div>
            <p className="text-sm text-foreground/50 font-medium mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}
