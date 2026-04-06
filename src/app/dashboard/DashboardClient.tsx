"use client"

import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
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
    ShieldAlert,
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
    Image as ImageIcon,
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
    User,
    Gamepad2,
    History,
    Cpu,
    Cloud,
    RefreshCw,
    Moon,
    Sun,
    Circle,
    Crown,
    Inbox,
    Target,
    Wind,
    Gem,
    Waves,
    Compass,
    Filter,
    Crosshair,
    Dna,
    Atom,
    Boxes,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Quote,
    Edit2,
    ArrowUp,
    ArrowDown,
    Bot,
    Dribbble,
    Rss,
    IdCard,
    Play,
    Coffee,
    Heart,
    CreditCard,
    Send,
    Search
} from "lucide-react"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"
import { QRCodeCard } from "@/components/QRCodeCard"
import BusinessCardGenerator from "@/components/BusinessCardGenerator"
import { useTranslation } from "@/context/LanguageContext"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { z } from "zod"


const profileSchema = z.object({
    username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır").regex(/^[a-zA-Z0-9_-]+$/, "Kullanıcı adı sadece harf, rakam, alt tire ve tire içerebilir"),
    displayName: z.string().optional().or(z.literal("")).nullable(),
    slogan: z.string().max(100, "Slogan 100 karakteri geçemez").optional().or(z.literal("")).nullable(),
    bio: z.string().max(1000, "Biyografi 1000 karakteri geçemez").optional().or(z.literal("")).nullable(),
    bioColor: z.string().optional().or(z.literal("")).nullable(),
    sloganColor: z.string().optional().or(z.literal("")).nullable(),
    phone: z.string().optional().or(z.literal("")).nullable(),
    occupation: z.string().optional().or(z.literal("")).nullable(),
    targetAudience: z.string().optional().or(z.literal("")).nullable(),
    paymentLink: z.string().optional().or(z.literal("")).nullable(),
    youtubeVideoUrl: z.string().optional().or(z.literal("")).nullable(),
    image: z.string().optional().or(z.literal("")).nullable(),
    profileBgImage: z.string().optional().or(z.literal("")).nullable()
})



