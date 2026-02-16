"use client"

import { signIn } from "next-auth/react"
import { Layout, Mail, ArrowRight, Sparkles, Zap, Star, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"

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
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-white">
            {/* Animated Background Blobs */}
            <div className="blob w-[600px] h-[600px] bg-rose-100 top-[-200px] left-[-200px] opacity-60" />
            <div className="blob w-[500px] h-[500px] bg-amber-50 bottom-[-150px] right-[-150px] opacity-70" />
            <div className="blob w-[300px] h-[300px] bg-orange-50 top-1/2 right-1/3 opacity-50" />

            {/* Dot Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">

                {/* Left - Register Form */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col justify-center p-10 md:p-16 bg-white rounded-[3.5rem] lg:rounded-r-none lg:rounded-l-[3.5rem] border border-slate-100 shadow-2xl shadow-rose-100/20 order-2 lg:order-1"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-11 h-11 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                            <Layout className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900">KARDLY<span className="text-rose-500">.</span></span>
                    </div>

                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 mb-6">
                            <Zap size={12} className="text-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Ücretsiz Başla</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-slate-900">
                            Hesap Oluştur<span className="text-rose-500">.</span>
                        </h1>
                        <p className="text-slate-400 text-sm">Kardly dünyasına katılmak için ilk adımı atın.</p>
                    </div>

                    <form onSubmit={handleEmailRegister} className="space-y-5 mb-8">
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
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-rose-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-200 hover:bg-rose-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Hesap Oluşturuluyor
                                </div>
                            ) : "Email ile Kayıt Ol"}
                        </button>
                        <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Ücretsiz • Şifresiz • 30 Saniye</p>
                    </form>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <div className="relative flex justify-center"><span className="bg-white px-6 text-xs font-black text-slate-300">VEYA</span></div>
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
                            <span className="text-xs uppercase font-black tracking-widest">Google ile Hızlı Kayıt</span>
                        </button>
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-slate-400">
                            Zaten hesabınız var mı? <Link href="/login" className="text-rose-500 hover:text-rose-600 font-black uppercase text-xs tracking-widest ml-1 transition-colors">Giriş Yap</Link>
                        </p>
                    </div>
                </motion.div>

                {/* Right - Branding Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-rose-500 via-rose-500 to-orange-500 rounded-r-[3.5rem] relative overflow-hidden order-1 lg:order-2"
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
                            Profesyonel dijital<br />
                            <span className="text-white/80">kartvizitin adresi.</span>
                        </h2>

                        <p className="text-white/70 text-sm leading-relaxed mb-12">
                            Saniyeler içinde size özel, canlı ve etkileyici bir dijital kartvizit oluşturun.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                                <Users className="w-6 h-6 text-white/80 mb-3" />
                                <div className="text-2xl font-black text-white">2K+</div>
                                <div className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Kullanıcı</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                                <Star className="w-6 h-6 text-white/80 mb-3 fill-current" />
                                <div className="text-2xl font-black text-white">4.9</div>
                                <div className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Puan</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[21, 22, 23, 24].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/80?img=${i}`} className="w-8 h-8 rounded-full border-2 border-white/30" />
                                ))}
                            </div>
                            <span className="text-white/70 text-xs font-medium">Binlerce profesyonel Kardly kullanıyor</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
