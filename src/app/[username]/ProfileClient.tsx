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
    Linkedin
} from "lucide-react"
import { AppointmentModal } from "@/components/AppointmentModal"
import { translations } from "@/lib/i18n"

export default function ProfileClient({ profile }: any) {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
    const [lang, setLang] = useState("tr")
    const t = translations[lang]

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

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30">
            {/* Language Switcher */}
            <div className="absolute top-6 right-6 z-50 flex gap-2">
                <button
                    onClick={() => setLang("tr")}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${lang === "tr" ? "bg-white text-black border-white" : "bg-white/5 text-white border-white/10"
                        }`}
                >
                    TR
                </button>
                <button
                    onClick={() => setLang("en")}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${lang === "en" ? "bg-white text-black border-white" : "bg-white/5 text-white border-white/10"
                        }`}
                >
                    EN
                </button>
            </div>

            {/* Appointment Modal */}
            <AppointmentModal
                profile={profile}
                isOpen={isAppointmentOpen}
                onClose={() => setIsAppointmentOpen(false)}
                t={t}
            />

            {/* Dynamic Background */}
            <div
                className="fixed inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(at 0% 0%, ${profile.themeColor || '#6366f1'} 0, transparent 50%), radial-gradient(at 100% 100%, #a855f7 0, transparent 50%)`
                }}
            />

            <div className="relative z-10 max-w-lg mx-auto px-6 pt-20 pb-24">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="relative mb-6">
                        <div
                            className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-2xl"
                            style={{ boxShadow: `0 25px 50px -12px ${profile.themeColor}33` }}
                        >
                            <div className="w-full h-full rounded-[2.3rem] bg-[#020617] flex items-center justify-center overflow-hidden">
                                {profile.user.image ? (
                                    <img src={profile.user.image} alt={profile.user.name || ""} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold bg-gradient-to-tr from-white to-white/40 bg-clip-text text-transparent">
                                        {profile.user.name?.[0].toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg transform rotate-12">
                            <QrCode className="text-black w-6 h-6" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-extrabold mb-2 tracking-tight">{profile.user.name}</h1>
                    <p className="text-white/60 font-medium mb-4">{profile.occupation}</p>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-white/40">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {t.available}
                    </div>

                    {/* Social Links */}
                    {(profile.socialLinks as any[])?.length > 0 && (
                        <div className="flex justify-center gap-3 mt-6">
                            {(profile.socialLinks as any[]).filter(link => link.url).map((link: any) => (
                                <a
                                    key={link.platform}
                                    href={link.url}
                                    target="_blank"
                                    onClick={() => logEvent("click_social", link.platform)}
                                    className="w-12 h-12 glass rounded-2xl border-white/5 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white/60 hover:text-white"
                                >
                                    {link.platform === "instagram" && <Instagram className="w-6 h-6" />}
                                    {link.platform === "twitter" && <Twitter className="w-6 h-6" />}
                                    {link.platform === "linkedin" && <Linkedin className="w-6 h-6" />}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bio Section */}
                <div className="glass rounded-[2rem] p-8 mb-8 border-white/5 bg-white/[0.02]">
                    <p className="text-lg leading-relaxed text-white/80 font-medium italic">
                        "{profile.slogan}"
                    </p>
                    <div
                        className="h-px w-12 my-6"
                        style={{ backgroundColor: profile.themeColor || '#6366f1' }}
                    />
                    <p className="text-sm leading-relaxed text-white/50">
                        {profile.bio}
                    </p>
                </div>

                {/* Primary Action: Appoinment */}
                <button
                    onClick={() => setIsAppointmentOpen(true)}
                    className="w-full mb-8 flex items-center justify-center gap-3 p-6 text-white rounded-[2rem] font-bold shadow-2xl hover:scale-[1.02] active:scale-95 transition-all group"
                    style={{
                        backgroundColor: profile.themeColor || '#6366f1',
                        boxShadow: `0 25px 50px -12px ${profile.themeColor || '#6366f1'}66`
                    }}
                >
                    <Calendar className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>{t.bookAppointment}</span>
                </button>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <a
                        onClick={() => logEvent("click_vcard")}
                        href={`/api/vcard?username=${profile.username}`}
                        className="flex flex-col items-center justify-center gap-3 p-6 glass rounded-[2rem] border-white/5 hover:bg-white/10 transition-all group"
                    >
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-xl group-hover:scale-110 transition-transform">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold">{t.addToContacts}</span>
                    </a>
                    <button
                        onClick={() => logEvent("click_share")}
                        className="flex flex-col items-center justify-center gap-3 p-6 glass rounded-[2rem] border-white/5 hover:bg-white/10 transition-all group"
                    >
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform"
                            style={{
                                backgroundColor: profile.themeColor || '#6366f1',
                                boxShadow: `0 10px 15px -3px ${profile.themeColor || '#6366f1'}33`
                            }}
                        >
                            <Share2 className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold">{t.share}</span>
                    </button>
                </div>

                {/* Products / Shop Section */}
                {profile.products?.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-bold px-2 mb-6 flex items-center justify-between">
                            {t.products}
                            <ShoppingBag className="w-5 h-5 text-indigo-500" />
                        </h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-6 px-6">
                            {profile.products.map((product: any) => (
                                <div key={product.id} className="min-w-[280px] w-[280px] glass rounded-[2.5rem] border-white/5 overflow-hidden flex flex-col group">
                                    <div className="aspect-[4/3] bg-white/5 relative overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/10">
                                                <ShoppingBag className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div
                                            className="absolute top-4 right-4 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg"
                                            style={{ backgroundColor: profile.themeColor || '#6366f1' }}
                                        >
                                            ₺{product.price}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                                        <p className="text-xs text-white/50 mb-6 line-clamp-2 flex-1">{product.description}</p>
                                        <a
                                            onClick={() => logEvent("click_product", product.name)}
                                            href={product.link || `https://wa.me/${profile.phone}?text=${encodeURIComponent(`${product.name} ile ilgileniyorum.`)}`}
                                            target="_blank"
                                            className="w-full py-4 bg-white text-black rounded-2xl text-center text-sm font-black hover:scale-105 transition-all shadow-xl"
                                        >
                                            {t.buyNow}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Services / Links */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold px-2 mb-4">{t.services}</h2>
                    {(profile.services as any[])?.map((service: any, i: number) => (
                        <div
                            key={i}
                            onClick={() => logEvent("click_service", service.title)}
                            className="glass p-6 rounded-3xl border-white/5 hover:border-white/20 transition-all group cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <h3 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">{service.title}</h3>
                                    <p className="text-sm text-white/40 mt-1">{service.description}</p>
                                </div>
                                <div className="bg-white/10 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                                    <Layout className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Links */}
                <div className="mt-12 space-y-3">
                    <a
                        onClick={() => logEvent("click_whatsapp")}
                        href={`https://wa.me/${profile.phone?.replace(/\s/g, "")}`}
                        target="_blank"
                        className="flex items-center gap-4 p-5 glass rounded-2xl border-white/5 hover:bg-white/5 transition-all"
                    >
                        <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-white/40 font-bold uppercase tracking-widest">WhatsApp</p>
                            <p className="font-bold">{t.whatsApp}</p>
                        </div>
                    </a>
                    <a
                        onClick={() => logEvent("click_phone")}
                        href={`tel:${profile.phone?.replace(/\s/g, "")}`}
                        className="flex items-center gap-4 p-5 glass rounded-2xl border-white/5 hover:bg-white/5 transition-all"
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                            style={{
                                backgroundColor: profile.themeColor || '#6366f1',
                                boxShadow: `0 10px 15px -3px ${profile.themeColor || '#6366f1'}33`
                            }}
                        >
                            <Phone className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-white/40 font-bold uppercase tracking-widest">{t.phone}</p>
                            <p className="font-bold">{t.phone}</p>
                        </div>
                    </a>
                </div>

                {/* Branding Footer (White Label Logic) */}
                {profile.user.subscription?.plan === "free" && (
                    <div className="mt-16 text-center">
                        <a
                            href="https://kardly.com"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-all"
                        >
                            <span>Created with</span>
                            <span className="text-white font-black">Kardly.</span>
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
