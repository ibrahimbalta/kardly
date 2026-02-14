"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, QrCode, Smartphone } from "lucide-react"

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm font-medium border-primary/20"
                >
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="gradient-text font-bold">Yapay Zeka Destekli Yeni Nesil Kartvizit</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
                >
                    Saniyeler İçinde <br />
                    <span className="gradient-text">Dijital Kimliğini</span> Oluştur
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-xl text-foreground/60 max-w-2xl mb-10"
                >
                    AI yardımcımız senin için profesyonel bir portföy ve dijital kartvizit oluştursun.
                    Müşterilerinle QR kod veya NFC ile anında paylaşmaya başla.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        Hemen Ücretsiz Dene <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="glass px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2 border-white/10">
                        Örnekleri İncele
                    </button>
                </motion.div>

                {/* Floating Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl">
                    {[
                        { icon: Sparkles, title: "AI Yazarlık", desc: "Senin yerinse Bio ve hizmetlerini AI yazsın." },
                        { icon: QrCode, title: "Dinamik QR", desc: "Ziyaretçi analitiği takip edilebilen akıllı QR kodlar." },
                        { icon: Smartphone, title: "vCard Desteği", desc: "Müşterilerin seni tek tıkla rehberine eklesin." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="glass p-6 rounded-3xl text-left border-white/5 hover:border-primary/30 transition-colors"
                        >
                            <item.icon className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-foreground/50 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
