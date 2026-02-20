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
    User,
    Gamepad2,
    Cpu,
    History,
    Inbox,
    Cloud,
    Moon,
    Sun,
    Target,
    Wind,
    Gem,
    Waves,
    Compass,
    Crosshair,
    Dna,
    Atom,
    Boxes,
    ChevronDown,
    ChevronUp
} from "lucide-react"


import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"
import { QRCodeCard } from "@/components/QRCodeCard"
import { useTranslation } from "@/context/LanguageContext"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"



export default function DashboardClient({ session, profile, subscription, appointments, products, reviews, stats }: any) {
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
        { id: "celestial", name: t('catCelestial'), icon: <Compass size={14} /> },
        { id: "minimal", name: t('catMinimal'), icon: <Layout size={14} /> },
        { id: "industrial", name: t('catIndustrial'), icon: <Wind size={14} /> },
        { id: "vibrant", name: t('catVibrant'), icon: <Zap size={14} /> },
        { id: "royal", name: t('catRoyal'), icon: <Gem size={14} /> },
        { id: "tech", name: t('catTech'), icon: <Atom size={14} /> },
        { id: "meta", name: t('catMeta'), icon: <Boxes size={14} /> }
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
        profileBgImage: profile?.profileBgImage || ""
    })
    const [selectedTplCat, setSelectedTplCat] = useState("all")
    const [isTplCatOpen, setIsTplCatOpen] = useState(false)
    const [isQuickTplMenuOpen, setIsQuickTplMenuOpen] = useState(false)
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
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [statsRange, setStatsRange] = useState("30")

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
    const [leads, setLeads] = useState<any[]>([])
    const [isLeadsLoading, setIsLeadsLoading] = useState(false)

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
        { id: "meta_pixel", category: "meta", name: "👾 8-Bit Evren", description: "Piksel piksel bir dünya ve retro dijital parıltılar.", isNew: true }
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
                    showVideoAsProfile: overrides?.showVideoAsProfile ?? profileData.showVideoAsProfile,
                    isCatalog: overrides?.isCatalog ?? profileData.isCatalog,
                    paymentLink: overrides?.paymentLink ?? profileData.paymentLink,
                    paymentType: overrides?.paymentType ?? profileData.paymentType,
                    animationStyle: overrides?.animationStyle ?? profileData.animationStyle,
                    profileBgImage: overrides?.profileBgImage ?? profileData.profileBgImage
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
                    setShowToast("Proje güncellendi!")
                } else {
                    setProductList([updatedProduct, ...productList])
                    setShowToast("Ürün eklendi!")
                }
                setShowProductModal(false)
                setEditingProduct(null)
                setNewProduct({ name: "", description: "", price: "", link: "", image: "" })
                setTimeout(() => setShowToast(null), 3000)
            }
        } catch (err) {
            console.error(err)
            setShowToast("İşlem başarısız!")
            setTimeout(() => setShowToast(null), 3000)
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
                "fixed inset-y-0 left-0 z-[60] w-72 border-r border-slate-200 bg-white p-6 flex flex-col transition-transform duration-300 overflow-y-auto no-scrollbar lg:relative lg:translate-x-0 lg:z-10",
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
                        icon={<Monitor className="w-5 h-5" />}
                        label={t('overview') || "Genel Bakış"}
                        active={activeTab === "overview"}
                        onClick={() => {
                            setActiveTab("overview")
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
                        icon={<QrCode className="w-5 h-5" />}
                        label={t('qrcode')}
                        active={activeTab === "qrcode"}
                        onClick={() => {
                            setActiveTab("qrcode")
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
                        <p className="text-slate-400 text-sm font-medium tracking-wide">{t('welcomeSub')}</p>
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

                {activeTab === "overview" ? (
                    <div className="space-y-10">
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
                                        <StatBar label={t('instagramSocial')} count={420} total={1000} color="bg-primary" />
                                        <StatBar label={t('whatsappShares')} count={280} total={1000} color="bg-indigo-500" />
                                        <StatBar label={t('directTraffic')} count={150} total={1000} color="bg-emerald-500" />
                                        <StatBar label={t('others')} count={150} total={1000} color="bg-slate-200" />
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
                                        <button onClick={() => setActiveTab("qrcode")} className="group p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-slate-500/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all text-center">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                <QrCode size={20} />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-600 block">{t('shareQR')}</span>
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
                            </div>
                        </div >
                    </div >
                ) : activeTab === "edit" ? (
                    <div className="space-y-10">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            <StatCard icon={<Eye />} label={t('totalViewsLabel')} value={stats?.totalViews?.toString() || "0"} trend="+0%" />
                            <StatCard icon={<MousePointer2 />} label={t('clickRateLabel')} value={stats?.clickRate || "0%"} trend="+0%" />
                            <StatCard icon={<Users />} label={t('vCardClicksLabel')} value={stats?.vCardClicks?.toString() || "0"} trend="+0%" />

                            <div className="glass p-6 rounded-3xl border-white/5 flex flex-col items-center justify-center">
                                <QRCodeCard username={profile?.username || "demo"} />
                            </div>
                        </div>

                        {/* Editor Preview Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Simple Editor Controls */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold">{t('editProfileInfo')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2 opacity-60">{t('profilePicture')}</label>
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 relative">
                                                {profileData.showVideoAsProfile && profileData.youtubeVideoUrl ? (
                                                    <div className="w-full h-full bg-black flex items-center justify-center">
                                                        <Youtube className="w-6 h-6 text-red-500 animate-pulse" />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={profileData?.image || session?.user?.image || `https://ui-avatars.com/api/?name=${profileData?.name || "User"}`}
                                                        className="w-full h-full object-cover"
                                                        alt="Preview"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={profileData?.image || ""}
                                                    onChange={(e) => setProfileData({ ...profileData, image: e.target.value })}
                                                    placeholder={t('imagePlaceholder')}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm h-fit"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('image-upload')?.click()}
                                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2 h-fit shrink-0"
                                                >
                                                    <Upload className="w-4 h-4" /> {t('upload')}
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
                                    <div className="md:col-span-2 space-y-4 mb-6">
                                        <label className="block text-sm font-medium mb-2 opacity-60">{t('profileBgImageLabel')}</label>
                                        <div className="flex gap-4">
                                            <div className="w-24 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 relative shadow-inner">
                                                {profileData.profileBgImage ? (
                                                    <img
                                                        src={profileData.profileBgImage}
                                                        className="w-full h-full object-cover"
                                                        alt="BG Preview"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-800/50">
                                                        <Monitor className="w-6 h-6 opacity-20" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 flex gap-2 self-end">
                                                <input
                                                    type="text"
                                                    value={profileData?.profileBgImage || ""}
                                                    onChange={(e) => setProfileData({ ...profileData, profileBgImage: e.target.value })}
                                                    placeholder={t('bgImagePlaceholder')}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm h-fit"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('bg-image-upload')?.click()}
                                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2 h-fit shrink-0"
                                                >
                                                    <Upload className="w-4 h-4" /> {t('upload')}
                                                </button>
                                            </div>
                                            <input
                                                id="bg-image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setProfileData({ ...profileData, profileBgImage: reader.result as string });
                                                    reader.readAsDataURL(file);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2 opacity-60">{t('displayNameLabel')}</label>
                                        <input
                                            type="text"
                                            value={profileData?.name || session?.user?.name || ""}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            placeholder={t('namePlaceholder')}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 opacity-60">{t('occupationLabel')}</label>
                                        <input
                                            type="text"
                                            value={profileData?.occupation || ""}
                                            onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                                            placeholder={t('occupationPlaceholder')}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 opacity-60">{t('locationLabel')}</label>
                                        <input
                                            type="text"
                                            value={profileData?.phone || ""}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            placeholder={t('locationPlaceholder')}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 opacity-60">{t('mottoLabel')}</label>
                                    <input
                                        type="text"
                                        value={profileData?.slogan || ""}
                                        onChange={(e) => setProfileData({ ...profileData, slogan: e.target.value })}
                                        placeholder={t('mottoPlaceholder')}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 opacity-60">{t('aboutLabel')}</label>
                                    <textarea
                                        rows={3}
                                        value={profileData?.bio || ""}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        placeholder={t('aboutPlaceholder')}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 opacity-60">{profileData.isCatalog ? 'Katalog' : 'CV'} (PDF/DOC)</label>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="isCatalog"
                                                checked={profileData.isCatalog}
                                                onChange={(e) => setProfileData({ ...profileData, isCatalog: e.target.checked })}
                                                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/50"
                                            />
                                            <label htmlFor="isCatalog" className="text-sm font-medium opacity-80 cursor-pointer">{t('showAsCatalog')}</label>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-primary">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={profileData?.cvUrl || ""}
                                                    onChange={(e) => setProfileData({ ...profileData, cvUrl: e.target.value })}
                                                    placeholder={profileData.isCatalog ? t('catalogFileHint') : t('cvHint')}
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
                                        <p className="text-[10px] text-slate-400 italic ps-12">{t('catalogHint')}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <label className="block text-sm font-medium mb-4 opacity-60">{t('socialConnections')}</label>
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
                                                placeholder={t('locationLinkPlaceholder')}
                                                value={getSocialUrl("location")}
                                                onChange={(e) => updateSocialLink("location", e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* Custom Links Section */}
                                <div className="pt-4 border-t border-white/5">
                                    <label className="block text-sm font-medium mb-4 opacity-60">{t('customLinksLabel')}</label>
                                    <p className="text-xs text-slate-400 mb-4">{t('customLinksSub')}</p>

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
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => toggleLinkAction(i)}
                                                            className={cn(
                                                                "px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all",
                                                                link.isAction ? "bg-amber-500/20 text-amber-500 border border-amber-500/20" : "bg-white/5 text-white/30 border border-white/5 hover:bg-white/10"
                                                            )}
                                                        >
                                                            {link.isAction ? t('buttonDone') : t('makeButton')}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteLink(i)}
                                                            className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add New Link */}
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            placeholder={t('linkTitlePlaceholder')}
                                            value={newLink.title}
                                            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                        />
                                        <div className="flex items-center gap-2 mb-1 px-1">
                                            <button
                                                onClick={() => setNewLink({ ...newLink, isAction: !newLink.isAction })}
                                                className={cn(
                                                    "w-10 h-5 rounded-full relative transition-all duration-300",
                                                    newLink.isAction ? "bg-amber-500" : "bg-white/10"
                                                )}
                                            >
                                                <div className={cn(
                                                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
                                                    newLink.isAction ? "left-6" : "left-1"
                                                )} />
                                            </button>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('showAsMainButton')}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder={t('linkUrlPlaceholder')}
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
                                                <Plus className="w-4 h-4" /> {t('add')}
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

                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded-[3.5rem] cursor-pointer" onClick={() => profile?.username && window.open(`/${profile.username}`, '_blank')}>
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
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">{t('myProjects')}</h2>
                                <p className="text-sm text-foreground/50">{t('myProjectsSub')}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingProduct(null)
                                    setNewProduct({ name: "", description: "", price: "", link: "", image: "" })
                                    setShowProductModal(true)
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                            >
                                <Plus className="w-5 h-5" /> {t('addNewProject')}
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
                                                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
                                            >
                                                {t('edit')}
                                            </button>
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
                                    <p className="text-lg font-bold">{t('noProjectsYet')}</p>
                                    <p className="text-sm text-foreground/40 mt-2">{t('noProjectsYetSub')}</p>
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
                                            className="p-3 bg-white/5 border border-white/10 text-white/40 rounded-xl hover:bg-white/10 hover:text-white transition-all shadow-sm"
                                            title={t('edit')}
                                        >
                                            <Sparkles className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteService(index)}
                                            className="flex items-center gap-2 p-3 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white"
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
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">{t('appointmentRequests')}</h2>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white/40">{t('all')}</span>
                                <span className="px-3 py-1 bg-primary/20 border border-primary/20 rounded-full text-xs font-bold text-primary">{t('pending')}</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-x-auto no-scrollbar shadow-sm">
                            <table className="w-full text-left min-w-[700px]">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('client')}</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('dateAndTime')}</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('status')}</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">{t('action')}</th>
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
                                                            title={t('approve')}
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteAppointment(appointment.id)}
                                                        className="w-9 h-9 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                        title={t('delete')}
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
                            <p className="text-sm text-foreground/50">{t('qrSub')}</p>
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
                                        {["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4", "#84cc16", "#14b8a6", "#d946ef", "#dc2626", "#0ea5e9", "#fbbf24", "#8b5cf6", "#7c3aed", "#064e3b", "#9a3412", "#334155", "#92400e", "#3f6212", "#78350f", "#1e3a8a", "#475569", "#a78bfa", "#b45309"].map(color => (
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
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { id: "coffee", name: t('coffeeBtn') },
                                                { id: "consulting", name: t('consultingBtn') },
                                                { id: "support", name: t('supportBtn') },
                                                { id: "pay", name: t('payBtn') }
                                            ].map(type => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setProfileData({ ...profileData, paymentType: type.id })}
                                                    className={cn(
                                                        "px-4 py-3 rounded-xl border text-xs font-bold transition-all",
                                                        profileData.paymentType === type.id ? "bg-primary text-white border-primary shadow-lg" : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                                                    )}
                                                >
                                                    {type.name}
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
                                                        title={review.isActive ? t('hide') : t('publish')}
                                                    >
                                                        {review.isActive ? <EyeOff size={16} /> : <Check size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReview(review.id)}
                                                        className="w-9 h-9 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                        title={t('delete')}
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
                                                <p className="font-bold uppercase tracking-widest text-xs">{t('noReviewsYet')}</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : activeTab === "leads" ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{t('incomingLeads')}</h2>
                                <p className="text-sm text-slate-500">{t('incomingLeadsSub')}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-x-auto no-scrollbar shadow-sm">
                            <table className="w-full text-left min-w-[800px]">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('client')}</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('message')}</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('date')}</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">{t('action')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {leads.map((lead: any) => (
                                        <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{lead.name}</div>
                                                <div className="text-xs text-slate-500">{lead.phone}</div>
                                                <div className="text-[10px] text-slate-400">{lead.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600 font-medium">{lead.message}</p>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-400 font-bold uppercase">
                                                {new Date(lead.createdAt).toLocaleDateString("tr-TR")}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDeleteLead(lead.id)}
                                                        className="w-9 h-9 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                        title={t('delete')}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center text-slate-300">
                                                <Inbox className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                                <p className="font-black uppercase tracking-widest text-[10px]">{t('noLeadsYet')}</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null
                }

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
                                    <h2 className="text-xl font-bold text-gray-900">{editingProduct ? t('editProject') : t('addNewProject')}</h2>
                                    <p className="text-gray-400 text-sm mt-1">{editingProduct ? t('editProjectSub') : t('newProjectSub')}</p>
                                </div>

                                <form onSubmit={handleAddProduct} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t('projectImage')}</label>
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
                                                    <span className="text-sm font-medium">{t('projectImageSub')}</span>
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
                                        placeholder={t('projectTitle')}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder={t('liveLinkGithub')}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium"
                                        value={newProduct.link}
                                        onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })}
                                    />
                                    <textarea
                                        rows={2}
                                        placeholder={t('projectDescription')}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium resize-none"
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isProductSaving}
                                        className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isProductSaving ? t('savingProject') : t('saveProject')}
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
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingServiceIndex !== null ? t('editExpertise') : t('newExpertiseTitle')}</h2>
                                    <p className="text-sm text-slate-500 mt-2">{editingServiceIndex !== null ? t('editExpertiseSub') : t('newExpertiseSub')}</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('titleLabel')}</label>
                                        <input
                                            type="text"
                                            placeholder={t('titlePlaceholder')}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 font-medium transition-all placeholder:text-slate-300"
                                            value={newService.title}
                                            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('descriptionLabel')}</label>
                                        <textarea
                                            rows={3}
                                            placeholder={t('descriptionPlaceholder')}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 font-medium resize-none transition-all placeholder:text-slate-300"
                                            value={newService.description}
                                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddService}
                                        className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                                    >
                                        {editingServiceIndex !== null ? t('update') : t('addExpertise')}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main >
        </div >
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
