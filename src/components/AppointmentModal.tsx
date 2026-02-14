"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, X, Clock, User, Mail, Phone, CheckCircle2 } from "lucide-react"

export function AppointmentModal({ profile, isOpen, onClose, t }: any) {
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
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative glass w-full max-w-md rounded-[2.5rem] border-white/10 p-8 overflow-hidden"
                    >
                        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                            <X />
                        </button>

                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                        style={{ backgroundColor: `${profile.themeColor || '#6366f1'}20`, color: profile.themeColor || '#6366f1' }}
                                    >
                                        <Calendar />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{labels.bookAppointment}</h2>
                                        <p className="text-white/40 text-sm">{labels.selectDateTime}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Tarih</label>
                                        <input
                                            type="date"
                                            className="w-full glass bg-white/5 border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Saat</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(profile.workingHours && (profile.workingHours as string[]).length > 0
                                                ? (profile.workingHours as string[]).sort()
                                                : ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
                                            ).map(t_val => (
                                                <button
                                                    key={t_val}
                                                    onClick={() => setFormData({ ...formData, time: t_val })}
                                                    className={`py-2 rounded-lg text-sm font-bold border transition-all ${formData.time === t_val
                                                        ? "text-white"
                                                        : "bg-white/5 border-white/5 hover:border-white/20"
                                                        }`}
                                                    style={formData.time === t_val ? {
                                                        backgroundColor: profile.themeColor || '#6366f1',
                                                        borderColor: profile.themeColor || '#6366f1'
                                                    } : {}}
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
                                    className="w-full text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                    style={{
                                        backgroundColor: profile.themeColor || '#6366f1',
                                        boxShadow: `0 20px 25px -5px ${profile.themeColor || '#6366f1'}33`
                                    }}
                                >
                                    {labels.back === "Geri" ? "Devam Et" : "Next"}
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                        style={{ backgroundColor: `${profile.themeColor || '#6366f1'}20`, color: profile.themeColor || '#6366f1' }}
                                    >
                                        <User />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{labels.contactInfo}</h2>
                                        <p className="text-white/40 text-sm">{labels.contactInfo}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder={labels.name}
                                        required
                                        className="w-full glass bg-white/5 border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder={labels.email}
                                        required
                                        className="w-full glass bg-white/5 border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <input
                                        type="tel"
                                        placeholder={labels.phone}
                                        required
                                        className="w-full glass bg-white/5 border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="px-6 py-4 glass rounded-2xl font-bold border-white/5"
                                    >
                                        {labels.back}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                                        style={{
                                            backgroundColor: profile.themeColor || '#6366f1',
                                            boxShadow: `0 20px 25px -5px ${profile.themeColor || '#6366f1'}33`
                                        }}
                                    >
                                        {isSubmitting ? "..." : labels.confirmBooking}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="py-8 text-center space-y-6">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{labels.successBooking}</h2>
                                    <p className="text-white/50 mt-2">
                                        {labels.successBooking}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-full glass py-4 rounded-2xl font-bold border-white/5"
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
