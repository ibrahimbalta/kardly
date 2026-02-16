"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
    Layout,
    Settings,
    BarChart3,
    Calendar,
    QrCode,
    ExternalLink,
    Eye,
    MousePointer2,
    Users,
    CheckCircle2,
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
    Clock,
    Zap,
    Activity,
    Layers,
    Monitor,
    Image,
    MessageSquare,
    Map,
    FileText,
    Share2,
    Code,
    List,
    Sparkles,
    Shield,
    MapPin,
    ArrowRight,
    Award,
    Briefcase

} from "lucide-react"

// Modül Tanımları
const AVAILABLE_MODULES = [
    { type: 'skill_radar', name: 'Yetenek Radarı', icon: <Activity className="w-5 h-5" />, color: 'text-indigo-400', description: 'Teknik yetkinliklerinizi radar grafiğiyle sergileyin.' },
    { type: 'portfolio_gallery', name: 'Profesyonel Galeri', icon: <Image className="w-5 h-5" />, color: 'text-rose-400', description: 'En iyi çalışmalarınızı kaydırılabilir galeriyle sunun.' },
    { type: 'appointment_calendar', name: 'Danışmanlık Randevusu', icon: <Calendar className="w-5 h-5" />, color: 'text-sky-400', description: 'Müşterilerinizle görüşmek için randevu sistemi.' },
    { type: 'timeline_process', name: 'Deneyim Çizelgesi', icon: <Clock className="w-5 h-5" />, color: 'text-amber-400', description: 'Kariyer ve iş süreçlerinizi aşama aşama gösterin.' },
    { type: 'trust_score', name: 'Referans Paneli', icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-blue-400', description: 'Başarı skorları ve profesyonel referanslar.' },
    { type: 'social_feed', name: 'LinkedIn Akışı', icon: <Linkedin className="w-5 h-5" />, color: 'text-blue-600', description: 'Sektörel paylaşımlarınızı profilinizde tutun.' },
    { type: 'document_vault', name: 'CV & Belgeler', icon: <FileText className="w-5 h-5" />, color: 'text-slate-400', description: 'Sertifika, CV veya portfolyo dosyaları paylaşın.' },
]
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"
import { QRCodeCard } from "@/components/QRCodeCard"

export default function DashboardClient({ session, profile, subscription, appointments, products, stats }: any) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showToast, setShowToast] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("overview") // overview, profile, products, services, appointments, templates, bento
    const [profileData, setProfileData] = useState({
        ...profile,
        name: profile?.user?.name || session?.user?.name || "",
        image: profile?.user?.image || session?.user?.image || ""
    })
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

    // Modül Yönetimi (Bento Store)
    const [blocks, setBlocks] = useState<any[]>(profile?.blocks || [])
    const [isBlocksLoading, setIsBlocksLoading] = useState(false)

    // Premium Template Config
    const configBlock = blocks.find(b => b.type === 'template_config')
    const [premiumConfig, setPremiumConfig] = useState(configBlock?.content || {
        videoTitle: "Video",
        videoLabel: "Tanıtım Videomu İzle",
        videoUrl: "",
        videoThumbnail: "",
        radarTitle: "Yetenek Pusulası",
        servicesTitle: "Hizmetlerim",
        portfolioTitle: "Çalışmalarım",
        contactTitle: "İletişime Geç",
        emailBtnText: "E-posta Gönder",
        consultBtnText: "Ücretsiz Danışma",
        ringColors: ["#FACC15", "#A3E635", "#22D3EE", "#D946EF"]
    })

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const res = await fetch("/api/blocks")
                if (res.ok) {
                    const data = await res.json()
                    if (data.length > 0) setBlocks(data)
                }
            } catch (err) { console.error("Blocks fetch error:", err) }
        }
        fetchBlocks()
    }, [])

    const handleSyncBlocks = async (newBlocks: any[]) => {
        setBlocks(newBlocks)
        try {
            await fetch("/api/blocks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blocks: newBlocks })
            })
        } catch (err) { console.error("Blocks sync error:", err) }
    }

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
                    workingHours,
                    occupation: profileData.occupation,
                    displayName: profileData.name || session?.user?.name,
                    image: profileData.image
                })
            })

            // Save Template Config if Premium
            if (profileData.templateId === 'premium_modern') {
                const configExists = blocks.find(b => b.type === 'template_config')
                let newBlocks;
                if (configExists) {
                    newBlocks = blocks.map(b => b.type === 'template_config' ? { ...b, content: premiumConfig } : b)
                } else {
                    newBlocks = [...blocks, { type: 'template_config', content: premiumConfig, isActive: true, order: 99 }]
                }
                setBlocks(newBlocks)
                await fetch("/api/blocks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ blocks: newBlocks })
                })
            }
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

    const currentPlan = "pro"

    return (
        <div className="min-h-screen bg-background flex">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
                    <div className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border bg-primary border-primary/20 text-white">
                        <span className="font-bold">{showToast}</span>
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



                <nav className="flex flex-col gap-2">
                    <NavItem
                        icon={<Layout className="w-5 h-5" />}
                        label="Sayfa Düzenle"
                        active={activeTab === "edit"}
                        onClick={() => setActiveTab("edit")}
                    />
                    <NavItem
                        icon={<Briefcase className="w-5 h-5" />}
                        label="Projeler & Portfolyo"
                        active={activeTab === "products"}
                        onClick={() => setActiveTab("products")}
                    />
                    <NavItem
                        icon={<Zap className="w-5 h-5" />}
                        label="Uzmanlık Alanları"
                        active={activeTab === "services"}
                        onClick={() => setActiveTab("services")}
                    />
                    <NavItem
                        icon={<Palette className="w-5 h-5" />}
                        label="Şablon Değiştir"
                        active={activeTab === "templates"}
                        onClick={() => setActiveTab("templates")}
                    />
                    <NavItem
                        icon={<Layers className="w-5 h-5" />}
                        label="Portfolyo Bileşenleri"
                        active={activeTab === "bento"}
                        onClick={() => setActiveTab("bento")}
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
                    <div className="space-y-10">
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
                                <h3 className="text-lg font-bold">Profil Bilgilerini Düzenle</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2 opacity-60">Profil Fotoğrafı URL</label>
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                                <img
                                                    src={profileData?.image || session?.user?.image || `https://ui-avatars.com/api/?name=${profileData?.name || "User"}`}
                                                    className="w-full h-full object-cover"
                                                    alt="Preview"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={profileData?.image || ""}
                                                onChange={(e) => setProfileData({ ...profileData, image: e.target.value })}
                                                placeholder="Resim linkini buraya yapıştırın (Örn: https://...)"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm h-fit"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2 opacity-60">Görünen İsim (Kartvizit Üzerinde)</label>
                                        <input
                                            type="text"
                                            value={profileData?.name || session?.user?.name || ""}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            placeholder="Örn: İbrahim Balta"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 opacity-60">Meslek / Unvan</label>
                                        <input
                                            type="text"
                                            value={profileData?.occupation || ""}
                                            onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                                            placeholder="Örn: Kıdemli Yazılım Mimarı"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 opacity-60">Lokasyon / Şehir</label>
                                        <input
                                            type="text"
                                            value={profileData?.phone || ""}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            placeholder="Örn: İstanbul, Türkiye"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 opacity-60">Kısa Tanıtım / Kişisel Motto</label>
                                    <input
                                        type="text"
                                        value={profileData?.slogan || ""}
                                        onChange={(e) => setProfileData({ ...profileData, slogan: e.target.value })}
                                        placeholder="Örn: Geleceği kodluyor, dijital deneyimler inşa ediyorum."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 opacity-60">Hakkımda / Kariyer Özeti</label>
                                    <textarea
                                        rows={3}
                                        value={profileData?.bio || ""}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        placeholder="Profesyonel geçmişiniz, yetkinlikleriniz ve hedeflerinizden bahsedin..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <label className="block text-sm font-medium mb-4 opacity-60">Sosyal Medya Bağlantıları</label>
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

                                    <button
                                        onClick={() => setShowToast("AI Stil Sihirbazı yakında aktif olacak!")}
                                        className="w-full py-4 mt-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right transition-all text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 animate-gradient shadow-xl"
                                    >
                                        <Sparkles size={18} /> AI STİL SİHİRBAZINI BAŞLAT
                                    </button>
                                </div>

                                <div className="pt-6">
                                    <button
                                        onClick={() => handleSave()}
                                        disabled={isSaving}
                                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-[1.2rem] font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" /> DEĞİŞİKLİKLERİ YAYINLA
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            {/* Preview Mockup */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative glass rounded-[3rem] p-4 border-white/10 shadow-2xl h-[600px] overflow-hidden">
                                    <div className="w-full h-full bg-[#020617] rounded-[2.5rem] overflow-hidden flex flex-col p-8 pointer-events-none">
                                        <div className="w-20 h-20 bg-primary/20 rounded-[1.5rem] mx-auto mb-6 flex items-center justify-center overflow-hidden">
                                            {(profileData?.image || session?.user?.image) ? (
                                                <img src={profileData?.image || session?.user?.image} className="w-full h-full object-cover" />
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
                                        <p className="font-bold text-lg text-white">Canlı Önizleme</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : activeTab === "products" ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Projeler & Portfolyo</h2>
                                <p className="text-sm text-foreground/50">Başarı hikayelerinizi ve tamamladığınız projeleri profilinizde sergileyin.</p>
                            </div>
                            <button
                                onClick={() => setShowProductModal(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                            >
                                <Plus className="w-5 h-5" /> Yeni Proje Ekle
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
                                            <span className="font-black text-primary text-xs uppercase tracking-widest">{product.price}</span>
                                        </div>
                                        <p className="text-sm text-foreground/50 mb-4 line-clamp-2">{product.description}</p>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">Düzenle</button>
                                            {product.link && (
                                                <a href={product.link} target="_blank" className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-xl hover:scale-105 transition-all">
                                                    <ExternalLink size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {productList.length === 0 && (
                                <div className="col-span-full py-20 text-center glass rounded-[2.5rem] border-white/5">
                                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-white/10" />
                                    <p className="text-lg font-bold">Henüz Proje Eklememişsin</p>
                                    <p className="text-sm text-foreground/40 mt-2">En iyi çalışmalarınızı ekleyerek potansiyel partnerlerinizi etkileyin.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === "services" ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Uzmanlık Alanları</h2>
                                <p className="text-sm text-foreground/50">Mesleki yetkinliklerinizi ve odak noktalarınıza listeleyin.</p>
                            </div>
                            <button
                                onClick={() => setShowServiceModal(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                            >
                                <Plus className="w-5 h-5" /> Yeni Uzmanlık Ekle
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

                        <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden">
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
                ) : activeTab === "bento" ? (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                                    <Layers className="text-primary w-8 h-8" /> Portfolyo Bileşenleri
                                </h2>
                                <p className="text-slate-500 mt-2 font-medium">Profilinizi profesyonel dünyada öne çıkaracak asimetrik ve interaktif kartları yönetin.</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-3 rounded-3xl border border-slate-100 shadow-sm">
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Dijital Ofis Modu</span>
                                <button className="w-12 h-6 bg-primary rounded-full relative flex items-center px-1 shadow-inner">
                                    <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md ml-auto" />
                                </button>
                            </div>
                        </div>

                        {/* Module Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {AVAILABLE_MODULES.map((mod) => {
                                const isActive = blocks.some(b => b.type === mod.type && b.isActive);
                                return (
                                    <motion.div
                                        key={mod.type}
                                        whileHover={{ y: -5 }}
                                        className={cn(
                                            "p-6 rounded-[2.5rem] border transition-all relative overflow-hidden group",
                                            isActive
                                                ? "border-primary/50 bg-primary shadow-2xl shadow-primary/20 text-white"
                                                : "bg-white border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/50"
                                        )}
                                    >
                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-inner",
                                            isActive ? "bg-primary text-white" : "bg-slate-100 " + mod.color
                                        )}>
                                            {mod.icon}
                                        </div>
                                        <h3 className={cn("font-bold mb-2 transition-colors", isActive ? "text-white" : "text-slate-900")}>{mod.name}</h3>
                                        <p className={cn("text-[10px] leading-relaxed mb-6 transition-colors", isActive ? "text-white/60" : "text-slate-500")}>{mod.description}</p>

                                        <button
                                            onClick={() => {
                                                let newBlocks;
                                                if (isActive) {
                                                    newBlocks = blocks.map(b => b.type === mod.type ? { ...b, isActive: false } : b);
                                                } else {
                                                    const exists = blocks.find(b => b.type === mod.type);
                                                    if (exists) {
                                                        newBlocks = blocks.map(b => b.type === mod.type ? { ...b, isActive: true } : b);
                                                    } else {
                                                        newBlocks = [...blocks, { type: mod.type, content: {}, isActive: true }];
                                                    }
                                                }
                                                handleSyncBlocks(newBlocks);
                                            }}
                                            className={cn(
                                                "w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                isActive
                                                    ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white"
                                                    : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02]"
                                            )}
                                        >
                                            {isActive ? 'Kaldır' : 'Yükle'}
                                        </button>

                                        {/* Status Tag */}
                                        {isActive && (
                                            <div className="absolute top-4 right-4 flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                <span className="text-[8px] font-black text-green-500 uppercase">Aktif</span>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Advanced Config Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 glass p-10 rounded-[3rem] border-white/5 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-white">Aktif Modül Konfigürasyonu</h3>
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{blocks.filter(b => b.isActive).length} Modül Aktif</span>
                                </div>

                                <div className="space-y-4">
                                    {blocks.filter(b => b.isActive).map((block, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
                                                    {AVAILABLE_MODULES.find(m => m.type === block.type)?.icon || <Layers size={18} />}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-white uppercase">{AVAILABLE_MODULES.find(m => m.type === block.type)?.name}</h4>
                                                    <p className="text-[10px] text-white/40">Sıra: #{idx + 1} • Son Güncelleme: Anlık</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button className="p-2 text-white/20 hover:text-white transition-colors"><Settings size={16} /></button>
                                                <div className="w-[1px] h-6 bg-white/5" />
                                                <div className="flex flex-col gap-1 items-center">
                                                    <button onClick={() => {
                                                        if (idx === 0) return;
                                                        const activeOnly = blocks.filter(b => b.isActive);
                                                        const inactiveOnly = blocks.filter(b => !b.isActive);
                                                        const newActive = [...activeOnly];
                                                        [newActive[idx - 1], newActive[idx]] = [newActive[idx], newActive[idx - 1]];
                                                        handleSyncBlocks([...newActive, ...inactiveOnly]);
                                                    }} className="text-white/20 hover:text-primary transition-all"><Plus className="w-4 h-4 rotate-[-45deg] scale-75" /></button>
                                                    <button onClick={() => {
                                                        const activeOnly = blocks.filter(b => b.isActive);
                                                        if (idx === activeOnly.length - 1) return;
                                                        const inactiveOnly = blocks.filter(b => !b.isActive);
                                                        const newActive = [...activeOnly];
                                                        [newActive[idx], newActive[idx + 1]] = [newActive[idx + 1], newActive[idx]];
                                                        handleSyncBlocks([...newActive, ...inactiveOnly]);
                                                    }} className="text-white/20 hover:text-primary transition-all rotate-180"><Plus className="w-4 h-4 rotate-[-45deg] scale-75" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {blocks.filter(b => b.isActive).length === 0 && (
                                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                            <p className="text-sm font-bold text-white/20 uppercase tracking-widest">Henüz modül yüklemediniz</p>
                                            <p className="text-xs text-white/10 mt-2">Kütüphaneden bir modül seçerek başlayın.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="glass p-10 rounded-[3rem] border-primary/10 bg-primary/2 space-y-6 flex flex-col justify-between">
                                <div>
                                    <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-primary/40">
                                        <Smartphone size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-white leading-tight">Canlı Önizleme & Test</h3>
                                    <p className="text-sm text-white/40 mt-3 leading-relaxed">
                                        Modüllerinizi ekledikten sonra telefonunuzdan nasıl göründüğünü test etmek için QR kodu kullanın.
                                    </p>
                                </div>
                                <button onClick={() => setActiveTab("qrcode")} className="w-full py-5 bg-white text-primary rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                                    HIZLI QR GÖRÜNTÜLE
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center pt-10">
                            <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                                <CheckCircle2 size={14} className="text-primary" /> TÜM DEĞİŞİKLİKLER ANLIK SENKRONİZE EDİLİR
                            </div>
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

                ) : activeTab === "statistics" ? (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Detaylı İstatistikler</h2>
                                <p className="text-sm text-foreground/50">Sayfanızın performansını ve ziyaretçi etkileşimlerini takip edin.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* AI Insight Panel */}
                            <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border-primary/20 bg-primary/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Sparkles size={120} className="text-primary" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-white">AI Performans Analizi</h3>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Digital Assistant Insights</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold text-white/60">Ziyaretçi Trendi</h4>
                                            <p className="text-sm font-medium text-white">Ziyaretçileriniz en çok hafta sonu saat <span className="text-primary">20:00 - 22:00</span> arasında aktif.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold text-white/60">En Popüler Modül</h4>
                                            <p className="text-sm font-medium text-white">"Yetenek Radarı" modülü diğerlerinden <span className="text-emerald-400">%42 daha fazla</span> etkileşim alıyor.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold text-white/60">Öneri</h4>
                                            <p className="text-sm font-medium text-white">Ürün fiyatlarını <span className="text-amber-400">₺9 - ₺19</span> bandında tutmanız dönüşümü artırabilir.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

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

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { id: "premium_modern", name: "Premium Modern", description: "En üst segment bento tasarımı, neon detaylar ve interaktif kartlar.", image: "/templates/premium.jpg", premium: true },
                                { id: "modern", name: "Modern Animated", description: "Hareketli arka plan ve akışkan tasarım.", image: "/templates/modern.jpg", premium: false },
                                { id: "bento", name: "Professional Portfolio", description: "Sektör standartlarında bento tasarımı ve iş odaklı akıllı widgetlar.", image: "/templates/bento.jpg", premium: true },
                                { id: "minimal_ios", name: "Minimalist CV", description: "Apple tarzı sade, öz ve profesyonel görünüm.", image: "/templates/minimal.jpg", premium: true },
                                { id: "luxury", name: "Luxury Executive", description: "Vurgulu altın sarısı ve gece siyahı ile otoriter duruş.", image: "/templates/luxury.jpg", premium: true },
                                { id: "creative", name: "Executive Showroom", description: "İnteraktif ve modüler profesyonel sunum.", image: "/templates/creative.jpg", premium: true },
                                { id: "nebula_blue", name: "Nebula Midnight", description: "Uzay temalı, parlayan bento grid tasarımı.", image: "/templates/nebula_blue.jpg", premium: true },
                                { id: "nebula_purple", name: "Nebula Sunset", description: "Eflatun ve pembe tonlarında fütüristik tasarım.", image: "/templates/nebula_purple.jpg", premium: true },
                                { id: "nebula_emerald", name: "Nebula Emerald", description: "Zümrüt yeşili ve neon detaylı modern tasarım.", image: "/templates/nebula_emerald.jpg", premium: true },
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
                                        setProfileData({ ...profileData, templateId: tpl.id });
                                        handleSave();
                                    }}
                                >
                                    <div className="aspect-[4/5] bg-white/5 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />

                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/0">
                                            {tpl.id === 'bento' ? <Layout className="w-12 h-12 text-primary/40" /> : <Smartphone className="w-12 h-12 text-white/20" />}
                                        </div>


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

                        {profileData.templateId === 'premium_modern' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-10 rounded-[3rem] border-primary/20 bg-primary/[0.02] space-y-10"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black">Premium Şablon Detayları</h3>
                                        <p className="text-sm text-foreground/50">Bu şablondaki tüm alanları buradan özelleştirebilirsiniz.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Video Settings */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-primary/60">Giriş Videosu</h4>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Kart Başlığı (Örn: Video)"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                                                value={premiumConfig.videoTitle}
                                                onChange={(e) => setPremiumConfig({ ...premiumConfig, videoTitle: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Alt Etiket (Örn: Videoyu İzle)"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                                                value={premiumConfig.videoLabel}
                                                onChange={(e) => setPremiumConfig({ ...premiumConfig, videoLabel: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Video URL (YouTube/Vimeo)"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                                                value={premiumConfig.videoUrl}
                                                onChange={(e) => setPremiumConfig({ ...premiumConfig, videoUrl: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Section Titles */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-primary/60">Bölüm Başlıkları</h4>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Yetenek Radarı Başlığı"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                                                value={premiumConfig.radarTitle}
                                                onChange={(e) => setPremiumConfig({ ...premiumConfig, radarTitle: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Hizmetlerim Başlığı"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                                                value={premiumConfig.servicesTitle}
                                                onChange={(e) => setPremiumConfig({ ...premiumConfig, servicesTitle: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Portfolyo Başlığı"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                                                value={premiumConfig.portfolioTitle}
                                                onChange={(e) => setPremiumConfig({ ...premiumConfig, portfolioTitle: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-primary/60">İletişim Alanı</h4>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="İletişim Başlığı"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                                                value={premiumConfig.contactTitle}
                                                onChange={(e) => setPremiumConfig({ ...premiumConfig, contactTitle: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="E-posta Buton Yazısı"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                                                value={premiumConfig.emailBtnText}
                                                onChange={(e) => setPremiumConfig({ ...premiumConfig, emailBtnText: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Danışmanlık Buton Yazısı"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                                                value={premiumConfig.consultBtnText}
                                                onChange={(e) => setPremiumConfig({ ...premiumConfig, consultBtnText: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSave()}
                                    className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all"
                                >
                                    AYARLARI KAYDET VE ÖNİZLE
                                </button>
                            </motion.div>
                        )}
                    </div>
                ) : null}

                {/* Project Add Modal */}
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
                                <h2 className="text-xl font-bold text-gray-900">Yeni Proje Ekle</h2>
                                <p className="text-gray-400 text-sm mt-1">Projenizi tanıtacak bir görsel ve detayları girin.</p>
                            </div>

                            <form onSubmit={handleAddProduct} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Proje Görseli</label>
                                    <div
                                        className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden transition-all hover:border-primary/50 cursor-pointer group"
                                        onClick={() => document.getElementById('product-image-upload')?.click()}
                                    >
                                        {newProduct.image ? (
                                            <div className="relative aspect-video">
                                                <img src={newProduct.image} alt="Proje" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setNewProduct({ ...newProduct, image: '' }); }}
                                                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="py-8 flex flex-col items-center gap-2 text-gray-400 group-hover:text-primary transition-colors">
                                                <Upload className="w-8 h-8" />
                                                <span className="text-sm font-medium">Görseli sürükle veya tıkla</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        id="product-image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onloadend = () => setNewProduct({ ...newProduct, image: reader.result as string });
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="Proje Başlığı"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Canlı Link / GitHub"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium"
                                    value={newProduct.link}
                                    onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })}
                                />
                                <textarea
                                    rows={2}
                                    placeholder="Proje Açıklaması"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium resize-none"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                                <button
                                    type="submit"
                                    disabled={isProductSaving}
                                    className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {isProductSaving ? "Kaydediliyor..." : "Projeyi Kaydet"}
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
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-black text-white">Yeni Hizmet / Uzmanlık</h2>
                            </div>
                            <div className="space-y-6">
                                <input
                                    type="text"
                                    placeholder="Başlık"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white font-medium"
                                    value={newService.title}
                                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                                />
                                <textarea
                                    rows={3}
                                    placeholder="Açıklama"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white font-medium resize-none"
                                    value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                />
                                <button
                                    onClick={handleAddService}
                                    className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                                >
                                    Hizmeti Ekle
                                </button>
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
