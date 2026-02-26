"use client"

import { Layout, Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { useTranslation } from "@/context/LanguageContext"

export default function ForgotPasswordPage() {
    const { t } = useTranslation()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Bir hata oluştu.")
            } else {
                setIsSent(true)
            }
        } catch (err) {
            setError("Bağlantı hatası oluştu.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-white">
            {/* Animated Background Blobs */}
            <div className="blob w-[600px] h-[600px] bg-rose-100 top-[-200px] right-[-200px] opacity-60" />
            <div className="blob w-[500px] h-[500px] bg-orange-50 bottom-[-150px] left-[-150px] opacity-70" />

            <div className="w-full max-w-md mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-10 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-rose-100/20"
                >
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
                            <Layout className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900">KARDLY<span className="text-rose-500">.</span></span>
                    </div>

                    {isSent ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={32} className="text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-3">E-posta Gönderildi</h2>
                            <p className="text-slate-500 text-sm mb-10 leading-relaxed">
                                Şifre sıfırlama talimatlarını içeren bir e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.
                            </p>
                            <Link href="/login" className="inline-flex items-center gap-2 text-rose-500 font-black uppercase text-xs tracking-widest hover:gap-3 transition-all">
                                <ArrowLeft size={14} /> Giriş Sayfasına Dön
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-10">
                                <h1 className="text-3xl font-black mb-3 tracking-tight text-slate-900">
                                    Şifremi Unuttum<span className="text-rose-500">.</span>
                                </h1>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Hesabınıza bağlı e-posta adresinizi girin, size şifrenizi sıfırlamanız için bir bağlantı gönderelim.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Email Adresiniz</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-rose-500 transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="Örn: isim@mail.com"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-xs font-bold text-rose-600 ml-1">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Gönder <Send size={16} /></>
                                    )}
                                </button>

                                <div className="text-center pt-4">
                                    <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs transition-colors">
                                        <ArrowLeft size={14} /> Giriş Sayfasına Dön
                                    </Link>
                                </div>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
