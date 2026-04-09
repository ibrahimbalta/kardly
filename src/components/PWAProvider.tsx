"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Smartphone, Wifi, WifiOff, Bell, Zap, Shield, ChevronRight } from "lucide-react"

// ─── Mobile Detection Helper ────────────────────────────────────
const isMobileDevice = () => {
    if (typeof window === "undefined") return false
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || ""
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua)
}

// ─── Service Worker Registration ─────────────────────────────────
export function usePWA() {
    const [isInstallable, setIsInstallable] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)
    const [isOnline, setIsOnline] = useState(true)
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        // Detect mobile
        setIsMobile(isMobileDevice())

        // Register service worker
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((reg) => {
                    console.log("[PWA] Service Worker registered:", reg.scope)
                })
                .catch((err) => {
                    console.error("[PWA] SW registration failed:", err)
                })
        }

        // Check if already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstalled(true)
        }

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setIsInstallable(true)
        }

        // Listen for app installed
        const handleAppInstalled = () => {
            setIsInstalled(true)
            setIsInstallable(false)
            setDeferredPrompt(null)
        }

        // Online/Offline status
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)
        setIsOnline(navigator.onLine)

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        window.addEventListener("appinstalled", handleAppInstalled)
        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        // Check notification permission
        if ("Notification" in window) {
            setNotificationPermission(Notification.permission)
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
            window.removeEventListener("appinstalled", handleAppInstalled)
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [])

    const installApp = async () => {
        if (!deferredPrompt) return false
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        setDeferredPrompt(null)
        setIsInstallable(false)
        return outcome === "accepted"
    }

    const requestNotifications = async () => {
        if (!("Notification" in window)) return false
        const permission = await Notification.requestPermission()
        setNotificationPermission(permission)
        return permission === "granted"
    }

    return {
        isInstallable,
        isInstalled,
        isOnline,
        isMobile,
        installApp,
        notificationPermission,
        requestNotifications,
    }
}

