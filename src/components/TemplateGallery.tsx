"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/context/LanguageContext'
import { ExternalLink, CheckCircle2, Palette, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

const categories = [
    { id: 'all', key: 'categoryAll' },
    { id: 'modern', key: 'categoryModern' },
    { id: 'minimal', key: 'categoryMinimal' },
    { id: 'creative', key: 'categoryCreative' },
    { id: 'corporate', key: 'categoryCorporate' },
]

const templates = [
    {
        id: 1,
        nameKey: 'templateNeonName',
        category: 'modern',
        image: '/images/templates/neon.png',
        badgeKey: 'badgePopular',
        badgeColor: 'bg-indigo-600',
    },
    {
        id: 2,
        nameKey: 'templateCleanName',
        category: 'minimal',
        image: '/images/templates/minimal.png',
        badgeKey: 'badgeMinimal',
        badgeColor: 'bg-emerald-600',
    },
    {
        id: 3,
        nameKey: 'templateCreativeName',
        category: 'creative',
        image: '/images/templates/creative.png',
        badgeKey: 'badgePremium',
        badgeColor: 'bg-amber-600',
    },
    {
        id: 4,
        nameKey: 'templateCyberName',
        category: 'modern',
        image: '/images/templates/cyber.png',
        badgeKey: 'badgeElite',
        badgeColor: 'bg-rose-600',
    }
]

export function TemplateGallery() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('all')
    const [hoveredTemplate, setHoveredTemplate] = useState(templates[0])

    const filteredTemplates = activeTab === 'all' 
        ? templates 
        : templates.filter(temp => temp.category === activeTab)

    return (
        <section className="py-24 md:py-32 bg-white relative overflow-hidden" id="templates">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:items-start">
                    
                    {/* LEFT SIDE: Content & List */}
                    <div className="flex-1">
                        <div className="text-left mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-6 font-black text-[10px] uppercase tracking-widest text-slate-400">
                                    <Palette size={12} className="text-rose-500" />
                                    {t('categoryCreative')}
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-6 tracking-tight italic">
                                    {t('templatesTitle')}
                                </h2>
                                <p className="text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
                                    {t('templatesSub')}
                                </p>
                            </motion.div>
                        </div>

                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                                        activeTab === cat.id
                                            ? 'bg-slate-950 text-white shadow-xl shadow-slate-200'
                                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                    }`}
                                >
                                    {t(cat.key)}
                                </button>
                            ))}
                        </div>

                        {/* Template List (Cards) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <AnimatePresence mode='popLayout'>
                                {filteredTemplates.map((template) => (
                                    <motion.div
                                        key={template.id}
                                        layout
                                        onMouseEnter={() => setHoveredTemplate(template)}
                                        className={`group relative p-5 bg-white rounded-3xl border transition-all duration-500 cursor-pointer ${
                                            hoveredTemplate.id === template.id 
                                            ? 'border-slate-950 shadow-2xl shadow-slate-100 scale-[1.02]' 
                                            : 'border-slate-100 hover:border-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                                                <Image
                                                    src={template.image}
                                                    alt={t(template.nameKey)}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-black text-slate-900 tracking-tight italic text-lg">
                                                        {t(template.nameKey)}
                                                    </h3>
                                                    <div className={`w-2 h-2 rounded-full ${hoveredTemplate.id === template.id ? 'bg-rose-500 animate-pulse' : 'bg-slate-200'}`} />
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                    {template.category}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="mt-12">
                            <Link 
                                href="/register"
                                className="inline-flex items-center gap-4 px-10 py-5 bg-rose-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-xl shadow-rose-200 active:scale-95 group"
                            >
                                {t('viewTemplate')}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Live Mockup View */}
                    <div className="flex-1 flex justify-center sticky top-32">
                        <div className="relative group">
                            {/* Glow Effects */}
                            <div className="absolute inset-x-0 -inset-y-10 bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" />
                            
                            {/* Phone Frame */}
                            <motion.div 
                                className="relative w-[320px] md:w-[380px] aspect-[9/18.5] p-3 bg-slate-950 rounded-[4.5rem] shadow-[0_60px_120px_rgba(15,23,42,0.3)] border-[10px] border-slate-900/50 backdrop-blur-2xl"
                            >
                                {/* Dynamic Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-32 bg-slate-900 rounded-b-[2rem] z-30 flex items-center justify-center">
                                    <div className="w-10 h-1.5 bg-slate-800 rounded-full" />
                                </div>

                                {/* Mockup Screen with Animated Content */}
                                <div className="w-full h-full bg-white rounded-[3.8rem] overflow-hidden relative">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={hoveredTemplate.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.05 }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute inset-0"
                                        >
                                            <Image 
                                                src={hoveredTemplate.image} 
                                                alt="Template Preview" 
                                                fill
                                                className="object-cover"
                                            />
                                            {/* UI Overlay Simulating the Card */}
                                            <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center pointer-events-none">
                                                <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                                    <Sparkles className="text-white" size={24} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                            
                            {/* Decorative Floating Element */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-10 -right-10 p-6 bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col gap-2 z-40 max-w-[150px]"
                            >
                                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div className="text-[10px] font-black text-slate-900 italic">Premium Design Applied</div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
