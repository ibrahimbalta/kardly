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
    TrendingUp,
    UserCircle,
    User

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
import { useTranslation } from "@/context/LanguageContext"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

export default function DashboardClient({ session, profile, subscription, appointments, products, reviews, stats }: any) {
    const { t, language } = useTranslation()
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
        showAppointmentBtn: profile?.showAppointmentBtn || false,
        tone: profile?.tone || "profesyonel",
        youtubeVideoUrl: profile?.youtubeVideoUrl || "",
        showVideoAsProfile: profile?.showVideoAsProfile || false
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

    // Appointments Management
    const [appointmentList, setAppointmentList] = useState(appointments || [])
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

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
                    tone: overrides?.tone ?? profileData.tone,
                    services: overrides?.services ?? serviceList,
                    workingHours: overrides?.workingHours ?? workingHours,
                    occupation: overrides?.occupation ?? profileData.occupation,
                    displayName: overrides?.name ?? profileData.name ?? session?.user?.name,
                    image: overrides?.image ?? profileData.image,
                    cvUrl: overrides?.cvUrl ?? profileData.cvUrl,
                    showAppointmentBtn: overrides?.showAppointmentBtn ?? profileData.showAppointmentBtn,
                    youtubeVideoUrl: overrides?.youtubeVideoUrl ?? profileData.youtubeVideoUrl,
                    showVideoAsProfile: overrides?.showVideoAsProfile ?? profileData.showVideoAsProfile
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

    const handleUpdateAppointmentStatus = async (id: string, status: string) => {
        try {
            const res = await fetch("/api/appointments/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            })
            if (res.ok) {
                setAppointmentList(appointmentList.map((a: any) => a.id === id ? { ...a, status } : a))
                setShowToast(status === "confirmed" ? "Randevu onaylandı!" : "Randevu tamamlandı!")
                setTimeout(() => setShowToast(null), 3000)
                setSelectedAppointment(null)
            }
        } catch (err) { console.error(err) }
    }

    const handleDeleteAppointment = async (id: string) => {
        if (!confirm("Bu randevuyu silmek istediğinize emin misiniz?")) return
        try {
            const res = await fetch("/api/appointments/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
            if (res.ok) {
                setAppointmentList(appointmentList.filter((a: any) => a.id !== id))
                setShowToast("Randevu silindi!")
                setTimeout(() => setShowToast(null), 3000)
                setSelectedAppointment(null)
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
                    <div className="px-4 mb-4">
                        <LanguageSwitcher />
                    </div>
                    <NavItem
                        icon={<Layout className="w-5 h-5" />}
                        label={t('editPage')}
                        active={activeTab === "edit"}
                        onClick={() => {
                            setActiveTab("edit")
                            setIsSidebarOpen(false)
                        }}
                    />
                    <NavItem
                        icon={<Briefcase className="w-5 h-5" />}
                        label={t('projectsPortfolio')}
                        active={activeTab === "products"}
                        onClick={() => {
                            setActiveTab("products")
                            setIsSidebarOpen(false)
                        }}
                    />
                    <NavItem
                        icon={<Zap className="w-5 h-5" />}
                        label={t('expertise')}
                        active={activeTab === "services"}
                        onClick={() => {
                            setActiveTab("services")
                            setIsSidebarOpen(false)
                        }}
                    />
                    <NavItem
                        icon={<Palette className="w-5 h-5" />}
                        label={t('changeTemplate')}
                        active={activeTab === "templates"}
                        onClick={() => {
                            setActiveTab("templates")
                            setIsSidebarOpen(false)
                        }}
                    />
                    <NavItem
                        icon={<Calendar className="w-5 h-5" />}
                        label={t('appointments')}
                        active={activeTab === "appointments"}
                        onClick={() => {
                            setActiveTab("appointments")
                            setIsSidebarOpen(false)
                        }}
                    />
                    <NavItem
                        icon={<BarChart3 className="w-5 h-5" />}
                        label={t('statistics')}
                        active={activeTab === "statistics"}
                        onClick={() => {
                            setActiveTab("statistics")
                            setIsSidebarOpen(false)
                        }}
                    />
                    <NavItem
                        icon={<QrCode className="w-5 h-5" />}
                        label={t('qrcode')}
                        active={activeTab === "qrcode"}
                        onClick={() => {
                            setActiveTab("qrcode")
                            setIsSidebarOpen(false)
                        }}
                    />

                    <NavItem
                        icon={<MessageSquare className="w-5 h-5" />}
                        label={t('reviews')}
                        active={activeTab === "reviews"}
                        onClick={() => {
                            setActiveTab("reviews")
                            setIsSidebarOpen(false)
                        }}
                    />

                    <NavItem
                        icon={<Settings className="w-5 h-5" />}
                        label={t('settings')}
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
                            <LogOut className="w-4 h-4" /> {t('logout')}
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
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-slate-900">{t('welcome')}, <span className="gradient-text">{session?.user?.name}</span> 👋</h1>
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
                            {t('liveSite')} <ExternalLink className="w-4 h-4" />
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
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="useVideoAsProfile"
                                                checked={profileData.showVideoAsProfile}
                                                onChange={(e) => setProfileData({ ...profileData, showVideoAsProfile: e.target.checked })}
                                                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/50"
                                            />
                                            <label htmlFor="useVideoAsProfile" className="text-sm font-medium opacity-80 cursor-pointer">{t('useVideoAsProfile')}</label>
                                        </div>
                                        {profileData.showVideoAsProfile && (
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium opacity-60">{t('profileVideoUrl')}</label>
                                                <div className="flex gap-3">
                                                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 border border-red-500/20">
                                                        <Youtube size={20} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={profileData.youtubeVideoUrl}
                                                        onChange={(e) => setProfileData({ ...profileData, youtubeVideoUrl: e.target.value })}
                                                        placeholder={t('youtubeHint')}
                                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        )}
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
                                                <CheckCircle2 className="w-5 h-5" /> {t('saveChanges')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            {/* Realistic Smartphone Preview */}
                            <div className="relative group perspective-1000">
                                <div className="absolute -inset-4 bg-primary/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-all duration-1000" />

                                {/* iPhone Frame */}
                                <div className="relative w-[320px] h-[640px] bg-[#0f172a] rounded-[3.5rem] p-3 shadow-[0_0_0_2px_rgba(255,255,255,0.1),0_0_0_10px_rgba(15,23,42,1),0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 mx-auto">
                                    { /* Calculate Mockup Theme */}
                                    {(() => {
                                        const tid = profileData.templateId || "neon_black";
                                        const tone = profileData.tone || "profesyonel";
                                        let accent = profileData.themeColor || "#6366f1";
                                        let bg = "#020617";
                                        let patternSvg = "";
                                        let glow = "";

                                        // Mockup Tone Styling
                                        const getMockupTone = (t: string) => {
                                            switch (t) {
                                                case "samimi": return { rounded: "rounded-[3.5rem]", font: "font-sans", border: "border-none" };
                                                case "yaratıcı": return { rounded: "rounded-xl skew-x-1", font: "font-mono", border: "border-dashed" };
                                                case "lüks": return { rounded: "rounded-[2.5rem]", font: "font-serif", border: "border-double border-4" };
                                                default: return { rounded: "rounded-[2.8rem]", font: "font-sans", border: "border-solid" };
                                            }
                                        }
                                        const mTone = getMockupTone(tone);

                                        // Rainbow Neon Templates
                                        if (tid === "neon_cyber") { accent = "#0ef"; bg = "#00050a"; glow = "radial-gradient(circle at 20% 30%, #0ff2 0%, transparent 50%), radial-gradient(circle at 80% 70%, #f0f2 0%, transparent 50%)"; }
                                        else if (tid === "neon_galaxy") { accent = "#a855f7"; bg = "#050010"; glow = "radial-gradient(circle at 50% 50%, #a855f722 0%, transparent 70%)"; }
                                        else if (tid === "neon_acid") { accent = "#bef264"; bg = "#051000"; glow = "radial-gradient(circle at 30% 20%, #bef26422 0%, transparent 60%), radial-gradient(circle at 70% 80%, #eab30822 0%, transparent 60%)"; }
                                        else if (tid === "neon_candy") { accent = "#f472b6"; bg = "#10000a"; glow = "radial-gradient(circle at 20% 80%, #f472b622 0%, transparent 60%), radial-gradient(circle at 80% 20%, #8b5cf622 0%, transparent 60%)"; }
                                        else if (tid === "neon_aurora") { accent = "#2dd4bf"; bg = "#000a0a"; glow = "conic-gradient(from 0deg at 50% 50%, #2dd4bf11, #6366f111, #2dd4bf11)"; }

                                        // Standard Neon Colors
                                        else if (tid === "neon_blue") { accent = "#38bdf8"; bg = "#0c1e35"; }
                                        else if (tid === "neon_green") { accent = "#22c55e"; bg = "#06140e"; }
                                        else if (tid === "neon_purple") { accent = "#a855f7"; bg = "#13072e"; }
                                        else if (tid === "neon_red") { accent = "#ef4444"; bg = "#1a0505"; }
                                        else if (tid === "neon_pink") { accent = "#ec4899"; bg = "#1a0514"; }
                                        else if (tid === "neon_cyan") { accent = "#06b6d4"; bg = "#051a1a"; }
                                        else if (tid === "neon_orange") { accent = "#f97316"; bg = "#1a0f05"; }
                                        else if (tid === "neon_amber") { accent = "#f59e0b"; bg = "#1a1005"; }
                                        else if (tid === "neon_rose") { accent = "#f43f5e"; bg = "#1a050f"; }
                                        else if (tid === "neon_emerald") { accent = "#10b981"; bg = "#051a0f"; }
                                        else if (tid === "neon_sky") { accent = "#0ea5e9"; bg = "#05141a"; }
                                        else if (tid === "neon_lime") { accent = "#84cc16"; bg = "#0f1a05"; }
                                        else if (tid === "neon_indigo") { accent = "#6366f1"; bg = "#0a112d"; }
                                        else if (tid === "neon_fuchsia") { accent = "#d946ef"; bg = "#1a051a"; }
                                        else if (tid === "neon_violet") { accent = "#8b5cf6"; bg = "#11051a"; }
                                        else if (tid === "neon_gs") { accent = "#f59e0b"; bg = "#1a0505"; }
                                        else if (tid === "neon_fb") { accent = "#fbbf24"; bg = "#0a112d"; }
                                        else if (tid === "neon_ts") { accent = "#38bdf8"; bg = "#1a0505"; }
                                        else if (tid === "neon_bjk") { accent = "#fff"; bg = "#000"; }
                                        else if (tid === "neon_tr") { accent = "#fff"; bg = "#dc2626"; }

                                        // Patterned Templates
                                        else if (tid === "pattern_ottoman") { accent = "#d4af37"; bg = "#0c1421"; patternSvg = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30 L60 0 L60 60 Z M30 30 L0 0 L0 60 Z' fill='%23d4af37' fill-opacity='0.2'/%3E%3C/svg%3E")`; }
                                        else if (tid === "pattern_geometric") { accent = "#fff"; bg = "#020617"; patternSvg = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L40 40 M40 0 L0 40' stroke='white' stroke-opacity='0.1'/%3E%3C/svg%3E")`; }
                                        else if (tid === "pattern_marble") { accent = "#18181b"; bg = "#f8f9fa"; patternSvg = `url("https://www.transparenttextures.com/patterns/white-diamond.png")`; }
                                        else if (tid === "pattern_topo") { accent = "#10b981"; bg = "#050505"; patternSvg = `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40 Q 20 10, 40 40 T 80 40' stroke='%2310b981' fill='transparent' stroke-opacity='0.2'/%3E%3C/svg%3E")`; }
                                        else if (tid === "pattern_circuit") { accent = "#06b6d4"; bg = "#050505"; patternSvg = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='30' height='30' x='5' y='5' fill='none' stroke='%2306b6d4' stroke-opacity='0.1'/%3E%3C/svg%3E")`; }

                                        return (
                                            <div className={cn("w-full h-full overflow-hidden flex flex-col pt-12 p-6 pointer-events-none relative transition-all duration-700", mTone.rounded, mTone.font)} style={{ backgroundColor: bg }}>
                                                {/* Specialized Glowing Background for Rainbow cases */}
                                                {glow && <div className="absolute inset-0 z-0 opacity-40 animate-pulse" style={{ background: glow }} />}

                                                {/* Pattern Overlay */}
                                                {patternSvg && <div className="absolute inset-0 z-0 opacity-50" style={{ backgroundImage: patternSvg }} />}

                                                {/* Standard Accent Light */}
                                                {!glow && tid.startsWith("neon_") && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-[80px] opacity-20 rounded-full" style={{ backgroundColor: accent }} />}

                                                {/* Notch */}
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#0f172a] rounded-b-2xl z-20 flex items-center justify-center gap-1.5 px-4">
                                                    <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                                                    <div className="w-8 h-1 bg-white/10 rounded-full" />
                                                </div>

                                                {/* Status Bar */}
                                                <div className="absolute top-3 left-8 right-8 flex justify-between items-center z-20">
                                                    <span className={`text-[10px] font-bold ${bg === '#f8f9fa' ? 'text-slate-400' : 'text-white/40'}`}>9:41</span>
                                                    <div className={`flex items-center gap-1.5 ${bg === '#f8f9fa' ? 'opacity-20' : 'opacity-40'}`}>
                                                        <div className={`w-3 h-3 border ${bg === '#f8f9fa' ? 'border-slate-900' : 'border-white'} rounded-[2px]`} />
                                                        <div className={`w-3 h-1.5 ${bg === '#f8f9fa' ? 'bg-slate-900' : 'bg-white'} rounded-sm`} />
                                                    </div>
                                                </div>

                                                {/* Content Scaled */}
                                                <div className="flex-1 flex flex-col justify-center animate-fade-in group-hover:scale-[1.02] transition-transform duration-700 relative z-10">
                                                    <div className={cn("w-24 h-24 mx-auto mb-6 flex items-center justify-center overflow-hidden border-2 transition-all duration-500 shadow-2xl shadow-black/50", mTone.rounded)} style={{ borderColor: `${accent}40`, backgroundColor: `${accent}10`, boxShadow: tid.startsWith("neon_") ? `0 0 20px ${accent}20` : 'none' }}>
                                                        {profileData.showVideoAsProfile && profileData.youtubeVideoUrl ? (
                                                            <div className="w-full h-full bg-black flex items-center justify-center">
                                                                <Youtube className="w-8 h-8 text-red-500 animate-pulse" />
                                                            </div>
                                                        ) : (profileData?.image || session?.user?.image) ? (
                                                            <img src={profileData?.image || session?.user?.image} className="w-full h-full object-cover shadow-2xl" alt="Profile" />
                                                        ) : (
                                                            <UserCircle className="w-12 h-12 opacity-50" style={{ color: accent }} />
                                                        )}
                                                    </div>
                                                    <div className="text-center mb-6">
                                                        <h4 className={`font-black text-xl mb-1 truncate ${bg === '#f8f9fa' ? 'text-slate-900' : 'text-white'}`}>{profileData?.name || session?.user?.name || "Kullanıcı"}</h4>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500" style={{ color: accent }}>{profileData?.occupation || "Ünvan Belirtilmedi"}</p>
                                                    </div>
                                                    <div className="text-center mb-8 px-4">
                                                        <p className={`text-[11px] italic leading-relaxed line-clamp-2 ${bg === '#f8f9fa' ? 'text-slate-500' : 'text-white/60'}`}>"{profileData?.slogan || "Motto buraya gelecek..."}"</p>
                                                    </div>

                                                    {/* Mockup Social Icons */}
                                                    <div className="flex justify-center flex-wrap gap-2.5 mb-10">
                                                        {[1, 2, 3, 4].map((i) => (
                                                            <div key={i} className={cn("w-10 h-10 border flex items-center justify-center shadow-lg backdrop-blur-sm transition-all", mTone.rounded, bg === '#f8f9fa' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10')}>
                                                                <div style={{ color: accent }} className="opacity-80"><Zap size={16} /></div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="space-y-3">
                                                        {[1, 2].map((i) => (
                                                            <div key={i} className={cn("h-12 border flex items-center px-4 transition-all", mTone.rounded, bg === '#f8f9fa' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/10')}>
                                                                <div className={`w-24 h-1.5 rounded-full ${bg === '#f8f9fa' ? 'bg-slate-200' : 'bg-white/10'}`} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Home Indicator */}
                                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
                                            </div>
                                        );
                                    })()}

                                    {/* Side Buttons */}
                                    <div className="absolute top-24 -left-0.5 w-1 h-12 bg-slate-800 rounded-r-sm shadow-sm" />
                                    <div className="absolute top-40 -left-0.5 w-1 h-16 bg-slate-800 rounded-r-sm shadow-sm" />
                                    <div className="absolute top-64 -left-0.5 w-1 h-16 bg-slate-800 rounded-r-sm shadow-sm" />
                                    <div className="absolute top-32 -right-0.5 w-1 h-20 bg-slate-800 rounded-l-sm shadow-sm" />

                                    {/* Shine Effect */}
                                    <div className="absolute inset-x-12 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-[3rem]" />
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded-[3.5rem] cursor-pointer" onClick={() => profile?.username && window.open(`/${profile.username}`, '_blank')}>
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl">
                                            <ArrowRight size={24} />
                                        </div>
                                        <p className="font-black text-xs text-white uppercase tracking-widest">Canlı Görünyüle</p>
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

                        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-x-auto no-scrollbar shadow-sm">
                            <table className="w-full text-left min-w-[700px]">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Müşteri</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Tarih / Saat</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Durum</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {appointmentList.map((appointment: any) => (
                                        <tr key={appointment.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{appointment.clientName}</div>
                                                <div className="text-xs text-slate-500">{appointment.clientEmail}</div>
                                                <div className="text-xs text-slate-400">{appointment.clientPhone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-700">{new Date(appointment.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}</div>
                                                <div className="text-xs text-slate-400 font-bold">{new Date(appointment.date).toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${appointment.status === 'pending'
                                                    ? 'bg-amber-50 border-amber-100 text-amber-600'
                                                    : appointment.status === 'confirmed'
                                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                                        : 'bg-slate-100 border-slate-200 text-slate-600'
                                                    }`}>
                                                    {appointment.status === 'pending' ? t('pending') : appointment.status === 'confirmed' ? t('approved') : t('completed')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {appointment.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}
                                                            className="w-9 h-9 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                            title="Onayla"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteAppointment(appointment.id)}
                                                        className="w-9 h-9 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                        title="Sil"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {appointmentList.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-300">
                                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                                <p className="font-bold uppercase tracking-widest text-[10px]">{t('noAppointments')}</p>
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
                            <h2 className="text-3xl font-bold mb-2 uppercase tracking-tighter">{t('qrTitle')}</h2>
                            <p className="text-foreground/50 text-sm">{t('qrSub')}</p>
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
                                    <p className="font-bold text-sm">{t('quickAccess')}</p>
                                    <p className="text-[10px] text-foreground/40 mt-0.5">{t('scanCamera')}</p>
                                </div>
                            </div>
                            <div className="glass p-6 rounded-3xl border-white/5 text-left flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                    <Download className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{t('highQuality')}</p>
                                    <p className="text-[10px] text-foreground/40 mt-0.5">{t('readyPrint')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                ) : activeTab === "settings" ? (
                    <div className="max-w-4xl space-y-8">
                        <div>
                            <h2 className="text-xl font-bold">{t('accountSettings')}</h2>
                            <p className="text-sm text-foreground/50">{t('accountSettingsSub')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-indigo-400" /> {t('appearanceSettings')}
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium mb-4 opacity-60">{t('themeColorLabel')}</label>
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
                                <div className="pt-4 border-t border-white/5">
                                    <label className="block text-sm font-medium mb-4 opacity-60">{t('designVibeLabel')}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: "profesyonel", name: `💼 ${t('vibeProfessional')}`, desc: t('vibeProfessionalDesc') },
                                            { id: "samimi", name: `✨ ${t('vibeSincere')}`, desc: t('vibeSincereDesc') },
                                            { id: "yaratıcı", name: `🎨 ${t('vibeCreative')}`, desc: t('vibeCreativeDesc') },
                                            { id: "lüks", name: `👔 ${t('vibeLuxury')}`, desc: t('vibeLuxuryDesc') }
                                        ].map(tone => (
                                            <button
                                                key={tone.id}
                                                onClick={() => setProfileData({ ...profileData, tone: tone.id })}
                                                className={cn(
                                                    "p-3 rounded-xl border text-left transition-all",
                                                    profileData.tone === tone.id ? "bg-primary/20 border-primary" : "bg-white/5 border-white/10 hover:border-white/20"
                                                )}
                                            >
                                                <p className="text-xs font-bold">{tone.name}</p>
                                                <p className="text-[10px] opacity-40">{tone.desc}</p>
                                            </button>
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
                                    <Clock className="w-5 h-5 text-emerald-400" /> {t('appointments')}
                                </h3>
                                <p className="text-[10px] text-foreground/40 leading-relaxed font-bold uppercase tracking-widest">{t('workingHoursSub')}</p>

                                <div
                                    className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group"
                                    onClick={() => setProfileData({ ...profileData, showAppointmentBtn: !profileData.showAppointmentBtn })}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${profileData.showAppointmentBtn ? 'bg-primary border-primary' : 'border-white/20'}`}>
                                        {profileData.showAppointmentBtn && <CheckCircle2 size={12} className="text-white" />}
                                    </div>
                                    <span className="text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity">{t('enableAppointments')}</span>
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
                                    {t('saveHours')}
                                </button>
                            </div>
                        </div>

                        <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                            <h3 className="font-bold flex items-center gap-2 text-rose-500">
                                <Trash2 className="w-5 h-5" /> {t('dangerZone')}
                            </h3>
                            <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">{t('deleteProfileSub')}</p>
                            <button className="w-full py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all transition-all">
                                {t('deleteProfile')}
                            </button>
                        </div>
                    </div>

                ) : activeTab === "statistics" ? (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold">{t('statsTitle')}</h2>
                            <p className="text-sm text-foreground/50">{t('statsSub')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard icon={<Eye className="w-5 h-5 text-blue-400" />} label={t('totalViewsLabel')} value={stats.totalViews.toString()} trend="Genel" />
                            <StatCard icon={<MousePointer2 className="w-5 h-5 text-emerald-400" />} label={t('clickRateLabel')} value={stats.clickRate} trend="Ortalama" />
                            <StatCard icon={<FileText className="w-5 h-5 text-amber-400" />} label={t('cvViewsLabel')} value={stats.cvClicks.toString()} trend="Dosya" />
                            <StatCard icon={<Briefcase className="w-5 h-5 text-rose-400" />} label={t('projectClicksLabel')} value={stats.projectClicks.toString()} trend="Portföy" />
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            <ActionStatCard icon={<Phone className="w-5 h-5 text-indigo-400" />} label={t('phoneCallsBtn')} count={stats.phoneClicks} color="indigo" />
                            <ActionStatCard icon={<MessageCircle className="w-5 h-5 text-emerald-400" />} label={t('waMessagesBtn')} count={stats.waClicks} color="emerald" />
                            <ActionStatCard icon={<Mail className="w-5 h-5 text-blue-400" />} label={t('email')/* reused key */} count={stats.emailClicks} color="blue" />
                            <ActionStatCard icon={<Calendar className="w-5 h-5 text-purple-400" />} label={t('bookAppointment')/* reused key */} count={stats.appointmentClicks} color="purple" />
                            <ActionStatCard icon={<Globe className="w-5 h-5 text-cyan-400" />} label={t('liveSite')/* reused key */} count={stats.websiteClicks} color="cyan" />
                            <ActionStatCard icon={<MapPin className="w-5 h-5 text-rose-400" />} label={t('locationsBtn')} count={stats.locationClicks} color="rose" />
                            <ActionStatCard icon={<Share2 className="w-5 h-5 text-orange-400" />} label={t('sharesBtn')} count={stats.shareClicks} color="orange" />
                            <ActionStatCard icon={<MessageSquare className="w-5 h-5 text-amber-400" />} label={t('reviews')/* reused key */} count={stats.reviewCount} color="amber" />
                        </div>

                        <div className="lg:col-span-4 mt-8">
                            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0f172a] shadow-2xl border border-white/5">
                                {/* Ambient Background Glow */}
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                                <div className="relative z-10 p-8 md:p-12">
                                    {/* Header */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-white/5">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/20">
                                                <Zap size={32} className="fill-current" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-3xl text-white tracking-tight leading-none mb-2">{t('analysisTitle')}</h3>
                                                <p className="text-xs font-bold text-primary uppercase tracking-[0.4em]">Smart Performance Insights</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                            <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{t('liveData')}</span>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                                        {/* Ziyaretçi Trendi */}
                                        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300 group">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                                <Users size={20} />
                                            </div>
                                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">{t('visitorTrend')}</h4>
                                            <div className="space-y-3">
                                                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                                    {t('visitorTrendDesc', stats.totalViews, stats.waClicks > stats.phoneClicks ? "WhatsApp" : "Telefon")}
                                                </p>
                                                <div className="pt-2">
                                                    <span className="text-[10px] font-black text-slate-500 bg-white/5 px-2 py-1 rounded-md">{t('successRate')}: %{((Math.max(stats.waClicks, stats.phoneClicks) / (stats.totalViews || 1)) * 100).toFixed(0)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* İçerik Etkileşimi */}
                                        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
                                                <Activity size={20} />
                                            </div>
                                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">{t('contentEngagement')}</h4>
                                            <div className="space-y-3">
                                                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                                    {t('contentEngagementDesc', (stats.projectClicks + stats.cvClicks), stats.projectClicks > stats.cvClicks ? t('portfolioPop') : t('cvInterest'))}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Ağ Yayılımı */}
                                        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:border-amber-500/30 transition-all duration-300 group">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                                                <Share2 size={20} />
                                            </div>
                                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">{t('networkSpread')}</h4>
                                            <div className="space-y-3">
                                                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                                    {t('networkSpreadDesc', stats.shareClicks)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Box */}
                                    <div className="mt-12 bg-gradient-to-r from-primary/10 to-transparent rounded-[2rem] border border-primary/20 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                                        <div className="flex -space-x-4">
                                            {[24, 32, 45].map(id => (
                                                <div key={id} className="w-12 h-12 rounded-full border-4 border-[#0f172a] overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/150?u=${id}`} className="w-full h-full object-cover" alt="avatar" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Akıllı Strateji Önerisi</p>
                                            <p className="text-base text-white font-bold leading-snug">
                                                {stats.totalViews > 10 && stats.clickRate.replace('%', '') < 5
                                                    ? "Ziyaretçi sayınız yüksek ancak etkileşim düşük. Profil fotoğrafınızı veya slogonızı güncelleyerek merak uyandırın."
                                                    : "Performansınız dengeli. WhatsApp butonunu görünür kılarak doğrudan iletişimleri +%20 artırabilirsiniz."}
                                            </p>
                                        </div>
                                        <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 shrink-0">
                                            STRATEJİYİ UYGULA
                                        </button>
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
                                // Neon Style Templates
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
                                { id: "neon_aurora", name: "🌈 Aurora Neon", description: "Kuzey ışıkları etkisiyle turkuaz, çivit mavisi ve zümrüt yeşili." },

                                // Motifli ve Desenli Arka Planlar
                                { id: "pattern_ottoman", name: "🕌 Osmanlı Motifi", description: "Geleneksel motifler ve altın varaklı asil tasarım." },
                                { id: "pattern_geometric", name: "📐 Geometrik Desen", description: "Modern, keskin ve teknolojik çizgiler." },
                                { id: "pattern_marble", name: "🏛️ Mermer Doku", description: "Lüks ve temiz mermer dokulu klasik görünüm." },
                                { id: "pattern_topo", name: "🗺️ Topografik", description: "Doğa ve derinlik hissi veren modern çizgiler." },
                                { id: "pattern_circuit", name: "🔌 Siber Devre", description: "Teknolojik devre kartı deseni ve fütüristik hava." }
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
                                <h2 className="text-xl font-bold text-slate-900">{t('customerReviews')}</h2>
                                <p className="text-sm text-slate-500">{t('reviewManageSub')}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-x-auto no-scrollbar shadow-sm">
                            <table className="w-full text-left min-w-[800px]">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('userLabel')}</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('commentLabel')}</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('ratingLabel')}</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('statusLabel')}</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">{t('actionLabel')}</th>
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
                                                    {review.isActive ? t('approved') : t('pending')}
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
                            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowServiceModal(false)} />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-white border border-slate-200 w-full max-w-lg rounded-[2.5rem] p-10 relative z-10 shadow-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-primary" />

                                <button onClick={() => setShowServiceModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="mb-8">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                        <Zap className="w-7 h-7 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Yeni Hizmet / Uzmanlık</h2>
                                    <p className="text-sm text-slate-500 mt-2">Profilinizde görünecek yeni bir uzmanlık alanı ekleyin.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Başlık</label>
                                        <input
                                            type="text"
                                            placeholder="Örn: Web Tasarım, SEO, Pazarlama"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 font-medium transition-all placeholder:text-slate-300"
                                            value={newService.title}
                                            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Açıklama</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Hizmetiniz hakkında kısa bir açıklama yazın..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 font-medium resize-none transition-all placeholder:text-slate-300"
                                            value={newService.description}
                                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddService}
                                        className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
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
