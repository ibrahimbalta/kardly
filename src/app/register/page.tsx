"use client"

import { signIn } from "next-auth/react"
import { Layout, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleEmailRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setIsLoading(true)
        await signIn("credentials", { email, callbackUrl: "/dashboard" })
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-10 rounded-[2.5rem] w-full max-w-md text-center relative z-10"
            >
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
                    <Layout className="text-white w-10 h-10" />
                </div>

                <h1 className="text-3xl font-bold mb-2">Hesap Oluştur</h1>
                <p className="text-foreground/50 mb-10">Kardly dünyasına katılmak için ilk adımı at.</p>

                <form onSubmit={handleEmailRegister} className="space-y-4 mb-8">
                    <div className="relative text-left">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
                        <input
                            type="email"
                            placeholder="Email adresiniz"
                            required
                            className="w-full glass bg-white/5 border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white px-6 py-4 rounded-xl font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-lg disabled:opacity-50"
                    >
                        {isLoading ? "Hesap Oluşturuluyor..." : "Email ile Kayıt Ol"}
                    </button>
                </form>

                <div className="relative mb-8">
                    <hr className="border-white/5" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#020617] px-4 text-xs font-bold text-foreground/30">VEYA</span>
                </div>

                <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google ile Hızlı Kayıt
                </button>

                <p className="mt-8 text-sm text-foreground/40 text-center">
                    Hesabın var mı? <a href="/login" className="text-primary hover:underline">Giriş Yap</a>
                </p>
            </motion.div>
        </div>
    )
}
