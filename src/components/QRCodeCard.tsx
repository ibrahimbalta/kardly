"use client"

import { useEffect, useState } from "react"
import { QrCode, Download } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"

export function QRCodeCard({ username, dark, light }: { username: string, dark?: string, light?: string }) {
    const { t } = useTranslation()
    const [qrCode, setQrCode] = useState<string | null>(null)

    useEffect(() => {
        const darkParam = dark ? `&dark=${encodeURIComponent(dark)}` : ''
        const lightParam = light ? `&light=${encodeURIComponent(light)}` : ''
        fetch(`/api/qr?username=${username}${darkParam}${lightParam}`)
            .then(res => res.json())
            .then(data => setQrCode(data.qrCode))
    }, [username, dark, light])

    if (!qrCode) {
        return (
            <div className="flex flex-col items-center gap-2 text-white/20">
                <QrCode className="w-12 h-12 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest">{t('generatingQR')}</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-2 rounded-2xl shadow-xl shadow-primary/20">
                <img src={qrCode} alt="QR Code" className="w-24 h-24" />
            </div>
            <a
                href={qrCode}
                download={`${username}-qr.png`}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors"
            >
                <Download className="w-3 h-3" /> {t('download')}
            </a>
        </div>
    )
}
