"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, X, Clock, User, Mail, Phone, CheckCircle2 } from "lucide-react"

export function AppointmentModal({ profile, isOpen, onClose, t, theme, toneStyle }: any) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        note: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fallback if theme is not provided
    const modalTheme = theme || {
        bg: "bg-[#030712]",
        card: "bg-black/40",
        text: "text-white",
        subtext: "text-white/60",
        border: "border-white/10",
        accent: profile.themeColor || "#0ea5e9",
        btn: "bg-black/60 border-white/20",
        btnText: "text-white"
    }

    // Fallback if t is not provided (defensive)
    const labels = t || {
        bookAppointment: "Randevu Al",
        selectDateTime: "Size en uygun tarihi seçin.",
        contactInfo: "İletişim Bilgileri",
        name: "Adınız Soyadınız",
        email: "E-posta Adresiniz",
        phone: "Telefon Numaranız",
        back: "Geri",
        confirmBooking: "Randevuyu Onayla",
        successBooking: "Talep Alındı!",
        close: "Kapat"
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profileId: profile.id,
                    ...formData,
                    scheduledAt: `${formData.date}T${formData.time}:00`
                })
            })

            if (res.ok) {
                setStep(3)
            } else {
                alert("Bir hata oluştu, lütfen tekrar deneyin.")
            }
        } catch (err) {
            alert("Bağlantı hatası.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className={cn(
                            "relative w-full max-w-[340px] rounded-[2rem] border p-6 overflow-hidden backdrop-blur-3xl shadow-2xl transition-all",
                            modalTheme.card,
                            modalTheme.border,
                            toneStyle?.font
                        )}
                        style={{
                            boxShadow: `0 20px 50px -12px rgba(0,0,0,0.5), 0 0 30px ${modalTheme.accent}15`
                        }}
                    >
                        {/* Micro Glow */}
                        <div
                            className="absolute -top-16 -right-16 w-32 h-32 blur-[60px] opacity-20 rounded-full"
                            style={{ backgroundColor: modalTheme.accent }}
                        />

                        <button onClick={onClose} className={cn("absolute top-5 right-5 transition-colors z-20 opacity-30 hover:opacity-100", modalTheme.text)}>
                            <X size={18} />
                        </button>

                        {step === 1 && (
                            <div className="space-y-5 relative z-10">
                                <div className="flex flex-col items-center text-center gap-2 mb-1">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border"
                                        style={{ backgroundColor: `${modalTheme.accent}15`, color: modalTheme.accent, borderColor: `${modalTheme.accent}20` }}
                                    >
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <h2 className={cn("text-lg font-black tracking-tight uppercase", modalTheme.text)}>{labels.bookAppointment}</h2>
                                        <p className={cn("text-[8px] font-bold opacity-40 uppercase tracking-[0.2em]", modalTheme.text)}>{labels.selectDateTime}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className={cn("block text-[8px] font-black uppercase tracking-[0.3em] mb-1.5 ml-1 opacity-40", modalTheme.text)}>Tarih</label>
                                        <input
                                            type="date"
                                            className={cn(
                                                "w-full border rounded-xl px-4 py-3.5 focus:outline-none transition-all font-bold text-xs",
                                                modalTheme.border,
                                                modalTheme.text
                                            )}
                                            style={{
                                                backgroundColor: `${modalTheme.accent}05`,
                                                borderColor: `${modalTheme.accent}15`
                                            }}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className={cn("block text-[8px] font-black uppercase tracking-[0.3em] mb-1.5 ml-1 opacity-40", modalTheme.text)}>Saat</label>
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {(profile.workingHours && (profile.workingHours as string[]).length > 0
                                                ? (profile.workingHours as string[]).sort()
                                                : ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
                                            ).map(t_val => (
                                                <button
                                                    key={t_val}
                                                    onClick={() => setFormData({ ...formData, time: t_val })}
                                                    className={cn(
                                                        "py-2 rounded-lg text-[9px] font-black tracking-tighter border transition-all",
                                                        formData.time === t_val
                                                            ? "shadow-md"
                                                            : "bg-white/5 opacity-50 hover:opacity-100"
                                                    )}
                                                    style={formData.time === t_val ? {
                                                        backgroundColor: modalTheme.accent,
                                                        borderColor: modalTheme.accent,
                                                        color: '#000'
                                                    } : {
                                                        borderColor: `${modalTheme.accent}15`,
                                                        color: modalTheme.text.includes('white') ? 'rgba(255,255,255,0.8)' : modalTheme.accent
                                                    }}
                                                >
                                                    {t_val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    disabled={!formData.date || !formData.time}
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-lg transition-all disabled:opacity-30 hover:scale-[1.02] active:scale-95"
                                    style={{
                                        backgroundColor: modalTheme.accent,
                                        color: '#000',
                                        boxShadow: `0 10px 25px -5px ${modalTheme.accent}40`
                                    }}
                                >
                                    {labels.back === "Geri" ? "DEVAM ET" : "NEXT"}
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                <div className="flex flex-col items-center text-center gap-2 mb-1">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border"
                                        style={{ backgroundColor: `${modalTheme.accent}15`, color: modalTheme.accent, borderColor: `${modalTheme.accent}20` }}
                                    >
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <h2 className={cn("text-lg font-black tracking-tight uppercase", modalTheme.text)}>{labels.contactInfo}</h2>
                                        <p className={cn("text-[8px] font-bold opacity-40 uppercase tracking-[0.2em]", modalTheme.text)}>Bilgilerinizi doğrulayın.</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { placeholder: labels.name, type: "text", key: "name", icon: <User size={14} /> },
                                        { placeholder: labels.email, type: "email", key: "email", icon: <Mail size={14} /> },
                                        { placeholder: labels.phone, type: "tel", key: "phone", icon: <Phone size={14} /> }
                                    ].map((field) => (
                                        <div key={field.key} className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" style={{ color: modalTheme.accent }}>
                                                {field.icon}
                                            </div>
                                            <input
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                required
                                                className={cn(
                                                    "w-full border rounded-xl pl-11 pr-4 py-3.5 focus:outline-none transition-all font-bold text-xs placeholder:opacity-30",
                                                    modalTheme.border,
                                                    modalTheme.text
                                                )}
                                                style={{
                                                    backgroundColor: `${modalTheme.accent}05`,
                                                    borderColor: `${modalTheme.accent}15`
                                                }}
                                                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className={cn("flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all hover:bg-white/5 opacity-40 hover:opacity-80", modalTheme.border, modalTheme.text)}
                                    >
                                        {labels.back}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[1.5] py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all disabled:opacity-30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                        style={{
                                            backgroundColor: modalTheme.accent,
                                            color: '#000',
                                            boxShadow: `0 10px 25px -5px ${modalTheme.accent}40`
                                        }}
                                    >
                                        {isSubmitting ? <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : labels.confirmBooking}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="py-8 text-center space-y-6 relative z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-xl relative"
                                    style={{ backgroundColor: `${modalTheme.accent}15`, color: modalTheme.accent }}
                                >
                                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: modalTheme.accent }} />
                                    <CheckCircle2 size={32} className="relative z-10" />
                                </motion.div>
                                <div className="space-y-2">
                                    <h2 className={cn("text-xl font-black tracking-tighter uppercase", modalTheme.text)}>{labels.successBooking}</h2>
                                    <p className={cn("text-[9px] font-medium opacity-50 px-4 leading-relaxed", modalTheme.text)}>
                                        Randevu talebiniz başarıyla iletildi.<br />Sizinle en kısa sürede iletişime geçeceğiz.
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 shadow-lg"
                                    style={{
                                        backgroundColor: modalTheme.accent,
                                        color: '#000',
                                        boxShadow: `0 10px 25px -5px ${modalTheme.accent}40`
                                    }}
                                >
                                    {labels.close}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}

