"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/context/LanguageContext'
import { ExternalLink, CheckCircle2 } from 'lucide-react'
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

    const filteredTemplates = activeTab === 'all' 
        ? templates 
        : templates.filter(temp => temp.category === activeTab)

    return (
        <section className="py-24 bg-white relative overflow-hidden" id="templates">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            {t('templatesTitle')}
                        </h2>
                        <p className="text-xl text-gray-600">
                            {t('templatesSub')}
                        </p>
                    </motion.div>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                                activeTab === cat.id
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                            }`}
                        >
                            {t(cat.key)}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredTemplates.map((template) => (
                            <motion.div
                                key={template.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -10 }}
                                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-full"
                            >
                                {/* Image Container */}
                                <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                                    <Image
                                        src={template.image}
                                        alt={t(template.nameKey)}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <Link 
                                            href="/register"
                                            className="bg-white text-indigo-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full"
                                        >
                                            {t('viewTemplate')}
                                            <ExternalLink size={18} />
                                        </Link>
                                    </div>

                                    {/* Floating Badge */}
                                    <div className={`absolute top-4 left-4 ${template.badgeColor} text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-lg shadow-black/20`}>
                                        {t(template.badgeKey)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900 truncate">
                                            {t(template.nameKey)}
                                        </h3>
                                        <CheckCircle2 className="text-emerald-500" size={18} />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                                        {activeTab === 'all' ? template.category : t(`category${template.category.charAt(0).toUpperCase() + template.category.slice(1)}`)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* View All Button */}
                <div className="text-center mt-16">
                    <button className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                        {t('exploreAllFeatures')} <span>&rarr;</span>
                    </button>
                </div>
            </div>
        </section>
    )
}