// ─── Premium Install Prompt (Mobile Only) ────────────────────────
export function PWAInstallPrompt() {
    const { isInstallable, installApp, isInstalled, isMobile } = usePWA()
    const [dismissed, setDismissed] = useState(false)
    const [showPrompt, setShowPrompt] = useState(false)
    const [installing, setInstalling] = useState(false)
    const [showIOSGuide, setShowIOSGuide] = useState(false)

    // Detect iOS (Safari has no beforeinstallprompt)
    const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent)

    useEffect(() => {
        // ✅ ONLY show on mobile devices
        if (!isMobile) return

        const shouldShow = isInstallable && !isInstalled
        const isIOSSafari = isIOS && !isInstalled && !(window.navigator as any).standalone

        if (shouldShow || isIOSSafari) {
            const dismissedBefore = localStorage.getItem("pwa-dismissed")
            if (dismissedBefore) {
                const dismissedAt = parseInt(dismissedBefore)
                // Show again after 7 days
                if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return
            }
            const timer = setTimeout(() => setShowPrompt(true), 8000)
            return () => clearTimeout(timer)
        }
    }, [isInstallable, isInstalled, isMobile, isIOS])

    const handleInstall = async () => {
        if (isIOS) {
            setShowIOSGuide(true)
            return
        }
        setInstalling(true)
        const accepted = await installApp()
        setInstalling(false)
        if (accepted) {
            setShowPrompt(false)
        }
    }

    const handleDismiss = () => {
        setDismissed(true)
        setShowPrompt(false)
        setShowIOSGuide(false)
        localStorage.setItem("pwa-dismissed", Date.now().toString())
    }

    // ❌ Don't show on desktop or if dismissed
    if (dismissed || !showPrompt || !isMobile) return null

    return (
        <AnimatePresence>
            {/* Background Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
                onClick={handleDismiss}
            />

            <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-8"
            >
                <div className="relative overflow-hidden bg-[#0a0a14] border border-white/[0.08] rounded-[2rem] shadow-[0_-20px_80px_-20px_rgba(255,59,107,0.25)] max-w-[420px] mx-auto">
                    
                    {/* Animated Gradient Top Border */}
                    <div className="absolute top-0 left-0 right-0 h-[2px]">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FF3B6B] to-transparent animate-pulse" />
                    </div>

                    {/* Ambient Glow */}
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#FF3B6B]/20 rounded-full blur-[80px] pointer-events-none" />

                    {/* Drag Handle */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-10 h-1 rounded-full bg-white/10" />
                    </div>

                    {showIOSGuide ? (
                        /* iOS Safari Guide */
                        <div className="px-6 pb-6 pt-2">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Smartphone size={22} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-[15px] tracking-tight">
                                        Ana Ekrana Ekle
                                    </h3>
                                    <p className="text-white/40 text-[11px]">Safari ile 3 kolay adım</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-5">
                                {[
                                    { step: "1", text: "Alt menüden Paylaş butonuna tıklayın", icon: "↑" },
                                    { step: "2", text: "\"Ana Ekrana Ekle\" seçeneğini bulun", icon: "+" },
                                    { step: "3", text: "\"Ekle\" butonuna dokunun", icon: "✓" },
                                ].map((item) => (
                                    <div key={item.step} className="flex items-center gap-3 bg-white/[0.04] rounded-2xl px-4 py-3 border border-white/[0.06]">
                                        <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 text-sm font-black flex-shrink-0">
                                            {item.step}
                                        </div>
                                        <p className="text-white/70 text-[12px] font-medium flex-1">{item.text}</p>
                                        <span className="text-xl opacity-40">{item.icon}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleDismiss}
                                className="w-full py-3.5 rounded-2xl bg-white/5 text-white/60 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                            >
                                Anladım, Kapat
                            </button>
                        </div>
                    ) : (
                        /* Standard Install Prompt */
                        <div className="px-6 pb-6 pt-2">
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-5">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-br from-[#FF3B6B] to-[#FF6B8A] flex items-center justify-center flex-shrink-0 shadow-xl shadow-[#FF3B6B]/25">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" fillOpacity="0.9"/>
                                        </svg>
                                    </div>
                                    {/* Live dot */}
                                    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0a0a14] animate-pulse" />
                                </div>
                                
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <h3 className="text-white font-black text-[16px] tracking-tight leading-tight">
                                        Kardly&apos;ı Yükle
                                    </h3>
                                    <p className="text-white/40 text-[11px] leading-relaxed mt-1">
                                        Uygulama gibi kullan, çevrimdışı eriş
                                    </p>
                                </div>

                                <button
                                    onClick={handleDismiss}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] hover:bg-white/10 transition-all text-white/30 hover:text-white/60 flex-shrink-0 mt-0.5"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Feature Pills */}
                            <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
                                {[
                                    { icon: <Zap size={12} />, label: "Anında Erişim", color: "from-amber-500/15 to-orange-500/15 text-amber-400 border-amber-500/10" },
                                    { icon: <WifiOff size={12} />, label: "Çevrimdışı", color: "from-blue-500/15 to-cyan-500/15 text-blue-400 border-blue-500/10" },
                                    { icon: <Shield size={12} />, label: "Güvenli", color: "from-emerald-500/15 to-green-500/15 text-emerald-400 border-emerald-500/10" },
                                    { icon: <Bell size={12} />, label: "Bildirimler", color: "from-purple-500/15 to-violet-500/15 text-purple-400 border-purple-500/10" },
                                ].map((feature, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r ${feature.color} border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0`}
                                    >
                                        {feature.icon}
                                        {feature.label}
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleInstall}
                                    disabled={installing}
                                    className="flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#FF3B6B] to-[#FF6B8A] text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#FF3B6B]/25 disabled:opacity-60 disabled:scale-100 relative overflow-hidden group"
                                >
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    
                                    {installing ? (
                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Download size={15} />
                                    )}
                                    <span className="relative z-10">{installing ? "Yükleniyor..." : "Şimdi Yükle"}</span>
                                </button>

                                <button
                                    onClick={handleDismiss}
                                    className="px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.08] text-[11px] font-bold uppercase tracking-wider transition-all flex-shrink-0"
                                >
                                    Sonra
                                </button>
                            </div>

                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

// ─── Offline Status Banner ───────────────────────────────────────
export function OfflineIndicator() {
    const { isOnline } = usePWA()
    const [wasOffline, setWasOffline] = useState(false)

    useEffect(() => {
        if (!isOnline) setWasOffline(true)
        if (isOnline && wasOffline) {
            const timer = setTimeout(() => setWasOffline(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [isOnline, wasOffline])

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-0 left-0 right-0 z-[10000] bg-gradient-to-r from-amber-600/90 to-orange-600/90 backdrop-blur-xl text-white text-center py-3 px-4 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-2xl border-b border-amber-400/20"
                >
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <WifiOff size={11} />
                    </div>
                    Çevrimdışı mod — Bazı özellikler kısıtlı olabilir
                </motion.div>
            )}
            {isOnline && wasOffline && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-0 left-0 right-0 z-[10000] bg-gradient-to-r from-emerald-600/90 to-green-600/90 backdrop-blur-xl text-white text-center py-3 px-4 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-2xl border-b border-emerald-400/20"
                >
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <Wifi size={11} />
                    </div>
                    Bağlantı tekrar sağlandı ✓
                </motion.div>
            )}
        </AnimatePresence>
    )
}
