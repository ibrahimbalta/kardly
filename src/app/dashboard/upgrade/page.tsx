"use client"

import { PLANS } from "@/config/plans"
import { Check, ArrowLeft, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function UpgradePage() {
    const handleUpgrade = async (planId: string) => {
        if (planId === 'free') return;

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId })
            })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                alert(data.error || "Bir hata oluştu")
            }
        } catch (err) {
            alert("Bağlantı hatası")
        }
    }

    return (
        <div className="min-h-screen bg-background p-10">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <Link href="/dashboard" className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors mb-6 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Dashboard'a Dön
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">Planını Yükselt</h1>
                    <p className="text-foreground/50 text-lg">İşletmeni büyütmek için sana en uygun profesyonel özellikleri keşfet.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {PLANS.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-8 rounded-[2.5rem] relative flex flex-col h-full ${plan.recommended
                                ? "bg-primary text-white scale-105 shadow-2xl shadow-primary/40 ring-4 ring-primary/20"
                                : "glass border-white/5"
                                }`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-primary px-4 py-1.2 rounded-full text-xs font-black shadow-lg">
                                    EN POPÜLER
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-1 opacity-90">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">₺{plan.price}</span>
                                    <span className="text-sm opacity-50">/ay</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm font-medium">
                                        <div className={`mt-0.5 rounded-full p-0.5 ${plan.recommended ? "bg-white/20" : "bg-primary/10"}`}>
                                            <Check className={`w-3.5 h-3.5 ${plan.recommended ? "text-white" : "text-primary"}`} />
                                        </div>
                                        <span className={plan.recommended ? "text-white/90" : "text-foreground/70"}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleUpgrade(plan.id)}
                                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 ${plan.recommended
                                    ? "bg-white text-primary shadow-xl shadow-white/10"
                                    : "bg-primary text-white shadow-lg shadow-primary/20"
                                    }`}
                            >
                                {plan.buttonText}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Security Footer */}
                <div className="mt-16 flex flex-col items-center justify-center text-center p-8 glass rounded-[2rem] border-white/5">
                    <ShieldCheck className="w-12 h-12 text-primary mb-4" />
                    <h4 className="text-lg font-bold mb-1">Güvenli Ödeme Alt Yapısı</h4>
                    <p className="text-foreground/40 text-sm max-w-md">
                        Ödemeleriniz <span className="font-bold text-foreground">iyzico</span> güvencesiyle 256-bit SSL sertifikası ile korunmaktadır.
                        Kredi kartı bilgileriniz sunucularımızda saklanmaz.
                    </p>
                </div>
            </div>
        </div>
    )
}
