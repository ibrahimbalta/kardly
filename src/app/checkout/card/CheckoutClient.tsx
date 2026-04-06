"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
    CheckCircle2, 
    ArrowLeft, 
    Truck, 
    ShieldCheck, 
    CreditCard, 
    MessageSquare, 
    Mail, 
    Phone, 
    User, 
    MapPin, 
    ChevronRight,
    Send,
    Loader2,
    Info
} from "lucide-react"
import BusinessCardGenerator from "@/components/BusinessCardGenerator"
import { cn } from "@/lib/utils"

interface CheckoutClientProps {
    user: {
        name: string
        email: string
        image?: string
        id: string
    }
    profileData: any
}

export default function CheckoutClient({ user, profileData }: CheckoutClientProps) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        shippingName: user.name || "",
        shippingEmail: user.email || "",
        shippingPhone: profileData.phone || "",
        shippingAddress: "",
        shippingCity: "",
        shippingDistrict: "",
        message: ""
    })

    // Design State from URL
    const tpl = searchParams.get("tpl") || "minimal_white"
    const orient = (searchParams.get("orient") as any) || "portrait"
    const bg = searchParams.get("bg")
    const acc = searchParams.get("acc")
    const txt = searchParams.get("txt")
    const font = (searchParams.get("font") as any) || "sans"
    const patt = searchParams.get("patt")
    const qrs = parseInt(searchParams.get("qrs") || "100")
    const qrx = parseInt(searchParams.get("qrx") || "0")
    const qry = parseInt(searchParams.get("qry") || "0")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch("/api/orders/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    design: { tpl, orient, bg, acc, txt, font, patt, qrs, qrx, qry }
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Bir hata oluştu")
            }

            setSuccess(true)
            // Scroll to top to see success message
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-12">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100"
                >
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={48} className="text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">TEKLİF TALEBİNİZ ALINDI!</h1>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
                        Tasarımınız ve iletişim bilgileriniz ekibimize iletildi. En kısa sürede sizinle iletişime geçip fiyat teklifimizi sunacağız.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => router.push("/dashboard")}
                            className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl"
                        >
                            Paneline Dön
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <button 
                onClick={() => router.back()}
                className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
            >
                <div className="p-2 rounded-full group-hover:bg-white transition-all">
                    <ArrowLeft size={18} />
                </div>
                <span className="font-bold text-sm tracking-tight">Tasarıma Dön</span>
            </button>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Left Side: Form */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight sm:leading-none break-words">NFC Kart Teklif Formu</h1>
                        <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">Lütfen iletişim ve kargo bilgilerinizi girin, size en uygun teklifi hazırlayalım.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-xl border border-slate-100 space-y-5 sm:space-y-6">
                            <div className="flex items-center gap-3 text-slate-900 mb-2">
                                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                    <User size={20} />
                                </div>
                                <h2 className="text-lg font-black tracking-tight uppercase">İletişim Bilgileri</h2>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Ad Soyad</label>
                                    <input 
                                        required
                                        name="shippingName"
                                        value={formData.shippingName}
                                        onChange={handleInputChange}
                                        placeholder="Adınız ve Soyadınız"
                                        className="w-full h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl px-5 sm:px-6 font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner text-sm sm:text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">E-posta Adresi</label>
                                    <input 
                                        required
                                        type="email"
                                        name="shippingEmail"
                                        value={formData.shippingEmail}
                                        onChange={handleInputChange}
                                        placeholder="eposta@adresiniz.com"
                                        className="w-full h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl px-5 sm:px-6 font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Telefon Numarası</label>
                                <input 
                                    required
                                    name="shippingPhone"
                                    value={formData.shippingPhone}
                                    onChange={handleInputChange}
                                    placeholder="05XX XXX XX XX"
                                    className="w-full h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl px-5 sm:px-6 font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-xl border border-slate-100 space-y-5 sm:space-y-6">
                            <div className="flex items-center gap-3 text-slate-900 mb-2">
                                <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                                    <MapPin size={20} />
                                </div>
                                <h2 className="text-lg font-black tracking-tight uppercase">Kargo Adresi (Opsiyonel)</h2>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Tam Adres</label>
                                <textarea 
                                    name="shippingAddress"
                                    value={formData.shippingAddress}
                                    onChange={handleInputChange}
                                    placeholder="Mahalle, sokak, no, daire..."
                                    rows={3}
                                    className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl px-5 sm:px-6 py-4 font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner resize-none text-sm sm:text-base"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Şehir</label>
                                    <input 
                                        name="shippingCity"
                                        value={formData.shippingCity}
                                        onChange={handleInputChange}
                                        placeholder="İstanbul"
                                        className="w-full h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl px-5 sm:px-6 font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner text-sm sm:text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">İlçe</label>
                                    <input 
                                        name="shippingDistrict"
                                        value={formData.shippingDistrict}
                                        onChange={handleInputChange}
                                        placeholder="Beşiktaş"
                                        className="w-full h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl px-5 sm:px-6 font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner text-sm sm:text-base"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-xl border border-slate-100 space-y-4">
                            <div className="flex items-center gap-3 text-slate-900">
                                <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                                    <MessageSquare size={20} />
                                </div>
                                <h2 className="text-lg font-black tracking-tight uppercase">Özel Notunuz</h2>
                            </div>
                            <textarea 
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Örn: 50 adet sipariş etmek istiyorum, kurumsal logo eklenmesini talep ediyorum..."
                                rows={4}
                                className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl px-5 sm:px-6 py-4 font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner resize-none text-sm sm:text-base"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl font-bold text-sm flex items-center gap-2">
                                <Info size={18} />
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "w-full h-16 sm:h-20 rounded-2xl sm:rounded-[2rem] flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-2xl active:scale-95",
                                isSubmitting ? "bg-slate-100 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-900"
                            )}
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin text-slate-400" size={24} />
                            ) : (
                                <>
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                    <Send size={18} className="text-white group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform sm:size-5" />
                                    <span className="text-white font-black text-lg sm:text-xl uppercase tracking-tighter">Teklif Talebini Gönder</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right Side: Preview */}
                <div className="lg:col-span-5 relative mt-8 lg:mt-0">
                    <div className="lg:sticky lg:top-24 space-y-6">
                        <div className="bg-white rounded-[1.5rem] sm:rounded-[3rem] p-5 sm:p-8 pb-8 sm:pb-12 shadow-2xl border border-slate-100/50">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Tasarım Özeti</h2>
                                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase">
                                    Özel Tasarım
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <BusinessCardGenerator 
                                    user={user as any}
                                    profileData={profileData}
                                    mode="preview"
                                    selectedTemplateId={tpl}
                                    orientation={orient}
                                    initialCustomBg={bg}
                                    initialCustomAccent={acc}
                                    initialCustomTextColor={txt}
                                    initialCustomFont={font}
                                    initialCustomPattern={patt}
                                    initialQrSize={qrs}
                                    initialQrX={qrx}
                                    initialQrY={qry}
                                />
                            </div>

                            <div className="mt-8 space-y-4 pt-8 border-t border-slate-50">
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ŞABLON</span>
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{tpl.replace('studio_', '').replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YÖNELİM</span>
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{orient === 'portrait' ? 'DİKEY' : 'YATAY'}</span>
                                </div>
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MATERYAL</span>
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">PVC MATTE / NFC</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof / Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-indigo-50/50 rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border border-indigo-100/50">
                                <Truck className="text-indigo-600 mb-3" size={20} />
                                <h3 className="text-xs font-black text-indigo-900 uppercase tracking-tight mb-1">Hızlı Teslimat</h3>
                                <p className="text-[10px] text-indigo-700/60 font-medium">Baskı sonrası 2-4 iş günü içinde kapınızda.</p>
                            </div>
                            <div className="bg-emerald-50/50 rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border border-emerald-100/50">
                                <ShieldCheck className="text-emerald-600 mb-3" size={20} />
                                <h3 className="text-xs font-black text-emerald-900 uppercase tracking-tight mb-1">Güvenli Baskı</h3>
                                <p className="text-[10px] text-emerald-700/60 font-medium">En son teknoloji UV baskı kalitesi.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
