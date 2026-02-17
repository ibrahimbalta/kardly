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
    EyeOff,
    Check,
    Star,
    Instagram,
    Twitter,
    Linkedin,
    Github,
    Youtube,
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
    Briefcase,
    Phone,
    Globe,
    Mail,
    MessageCircle,
    Menu,
    TrendingUp

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

export default function DashboardClient({ session, profile, subscription, appointments, products, reviews, stats }: any) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showToast, setShowToast] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("overview") // overview, profile, products, services, appointments, templates, bento, reviews
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [profileData, setProfileData] = useState({
        ...profile,
        name: profile?.user?.name || session?.user?.name || "",
        image: profile?.user?.image || session?.user?.image || "",
        cvUrl: profile?.cvUrl || "",
        showAppointmentBtn: profile?.showAppointmentBtn || false
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

    // Reviews Management
    const [reviewList, setReviewList] = useState(reviews || [])

    // Services Management
    const [showServiceModal, setShowServiceModal] = useState(false)
    const [serviceList, setServiceList] = useState(profile?.services || [])
    const [newService, setNewService] = useState({
        title: "",
        description: ""
    })

    // Custom Links Management
    const [customLinks, setCustomLinks] = useState<{ title: string, url: string }[]>(
        (profileData.socialLinks as any[])?.find((l: any) => l.platform === 'customLinks')?.links || []
    )
    const [newLink, setNewLink] = useState({ title: "", url: "" })

    const handleAddLink = () => {
        if (!newLink.title || !newLink.url) return
        const updated = [...customLinks, { title: newLink.title, url: newLink.url }]
        setCustomLinks(updated)
        setNewLink({ title: "", url: "" })
        // Update socialLinks with customLinks
        const currentLinks = Array.isArray(profileData.socialLinks) ? [...profileData.socialLinks] : []
        const idx = currentLinks.findIndex((l: any) => l.platform === 'customLinks')
        if (idx > -1) {
            currentLinks[idx] = { platform: 'customLinks', links: updated }
        } else {
            currentLinks.push({ platform: 'customLinks', links: updated })
        }
        setProfileData({ ...profileData, socialLinks: currentLinks })
    }

    const handleDeleteLink = (index: number) => {
        const updated = customLinks.filter((_: any, i: number) => i !== index)
        setCustomLinks(updated)
        const currentLinks = Array.isArray(profileData.socialLinks) ? [...profileData.socialLinks] : []
        const idx = currentLinks.findIndex((l: any) => l.platform === 'customLinks')
        if (idx > -1) {
            currentLinks[idx] = { platform: 'customLinks', links: updated }
        }
        setProfileData({ ...profileData, socialLinks: currentLinks })
    }

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

    const handleSave = async (overrides?: any) => {
        setIsSaving(true)
        try {
            const res = await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slogan: overrides?.slogan ?? profileData.slogan,
                    bio: overrides?.bio ?? profileData.bio,
                    phone: overrides?.phone ?? profileData.phone,
                    socialLinks: overrides?.socialLinks ?? profileData.socialLinks,
                    themeColor: overrides?.themeColor ?? profileData.themeColor,
                    templateId: overrides?.templateId ?? profileData.templateId,
                    services: overrides?.services ?? serviceList,
                    workingHours: overrides?.workingHours ?? workingHours,
                    occupation: overrides?.occupation ?? profileData.occupation,
                    displayName: overrides?.name ?? profileData.name ?? session?.user?.name,
                    image: overrides?.image ?? profileData.image,
                    cvUrl: overrides?.cvUrl ?? profileData.cvUrl,
                    showAppointmentBtn: overrides?.showAppointmentBtn ?? profileData.showAppointmentBtn
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
        handleSave({ services: newList }) // Automatically save profile with new service
    }

    const handleDeleteService = (index: number) => {
        const newList = serviceList.filter((_: any, i: number) => i !== index)
        setServiceList(newList)
        handleSave({ services: newList }) // Automatically save profile after delete
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

    const handleToggleReview = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch("/api/review/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isActive: !currentStatus })
            })
            if (res.ok) {
                setReviewList(reviewList.map((r: any) => r.id === id ? { ...r, isActive: !currentStatus } : r))
                setShowToast(!currentStatus ? "Yorum onaylandı!" : "Yorum gizlendi!")
                setTimeout(() => setShowToast(null), 3000)
            }
        } catch (err) { console.error(err) }
    }

    const handleDeleteReview = async (id: string) => {
        if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return
        try {
            const res = await fetch("/api/review/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
            if (res.ok) {
                setReviewList(reviewList.filter((r: any) => r.id !== id))
                setShowToast("Yorum silindi!")
                setTimeout(() => setShowToast(null), 3000)
            }
        } catch (err) { console.error(err) }
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
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex overflow-hidden">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
                    <div className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border bg-primary border-primary/20 text-white">
                        <span className="font-bold">{showToast}</span>
                    </div>
                </div>
            )}

            {/* Mobile Header Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-50 flex items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                        <Zap className="text-white w-4 h-4 fill-current" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-tighter tracking-[0.2em]">KARDLY</span>
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 transition-all hover:bg-slate-100 rounded-xl text-slate-600"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-[60] w-72 border-r border-slate-200 bg-white p-6 flex flex-col gap-8 transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-10",
                isSidebarOpen ? "translate-x-0 shadow-2xl shadow-slate-200/50" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between lg:justify-start gap-3 mb-4">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                            <Zap className="text-white w-5 h-5 fill-current" />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tighter text-slate-900">KARDLY<span className="text-primary">.</span></span>
                            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] block">Dashboard PRO</span>
                        </div>
                    </Link>
                    <button className="lg:hidden p-2 text-slate-300 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>



                <nav className="flex flex-col gap-2">
                    <NavItem
                        icon={<Layout className="w-5 h-5" />}
                        label="Sayfa Düzenle"
                        active={activeTab === "edit"}
                        onClick={() => {
                            setActiveTab("edit")
                            setIsSidebarOpen(false)
                        }}
                    />
                    <NavItem
                        icon={<Briefcase className="w-5 h-5" />}
                        label="Projeler & Portfolyo"
                        active={activeTab === "products"}
                        onClick={() => {
                            setActiveTab("products")
                            setIsSidebarOpen(false)
                        }}
                    />
                    <NavItem
                        icon={<Zap className="w-5 h-5" />}
                        label="Uzmanlık Alanları"
                        active={activeTab === "services"}
                        onClick={() => {
                            setActiveTab("services")
                            setIsSidebarOpen(false)
                        }}
                    />
                    <NavItem
                        icon={<Palette className="w-5 h-5" />}
                        label="Şablon Değiştir"
                        active={activeTab === "templates"}
                        onClick={() => {
                            setActiveTab("templates")
                            setIsSidebarOpen(false)
                        }}
                    />
                    <NavItem
                        icon={<Calendar className="w-5 h-5" />}
                        label="Randevular"
                        active={activeTab === "appointments"}
                        onClick={() => {
                            setActiveTab("appointments")
                            setIsSidebarOpen(false)
                        }}
                    />
                    <NavItem
                        icon={<BarChart3 className="w-5 h-5" />}
                        label="İstatistikler"
                        active={activeTab === "statistics"}
                        onClick={() => {
                            setActiveTab("statistics")
                            setIsSidebarOpen(false)
                        }}
                    />
                    <NavItem
                        icon={<QrCode className="w-5 h-5" />}
                        label="QR Kod"
                        active={activeTab === "qrcode"}
                        onClick={() => {
                            setActiveTab("qrcode")
                            setIsSidebarOpen(false)
                        }}
                    />

                    <NavItem
                        icon={<MessageSquare className="w-5 h-5" />}
                        label="Yorumlar"
                        active={activeTab === "reviews"}
                        onClick={() => {
                            setActiveTab("reviews")
                            setIsSidebarOpen(false)
                        }}
                    />

                    <NavItem
                        icon={<Settings className="w-5 h-5" />}
                        label="Ayarlar"
                        active={activeTab === "settings"}
                        onClick={() => {
                            setActiveTab("settings")
                            setIsSidebarOpen(false)
                        }}
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

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-auto pt-24 lg:pt-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-slate-900">Hoş geldin, <span className="gradient-text">{session?.user?.name}</span> 👋</h1>
                        <p className="text-slate-400 text-sm font-medium tracking-wide">Dijital kartvizitini buradan yönetebilir, performansını takip edebilirsin.</p>
                    </motion.div>
                    {profile && (
                        <motion.a
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={`/${profile.username}`}
                            target="_blank"
                            className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all font-black text-xs uppercase tracking-widest"
                        >
                            Canlı Siteni Gör <ExternalLink className="w-4 h-4" />
                        </motion.a>
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
                                        <label className="block text-sm font-medium mb-2 opacity-60">Profil Fotoğrafı</label>
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                                <img
                                                    src={profileData?.image || session?.user?.image || `https://ui-avatars.com/api/?name=${profileData?.name || "User"}`}
                                                    className="w-full h-full object-cover"
                                                    alt="Preview"
                                                />
                                            </div>
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={profileData?.image || ""}
                                                    onChange={(e) => setProfileData({ ...profileData, image: e.target.value })}
                                                    placeholder="Resim linkini yapıştırın veya dosya seçin"
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm h-fit"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('image-upload')?.click()}
                                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2 h-fit shrink-0"
                                                >
                                                    <Upload className="w-4 h-4" /> Yükle
                                                </button>
                                            </div>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setProfileData({ ...profileData, image: reader.result as string });
                                                    reader.readAsDataURL(file);
                                                }}
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

                                <div>
                                    <label className="block text-sm font-medium mb-2 opacity-60">CV (PDF/DOC)</label>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-primary">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                value={profileData?.cvUrl || ""}
                                                onChange={(e) => setProfileData({ ...profileData, cvUrl: e.target.value })}
                                                placeholder="CV dosya linki veya dosyayı yükleyin"
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('cv-upload')?.click()}
                                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                                            >
                                                <Upload className="w-4 h-4" /> Yükle
                                            </button>
                                        </div>
                                        <input
                                            id="cv-upload"
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                const reader = new FileReader();
                                                reader.onloadend = () => setProfileData({ ...profileData, cvUrl: reader.result as string });
                                                reader.readAsDataURL(file);
                                            }}
                                        />
                                    </div>
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
                                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-emerald-500">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="WhatsApp / Telefon Numarası"
                                                value={getSocialUrl("phone")}
                                                onChange={(e) => updateSocialLink("phone", e.target.value)}
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
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-emerald-400">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Web Sitesi URL"
                                                value={getSocialUrl("website")}
                                                onChange={(e) => updateSocialLink("website", e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-300">
                                                <Github className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="GitHub URL"
                                                value={getSocialUrl("github")}
                                                onChange={(e) => updateSocialLink("github", e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-red-500">
                                                <Youtube className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="YouTube URL"
                                                value={getSocialUrl("youtube")}
                                                onChange={(e) => updateSocialLink("youtube", e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-rose-400">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Konum (Harita Paylaşım Linki)"
                                                value={getSocialUrl("location")}
                                                onChange={(e) => updateSocialLink("location", e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* Custom Links Section */}
                                <div className="pt-4 border-t border-white/5">
                                    <label className="block text-sm font-medium mb-4 opacity-60">🔗 Özel Linkler</label>
                                    <p className="text-xs text-slate-400 mb-4">Profil sayfanızda slogan altında ikon olarak gözükecek bağlantılar ekleyin.</p>

                                    {/* Existing Links */}
                                    {customLinks.length > 0 && (
                                        <div className="space-y-2 mb-4">
                                            {customLinks.map((link: any, i: number) => (
                                                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10 group">
                                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                        <Globe className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold truncate">{link.title}</p>
                                                        <p className="text-[10px] text-slate-400 truncate">{link.url}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteLink(i)}
                                                        className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add New Link */}
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            placeholder="Link Başlığı (örn: Portfolyom)"
                                            value={newLink.title}
                                            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Link Adresi (https://...)"
                                                value={newLink.url}
                                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddLink}
                                                disabled={!newLink.title || !newLink.url}
                                                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all disabled:opacity-30 flex items-center gap-1"
                                            >
                                                <Plus className="w-4 h-4" /> Ekle
                                            </button>
                                        </div>
                                    </div>
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
                                                    {link.platform === "github" && <Github className="w-4 h-4 text-white" />}
                                                    {link.platform === "youtube" && <Youtube className="w-4 h-4 text-red-500" />}
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

                        <div className="glass rounded-[2.5rem] border-white/5 overflow-x-auto no-scrollbar">
                            <table className="w-full text-left min-w-[700px]">
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
                            <h2 className="text-3xl font-bold mb-2 uppercase tracking-tighter">QR Kodun</h2>
                            <p className="text-foreground/50 text-sm">Dijital kartvizitini hızlıca paylaşmak için bu kodu kullan.</p>
                        </div>
                        <div className="glass p-12 rounded-[3.5rem] border-white/5 inline-block mx-auto relative group shadow-2xl">
                            <div className="absolute inset-0 bg-primary/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <QRCodeCard username={profile?.username || "demo"} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 px-6">
                            <div className="glass p-6 rounded-3xl border-white/5 text-left flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                    <Smartphone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Hızlı Erişim</p>
                                    <p className="text-[10px] text-foreground/40 mt-0.5">Kameranızla okutun</p>
                                </div>
                            </div>
                            <div className="glass p-6 rounded-3xl border-white/5 text-left flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                    <Download className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Yüksek Kalite</p>
                                    <p className="text-[10px] text-foreground/40 mt-0.5">Baskı için hazır</p>
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
                                    <div className="grid grid-cols-5 gap-3">
                                        {["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4", "#84cc16", "#14b8a6", "#d946ef", "#dc2626", "#0ea5e9", "#fbbf24", "#8b5cf6", "#7c3aed"].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setProfileData({ ...profileData, themeColor: color })}
                                                className={`w-full aspect-square rounded-2xl border-2 transition-all ${profileData.themeColor === color ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                                                    }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                                >
                                    Ayarları Kaydet
                                </button>
                            </div>

                            <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-emerald-400" /> Çalışma Saatleri
                                </h3>
                                <p className="text-[10px] text-foreground/40 leading-relaxed font-bold uppercase tracking-widest">Randevu alınabilecek saat dilimleri</p>

                                <div
                                    className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group"
                                    onClick={() => setProfileData({ ...profileData, showAppointmentBtn: !profileData.showAppointmentBtn })}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${profileData.showAppointmentBtn ? 'bg-primary border-primary' : 'border-white/20'}`}>
                                        {profileData.showAppointmentBtn && <CheckCircle2 size={12} className="text-white" />}
                                    </div>
                                    <span className="text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity">Randevu sistemini aktif et</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {workingHours.sort().map((hour: string) => (
                                        <div key={hour} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl group hover:border-rose-500/30 transition-all">
                                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-sm font-bold">{hour}</span>
                                            <button
                                                onClick={() => {
                                                    const updated = workingHours.filter((h: string) => h !== hour)
                                                    setWorkingHours(updated)
                                                }}
                                                className="ml-auto text-white/20 hover:text-rose-500 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
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
                                    className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-sm font-bold hover:bg-emerald-500/20 transition-all uppercase tracking-widest text-xs"
                                >
                                    Saatleri Kaydet
                                </button>
                            </div>
                        </div>

                        <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                            <h3 className="font-bold flex items-center gap-2 text-rose-500">
                                <Trash2 className="w-5 h-5" /> Tehlikeli Bölge
                            </h3>
                            <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">HESABINIZI KALICI OLARAK SİLER</p>
                            <button className="w-full py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all transition-all">
                                Profili Tamamen Sil
                            </button>
                        </div>
                    </div>

                ) : activeTab === "statistics" ? (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold">Detaylı İstatistikler</h2>
                            <p className="text-sm text-foreground/50">Sayfanızın performansını ve ziyaretçi etkileşimlerini takip edin.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard icon={<Eye className="w-5 h-5 text-blue-400" />} label="Toplam Ziyaret" value={stats.totalViews.toString()} trend="Genel" />
                            <StatCard icon={<MousePointer2 className="w-5 h-5 text-emerald-400" />} label="Etkileşim Oranı" value={stats.clickRate} trend="Ortalama" />
                            <StatCard icon={<FileText className="w-5 h-5 text-amber-400" />} label="CV Görüntüleme" value={stats.cvClicks.toString()} trend="Dosya" />
                            <StatCard icon={<Briefcase className="w-5 h-5 text-rose-400" />} label="Proje Tıklama" value={stats.projectClicks.toString()} trend="Portföy" />
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            <ActionStatCard icon={<Phone className="w-5 h-5 text-indigo-400" />} label="Ara" count={stats.phoneClicks} color="indigo" />
                            <ActionStatCard icon={<MessageCircle className="w-5 h-5 text-emerald-400" />} label="WhatsApp" count={stats.waClicks} color="emerald" />
                            <ActionStatCard icon={<Mail className="w-5 h-5 text-blue-400" />} label="E-Mail" count={stats.emailClicks} color="blue" />
                            <ActionStatCard icon={<Calendar className="w-5 h-5 text-purple-400" />} label="Randevu" count={stats.appointmentClicks} color="purple" />
                            <ActionStatCard icon={<Globe className="w-5 h-5 text-cyan-400" />} label="Web Sitesi" count={stats.websiteClicks} color="cyan" />
                            <ActionStatCard icon={<MapPin className="w-5 h-5 text-rose-400" />} label="Konum" count={stats.locationClicks} color="rose" />
                            <ActionStatCard icon={<Share2 className="w-5 h-5 text-orange-400" />} label="Paylaşım" count={stats.shareClicks} color="orange" />
                            <ActionStatCard icon={<MessageSquare className="w-5 h-5 text-amber-400" />} label="Yorumlar" count={stats.reviewCount} color="amber" />
                        </div>

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
                                        <h3 className="font-black text-lg text-white">Profil Performans Raporu</h3>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest font-bold">Digital Assistant Insights</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-white/60">Ziyaretçi Trendi</h4>
                                        <p className="text-sm font-medium text-white font-bold leading-relaxed">Toplam <span className="text-primary">{stats.totalViews} ziyaretçi</span> arasında en çok etkileşim kurulan kanal <span className="text-primary">{stats.waClicks > stats.phoneClicks ? "WhatsApp" : "Telefon"}</span> oldu.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-white/60">İçerik Etkileşimi</h4>
                                        <p className="text-sm font-medium text-white font-bold leading-relaxed">Projeleriniz ve CV'niz toplam <span className="text-emerald-400">{(stats.projectClicks + stats.cvClicks).toString()} kez</span> incelendi. Portföyünüz dikkat çekiyor.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-white/60">Sosyal Paylaşım</h4>
                                        <p className="text-sm font-medium text-white font-bold leading-relaxed">Profiliniz <span className="text-amber-400">{stats.shareClicks} kez</span> paylaşıldı. Bu, ağınızın aktif olduğunu gösteriyor.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                ) : activeTab === "templates" ? (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold">Tasarım Şablonları</h2>
                            <p className="text-sm text-foreground/50">Sayfanızın görünümünü değiştirmek için farklı şablonlar seçin.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { id: "neon_black", name: "Neon Modern (Siyah)", description: "Karanlık ve gizemli, mavi neon detaylı şık tasarım." },
                                { id: "neon_white", name: "Neon Modern (Beyaz)", description: "Aydınlık ve ferah, modern neon esintili tasarım." },
                                { id: "neon_blue", name: "Neon Modern (Mavi)", description: "Derin mavi tonları ve parlak neon hatlar." },
                                { id: "neon_green", name: "Neon Modern (Yeşil)", description: "Enerjik yeşil neon ve teknolojik görünüm." },
                                { id: "neon_purple", name: "Neon Modern (Mor)", description: "Asil mor neon ve modern karanlık atmosfer." },
                                { id: "neon_red", name: "Neon Modern (Kırmızı)", description: "Tutkulu kırmızı neon ile dikkat çekici görünüm." },
                                { id: "neon_pink", name: "Neon Modern (Pembe)", description: "Canlı pembe ve enerjik bir görünüm." },
                                { id: "neon_cyan", name: "Neon Modern (Turkuaz)", description: "Teknolojik ve fütüristik turkuaz yansımalar." },
                                { id: "neon_orange", name: "Neon Modern (Turuncu)", description: "Sıcak ve dinamik turuncu neon enerjisi." },
                                { id: "neon_amber", name: "Neon Modern (Kehribar)", description: "Klasik ve asil altın/kehribar ışığı." },
                                { id: "neon_rose", name: "Neon Modern (Gül)", description: "Zarif ve modern gül pembesi tonları." },
                                { id: "neon_emerald", name: "Neon Modern (Zümrüt)", description: "Zengin ve derin yeşil neon atmosferi." },
                                { id: "neon_sky", name: "Neon Modern (Gök Mavisi)", description: "Ferah ve havadar açık mavi neon çizgiler." },
                                { id: "neon_lime", name: "Neon Modern (Limon)", description: "Modern ve radikal sarı-yeşil neon tasarımı." },
                                { id: "neon_indigo", name: "Neon Modern (İndigo)", description: "Derin ve mistik gece mavisi neon estetiği." },
                                { id: "neon_crimson", name: "Neon Modern (Kıpkırmızı)", description: "Güçlü ve keskin koyu kırmızı neon hatlar." },
                                { id: "neon_teal", name: "Neon Modern (Cam Göbeği)", description: "Sakin ve prestijli cam göbeği neon tasarımı." },
                                { id: "neon_fuchsia", name: "Neon Modern (Fuşya)", description: "Cesur ve enerjik fuşya neon patlaması." },
                                { id: "neon_violet", name: "Neon Modern (Menekşe)", description: "Asil ve derin menekşe moru neon dokunuşu." },
                                { id: "neon_gs", name: "Spor (Sarı-Kırmızı)", description: "Aslanların ruhunu yansıtan efsane renkler." },
                                { id: "neon_fb", name: "Spor (Sarı-Lacivert)", description: "Kanaryaların gücünü temsil eden klasik kombinasyon." },
                                { id: "neon_ts", name: "Spor (Bordo-Mavi)", description: "Karadeniz fırtınasının modern neon yorumu." },
                                { id: "neon_bjk", name: "Spor (Siyah-Beyaz)", description: "Kartalların asaletini yansıtan monokrom neon." },
                                { id: "neon_tr", name: "Milli (Kırmızı-Beyaz)", description: "Ay yıldızlı bayrağımızın asil renkleri." },
                                { id: "neon_cyber", name: "🌈 Cyber Neon", description: "Sayyan mavisi ve fuşya pembenin iç içe geçtiği siberpunk estetiği." },
                                { id: "neon_galaxy", name: "🌈 Galaxy Neon", description: "Mor, turkuaz ve gece mavisi yıldız parıltılı kozmik atmosfer." },
                                { id: "neon_acid", name: "🌈 Acid Neon", description: "Neon yeşili, sarı ve limon renklerinin kesiştiği çarpıcı enerji." },
                                { id: "neon_candy", name: "🌈 Candy Neon", description: "Şeker pembe, lavanta ve menekşe renklerinin yumuşak neon dansı." },
                                { id: "neon_aurora", name: "🌈 Aurora Neon", description: "Kuzey ışıkları etkisiyle turkuaz, çivit mavisi ve zümrüt yeşili." }
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
                                        handleSave({ templateId: tpl.id });
                                    }}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold">{tpl.name}</h3>
                                            {profileData.templateId === tpl.id && (
                                                <div className="bg-primary/20 text-primary p-1 rounded-full">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-foreground/50">{tpl.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : activeTab === "reviews" ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Müşteri Yorumları</h2>
                                <p className="text-sm text-slate-500">Profilinizde görünen yorumları yönetin.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-x-auto no-scrollbar shadow-sm">
                            <table className="w-full text-left min-w-[800px]">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Kullanıcı</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Yorum</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Puan</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Durum</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reviewList.map((review: any) => (
                                        <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                                        <img
                                                            src={review.image || `https://ui-avatars.com/api/?name=${review.name}&background=random`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e: any) => {
                                                                e.target.src = `https://ui-avatars.com/api/?name=${review.name}&background=random`;
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{review.name}</div>
                                                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{review.title}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600 line-clamp-2 max-w-sm font-medium">{review.content}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-0.5 text-amber-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-200"} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleReview(review.id, review.isActive)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border",
                                                        review.isActive
                                                            ? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm"
                                                            : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200"
                                                    )}
                                                >
                                                    {review.isActive ? 'Yayında' : 'Onay Bekliyor'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleReview(review.id, review.isActive)}
                                                        className={cn(
                                                            "w-9 h-9 rounded-xl flex items-center justify-center transition-all border shadow-sm",
                                                            review.isActive
                                                                ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300"
                                                                : "bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white"
                                                        )}
                                                        title={review.isActive ? "Gizle" : "Yayına Al"}
                                                    >
                                                        {review.isActive ? <EyeOff size={16} /> : <Check size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReview(review.id)}
                                                        className="w-9 h-9 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                        title="Sil"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {reviewList.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-white/20">
                                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                                <p className="font-bold uppercase tracking-widest text-xs">Henüz yorum yapılmamış</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}

                {/* Modals outside of conditional tabs */}
                <AnimatePresence>
                    {showProductModal && (
                        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 10 }}
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

                    {showServiceModal && (
                        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowServiceModal(false)} />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
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
                </AnimatePresence>
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
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-sm group",
                active
                    ? "bg-primary text-white shadow-xl shadow-primary/20"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
            )}
        >
            <div className={cn("transition-transform group-hover:scale-110", active && "scale-110")}>
                {icon}
            </div>
            <span className="truncate">{label}</span>
            {active && (
                <motion.div
                    layoutId="active-nav-dot"
                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff]"
                />
            )}
        </button>
    )
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-primary/20 transition-all relative overflow-hidden group"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    {icon}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                    <TrendingUp size={10} className="text-emerald-500" />
                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        {trend}
                    </span>
                </div>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">{label}</p>
            <p className="text-3xl font-black tracking-tight text-slate-900">{value}</p>

            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    )
}

function ActionStatCard({ icon, label, count, color }: { icon: React.ReactNode, label: string, count: number, color: string }) {
    const colors: any = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
    }

    return (
        <div className={cn("bg-white p-5 rounded-[2rem] border flex flex-col items-center text-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-default shadow-sm", colors[color] || "border-slate-200")}>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                {icon}
            </div>
            <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                <p className="text-2xl font-black text-slate-800">{count}</p>
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}
