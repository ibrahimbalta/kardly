"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, ArrowLeft, Calendar, ArrowRight } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"

export default function BlogPage() {
    const { t, language } = useTranslation()
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/blog')
            .then(r => r.json())
            .then(data => { setPosts(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    return (
        <main className="min-h-screen bg-white">
            <div className="bg-slate-50 border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-rose-200">
                            <Layout className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900">Kardly<span className="text-rose-500">.</span></span>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={16} /> {t('back')}
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 mb-4">{t('blog')}</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">{t('blogMainTitle')}</h1>
                    <p className="text-slate-500 text-lg mb-16">{t('blogMainSubtitle')}</p>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-3 border-slate-200 border-t-rose-500 rounded-full animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-300 text-lg font-medium">{t('blogNoPost')}</p>
                        <p className="text-slate-400 text-sm mt-2">{t('blogNoPostDesc')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {posts.map((post: any, i: number) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={`/blog/${post.slug}`} className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                                    {post.coverImage && (
                                        <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}
                                    <div className="p-8">
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-4">
                                            <Calendar size={12} />
                                            {new Date(post.createdAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-rose-500 transition-colors">{post.title}</h2>
                                        {post.excerpt && <p className="text-sm text-slate-500 leading-relaxed mb-4">{post.excerpt}</p>}
                                        <span className="text-xs font-semibold text-rose-500 flex items-center gap-2">
                                            {t('blogReadMore')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
