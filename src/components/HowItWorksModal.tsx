"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, Play, Sparkles, CheckCircle2, UserPlus, Palette, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface HowItWorksModalProps {
    isOpen: boolean
    onClose: () => void
    t: any
}

const slides = [
    {
        icon: <UserPlus className="text-rose-500" size={32} />,
        title: "Ücretsiz Kayıt Ol",
        desc: "Dakikalar içinde hesabını oluştur. Adını, mesleğini ve temel bilgilerini girerek dijital kimliğini başlat.",
        image: "/images/how-it-works/step1.png",
        accent: "from-rose-500 to-pink-500"
    },
    {
        icon: <Palette className="text-indigo-500" size={32} />,
        title: "Profilini Özelleştir",
        desc: "Sürükle bırak bloklarla biyografini, hizmetlerini, portfolyonyu ve sosyal medya linklerini ekle. Renkleri ve fontları dilediğin gibi ayarla.",
        image: "/images/how-it-works/step2.png",
        accent: "from-indigo-500 to-violet-500"
    },
    {
        icon: <Share2 className="text-emerald-500" size={32} />,
        title: "Linkini ve QR Kodunu Paylaş",
        desc: "Özel URL'ini veya QR kodunu telefonuna kaydet. Networking etkinliklerinde anında paylaş ve rehbere eklet.",
        image: "/images/how-it-works/step3.png",
        accent: "from-emerald-500 to-teal-500"
    }
]

export function HowItWorksModal({ isOpen, onClose, t }: HowItWorksModalProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlay, setIsAutoPlay] = useState(true)

    useEffect(() => {
        if (!isOpen) return
        if (!isAutoPlay) return

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [isOpen, isAutoPlay])

    const nextSlide = () => {
        setIsAutoPlay(false)
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setIsAutoPlay(false)
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-slate-900/90 backdrop-blur-2xl"
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/30 rounded-full blur-[120px]" />
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row h-full max-h-[700px] border border-white/20"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-slate-100/80 hover:bg-white text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all border border-slate-200 shadow-sm"
                    >
                        <X size={24} />
                    </button>

                    {/* Left Side: Visuals */}
                    <div className="flex-1 bg-slate-50 relative overflow-hidden flex items-center justify-center p-8 border-r border-slate-100">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 1.05 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="relative w-full h-full"
                            >
                                <img
                                    src={slides[currentSlide].image}
                                    alt={slides[currentSlide].title}
                                    className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                                />
                                
                                {/* Floating decorative tags */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className={cn("absolute top-10 right-0 px-4 py-2 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center gap-2", "backdrop-blur-md")}
                                >
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Gerçek Zamanlı</span>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Side: Content */}
                    <div className="w-full md:w-[450px] p-8 md:p-12 flex flex-col justify-between bg-white overflow-y-auto lg:overflow-visible">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-8">
                                <Sparkles size={12} className="text-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">NASIL ÇALIŞIR?</span>
                            </div>

                            <div className="space-y-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSlide}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner border border-slate-100">
                                            {slides[currentSlide].icon}
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
                                            {slides[currentSlide].title}
                                        </h2>
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                            {slides[currentSlide].desc}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="mt-12 space-y-8">
                            {/* Slide Pagination */}
                            <div className="flex gap-2">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setIsAutoPlay(false)
                                            setCurrentSlide(i)
                                        }}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all duration-500",
                                            currentSlide === i ? cn("w-12 bg-rose-500") : "w-4 bg-slate-200"
                                        )}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={prevSlide}
                                        className="w-12 h-12 rounded-2xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all bg-white shadow-sm"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="w-12 h-12 rounded-2xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all bg-white shadow-sm"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>

                                <button
                                    onClick={currentSlide === slides.length - 1 ? onClose : nextSlide}
                                    className={cn(
                                        "flex-1 md:flex-none px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3",
                                        "bg-gradient-to-r", slides[currentSlide].accent
                                    )}
                                >
                                    {currentSlide === slides.length - 1 ? "Hadi Başlayalım!" : "Devam Et"}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
