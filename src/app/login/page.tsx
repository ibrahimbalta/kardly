"use client"

import { signIn } from "next-auth/react"
import { Layout, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setIsLoading(true)
        await signIn("credentials", { email, callbackUrl: "/dashboard" })
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#020617]">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[140px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-12 rounded-[3.5rem] w-full max-w-lg border-white/10 shadow-3xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-primary/20">
                        <Layout className="text-primary w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black mb-3 tracking-tight uppercase italic">Hoş Geldiniz<span className="text-primary">.</span></h1>
                    <p className="text-foreground/50 font-medium lowercase tracking-widest text-xs">Dijital Kimliğinizi Yönetmeye Başlayın</p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-6 mb-10">
                    <div className="grid gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 ml-4 mb-1">Email Adresiniz</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                placeholder="Örn: isim@mail.com"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm font-bold placeholder:text-foreground/20"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Giriş Yapılıyor
                            </div>
                        ) : "Email İle Hızlı Giriş"}
                    </button>
                    <p className="text-center text-[9px] font-black text-foreground/20 uppercase tracking-[0.4em]">Şifresiz ve Güvenli Erişim</p>
                </form>

                <div className="relative mb-10">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <div className="relative flex justify-center"><span className="bg-[#020617] px-6 text-xs font-black text-foreground/20 italic">OR</span></div>
                </div>

                <div className="grid gap-4">
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="w-full flex items-center justify-center gap-4 bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-bold hover:bg-white/10 transition-all group"
                    >
                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="text-xs uppercase font-black tracking-widest">Google İle Devam Et</span>
                    </button>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs font-bold text-foreground/40">
                        Henüz hesabınız yok mu? <a href="/register" className="text-primary hover:underline hover:text-primary/80 transition-colors uppercase font-black tracking-widest ml-1">Kayıt Ol</a>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
