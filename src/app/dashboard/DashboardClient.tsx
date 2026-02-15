"use client"

import { useRouter, useSearchParams } from "next/navigation"
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
    Download,
    Palette,
    X,
    Upload,
    LogOut,
    Clock
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"
import { QRCodeCard } from "@/components/QRCodeCard"

export default function DashboardClient({ session, profile, subscription, appointments, products, stats }: any) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showToast, setShowToast] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("edit")
    const [profileData, setProfileData] = useState(profile)
    const [isSaving, setIsSaving] = useState(false)
    const [showProductModal, setShowProductModal] = useState(false)
    const [productList, setProductList] = useState(products || [])
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        link: "",
        image: ""
    })
    const [isProductSaving, setIsProductSaving] = useState(false)

    // Services Management
    const [showServiceModal, setShowServiceModal] = useState(false)
    const [serviceList, setServiceList] = useState(profile?.services || [])
    const [newService, setNewService] = useState({
        title: "",
        description: ""
    })

    // Working Hours Management
    const defaultHours = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
    const [workingHours, setWorkingHours] = useState<string[]>(profile?.workingHours || defaultHours)
    const [newHour, setNewHour] = useState("")

    const handleSave = async (updatedServices?: any) => {
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
                    themeColor: profileData.themeColor,
                    templateId: profileData.templateId,
                    services: updatedServices || serviceList,
                    workingHours
                })
            })
            if (res.ok) {
                setShowToast("Değişiklikler kaydedildi!")
                setTimeout(() => setShowToast(null), 3000)
                router.refresh()
            } else {
                const err = await res.json().catch(() => ({}))
                console.error("Save error:", err)
                setShowToast("Kaydetme başarısız! Lütfen tekrar deneyin.")
                setTimeout(() => setShowToast(null), 4000)
            }
        } catch (err) {
            console.error(err)
            setShowToast("Bağlantı hatası!")
            setTimeout(() => setShowToast(null), 4000)
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddService = () => {
        const newList = [...serviceList, newService]
        setServiceList(newList)
        setShowServiceModal(false)
        setNewService({ title: "", description: "" })
        handleSave(newList) // Automatically save profile with new service
    }

    const handleDeleteService = (index: number) => {
        const newList = serviceList.filter((_: any, i: number) => i !== index)
        setServiceList(newList)
        handleSave(newList) // Automatically save profile after delete
    }

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProductSaving(true)
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            })
            if (res.ok) {
                const added = await res.json()
                setProductList([added, ...productList])
                setShowProductModal(false)
                setNewProduct({ name: "", description: "", price: "", link: "", image: "" })
                setShowToast("Ürün eklendi!")
                setTimeout(() => setShowToast(null), 3000)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsProductSaving(false)
        }
    }

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return
        try {
            const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setProductList(productList.filter((p: any) => p.id !== id))
                setShowToast("Ürün silindi!")
                setTimeout(() => setShowToast(null), 3000)
            }
        } catch (err) {
            console.error(err)
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
            setTimeout(() => {
                setShowToast(null)
                router.replace("/dashboard")
            }, 5000)
        } else if (payment === "failed") {
            setShowToast("failed")
            setTimeout(() => {
                setShowToast(null)
                router.replace("/dashboard")
            }, 5000)
        }
    }, [searchParams, router])

    const currentPlan = subscription?.plan || "free"

    return (
        <div className="min-h-screen bg-background flex">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${showToast === "success" ? "bg-emerald-500 border-emerald-400 text-white" :
                        showToast === "failed" ? "bg-rose-500 border-rose-400 text-white" : "bg-primary border-primary/20 text-white"
                        }`}>
                        {showToast === "success" ? <CheckCircle2 /> : <XCircle />}
                        <span className="font-bold">
                            {showToast === "success" ? "Ödeme Başarılı! Planınız güncellendi." :
                                showToast === "failed" ? "Ödeme Başarısız. Lütfen tekrar deneyin." : showToast}
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
                        icon={<Layout className="w-5 h-5" />}
                        label="Hizmetler"
                        active={activeTab === "services"}
                        onClick={() => setActiveTab("services")}
                    />
                    <NavItem
                        icon={<Palette className="w-5 h-5" />}
                        label="Şablonlar"
                        active={activeTab === "templates"}
                        onClick={() => setActiveTab("templates")}
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
                    <div className="mt-auto pt-4 border-t border-white/5 uppercase tracking-widest">
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-rose-500 hover:bg-rose-500/10 transition-all text-xs"
                        >
                            <LogOut className="w-4 h-4" /> Çıkış Yap
                        </button>
                    </div>
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
                            <button
                                onClick={() => setShowProductModal(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                            >
                                <Plus className="w-5 h-5" /> Yeni Ürün Ekle
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {productList.map((product: any) => (
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
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="p-2 bg-rose-500/20 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
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

                            {productList.length === 0 && (
                                <div className="col-span-full py-20 text-center glass rounded-[2.5rem] border-white/5">
                                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-white/10" />
                                    <p className="text-lg font-bold">Henüz Ürün Eklememişsin</p>
                                    <p className="text-sm text-foreground/40 mt-2">İlk ürününü ekleyerek satış yapmaya veya hizmetlerini tanıtmaya başla.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === "services" ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Hizmetler</h2>
                                <p className="text-sm text-foreground/50">Profilinizde liste halinde görünecek ana hizmetleriniz.</p>
                            </div>
                            <button
                                onClick={() => setShowServiceModal(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                            >
                                <Plus className="w-5 h-5" /> Yeni Hizmet Ekle
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {serviceList.map((service: any, index: number) => (
                                <div key={index} className="glass p-8 rounded-[2rem] border-white/5 flex justify-between items-center group hover:border-white/20 transition-all">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">{service.title}</h3>
                                        <p className="text-sm text-foreground/50">{service.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteService(index)}
                                        className="flex items-center gap-2 p-3 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}

                            {serviceList.length === 0 && (
                                <div className="py-20 text-center glass rounded-[2.5rem] border-white/5">
                                    <Layout className="w-16 h-16 mx-auto mb-4 text-white/10" />
                                    <p className="text-lg font-bold">Henüz Hizmet Eklememişsin</p>
                                    <p className="text-sm text-foreground/40 mt-2">Neler yaptığını anlatmak için hizmetlerini ekle.</p>
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

                            {/* Working Hours */}
                            <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-emerald-400" /> Çalışma Saatleri
                                </h3>
                                <p className="text-xs text-foreground/40">Randevu alınabilecek saat dilimlerini buradan yönetin. Müşterileriniz sadece bu saatleri görecektir.</p>

                                <div className="flex flex-wrap gap-2">
                                    {workingHours.sort().map((hour: string) => (
                                        <div key={hour} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl group hover:border-rose-500/30 transition-all">
                                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-sm font-bold">{hour}</span>
                                            <button
                                                onClick={() => {
                                                    const updated = workingHours.filter((h: string) => h !== hour)
                                                    setWorkingHours(updated)
                                                }}
                                                className="text-white/20 hover:text-rose-500 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    {workingHours.length === 0 && (
                                        <p className="text-sm text-white/20 italic">Henüz saat eklenmemiş.</p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="time"
                                        value={newHour}
                                        onChange={(e) => setNewHour(e.target.value)}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white text-sm"
                                    />
                                    <button
                                        onClick={() => {
                                            if (newHour && !workingHours.includes(newHour)) {
                                                setWorkingHours([...workingHours, newHour])
                                                setNewHour("")
                                            }
                                        }}
                                        className="px-5 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:scale-[1.02] transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleSave}
                                    className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-sm font-bold hover:bg-emerald-500/20 transition-all"
                                >
                                    Saatleri Kaydet
                                </button>
                            </div>
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
                ) : activeTab === "templates" ? (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Tasarım Şablonları</h2>
                                <p className="text-sm text-foreground/50">Sayfanızın görünümünü değiştirmek için farklı şablonlar seçin.</p>
                            </div>
                            {currentPlan === "free" && (
                                <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold border border-primary/20">
                                    Pro sürümde tüm şablonlar açılır
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { id: "modern", name: "Modern Animated", description: "Hareketli arka plan ve akışkan tasarım.", image: "/templates/modern.jpg", premium: false },
                                { id: "bento", name: "Bento AI Grid", description: "Gelişmiş bento tasarımı ve akıllı widgetlar.", image: "/templates/bento.jpg", premium: true },
                                { id: "minimal_ios", name: "Minimal iOS", description: "Apple tarzı sade ve temiz görünüm.", image: "/templates/minimal.jpg", premium: true },
                                { id: "luxury", name: "Luxury Dark", description: "Vurgulu altın sarısı ve gece siyahı.", image: "/templates/luxury.jpg", premium: true },
                                { id: "creative", name: "Creative Glass", description: "Fütüristik cam efekti ve canlı renkler.", image: "/templates/creative.jpg", premium: true },
                                { id: "business", name: "Corporate Blue", description: "Profesyonel ve güven veren iş tasarımı.", image: "/templates/business.jpg", premium: true },
                            ].map((tpl) => (
                                <motion.div
                                    key={tpl.id}
                                    whileHover={{ y: -5 }}
                                    className={cn(
                                        "glass rounded-3xl border border-white/5 overflow-hidden group cursor-pointer transition-all",
                                        profileData.templateId === tpl.id ? "ring-2 ring-primary border-primary/50" : "hover:border-white/20"
                                    )}
                                    onClick={() => {
                                        if (tpl.premium && currentPlan === "free") {
                                            setShowToast("Bu şablon için Pro üyelik gerekiyor!");
                                            setTimeout(() => setShowToast(null), 3000);
                                            return;
                                        }
                                        setProfileData({ ...profileData, templateId: tpl.id });
                                        handleSave();
                                    }}
                                >
                                    <div className="aspect-[4/5] bg-white/5 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />

                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/0">
                                            {tpl.id === 'bento' ? <Layout className="w-12 h-12 text-primary/40" /> : <Smartphone className="w-12 h-12 text-white/20" />}
                                        </div>

                                        {tpl.premium && (
                                            <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest z-20">PRO</div>
                                        )}
                                        {profileData.templateId === tpl.id && (
                                            <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1 rounded-full z-20 shadow-lg">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-6 left-6 right-6 z-20">
                                            <h3 className="font-bold text-lg mb-1">{tpl.name}</h3>
                                            <p className="text-xs opacity-70 leading-relaxed">{tpl.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : null}

                {/* Product Add Modal */}
                {showProductModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-[#f8fafc] w-full max-w-md rounded-2xl p-6 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-5">
                                <h2 className="text-xl font-bold text-gray-900">Yeni Ürün/Hizmet</h2>
                                <p className="text-gray-400 text-sm mt-1">Ürün bilgilerini girin ve görseli yükleyin.</p>
                            </div>

                            <form onSubmit={handleAddProduct} className="space-y-4">
                                {/* Image Upload Area */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ürün Görseli</label>
                                    <div
                                        className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden transition-all hover:border-primary/50 cursor-pointer group"
                                        onClick={() => document.getElementById('product-image-upload')?.click()}
                                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary', 'bg-primary/5'); }}
                                        onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); }}
                                        onDrop={async (e) => {
                                            e.preventDefault();
                                            e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                                            const file = e.dataTransfer.files?.[0];
                                            if (!file) return;
                                            const formDataUpload = new FormData();
                                            formDataUpload.append('file', file);
                                            try {
                                                const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
                                                const data = await res.json();
                                                if (data.url) setNewProduct({ ...newProduct, image: data.url });
                                                else { setShowToast(data.error || 'Yükleme başarısız'); setTimeout(() => setShowToast(null), 3000); }
                                            } catch { setShowToast('Yükleme hatası'); setTimeout(() => setShowToast(null), 3000); }
                                        }}
                                    >
                                        {newProduct.image ? (
                                            <div className="relative aspect-video">
                                                <img src={newProduct.image} alt="Ürün" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-sm font-bold">Değiştir</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setNewProduct({ ...newProduct, image: '' }); }}
                                                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="py-8 flex flex-col items-center gap-2 text-gray-400 group-hover:text-primary transition-colors">
                                                <Upload className="w-8 h-8" />
                                                <span className="text-sm font-medium">Görseli sürükle veya tıkla</span>
                                                <span className="text-[11px] text-gray-300">JPG, PNG, WebP • Maks 5MB</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        id="product-image-upload"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const formDataUpload = new FormData();
                                            formDataUpload.append('file', file);
                                            try {
                                                const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
                                                const data = await res.json();
                                                if (data.url) setNewProduct({ ...newProduct, image: data.url });
                                                else { setShowToast(data.error || 'Yükleme başarısız'); setTimeout(() => setShowToast(null), 3000); }
                                            } catch { setShowToast('Yükleme hatası'); setTimeout(() => setShowToast(null), 3000); }
                                            e.target.value = '';
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ürün Adı</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Örn: Özel Danışmanlık Seansı"
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-900 placeholder:text-gray-300 transition-all text-sm font-medium"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Fiyat (₺)</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="0.00"
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-900 placeholder:text-gray-300 transition-all text-sm font-medium"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Link</label>
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-900 placeholder:text-gray-300 transition-all text-sm font-medium"
                                            value={newProduct.link}
                                            onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Açıklama</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Ürününüz hakkında kısa bir açıklama yazın..."
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-900 placeholder:text-gray-300 transition-all text-sm font-medium resize-none"
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    />
                                </div>

                                <button
                                    disabled={isProductSaving}
                                    className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                                >
                                    {isProductSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        "Ürünü Yayınla"
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Service Add Modal */}
                {showServiceModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowServiceModal(false)} />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 relative z-10 shadow-2xl"
                        >
                            <button onClick={() => setShowServiceModal(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>

                            <div className="mb-8">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                                    <Layout className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-black text-white">Yeni Hizmet</h2>
                                <p className="text-white/40 text-sm mt-1">Neler sunduğunuzu kısaca özetleyin.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Hizmet Başlığı</label>
                                    <input
                                        type="text"
                                        placeholder="Örn: Profesyonel Fotoğraf Çekimi"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-white/20 transition-all font-medium"
                                        value={newService.title}
                                        onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Açıklama</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Hizmetiniz hakkında kısa bir bilgi..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-white/20 transition-all font-medium resize-none"
                                        value={newService.description}
                                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={handleAddService}
                                        className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        Hizmeti Ekle
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
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