export default function DashboardClient({ session, profile, subscription, appointments, products, reviews, leads: initialLeads, stats }: any) {
    const { t, language } = useTranslation()
    const TEMPLATE_CATEGORIES = [
        { id: "all", name: t('catAll'), icon: <Layout size={14} /> },
        { id: "pro", name: t('catPro'), icon: <Briefcase size={14} /> },
        { id: "retro", name: t('catRetro'), icon: <History size={14} /> },
        { id: "luxury", name: t('catLuxury'), icon: <Award size={14} /> },
        { id: "lifestyle", name: t('catLifestyle'), icon: <Gamepad2 size={14} /> },
        { id: "future", name: t('catFuture'), icon: <Cpu size={14} /> },
        { id: "neon", name: t('catNeon'), icon: <Zap size={14} /> },
        { id: "pattern", name: t('catPattern'), icon: <Layers size={14} /> },
        { id: "nature", name: t('catNature'), icon: <Sparkles size={14} /> },
        { id: "dream", name: t('catDream'), icon: <Cloud size={14} /> },
        { id: "dark", name: t('catDark'), icon: <Moon size={14} /> },
        { id: "light", name: t('catLight'), icon: <Sun size={14} /> },
        { id: "cyber", name: t('catCyber'), icon: <Monitor size={14} /> },
        { id: "antique", name: t('catAntique'), icon: <Map size={14} /> },
        { id: "liquid", name: t('catLiquid'), icon: <Activity size={14} /> },
        { id: "pop", name: t('catPop'), icon: <Palette size={14} /> },
        { id: "zen", name: t('catZen'), icon: <Target size={14} /> },
        { id: "adventure", name: t('catAdventure'), icon: <MapPin size={14} /> },
        { id: "celestial", name: t('catCelestial'), icon: <Star size={14} /> },
        { id: "minimal", name: t('catMinimal'), icon: <Circle size={14} /> },
        { id: "industrial", name: t('catIndustrial'), icon: <Layout size={14} /> },
        { id: "vibrant", name: t('catVibrant'), icon: <Zap size={14} /> },
        { id: "royal", name: t('catRoyal'), icon: <Crown size={14} /> },
        { id: "tech", name: t('catTech'), icon: <Cpu size={14} /> },
        { id: "meta", name: t('catMeta'), icon: <Globe size={14} /> },
        { id: "3d", name: t('cat3D'), icon: <Layers size={14} /> },
        { id: "elite", name: "Elite Modern", icon: <Sparkles size={14} /> },
        { id: "athletic", name: "Sporcu / Pro", icon: <Activity size={14} /> },
        { id: "tourism", name: "Turizm & Seyahat", icon: <Map size={14} /> }
    ]
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
        showVideoAsProfile: profile?.showVideoAsProfile || false,
        isCatalog: profile?.isCatalog || false,
        paymentLink: profile?.paymentLink || "",
        paymentType: profile?.paymentType || "coffee",
        animationStyle: profile?.animationStyle || "none",
        profileBgImage: profile?.profileBgImage || "",
        qrColorDark: profile?.qrColorDark || "#0f172a",
        qrColorLight: profile?.qrColorLight || "#ffffff",
        bioColor: profile?.bioColor || "",
        bioFontFamily: profile?.bioFontFamily || "",
        bioFontSize: profile?.bioFontSize || "",
        sloganColor: profile?.sloganColor || "",
        sloganFontFamily: profile?.sloganFontFamily || "",
        sloganFontSize: profile?.sloganFontSize || "",
        businessCardTemplateId: profile?.businessCardTemplateId || "minimal_white",
        businessCardOrientation: profile?.businessCardOrientation || "landscape",
        hasAcceptedTerms: profile?.hasAcceptedTerms || false,
        showInHub: profile?.showInHub ?? true
    })

    const [isTermsAccepted, setIsTermsAccepted] = useState(profile?.hasAcceptedTerms || false)
    const [selectedTplCat, setSelectedTplCat] = useState("all")
    const [isTplCatOpen, setIsTplCatOpen] = useState(false)
    const [isQuickTplMenuOpen, setIsQuickTplMenuOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isGeneratingBio, setIsGeneratingBio] = useState(false)
    const [activeWidget, setActiveWidget] = useState("booking")
    const [widgetStyle, setWidgetStyle] = useState("embedded")
    const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null)
    const [externalWidget, setExternalWidget] = useState({
        title: "",
        code: "",
        position: "inline"
    })
    const [extraWidgetConfig, setExtraWidgetConfig] = useState({
        videoUrl: "",
        videoBtnText: "Tanıtım Videosu",
        skills: "Design:95,Marketing:80,Coding:85",
        countdownDate: "",
        countdownTitle: "Özel Teklif",
        portfolioImages: "",
        githubUrl: "",
        dribbbleUrl: "",
        behanceUrl: "",
        blogRssUrl: "",
        techStack: "React,Next.js,TypeScript,Tailwind CSS"
    })

    const handleGenerateBio = async () => {
        if (!profileData.occupation) {
            setShowToast("Lütfen önce meslek alanını doldurun.")
            setTimeout(() => setShowToast(null), 3000)
            return
        }
        setIsGeneratingBio(true)
        try {
            const res = await fetch("/api/generate/bio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    occupation: profileData.occupation,
                    targetAudience: profileData.targetAudience || "Potansiyel müşteriler",
                    tone: profileData.tone || "profesyonel"
                })
            })
            const data = await res.json()
            if (data.bio) {
                setProfileData({ ...profileData, bio: data.bio })
                setShowToast("Bio başarıyla oluşturuldu! ✨")
                setTimeout(() => setShowToast(null), 3000)
            }
        } catch (err) {
            console.error(err)
            setShowToast("AI oluşturma hatası.")
            setTimeout(() => setShowToast(null), 3000)
        } finally {
            setIsGeneratingBio(false)
        }
    }
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
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [isProductImageUploading, setIsProductImageUploading] = useState(false)
    const [statsRange, setStatsRange] = useState("30")
    const [isUploadingPortfolio, setIsUploadingPortfolio] = useState(false)
    const [isProfileImageUploading, setIsProfileImageUploading] = useState(false)
    const [isBgImageUploading, setIsBgImageUploading] = useState(false)
    const [isCvUploading, setIsCvUploading] = useState(false)

    // Reviews Management
    const [reviewList, setReviewList] = useState(reviews || [])

    // Services Management
    const [showServiceModal, setShowServiceModal] = useState(false)
    const [serviceList, setServiceList] = useState(profile?.services || [])
    const [newService, setNewService] = useState({
        title: "",
        description: ""
    })
    const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null)

    // Leads Management
    const [leads, setLeads] = useState<any[]>(initialLeads || [])
    const [isLeadsLoading, setIsLeadsLoading] = useState(false)
    const [selectedLead, setSelectedLead] = useState<any>(null)

    // Network Management
    const [networkUsers, setNetworkUsers] = useState<any[]>([])
    const [isNetworkLoading, setIsNetworkLoading] = useState(false)
    const [networkSearch, setNetworkSearch] = useState("")
    const [hubOnlineOnly, setHubOnlineOnly] = useState(false)
    const [selectedHubCategory, setSelectedHubCategory] = useState("")
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)

    useEffect(() => {
        if (activeTab === "network") {
            fetchNetwork()
        }
    }, [activeTab])

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

    const [isHubAiOpen, setIsHubAiOpen] = useState(false)
    const [hubAiMessage, setHubAiMessage] = useState("")
    const [hubAiChat, setHubAiChat] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
    const [isHubAiLoading, setIsHubAiLoading] = useState(false)

    const handleHubAiChat = async () => {
        if (!hubAiMessage.trim() || isHubAiLoading) return
        
        const userMsg = hubAiMessage
        setHubAiMessage("")
        const currentChat = [...hubAiChat, { role: 'user' as const, content: userMsg }]
        setHubAiChat(currentChat)
        setIsHubAiLoading(true)

        try {
            // Sadece gerekli verileri göndererek context oluştur
            const networkContext = networkUsers.map(u => ({
                name: u.profile?.displayName || u.name,
                occupation: u.profile?.occupation,
                bio: u.profile?.bio,
                username: u.profile?.username
            }))

            const res = await fetch("/api/ai/hub-assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    history: hubAiChat,
                    profiles: networkContext
                })
            })
            
            const data = await res.json()
            if (data.reply) {
                setHubAiChat([...currentChat, { role: 'assistant' as const, content: data.reply }])
            } else {
                setHubAiChat([...currentChat, { role: 'assistant' as const, content: "Üzgünüm, şu an yanıt veremiyorum. Lütfen tekrar deneyin." }])
            }
        } catch (err) {
            console.error(err)
            setHubAiChat([...currentChat, { role: 'assistant' as const, content: "Bağlantı hatası oluştu. Lütfen tekrar deneyin." }])
        } finally {
            setIsHubAiLoading(false)
        }
    }

    useEffect(() => {
        if (activeTab === "leads") {
            fetchLeads()
        }
    }, [activeTab])

    const fetchLeads = async () => {
        setIsLeadsLoading(true)
        try {
            const res = await fetch("/api/leads/list")
            const data = await res.json()
            setLeads(data)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLeadsLoading(false)
        }
    }

    const handleDeleteLead = async (id: string) => {
        if (!confirm("Bu talebi silmek istediğinize emin misiniz?")) return
        try {
            const res = await fetch(`/api/leads/delete?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setLeads(leads.filter(l => l.id !== id))
                setShowToast("Talep silindi!")
                setTimeout(() => setShowToast(null), 3000)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleUpdateLeadStatus = async (id: string, status: string) => {
        try {
            const res = await fetch("/api/leads/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            })
            if (res.ok) {
                setLeads(leads.map(l => l.id === id ? { ...l, status } : l))
                setShowToast("Talep durumu güncellendi!")
                setTimeout(() => setShowToast(null), 3000)
            }
        } catch (err) {
            console.error(err)
        }
    }

    // Appointments Management
    const [appointmentList, setAppointmentList] = useState(appointments || [])
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

    // Custom Links Management
    const [customLinks, setCustomLinks] = useState<{ title: string, url: string, isAction?: boolean }[]>(
        (profileData.socialLinks as any[])?.find((l: any) => l.platform === 'customLinks')?.links || []
    )
    const [newLink, setNewLink] = useState({ title: "", url: "", isAction: false })

    const handleAddLink = () => {
        if (!newLink.title || !newLink.url) return
        const updated = [...customLinks, { title: newLink.title, url: newLink.url, isAction: newLink.isAction }]
        setCustomLinks(updated)
        setNewLink({ title: "", url: "", isAction: false })
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

    const toggleLinkAction = (index: number) => {
        const updated = [...customLinks]
        updated[index] = { ...updated[index], isAction: !updated[index].isAction }
        setCustomLinks(updated)
        const currentLinks = Array.isArray(profileData.socialLinks) ? [...profileData.socialLinks] : []
        const idx = currentLinks.findIndex((l: any) => l.platform === 'customLinks')
        if (idx > -1) {
            currentLinks[idx] = { platform: 'customLinks', links: updated }
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

    const ALL_TEMPLATES = [
        // Mesleki
        { id: "pro_software", category: "pro", name: "💻 Yazılım / Teknoloji", description: "Terminal esintili dark mod ve kod satırlı teknolojik görünüm.", isNew: true },
        { id: "pro_doctor", category: "pro", name: "👨‍⚕️ Doktor / Sağlık", description: "Güven veren medikal mavi, temiz ve profesyonel klinik hatlar.", isNew: true },
        { id: "pro_chef", category: "pro", name: "👨‍🍳 Şef / Gastronomi", description: "Bistronomi temalı, sıcak tonlar ve mutfak sanatları dokusu.", isNew: true },
        { id: "pro_barber", category: "pro", name: "💈 Berber / Kuaför", description: "Vintage salon estetiği, monokrom şıklık ve maskülen hatlar.", isNew: true },
        { id: "pro_fitness", category: "pro", name: "🏋️ Fitness / Spor", description: "Yüksek enerji, karbon fiber doku ve dinamik sporcu ruhu.", isNew: true },
        { id: "pro_lawyer", category: "pro", name: "⚖️ Avukat / Hukuk", description: "Ciddi, güven veren profesyonel mermer ve altın dokusu.", isNew: true },
        { id: "pro_architect", category: "pro", name: "🏗️ Mimar / Mühendis", description: "Teknik çizimler ve blueprint esintili modern tasarım.", isNew: true },
        { id: "pro_realestate", category: "pro", name: "🏢 Gayrimenkul / Yatırım", description: "Lüks, yatırım odaklı gold ve lacivert mükemmel uyumu.", isNew: true },
        { id: "pro_finance", category: "pro", name: "📈 Finans / Danışmanlık", description: "Borsa grafikleri ve kurumsal ciddiyetin modern tasarımı.", isNew: true },

        // Neon
        { id: "neon_cyber", category: "neon", name: "🌈 Cyber Neon", description: "Sayyan mavisi ve fuşya pembenin iç içe geçtiği siberpunk estetiği.", isNew: true },
        { id: "neon_galaxy", category: "neon", name: "🌈 Galaxy Neon", description: "Mor, turkuaz ve gece mavisi yıldız parıltılı kozmik atmosfer.", isNew: true },
        { id: "neon_acid", category: "neon", name: "🌈 Acid Neon", description: "Neon yeşili, sarı ve limon renklerinin kesiştiği çarpıcı enerji.", isNew: true },
        { id: "neon_black", category: "neon", name: "Neon Modern (Siyah)", description: "Karanlık ve gizemli, mavi neon detaylı şık tasarım." },
        { id: "neon_blue", category: "neon", name: "Neon Modern (Mavi)", description: "Derin mavi tonları ve parlak neon hatlar." },
        { id: "neon_purple", category: "neon", name: "Neon Modern (Mor)", description: "Asil mor neon ve modern karanlık atmosfer." },

        // Pattern & Art
        { id: "pro_artistic", category: "pattern", name: "🎨 Dövme & Sanat", description: "Sıradışı, sanatsal hatlar ve premium koyu mod estetiği.", isNew: true },
        { id: "pattern_ottoman", category: "pattern", name: "🕌 Osmanlı Motifi", description: "Geleneksel motifler ve altın varaklı asil tasarım." },
        { id: "pattern_geometric", category: "pattern", name: "📐 Geometrik Desen", description: "Modern, keskin ve teknolojik çizgiler." },
        { id: "pattern_marble", category: "pattern", name: "🏛️ Mermer Doku", description: "Lüks ve temiz mermer dokulu klasik görünüm." },
        { id: "pattern_circuit", category: "pattern", name: "🔌 Siber Devre", description: "Teknolojik devre kartı deseni ve fütüristik hava." },

        // Nature & Minimal
        { id: "pro_dietitian", category: "nature", name: "🌿 Diyetisyen / Sağlık", description: "Doğal tonlar, ferah görünüm ve sağlık odaklı çizgiler." },
        { id: "pro_photographer", category: "nature", name: "📸 Fotoğrafçı", description: "Minimalist galeri stili, lens odağı ve saf beyaz asalet." },
        { id: "pattern_topo", category: "nature", name: "🗺️ Topografik", description: "Doğa ve derinlik hissi veren modern çizgiler." },
        { id: "minimal_glass", category: "nature", name: "💎 Kristal Cam", description: "Yumuşak buzlu cam efekti ve transparan modern şıklık.", isNew: true },
        { id: "nature_dawn", category: "nature", name: "🌅 Şafak Vakti", description: "Turuncu ve morun soft geçişli gökyüzü estetiği.", isNew: true },

        // Retro & Nostalji
        { id: "retro_mac", category: "retro", name: "💾 Retro Macintosh", description: "Eskitilmiş bej tonları, piksel dokunuşu ve nostaljik bloklar.", isNew: true },
        { id: "retro_news", category: "retro", name: "🗞️ Eski Gazete", description: "Saman kağıdı dokusu ve yüksek kontrastlı siyah-beyaz şıklık.", isNew: true },
        { id: "retro_synth", category: "retro", name: "🕹️ 80s Synthwave", description: "Mor, pembe ve neon grid çizgileriyle enerjik retro atmosfer.", isNew: true },

        // Lüks & Premium
        { id: "luxury_gold", category: "luxury", name: "💎 Mat Siyah & Altın", description: "Derin mat siyah zemin üzerinde asil altın varaklı detaylar.", isNew: true },
        { id: "luxury_silver", category: "luxury", name: "🥈 Gece Mavisi & Gümüş", description: "Lacivert ve gümüşün kurumsal ağırlıkla mükemmel uyumu.", isNew: true },
        { id: "luxury_marble", category: "luxury", name: "🏛️ Mermer Asalet", description: "Beyaz mermer dokusu üzerine ince siyah estetik hatlar.", isNew: true },

        // Lifestyle & Hobi
        { id: "life_gamer", category: "lifestyle", name: "🎮 Gamer Kırmızı", description: "Karbon fiber doku ve dinamik neon kırmızı oyuncu tasarımı.", isNew: true },
        { id: "life_travel", category: "lifestyle", name: "🗺️ Gezgin Haritası", description: "Eski harita desenleri ve toprak tonlarıyla macera ruhu.", isNew: true },
        { id: "life_zen", category: "lifestyle", name: "🎋 Zen Bahçesi", description: "Sakinleştirici boşluklar ve huzurlu doğal yeşil tonları.", isNew: true },

        // Future & Glass
        { id: "future_holo", category: "future", name: "🛸 Hologram Pro", description: "Işık kırılmalı kenarlar ve fütüristik parlayan hologram kartları.", isNew: true },
        { id: "future_glass", category: "future", name: "❄️ Buzul Cam (Frost)", description: "Bulanık cam arkası efekti ve pastel yüzen ışık balonları.", isNew: true },

        // Büyülü Akış (Dream)
        { id: "dream_mist", category: "dream", name: "☁️ Sisli Rüya", description: "Pastel renk geçişleri ve yumuşak sis efektli huzurlu tasarım.", isNew: true },
        { id: "dream_nebula", category: "dream", name: "🌌 Kozmik Bulut", description: "Derin uzay moru ve parlayan nebulalarla dolu masalsı atmosfer.", isNew: true },

        // Gizemli Gece (Dark)
        { id: "dark_onyx", category: "dark", name: "🕶️ Saf Oniks", description: "Tam karanlık, sadece en önemli detayların parladığı gizemli şıklık.", isNew: true },
        { id: "dark_stealth", category: "dark", name: "⬛ Karbon Stealth", description: "Mat siyah karbon fiber doku ve teknolojik kırmızı detaylar.", isNew: true },

        // Prizmatik Işık (Light)
        { id: "light_prism", category: "light", name: "🌈 Prizma Yansıması", description: "Işığın kırılma efektleri ve gökkuşağı çizgileriyle modern beyaz.", isNew: true },
        { id: "light_solar", category: "light", name: "☀️ Gün Batımı", description: "Sıcak turuncu ve altın sarısı güneş ışığı huzmeleri.", isNew: true },

        // Siber Gerçeklik
        { id: "cyber_glitch", category: "cyber", name: "📟 Glitch Art", description: "Dijital bozulma efektleri ve vhs estetiğiyle siber bir dünya.", isNew: true },
        { id: "cyber_vapor", category: "cyber", name: "🌸 Vaporwave", description: "80'lerin Japon estetiği, pembe-mavi tonları ve heykeller.", isNew: true },

        // Antik Miras
        { id: "antique_gold", category: "antique", name: "🏺 Antik Altın", description: "Eskitilmiş altın dokular ve klasik Roma desenleri.", isNew: true },
        { id: "antique_myth", category: "antique", name: "🏛️ Mitolojik", description: "Yunan mitolojisinden esintiler ve mermer sütun detayları.", isNew: true },

        // Likit Akış
        { id: "liquid_lava", category: "liquid", name: "🔥 Lav Akışı", description: "Akışkan kırmızı ve turuncu tonları, organik hareketler.", isNew: true },
        { id: "liquid_ocean", category: "liquid", name: "🌊 Derin Okyanus", description: "Su altı efektleri ve yavaşça süzülen dalgalar.", isNew: true },

        // Dinamik Pop
        { id: "pop_comic", category: "pop", name: "💥 Pop Comic", description: "Çizgi roman tarzı konuşma balonları ve canlı noktalar.", isNew: true },
        { id: "pop_graffiti", category: "pop", name: "🎨 Sokak Sanatı", description: "Grafiti dokuları ve sprey boya sıçramaları.", isNew: true },

        // Zihinsel Odak
        { id: "zen_garden", category: "zen", name: "🎍 Zen Bahçesi", description: "Taş ve kum desenleri, minimalist denge ve huzur.", isNew: true },
        { id: "zen_focus", category: "zen", name: "🎯 Derin Odak", description: "Zihni dinlendiren sade geometrik formlar.", isNew: true },

        // Macera Ruhu
        { id: "adventure_peak", category: "adventure", name: "🏔️ Zirve Hikayesi", description: "Dağ manzaraları ve tırmanış esintili detaylar.", isNew: true },
        { id: "adventure_safari", category: "adventure", name: "🐆 Vahşi Safari", description: "Toprak tonları ve vahşi doğa desenleri.", isNew: true },

        // İlahi Işıltı (Celestial)
        { id: "celestial_star", category: "celestial", name: "⭐ Yıldız Tozu", description: "Parlayan yıldızlar ve gece mavisi derinlik.", isNew: true },
        { id: "celestial_sun", category: "celestial", name: "🔆 Güneş Tanrısı", description: "Altın sarısı ışık patlamaları ve antik güneş sembolleri.", isNew: true },

        // Yalın Estetik (Minimal)
        { id: "minimal_pure", category: "minimal", name: "⚪ Bembeyaz", description: "Sıfır gürültü, sadece saf içerik odağı.", isNew: true },
        { id: "minimal_graphite", category: "minimal", name: "🌑 Grafit Gri", description: "Mat gri tonları ve incecik kalem çizgileri.", isNew: true },

        // Endüstriyel Hamlık (Industrial)
        { id: "ind_concrete", category: "industrial", name: "🏗️ Brüt Beton", description: "Ham beton dokusu ve inşaat estetiği.", isNew: true },
        { id: "ind_rusty", category: "industrial", name: "⚙️ Paslı Metal", description: "Eskitilmiş demir ve endüstriyel pas detayları.", isNew: true },

        // Enerji Patlaması (Vibrant)
        { id: "vibe_bolt", category: "vibrant", name: "⚡ Yıldırım Hızı", description: "Yüksek kontrast, elektrik sarısı ve siyah uyumu.", isNew: true },
        { id: "vibe_pulse", category: "vibrant", name: "💓 Nabız Atışı", description: "Dinamik vuruşlar ve kalp atışı ritimli çizgiler.", isNew: true },

        // Hanedan Mirası (Royal)
        { id: "royal_velvet", category: "royal", name: "👑 Mor Kadife", description: "Kraliyet moru ve altın işlemeli detaylar.", isNew: true },
        { id: "royal_emerald", category: "royal", name: "💎 Zümrüt Saray", description: "Derin zümrüt yeşili ve elmas pırıltıları.", isNew: true },

        // Yüksek Teknoloji (Tech)
        { id: "tech_core", category: "tech", name: "🧬 Çekirdek Gücü", description: "Moleküler animasyonlar ve DNA süzülmeleri.", isNew: true },
        { id: "tech_atom", category: "tech", name: "⚛️ Atomik Yapı", description: "Parçacık fiziği ve kuantum enerji efektleri.", isNew: true },

        // Metaverse & 3D
        { id: "meta_portal", category: "meta", name: "🌀 Metaverse Portal", description: "3D derinlik hissi veren parlayan bir geçit.", isNew: true },
        { id: "meta_pixel", category: "meta", name: "👾 8-Bit Evren", description: "Piksel piksel bir dünya ve retro dijital parıltılar.", isNew: true },

        // 3D Sürükleyici (Immersive)
        { id: "3d_frost", category: "3d", name: "❄️ 3D Buzul", description: "Buz kristalleri, neon mavi halka ve karlı dağ atmosferi.", isNew: true },
        { id: "3d_magma", category: "3d", name: "🌋 3D Volkan", description: "Lavanta-tur. gradient butonlar, kor ateşi parıltısı ve sıcak enerji.", isNew: true },
        { id: "3d_cyber", category: "3d", name: "🌃 3D Siber Şehir", description: "Matrix yağmuru, neon ızgara ve cyberpunk gece atmosferi.", isNew: true },
        { id: "3d_aurora", category: "3d", name: "✨ 3D Aurora", description: "Kuzey ışıkları geçişleri, shimmer efektli butonlar ve mistik atmosfer.", isNew: true },
        { id: "3d_neoncity", category: "3d", name: "🌆 3D Neon City", description: "Tokyo gecesi, dikey neon yağmuru ve parlayan tabela butonlar.", isNew: true },
        { id: "3d_galaxy", category: "3d", name: "🌌 3D Galaxy", description: "Derin uzay nebulası, dönen galaksi bulutu ve yıldız tozu butonlar.", isNew: true },
        { id: "3d_luxegold", category: "3d", name: "🏆 3D Luxe Gold", description: "Sıvı altın efekti, metalik gold butonlar ve premium lüks doku.", isNew: true },
        { id: "3d_hologram", category: "3d", name: "💿 3D Hologram", description: "İridyum gökkuşağı yansıması, krom butonlar ve prizmatik ızgara.", isNew: true },
        { id: "3d_quantum", category: "3d", name: "🧬 3D Quantum Liquid", description: "Oval (pill) butonlar, hareketli akışkanlar ve ileri seviye derinlik.", isNew: true },

        // Elite Modern (Image inspired)
        { id: "elite_pink", category: "elite", name: "💖 Elite Pink Wave", description: "Modern eğrisel başlık, pembe-turuncu geçiş ve profesyonel butonlar.", isNew: true },
        { id: "elite_blue", category: "elite", name: "💙 Elite Ocean Wave", description: "Derin okyanus mavisi geçişleri ve ferah modern tasarım.", isNew: true },
        { id: "elite_purple", category: "elite", name: "💜 Elite Violet Wave", description: "Asil mor geçişler ve premium minimalist yaklaşım.", isNew: true },
        { id: "elite_emerald", category: "elite", name: "💚 Elite Mint Wave", description: "Taze nane yeşili geçişler ve teknolojik şıklık.", isNew: true },
        { id: "elite_sunset", category: "elite", name: "🧡 Elite Sunset Wave", description: "Sıcak gün batımı tonları ve enerjik modern çizgiler.", isNew: true },

        // Athlete Pro
        { id: "athletic_pro", category: "athletic", name: "🏆 Athlete Pro (Dark)", description: "Yüksek performans odaklı, dinamik ve maskülen sporcu tasarımı.", isNew: true },
        { id: "athletic_football", category: "athletic", name: "⚽ Football Pro", description: "Futbolcular için yeşil saha ve enerji odaklı özel tasarım.", isNew: true },
        { id: "athletic_basketball", category: "athletic", name: "🏀 Basketball Pro", description: "Basketbolcular için turuncu vurgulu, sert hatlı parke estetiği.", isNew: true },
        { id: "athletic_tennis", category: "athletic", name: "🎾 Tennis Pro", description: "Tenisçiler için asil, raket/top vurgulu modern kort tasarımı.", isNew: true },
        
        // Turizm & Seyahat
        { id: "tour_resort", category: "tourism", name: "🌴 Resort & Spa", description: "Turkuaz deniz esintisi, lüks otel ve dinlenme odaklı ferah tasarım.", isNew: true },
        { id: "tour_adventure", category: "tourism", name: "🌋 Safari & Macera", description: "Toprak tonları, vahşi doğa ve macera tutkunları için dinamik hatlar.", isNew: true },
        { id: "tour_yacht", category: "tourism", name: "⛵ Yat & Yelken", description: "Lacivert ve beyazın asaletinde, lüks denizcilik ve charter odaklı.", isNew: true },
        { id: "tour_guide", category: "tourism", name: "🎒 Rehber / Gezgin", description: "Kişisel gezi notları tadında, harita detaylı ve dinamik bir yapı.", isNew: true },
        { id: "tour_agency", category: "tourism", name: "✈️ Tatil Acentesi", description: "Dünya turu odaklı, güven veren kurumsal ve renkli bir atmosfer.", isNew: true },
        { id: "tour_winter", category: "tourism", name: "❄️ Kayak & Kış Turizmi", description: "Buz mavisi ve kristal beyaz tonlarında kış sporları estetiği.", isNew: true }
    ]

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

    const aiBlock = blocks?.find((b: any) => b.type === 'ai_assistant')
    const [aiConfig, setAiConfig] = useState(aiBlock?.content || {
        isEnabled: true,
        assistantName: "Kardly AI",
        greeting: "",
        instructions: "",
        knowledgeBase: []
    })
    const [newKbPair, setNewKbPair] = useState({ q: "", a: "" })

    // Update aiConfig when blocks are loaded
    useEffect(() => {
        const ai = blocks?.find((b: any) => b.type === 'ai_assistant')
        if (ai) setAiConfig(ai.content)
    }, [blocks])

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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setShowToast(t('widgetCopied') || "Kopyalandı!")
        setTimeout(() => setShowToast(null), 2000)
    }

    const handleSave = async (overrides?: any) => {
        if (!isTermsAccepted && !overrides?.hasAcceptedTerms) {
            setShowToast(t('acceptTermsError'))
            setTimeout(() => setShowToast(null), 4000)
            return
        }
        setIsSaving(true)
        try {
            const validation = profileSchema.safeParse({
                username: overrides?.username ?? profileData.username,
                displayName: overrides?.name ?? profileData.name ?? session?.user?.name ?? "",
                slogan: overrides?.slogan ?? profileData.slogan ?? "",
                bio: overrides?.bio ?? profileData.bio ?? "",
                phone: overrides?.phone ?? profileData.phone ?? "",
                occupation: overrides?.occupation ?? profileData.occupation ?? "",
                targetAudience: overrides?.targetAudience ?? profileData.targetAudience ?? "",
                paymentLink: overrides?.paymentLink ?? profileData.paymentLink ?? "",
                youtubeVideoUrl: overrides?.youtubeVideoUrl ?? profileData.youtubeVideoUrl ?? "",
                image: profileData.image ?? "",
                profileBgImage: profileData.profileBgImage ?? ""
            })

            if (!validation.success) {
                const firstError = validation.error.issues[0].message
                setShowToast(firstError)
                setTimeout(() => setShowToast(null), 4000)
                setIsSaving(false)
                return
            }

            const res = await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: overrides?.username ?? profileData.username,
                    slogan: overrides?.slogan ?? profileData.slogan,
                    bio: overrides?.bio ?? profileData.bio,
                    phone: overrides?.phone ?? profileData.phone,
                    socialLinks: overrides?.socialLinks ?? profileData.socialLinks,
                    themeColor: overrides?.themeColor ?? profileData.themeColor,
                    bioColor: overrides?.bioColor ?? profileData.bioColor,
                    bioFontFamily: overrides?.bioFontFamily ?? profileData.bioFontFamily,
                    bioFontSize: overrides?.bioFontSize ?? profileData.bioFontSize,
                    sloganColor: overrides?.sloganColor ?? profileData.sloganColor,
                    sloganFontFamily: overrides?.sloganFontFamily ?? profileData.sloganFontFamily,
                    sloganFontSize: overrides?.sloganFontSize ?? profileData.sloganFontSize,
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
                    showVideoAsProfile: overrides?.showVideoAsProfile ?? profileData.showVideoAsProfile,
                    isCatalog: overrides?.isCatalog ?? profileData.isCatalog,
                    paymentLink: overrides?.paymentLink ?? profileData.paymentLink,
                    paymentType: overrides?.paymentType ?? profileData.paymentType,
                    animationStyle: overrides?.animationStyle ?? profileData.animationStyle,
                    profileBgImage: overrides?.profileBgImage ?? profileData.profileBgImage,
                    businessCardTemplateId: overrides?.businessCardTemplateId ?? profileData.businessCardTemplateId,
                    businessCardOrientation: overrides?.businessCardOrientation ?? profileData.businessCardOrientation,
                    qrColorDark: overrides?.qrColorDark ?? profileData.qrColorDark,
                    qrColorLight: overrides?.qrColorLight ?? profileData.qrColorLight,
                    hasAcceptedTerms: isTermsAccepted,
                    showInHub: overrides?.showInHub ?? profileData.showInHub,
                    timezone: profileData.timezone
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
                setShowToast(err.error || "Kaydetme başarısız! Lütfen tekrar deneyin.")
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
        let newList;
        if (editingServiceIndex !== null) {
            newList = [...serviceList]
            newList[editingServiceIndex] = newService
            setShowToast("Uzmanlık güncellendi!")
        } else {
            newList = [...serviceList, newService]
            setShowToast("Uzmanlık eklendi!")
        }
        setServiceList(newList)
        setShowServiceModal(false)
        setEditingServiceIndex(null)
        setNewService({ title: "", description: "" })
        handleSave({ services: newList })
        setTimeout(() => setShowToast(null), 3000)
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
            const endpoint = editingProduct ? `/api/products?id=${editingProduct.id}` : "/api/products"
            const method = editingProduct ? "PUT" : "POST"

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            })
            if (res.ok) {
                const updatedProduct = await res.json()
                if (editingProduct) {
                    setProductList(productList.map((p: any) => p.id === editingProduct.id ? updatedProduct : p))
                    setShowToast(t('projectUpdated'))
                } else {
                    setProductList([updatedProduct, ...productList])
                    setShowToast(t('itemAdded'))
                }
                setShowProductModal(false)
                setEditingProduct(null)
                setNewProduct({ name: "", description: "", price: "", link: "", image: "" })
                setTimeout(() => setShowToast(null), 3000)
            }
        } catch (err) {
            console.error(err)
            setShowToast(t('actionFailed'))
            setTimeout(() => setShowToast(null), 3000)
        } finally {
            setIsProductSaving(false)
        }
    }

    const handleDeleteProduct = async (id: string) => {
        if (!confirm(t('deleteConfirm'))) return
        try {
            const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setProductList(productList.filter((p: any) => p.id !== id))
                setShowToast(t('itemDeleted'))
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
                setShowToast(!currentStatus ? t('reviewConfirmed') : t('reviewHidden'))
                setTimeout(() => setShowToast(null), 3000)
            }
        } catch (err) { console.error(err) }
    }

    const handleDeleteReview = async (id: string) => {
        if (!confirm(t('deleteConfirm'))) return
        try {
            const res = await fetch("/api/review/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
            if (res.ok) {
                setReviewList(reviewList.filter((r: any) => r.id !== id))
                setShowToast(t('itemDeleted'))
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
                setShowToast(status === "confirmed" ? t('appointmentConfirmed') : t('appointmentCompleted'))
                setTimeout(() => setShowToast(null), 3000)
                setSelectedAppointment(null)
            }
        } catch (err) { console.error(err) }
    }

    const handleDeleteAppointment = async (id: string) => {
        if (!confirm(t('deleteConfirm'))) return
        try {
            const res = await fetch("/api/appointments/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
            if (res.ok) {
                setAppointmentList(appointmentList.filter((a: any) => a.id !== id))
                setShowToast(t('itemDeleted'))
                setTimeout(() => setShowToast(null), 3000)
                setSelectedAppointment(null)
            }
        } catch (err) { console.error(err) }
    }

    const updateSocialLink = (platform: string, url: string, isHero?: boolean) => {
        const currentLinks = Array.isArray(profileData.socialLinks) ? [...profileData.socialLinks] : []
        const index = currentLinks.findIndex((l: any) => l.platform === platform)

        if (index > -1) {
            currentLinks[index] = { ...currentLinks[index], platform, url, isHero: isHero !== undefined ? isHero : currentLinks[index].isHero }
        } else {
            currentLinks.push({ platform, url, isHero: isHero || false })
        }

        setProfileData({ ...profileData, socialLinks: currentLinks })
    }

    const toggleSocialHero = (platform: string) => {
        const currentLinks = Array.isArray(profileData.socialLinks) ? [...profileData.socialLinks] : []
        const index = currentLinks.findIndex((l: any) => l.platform === platform)

        if (index > -1) {
            currentLinks[index] = { ...currentLinks[index], isHero: !currentLinks[index].isHero }
        } else {
            // If it doesn't exist, we can't really make it hero without a URL, 
            // but for 'phone' we might take it from profileData.phone
            const url = platform === 'phone' ? profileData.phone : ""
            currentLinks.push({ platform, url, isHero: true })
        }

        setProfileData({ ...profileData, socialLinks: currentLinks })
    }

    const isSocialHero = (platform: string) => {
        return (profileData.socialLinks as any[])?.find((l: any) => l.platform === platform)?.isHero || false
    }

    const getSocialUrl = (platform: string) => {
        return (profileData.socialLinks as any[])?.find((l: any) => l.platform === platform)?.url || ""
    }

    const currentPlan = "pro"

    return (
        <>
            <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex overflow-hidden relative">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div
                    animate={{
                        x: [0, 40, 0],
                        y: [0, -40, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-rose-400/10 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-400/10 blur-[120px] rounded-full"
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')] opacity-[0.03]" />
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
                    <div className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border bg-primary border-primary/20 text-white">
                        <span className="font-bold text-sm tracking-tight">{showToast}</span>
                    </div>
                </div>
            )}

            {/* Mobile Header Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-50 flex items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200/50">
                        <Layout className="text-white w-5 h-5" />
                    </div>
                    <span className="text-lg font-black tracking-tighter">Kardly<span className="text-rose-500">.site</span></span>
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
                "fixed inset-y-0 left-0 z-[60] w-72 border-r border-slate-200 bg-white p-6 flex flex-col transition-transform duration-300 overflow-y-auto no-scrollbar lg:relative lg:translate-x-0 lg:z-10",
                isSidebarOpen ? "translate-x-0 shadow-2xl shadow-slate-200/50" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between lg:justify-start gap-3 mb-4">
                    <Link href="/" className="flex items-center gap-3.5 group">
                        <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200/40 group-hover:rotate-6 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-600 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Layout className="text-white w-5 h-5 relative z-10" />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tighter text-slate-950 flex items-center">
                                Kardly<span className="text-rose-500">.site</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-0.5 block">Dashboard PRO</span>
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
                        icon={<Monitor className="w-5 h-5" />}
                        label={t('overview') || "Genel Bakış"}
                        active={activeTab === "overview"}
                        onClick={() => {
                            setActiveTab("overview")
                            setIsSidebarOpen(false)
                        }}
                    />
                    <NavItem
                        icon={<Compass className="w-5 h-5" />}
                        label={t('businessHub')}
                        active={activeTab === "network"}
                        onClick={() => {
                            setActiveTab("network")
                            setIsSidebarOpen(false)
                        }}
                    />
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
                        icon={<IdCard className="w-5 h-5" />}
                        label={t('digitalCard')}
                        active={activeTab === "businesscard"}
                        onClick={() => {
                            setActiveTab("businesscard")
                            setIsSidebarOpen(false)
                        }}
                    />

                    <NavItem
                        icon={<Inbox className="w-5 h-5" />}
                        label={t('incomingLeads')}
                        active={activeTab === "leads"}
                        onClick={() => {
                            setActiveTab("leads")
                            setIsSidebarOpen(false)
                        }}
                    />

                    <NavItem
                        icon={<Sparkles className="w-5 h-5" />}
                        label="AI Asistan"
                        active={activeTab === "ai"}
                        onClick={() => {
                            setActiveTab("ai")
                            setIsSidebarOpen(false)
                        }}
                    />

                    <NavItem
                        icon={<Boxes className="w-5 h-5" />}
                        label={t('widgets') || "Araçlar"}
                        active={activeTab === "widgets"}
                        onClick={() => {
                            setActiveTab("widgets")
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
                        label={t('settings') || "Ayarlar"}
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
            <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-auto pt-24 lg:pt-14 relative z-10 pb-32 lg:pb-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-slate-900">{t('welcome')}, <span className="gradient-text">{session?.user?.name}</span> 👋</h1>
                        <p className="text-slate-400 text-sm font-medium tracking-wide">{t('welcomeSub')}</p>
                    </motion.div>
                    {profile && (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <motion.a
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={`https://kardly.site/${profile.username}`}
                                target="_blank"
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all font-black text-[10px] uppercase tracking-widest"
                            >
                                {t('liveSite')} <ExternalLink className="w-4 h-4" />
                            </motion.a>
                            <motion.a
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href={`https://${profile.username}.kardly.site`}
                                target="_blank"
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl shadow-sm hover:border-primary/20 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest group"
                            >
                                <Globe className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" /> {t('viewSubdomain')}
                            </motion.a>
                        </div>
                    )}
                </header>

                {activeTab === "widgets" ? (
                    <div className="space-y-10">
                        <header>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t('widgets')}</h2>
                            <p className="text-sm text-slate-500 font-medium tracking-wide">{t('widgetsSub')}</p>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Widget Configurator */}
                            <div className="space-y-8">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                                    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Zap size={20} />
                                        </div>
                                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Standard Araçlar</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('widgetSelection') || "ARAÇ SEÇİN"}</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {[
                                                { id: "booking", name: t('widgetBooking'), icon: <Calendar size={18} /> },
                                                { id: "lead", name: t('widgetLead'), icon: <MessageSquare size={18} /> },
                                                { id: "ai", name: t('widgetAI'), icon: <Bot size={18} /> },
                                                { id: "video", name: t('widgetVideo'), icon: <Play size={18} /> },
                                                { id: "skills", name: t('widgetSkills'), icon: <Zap size={18} /> },
                                                { id: "countdown", name: t('widgetCountdown'), icon: <Clock size={18} /> },
                                                { id: "portfolio", name: "Portfolyo", icon: <ImageIcon size={18} /> },
                                                { id: "tech", name: "Yazılımcı Seti", icon: <Code size={18} /> },
                                                { id: "blog", name: "Otomatik Blog", icon: <Rss size={18} /> }
                                            ].map(w => (
                                                <button
                                                    key={w.id}
                                                    onClick={() => setActiveWidget(w.id)}
                                                    className={cn(
                                                        "flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
                                                        activeWidget === w.id ? "bg-primary/5 border-primary text-primary shadow-sm" : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                                                    )}
                                                >
                                                    <div className={cn("p-2 rounded-xl", activeWidget === w.id ? "bg-primary/10" : "bg-slate-50")}>
                                                        {w.icon}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-wider">{w.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Widget Specific Config */}
                                    {activeWidget === 'video' && (
                                        <div className="space-y-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('widgetVideoUrl')}</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-white border border-slate-200 p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-primary"
                                                    value={extraWidgetConfig.videoUrl}
                                                    placeholder="https://youtube.com/..."
                                                    onChange={(e) => setExtraWidgetConfig({ ...extraWidgetConfig, videoUrl: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('widgetBtnText')}</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-white border border-slate-200 p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-primary"
                                                    value={extraWidgetConfig.videoBtnText}
                                                    onChange={(e) => setExtraWidgetConfig({ ...extraWidgetConfig, videoBtnText: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeWidget === 'skills' && (
                                        <div className="space-y-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in slide-in-from-top-2">
                                            <div className="space-y-2 text-left">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('widgetSkillsList')}</label>
                                                <textarea
                                                    className="w-full bg-white border border-slate-200 p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-primary min-h-[100px]"
                                                    value={extraWidgetConfig.skills}
                                                    onChange={(e) => setExtraWidgetConfig({ ...extraWidgetConfig, skills: e.target.value })}
                                                />
                                                <p className="text-[9px] opacity-40 font-bold uppercase tracking-wider italic px-1">{t('widgetSkillsHint')}</p>
                                            </div>
                                        </div>
                                    )}

                                    {activeWidget === 'countdown' && (
                                        <div className="space-y-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('widgetTargetDate')}</label>
                                                <input
                                                    type="datetime-local"
                                                    className="w-full bg-white border border-slate-200 p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-primary"
                                                    value={extraWidgetConfig.countdownDate}
                                                    onChange={(e) => setExtraWidgetConfig({ ...extraWidgetConfig, countdownDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('widgetCtdTitle')}</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-white border border-slate-200 p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-primary"
                                                    value={extraWidgetConfig.countdownTitle}
                                                    onChange={(e) => setExtraWidgetConfig({ ...extraWidgetConfig, countdownTitle: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeWidget === 'portfolio' && (
                                        <div className="space-y-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in slide-in-from-top-2">
                                            <div className="space-y-3 text-left">

                                                <div className="flex items-center justify-between">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">PORTFOLYO RESİMLERİ</label>
                                                    <button
                                                        onClick={() => document.getElementById('portfolio-upload')?.click()}
                                                        disabled={isUploadingPortfolio}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-50"
                                                    >
                                                        {isUploadingPortfolio ? <Clock className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                                                        RESİM YÜKLE
                                                    </button>
                                                    <input
                                                        id="portfolio-upload"
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={async (e) => {
                                                            const files = Array.from(e.target.files || []);
                                                            if (files.length === 0) return;

                                                            setIsUploadingPortfolio(true);
                                                            try {
                                                                const processedUrls: string[] = [];

                                                                for (const file of files) {
                                                                    if (!file.type.startsWith('image/')) continue;

                                                                    if (file.size > 2 * 1024 * 1024) {
                                                                        setShowToast(`${file.name} çok büyük (Max 2MB).`);
                                                                        continue;
                                                                    }

                                                                    const base64 = await new Promise<string>((resolve, reject) => {
                                                                        const reader = new FileReader();
                                                                        reader.onload = () => resolve(reader.result as string);
                                                                        reader.onerror = reject;
                                                                        reader.readAsDataURL(file);
                                                                    });
                                                                    processedUrls.push(base64);
                                                                }

                                                                if (processedUrls.length > 0) {
                                                                    setExtraWidgetConfig(prev => {
                                                                        const currentImages = prev.portfolioImages ? prev.portfolioImages.split('|').filter(Boolean) : [];
                                                                        const newImages = [...currentImages, ...processedUrls].join('|');
                                                                        return { ...prev, portfolioImages: newImages };
                                                                    });
                                                                    setShowToast(`${processedUrls.length} resim eklendi.`);
                                                                }
                                                                setTimeout(() => setShowToast(null), 3000);
                                                            } catch (err) {
                                                                console.error("Processing error:", err);
                                                                setShowToast("İşlem sırasında bir hata oluştu.");
                                                            } finally {
                                                                setIsUploadingPortfolio(false);
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                {/* Portfolio Gallery Preview */}
                                                {extraWidgetConfig.portfolioImages ? (
                                                    <div className="grid grid-cols-4 gap-2 border border-dashed border-slate-200 p-2 rounded-2xl bg-white max-h-[400px] overflow-y-auto">
                                                        {extraWidgetConfig.portfolioImages.split('|').filter(Boolean).map((img, idx, all) => (
                                                            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm">
                                                                <img src={img} className="w-full h-full object-cover" alt="" />

                                                                {/* Controls Overlay */}
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                                                                    <div className="flex justify-end">
                                                                        <button
                                                                            onClick={() => {
                                                                                setExtraWidgetConfig(prev => {
                                                                                    const images = prev.portfolioImages.split('|').filter(Boolean);
                                                                                    images.splice(idx, 1);
                                                                                    return { ...prev, portfolioImages: images.join('|') };
                                                                                });
                                                                            }}
                                                                            className="p-1 px-1.5 bg-rose-500 text-white rounded-lg hover:scale-110 active:scale-95 transition-all shadow-lg"
                                                                            title="Sil"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>

                                                                    <div className="flex justify-center gap-1 pb-1">
                                                                        <button
                                                                            disabled={idx === 0}
                                                                            onClick={() => {
                                                                                setExtraWidgetConfig(prev => {
                                                                                    const images = prev.portfolioImages.split('|').filter(Boolean);
                                                                                    [images[idx - 1], images[idx]] = [images[idx], images[idx - 1]];
                                                                                    return { ...prev, portfolioImages: images.join('|') };
                                                                                });
                                                                            }}
                                                                            className="p-1 bg-white/20 backdrop-blur-md text-white rounded-md hover:bg-white/40 disabled:opacity-30 disabled:hover:bg-white/20 transition-all font-bold"
                                                                        >
                                                                            <ChevronLeft size={14} />
                                                                        </button>
                                                                        <button
                                                                            disabled={idx === all.length - 1}
                                                                            onClick={() => {
                                                                                setExtraWidgetConfig(prev => {
                                                                                    const images = prev.portfolioImages.split('|').filter(Boolean);
                                                                                    [images[idx + 1], images[idx]] = [images[idx], images[idx + 1]];
                                                                                    return { ...prev, portfolioImages: images.join('|') };
                                                                                });
                                                                            }}
                                                                            className="p-1 bg-white/20 backdrop-blur-md text-white rounded-md hover:bg-white/40 disabled:opacity-30 disabled:hover:bg-white/20 transition-all font-bold"
                                                                        >
                                                                            <ChevronRight size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="py-8 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-slate-400 bg-white/50">
                                                        <ImageIcon size={24} className="opacity-20" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest italic">Henüz resim eklenmedi</span>
                                                    </div>
                                                )}

                                                <details className="group">
                                                    <summary className="text-[9px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-primary transition-colors flex items-center gap-1 list-none outline-none">
                                                        <Code size={10} /> Ham Veri (Düzenle)
                                                    </summary>
                                                    <textarea
                                                        className="w-full bg-white border border-slate-200 p-3.5 rounded-xl text-[10px] font-mono focus:outline-none focus:border-primary min-h-[80px] mt-2 shadow-inner"
                                                        value={extraWidgetConfig.portfolioImages}
                                                        placeholder="https://...base64_veya_url|https://..."
                                                        onChange={(e) => setExtraWidgetConfig({ ...extraWidgetConfig, portfolioImages: e.target.value })}
                                                    />
                                                </details>
                                                <p className="text-[9px] opacity-40 font-bold uppercase tracking-wider italic px-1">Resimleri yükleyin veya URL'leri dikey çizgi (|) ile ayırarak girin.</p>

                                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">GitHub Profili (İsteğe Bağlı)</label>
                                                        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-primary">
                                                            <div className="px-3 text-slate-400"><Github size={16} /></div>
                                                            <input
                                                                type="text"
                                                                className="w-full bg-white p-3.5 text-xs font-bold focus:outline-none"
                                                                placeholder="https://github.com/..."
                                                                value={extraWidgetConfig.githubUrl || ""}
                                                                onChange={(e) => setExtraWidgetConfig({ ...extraWidgetConfig, githubUrl: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Dribbble Profili (İsteğe Bağlı)</label>
                                                        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-primary">
                                                            <div className="px-3 text-slate-400"><Dribbble size={16} /></div>
                                                            <input
                                                                type="text"
                                                                className="w-full bg-white p-3.5 text-xs font-bold focus:outline-none"
                                                                placeholder="https://dribbble.com/..."
                                                                value={extraWidgetConfig.dribbbleUrl || ""}
                                                                onChange={(e) => setExtraWidgetConfig({ ...extraWidgetConfig, dribbbleUrl: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Behance Profili (İsteğe Bağlı)</label>
                                                        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-primary">
                                                            <div className="px-3 text-slate-400"><Palette size={16} /></div>
                                                            <input
                                                                type="text"
                                                                className="w-full bg-white p-3.5 text-xs font-bold focus:outline-none"
                                                                placeholder="https://behance.net/..."
                                                                value={extraWidgetConfig.behanceUrl || ""}
                                                                onChange={(e) => setExtraWidgetConfig({ ...extraWidgetConfig, behanceUrl: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeWidget === 'tech' && (
                                        <div className="space-y-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in slide-in-from-top-2">
                                            <div className="space-y-1 text-left">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">KULLANDIĞINIZ TEKNOLOJİLER</label>
                                                <textarea
                                                    className="w-full bg-white border border-slate-200 p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-primary min-h-[100px]"
                                                    value={extraWidgetConfig.techStack}
                                                    placeholder="React, Next.js, TypeScript, Node.js"
                                                    onChange={(e) => setExtraWidgetConfig({ ...extraWidgetConfig, techStack: e.target.value })}
                                                />
                                                <p className="text-[9px] opacity-40 font-bold uppercase tracking-wider italic px-1">Teknolojileri virgülle ayırarak ekleyin.</p>
                                            </div>
                                        </div>
                                    )}

                                    {activeWidget === 'blog' && (
                                        <div className="space-y-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Medium / Substack / RSS URL</label>
                                                <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-primary">
                                                    <div className="px-3 text-slate-400"><Rss size={16} /></div>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-white p-3.5 text-xs font-bold focus:outline-none"
                                                        placeholder="https://medium.com/feed/@kullaniciadi"
                                                        value={extraWidgetConfig.blogRssUrl || ""}
                                                        onChange={(e) => setExtraWidgetConfig({ ...extraWidgetConfig, blogRssUrl: e.target.value })}
                                                    />
                                                </div>
                                                <p className="text-[9px] opacity-40 font-bold uppercase tracking-wider italic px-1 pt-2">
                                                    Medium için: https://medium.com/feed/@kullaniciadi<br />
                                                    Substack için: https://kullanici.substack.com/feed<br />
                                                    Herhangi bir RSS bağlantısı da kullanılabilir.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('widgetStyle')}</label>
                                        <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                                            {[
                                                { id: "floating", name: t('widgetFloating'), icon: <Zap size={14} /> },
                                                { id: "embedded", name: t('widgetEmbedded'), icon: <Monitor size={14} /> }
                                            ].map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => setWidgetStyle(s.id)}
                                                    className={cn(
                                                        "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                                        widgetStyle === s.id ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"
                                                    )}
                                                >
                                                    {s.icon} {s.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('widgetEmbedCode')}</label>
                                            <button
                                                onClick={() => {
                                                    let scriptAttrs = `data-user="${profile?.username}" data-type="${activeWidget}" data-style="${widgetStyle}"`;
                                                    if (activeWidget === 'video') scriptAttrs += ` data-vUrl="${extraWidgetConfig.videoUrl}" data-btn="${extraWidgetConfig.videoBtnText}"`;
                                                    if (activeWidget === 'skills') scriptAttrs += ` data-sList="${extraWidgetConfig.skills}"`;
                                                    if (activeWidget === 'countdown') scriptAttrs += ` data-date="${extraWidgetConfig.countdownDate}" data-title="${extraWidgetConfig.countdownTitle}"`;
                                                    if (activeWidget === 'portfolio') {
                                                        scriptAttrs += ` data-pImages="${extraWidgetConfig.portfolioImages}"`;
                                                        if (extraWidgetConfig.githubUrl) scriptAttrs += ` data-ghUrl="${encodeURIComponent(extraWidgetConfig.githubUrl)}"`;
                                                        if (extraWidgetConfig.dribbbleUrl) scriptAttrs += ` data-drUrl="${encodeURIComponent(extraWidgetConfig.dribbbleUrl)}"`;
                                                        if (extraWidgetConfig.behanceUrl) scriptAttrs += ` data-bhUrl="${encodeURIComponent(extraWidgetConfig.behanceUrl)}"`;
                                                    }
                                                    if (activeWidget === 'tech') scriptAttrs += ` data-tList="${extraWidgetConfig.techStack}"`;
                                                    if (activeWidget === 'blog') scriptAttrs += ` data-rss="${encodeURIComponent(extraWidgetConfig.blogRssUrl)}"`;

                                                    const code = `<!-- Kardly Widget: ${activeWidget} -->\n<div id="kardly-widget-${activeWidget}"></div>\n<script src="https://www.kardly.site/api/widget.js" ${scriptAttrs}></script>`;
                                                    copyToClipboard(code);
                                                    // Otomatik olarak harici araç koduna da yerleştir
                                                    setExternalWidget({ ...externalWidget, code, title: externalWidget.title || (activeWidget === 'video' ? 'Video' : activeWidget === 'skills' ? 'Yetenekler' : activeWidget === 'countdown' ? 'Geri Sayım' : activeWidget === 'portfolio' ? 'Portfolyo' : activeWidget === 'tech' ? 'Yazılımcı Seti' : activeWidget === 'blog' ? 'Blog Akışı' : activeWidget === 'booking' ? 'Randevu' : activeWidget === 'lead' ? 'İletişim' : 'AI Asistan') });
                                                }}
                                                className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:opacity-70"
                                            >
                                                <Download size={12} /> {t('widgetCopyCode')}
                                            </button>
                                        </div>
                                        <div className="p-6 bg-slate-900 rounded-[2rem] relative group text-left">
                                            <code className="text-[11px] text-primary/80 font-mono leading-relaxed block break-all whitespace-pre-wrap">
                                                {(() => {
                                                    let urlParams = `?widget=${activeWidget}&embed=true&style=${widgetStyle}`;
                                                    if (activeWidget === 'video') urlParams += `&vUrl=${encodeURIComponent(extraWidgetConfig.videoUrl)}&btn=${encodeURIComponent(extraWidgetConfig.videoBtnText)}`;
                                                    if (activeWidget === 'skills') urlParams += `&sList=${encodeURIComponent(extraWidgetConfig.skills)}`;
                                                    if (activeWidget === 'countdown') urlParams += `&date=${encodeURIComponent(extraWidgetConfig.countdownDate)}&title=${encodeURIComponent(extraWidgetConfig.countdownTitle)}`;
                                                    if (activeWidget === 'portfolio') {
                                                        urlParams += `&pImages=${encodeURIComponent(extraWidgetConfig.portfolioImages)}`;
                                                        if (extraWidgetConfig.githubUrl) urlParams += `&ghUrl=${encodeURIComponent(extraWidgetConfig.githubUrl)}`;
                                                        if (extraWidgetConfig.dribbbleUrl) urlParams += `&drUrl=${encodeURIComponent(extraWidgetConfig.dribbbleUrl)}`;
                                                        if (extraWidgetConfig.behanceUrl) urlParams += `&bhUrl=${encodeURIComponent(extraWidgetConfig.behanceUrl)}`;
                                                    }
                                                    if (activeWidget === 'tech') urlParams += `&tList=${encodeURIComponent(extraWidgetConfig.techStack)}`;
                                                    if (activeWidget === 'blog') urlParams += `&rssUrl=${encodeURIComponent(extraWidgetConfig.blogRssUrl)}`;

                                                    let portfolioDataAttrs = '';
                                                    if (activeWidget === 'portfolio') {
                                                        portfolioDataAttrs = ` data-pImages="${(extraWidgetConfig.portfolioImages || "").length > 50 ? extraWidgetConfig.portfolioImages.substring(0, 50) + "..." : extraWidgetConfig.portfolioImages}"`;
                                                        if (extraWidgetConfig.githubUrl) portfolioDataAttrs += ` data-ghUrl="${extraWidgetConfig.githubUrl}"`;
                                                        if (extraWidgetConfig.dribbbleUrl) portfolioDataAttrs += ` data-drUrl="${extraWidgetConfig.dribbbleUrl}"`;
                                                        if (extraWidgetConfig.behanceUrl) portfolioDataAttrs += ` data-bhUrl="${extraWidgetConfig.behanceUrl}"`;
                                                    }

                                                    return `<!-- Kardly Widget: ${activeWidget} -->\n<div id="kardly-widget-${activeWidget}"></div>\n<script src="https://www.kardly.site/api/widget.js" data-user="${profile?.username}" data-type="${activeWidget}" data-style="${widgetStyle}"${activeWidget === 'video' ? ` data-vUrl="${extraWidgetConfig.videoUrl}" data-btn="${extraWidgetConfig.videoBtnText}"` : ""}${activeWidget === 'skills' ? ` data-sList="${extraWidgetConfig.skills}"` : ""}${activeWidget === 'countdown' ? ` data-date="${extraWidgetConfig.countdownDate}" data-title="${extraWidgetConfig.countdownTitle}"` : ""}${portfolioDataAttrs}${activeWidget === 'tech' ? ` data-tList="${extraWidgetConfig.techStack}"` : ""}${activeWidget === 'blog' ? ` data-rss="${extraWidgetConfig.blogRssUrl}"` : ""}></script>`;
                                                })()}
                                            </code>
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-b border-slate-50 pb-8">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('widgetShareLink')}</label>
                                        <div className="flex gap-2 text-left">
                                            <input
                                                type="text"
                                                readOnly
                                                value={(() => {
                                                    let link = `https://kardly.site/${profile?.username}?widget=${activeWidget}`;
                                                    if (activeWidget === 'video') link += `&vUrl=${encodeURIComponent(extraWidgetConfig.videoUrl)}&btn=${encodeURIComponent(extraWidgetConfig.videoBtnText)}`;
                                                    if (activeWidget === 'skills') link += `&sList=${encodeURIComponent(extraWidgetConfig.skills)}`;
                                                    if (activeWidget === 'countdown') link += `&date=${encodeURIComponent(extraWidgetConfig.countdownDate)}&title=${encodeURIComponent(extraWidgetConfig.countdownTitle)}`;
                                                    if (activeWidget === 'portfolio') {
                                                        link += `&pImages=${encodeURIComponent(extraWidgetConfig.portfolioImages)}`;
                                                        if (extraWidgetConfig.githubUrl) link += `&ghUrl=${encodeURIComponent(extraWidgetConfig.githubUrl)}`;
                                                        if (extraWidgetConfig.dribbbleUrl) link += `&drUrl=${encodeURIComponent(extraWidgetConfig.dribbbleUrl)}`;
                                                        if (extraWidgetConfig.behanceUrl) link += `&bhUrl=${encodeURIComponent(extraWidgetConfig.behanceUrl)}`;
                                                    }
                                                    if (activeWidget === 'tech') link += `&tList=${encodeURIComponent(extraWidgetConfig.techStack)}`;
                                                    if (activeWidget === 'blog') link += `&rssUrl=${encodeURIComponent(extraWidgetConfig.blogRssUrl)}`;
                                                    return link;
                                                })()}
                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-600 focus:outline-none"
                                            />
                                            <button
                                                onClick={() => {
                                                    let link = `https://kardly.site/${profile?.username}?widget=${activeWidget}`;
                                                    if (activeWidget === 'video') link += `&vUrl=${encodeURIComponent(extraWidgetConfig.videoUrl)}&btn=${encodeURIComponent(extraWidgetConfig.videoBtnText)}`;
                                                    if (activeWidget === 'skills') link += `&sList=${encodeURIComponent(extraWidgetConfig.skills)}`;
                                                    if (activeWidget === 'countdown') link += `&date=${encodeURIComponent(extraWidgetConfig.countdownDate)}&title=${encodeURIComponent(extraWidgetConfig.countdownTitle)}`;
                                                    if (activeWidget === 'portfolio') {
                                                        link += `&pImages=${encodeURIComponent(extraWidgetConfig.portfolioImages)}`;
                                                        if (extraWidgetConfig.githubUrl) link += `&ghUrl=${encodeURIComponent(extraWidgetConfig.githubUrl)}`;
                                                        if (extraWidgetConfig.dribbbleUrl) link += `&drUrl=${encodeURIComponent(extraWidgetConfig.dribbbleUrl)}`;
                                                        if (extraWidgetConfig.behanceUrl) link += `&bhUrl=${encodeURIComponent(extraWidgetConfig.behanceUrl)}`;
                                                    }
                                                    if (activeWidget === 'tech') link += `&tList=${encodeURIComponent(extraWidgetConfig.techStack)}`;
                                                    if (activeWidget === 'blog') link += `&rssUrl=${encodeURIComponent(extraWidgetConfig.blogRssUrl)}`;
                                                    copyToClipboard(link);
                                                }}
                                                className="px-5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600"
                                            >
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* External Widget Setup */}
                                    <div className="space-y-6 pt-2">
                                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                <Globe size={20} />
                                            </div>
                                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Harici Servis Aracı</h3>
                                        </div>

                                        <div className="space-y-4 text-left">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Araç Başlığı</label>
                                                <input
                                                    type="text"
                                                    placeholder="Örn: Randevu / İletişim Butonu"
                                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900 focus:outline-none focus:border-emerald-500 transition-all font-bold text-xs"
                                                    value={externalWidget.title}
                                                    onChange={(e) => setExternalWidget({ ...externalWidget, title: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Embed / Gömme Kodu</label>
                                                <textarea
                                                    rows={4}
                                                    placeholder="<script src='...' data-id='...'></script>"
                                                    className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl text-emerald-400 focus:outline-none focus:border-emerald-500 transition-all font-mono text-xs overflow-x-auto"
                                                    value={externalWidget.code}
                                                    onChange={(e) => setExternalWidget({ ...externalWidget, code: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-4 text-left">
                                                <div className={cn("p-4 rounded-2xl flex items-center gap-3 border transition-all",
                                                    externalWidget.code.includes('data-style="floating"')
                                                        ? "bg-blue-50 border-blue-500 text-blue-600"
                                                        : "bg-emerald-50 border-emerald-500 text-emerald-600")}>
                                                    {externalWidget.code.includes('data-style="floating"') ? <Zap size={20} /> : <Layout size={20} />}
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        {externalWidget.code.includes('data-style="floating"')
                                                            ? "Bu araç yüzen buton olarak çalışacaktır (Blok gözükmeyecektir)."
                                                            : "Bu araç profilinizde blok olarak görünecektir."}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={async () => {
                                                    if (!externalWidget.code) {
                                                        setShowToast("Lütfen bir gömme kodu girin!");
                                                        return;
                                                    }
                                                    const newBlocks = [...(blocks || [])];
                                                    const externalWidgetWithPos = { ...externalWidget, position: 'inline' };

                                                    if (editingWidgetId) {
                                                        const idx = newBlocks.findIndex(b => b.id === editingWidgetId);
                                                        if (idx > -1) {
                                                            newBlocks[idx] = { ...newBlocks[idx], content: externalWidgetWithPos };
                                                        }
                                                    } else {
                                                        newBlocks.push({
                                                            id: Date.now().toString(),
                                                            type: 'external_widget',
                                                            content: externalWidgetWithPos,
                                                            order: 99,
                                                            isActive: true
                                                        });
                                                    }

                                                    await handleSyncBlocks(newBlocks);
                                                    setShowToast(editingWidgetId ? "Araç başarıyla güncellendi!" : "Yeni araç başarıyla eklendi!");
                                                    setEditingWidgetId(null);
                                                    setExternalWidget({ title: "", code: "", position: "inline" });
                                                    setTimeout(() => setShowToast(null), 3000);
                                                }}
                                                className="w-full py-4 bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
                                            >
                                                {editingWidgetId ? "GÜNCELLE VE KAYDET" : "YENİ ARAÇ OLARAK EKLE"}
                                            </button>

                                            {editingWidgetId && (
                                                <button
                                                    onClick={() => {
                                                        setEditingWidgetId(null);
                                                        setExternalWidget({ title: "", code: "", position: "inline" });
                                                    }}
                                                    className="w-full py-4 bg-slate-100 text-slate-500 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                                                >
                                                    İPTAL ET
                                                </button>
                                            )}

                                            {/* Existing Widgets List */}
                                            {(blocks || []).filter((b: any) => b.type === 'external_widget').length > 0 && (
                                                <div className="space-y-6 pt-10 border-t border-slate-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                            <Boxes size={20} />
                                                        </div>
                                                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Mevcut Araçlar ({(blocks || []).filter((b: any) => b.type === 'external_widget').length})</h3>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4">
                                                        {(blocks || []).filter((b: any) => b.type === 'external_widget').map((block: any) => (
                                                            <div key={block.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                                                                        {block.content?.code?.includes('data-style="floating"') ? <Zap size={18} /> : <Layout size={18} />}
                                                                    </div>
                                                                    <div className="text-left">
                                                                        <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{block.content?.title || "İsimsiz Araç"}</h5>
                                                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                                                            {block.content?.code?.includes('data-style="floating"') ? "Yüzen Buton" : "Blok (Gömülü)"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <div className="flex flex-col border-r border-slate-100 pr-2 mr-1">
                                                                        <button
                                                                            onClick={async () => {
                                                                                const newBlocks = [...blocks];
                                                                                const idx = newBlocks.findIndex(b => b.id === block.id);
                                                                                // Find previous external_widget
                                                                                let prevIdx = -1;
                                                                                for (let i = idx - 1; i >= 0; i--) {
                                                                                    if (newBlocks[i].type === 'external_widget') { prevIdx = i; break; }
                                                                                }
                                                                                if (prevIdx !== -1) {
                                                                                    [newBlocks[idx], newBlocks[prevIdx]] = [newBlocks[prevIdx], newBlocks[idx]];
                                                                                    await handleSyncBlocks(newBlocks);
                                                                                    setShowToast("Sıralama güncellendi.");
                                                                                    setTimeout(() => setShowToast(null), 2000);
                                                                                }
                                                                            }}
                                                                            className="p-1 text-slate-400 hover:text-indigo-500 transition-colors"
                                                                            title="Yukarı Taşı"
                                                                        >
                                                                            <ChevronUp size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={async () => {
                                                                                const newBlocks = [...blocks];
                                                                                const idx = newBlocks.findIndex(b => b.id === block.id);
                                                                                // Find next external_widget
                                                                                let nextIdx = -1;
                                                                                for (let i = idx + 1; i < newBlocks.length; i++) {
                                                                                    if (newBlocks[i].type === 'external_widget') { nextIdx = i; break; }
                                                                                }
                                                                                if (nextIdx !== -1) {
                                                                                    [newBlocks[idx], newBlocks[nextIdx]] = [newBlocks[nextIdx], newBlocks[idx]];
                                                                                    await handleSyncBlocks(newBlocks);
                                                                                    setShowToast("Sıralama güncellendi.");
                                                                                    setTimeout(() => setShowToast(null), 2000);
                                                                                }
                                                                            }}
                                                                            className="p-1 text-slate-400 hover:text-indigo-500 transition-colors"
                                                                            title="Aşağı Taşı"
                                                                        >
                                                                            <ChevronDown size={16} />
                                                                        </button>
                                                                    </div>
                                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button
                                                                            onClick={() => {
                                                                                setExternalWidget(block.content);
                                                                                setEditingWidgetId(block.id);
                                                                                window.scrollTo({ top: 300, behavior: 'smooth' });
                                                                            }}
                                                                            className="p-2 text-indigo-500 hover:bg-white rounded-lg transition-all"
                                                                            title="Düzenle"
                                                                        >
                                                                            <Edit2 size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={async () => {
                                                                                if (confirm("Bu aracı silmek istediğinize emin misiniz?")) {
                                                                                    const newBlocks = (blocks || []).filter((b: any) => b.id !== block.id);
                                                                                    await handleSyncBlocks(newBlocks);
                                                                                    setShowToast("Araç başarıyla silindi.");
                                                                                    setTimeout(() => setShowToast(null), 3000);
                                                                                }
                                                                            }}
                                                                            className="p-2 text-rose-500 hover:bg-white rounded-lg transition-all"
                                                                            title="Sil"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Live Preview Sim */}
                            <div className="space-y-6">
                                <div className="bg-slate-50 rounded-[3rem] border-4 border-white shadow-inner p-8 relative overflow-hidden min-h-[600px] flex flex-col items-center justify-center">
                                    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{t('widgetPreview')}</span>
                                        <div className="flex gap-1.5 text-left">
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                        </div>
                                    </div>

                                    {externalWidget.code ? (
                                        <div className="bg-white w-full max-w-[340px] rounded-[3rem] shadow-xl border border-slate-100 p-8 space-y-4 text-center">
                                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto">
                                                <Globe size={20} />
                                            </div>
                                            <h4 className="font-black text-slate-900 uppercase tracking-tighter text-sm">{externalWidget.title || "Dış Seçili Araç"}</h4>
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-[10px] font-bold">
                                                WIDGET BURADA<br />GÖMÜLÜ OLARAK GÖRÜNECEK
                                            </div>
                                        </div>
                                    ) : widgetStyle === "floating" ? (
                                        <div className="w-full h-full flex items-end justify-end p-6">
                                            <div className="space-y-4 flex flex-col items-end">
                                                <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-[280px] animate-in slide-in-from-bottom-4 duration-500 text-left">
                                                    <p className="text-sm font-bold text-slate-900 mb-2">
                                                        {activeWidget === "booking" ? "📆 Randevu talep edin" : activeWidget === "lead" ? "👋 Bizimle iletişime geçin" : "✨ Size nasıl yardımcı olabilirim?"}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                                        {activeWidget === "booking" ? "Size en uygun saati seçerek hemen randevu oluşturun." : activeWidget === "lead" ? "Mesajınızı bırakın, en kısa sürede size geri dönelim." : "Yapay zeka asistanımız her türlü sorunuz için burada."}
                                                    </p>
                                                    <button className="w-full mt-4 py-3 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">
                                                        {activeWidget === "booking" ? "RANDEVU AL" : activeWidget === "lead" ? "MESAJ GÖNDER" : "SOHBETE BAŞLA"}
                                                    </button>
                                                </div>
                                                <div className="w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                                                    {activeWidget === "booking" ? <Calendar size={24} /> : activeWidget === "lead" ? <MessageSquare size={24} /> : <Sparkles size={24} />}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white w-full max-w-[340px] rounded-[3rem] shadow-xl border border-slate-100 p-8 space-y-6 text-center">
                                            <div className="text-center space-y-2">
                                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
                                                    {(() => {
                                                        const props = { size: 20 };
                                                        if (activeWidget === "portfolio") return <ImageIcon {...props} />;
                                                        if (activeWidget === "video") return <Play {...props} />;
                                                        if (activeWidget === "skills") return <Zap {...props} />;
                                                        if (activeWidget === "tech") return <Code {...props} />;
                                                        if (activeWidget === "blog") return <Rss {...props} />;
                                                        if (activeWidget === "booking") return <Calendar {...props} />;
                                                        if (activeWidget === "lead") return <MessageSquare {...props} />;
                                                        if (activeWidget === "countdown") return <Clock {...props} />;
                                                        if (activeWidget === "ai") return <Bot {...props} />;
                                                        return <Bot {...props} />;
                                                    })()}
                                                </div>
                                                <h4 className="font-black text-slate-900 uppercase tracking-tighter">
                                                    {activeWidget === 'portfolio' ? 'Portfolyo' : activeWidget === 'video' ? 'Video' : activeWidget === 'skills' ? 'Yetenekler' : activeWidget === 'tech' ? 'Teknoloji Seti' : activeWidget === 'blog' ? 'Blog Akışı' : activeWidget === "booking" ? t('widgetBooking') : activeWidget === "lead" ? t('widgetLead') : t('widgetAI')}
                                                </h4>
                                            </div>

                                            {activeWidget === 'portfolio' && (
                                                <div className="flex items-center justify-center gap-3">
                                                    {extraWidgetConfig.githubUrl && <Github size={16} className="text-slate-400" />}
                                                    {extraWidgetConfig.dribbbleUrl && <Dribbble size={16} className="text-slate-400" />}
                                                    {extraWidgetConfig.behanceUrl && <Palette size={16} className="text-slate-400" />}
                                                </div>
                                            )}

                                            {activeWidget === 'portfolio' && extraWidgetConfig.portfolioImages ? (
                                                <div className="grid grid-cols-2 gap-2">
                                                    {extraWidgetConfig.portfolioImages.split('|').filter(Boolean).slice(0, 4).map((img, i) => (
                                                        <div key={i} className="aspect-square rounded-xl bg-slate-50 overflow-hidden border border-slate-100">
                                                            <img src={img} className="w-full h-full object-cover opacity-80" alt="" />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="h-10 w-full bg-slate-50 rounded-xl border border-slate-100" />
                                                    <div className="h-10 w-full bg-slate-50 rounded-xl border border-slate-100" />
                                                    <div className="h-24 w-full bg-slate-50 rounded-xl border border-slate-100" />
                                                </div>
                                            )}

                                            <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">
                                                {activeWidget === 'video' ? (extraWidgetConfig.videoBtnText || 'GÖRÜNTÜLE') : activeWidget === 'portfolio' ? 'İNCELE' : (t('confirmBooking') || "GÖNDER")}
                                            </button>
                                        </div>
                                    )}

                                    <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
                                </div>

                                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group text-left">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">{t('widgetCustomization')}</h4>
                                    <p className="text-xs text-white/50 leading-relaxed font-medium">
                                        Kardly profili üzerinde yaptığınız renk, yazı ve içerik değişiklikleri widget üzerinde de anlık olarak güncellenir. Ekstra kod değişikliği gerektirmez. Dış site araçları ise kendi panelindeki ayarlarınıza göre şekillenir.
                                    </p>
                                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>

                ) : activeTab === "overview" ? (
                    <div className="space-y-10">
                        {/* Mandatory Terms Banner */}
                        {!isTermsAccepted && (
                            <div className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-700">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-rose-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-rose-200 shrink-0">
                                        <ShieldAlert size={32} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">
                                            {t('acceptTermsError')}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
                                            Hizmetlerimizi kullanmaya devam etmek için Kullanıcı Taahhütnamesini onaylamanız gerekmektedir. Bu işlem KVKK sorumluluğunuzu beyan eder.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setActiveTab("edit");
                                        setTimeout(() => {
                                            const el = document.getElementById('terms-checkbox');
                                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }, 100);
                                    }}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl whitespace-nowrap"
                                >
                                    HEMEN ONAYLA 👋
                                </button>
                            </div>
                        )}

                        {/* Summary Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={<Eye />}
                                label={t('totalViewsLabel')}
                                value={stats?.totalViews?.toString() || "0"}
                                trend="+12%"
                            />
                            <StatCard
                                icon={<Users />}
                                label={t('contactsSaved')}
                                value={stats?.vCardClicks?.toString() || "0"}
                                trend="+5%"
                            />
                            <StatCard
                                icon={<Calendar />}
                                label={t('pendingAppointments')}
                                value={appointmentList.filter((a: any) => a.status === 'pending').length.toString()}
                                trend="0%"
                            />
                            <StatCard
                                icon={<Star />}
                                label={t('approvedReviews')}
                                value={reviewList.filter((r: any) => r.isActive).length.toString()}
                                trend="+2"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Performance Chart Placeholder / Main Activity */}
                            <div className="lg:col-span-2 space-y-8">
                                <section className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('channelPerformance')}</h3>
                                            <p className="text-xs text-slate-400 font-medium tracking-wide">{t('channelPerformanceSub')}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setStatsRange("7")}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                                    statsRange === "7" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                                )}
                                            >
                                                {t('7days')}
                                            </button>
                                            <button
                                                onClick={() => setStatsRange("30")}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                                    statsRange === "30" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                                )}
                                            >
                                                {t('30days')}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <StatBar label={t('instagramSocial')} count={stats.channelStats?.instagram || 0} total={stats.totalViews} color="bg-primary" />
                                        <StatBar label={t('whatsappShares')} count={stats.channelStats?.whatsapp || 0} total={stats.totalViews} color="bg-indigo-500" />
                                        <StatBar label={t('directTraffic')} count={stats.channelStats?.direct || 0} total={stats.totalViews} color="bg-emerald-500" />
                                        <StatBar label={t('others')} count={stats.channelStats?.others || 0} total={stats.totalViews} color="bg-slate-200" />
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">{t('quickActions')}</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <button onClick={() => setActiveTab("edit")} className="group p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all text-center">
                                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                <Layout size={20} />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-600 block">{t('editProfile')}</span>
                                        </button>
                                        <div className="relative group/main">
                                            <button
                                                onClick={() => setIsQuickTplMenuOpen(!isQuickTplMenuOpen)}
                                                className="w-full group p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-500/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all text-center relative z-20"
                                            >
                                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                    <Palette size={20} />
                                                </div>
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="text-xs font-black uppercase tracking-widest text-slate-600 block">{t('changeTemplate')}</span>
                                                    <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isQuickTplMenuOpen && "rotate-180")} />
                                                </div>
                                            </button>

                                            <AnimatePresence>
                                                {isQuickTplMenuOpen && (
                                                    <>
                                                        <div className="fixed inset-0 z-40" onClick={() => setIsQuickTplMenuOpen(false)} />
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[280px] max-h-[400px] overflow-y-auto no-scrollbar bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 p-3 grid grid-cols-1 gap-1"
                                                        >
                                                            <div className="px-4 py-2 mb-2 border-b border-slate-50">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('selectCategory')}</p>
                                                            </div>
                                                            {TEMPLATE_CATEGORIES.map((cat) => (
                                                                <button
                                                                    key={cat.id}
                                                                    onClick={() => {
                                                                        setSelectedTplCat(cat.id);
                                                                        setActiveTab("templates");
                                                                        setIsQuickTplMenuOpen(false);
                                                                    }}
                                                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all text-left text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 group/item"
                                                                >
                                                                    <div className="text-indigo-500/60 group-hover/item:scale-110 transition-transform">
                                                                        {cat.icon}
                                                                    </div>
                                                                    {cat.name}
                                                                    <ArrowRight size={12} className="ml-auto opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    </>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <button onClick={() => setActiveTab("products")} className="group p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-emerald-500/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all text-center">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                <Briefcase size={20} />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-600 block">{t('addProject')}</span>
                                        </button>

                                    </div>
                                </section>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-8">
                                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/30 relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">{t('currentTemplate')}</h4>
                                        <h3 className="text-2xl font-black mb-6 tracking-tight">
                                            {ALL_TEMPLATES.find(t => t.id === profileData.templateId)?.name || 'Standart Modern'}
                                        </h3>
                                        <div className="h-40 w-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                                            <div className="relative">
                                                <Smartphone className="w-20 h-20 opacity-20" />
                                                <Sparkles className="absolute -top-2 -right-2 text-primary animate-pulse" />
                                            </div>
                                        </div>
                                        <button onClick={() => setActiveTab("templates")} className="w-full mt-6 py-4 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                            {t('customizeTemplate')}
                                        </button>
                                    </div>
                                    <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary/20 blur-[100px] rounded-full" />
                                </div>

                                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                                    <h4 className="text-sm font-black text-slate-900 tracking-tight mb-6">{t('upcomingEvents')}</h4>
                                    <div className="space-y-4">
                                        {appointmentList.slice(0, 3).map((app: any, i: number) => (
                                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-primary/20 transition-all">
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase leading-none">
                                                        {new Date(app.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'short' }).toUpperCase()}
                                                    </span>
                                                    <span className="text-lg font-black text-slate-900 leading-none">
                                                        {new Date(app.date).getDate()}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-black text-slate-900 truncate">{app.clientName}</p>
                                                    <p className="text-[10px] font-medium text-slate-400">{t('meetingRequest')}</p>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            </div>
                                        ))}
                                        {appointmentList.length === 0 && (
                                            <p className="text-xs text-slate-400 font-medium text-center py-4">{t('noUpcomingAppointments')}</p>
                                        )}
                                    </div>
                                </div>
                            </div >
                        </div >
                    </div >
                ) : activeTab === "edit" ? (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                        {/* Editor Section */}
                        <div className="xl:col-span-7 2xl:col-span-8 space-y-8">
                            <div className="mb-2">
                                <h2 className="text-2xl font-black text-slate-900 mb-1">{t('editProfileInfo')}</h2>
                                <p className="text-sm text-slate-500 font-medium">{t('yourDigitalIdentity')}</p>
                            </div>

                            {/* Section 1: Profile Basics */}
                            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{t('profileBasics')}</h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('profileBasicsSub')}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap justify-between items-center gap-2 px-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('displayNameLabel')}</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder={t('yourNamePlaceholder')}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap justify-between items-center gap-2 px-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('occupationLabel')}</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={profileData.occupation}
                                            onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                                            className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder={t('occupationPlaceholder')}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <div className="flex flex-wrap justify-between items-center gap-2 px-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('sloganLabel')}</label>
                                            <div className="flex flex-wrap items-center gap-3">
                                                {/* Font Size */}
                                                <select 
                                                    value={profileData.sloganFontSize || "11px"}
                                                    onChange={(e) => setProfileData({ ...profileData, sloganFontSize: e.target.value })}
                                                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase tracking-tighter outline-none focus:border-primary transition-all"
                                                >
                                                    {["9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px"].map(size => (
                                                        <option key={size} value={size}>{size}</option>
                                                    ))}
                                                </select>
                                                
                                                {/* Font Family */}
                                                <select 
                                                    value={profileData.sloganFontFamily || ""}
                                                    onChange={(e) => setProfileData({ ...profileData, sloganFontFamily: e.target.value })}
                                                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase tracking-tighter outline-none focus:border-primary transition-all max-w-[100px]"
                                                >
                                                    <option value="">VARSY.(FONT)</option>
                                                    <option value="'Inter', sans-serif">Inter</option>
                                                    <option value="'Playfair Display', serif">Playfair</option>
                                                    <option value="'Roboto Mono', monospace">Mono</option>
                                                    <option value="'Montserrat', sans-serif">Montserrat</option>
                                                    <option value="'Lexend', sans-serif">Lexend</option>
                                                </select>

                                                <div className="relative group w-8 h-8 rounded-full border border-slate-200 overflow-hidden shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
                                                    <input
                                                        type="color"
                                                        value={profileData.sloganColor || "#000000"}
                                                        onChange={(e) => setProfileData({ ...profileData, sloganColor: e.target.value })}
                                                        className="absolute inset-x-[-10px] inset-y-[-10px] w-[150%] h-[150%] cursor-pointer"
                                                    />
                                                </div>
                                                {profileData.sloganColor && (
                                                    <button onClick={() => setProfileData({ ...profileData, sloganColor: "" })} className="text-slate-300 hover:text-slate-500 transition-colors">
                                                        <X size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            value={profileData.slogan}
                                            onChange={(e) => setProfileData({ ...profileData, slogan: e.target.value })}
                                            className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder={t('sloganPlaceholder')}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('bioLabel')}</label>
                                            <div className="flex flex-wrap items-center gap-4 my-1">
                                                <div className="flex items-center gap-3 pr-3 border-r border-slate-100">
                                                    {/* Font Size */}
                                                    <select 
                                                        value={profileData.bioFontSize || "14px"}
                                                        onChange={(e) => setProfileData({ ...profileData, bioFontSize: e.target.value })}
                                                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase tracking-tighter outline-none focus:border-primary transition-all"
                                                    >
                                                        {["12px", "13px", "14px", "15px", "16px", "18px", "20px", "22px"].map(size => (
                                                            <option key={size} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                    
                                                    {/* Font Family */}
                                                    <select 
                                                        value={profileData.bioFontFamily || ""}
                                                        onChange={(e) => setProfileData({ ...profileData, bioFontFamily: e.target.value })}
                                                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase tracking-tighter outline-none focus:border-primary transition-all max-w-[100px]"
                                                    >
                                                        <option value="">VARSY.(FONT)</option>
                                                        <option value="'Inter', sans-serif">Inter</option>
                                                        <option value="'Playfair Display', serif">Playfair</option>
                                                        <option value="'Roboto Mono', monospace">Mono</option>
                                                        <option value="'Montserrat', sans-serif">Montserrat</option>
                                                        <option value="'Lexend', sans-serif">Lexend</option>
                                                    </select>

                                                    <div className="relative group w-8 h-8 rounded-full border border-slate-200 overflow-hidden shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
                                                        <input
                                                            type="color"
                                                            value={profileData.bioColor || "#000000"}
                                                            onChange={(e) => setProfileData({ ...profileData, bioColor: e.target.value })}
                                                            className="absolute inset-x-[-10px] inset-y-[-10px] w-[150%] h-[150%] cursor-pointer"
                                                        />
                                                    </div>
                                                    {profileData.bioColor && (
                                                        <button onClick={() => setProfileData({ ...profileData, bioColor: "" })} className="text-slate-300 hover:text-slate-500 transition-colors">
                                                            <X size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={handleGenerateBio}
                                                    disabled={isGeneratingBio}
                                                    className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 hover:opacity-80 transition-all disabled:opacity-50"
                                                >
                                                    {isGeneratingBio ? <div className="w-3 h-3 border border-primary/20 border-t-primary rounded-full animate-spin" /> : <Sparkles size={12} />}
                                                    {t('generateWithAi')}
                                                </button>
                                            </div>
                                        </div>
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            className="w-full min-h-[140px] bg-slate-50 border-none rounded-[2rem] p-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                            placeholder={t('bioPlaceholder')}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap justify-between items-center gap-2 px-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('phoneLabel')}</label>
                                        </div>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setProfileData({ ...profileData, phone: val });
                                                // Also sync to socialLinks if already exists as hero
                                                if (isSocialHero('phone')) {
                                                    updateSocialLink('phone', val);
                                                }
                                            }}
                                            className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="+90 5xx xxx xx xx"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('targetAudienceLabel')}</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={profileData.targetAudience}
                                            onChange={(e) => setProfileData({ ...profileData, targetAudience: e.target.value })}
                                            className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder={t('targetAudiencePlaceholder')}
                                        />
                                    </div>
                                    <div className="md:col-span-2 pt-4 border-t border-slate-50">
                                        <label className="flex items-center gap-4 p-5 bg-primary/5 rounded-[2rem] border border-primary/10 cursor-pointer hover:bg-primary/10 transition-all group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={profileData.showInHub}
                                                    onChange={(e) => setProfileData({ ...profileData, showInHub: e.target.checked })}
                                                    className="peer w-6 h-6 appearance-none rounded-lg border-2 border-primary/20 bg-white checked:bg-primary checked:border-primary transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                                <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-800 block mb-0.5">{t('showInHubLabel')}</span>
                                                <p className="text-[10px] text-slate-400 font-medium tracking-wide">Business Hub ağında diğer profesyoneller tarafından keşfedilebilir olun.</p>
                                            </div>
                                            <Compass size={20} className="text-primary/40 group-hover:text-primary transition-colors" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {/* Section 2: Media & Branding */}
                            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                        <ImageIcon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{t('mediaAndBranding')}</h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('mediaAndBrandingSub')}</p>
                                    </div>
                                </div>

                                {/* Profile Image */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('profilePicture')}</label>
                                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-white shadow-xl shrink-0 group relative">
                                            {profileData.showVideoAsProfile && profileData.youtubeVideoUrl ? (
                                                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                    <Youtube className="w-10 h-10 text-red-500 animate-pulse" />
                                                </div>
                                            ) : (profileData?.image || session?.user?.image) ? (
                                                <img src={profileData?.image || session?.user?.image} className="w-full h-full object-cover" alt="Profile" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <UserCircle size={48} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 w-full space-y-3">
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <input
                                                    type="text"
                                                    value={profileData.image}
                                                    onChange={(e) => setProfileData({ ...profileData, image: e.target.value })}
                                                    placeholder={t('imagePlaceholder')}
                                                    className="w-full sm:flex-1 h-12 bg-slate-50 border-none rounded-xl px-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20"
                                                />
                                                <label className="h-12 px-5 bg-white border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0">
                                                    {isProfileImageUploading ? (
                                                        <RefreshCw size={16} className="animate-spin" />
                                                    ) : (
                                                        <Upload size={16} />
                                                    )} 
                                                    {isProfileImageUploading ? t('loading') : t('upload')}
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        disabled={isProfileImageUploading}
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                setIsProfileImageUploading(true)
                                                                const formData = new FormData()
                                                                formData.append("file", file)
                                                                try {
                                                                    const res = await fetch("/api/upload", { method: "POST", body: formData })
                                                                    const data = await res.json()
                                                                    if (res.ok && data.url) {
                                                                        setProfileData((prev: any) => ({ ...prev, image: data.url }))
                                                                        setShowToast("Profil resmi yüklendi! ✨")
                                                                    } else {
                                                                        setShowToast(data.error || "Yükleme hatası")
                                                                    }
                                                                } catch (err) { 
                                                                    console.error(err)
                                                                    setShowToast("Bağlantı hatası")
                                                                } finally {
                                                                    setIsProfileImageUploading(false)
                                                                    setTimeout(() => setShowToast(null), 3000)
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-3 bg-red-50 p-3 rounded-xl border border-red-100/50">
                                                <input
                                                    type="checkbox"
                                                    id="useVideoAsProfile"
                                                    checked={profileData.showVideoAsProfile}
                                                    onChange={(e) => setProfileData({ ...profileData, showVideoAsProfile: e.target.checked })}
                                                    className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-200"
                                                />
                                                <label htmlFor="useVideoAsProfile" className="text-[10px] font-black uppercase tracking-widest text-red-600 cursor-pointer">{t('useVideoAsProfile')}</label>
                                            </div>
                                            {profileData.showVideoAsProfile && (
                                                <input
                                                    type="text"
                                                    value={profileData.youtubeVideoUrl}
                                                    onChange={(e) => setProfileData({ ...profileData, youtubeVideoUrl: e.target.value })}
                                                    placeholder={t('youtubeHint')}
                                                    className="w-full h-12 bg-red-50 border-none rounded-xl px-4 text-sm font-bold text-red-900 focus:ring-2 focus:ring-red-200"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Background Image */}
                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('profileBgImageLabel')}</label>
                                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                                        <div className="w-full sm:w-40 h-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-md shrink-0">
                                            {profileData.profileBgImage ? (
                                                <img src={profileData.profileBgImage} className="w-full h-full object-cover" alt="Background" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <ImageIcon size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 w-full flex flex-col sm:flex-row gap-2">
                                            <input
                                                type="text"
                                                value={profileData?.profileBgImage || ""}
                                                onChange={(e) => setProfileData({ ...profileData, profileBgImage: e.target.value })}
                                                placeholder={t('bgImagePlaceholder')}
                                                className="w-full sm:flex-1 h-12 bg-slate-50 border-none rounded-xl px-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20"
                                            />
                                            <label className="h-12 px-5 bg-white border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0">
                                                {isBgImageUploading ? (
                                                    <RefreshCw size={16} className="animate-spin" />
                                                ) : (
                                                    <Upload size={16} />
                                                )}
                                                {isBgImageUploading ? t('loading') : t('upload')}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    disabled={isBgImageUploading}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setIsBgImageUploading(true)
                                                            const formData = new FormData()
                                                            formData.append("file", file)
                                                            try {
                                                                const res = await fetch("/api/upload", { method: "POST", body: formData })
                                                                const data = await res.json()
                                                                if (res.ok && data.url) {
                                                                    setProfileData((prev: any) => ({ ...prev, profileBgImage: data.url }))
                                                                    setShowToast("Arka plan görseli yüklendi! ✨")
                                                                } else {
                                                                    setShowToast(data.error || "Yükleme hatası")
                                                                }
                                                            } catch (err) { 
                                                                console.error(err)
                                                                setShowToast("Bağlantı hatası")
                                                            } finally {
                                                                setIsBgImageUploading(false)
                                                                setTimeout(() => setShowToast(null), 3000)
                                                            }
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* CV / Catalog File */}
                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('cvLabel') || 'CV Dosyası / Katalog'}</label>
                                        <div className="flex items-center gap-3 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100/50">
                                            <input
                                                type="checkbox"
                                                id="isCatalog"
                                                checked={profileData.isCatalog}
                                                onChange={(e) => setProfileData({ ...profileData, isCatalog: e.target.checked })}
                                                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-500 focus:ring-blue-200"
                                            />
                                            <label htmlFor="isCatalog" className="text-[10px] font-black uppercase tracking-widest text-blue-600 cursor-pointer">{t('showAsCatalog')}</label>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                                        <div className="w-full sm:w-40 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                            {profileData.cvUrl ? (
                                                <div className="flex items-center gap-2 text-primary">
                                                    <FileText size={20} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('file')}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <FileText size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 w-full flex flex-col sm:flex-row gap-2">
                                            <input
                                                type="text"
                                                value={profileData.cvUrl || ""}
                                                onChange={(e) => setProfileData({ ...profileData, cvUrl: e.target.value })}
                                                placeholder={profileData.isCatalog ? (t('catalogFileHint') || "Katalog dosya linki") : (t('cvHint') || "CV dosya linki")}
                                                className="w-full sm:flex-1 h-12 bg-slate-50 border-none rounded-xl px-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20"
                                            />
                                            <label className="h-12 px-5 bg-white border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0">
                                                {isCvUploading ? (
                                                    <RefreshCw size={16} className="animate-spin" />
                                                ) : (
                                                    <Upload size={16} />
                                                )}
                                                {isCvUploading ? t('loading') : t('upload')}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                                    disabled={isCvUploading}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setIsCvUploading(true)
                                                            const formData = new FormData()
                                                            formData.append("file", file)
                                                            try {
                                                                const res = await fetch("/api/upload", { method: "POST", body: formData })
                                                                const data = await res.json()
                                                                if (res.ok && data.url) {
                                                                    setProfileData((prev: any) => ({ ...prev, cvUrl: data.url }))
                                                                    setShowToast("Dosya başarıyla yüklendi! ✨")
                                                                } else {
                                                                    setShowToast(data.error || "Dosya yükleme hatası")
                                                                }
                                                            } catch (err) { 
                                                                console.error(err)
                                                                setShowToast("Bağlantı hatası")
                                                            } finally {
                                                                setIsCvUploading(false)
                                                                setTimeout(() => setShowToast(null), 3000)
                                                            }
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-medium px-1 italic">
                                        {profileData.isCatalog ? (t('catalogHint') || "CV butonu yerine 'Katalog Görüntüle' etiketini kullanın.") : (t('cvHint') || "CV dosya linki veya dosyayı yükleyin")}
                                    </p>
                                </div>
                            </div>

                            {/* Section 3: Social & Links */}
                            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                        <Share2 size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{t('socialAndLinks')}</h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('socialAndLinksSub')}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {[
                                        { id: "instagram", icon: <Instagram />, color: "text-pink-500", label: "Instagram" },
                                        { id: "whatsapp", icon: <Phone />, color: "text-emerald-500", label: "WhatsApp" },
                                        { id: "twitter", icon: <Twitter />, color: "text-sky-500", label: "Twitter" },
                                        { id: "linkedin", icon: <Linkedin />, color: "text-blue-700", label: "LinkedIn" },
                                        { id: "youtube", icon: <Youtube />, color: "text-red-500", label: "YouTube" },
                                        { id: "github", icon: <Github />, color: "text-slate-800", label: "GitHub" },
                                        { id: "website", icon: <Globe />, color: "text-indigo-500", label: "Website" },
                                        { id: "email", icon: <Mail />, color: "text-rose-500", label: "Email" },
                                    ].map((social) => (
                                        <div key={social.id} className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100/50 hover:border-primary/20 transition-all group">
                                            <div className="flex items-center gap-5 flex-1 min-w-0">
                                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm group-hover:scale-110 transition-transform shrink-0", social.color)}>
                                                    {social.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">{social.label}</label>
                                                    <input
                                                        type="text"
                                                        placeholder={`${social.label} URL...`}
                                                        value={getSocialUrl(social.id)}
                                                        onChange={(e) => updateSocialLink(social.id, e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl h-14 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end shrink-0">
                                                <button
                                                    onClick={() => toggleSocialHero(social.id)}
                                                    className={cn(
                                                        "h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border shadow-sm",
                                                        isSocialHero(social.id) ? "bg-amber-100 text-amber-600 border-amber-200" : "bg-white text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-600"
                                                    )}
                                                >
                                                    {isSocialHero(social.id) ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                                            {t('heroButton')}
                                                        </div>
                                                    ) : t('makeHero')}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Custom Buttons */}
                                <div className="pt-6 border-t border-slate-50 space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('customLinksLabel')}</label>

                                    {/* Link List */}
                                    <div className="space-y-3">
                                        {customLinks.map((link: any, i: number) => (
                                            <div key={i} className="flex items-center gap-4 bg-slate-50 rounded-3xl p-4 border border-slate-100 group">
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", link.isAction ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : "bg-white text-slate-400")}>
                                                    {link.isAction ? <Zap size={20} /> : <LinkIcon size={20} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black text-slate-900 truncate">{link.title}</p>
                                                    <p className="text-[10px] font-medium text-slate-400 truncate">{link.url}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleLinkAction(i)}
                                                        className={cn(
                                                            "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                                            link.isAction ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                                                        )}
                                                    >
                                                        {link.isAction ? t('heroButton') : t('makeHero')}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLink(i)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Link Form */}
                                    <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-6 border border-slate-100">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('linkTitlePlaceholder')}</label>
                                                <input
                                                    type="text"
                                                    placeholder={t('linkTitlePlaceholder')}
                                                    value={newLink.title}
                                                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                                    className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('linkUrlPlaceholder')}</label>
                                                <input
                                                    type="text"
                                                    placeholder={t('linkUrlPlaceholder')}
                                                    value={newLink.url}
                                                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                                    className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setNewLink({ ...newLink, isAction: !newLink.isAction })}
                                                    className={cn(
                                                        "w-10 h-5 rounded-full relative transition-all duration-300",
                                                        newLink.isAction ? "bg-amber-500" : "bg-slate-300"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-300",
                                                        newLink.isAction ? "left-6" : "left-1"
                                                    )} />
                                                </button>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('showAsMainButton')}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleAddLink}
                                                disabled={!newLink.title || !newLink.url}
                                                className="h-12 px-8 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-2"
                                            >
                                                <Plus size={16} /> {t('addLink')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Legal Safeguard: User Agreement Checkbox */}
                            <div className="mb-6 p-5 bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300">
                                <label className="flex items-start gap-4 cursor-pointer group">
                                    <div className="mt-1 relative flex items-center justify-center">
                                        <input 
                                            type="checkbox" 
                                            id="terms-checkbox"
                                            checked={isTermsAccepted}
                                            onChange={(e) => setIsTermsAccepted(e.target.checked)}
                                            className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 bg-white transition-all checked:border-rose-500 checked:bg-rose-500 hover:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                        />
                                        <Check className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                    <div className="text-[13px] text-slate-500 font-medium leading-[1.6] group-hover:text-slate-800 transition-colors select-none">
                                        {t('userAgreementCheckbox')}
                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                            <Link href="/gizlilik" target="_blank" className="text-[10px] text-primary hover:underline uppercase tracking-widest font-black">
                                                {t('privacyPolicy')}
                                            </Link>
                                            <Link href="/kullanim-sartlari" target="_blank" className="text-[10px] text-primary hover:underline uppercase tracking-widest font-black">
                                                {t('termsOfUse')}
                                            </Link>
                                            <Link href="/gizlilik#cerezler" target="_blank" className="text-[10px] text-primary hover:underline uppercase tracking-widest font-black">
                                                {t('cookiePolicy')}
                                            </Link>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Global Save Button */}
                            <div className="sticky bottom-6 z-30">
                                <button
                                    onClick={() => handleSave()}
                                    disabled={isSaving}
                                    className="w-full h-16 flex items-center justify-center gap-3 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle2 size={20} /> {t('saveChanges')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Realistic Smartphone Preview */}
                        <div className="xl:col-span-5 2xl:col-span-4 sticky top-8">
                            <div className="relative group perspective-1000">
                                <div className="absolute -inset-4 bg-primary/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-all duration-1000" />

                                {/* iPhone Frame */}
                                <div className="relative w-[320px] h-[640px] bg-[#0f172a] rounded-[3.5rem] p-3 shadow-[0_0_0_2px_rgba(255,255,255,0.1),0_0_0_10px_rgba(15,23,42,1),0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 mx-auto">
                                    { /* Calculate Mockup Theme */}
                                    {(() => {
                                        const getYoutubeEmbedUrl = (url: string) => {
                                            if (!url) return ""
                                            let videoId = ""
                                            if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0]
                                            else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0]
                                            else if (url.includes("embed/")) videoId = url.split("embed/")[1].split("?")[0]
                                            return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0` : ""
                                        }

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

                                        // Professional Templates
                                        else if (tid === "pro_dietitian") { accent = "#22c55e"; bg = "#f0f9f0"; patternSvg = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 20 Q 60 40, 50 60 Q 40 40, 50 20 Z' stroke='%2322c55e' fill='none' stroke-opacity='0.1'/%3E%3C/svg%3E")`; }
                                        else if (tid === "pro_lawyer") { accent = "#d4af37"; bg = "#0f172a"; patternSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 H 100 V 100 H 20 Z' stroke='%23d4af37' fill='none' stroke-opacity='0.1'/%3E%3C/svg%3E")`; }
                                        else if (tid === "pro_architect") { accent = "#0ea5e9"; bg = "#1e293b"; patternSvg = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L 0 60 M 0 0 L 60 0' stroke='%230ea5e9' fill='none' stroke-opacity='0.1'/%3E%3C/svg%3E")`; }
                                        else if (tid === "pro_realestate") { accent = "#fbbf24"; bg = "#020617"; patternSvg = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 100 V 40 L 50 20 L 80 40' stroke='%23fbbf24' fill='none' stroke-opacity='0.1'/%3E%3C/svg%3E")`; }
                                        else if (tid === "pro_artistic") { accent = "#f472b6"; bg = "#050505"; patternSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='40' stroke='%23f472b6' fill='none' stroke-opacity='0.1'/%3E%3C/svg%3E")`; }
                                        else if (tid === "pro_software") { accent = "#10b981"; bg = "#0a0a0b"; patternSvg = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='2' height='2' x='0' y='0' fill='%2310b981' fill-opacity='0.05'/%3E%3C/svg%3E")`; }
                                        else if (tid === "pro_doctor") { accent = "#0ea5e9"; bg = "#f8fafc"; patternSvg = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 50h10l10 20 10-40 10 20h10' stroke='%230ea5e9' fill='none' stroke-opacity='0.1'/%3E%3C/svg%3E")`; }
                                        else if (tid === "pro_chef") { accent = "#f97316"; bg = "#1c1917"; }
                                        else if (tid === "pro_barber") { accent = "#fff"; bg = "#0c0c0c"; }
                                        else if (tid === "pro_fitness") { accent = "#84cc16"; bg = "#000"; }
                                        else if (tid === "pro_photographer") { accent = "#000"; bg = "#fff"; }
                                        else if (tid === "pro_musician") { accent = "#6366f1"; bg = "#0f0714"; }
                                        else if (tid === "pro_beauty") { accent = "#f43f5e"; bg = "#fff1f2"; }
                                        else if (tid === "pro_finance") { accent = "#334155"; bg = "#020617"; }
                                        else if (tid === "pro_gamer") { accent = "#00ff9f"; bg = "#050505"; }

                                        // New Specialized Templates
                                        else if (tid === "minimal_glass") { accent = "#6366f1"; bg = "#f1f5f9"; glow = "linear-gradient(135deg, #6366f110 0%, #a855f710 100%)"; patternSvg = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='1' fill='%236366f1' fill-opacity='0.1'/%3E%3C/svg%3E")`; }
                                        else if (tid === "nature_dawn") { accent = "#f59e0b"; bg = "#0f172a"; glow = "linear-gradient(to bottom, #1e1b4b, #312e81, #4338ca, #6366f1, #fb923c)"; }
                                         
                                         // Turizm & Seyahat (Tourism & Travel)
                                         else if (tid === "tour_resort") { 
                                             accent = "#009688"; bg = "#e0f7fa"; 
                                             patternSvg = `url("data:image/svg+xml,%3Csvg width='100' height='40' viewBox='0 0 100 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 Q 25 10 50 20 T 100 20 V 40 H 0 Z' fill='%23009688' fill-opacity='0.05'/%3E%3C/svg%3E")`;
                                         }
                                         else if (tid === "tour_adventure") { 
                                             accent = "#ff9800"; bg = "#1a0f00"; 
                                             patternSvg = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 60 L30 0 L60 60 Z' fill='%23ff9800' fill-opacity='0.03'/%3E%3C/svg%3E")`;
                                         }
                                         else if (tid === "tour_yacht") { 
                                             accent = "#1976d2"; bg = "#0a1628"; 
                                             patternSvg = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%231976d2' stroke-width='0.5' fill='none' stroke-opacity='0.1'/%3E%3C/svg%3E")`;
                                         }
                                         else if (tid === "tour_guide") { 
                                             accent = "#795548"; bg = "#fff8e1"; 
                                             patternSvg = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='none' stroke='%23795548' stroke-width='0.2' stroke-opacity='0.1'/%3E%3C/svg%3E")`;
                                         }
                                         else if (tid === "tour_agency") { 
                                             accent = "#3f51b5"; bg = "#e8eaf6"; 
                                             patternSvg = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%233f51b5' stroke-width='0.5' fill='none' stroke-opacity='0.05'/%3E%3Cellipse cx='50' cy='50' rx='40' ry='15' stroke='%233f51b5' stroke-width='0.5' fill='none' stroke-opacity='0.05'/%3E%3C/svg%3E")`;
                                         }
                                         else if (tid === "tour_winter") { 
                                             accent = "#039be5"; bg = "#e3f2fd"; 
                                             patternSvg = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='2' fill='%23039be5' fill-opacity='0.05'/%3E%3C/svg%3E")`;
                                         }

                                        return (
                                            <div className={cn("w-full h-full overflow-hidden flex flex-col pt-12 p-6 pointer-events-none relative transition-all duration-700", mTone.rounded, mTone.font)} style={{ backgroundColor: bg }}>
                                                {/* Specialized Glowing Background for Rainbow cases */}
                                                {glow && <div className="absolute inset-0 z-0 opacity-40 animate-pulse" style={{ background: glow }} />}

                                                {/* Pattern Overlay */}
                                                {patternSvg && <div className="absolute inset-0 z-0 opacity-50 transition-all duration-700" style={{ backgroundImage: patternSvg }} />}

                                                {/* Profession Specific Mockup Extensions */}
                                                {tid === "pro_realestate" && (
                                                    <div className="absolute inset-x-0 bottom-0 h-24 opacity-[0.05] pointer-events-none">
                                                        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-amber-500">
                                                            <path d="M0,100 L0,80 L50,80 L50,40 L100,40 L100,70 L200,70 L200,20 L300,20 L300,80 L400,80 L400,10 L500,10 L500,70 L600,70 L600,0 L700,0 L700,80 L800,80 L800,20 L900,20 L900,50 L1000,50 L1000,100 Z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {tid === "pro_lawyer" && (
                                                    <div className="absolute inset-x-0 bottom-0 h-20 opacity-[0.05] flex justify-around items-end px-4 pointer-events-none">
                                                        <div className="w-6 h-16 bg-amber-500/20 rounded-t-sm" />
                                                        <div className="w-6 h-16 bg-amber-500/20 rounded-t-sm" />
                                                        <div className="w-6 h-16 bg-amber-500/20 rounded-t-sm" />
                                                    </div>
                                                )}
                                                {tid === "pro_architect" && (
                                                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                                                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-sky-500" />
                                                        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-sky-500" />
                                                    </div>
                                                )}
                                                {tid === "pro_dietitian" && (
                                                    <div className="absolute inset-0 opacity-[0.05] overflow-hidden pointer-events-none">
                                                        <div className="absolute top-10 right-10 w-10 h-10 border border-green-500 rounded-full rotate-45" />
                                                        <div className="absolute bottom-20 left-10 w-8 h-8 border border-green-500 rounded-full -rotate-12" />
                                                    </div>
                                                )}
                                                {tid === "pro_software" && (
                                                    <div className="absolute inset-0 opacity-[0.05] font-mono text-[8px] p-10 overflow-hidden leading-tight text-emerald-500 pointer-events-none">
                                                        {"const dev = true;\nif(dev) {\n  console.log('Kardly');\n}\n".repeat(20)}
                                                    </div>
                                                )}
                                                {tid === "pro_gamer" && (
                                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-1 bg-black/50 rounded-full overflow-hidden border border-[#00ff9f]/20 pointer-events-none">
                                                        <div className="w-[80%] h-full bg-[#00ff9f]/50" />
                                                    </div>
                                                )}
                                                {tid === "pro_artistic" && (
                                                    <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[radial-gradient(circle_at_top_right,#f472b622_0%,transparent_50%),radial-gradient(circle_at_bottom_left,#8b5cf622_0%,transparent_50%)]" />
                                                )}
                                                {tid === "pro_musician" && (
                                                    <div className="absolute bottom-0 inset-x-0 h-16 flex items-end justify-center gap-0.5 opacity-[0.1] pointer-events-none">
                                                        {Array(20).fill(0).map((_, i) => (
                                                            <div key={i} className="w-1 bg-indigo-500" style={{ height: `${Math.random() * 100}%` }} />
                                                        ))}
                                                    </div>
                                                )}

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
                                                            <iframe
                                                                className="w-full h-full object-cover scale-[1.8] pointer-events-none"
                                                                src={getYoutubeEmbedUrl(profileData.youtubeVideoUrl)}
                                                                allow="autoplay"
                                                                frameBorder="0"
                                                            />
                                                        ) : (profileData?.image || session?.user?.image) ? (
                                                            <img src={profileData?.image || session?.user?.image} className="w-full h-full object-cover shadow-2xl" alt="Profile" />
                                                        ) : (
                                                            <UserCircle className="w-12 h-12 opacity-50" style={{ color: accent }} />
                                                        )}
                                                    </div>
                                                    <div className="text-center mb-6">
                                                        <h4 className={`font-black text-xl mb-1 truncate ${bg === '#f8f9fa' ? 'text-slate-900' : 'text-white'}`}>{profileData?.name || session?.user?.name || t('user')}</h4>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500" style={{ color: accent }}>{profileData?.occupation || t('noTitleSpec')}</p>
                                                    </div>
                                                    <div className="text-center mb-8 px-4">
                                                        <p className={`text-[11px] italic leading-relaxed line-clamp-2 ${bg === '#f8f9fa' ? 'text-slate-500' : 'text-white/60'}`}>"{profileData?.slogan || t('mottoWillBeHere')}"</p>
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

                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded-[3.5rem] cursor-pointer" onClick={() => profile?.username && window.open(`https://kardly.site/${profile.username}`, '_blank')}>
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl">
                                            <ArrowRight size={24} />
                                        </div>
                                        <p className="font-black text-xs text-white uppercase tracking-widest">{t('viewLive')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : activeTab === "products" ? (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-1">{t('myProjects')}</h2>
                                <p className="text-sm text-slate-500 font-medium tracking-wide">{t('myProjectsSub')}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingProduct(null)
                                    setNewProduct({ name: "", description: "", price: "", link: "", image: "" })
                                    setShowProductModal(true)
                                }}
                                className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <Plus className="w-5 h-5" /> {t('addNewProject')}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productList.map((product: any) => (
                                <div key={product.id} className="group bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col h-full">
                                    <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-10 h-10 text-slate-200" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="w-9 h-9 flex items-center justify-center bg-rose-500 text-white rounded-xl shadow-lg hover:bg-rose-600 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight line-clamp-1">{product.name}</h3>
                                            <span className="shrink-0 font-black text-primary text-[8px] bg-primary/5 px-2 py-0.5 rounded-lg uppercase tracking-widest">{product.price}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-medium mb-5 line-clamp-2 leading-relaxed flex-1">{product.description || t('noProjectDesc')}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingProduct(product)
                                                    setNewProduct({
                                                        name: product.name,
                                                        description: product.description || "",
                                                        price: product.price?.toString() || "",
                                                        link: product.link || "",
                                                        image: product.image || ""
                                                    })
                                                    setShowProductModal(true)
                                                }}
                                                className="flex-1 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                                            >
                                                {t('edit')}
                                            </button>
                                            {product.link && (
                                                <a
                                                    href={product.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm shrink-0"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {productList.length === 0 && (
                                <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                        <Briefcase className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">{t('noProjectsYet')}</h3>
                                    <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto">{t('noProjectsYetSub')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                ) : activeTab === "services" ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">{t('expertiseAreas')}</h2>
                                <p className="text-sm text-foreground/50">{t('expertiseAreasSub')}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingServiceIndex(null)
                                    setNewService({ title: "", description: "" })
                                    setShowServiceModal(true)
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                            >
                                <Plus className="w-5 h-5" /> {t('addNewExpertise')}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {serviceList.map((service: any, index: number) => (
                                <div key={index} className="glass p-8 rounded-[2rem] border-white/5 flex justify-between items-center group hover:border-white/20 transition-all">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">{service.title}</h3>
                                        <p className="text-sm text-foreground/50">{service.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingServiceIndex(index)
                                                setNewService(service)
                                                setShowServiceModal(true)
                                            }}
                                            className="p-3 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                                            title={t('edit')}
                                        >
                                            <Sparkles className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteService(index)}
                                            className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {serviceList.length === 0 && (
                                <div className="py-20 text-center glass rounded-[2.5rem] border-white/5">
                                    <Layout className="w-16 h-16 mx-auto mb-4 text-white/10" />
                                    <p className="text-lg font-bold">{t('noServicesYet')}</p>
                                    <p className="text-sm text-foreground/40 mt-2">{t('noServicesYetSub')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === "appointments" ? (
                    <div className="flex-1 flex flex-col p-4 sm:p-0 space-y-6 sm:space-y-10 pb-24 sm:pb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="relative">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary rounded-full hidden sm:block" />
                                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2 italic">
                                    {t('appointmentRequests')}
                                </h2>
                                <p className="text-[11px] sm:text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60">
                                    Bize ulaşan tüm randevu ve görüşme taleplerini buradan yönetin.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm hover:bg-primary hover:text-white transition-all">
                                    {t('all')}
                                </button>
                                <button className="px-5 py-2.5 bg-white text-slate-400 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm hover:border-primary/20 hover:text-primary transition-all">
                                    {t('pending')}
                                </button>
                            </div>
                        </div>

                        {/* Mobile View: Premium Appointment Cards */}
                        <div className="sm:hidden space-y-4">
                            {appointmentList.map((appointment: any) => (
                                <motion.div
                                    key={appointment.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-2">
                                                <User size={20} />
                                            </div>
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">{appointment.clientName}</h4>
                                            <div className="flex flex-col gap-0.5 opacity-60">
                                                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 leading-none mt-1">
                                                    <Mail size={10} className="text-primary/40" /> {appointment.clientEmail}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 leading-none mt-1">
                                                    <Phone size={10} className="text-primary/40" /> {appointment.clientPhone}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            appointment.status === 'pending' ? "bg-amber-50 border-amber-100 text-amber-600" :
                                            appointment.status === 'confirmed' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                                            "bg-slate-50 border-slate-100 text-slate-400"
                                        )}>
                                            {appointment.status === 'pending' ? t('pending') : appointment.status === 'confirmed' ? t('approved') : t('completed')}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-[2rem] p-5 border border-slate-100 mb-6 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Tarih / Saat</span>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-primary" />
                                                <span className="text-sm font-black text-slate-900 tracking-tight">
                                                    {new Date(appointment.date).toLocaleDateString("tr-TR")}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                <span className="text-sm font-black text-primary tracking-tight">
                                                    {new Date(appointment.date).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full border-4 border-white bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                                            <Clock size={16} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {appointment.status === 'pending' && (
                                            <button
                                                onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}
                                                className="flex-1 h-12 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                            >
                                                <Check size={14} />
                                                <span>{t('approve')}</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteAppointment(appointment.id)}
                                            className={cn(
                                                "h-12 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl flex items-center justify-center active:scale-95 transition-all",
                                                appointment.status === 'pending' ? "w-12" : "flex-1"
                                            )}
                                        >
                                            <Trash2 size={18} />
                                            {appointment.status !== 'pending' && <span className="ml-2 font-black text-[10px] uppercase tracking-widest">{t('delete')}</span>}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            {appointmentList.length === 0 && (
                                <div className="p-12 text-center bg-white rounded-[3rem] border border-slate-100 italic">
                                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-5" />
                                    <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-300">{t('noAppointments')}</p>
                                </div>
                            )}
                        </div>

                        {/* Desktop View: Existing Table Refined */}
                        <div className="hidden sm:block bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
                            <table className="w-full text-left min-w-[700px]">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('client')}</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('dateAndTime')}</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('status')}</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">{t('action')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {appointmentList.map((appointment: any) => (
                                        <tr key={appointment.id} className="hover:bg-slate-50/40 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-black text-slate-900 uppercase italic tracking-tight group-hover:text-primary transition-colors">{appointment.clientName}</div>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                                                        <Mail size={12} className="text-slate-300" /> {appointment.clientEmail}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 font-black flex items-center gap-1.5 uppercase tracking-tighter">
                                                        <Phone size={12} className="text-primary/30" /> {appointment.clientPhone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Calendar size={13} className="text-primary/50" />
                                                    <span className="text-sm font-black text-slate-700 tracking-tight tabular-nums">
                                                        {new Date(appointment.date).toLocaleDateString("tr-TR")}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={13} className="text-slate-300" />
                                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest tabular-nums leading-none">
                                                        {new Date(appointment.date).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300",
                                                    appointment.status === 'pending'
                                                        ? 'bg-amber-50 border-amber-100 text-amber-600 shadow-sm shadow-amber-100'
                                                        : appointment.status === 'confirmed'
                                                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm shadow-emerald-100'
                                                            : 'bg-slate-50 border-slate-100 text-slate-400'
                                                )}>
                                                    {appointment.status === 'pending' ? t('pending') : appointment.status === 'confirmed' ? t('approved') : t('completed')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {appointment.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}
                                                            className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm hover:scale-110 active:scale-90"
                                                            title={t('approve')}
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteAppointment(appointment.id)}
                                                        className="w-10 h-10 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm hover:scale-110 active:scale-90"
                                                        title={t('delete')}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {appointmentList.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-24 text-center text-slate-300">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <Calendar size={40} className="text-slate-100" />
                                                </div>
                                                <p className="font-black uppercase tracking-[0.5em] text-[11px] opacity-40 italic">{t('noAppointments')}</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                ) : activeTab === "ai" ? (
                    <div className="max-w-4xl space-y-10">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-1">{t('aiLabel')}</h2>
                            <p className="text-sm text-slate-500 font-medium tracking-wide">{t('aiAssistantSub')}</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-7 space-y-8">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                                    <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                                <Sparkles size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">{t('assistantVisibility')}</h3>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                                                    {aiConfig.isEnabled ? t('visibleOnProfile') : t('hiddenOnProfile')}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setAiConfig({ ...aiConfig, isEnabled: !aiConfig.isEnabled })}
                                            className={cn(
                                                "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2",
                                                aiConfig.isEnabled ? "bg-emerald-500 text-white shadow-xl shadow-emerald-200" : "bg-slate-100 text-slate-400"
                                            )}
                                        >
                                            <div className={cn("w-2 h-2 rounded-full animate-pulse", aiConfig.isEnabled ? "bg-white" : "bg-slate-300")} />
                                            {aiConfig.isEnabled ? t('active') : t('passive')}
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('assistantNameLabel')}</label>
                                            <input
                                                type="text"
                                                value={aiConfig.assistantName}
                                                onChange={(e) => setAiConfig({ ...aiConfig, assistantName: e.target.value })}
                                                placeholder="Örn: Kardly AI"
                                                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('customGreetingLabel')}</label>
                                            <textarea
                                                value={aiConfig.greeting}
                                                onChange={(e) => setAiConfig({ ...aiConfig, greeting: e.target.value })}
                                                placeholder={t('aiGreetingPlaceholder')}
                                                rows={2}
                                                className="w-full bg-slate-50 border-none rounded-[2rem] p-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                            />
                                            <p className="text-[9px] text-slate-400 font-medium px-2 italic">* {t('greetingDefaultNote')}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('customInstructionsLabel')}</label>
                                            <textarea
                                                value={aiConfig.instructions}
                                                onChange={(e) => setAiConfig({ ...aiConfig, instructions: e.target.value })}
                                                placeholder={t('aiInstructionsPlaceholder')}
                                                rows={4}
                                                className="w-full bg-slate-50 border-none rounded-[2rem] p-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                            />
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                                                    <FileText size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{t('aiKnowledgeBaseLabel')}</h4>
                                                    <p className="text-[9px] text-slate-400 font-medium">{t('aiKnowledgeBaseSub')}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={newKbPair.q}
                                                    onChange={(e) => setNewKbPair({ ...newKbPair, q: e.target.value })}
                                                    placeholder={t('addQuestionPlaceholder')}
                                                    className="w-full h-12 bg-slate-50 border-none rounded-xl px-5 text-sm font-bold text-slate-900 focus:ring-1 focus:ring-primary/20 transition-all"
                                                />
                                                <textarea
                                                    value={newKbPair.a}
                                                    onChange={(e) => setNewKbPair({ ...newKbPair, a: e.target.value })}
                                                    placeholder={t('addAnswerPlaceholder')}
                                                    rows={2}
                                                    className="w-full bg-slate-50 border-none rounded-xl p-5 text-sm font-bold text-slate-900 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (!newKbPair.q || !newKbPair.a) return
                                                        const currentKb = aiConfig.knowledgeBase || []
                                                        setAiConfig({
                                                            ...aiConfig,
                                                            knowledgeBase: [...currentKb, newKbPair]
                                                        })
                                                        setNewKbPair({ q: "", a: "" })
                                                    }}
                                                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={14} /> {t('addPairBtn')}
                                                </button>
                                            </div>

                                            <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                                {(aiConfig.knowledgeBase || []).length === 0 ? (
                                                    <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('noKnowledgeBase')}</p>
                                                    </div>
                                                ) : (
                                                    (aiConfig.knowledgeBase || []).map((kb: any, i: number) => (
                                                        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 group hover:border-slate-300 transition-all relative">
                                                            <div className="flex-1 space-y-1">
                                                                <p className="text-xs font-black text-slate-900 leading-tight">Q: {kb.q}</p>
                                                                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">A: {kb.a}</p>
                                                            </div>
                                                            <button 
                                                                onClick={() => {
                                                                    const updatedKb = aiConfig.knowledgeBase.filter((_: any, idx: number) => idx !== i)
                                                                    setAiConfig({ ...aiConfig, knowledgeBase: updatedKb })
                                                                }}
                                                                className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all absolute top-2 right-2 shadow-sm"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={async () => {
                                            setIsSaving(true)
                                            try {
                                                const existing = blocks.find((b: any) => b.type === 'ai_assistant')
                                                let newBlocks;
                                                if (existing) {
                                                    newBlocks = blocks.map((b: any) => b.type === 'ai_assistant' ? { ...b, content: aiConfig } : b)
                                                } else {
                                                    newBlocks = [...blocks, { type: 'ai_assistant', content: aiConfig, order: 100, isActive: true }]
                                                }
                                                await handleSyncBlocks(newBlocks)
                                                setShowToast(t('aiSettingsSaved') || "Ayarlar kaydedildi! ✨")
                                                setTimeout(() => setShowToast(null), 3000)
                                            } catch (err) {
                                                setShowToast(t('errorBooking'))
                                                setTimeout(() => setShowToast(null), 3000)
                                            } finally {
                                                setIsSaving(false)
                                            }
                                        }}
                                        disabled={isSaving}
                                        className="w-full h-16 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <><CheckCircle2 size={20} /> {t('saveSettings')}</>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-5 space-y-6">
                                <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Zap className="text-primary" size={24} />
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tight mb-4">{t('aiHintTitle')}</h3>
                                        <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">
                                            {t('aiHintDesc')}
                                        </p>
                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{t('exampleInstruction')}:</p>
                                            <p className="text-xs italic text-slate-500 font-medium leading-relaxed">
                                                "{t('aiInstructionExampleText')}"
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-1000" />
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('howItWorks')}</h4>
                                    <ul className="space-y-4">
                                        {[
                                            t('aiFeature1'),
                                            t('aiFeature2'),
                                            t('aiFeature3')
                                        ].map((text, i) => (
                                            <li key={i} className="flex gap-3 text-xs font-bold text-slate-600">
                                                <div className="shrink-0 w-5 h-5 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center">
                                                    <Check size={12} />
                                                </div>
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>


                ) : activeTab === "qrcode" ? (
                    <div className="space-y-8 max-w-2xl mx-auto text-center py-12">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold mb-2 uppercase tracking-tighter">{t('qrTitle')}</h2>
                            <p className="text-sm text-foreground/50">{t('qrSub')}</p>
                        </div>
                        <div className="glass p-12 rounded-[3.5rem] border-white/5 inline-block mx-auto relative group shadow-2xl">
                            <div className="absolute inset-0 bg-primary/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <QRCodeCard
                                    username={profile?.username || "demo"}
                                    dark={profileData.qrColorDark}
                                    light={profileData.qrColorLight}
                                />
                            </div>
                        </div>

                        <div className="max-w-md mx-auto grid grid-cols-2 gap-6 mt-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('qrColorDark') || 'QR Rengi'}</label>
                                <div className="flex gap-2 flex-wrap justify-center">
                                    {["#0f172a", "#000000", "#6366f1", "#f43f5e", "#10b981", "#a855f7"].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setProfileData({ ...profileData, qrColorDark: color })}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${profileData.qrColorDark === color ? 'border-primary scale-110 shadow-lg' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    <input
                                        type="color"
                                        value={profileData.qrColorDark}
                                        onChange={(e) => setProfileData({ ...profileData, qrColorDark: e.target.value })}
                                        className="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer overflow-hidden p-0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('qrColorLight') || 'Arka Plan'}</label>
                                <div className="flex gap-2 flex-wrap justify-center">
                                    {["#ffffff", "#f8fafc", "#f0f9f0", "#1e293b", "#0f172a"].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setProfileData({ ...profileData, qrColorLight: color })}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${profileData.qrColorLight === color ? 'border-primary scale-110 shadow-lg' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    <input
                                        type="color"
                                        value={profileData.qrColorLight}
                                        onChange={(e) => setProfileData({ ...profileData, qrColorLight: e.target.value })}
                                        className="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer overflow-hidden p-0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all text-white/60 hover:text-white"
                            >
                                {t('saveChanges')}
                            </button>
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

                ) : activeTab === "businesscard" ? (
                    <div className="space-y-8 max-w-4xl mx-auto text-center py-12">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold mb-2 uppercase tracking-tighter">{t('businessCardTitle')}</h2>
                            <p className="text-sm text-foreground/50 max-w-sm mx-auto">{t('businessCardSub')}</p>
                        </div>

                        <div className="glass p-4 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] bg-white/5 border-white/5 mb-10 overflow-hidden">
                            <BusinessCardGenerator
                                mode="selector"
                                selectedTemplateId={profileData.businessCardTemplateId}
                                orientation={profileData.businessCardOrientation as any}
                                onSelect={(id) => setProfileData({ ...profileData, businessCardTemplateId: id })}
                                onOrientationChange={(o) => setProfileData({ ...profileData, businessCardOrientation: o })}
                                user={{
                                    name: profileData.name || session?.user?.name || "Kullanıcı",
                                    username: profile?.username || "demo",
                                    occupation: profileData.occupation,
                                    phone: profileData.phone,
                                    email: session?.user?.email
                                }}
                                profileData={profileData}
                            />
                        </div>

                        <div className="flex justify-center mt-12 pb-12">
                            <button
                                onClick={() => handleSave()}
                                disabled={isSaving}
                                className="relative group px-12 py-5"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary via-rose-500 to-primary rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                <div className="relative h-16 px-10 bg-primary rounded-[2rem] flex items-center justify-center gap-4 overflow-hidden border border-white/20 shadow-2xl shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95 group">
                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    
                                    {isSaving ? (
                                        <RefreshCw className="w-5 h-5 animate-spin text-white" />
                                    ) : (
                                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <CheckCircle2 size={16} className="text-primary" />
                                        </div>
                                    )}
                                    
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-white font-black text-xs uppercase tracking-[0.25em]">
                                            {isSaving ? t('saving') || 'GÜNCELLENİYOR...' : t('saveChanges') || 'DEĞİŞİKLİKLERİ YAYINLA'}
                                        </span>
                                        {!isSaving && (
                                            <span className="text-white/40 text-[8px] uppercase tracking-widest mt-1 font-bold group-hover:text-white/60 transition-colors">
                                                Anında Sitede Güncellenir
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                ) : activeTab === "settings" ? (
                    <div className="max-w-4xl space-y-8">
                        <div>
                            <h2 className="text-xl font-bold">{t('accountSettings')}</h2>
                            <p className="text-sm text-foreground/50">{t('accountSettingsSub')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Domain Settings */}
                            <div className="md:col-span-2 glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-blue-400" /> {t('domainSettings') || 'Alan Adı Ayarları'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 opacity-60">{t('usernameLabel') || 'Kullanıcı Adı'}</label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <input
                                                        type="text"
                                                        value={profileData.username || ""}
                                                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold text-slate-900"
                                                        placeholder="kullanici-adi"
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">
                                                        .kardly.site
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-foreground/40 mt-2 italic px-1">
                                                {t('usernameHint') || 'Bu senin profil adresini belirler. Örn: username.kardly.site'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/20 relative overflow-hidden group">
                                            <div className="relative z-10">
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">{t('liveUrl') || 'Canlı Profil Adresi'}</p>
                                                <div className="flex items-center justify-between gap-4">
                                                    <a
                                                        href={`https://${profileData.username}.kardly.site`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-lg font-black text-slate-900 truncate hover:text-primary transition-colors flex items-center gap-2"
                                                    >
                                                        {profileData.username}.kardly.site <ExternalLink size={16} />
                                                    </a>
                                                    <button
                                                        onClick={() => copyToClipboard(`https://${profileData.username}.kardly.site`)}
                                                        className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all text-slate-400 hover:text-slate-900"
                                                    >
                                                        <Share2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSave()}
                                    disabled={isSaving}
                                    className="w-full py-4 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /> : <CheckCircle2 size={14} />}
                                    {t('updateSubdomain') || 'ALAN ADINI GÜNCELLE'}
                                </button>
                            </div>

                            <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-indigo-400" /> {t('appearanceSettings')}
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium mb-4 opacity-60">{t('themeColorLabel')}</label>
                                    <div className="grid grid-cols-5 gap-3">
                                        {["#6366f1", "#f43f5e", "#10b981", "#fbbf24", "#a855f7", "#0ea5e9", "#06b6d4", "#f97316", "#84cc16", "#dc2626", "#d946ef", "#1e3a8a", "#064e3b", "#475569", "#78350f", "#18181b"].map(color => (
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
                                <div className="pt-4 border-t border-white/5">
                                    <label className="block text-sm font-medium mb-4 opacity-60">{t('animationSettings')}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: "none", name: t('animNone') },
                                            { id: "3d-manual", name: t('animTilt') },
                                            { id: "float", name: t('animFloat') },
                                            { id: "3d-dynamic", name: t('animRotate') }
                                        ].map(anim => (
                                            <button
                                                key={anim.id}
                                                onClick={() => setProfileData({ ...profileData, animationStyle: anim.id })}
                                                className={cn(
                                                    "p-3 rounded-xl border text-center transition-all text-[10px] font-bold uppercase tracking-wider",
                                                    profileData.animationStyle === anim.id ? "bg-primary text-white border-primary shadow-lg" : "bg-white/5 border-white/10 hover:border-white/20 text-foreground/60"
                                                )}
                                            >
                                                {anim.name}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[9px] text-foreground/40 mt-2 italic px-1">{t('animationSettingsSub')}</p>
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                                >
                                    {t('saveSettings')}
                                </button>
                            </div>

                            <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                                            <Clock className="w-5 h-5 text-primary" /> {t('appointments')}
                                        </h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('workingHoursSub')}</p>
                                    </div>
                                    <div 
                                        onClick={() => setProfileData({ ...profileData, showAppointmentBtn: !profileData.showAppointmentBtn })}
                                        className={cn(
                                            "w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 relative",
                                            profileData.showAppointmentBtn ? "bg-primary shadow-lg shadow-primary/20" : "bg-slate-200"
                                        )}
                                    >
                                        <motion.div 
                                            animate={{ x: profileData.showAppointmentBtn ? 24 : 0 }}
                                            className="w-6 h-6 bg-white rounded-full shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100/50">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {t('timezoneLabel') || "Zaman Dilimi (Global Randevu İçin)"}
                                        </label>
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-primary animate-pulse">
                                            <Globe size={10} /> {t('globalReady') || "Global Desteği Aktif"}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <Globe size={14} />
                                        </div>
                                        <select 
                                            value={profileData.timezone || "Europe/Istanbul"}
                                            onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-10 py-3.5 text-xs font-black focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
                                            <option value="Europe/Berlin">Berlin (UTC+1/2)</option>
                                            <option value="Europe/London">Londra (UTC+0/1)</option>
                                            <option value="Europe/Paris">Paris (UTC+1/2)</option>
                                            <option value="America/New_York">New York (UTC-5/4)</option>
                                            <option value="America/Los_Angeles">Los Angeles (UTC-8/7)</option>
                                            <option value="Asia/Dubai">Dubai (UTC+4)</option>
                                            <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                                            <option value="Australia/Sydney">Sydney (UTC+10/11)</option>
                                            <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                                                {Intl.DateTimeFormat().resolvedOptions().timeZone} (Sizin Konumunuz)
                                            </option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-slate-400 italic px-1 font-medium">
                                        {t('timezoneSub') || "Randevularınız seçilen bu saat dilimi baz alınarak kaydedilir."}
                                    </p>
                                </div>


                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        <button 
                                            onClick={() => {
                                                const slots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
                                                setWorkingHours(slots)
                                            }}
                                            className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-primary hover:text-primary transition-all"
                                        >
                                            {t('presetFullDay') || "Tam Gün (09-18)"}
                                        </button>
                                        <button 
                                            onClick={() => setWorkingHours([])}
                                            className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-rose-500 hover:text-rose-500 transition-all"
                                        >
                                            {t('clearAll') || "Temizle"}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-3xl border border-dashed border-slate-200">
                                        {workingHours.sort().map((hour: string) => (
                                            <div key={hour} className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-2xl group hover:border-primary/30 hover:shadow-md transition-all">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-primary/40" />
                                                    <span className="text-sm font-black text-slate-700">{hour}</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const updated = workingHours.filter((h: string) => h !== hour)
                                                        setWorkingHours(updated)
                                                    }}
                                                    className="w-6 h-6 rounded-lg bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center p-1"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}

                                        <div className="flex items-center gap-2 px-2">
                                            <input
                                                type="time"
                                                value={newHour}
                                                onChange={(e) => setNewHour(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && newHour && !workingHours.includes(newHour)) {
                                                        setWorkingHours([...workingHours, newHour])
                                                        setNewHour("")
                                                    }
                                                }}
                                                className="w-full bg-white border-b-2 border-slate-200 px-2 py-1 focus:outline-none focus:border-primary text-sm font-black transition-all"
                                            />
                                            <button
                                                onClick={() => {
                                                    if (newHour && !workingHours.includes(newHour)) {
                                                        setWorkingHours([...workingHours, newHour])
                                                        setNewHour("")
                                                    }
                                                }}
                                                className="shrink-0 w-8 h-8 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    className="w-full py-5 bg-primary text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <CheckCircle2 size={18} /> {t('saveHours')}
                                </button>
                            </div>

                            <div className="md:col-span-2 glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-amber-400" /> {t('monetization')}
                                </h3>
                                <p className="text-[10px] text-foreground/40 leading-relaxed font-bold uppercase tracking-widest">{t('monetizationSub')}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium opacity-60">{t('paymentLink')}</label>
                                        <input
                                            type="text"
                                            value={profileData.paymentLink || ""}
                                            onChange={(e) => setProfileData({ ...profileData, paymentLink: e.target.value })}
                                            placeholder={t('paymentLinkHint')}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 text-sm"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium opacity-60">{t('paymentType')}</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: "coffee", name: t('coffeeBtn'), icon: <Coffee size={16} /> },
                                                { id: "consulting", name: t('consultingBtn'), icon: <Briefcase size={16} /> },
                                                { id: "support", name: t('supportBtn'), icon: <Heart size={16} /> },
                                                { id: "pay", name: t('payBtn'), icon: <CreditCard size={16} /> }
                                            ].map(type => (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => setProfileData({ ...profileData, paymentType: type.id })}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 relative group overflow-hidden",
                                                        profileData.paymentType === type.id
                                                            ? "bg-primary/10 border-primary text-primary shadow-[0_10px_30px_-10px_rgba(var(--primary-rgb),0.3)]"
                                                            : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/10"
                                                    )}
                                                >
                                                    {profileData.paymentType === type.id && (
                                                        <motion.div
                                                            layoutId="type-active"
                                                            className="absolute inset-0 bg-primary/5 -z-10"
                                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                        />
                                                    )}
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                                                        profileData.paymentType === type.id ? "bg-primary text-white scale-110" : "bg-white/5 text-slate-500 group-hover:scale-110"
                                                    )}>
                                                        {type.icon}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{type.name}</span>

                                                    {profileData.paymentType === type.id && (
                                                        <div className="absolute top-2 right-2">
                                                            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                                <Check size={10} className="text-white" strokeWidth={4} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSave()}
                                    className="w-full py-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl text-sm font-bold hover:bg-amber-500/20 transition-all uppercase tracking-widest text-xs"
                                >
                                    {t('saveMonetizationSettings')}
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
                    </div >

                ) : activeTab === "statistics" ? (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold">{t('statsTitle')}</h2>
                            <p className="text-sm text-foreground/50">{t('statsSub')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard icon={<Eye className="w-5 h-5 text-blue-400" />} label={t('totalViewsLabel')} value={stats.totalViews.toString()} trend={t('general')} />
                            <StatCard icon={<MousePointer2 className="w-5 h-5 text-emerald-400" />} label={t('clickRateLabel')} value={stats.clickRate} trend={t('average')} />
                            <StatCard icon={<FileText className="w-5 h-5 text-amber-400" />} label={t('cvViewsLabel')} value={stats.cvClicks.toString()} trend={t('file')} />
                            <StatCard icon={<Briefcase className="w-5 h-5 text-rose-400" />} label={t('projectClicksLabel')} value={stats.projectClicks.toString()} trend={t('portfolio')} />
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
                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{t('strategyTitle')}</p>
                                            <p className="text-base text-white font-bold leading-snug">
                                                {stats.totalViews > 10 && stats.clickRate.replace('%', '') < 5
                                                    ? t('strategyLowInteraction')
                                                    : t('strategyBalanced')}
                                            </p>
                                        </div>
                                        <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 shrink-0">
                                            {t('strategyApply')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                ) : activeTab === "templates" ? (
                    <div className="space-y-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t('designTemplates')}</h2>
                                <p className="text-sm text-slate-500 font-medium tracking-wide">{t('designTemplatesSub')}</p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setIsTplCatOpen(!isTplCatOpen)}
                                    className="flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-900 shadow-sm hover:border-primary/30 transition-all min-w-[240px] justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-primary group-hover:scale-110 transition-transform">
                                            {TEMPLATE_CATEGORIES.find(c => c.id === selectedTplCat)?.icon}
                                        </div>
                                        {TEMPLATE_CATEGORIES.find(c => c.id === selectedTplCat)?.name}
                                    </div>
                                    {isTplCatOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                </button>

                                <AnimatePresence>
                                    {isTplCatOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsTplCatOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 md:left-0 top-full mt-2 w-[280px] max-h-[400px] overflow-y-auto no-scrollbar bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-50 p-2 grid grid-cols-1 gap-1"
                                            >
                                                {TEMPLATE_CATEGORIES.map((cat) => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => {
                                                            setSelectedTplCat(cat.id);
                                                            setIsTplCatOpen(false);
                                                        }}
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all text-left",
                                                            selectedTplCat === cat.id
                                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                                        )}
                                                    >
                                                        <div className={cn(selectedTplCat === cat.id ? "text-white" : "text-primary/60")}>
                                                            {cat.icon}
                                                        </div>
                                                        {cat.name}
                                                        {selectedTplCat === cat.id && <Check size={14} className="ml-auto" />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {ALL_TEMPLATES.filter(t => selectedTplCat === "all" || t.category === selectedTplCat).map((tpl) => (
                                    <motion.div
                                        key={tpl.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        whileHover={{ y: -5 }}
                                        className={cn(
                                            "bg-white rounded-[2rem] border overflow-hidden group cursor-pointer transition-all shadow-sm",
                                            profileData.templateId === tpl.id ? "ring-2 ring-primary border-primary shadow-xl shadow-primary/10" : "border-slate-200 hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/50"
                                        )}
                                        onClick={() => {
                                            setProfileData({ ...profileData, templateId: tpl.id });
                                            handleSave({ templateId: tpl.id });
                                        }}
                                    >
                                        <div className="p-8">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex flex-col gap-2">
                                                    <h3 className="font-black text-slate-900 leading-tight">{tpl.name}</h3>
                                                    {tpl.isNew && (
                                                        <span className="w-fit px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg uppercase tracking-[0.15em] border border-emerald-100 shadow-sm animate-pulse">{t('new')}</span>
                                                    )}
                                                </div>
                                                {profileData.templateId === tpl.id && (
                                                    <div className="bg-primary text-white p-1.5 rounded-xl shadow-lg shadow-primary/20">
                                                        <CheckCircle2 size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{tpl.description}</p>
                                        </div>
                                        {/* Preview Strip */}
                                        <div className="h-2 bg-slate-50 border-t border-slate-100 group-hover:bg-primary/5 transition-colors" />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                ) : activeTab === "reviews" ? (
                    <div className="flex-1 flex flex-col p-4 sm:p-0 space-y-6 sm:space-y-10 pb-24 sm:pb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="relative">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary rounded-full hidden sm:block" />
                                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2 italic">
                                    {t('customerReviews')}
                                </h2>
                                <p className="text-[11px] sm:text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60">
                                    {t('reviewManageSub')}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl self-start sm:self-auto">
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                <span>{reviewList.length} {t('totalReviews') || 'TOPLAM YORUM'}</span>
                            </div>
                        </div>

                        {/* Mobile View: High-End Review Cards */}
                        <div className="sm:hidden space-y-4">
                            {reviewList.map((review: any) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-md">
                                                    <img
                                                        src={review.image || `https://ui-avatars.com/api/?name=${review.name}&background=random`}
                                                        className="w-full h-full object-cover"
                                                        alt={review.name}
                                                    />
                                                </div>
                                                <div className={cn(
                                                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-2 border-white flex items-center justify-center shadow-sm",
                                                    review.isActive ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                                                )}>
                                                    {review.isActive ? <Check size={10} strokeWidth={3} /> : <Clock size={10} strokeWidth={3} />}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <h4 className="text-[15px] font-black text-slate-900 tracking-tight italic uppercase">{review.name}</h4>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{review.title}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-0.5 text-amber-500 pt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-100"} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 p-5 rounded-[2rem] border border-slate-100/50 mb-8 relative">
                                        <Quote size={24} className="absolute -top-3 -left-1 text-slate-200 opacity-30" />
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed italic opacity-90 leading-relaxed truncate-3-lines">
                                            "{review.content}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleToggleReview(review.id, review.isActive)}
                                            className={cn(
                                                "flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all outline-none",
                                                review.isActive 
                                                    ? "bg-slate-900 text-white shadow-slate-200" 
                                                    : "bg-primary text-white shadow-primary/20"
                                            )}
                                        >
                                            {review.isActive ? <EyeOff size={14} /> : <Check size={14} />}
                                            <span>{review.isActive ? t('hide') : t('publish')}</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className="w-12 h-12 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl flex items-center justify-center active:scale-95 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            {reviewList.length === 0 && (
                                <div className="p-12 text-center bg-white rounded-[3rem] border border-slate-100 italic">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-5" />
                                    <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-300">{t('noReviewsYet')}</p>
                                </div>
                            )}
                        </div>

                        {/* Desktop View: Existing Table Refined */}
                        <div className="hidden sm:block bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
                            <table className="w-full text-left min-w-[800px]">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('userLabel')}</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('commentLabel')}</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('ratingLabel')}</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('statusLabel')}</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">{t('actionLabel')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {reviewList.map((review: any) => (
                                        <tr key={review.id} className="hover:bg-slate-50/40 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group-hover:rotate-3 transition-transform duration-500">
                                                        <img
                                                            src={review.image || `https://ui-avatars.com/api/?name=${review.name}&background=random`}
                                                            className="w-full h-full object-cover"
                                                            alt={review.name}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-900 uppercase italic tracking-tight group-hover:text-primary transition-colors">{review.name}</div>
                                                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">{review.title}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-[13px] text-slate-600 line-clamp-2 max-w-sm font-medium italic opacity-80 group-hover:opacity-100 transition-opacity leading-relaxed">
                                                    "{review.content}"
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={13} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-100"} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <button
                                                    onClick={() => handleToggleReview(review.id, review.isActive)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300",
                                                        review.isActive
                                                            ? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm shadow-emerald-100"
                                                            : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                                                    )}
                                                >
                                                    {review.isActive ? t('approved') : t('pending')}
                                                </button>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleToggleReview(review.id, review.isActive)}
                                                        className={cn(
                                                            "w-10 h-10 rounded-2xl flex items-center justify-center transition-all border shadow-sm hover:scale-110 active:scale-90",
                                                            review.isActive
                                                                ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300"
                                                                : "bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white"
                                                        )}
                                                        title={review.isActive ? t('hide') : t('publish')}
                                                    >
                                                        {review.isActive ? <EyeOff size={18} /> : <Check size={18} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReview(review.id)}
                                                        className="w-10 h-10 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm hover:scale-110 active:scale-90"
                                                        title={t('delete')}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {reviewList.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-24 text-center text-slate-300">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <MessageSquare size={40} className="text-slate-100" />
                                                </div>
                                                <p className="font-black uppercase tracking-[0.5em] text-[11px] opacity-40 italic mt-4">{t('noReviewsYet')}</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : activeTab === "leads" ? (
                    <div className="flex-1 flex flex-col p-4 sm:p-8 space-y-6 sm:space-y-10 pb-24 sm:pb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="relative">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary rounded-full hidden sm:block" />
                                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2 italic">
                                    {t('incomingLeads')}
                                </h2>
                                <p className="text-[11px] sm:text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60">
                                    {t('incomingLeadsSub')}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl self-start sm:self-auto">
                                <Activity size={14} className="text-primary animate-pulse" />
                                <span>{leads.length} {t('totalLeads')}</span>
                            </div>
                        </div>

                        {/* Leads CRM Stats Recap - More Premium */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {[
                                { label: t('totalLeads'), count: leads.length, icon: <Inbox size={18} />, bg: "from-indigo-500 to-blue-600", color: "text-white" },
                                { label: t('newLeads'), count: leads.filter((l: any) => l.status === 'new').length, icon: <Sparkles size={18} />, bg: "from-amber-400 to-orange-500", color: "text-white" },
                                { label: t('contactedLeads'), count: leads.filter((l: any) => l.status === 'contacted').length, icon: <Phone size={18} />, bg: "from-sky-400 to-indigo-500", color: "text-white" },
                                { label: t('completedLeads'), count: leads.filter((l: any) => l.status === 'completed').length, icon: <CheckCircle2 size={18} />, bg: "from-emerald-400 to-teal-600", color: "text-white" }
                            ].map((stat, idx) => (
                                <motion.div 
                                    key={idx} 
                                    whileHover={{ y: -5 }}
                                    className="relative group p-5 rounded-[2rem] overflow-hidden flex flex-col justify-between h-[120px] sm:h-[140px] shadow-sm border border-slate-100 bg-white"
                                >
                                    <div className={cn("absolute inset-0 opacity-[0.03] bg-gradient-to-br transition-opacity group-hover:opacity-[0.07]", stat.bg)} />
                                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-2 shadow-sm bg-gradient-to-br", stat.bg, stat.color)}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</div>
                                        <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none tabular-nums">{stat.count}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mobile View: High-End Card List */}
                        <div className="sm:hidden space-y-4">
                            {leads.map((lead: any) => (
                                <motion.div
                                    key={lead.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden"
                                    onClick={() => setSelectedLead(lead)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="text-xs font-black uppercase tracking-widest text-primary mb-1">
                                                {new Date(lead.createdAt).toLocaleDateString("tr-TR")}
                                            </div>
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">{lead.name}</h4>
                                        </div>
                                        <div className={cn(
                                            "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            lead.status === "new" ? "bg-amber-50 border-amber-100 text-amber-600" :
                                            lead.status === "contacted" ? "bg-sky-50 border-sky-100 text-sky-600" :
                                            "bg-emerald-50 border-emerald-100 text-emerald-600"
                                        )}>
                                            {lead.status === "new" ? t('statusNew') : lead.status === "contacted" ? t('statusContacted') : t('statusCompleted')}
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 italic opacity-80">
                                        "{lead.message}"
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                window.open(`tel:${lead.phone}`, '_blank')
                                                if (lead.status === 'new') handleUpdateLeadStatus(lead.id, 'contacted')
                                            }}
                                            className="flex-1 h-12 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                        >
                                            <Phone size={14} />
                                            <span>{t('phone')}</span>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteLead(lead.id)
                                            }}
                                            className="w-12 h-12 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl flex items-center justify-center active:scale-95 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            {leads.length === 0 && (
                                <div className="p-12 text-center bg-white rounded-[3rem] border border-slate-100 italic">
                                    <Inbox className="w-12 h-12 mx-auto mb-4 opacity-5" />
                                    <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-300">{t('noLeadsYet')}</p>
                                </div>
                            )}
                        </div>

                        {/* Desktop View: Existing Table with refinements */}
                        <div className="hidden sm:block bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
                            <table className="w-full text-left min-w-[800px]">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('client')}</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('message')}</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('status')}</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('date')}</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">{t('action')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {leads.map((lead: any) => (
                                        <tr
                                            key={lead.id}
                                            className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                                            onClick={() => setSelectedLead(lead)}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="font-black text-slate-900 group-hover:text-primary transition-colors uppercase italic tracking-tight">{lead.name}</div>
                                                <div className="flex flex-col gap-1 mt-2">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                                                        <Phone size={13} className="text-primary/50" />
                                                        {lead.phone}
                                                    </div>
                                                    {lead.email && (
                                                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                                                            <Mail size={12} className="text-slate-300" />
                                                            {lead.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-[13px] text-slate-600 font-medium line-clamp-2 max-w-[250px] leading-relaxed italic">"{lead.message}"</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                                    <select
                                                        value={lead.status}
                                                        onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                                                        className={cn(
                                                            "text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all",
                                                            lead.status === "new" ? "bg-amber-50 border-amber-200 text-amber-600" :
                                                            lead.status === "contacted" ? "bg-sky-50 border-sky-200 text-sky-600" :
                                                            "bg-emerald-50 border-emerald-200 text-emerald-600"
                                                        )}
                                                    >
                                                        <option value="new">{t('statusNew')}</option>
                                                        <option value="contacted">{t('statusContacted')}</option>
                                                        <option value="completed">{t('statusCompleted')}</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                {new Date(lead.createdAt).toLocaleDateString("tr-TR")}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            window.open(`tel:${lead.phone}`, '_blank')
                                                            if (lead.status === 'new') handleUpdateLeadStatus(lead.id, 'contacted')
                                                        }}
                                                        className="w-10 h-10 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm hover:scale-110 active:scale-90"
                                                    >
                                                        <Phone size={18} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDeleteLead(lead.id)
                                                        }}
                                                        className="w-10 h-10 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm hover:scale-110 active:scale-90"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-24 text-center text-slate-300">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <Inbox size={40} className="text-slate-100" />
                                                </div>
                                                <p className="font-black uppercase tracking-[0.5em] text-[11px] opacity-40 italic">{t('noLeadsYet')}</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : activeTab === "network" ? (
                    <div className="space-y-8 pb-20">
                        {/* 1. Hub Welcome Header */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-[3rem] border border-slate-200/60 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                                            {t('liveCommunity')}
                                        </div>
                                        <span className="text-xs text-slate-400 font-medium tracking-wide">
                                            {networkUsers.length} {t('activeProfessionals')}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                                        {t('welcomeBack')} <span className="text-primary">{session?.user?.name?.split(' ')[0]}!</span>
                                    </h2>
                                    <p className="text-sm text-slate-500 font-medium max-w-lg">
                                        {t('hubWelcomeDesc')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setIsHubAiOpen(true)}
                                        className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:bg-primary transition-all hover:scale-[1.02] active:scale-95 group"
                                    >
                                        <Sparkles size={18} className="text-primary group-hover:text-white transition-colors" />
                                        <span>{t('findWithAi')}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* 2. Main Content Area */}
                            <div className="flex-1 space-y-8 min-w-0">
                                {/* Top Picks / Recommended */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 px-2">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">🔥 {t('recommendedForYou')}</h3>
                                        <div className="h-0.5 flex-1 bg-slate-100 rounded-full" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {networkUsers
                                            .filter(u => u.id !== session?.user?.id && (u.profile?.occupation === profile?.occupation || u.profile?.avgRating >= 4.8))
                                            .slice(0, 3)
                                            .map((u: any, idx: number) => {
                                                const matchPercent = 85 + Math.floor(Math.random() * 14);
                                                return (
                                                    <motion.div 
                                                        key={`rec-${idx}`}
                                                        whileHover={{ y: -5 }}
                                                        className="bg-white p-6 rounded-[2.5rem] border border-primary/10 shadow-sm relative overflow-hidden group"
                                                    >
                                                        <div className="absolute top-0 right-0 p-4">
                                                            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                                                <Check size={14} strokeWidth={3} />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center text-center">
                                                            <div className="relative mb-4">
                                                                <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-slate-50">
                                                                    <img src={u.image || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-full h-full object-cover" alt="" />
                                                                </div>
                                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary border-2 border-white rounded-lg flex items-center justify-center text-white shadow-lg">
                                                                    <Sparkles size={12} fill="currentColor" />
                                                                </div>
                                                            </div>
                                                            <h4 className="font-black text-slate-900 mb-0.5 tracking-tight">{u.name}</h4>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                                                {u.profile?.occupation || t('user')}
                                                            </p>
                                                            
                                                            <div className="w-full space-y-2 mb-6">
                                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                                                                    <span>{t('match')}</span>
                                                                    <span className="text-primary">%{matchPercent}</span>
                                                                </div>
                                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                    <motion.div 
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${matchPercent}%` }}
                                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                                        className="h-full bg-primary" 
                                                                    />
                                                                </div>
                                                            </div>

                                                            <button 
                                                                onClick={() => window.open(`https://${u.profile?.username || u.name}.kardly.site`, '_blank')}
                                                                className="w-full py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                                            >
                                                                {t('connect')}
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                    </div>
                                </div>

                                {/* Filter Bar */}
                                <div className="bg-white/60 backdrop-blur-md p-4 rounded-[2rem] border border-slate-200/50 flex flex-col md:flex-row items-center gap-4 sticky top-4 z-40 shadow-sm">
                                    <div className="relative flex-1 w-full group">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Compass size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder={t('searchInHub')}
                                            value={networkSearch}
                                            onChange={(e) => setNetworkSearch(e.target.value)}
                                            className="w-full h-12 pl-14 pr-6 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none"
                                        />
                                    </div>
                                    
                                    <div className="flex items-center gap-3 w-full md:w-auto relative">
                                        <button 
                                            onClick={() => setHubOnlineOnly(!hubOnlineOnly)}
                                            className={`h-12 px-4 border rounded-2xl flex items-center gap-3 transition-all ${hubOnlineOnly ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${hubOnlineOnly ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-500'}`}>
                                                <div className={`w-2 h-2 rounded-full bg-current ${hubOnlineOnly && 'animate-pulse'}`} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest shrink-0 ${hubOnlineOnly ? 'text-emerald-700' : 'text-slate-500'}`}>{t('onlineOnly')}</span>
                                            <div className={`w-8 h-4 rounded-full relative p-0.5 transition-colors ${hubOnlineOnly ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${hubOnlineOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                                            </div>
                                        </button>

                                        <div className="relative group/category">
                                            <button 
                                                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                                className={`h-12 px-5 border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary/20 transition-all flex items-center gap-2 ${selectedHubCategory ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-white border-slate-100 text-slate-500'}`}
                                            >
                                                <Filter size={14} />
                                                {selectedHubCategory || t('expertise')}
                                            </button>

                                            <AnimatePresence>
                                                {isCategoryDropdownOpen && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-[60]"
                                                    >
                                                        <div 
                                                            onClick={() => { setSelectedHubCategory(""); setIsCategoryDropdownOpen(false); }}
                                                            className="px-4 py-3 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer"
                                                        >
                                                            {t('categoryAll')}
                                                        </div>
                                                        {Array.from(new Set(networkUsers.map(u => u.profile?.occupation).filter(Boolean))).map((occ: any) => (
                                                            <div 
                                                                key={occ}
                                                                onClick={() => { setSelectedHubCategory(occ); setIsCategoryDropdownOpen(false); }}
                                                                className="px-4 py-3 hover:bg-primary/5 hover:text-primary rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer transition-colors"
                                                            >
                                                                {occ}
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                {/* Profiles Grid */}
                                {isNetworkLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className="h-64 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse shadow-sm" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                                        {networkUsers
                                            .filter(u => {
                                                const searchLower = networkSearch.toLowerCase()
                                                const matchesSearch = (
                                                    u.name?.toLowerCase().includes(searchLower) ||
                                                    u.profile?.occupation?.toLowerCase().includes(searchLower) ||
                                                    u.profile?.username?.toLowerCase().includes(searchLower) ||
                                                    u.profile?.displayName?.toLowerCase().includes(searchLower)
                                                )
                                                const matchesCategory = !selectedHubCategory || u.profile?.occupation === selectedHubCategory
                                                const matchesOnline = !hubOnlineOnly || u.isActive === true

                                                return matchesSearch && matchesCategory && matchesOnline
                                            })
                                            .map((user: any) => (
                                                <motion.div 
                                                    key={user.id} 
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    whileHover={{ y: -8, scale: 1.01 }}
                                                    className="group relative bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] hover:border-primary/20 transition-all duration-500 cursor-pointer flex flex-col shadow-sm"
                                                    onClick={() => window.open(`https://${user.profile?.username || user.name}.kardly.site`, '_blank')}
                                                >
                                                    {/* Top Accent Bar */}
                                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-indigo-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    
                                                    {/* Ambient Glow */}
                                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors duration-500" />

                                                    <div className="p-4 sm:p-7 relative z-10 flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-6">
                                                            <div className="relative shrink-0">
                                                                <div className="w-14 h-14 sm:w-16 h-16 rounded-2xl sm:rounded-[1.5rem] overflow-hidden border-2 border-white shadow-md bg-slate-50 group-hover:rotate-3 transition-transform duration-500">
                                                                    {user.image ? (
                                                                        <img src={user.image} className="w-full h-full object-cover" alt={user.name} />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                                            <User size={28} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse" />
                                                            </div>
                                                            
                                                            <div className="flex-1 min-w-0 pt-0.5">
                                                                <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 sm:gap-2 mb-1 sm:mb-0.5">
                                                                    <h3 className="text-[13px] sm:text-base font-black text-slate-900 group-hover:text-primary transition-colors truncate tracking-tight max-w-full">
                                                                        {user.profile?.displayName || user.name}
                                                                    </h3>
                                                                    <div className="flex items-center gap-0.5 text-amber-500">
                                                                        <Star size={10} fill="currentColor" />
                                                                        <span className="text-[10px] font-bold">{user.profile?.avgRating || "5.0"}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                                                                    <div className="w-1 h-1 rounded-full bg-primary hidden sm:block" />
                                                                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-full">
                                                                        {user.profile?.occupation || t('user')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {user.profile?.slogan && (
                                                            <div className="hidden sm:block mb-6 relative">
                                                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-100 rounded-full group-hover:bg-primary/20 transition-colors" />
                                                                <p className="text-[11px] text-slate-500 font-medium line-clamp-2 pl-4 italic leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                                                    "{user.profile.slogan}"
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="mt-auto w-full pt-4 sm:pt-5 flex flex-col sm:flex-row items-center justify-between border-t border-slate-50/50 gap-3 sm:gap-0">
                                                            <div className="hidden sm:flex items-center gap-2.5">
                                                                <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                                    <Globe size={11} className="text-slate-400 group-hover:text-primary" />
                                                                </div>
                                                                <span className="text-[9px] sm:text-[10px] font-black text-slate-500 group-hover:text-slate-900 uppercase tracking-wider truncate max-w-[100px] transition-colors">
                                                                    {user.profile?.username || user.name}.kardly.site
                                                                </span>
                                                            </div>
                                                            <button 
                                                                className="w-full sm:w-auto h-9 sm:h-10 px-3 sm:px-4 bg-slate-100/50 sm:bg-slate-50 hover:bg-primary hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    window.open(`https://${user.profile?.username || user.name}.kardly.site`, '_blank');
                                                                }}
                                                            >
                                                                {t('visitProfile')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {/* 3. Sidebar (Trending & New Members) */}
                            <aside className="w-full lg:w-80 space-y-6">
                                {/* Trending Section */}
                                <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200/60 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-sm tracking-tight uppercase">{t('trending')}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{t('popularProfiles')}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[...networkUsers]
                                            .sort((a, b) => (b.profile?.totalViews || 0) - (a.profile?.totalViews || 0))
                                            .slice(0, 4)
                                            .map((u: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 group cursor-pointer" onClick={() => window.open(`https://${u.profile?.username || u.name}.kardly.site`, '_blank')}>
                                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 group-hover:border-primary/30 transition-all">
                                                    <img src={u.image || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate">{u.name}</div>
                                                    <div className="text-[10px] text-slate-400 truncate uppercase tracking-widest font-black leading-none">{u.profile?.occupation || t('user')}</div>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-lg">
                                                    <Star size={10} fill="currentColor" />
                                                    {u.profile?.avgRating || "5.0"}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Recommendation Section */}
                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                                            <Sparkles size={24} className="text-primary" />
                                        </div>
                                        <h4 className="text-xl font-black tracking-tight mb-2 leading-tight">{t('wantToGrow')}</h4>
                                        <p className="text-xs text-slate-400 font-medium mb-6">{t('growDesc')}</p>
                                        <button 
                                            onClick={() => setIsHubAiOpen(true)}
                                            className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                                        >
                                            {t('tryNow')}
                                        </button>
                                    </div>
                                </div>
                            </aside>
                        </div>
                        
                        {!isNetworkLoading && networkUsers.length === 0 && (
                            <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                                <Compass className="w-16 h-16 mx-auto mb-6 text-slate-200" />
                                <h3 className="text-xl font-black text-slate-900 mb-2">{t('noUsersFound')}</h3>
                                <p className="text-sm text-slate-400 font-medium">{t('hubEmptyDesc')}</p>
                            </div>
                        )}
                    </div>
                ) : null

                }

                {/* Modals outside of conditional tabs */}
                <AnimatePresence>
                    {showProductModal && (
                        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-4">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
                            <motion.div
                                initial={{ opacity: 0, y: "100%" }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="bg-[#f8fafc] w-full sm:max-w-md rounded-t-[3rem] sm:rounded-[2.5rem] p-8 sm:p-6 relative z-10 shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto no-scrollbar pb-20 sm:pb-6"
                            >
                                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden" />
                                <button onClick={() => setShowProductModal(false)} className="absolute top-6 right-8 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-700 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="mb-6">
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight">{editingProduct ? t('editProject') : t('addNewProject')}</h2>
                                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-1">{editingProduct ? t('editProjectSub') : t('newProjectSub')}</p>
                                </div>

                                <form onSubmit={handleAddProduct} className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{t('projectImage')}</label>
                                        <div
                                            className="relative border-2 border-dashed border-slate-200 bg-white rounded-3xl overflow-hidden transition-all hover:border-primary/50 cursor-pointer group"
                                            onClick={() => document.getElementById('product-image-upload')?.click()}
                                        >
                                            {newProduct.image ? (
                                                <div className="relative aspect-video">
                                                    <img src={newProduct.image} alt="Proje" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); setNewProduct((prev: any) => ({ ...prev, image: '' })); }}
                                                        className="absolute top-2 right-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="py-10 flex flex-col items-center gap-2 text-slate-400 group-hover:text-primary transition-colors">
                                                    {isProductImageUploading ? (
                                                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-1">
                                                            <Upload size={24} />
                                                        </div>
                                                    )}
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        {isProductImageUploading ? t('loading') : t('projectImageSub')}
                                                    </span>
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

                                                setIsProductImageUploading(true);
                                                const formData = new FormData();
                                                formData.append("file", file);

                                                try {
                                                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                    const data = await res.json();
                                                    if (res.ok && data.url) {
                                                        setNewProduct((prev: any) => ({ ...prev, image: data.url }));
                                                        setShowToast("Proje resmi yüklendi! ✨");
                                                    } else {
                                                        setShowToast(data.error || "Yükleme hatası");
                                                    }
                                                } catch (err) {
                                                    console.error(err);
                                                    setShowToast("Bağlantı hatası");
                                                } finally {
                                                    setIsProductImageUploading(false);
                                                    setTimeout(() => setShowToast(null), 3000);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Proje Adı</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder={t('projectTitle')}
                                                className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                                value={newProduct.name}
                                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Canlı Link / GitHub</label>
                                            <input
                                                type="text"
                                                placeholder={t('liveLinkGithub')}
                                                className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                                value={newProduct.link}
                                                onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Proje Açıklaması</label>
                                            <textarea
                                                rows={3}
                                                placeholder={t('projectDescription')}
                                                className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                                                value={newProduct.description}
                                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isProductSaving}
                                        className="w-full bg-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                                    >
                                        {isProductSaving ? t('savingProject') : t('saveProject')}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}

                    {showServiceModal && (
                        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-6">
                            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowServiceModal(false)} />
                            <motion.div
                                initial={{ opacity: 0, y: "100%" }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="bg-white border border-slate-200 w-full sm:max-w-lg rounded-t-[3rem] sm:rounded-[3rem] p-10 relative z-10 shadow-2xl overflow-hidden pb-20 sm:pb-10"
                            >
                                <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8 sm:hidden" />
                                <div className="absolute top-0 left-0 w-full h-2 bg-primary" />

                                <button onClick={() => setShowServiceModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="mb-8">
                                    <div className="w-14 h-14 bg-primary/5 rounded-[1.25rem] flex items-center justify-center mb-6 shadow-sm">
                                        <Zap className="w-7 h-7 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">{editingServiceIndex !== null ? t('editExpertise') : t('newExpertiseTitle')}</h2>
                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">{editingServiceIndex !== null ? t('editExpertiseSub') : t('newExpertiseSub')}</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('titleLabel')}</label>
                                        <input
                                            type="text"
                                            placeholder={t('titlePlaceholder')}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 focus:outline-none focus:ring-4 focus:ring-primary/5 text-sm sm:text-base text-slate-900 font-bold transition-all placeholder:text-slate-300"
                                            value={newService.title}
                                            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('descriptionLabel')}</label>
                                        <textarea
                                            rows={4}
                                            placeholder={t('descriptionPlaceholder')}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 focus:outline-none focus:ring-4 focus:ring-primary/5 text-sm sm:text-base text-slate-900 font-bold resize-none transition-all placeholder:text-slate-300"
                                            value={newService.description}
                                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddService}
                                        className="w-full bg-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                                    >
                                        {editingServiceIndex !== null ? t('update') : t('addExpertise')}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {selectedLead && (
                        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-4">
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedLead(null)} />
                            <motion.div
                                initial={{ opacity: 0, y: "100%" }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="bg-white w-full sm:max-w-lg rounded-t-[3rem] sm:rounded-[3rem] p-8 sm:p-10 relative z-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden pb-24 sm:pb-10"
                            >
                                <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8 sm:hidden" />
                                {/* Decorative elements */}
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-indigo-500 to-sky-500" />
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />

                                <button onClick={() => setSelectedLead(null)} className="absolute top-8 right-8 w-11 h-11 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-white transition-all z-20">
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="relative z-10 text-left">
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-2xl sm:text-3xl font-black text-slate-300 shadow-inner">
                                            {selectedLead.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{selectedLead.name}</h2>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{t('client')}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 mb-10">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t('phone')}</p>
                                                <p className="text-sm font-bold text-slate-900 tracking-tight leading-none">{selectedLead.phone}</p>
                                            </div>
                                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t('email')}</p>
                                                <p className="text-sm font-bold text-slate-900 truncate tracking-tight leading-none">{selectedLead.email || "-"}</p>
                                            </div>
                                        </div>

                                        <div className="p-7 bg-slate-50 border border-slate-100 rounded-[2rem] relative">
                                            <Quote className="absolute top-6 right-6 text-primary/5 w-14 h-14" />
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('message')}</p>
                                            <p className="text-sm sm:text-base text-slate-700 font-bold leading-relaxed relative z-10">
                                                {selectedLead.message}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between p-5 border border-slate-100 rounded-[1.5rem] bg-white shadow-sm overflow-hidden">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-4 h-4 rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]",
                                                    selectedLead.status === "new" ? "bg-amber-400 animate-pulse" :
                                                        selectedLead.status === "contacted" ? "bg-sky-400" : "bg-emerald-400"
                                                )} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('status')}</span>
                                            </div>
                                            <select
                                                value={selectedLead.status}
                                                onChange={(e) => {
                                                    const newStatus = e.target.value
                                                    handleUpdateLeadStatus(selectedLead.id, newStatus)
                                                    setSelectedLead({ ...selectedLead, status: newStatus })
                                                }}
                                                className={cn(
                                                    "text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border appearance-none cursor-pointer focus:outline-none transition-all shadow-sm",
                                                    selectedLead.status === "new" ? "bg-amber-50 border-amber-100 text-amber-600" :
                                                        selectedLead.status === "contacted" ? "bg-sky-50 border-sky-100 text-sky-600" :
                                                            "bg-emerald-50 border-emerald-100 text-emerald-600"
                                                )}
                                            >
                                                <option value="new">{t('statusNew')}</option>
                                                <option value="contacted">{t('statusContacted')}</option>
                                                <option value="completed">{t('statusCompleted')}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => {
                                                window.open(`tel:${selectedLead.phone}`, '_blank')
                                                if (selectedLead.status === 'new') {
                                                    handleUpdateLeadStatus(selectedLead.id, 'contacted')
                                                    setSelectedLead({ ...selectedLead, status: 'contacted' })
                                                }
                                            }}
                                            className="h-16 bg-primary text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                        >
                                            <Phone size={20} /> {t('callNow')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm("Bu talebi silmek istediğinize emin misiniz?")) {
                                                    handleDeleteLead(selectedLead.id)
                                                    setSelectedLead(null)
                                                }
                                            }}
                                            className="h-16 bg-rose-50 text-rose-500 border border-rose-100 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-3"
                                        >
                                            <Trash2 size={20} /> {t('delete')}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Mobile Bottom Navigation */}
                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
            </main >
        </div >
        <style jsx>{`
            @keyframes shimmer {
                100% { transform: translateX(100%); }
            }
            .animate-shimmer {
                animation: shimmer 2s infinite;
            }
        `}</style>
            {/* Business Hub AI Assistant Slide-over */}
            <AnimatePresence mode="wait">
                {isHubAiOpen && (
                    <>
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsHubAiOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60]"
                        />
                        <motion.div
                            key="panel"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-[110] flex flex-col border-l border-slate-100"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-primary/20">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 uppercase tracking-tight">Kardly Ağ Asistanı</h3>
                                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mt-1.5 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            Yapay Zeka Destekli
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsHubAiOpen(false)}
                                    className="w-10 h-10 rounded-2xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all hover:rotate-90"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                {hubAiChat.length === 0 && (
                                    <div className="text-center py-20 space-y-6">
                                        <div className="w-24 h-24 bg-primary/5 rounded-[3rem] flex items-center justify-center mx-auto text-primary relative">
                                            <Search size={40} className="relative z-10" />
                                            <div className="absolute inset-0 bg-primary/10 rounded-[3rem] animate-ping opacity-20" />
                                        </div>
                                        <div className="space-y-3 max-w-xs mx-auto">
                                            <h4 className="font-black text-xl text-slate-900 uppercase tracking-tight">Arama Yapın</h4>
                                            <p className="text-xs text-slate-500 font-bold leading-relaxed">
                                                Ağdaki profesyonelleri bulmanıza yardım edebilirim. Meslek, yetenek veya bölgeye göre sormanız yeterli.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2 pt-4">
                                            {[
                                                "Yazılımcı bul",
                                                "Grafik tasarımcı var mı?",
                                                "E-ticaret uzmanı öner",
                                                "İstanbul'da kimler var?"
                                            ].map((hint, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setHubAiMessage(hint)}
                                                    className="px-5 py-2.5 rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                                                >
                                                    {hint}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {hubAiChat.map((m, i) => (
                                    <div key={i} className={cn("flex w-full", m.role === 'user' ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "max-w-[90%] p-5 rounded-[2rem] text-sm font-semibold leading-relaxed shadow-sm",
                                            m.role === 'user' 
                                                ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20" 
                                                : "bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none whitespace-pre-wrap"
                                        )}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}

                                {isHubAiLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-slate-50 p-5 rounded-[2rem] rounded-tl-none border border-slate-100">
                                            <div className="flex gap-2 px-1">
                                                <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-slate-100 bg-white">
                                <div className="relative group flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={hubAiMessage}
                                        onChange={(e) => setHubAiMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleHubAiChat()}
                                        placeholder="Kimi arıyorsunuz?"
                                        className="flex-1 h-16 pl-6 pr-14 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                                    />
                                    <button
                                        onClick={handleHubAiChat}
                                        disabled={!hubAiMessage.trim() || isHubAiLoading}
                                        className="absolute right-3 top-3 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center mt-6 flex items-center justify-center gap-2">
                                    <span className="w-8 h-[1px] bg-slate-100" />
                                    GÜCÜNÜ KARDLY AI'DAN ALIR
                                    <span className="w-8 h-[1px] bg-slate-100" />
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function StatBar({ label, count, total, color }: any) {
    const percentage = total > 0 ? (count / total * 100).toFixed(0) : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
                <span className="opacity-60">{label}</span>
                <span>{count} ({percentage}%)</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden group">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${color} rounded-full shadow-sm`} 
                />
            </div>
        </div>
    );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-3xl font-black transition-all text-[10px] uppercase tracking-[0.2em] group relative",
                active
                    ? "bg-primary text-white shadow-xl shadow-primary/20"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
            )}
        >
            <div className={cn("transition-all duration-500", active ? "scale-110" : "group-hover:scale-110 group-hover:text-primary")}>
                {icon}
            </div>
            <span className="truncate">{label}</span>
            {active && (
                <motion.div
                    layoutId="active-nav-indicator"
                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff]"
                />
            )}
        </button>
    );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-primary/20 transition-all relative overflow-hidden group"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gradient-to-tr from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:rotate-6 transition-transform duration-500 shadow-inner">
                    {icon}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 backdrop-blur-sm">
                    <TrendingUp size={12} className="text-emerald-500" />
                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        {trend}
                    </span>
                </div>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">{label}</p>
            <p className="text-4xl font-black tracking-tight text-slate-900 mb-1">{value}</p>
            
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-4">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "70%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-rose-400 rounded-full"
                />
            </div>

            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
}

function BottomNav({ activeTab, setActiveTab, t }: any) {
    const navItems = [
        { id: "overview", icon: <Activity className="w-5 h-5" />, label: t('overview') || "Özet" },
        { id: "network", icon: <Compass className="w-5 h-5" />, label: "Hub" },
        { id: "edit", icon: <User className="w-5 h-5" />, label: t('editPage') || "Düzenle" },
        { id: "businesscard", icon: <IdCard className="w-5 h-5" />, label: t('digitalCard') || "Kart" },
        { id: "settings", icon: <Settings className="w-5 h-5" />, label: t('settings') || "Ayarlar" },
    ]

    return (
        <div className="lg:hidden fixed bottom-6 left-0 right-0 z-[100] px-4 pointer-events-none">
            <nav className="bg-slate-950/80 backdrop-blur-3xl border border-white/5 rounded-full p-1.5 flex items-center justify-between shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] max-w-sm mx-auto pointer-events-auto">
                <AnimatePresence mode="wait">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "relative flex-1 flex flex-col items-center gap-1.5 py-3 rounded-full transition-all duration-300",
                                    isActive ? "text-white" : "text-slate-500 active:scale-90"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 bg-white/10 rounded-full z-0"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <div className={cn(
                                    "relative z-10 transition-transform duration-500",
                                    isActive ? "scale-110 -translate-y-0.5 text-primary" : "scale-100"
                                )}>
                                    {item.icon}
                                </div>
                                <span className={cn(
                                    "relative z-10 text-[7px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 h-0 overflow-hidden"
                                )}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </AnimatePresence>
            </nav>
        </div>
    );
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
    };

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
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
   
 