"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Smartphone, Wifi, WifiOff, Bell } from "lucide-react"

// Service Worker Registration
export function usePWA() {
    const [isInstallable, setIsInstallable] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)
    const [isOnline, setIsOnline] = useState(true)
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")

    useEffect(() => {
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
        installApp,
        notificationPermission,
        requestNotifications,
    }
}

// Install Prompt Banner Component
export function PWAInstallPrompt() {
    const { isInstallable, installApp, isInstalled } = usePWA()
    const [dismissed, setDismissed] = useState(false)
    const [showPrompt, setShowPrompt] = useState(false)

    useEffect(() => {
        // Show after 10 seconds if installable and not dismissed before
        if (isInstallable && !isInstalled) {
            const dismissedBefore = localStorage.getItem("pwa-dismissed")
            if (dismissedBefore) {
                const dismissedAt = parseInt(dismissedBefore)
                // Show again after 7 days
                if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return
            }
            const timer = setTimeout(() => setShowPrompt(true), 10000)
            return () => clearTimeout(timer)
        }
    }, [isInstallable, isInstalled])

    const handleInstall = async () => {
        const accepted = await installApp()
        if (accepted) {
            setShowPrompt(false)
        }
    }

    const handleDismiss = () => {
        setDismissed(true)
        setShowPrompt(false)
        localStorage.setItem("pwa-dismissed", Date.now().toString())
    }

    if (dismissed || !showPrompt) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-[420px]"
            >
                <div className="relative bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] border border-white/10 rounded-3xl p-5 shadow-[0_20px_60px_-15px_rgba(255,59,107,0.3)] backdrop-blur-2xl">
                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white/80"
                    >
                        <X size={14} />
                    </button>

                    <div className="flex items-start gap-4">
                        {/* App Icon */}
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF3B6B] to-[#FF6B8A] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#FF3B6B]/20">
                            <Smartphone size={24} className="text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-black text-sm tracking-tight mb-1">
                                Kardly&apos;ı Yükle
                            </h3>
                            <p className="text-white/50 text-[11px] leading-relaxed mb-3">
                                Ana ekranına ekle, çevrimdışı kullan, anında eriş.
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleInstall}
                                    className="flex items-center gap-2 bg-gradient-to-r from-[#FF3B6B] to-[#FF6B8A] text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#FF3B6B]/30"
                                >
                                    <Download size={12} />
                                    Yükle
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="text-white/30 hover:text-white/60 text-[10px] font-bold uppercase tracking-wider px-3 py-2.5 transition-all"
                                >
                                    Sonra
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Features mini bar */}
                    <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-white/5">
                        <span className="text-[9px] text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                            <WifiOff size={10} /> Çevrimdışı
                        </span>
                        <span className="text-[9px] text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                            <Bell size={10} /> Bildirimler
                        </span>
                        <span className="text-[9px] text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                            <Download size={10} /> Hızlı Erişim
                        </span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

// Offline Status Banner
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
                    className="fixed top-0 left-0 right-0 z-[10000] bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                    <WifiOff size={14} />
                    Çevrimdışı mod — Bazı özellikler kısıtlı olabilir
                </motion.div>
            )}
            {isOnline && wasOffline && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-0 left-0 right-0 z-[10000] bg-gradient-to-r from-emerald-500 to-green-500 text-white text-center py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                    <Wifi size={14} />
                    Bağlantı tekrar sağlandı ✓
                </motion.div>
            )}
        </AnimatePresence>
    )
}
