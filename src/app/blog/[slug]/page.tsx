"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Layout, ArrowLeft, Calendar } from "lucide-react"

export default function BlogPostPage() {
    const params = useParams()
    const [post, setPost] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.slug) {
            fetch(`/api/blog?slug=${params.slug}`)
                .then(r => r.json())
                .then(data => { setPost(data); setLoading(false) })
                .catch(() => setLoading(false))
        }
    }, [params.slug])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-3 border-slate-200 border-t-rose-500 rounded-full animate-spin" />
            </div>
        )
    }

    if (!post || post.error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Yazı Bulunamadı</h1>
                <Link href="/blog" className="text-sm font-semibold text-rose-500 hover:underline">← Blog'a Dön</Link>
            </div>
        )
    }

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
                    <Link href="/blog" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={16} /> Blog
                    </Link>
                </div>
            </div>

            <article className="max-w-3xl mx-auto px-6 py-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-6">
                        <Calendar size={12} />
                        {new Date(post.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">{post.title}</h1>
                    {post.coverImage && (
                        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-12 border border-slate-100">
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div
                        className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
                    />
                </motion.div>
            </article>
        </main>
    )
}
