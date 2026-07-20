"use client"

import React, { useState } from "react"
import { Phone, Mail, UserCheck, Send, CheckCircle2, Building2, MapPin, Globe, ShieldCheck, Sparkles, MessageSquare, Download } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface EmployeeProfileClientProps {
    employee: {
        id: string
        name: string
        email?: string
        phone?: string
        role?: string
        department?: string
        nfcTag?: string
        photo?: string
        profile: {
            id: string
            displayName?: string
            slogan?: string
            bio?: string
            phone?: string
            user?: {
                name?: string
                email?: string
                image?: string
            }
        }
    }
}

export default function EmployeeProfileClient({ employee }: EmployeeProfileClientProps) {
    const companyName = employee.profile?.user?.name || "Kurumsal Şirket"
    const companyLogo = employee.profile?.user?.image
    const [showLeadModal, setShowLeadModal] = useState(false)
    const [leadSubmitted, setLeadSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [leadForm, setLeadForm] = useState({
        name: "",
        phone: "",
        email: "",
        message: ""
    })

    const handleDownloadVCard = () => {
        const vCardData = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${employee.name}`,
            `ORG:${companyName}`,
            `TITLE:${employee.role || 'Personel'} (${employee.department || 'Genel'})`,
            employee.phone ? `TEL;TYPE=CELL:${employee.phone}` : '',
            employee.email ? `EMAIL;TYPE=INTERNET:${employee.email}` : '',
            'END:VCARD'
        ].filter(Boolean).join('\n')

        const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${employee.name.replace(/\s+/g, '_')}.vcf`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleSubmitLead = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!leadForm.name) return

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/p/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    employeeId: employee.id,
                    name: leadForm.name,
                    phone: leadForm.phone,
                    email: leadForm.email,
                    message: leadForm.message
                })
            })

            if (res.ok) {
                setLeadSubmitted(true)
                setLeadForm({ name: "", phone: "", email: "", message: "" })
            }
        } catch (err) {
            console.error("Lead submission error:", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">

            {/* Background Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-violet-600/20 blur-[130px] rounded-full pointer-events-none" />

            {/* Main Container Card */}
            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative z-10 my-auto">
                
                {/* Header / Company Banner */}
                <div className="relative h-44 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-6 flex flex-col justify-between border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">{companyName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" />
                            Doğrulanmış Kart
                        </div>
                    </div>
                </div>

                {/* Profile Photo & Overlapping Badge */}
                <div className="px-6 relative -mt-20 flex flex-col items-center text-center">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-[2.2rem] overflow-hidden border-4 border-slate-900 shadow-2xl bg-slate-800 relative z-10 group">
                            <img
                                src={employee.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=6366f1&color=fff&size=256`}
                                alt={employee.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        {companyLogo && (
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-900 bg-white absolute -bottom-2 -right-2 z-20 shadow-lg">
                                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Name & Occupation */}
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-4">{employee.name}</h1>
                    <p className="text-xs font-bold text-indigo-400 tracking-wider uppercase mt-1">
                        {employee.role || 'Kurumsal Temsilci'} {employee.department && `• ${employee.department}`}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {companyName}
                    </p>

                    {/* Primary Call to Actions */}
                    <div className="w-full grid grid-cols-2 gap-3 mt-6">
                        <button
                            onClick={handleDownloadVCard}
                            className="flex items-center justify-center gap-2 h-12 bg-white text-slate-950 hover:bg-slate-100 font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg cursor-pointer hover:scale-[1.02]"
                        >
                            <Download className="w-4 h-4 text-indigo-600" />
                            Rehbere Kaydet
                        </button>
                        <button
                            onClick={() => { setShowLeadModal(true); setLeadSubmitted(false); }}
                            className="flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-indigo-500/25 cursor-pointer hover:scale-[1.02]"
                        >
                            <MessageSquare className="w-4 h-4 text-white" />
                            Mesaj / İletişim
                        </button>
                    </div>

                    {/* Contact Details List */}
                    <div className="w-full space-y-2.5 mt-6 mb-8 text-left">
                        {employee.phone && (
                            <a
                                href={`tel:${employee.phone}`}
                                className="flex items-center gap-3.5 p-3.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] rounded-2xl transition-all group cursor-pointer"
                            >
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">Telefon</span>
                                    <span className="block text-xs font-bold text-slate-200 truncate">{employee.phone}</span>
                                </div>
                            </a>
                        )}

                        {employee.email && (
                            <a
                                href={`mailto:${employee.email}`}
                                className="flex items-center gap-3.5 p-3.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] rounded-2xl transition-all group cursor-pointer"
                            >
                                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">E-Posta</span>
                                    <span className="block text-xs font-bold text-slate-200 truncate">{employee.email}</span>
                                </div>
                            </a>
                        )}

                        <div className="flex items-center gap-3.5 p-3.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
                            <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                                <Building2 className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">Şirket</span>
                                <span className="block text-xs font-bold text-slate-200 truncate">{companyName}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Branding */}
                    <div className="pb-6 opacity-30">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">KARDLY ENTERPRISE • DİJİTAL KARTVİZİT</p>
                    </div>

                </div>
            </div>

            {/* Lead Form Modal */}
            <AnimatePresence>
                {showLeadModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2rem] p-6 shadow-2xl relative text-left"
                        >
                            {leadSubmitted ? (
                                <div className="text-center py-8 space-y-4">
                                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight text-white">Talebiniz Alındı!</h3>
                                    <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xs mx-auto">
                                        İletişim bilgileriniz ve mesajınız <strong>{employee.name}</strong> ve <strong>{companyName}</strong> yetkililerine iletildi. En kısa sürede dönüş sağlanacaktır.
                                    </p>
                                    <button
                                        onClick={() => setShowLeadModal(false)}
                                        className="px-6 py-3 bg-white text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-slate-100 transition-colors mt-4"
                                    >
                                        Kapat
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                                        <div>
                                            <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-indigo-400" /> İletişim Bilgilerinizi Gönderin
                                            </h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                {employee.name} kişisine doğrudan ulaşın
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowLeadModal(false)}
                                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmitLead} className="space-y-3">
                                        <div>
                                            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Adınız / Unvanınız *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Örn: Ahmet Yılmaz - Mimarlık Ltd."
                                                value={leadForm.name}
                                                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                                                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Telefon Numaranız</label>
                                            <input
                                                type="tel"
                                                placeholder="0532 000 00 00"
                                                value={leadForm.phone}
                                                onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                                                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">E-Posta Adresiniz</label>
                                            <input
                                                type="email"
                                                placeholder="ahmet@sirket.com"
                                                value={leadForm.email}
                                                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                                                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Mesajınız / Notunuz</label>
                                            <textarea
                                                rows={3}
                                                placeholder="Kartvizitinizi aldım, teklif almak istiyorum..."
                                                value={leadForm.message}
                                                onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                                                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                                        >
                                            {isSubmitting ? "Gönderiliyor..." : "Bilgilerimi Gönder"}
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    )
}
