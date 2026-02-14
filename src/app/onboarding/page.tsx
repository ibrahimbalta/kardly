"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, ArrowLeft, Check, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
    {
        id: "basic",
        title: "Seni Tanıyalım",
        description: "Mesleğin ve hedef kitlen hakkında kısa bilgi ver.",
    },
    {
        id: "username",
        title: "Kullanıcı Adını Seç",
        description: "Profiline erişmek için kullanılacak benzersiz adres.",
    },
    {
        id: "style",
        title: "Tarzını Belirle",
        description: "Sitenin nasıl bir tonda olmasını istersin?",
    },
    {
        id: "generating",
        title: "AI Hazırlıyor",
        description: "Senin için en uygun tasarımı ve metinleri oluşturuyoruz.",
    },
]

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedData, setGeneratedData] = useState<any>(null)
    const [formData, setFormData] = useState({
        occupation: "",
        targetAudience: "",
        tone: "profesyonel",
        services: "",
        username: "",
    })

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    useEffect(() => {
        if (currentStep === 3 && !generatedData && !isGenerating) {
            generateSite()
        }
    }, [currentStep])

    const generateSite = async () => {
        setIsGenerating(true)
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setGeneratedData(data)
        } catch (error: any) {
            console.error("Hata:", error)
            alert(error.message || "Bir hata oluştu, lütfen tekrar deneyin.")
            if (error.message?.includes("kullanıcı adı")) {
                setCurrentStep(1)
            } else {
                setCurrentStep(2)
            }
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full" />

            <div className="w-full max-w-2xl z-10">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-12">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-1.5 flex-1 rounded-full transition-all duration-500",
                                i <= currentStep ? "bg-primary" : "bg-white/10"
                            )}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl"
                    >
                        {!generatedData ? (
                            <>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                        <Sparkles className="text-primary w-6 h-6" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">{steps[currentStep].title}</h1>
                                        <p className="text-foreground/50 text-sm">{steps[currentStep].description}</p>
                                    </div>
                                </div>

                                {currentStep === 0 && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Mesleğin Nedir?</label>
                                            <input
                                                type="text"
                                                placeholder="Örn: Yazılım Geliştirici, Berber, Avukat..."
                                                className="w-full glass bg-white/5 border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                                value={formData.occupation}
                                                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Hedef Kitlen Kimler?</label>
                                            <input
                                                type="text"
                                                placeholder="Örn: Genç profesyoneller, yerel müşteriler..."
                                                className="w-full glass bg-white/5 border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                                value={formData.targetAudience}
                                                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Profil Adresin</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30 font-bold">kardly.com/</span>
                                                <input
                                                    type="text"
                                                    placeholder="adiniz"
                                                    className="w-full glass bg-white/5 border-white/10 rounded-xl pl-[110px] pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-primary"
                                                    value={formData.username}
                                                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                                                />
                                            </div>
                                            <p className="text-[10px] text-foreground/40 mt-2 ml-2 italic">Sadece küçük harf ve rakam kullanabilirsiniz.</p>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {["Profesyonel", "Samimi", "Yaratıcı", "Lüks"].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setFormData({ ...formData, tone: t.toLowerCase() })}
                                                className={cn(
                                                    "p-6 rounded-2xl border transition-all text-left group",
                                                    formData.tone === t.toLowerCase()
                                                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                                                        : "glass border-white/5 hover:border-primary/50"
                                                )}
                                            >
                                                <span className="font-bold block mb-1">{t}</span>
                                                <span className={cn(
                                                    "text-xs leading-tight block",
                                                    formData.tone === t.toLowerCase() ? "text-white/70" : "text-foreground/40"
                                                )}>
                                                    {t === "Profesyonel" && "Kurumsal ve güven veren bir dil."}
                                                    {t === "Samimi" && "Sıcak ve arkadaş canlısı bir dil."}
                                                    {t === "Yaratıcı" && "Sıra dışı ve dikkat çekici bir stil."}
                                                    {t === "Lüks" && "Zarif ve üst düzey bir görünüm."}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="py-12 flex flex-col items-center text-center">
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-primary/20 rounded-full animate-ping absolute inset-0" />
                                            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center relative z-10 shadow-xl shadow-primary/30">
                                                <Wand2 className="text-white w-10 h-10 animate-bounce" />
                                            </div>
                                        </div>
                                        <h2 className="mt-10 text-xl font-bold">AI Senin İçin Düşünüyor...</h2>
                                        <p className="text-foreground/50 mt-2 max-w-xs mx-auto">
                                            Metinler, hizmet açıklamaları ve sana özel renk paleti hazırlanıyor.
                                        </p>
                                        <div className="mt-8 flex gap-3">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-10 flex gap-4">
                                    {currentStep > 0 && currentStep < 3 && (
                                        <button
                                            onClick={handleBack}
                                            className="px-6 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-white/5 transition-all text-foreground/60"
                                        >
                                            <ArrowLeft className="w-5 h-5" /> Geri
                                        </button>
                                    )}
                                    {currentStep < 3 && (
                                        <button
                                            onClick={handleNext}
                                            disabled={
                                                (currentStep === 0 && !formData.occupation) ||
                                                (currentStep === 1 && !formData.username)
                                            }
                                            className="flex-1 bg-primary text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                                        >
                                            {currentStep === 2 ? "Siteyi Oluştur" : "Devam Et"} <ArrowRight className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="text-emerald-500 w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Harika! Siten Hazır</h2>
                                <p className="text-foreground/60 mb-8">AI senin için harika içerikler üretti.</p>

                                <div className="bg-white/5 rounded-2xl p-6 text-left mb-8 border border-white/10">
                                    <p className="text-primary font-bold text-sm mb-1">Profil Adresin:</p>
                                    <p className="text-lg font-bold mb-4 opacity-80">kardly.com/{formData.username}</p>

                                    <p className="text-primary font-bold text-sm mb-1">Slogan:</p>
                                    <p className="text-lg font-medium mb-4 italic opacity-80">"{generatedData.slogan}"</p>

                                    <p className="text-primary font-bold text-sm mb-1">Bio:</p>
                                    <p className="text-sm opacity-70 mb-4">{generatedData.bio}</p>
                                </div>

                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="w-full bg-primary text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Dashboard'a Git
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
