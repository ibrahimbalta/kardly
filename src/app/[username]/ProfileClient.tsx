"use client"

import { useState } from "react"
import {
    Layout,
    MessageCircle,
    Phone,
    Share2,
    UserPlus,
    QrCode,
    Calendar,
    CheckCircle2,
    ShoppingBag,
    Instagram,
    Twitter,
    Linkedin,
    ArrowRight,
    ExternalLink,
    Globe
} from "lucide-react"
import { AppointmentModal } from "@/components/AppointmentModal"
import { translations } from "@/lib/i18n"
import { motion, AnimatePresence } from "framer-motion"

export default function ProfileClient({ profile }: any) {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
    const [lang, setLang] = useState("tr")
    const t = translations[lang]

    const template = profile.templateId || "modern"
    const themeColor = profile.themeColor || "#6366f1"

    const logEvent = async (type: string, value?: string) => {
        try {
            await fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileId: profile.id, type, value })
            })
        } catch (e) {
            console.error("Event error:", e)
        }
    }

    // Template Configurations
    const getTemplateStyles = () => {
        switch (template) {
            case "luxury":
                return {
                    bg: "bg-[#050505]",
                    card: "bg-white/[0.03] border-white/10 backdrop-blur-xl",
                    accent: "text-[#D4AF37]",
                    button: "bg-gradient-to-r from-[#D4AF37] to-[#AA8418] text-black",
                    border: "border-[#D4AF37]/20",
                    font: "font-serif"
                }
            case "creative":
                return {
                    bg: "bg-[#0f172a]",
                    card: "bg-white/10 border-white/20 backdrop-blur-2xl skew-y-1 hover:skew-y-0 transition-transform",
                    accent: "text-rose-400",
                    button: "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-500/25",
                    border: "border-white/10",
                    font: "font-sans"
                }
            case "business":
                return {
                    bg: "bg-[#f8fafc]",
                    card: "bg-white border-slate-200 text-slate-900 shadow-sm",
                    accent: "text-blue-600",
                    button: "bg-blue-600 text-white shadow-blue-600/20",
                    border: "border-slate-100",
                    font: "font-sans"
                }
            default: // modern
                return {
                    bg: "bg-[#020617]",
                    card: "bg-white/[0.02] border-white/5 backdrop-blur-lg",
                    accent: "text-primary",
                    button: `bg-[${themeColor}] text-white shadow-xl shadow-primary/20`,
                    border: "border-white/5",
                    font: "font-sans"
                }
        }
    }

    const s = getTemplateStyles()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    return (
        <div className={`min-h-screen ${s.bg} ${s.font} ${template !== 'business' ? 'text-white' : 'text-slate-900'} selection:bg-primary/30 overflow-x-hidden relative`}>

            {/* Dynamic Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {template === 'creative' && (
                    <>
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-500/20 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
                    </>
                )}
                {template === 'luxury' && (
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #D4AF37 0%, transparent 1%)', backgroundSize: '40px 40px' }} />
                )}
                {template === 'modern' && (
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(at 0% 0%, ${themeColor} 0, transparent 50%), radial-gradient(at 100% 100%, #a855f7 0, transparent 50%)` }} />
                )}
            </div>

            {/* Language & Floating Actions */}
            <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
                <div className="flex gap-2 p-1 glass rounded-full border-white/10">
                    <button onClick={() => setLang("tr")} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${lang === "tr" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}>TR</button>
                    <button onClick={() => setLang("en")} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${lang === "en" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}>EN</button>
                </div>
            </div>

            <AppointmentModal
                profile={profile}
                isOpen={isAppointmentOpen}
                onClose={() => setIsAppointmentOpen(false)}
                t={t}
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-lg mx-auto px-6 pt-20 pb-24"
            >
                {/* Profile Header */}
                <motion.div variants={itemVariants} className="flex flex-col items-center text-center mb-12">
                    <div className="relative mb-8 group">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className={`w-36 h-36 rounded-[3rem] p-1.5 shadow-2xl transition-all duration-500 ${template === 'luxury' ? 'bg-gradient-to-tr from-[#D4AF37] to-[#AA8418]' : 'bg-gradient-to-tr from-primary to-purple-500'}`}
                            style={{ boxShadow: `0 25px 60px -12px ${template === 'luxury' ? '#D4AF37' : themeColor}44` }}
                        >
                            <div className={`w-full h-full rounded-[2.8rem] flex items-center justify-center overflow-hidden ${template === 'business' ? 'bg-slate-100' : 'bg-[#020617]'}`}>
                                {profile.user.image ? (
                                    <img src={profile.user.image} alt={profile.user.name || ""} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-black bg-gradient-to-tr from-white to-white/40 bg-clip-text text-transparent">
                                        {profile.user.name?.[0].toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                        <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transform rotate-12 transition-transform group-hover:rotate-0 ${template === 'business' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
                            <QrCode className="w-6 h-6" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black mb-2 tracking-tight">{profile.user.name}</h1>
                    <p className={`text-lg font-medium mb-6 ${template === 'business' ? 'text-slate-500' : 'text-white/40'}`}>{profile.occupation}</p>

                    <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${template === 'business' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white/5 border-white/10 text-white/40'}`}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {t.available}
                    </div>

                    {/* Quick Socials */}
                    {(profile.socialLinks as any[])?.length > 0 && (
                        <div className="flex justify-center gap-4 mt-8">
                            {(profile.socialLinks as any[]).filter(link => link.url).map((link: any) => (
                                <motion.a
                                    whileHover={{ y: -5 }}
                                    whileTap={{ scale: 0.9 }}
                                    key={link.platform}
                                    href={link.url}
                                    target="_blank"
                                    onClick={() => logEvent("click_social", link.platform)}
                                    className={`w-14 h-14 flex items-center justify-center rounded-[1.25rem] border transition-all ${template === 'business' ? 'bg-white border-slate-200 text-slate-400 hover:text-blue-600' : 'glass border-white/5 text-white/40 hover:text-white'}`}
                                >
                                    {link.platform === "instagram" && <Instagram className="w-6 h-6" />}
                                    {link.platform === "twitter" && <Twitter className="w-6 h-6" />}
                                    {link.platform === "linkedin" && <Linkedin className="w-6 h-6" />}
                                </motion.a>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Slogan & Bio */}
                <motion.div variants={itemVariants} className={`p-10 rounded-[2.5rem] mb-8 border relative overflow-hidden group ${s.card}`}>
                    {template === 'luxury' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />}
                    <p className={`text-2xl leading-tight font-black mb-6 italic ${template === 'luxury' ? 'text-[#D4AF37]' : 'text-white'}`}>
                        "{profile.slogan}"
                    </p>
                    <div className={`h-1 w-16 mb-6 rounded-full ${template === 'luxury' ? 'bg-[#D4AF37]' : `bg-[${themeColor}] opacity-50`}`} />
                    <p className={`text-base leading-relaxed ${template === 'business' ? 'text-slate-500' : 'text-white/50'}`}>
                        {profile.bio}
                    </p>
                </motion.div>

                {/* Major Actions */}
                <motion.div variants={itemVariants} className="space-y-4 mb-12">
                    <button
                        onClick={() => setIsAppointmentOpen(true)}
                        className={`w-full group flex items-center justify-between p-7 rounded-[2.25rem] font-black transition-all hover:scale-[1.02] active:scale-95 ${template === 'luxury' ? 'bg-gradient-to-br from-[#D4AF37] to-[#AA8418] text-black shadow-2xl shadow-[#D4AF37]/20' : `bg-[${themeColor}] text-white shadow-2xl shadow-[${themeColor}]/30`}`}
                        style={{ backgroundColor: template !== 'luxury' ? themeColor : undefined }}
                    >
                        <div className="flex items-center gap-4">
                            <Calendar className="w-7 h-7" />
                            <span className="text-lg">{t.bookAppointment}</span>
                        </div>
                        <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                        <motion.a
                            whileHover={{ y: -5 }}
                            onClick={() => logEvent("click_vcard")}
                            href={`/api/vcard?username=${profile.username}`}
                            className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[2.25rem] border transition-all ${s.card}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${template === 'business' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
                                <UserPlus className="w-7 h-7" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-wider">{t.addToContacts}</span>
                        </motion.a>
                        <motion.button
                            whileHover={{ y: -5 }}
                            onClick={() => logEvent("click_share")}
                            className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[2.25rem] border transition-all ${s.card}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${template === 'luxury' ? 'bg-[#D4AF37] text-black' : `bg-[${themeColor}]`}`} style={{ backgroundColor: template !== 'luxury' ? themeColor : undefined }}>
                                <Share2 className="w-7 h-7" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-wider">{t.share}</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Products Section */}
                {profile.products?.length > 0 && (
                    <motion.div variants={itemVariants} className="mb-16">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <h2 className="text-2xl font-black">{t.products}</h2>
                            <div className={`p-2 rounded-xl ${template === 'business' ? 'bg-blue-50 text-blue-600' : 'bg-white/5'}`}>
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar -mx-6 px-6">
                            {profile.products.map((product: any) => (
                                <motion.div
                                    key={product.id}
                                    whileHover={{ y: -10 }}
                                    className={`min-w-[320px] w-[320px] rounded-[3rem] border overflow-hidden flex flex-col group transition-all duration-500 ${s.card}`}
                                >
                                    <div className="aspect-[1/1] bg-white/5 relative overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-10">
                                                <ShoppingBag className="w-20 h-20" />
                                            </div>
                                        )}
                                        <div className={`absolute top-6 right-6 px-4 py-2 rounded-2xl text-sm font-black shadow-2xl ${template === 'luxury' ? 'bg-[#D4AF37] text-black' : 'bg-white text-black'}`}>
                                            ₺{product.price}
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-1">
                                        <h3 className="font-black text-xl mb-3">{product.name}</h3>
                                        <p className={`text-sm mb-8 line-clamp-2 flex-1 leading-relaxed ${template === 'business' ? 'text-slate-500' : 'text-white/40'}`}>{product.description}</p>
                                        <a
                                            onClick={() => logEvent("click_product", product.name)}
                                            href={product.link || `https://wa.me/${profile.phone}?text=${encodeURIComponent(`${product.name} ile ilgileniyorum.`)}`}
                                            target="_blank"
                                            className={`w-full py-5 rounded-[1.5rem] text-center text-sm font-black transform transition-all hover:scale-[1.05] active:scale-95 shadow-xl ${template === 'luxury' ? 'bg-[#D4AF37] text-black' : template === 'business' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}
                                        >
                                            {t.buyNow}
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Services Section */}
                {profile.services?.length > 0 && (
                    <motion.div variants={itemVariants} className="space-y-4 mb-16">
                        <h2 className="text-2xl font-black mb-8 px-2">{t.services}</h2>
                        {(profile.services as any[])?.map((service: any, i: number) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 10 }}
                                onClick={() => logEvent("click_service", service.title)}
                                className={`p-8 rounded-[2.25rem] border transition-all group cursor-pointer relative overflow-hidden ${s.card}`}
                            >
                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex-1 pr-6">
                                        <h3 className={`text-xl font-black mb-2 transition-colors ${template === 'luxury' ? 'group-hover:text-[#D4AF37]' : 'group-hover:text-primary'}`}>{service.title}</h3>
                                        <p className={`text-sm tracking-wide leading-relaxed ${template === 'business' ? 'text-slate-500' : 'text-white/40'}`}>{service.description}</p>
                                    </div>
                                    <div className={`p-3 rounded-2xl transition-all group-hover:rotate-12 ${template === 'business' ? 'bg-slate-100 text-slate-400' : 'bg-white/5 text-white/40'}`}>
                                        <Layout className="w-6 h-6" />
                                    </div>
                                </div>
                                {template === 'luxury' && <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full transform translate-x-12 -translate-y-12" />}
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Contact Section */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h2 className="text-2xl font-black mb-8 px-2">İletişim</h2>
                    <motion.a
                        whileHover={{ scale: 1.02 }}
                        onClick={() => logEvent("click_whatsapp")}
                        href={`https://wa.me/${profile.phone?.replace(/\s/g, "")}`}
                        target="_blank"
                        className={`flex items-center gap-5 p-6 rounded-[2.25rem] border transition-all ${s.card}`}
                    >
                        <div className="w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <MessageCircle className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] opacity-40 font-black uppercase tracking-[0.2em] mb-1">WhatsApp</p>
                            <p className="font-black text-lg">{t.whatsApp}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-20" />
                    </motion.a>

                    <motion.a
                        whileHover={{ scale: 1.02 }}
                        onClick={() => logEvent("click_phone")}
                        href={`tel:${profile.phone?.replace(/\s/g, "")}`}
                        className={`flex items-center gap-5 p-6 rounded-[2.25rem] border transition-all ${s.card}`}
                    >
                        <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${template === 'luxury' ? 'bg-[#D4AF37] text-black' : ''}`}
                            style={{
                                backgroundColor: template !== 'luxury' ? themeColor : undefined,
                                boxShadow: template !== 'luxury' ? `0 10px 20px -5px ${themeColor}44` : undefined
                            }}
                        >
                            <Phone className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] opacity-40 font-black uppercase tracking-[0.2em] mb-1">Telefon</p>
                            <p className="font-black text-lg">{profile.phone}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-20" />
                    </motion.a>
                </motion.div>

                {/* Footer Branding */}
                {profile.user.subscription?.plan === "free" && (
                    <motion.div variants={itemVariants} className="mt-20 text-center">
                        <a
                            href="https://kardly.com"
                            target="_blank"
                            className={`inline-flex items-center gap-3 px-8 py-4 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] transition-all ${template === 'business' ? 'bg-slate-100 border-slate-200 text-slate-400' : 'glass border-white/5 text-white/20 hover:text-white/60'}`}
                        >
                            <span>Powered by</span>
                            <span className={template === 'business' ? 'text-slate-900' : 'text-white'}>Kardly</span>
                        </a>
                    </motion.div>
                )}
            </motion.div>

            {/* Custom Scrollbar Styling */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes bounce-in {
                    0% { transform: translate(-50%, -100%); opacity: 0; }
                    70% { transform: translate(-50%, 10%); opacity: 1; }
                    100% { transform: translate(-50%, 0); opacity: 1; }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
                }
            `}</style>
        </div>
    )
}
