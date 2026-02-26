"use client"

import { signIn } from "next-auth/react"
import { Layout, Mail, ArrowRight, Sparkles, AlertCircle, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTranslation } from "@/context/LanguageContext"

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
            <LoginLogic />
        </Suspense>
    )
}

function LoginLogic() {
    const { t } = useTranslation()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) return
        setIsLoading(true)
        setLoginError("")

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/dashboard"
        })

        if (result?.error) {
            setLoginError(t('loginErrorInvalid'))
            setIsLoading(false)
        } else if (result?.url) {
            window.location.href = result.url
        } else {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-white">
            {/* Animated Background Blobs */}
            <div className="blob w-[600px] h-[600px] bg-rose-100 top-[-200px] right-[-200px] opacity-60" />
            <div className="blob w-[500px] h-[500px] bg-orange-50 bottom-[-150px] left-[-150px] opacity-70" />
            <div className="blob w-[300px] h-[300px] bg-amber-50 top-1/3 left-1/4 opacity-50" />

            {/* Dot Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">

                {/* Left - Branding Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-rose-500 to-orange-500 rounded-l-[3.5rem] relative overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                                <Layout className="text-white w-7 h-7" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter">KARDLY<span className="text-white/60">.</span></span>
                        </div>

                        <h2 className="text-4xl font-black text-white leading-tight mb-6">
                            {t('loginBrandingTitle')}
                        </h2>

                        <p className="text-white/70 text-sm leading-relaxed mb-12">
                            {t('loginBrandingDesc')}
                        </p>

                        <div className="space-y-4">
                            {(t('loginFeatures') as unknown as string[]).map((item: string, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                        <ArrowRight className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-white/90 text-sm font-medium">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right - Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex flex-col justify-center p-10 md:p-16 bg-white rounded-[3.5rem] lg:rounded-l-none lg:rounded-r-[3.5rem] border border-slate-100 shadow-2xl shadow-rose-100/20"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-11 h-11 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                            <Layout className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900">KARDLY<span className="text-rose-500">.</span></span>
                    </div>

                    {(error === "account_disabled" || loginError) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600"
                        >
                            <AlertCircle size={20} className="shrink-0" />
                            <p className="text-xs font-bold leading-relaxed">
                                {error === "account_disabled" ? t('loginErrorDisabled') : loginError}
                            </p>
                        </motion.div>
                    )}

                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 mb-6">
                            <Sparkles size={12} className="text-rose-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Hoş Geldiniz</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-slate-900">
                            {t('loginTitle')}<span className="text-rose-500">.</span>
                        </h1>
                        <p className="text-slate-400 text-sm">{t('loginSubtitle')}</p>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-5 mb-8">
                        <div className="grid gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">{t('loginEmailLabel')}</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-rose-500 transition-colors" />
                                <input
                                    type="email"
                                    placeholder={t('loginEmailPlaceholder')}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('loginPasswordLabel')}</label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
                                >
                                    {t('loginForgotBtn')}
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-slate-300 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    placeholder={t('loginPasswordPlaceholder')}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-rose-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-200 hover:bg-rose-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t('loginInProcess')}
                                </div>
                            ) : t('loginSubmitBtn')}
                        </button>
                        <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Şifresiz ve Güvenli Erişim</p>
                    </form>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <div className="relative flex justify-center"><span className="bg-white px-6 text-xs font-black text-slate-300">{t('loginOr')}</span></div>
                    </div>

                    <div className="grid gap-4">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            className="w-full flex items-center justify-center gap-4 bg-slate-50 border border-slate-200 text-slate-700 py-5 rounded-2xl font-bold hover:bg-slate-100 hover:border-slate-300 transition-all group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-xs uppercase font-black tracking-widest">{t('loginGoogleBtn')}</span>
                        </button>
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-slate-400">
                            {t('loginNoAccount')} <Link href="/register" className="text-rose-500 hover:text-rose-600 font-black uppercase text-xs tracking-widest ml-1 transition-colors">{t('loginRegisterLink')}</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
