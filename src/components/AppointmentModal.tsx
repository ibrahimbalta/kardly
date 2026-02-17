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
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={cn(
                            "relative w-full max-w-md rounded-[2.5rem] border p-8 overflow-hidden backdrop-blur-2xl shadow-2xl",
                            modalTheme.card,
                            modalTheme.border,
                            toneStyle?.font
                        )}
                        style={{
                            boxShadow: `0 30px 60px -12px rgba(0,0,0,0.5), 0 0 30px ${modalTheme.accent}20`
                        }}
                    >
                        {/* Decorative background glow */}
                        <div
                            className="absolute -top-20 -right-20 w-40 h-40 blur-[80px] opacity-30 rounded-full"
                            style={{ backgroundColor: modalTheme.accent }}
                        />

                        <button onClick={onClose} className={cn("absolute top-6 right-6 transition-colors", modalTheme.text)} style={{ opacity: 0.4 }}>
                            <X className="hover:opacity-100" />
                        </button>

                        {step === 1 && (
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                                        style={{ backgroundColor: `${modalTheme.accent}20`, color: modalTheme.accent, border: `1px solid ${modalTheme.accent}40` }}
                                    >
                                        <Calendar />
                                    </div>
                                    <div>
                                        <h2 className={cn("text-xl font-black tracking-tight", modalTheme.text)}>{labels.bookAppointment}</h2>
                                        <p className={cn("text-sm opacity-50 font-medium", modalTheme.text)}>{labels.selectDateTime}</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className={cn("block text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-40", modalTheme.text)}>Tarih</label>
                                        <input
                                            type="date"
                                            className={cn(
                                                "w-full bg-white/5 border rounded-2xl px-5 py-4 focus:outline-none transition-all font-bold text-sm",
                                                modalTheme.border,
                                                modalTheme.text
                                            )}
                                            style={{
                                                backgroundColor: `${modalTheme.accent}05`,
                                                borderColor: `${modalTheme.accent}20`
                                            }}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className={cn("block text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-40", modalTheme.text)}>Saat</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(profile.workingHours && (profile.workingHours as string[]).length > 0
                                                ? (profile.workingHours as string[]).sort()
                                                : ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
                                            ).map(t_val => (
                                                <button
                                                    key={t_val}
                                                    onClick={() => setFormData({ ...formData, time: t_val })}
                                                    className={cn(
                                                        "py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all",
                                                        formData.time === t_val
                                                            ? "shadow-lg scale-105"
                                                            : "bg-white/5 opacity-60 hover:opacity-100"
                                                    )}
                                                    style={formData.time === t_val ? {
                                                        backgroundColor: modalTheme.accent,
                                                        borderColor: modalTheme.accent,
                                                        color: '#000',
                                                        boxShadow: `0 10px 20px -5px ${modalTheme.accent}40`
                                                    } : {
                                                        borderColor: `${modalTheme.accent}20`,
                                                        color: modalTheme.accent
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
                                    className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all disabled:opacity-30 disabled:scale-100 hover:scale-[1.02] active:scale-95"
                                    style={{
                                        backgroundColor: modalTheme.accent,
                                        color: '#000',
                                        boxShadow: `0 20px 30px -10px ${modalTheme.accent}50`
                                    }}
                                >
                                    {labels.back === "Geri" ? "Devam Et" : "Next"}
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 font-sans">
                                <div className="flex items-center gap-3 mb-2">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                                        style={{ backgroundColor: `${modalTheme.accent}20`, color: modalTheme.accent, border: `1px solid ${modalTheme.accent}40` }}
                                    >
                                        <User />
                                    </div>
                                    <div>
                                        <h2 className={cn("text-xl font-black tracking-tight", modalTheme.text)}>{labels.contactInfo}</h2>
                                        <p className={cn("text-sm opacity-50 font-medium", modalTheme.text)}>Son adım: Bilgilerinizi girin.</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder={labels.name}
                                        required
                                        className={cn(
                                            "w-full bg-white/5 border rounded-2xl px-5 py-4 focus:outline-none transition-all font-bold text-sm",
                                            modalTheme.border,
                                            modalTheme.text
                                        )}
                                        style={{
                                            backgroundColor: `${modalTheme.accent}05`,
                                            borderColor: `${modalTheme.accent}20`
                                        }}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder={labels.email}
                                        required
                                        className={cn(
                                            "w-full bg-white/5 border rounded-2xl px-5 py-4 focus:outline-none transition-all font-bold text-sm",
                                            modalTheme.border,
                                            modalTheme.text
                                        )}
                                        style={{
                                            backgroundColor: `${modalTheme.accent}05`,
                                            borderColor: `${modalTheme.accent}20`
                                        }}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <input
                                        type="tel"
                                        placeholder={labels.phone}
                                        required
                                        className={cn(
                                            "w-full bg-white/5 border rounded-2xl px-5 py-4 focus:outline-none transition-all font-bold text-sm",
                                            modalTheme.border,
                                            modalTheme.text
                                        )}
                                        style={{
                                            backgroundColor: `${modalTheme.accent}05`,
                                            borderColor: `${modalTheme.accent}20`
                                        }}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className={cn("flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border transition-all hover:bg-white/5 opacity-50 hover:opacity-100", modalTheme.border, modalTheme.text)}
                                    >
                                        {labels.back}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all disabled:opacity-30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                        style={{
                                            backgroundColor: modalTheme.accent,
                                            color: '#000',
                                            boxShadow: `0 20px 30px -10px ${modalTheme.accent}50`
                                        }}
                                    >
                                        {isSubmitting ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : labels.confirmBooking}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="py-12 text-center space-y-8 relative z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl relative"
                                    style={{ backgroundColor: `${modalTheme.accent}20`, color: modalTheme.accent }}
                                >
                                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: modalTheme.accent }} />
                                    <CheckCircle2 className="w-14 h-14 relative z-10" />
                                </motion.div>
                                <div>
                                    <h2 className={cn("text-3xl font-black tracking-tight mb-2", modalTheme.text)}>{labels.successBooking}</h2>
                                    <p className={cn("text-sm opacity-50 font-medium px-4", modalTheme.text)}>
                                        Randevu talebiniz başarıyla iletildi. Sizinle en kısa sürede iletişime geçeceğiz.
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-95 shadow-xl"
                                    style={{
                                        backgroundColor: modalTheme.accent,
                                        color: '#000',
                                        boxShadow: `0 20px 30px -10px ${modalTheme.accent}50`
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

