"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Suspense } from "react"

function ErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="text-rose-500 w-8 h-8" />
                </div>

                <h1 className="text-2xl font-black text-slate-900 mb-4">Giriş Hatası</h1>

                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                    {error === "Configuration" && "Sunucu yapılandırma hatası oluştu. Lütfen teknik ekiple iletişime geçin."}
                    {error === "AccessDenied" && "Hesabınız askıya alınmış veya erişim yetkiniz yok."}
                    {error === "Verification" && "Doğrulama bağlantısı geçersiz veya süresi dolmuş."}
                    {!error && "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin."}
                </p>

                <div className="space-y-3">
                    <Link
                        href="/login"
                        className="w-full block bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                    >
                        Giriş Sayfasına Dön
                    </Link>
                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 text-slate-400 py-4 font-bold text-sm hover:text-slate-600 transition-all"
                    >
                        <ArrowLeft size={16} /> Anasayfaya Git
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-50">
                    <p className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">Hata Kodu: {error || "Unknown"}</p>
                </div>
            </div>
        </div>
    )
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <ErrorContent />
        </Suspense>
    )
}
