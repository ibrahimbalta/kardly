"use client"

import { Layout, Lock, ArrowLeft, Send, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useTranslation } from "@/context/LanguageContext"

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
            <ResetPasswordLogic />
        </Suspense>
    )
}

function ResetPasswordLogic() {
    const { t } = useTranslation()
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!token) {
            setError(t('invalidToken'))
        }
    }, [token, t])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError(t('passwordsDoNotMatch'))
            return
        }
        if (password.length < 6) {
            setError(t('passwordTooShort'))
            return
        }

        setIsLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Bir hata oluştu.")
            } else {
                setIsSuccess(true)
                setTimeout(() => {
                    router.push("/login")
                }, 3000)
            }
        } catch (err) {
            setError("Bağlantı hatası oluştu.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-white">
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

                    {isSuccess ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={32} className="text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-3">{t('passwordUpdated')}</h2>
                            <p className="text-slate-500 text-sm mb-10 leading-relaxed">
                                {t('passwordUpdatedSub')}
                            </p>
                            <Link href="/login" className="inline-flex items-center gap-2 text-rose-500 font-black uppercase text-xs tracking-widest hover:gap-3 transition-all">
                                <ArrowLeft size={14} /> {t('backToLogin')}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-10">
                                <h1 className="text-3xl font-black mb-3 tracking-tight text-slate-900">
                                    {t('resetPassword')}<span className="text-rose-500">.</span>
                                </h1>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {t('resetPasswordSub')}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">{t('newPasswordLabel')}</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-rose-500 transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-14 py-5 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all text-sm font-bold text-slate-900"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">{t('confirmNewPasswordLabel')}</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-rose-500 transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all text-sm font-bold text-slate-900"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-xs font-bold text-rose-600 ml-1">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading || !token}
                                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>{t('updatePassword')} <Send size={16} /></>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

