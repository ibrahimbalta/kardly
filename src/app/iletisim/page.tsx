"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, ArrowLeft, Send, CheckCircle2, Mail, User, MessageSquare, FileText } from "lucide-react"

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            if (res.ok) {
                setSent(true)
            } else {
                setError('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
            }
        } catch {
            setError('Bir hata oluştu.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-rose-200">
                            <Layout className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900">Kardly<span className="text-rose-500">.</span></span>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={16} /> Ana Sayfa
                    </Link>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4">İletişim</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Bize Ulaşın</h1>
                    <p className="text-slate-500 text-lg mb-12">Sorularınız, önerileriniz veya iş birliği talepleriniz için bizimle iletişime geçin.</p>
                </motion.div>

                {sent ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 size={40} className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Mesajınız Gönderildi!</h2>
                        <p className="text-slate-500 mb-8">En kısa sürede size geri dönüş yapacağız.</p>
                        <Link href="/" className="text-sm font-semibold text-rose-500 hover:underline">Ana Sayfaya Dön →</Link>
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Adınız</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                                        placeholder="Adınız Soyadınız"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">E-posta</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                                        placeholder="ornek@email.com"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Konu</label>
                            <div className="relative">
                                <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input
                                    type="text"
                                    required
                                    value={form.subject}
                                    onChange={e => setForm({ ...form, subject: e.target.value })}
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                                    placeholder="Konu başlığı"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Mesajınız</label>
                            <div className="relative">
                                <MessageSquare size={16} className="absolute left-4 top-5 text-slate-300" />
                                <textarea
                                    required
                                    rows={6}
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                                    placeholder="Mesajınızı buraya yazın..."
                                />
                            </div>
                        </div>
                        {error && <p className="text-sm text-rose-500 font-medium">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-semibold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Mesaj Gönder <Send size={16} /></>
                            )}
                        </button>
                    </motion.form>
                )}
            </div>
        </main>
    )
}
