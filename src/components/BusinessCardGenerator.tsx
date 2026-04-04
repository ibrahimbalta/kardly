"use client"

import React, { useRef, useState, useEffect } from 'react'
import QRCode from 'qrcode'
import * as htmlToImage from 'html-to-image'
import { Download, Share2, Check, RefreshCw, Phone, MapPin, Mail, Globe, MessageCircle, Star, Crown, Palette, Zap, Code, Type, Layout, CreditCard } from 'lucide-react'
import { useTranslation } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface BusinessCardGeneratorProps {
    user: {
        name: string
        username: string
        occupation?: string
        image?: string
        phone?: string
        email?: string
    }
    profileData: any
    mode?: 'full' | 'selector' | 'preview' | 'modal'
    selectedTemplateId?: string
    orientation?: 'landscape' | 'portrait'
    onSelect?: (templateId: string) => void
    onOrientationChange?: (orientation: 'landscape' | 'portrait') => void
}

export const TEMPLATES = [
    // Standard
    { id: 'minimal_white', name: 'Zen White', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-indigo-600', accentText: 'text-indigo-600', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'dots', category: 'Standard' },
    { id: 'modern_dark', name: 'Obsidian', bg: 'bg-slate-950', text: 'text-white', accent: 'bg-emerald-400', accentText: 'text-emerald-400', secondary: 'text-slate-400', hex: '#020617', pattern: 'grid', category: 'Standard' },
    { id: 'minimal_noir', name: 'Noir Luxe', bg: 'bg-neutral-900', text: 'text-neutral-100', accent: 'bg-white', accentText: 'text-white', secondary: 'text-neutral-500', hex: '#171717', pattern: 'lines', category: 'Standard' },
    { id: 'standard_waves', name: 'Soft Waves', bg: 'bg-indigo-50', text: 'text-indigo-950', accent: 'bg-indigo-500', accentText: 'text-indigo-500', secondary: 'text-indigo-700/60', hex: '#eef2ff', pattern: 'waves', category: 'Standard' },

    // Premium
    { id: 'vibe_wave', name: 'Vibe Wave', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#e67e22]', accentText: 'text-[#e67e22]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#24292e' },
    { id: 'vibe_wave_blue', name: 'Wave Ocean', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#2563eb]', accentText: 'text-[#2563eb]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#1e3a5f' },
    { id: 'vibe_wave_emerald', name: 'Wave Emerald', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#059669]', accentText: 'text-[#059669]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#064e3b' },
    { id: 'vibe_wave_purple', name: 'Wave Royal', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#7c3aed]', accentText: 'text-[#7c3aed]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#2e1065' },
    { id: 'vibe_wave_ruby', name: 'Wave Ruby', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#dc2626]', accentText: 'text-[#dc2626]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#7f1d1d' },
    { id: 'vibe_wave_teal', name: 'Wave Teal', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#0d9488]', accentText: 'text-[#0d9488]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#134e4a' },
    { id: 'vibe_wave_rose', name: 'Wave Ros├®', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#e11d48]', accentText: 'text-[#e11d48]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#4c0519' },
    { id: 'vibe_wave_midnight', name: 'Wave Midnight', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#06b6d4]', accentText: 'text-[#06b6d4]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#0f172a' },
    { id: 'vibe_wave_forest', name: 'Wave Forest', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#84cc16]', accentText: 'text-[#84cc16]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#14532d' },
    { id: 'vibe_wave_gold', name: 'Wave Gold', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#d4af37]', accentText: 'text-[#d4af37]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#000000' },
    { id: 'vibe_wave_slate', name: 'Wave Slate', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#64748b]', accentText: 'text-[#64748b]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#334155' },
    { id: 'vibe_wave_sunset', name: 'Wave Sunset', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#f97316]', accentText: 'text-[#f97316]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#4c1d95' },
    { id: 'vibe_wave_neon', name: 'Wave Neon', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#a3e635]', accentText: 'text-[#a3e635]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_wave', category: 'Premium', waveColor: '#0a0a0a' },
    { id: 'vibe_geometric', name: 'Vibe Geometric', bg: 'bg-[#1a1a1a]', text: 'text-white', accent: 'bg-[#e67e22]', accentText: 'text-[#e67e22]', secondary: 'text-slate-300', hex: '#1a1a1a', pattern: 'vibe_geo', category: 'Premium' },
    { id: 'vibe_elegant', name: 'Vibe Elegant', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-[#e67e22]', accentText: 'text-[#e67e22]', secondary: 'text-slate-500', hex: '#ffffff', pattern: 'vibe_elegant', category: 'Premium' },
    { id: 'premium_glass', name: 'Glass Frost', bg: 'bg-white/10', text: 'text-white', accent: 'bg-blue-400', accentText: 'text-[#60a5fa]', secondary: 'text-white/40', hex: '#1e293b', pattern: 'glass', category: 'Premium' },
    { id: 'premium_luxury', name: 'Golden Era', bg: 'bg-neutral-950', text: 'text-amber-100', accent: 'bg-amber-500', accentText: 'text-[#f59e0b]', secondary: 'text-amber-500/20', hex: '#0a0a0a', pattern: 'luxury', category: 'Premium' },

    // Ultimate (Elite)
    { id: 'elite_aurora', name: 'Aurora', bg: 'bg-[#050510]', text: 'text-white', accent: 'bg-cyan-500', accentText: 'text-[#22d3ee]', colors: ['#4facfe', '#00f2fe', '#89f7fe'], animate: true, hex: '#050510', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'elite_spatial', name: 'Spatial Pro', bg: 'bg-[#050510]', text: 'text-white', accent: 'bg-blue-500', accentText: 'text-[#3b82f6]', colors: ['#1e3a8a', '#3b82f6', '#0ea5e9'], animate: true, hex: '#050510', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'elite_cyber', name: 'Cyberpunk', bg: 'bg-black', text: 'text-white', accent: 'bg-fuchsia-500', accentText: 'text-[#d946ef]', colors: ['#c026d3', '#7c3aed', '#db2777'], animate: true, hex: '#000000', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'elite_mesh', name: 'Mesh Prism', bg: 'bg-black', text: 'text-white', accent: 'bg-fuchsia-600', accentText: 'text-[#d946ef]', colors: ['#d946ef', '#06b6d4', '#8b5cf6'], animate: true, hex: '#000000', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'elite_glass', name: 'Frosty Glass', bg: 'bg-slate-900', text: 'text-white', accent: 'bg-blue-500', accentText: 'text-[#3b82f6]', colors: ['#3b82f6', '#6366f1', '#a5b4fc'], animate: true, hex: '#000000', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'elite_royal', name: 'Elite Royal', bg: 'bg-[#1a0b0b]', text: 'text-amber-100', accent: 'bg-amber-600', accentText: 'text-[#d97706]', colors: ['#92400e', '#d97706', '#f59e0b'], animate: true, hex: '#1a0b0b', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'elite_nebula', name: 'Deep Nebula', bg: 'bg-black', text: 'text-white', accent: 'bg-purple-500', accentText: 'text-[#a855f7]', colors: ['#6b21a8', '#4c1d95', '#8b5cf6'], animate: true, hex: '#000000', pattern: 'elite_wave_layered', category: 'Ultimate' },

    // New 10 Modern Tech Templates
    { id: 'tech_cyber_pulse', name: 'Cyber Pulse', bg: 'bg-[#0a0a0f]', text: 'text-cyan-50', accent: 'bg-cyan-400', accentText: 'text-cyan-400', colors: ['#0891b2', '#06b6d4', '#0a0a0f'], animate: true, hex: '#0a0a0f', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'tech_hud_command', name: 'HUD Command', bg: 'bg-[#0c0c0c]', text: 'text-emerald-50', accent: 'bg-emerald-400', accentText: 'text-emerald-400', colors: ['#059669', '#10b981', '#064e3b'], animate: true, hex: '#0c0c0c', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'tech_circuitry', name: 'Neon Circuit', bg: 'bg-[#050505]', text: 'text-fuchsia-50', accent: 'bg-fuchsia-500', accentText: 'text-fuchsia-500', colors: ['#c026d3', '#a21caf', '#701a75'], animate: true, hex: '#050505', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'tech_abstract_flow', name: 'Modern Flow', bg: 'bg-[#0f172a]', text: 'text-white', accent: 'bg-blue-400', accentText: 'text-blue-400', colors: ['#1d4ed8', '#3b82f6', '#60a5fa'], animate: true, hex: '#0f172a', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'tech_quantum_grid', name: 'Quantum Grid', bg: 'bg-[#020617]', text: 'text-indigo-50', accent: 'bg-indigo-400', accentText: 'text-indigo-400', colors: ['#4338ca', '#6366f1', '#4f46e5'], animate: true, hex: '#020617', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'tech_holo_shard', name: 'Holo Shard', bg: 'bg-[#0f0f0f]', text: 'text-white', accent: 'bg-purple-400', accentText: 'text-purple-400', colors: ['#7c3aed', '#8b5cf6', '#c026d3'], animate: true, hex: '#0f0f0f', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'tech_prism_shift', name: 'Prism Shift', bg: 'bg-slate-950', text: 'text-white', accent: 'bg-rose-400', accentText: 'text-rose-400', colors: ['#e11d48', '#f43f5e', '#fb7185'], animate: true, hex: '#020617', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'tech_minimal_edge', name: 'Minimal Edge', bg: 'bg-black', text: 'text-white', accent: 'bg-white', accentText: 'text-white', colors: ['#ffffff', '#000000', '#333333'], animate: false, hex: '#000000', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'tech_data_rain', name: 'Data Rain', bg: 'bg-[#030712]', text: 'text-green-50', accent: 'bg-green-500', accentText: 'text-green-500', colors: ['#16a34a', '#22c55e', '#14532d'], animate: true, hex: '#030712', pattern: 'elite_wave_layered', category: 'Ultimate' },
    { id: 'tech_liquid_neon', name: 'Liquid Neon', bg: 'bg-slate-950', text: 'text-white', accent: 'bg-amber-400', accentText: 'text-amber-400', colors: ['#fbbf24', '#f59e0b', '#d97706'], animate: true, hex: '#020617', pattern: 'elite_wave_layered', category: 'Ultimate' },

    // Extraordinary (S─▒rad─▒┼ş─▒) - 3D & Advanced Effects
    { id: 'extra_3d_glass', name: '3D Crystal', bg: 'bg-slate-900', text: 'text-white', accent: 'bg-sky-400', accentText: 'text-sky-400', colors: ['#0ea5e9', '#6366f1', '#a855f7'], animate: true, hex: '#0f172a', pattern: 'extra_glass_3d', category: 'Extraordinary' },
    { id: 'extra_neon_portal', name: 'Neon Portal', bg: 'bg-black', text: 'text-white', accent: 'bg-rose-500', accentText: 'text-rose-500', colors: ['#f43f5e', '#8b5cf6', '#d946ef'], animate: true, hex: '#000000', pattern: 'extra_neon_3d', category: 'Extraordinary' },
    { id: 'extra_liquid_mercury', name: 'Mercury Flow', bg: 'bg-zinc-900', text: 'text-white', accent: 'bg-zinc-400', accentText: 'text-zinc-400', colors: ['#71717a', '#a1a1aa', '#f4f4f5'], animate: true, hex: '#18181b', pattern: 'extra_metal_3d', category: 'Extraordinary' },
    { id: 'extra_space_warp', name: 'Space Warp', bg: 'bg-[#020205]', text: 'text-indigo-50', accent: 'bg-indigo-500', accentText: 'text-indigo-500', colors: ['#4f46e5', '#312e81', '#000000'], animate: true, hex: '#020205', pattern: 'extra_space_3d', category: 'Extraordinary' },
    { id: 'extra_holo_mesh', name: 'Holo Web', bg: 'bg-[#050510]', text: 'text-cyan-50', accent: 'bg-cyan-400', accentText: 'text-cyan-400', colors: ['#22d3ee', '#8b5cf6', '#06b6d4'], animate: true, hex: '#050510', pattern: 'extra_holo_3d', category: 'Extraordinary' },
    { id: 'extra_magma_stone', name: 'Molten Magma', bg: 'bg-stone-950', text: 'text-orange-50', accent: 'bg-orange-600', accentText: 'text-orange-500', colors: ['#ea580c', '#9a3412', '#431407'], animate: true, hex: '#0c0a09', pattern: 'extra_magma', category: 'Extraordinary' },
    { id: 'extra_glitch_vibe', name: 'Cyber Glitch', bg: 'bg-[#050505]', text: 'text-white', accent: 'bg-fuchsia-500', accentText: 'text-fuchsia-400', colors: ['#ff00ff', '#00ffff', '#0000ff'], animate: true, hex: '#050505', pattern: 'extra_glitch', category: 'Extraordinary' },
    { id: 'extra_cosmic_void', name: 'Cosmic Void', bg: 'bg-black', text: 'text-white', accent: 'bg-white', accentText: 'text-white', colors: ['#ffffff', '#1e293b', '#000000'], animate: true, hex: '#000000', pattern: 'extra_void', category: 'Extraordinary' },
    { id: 'extra_pearl_iris', name: 'Pearl Iris', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-indigo-400', accentText: 'text-sky-500', colors: ['#f0f9ff', '#e0f2fe', '#fdf4ff'], animate: true, hex: '#ffffff', pattern: 'extra_pearl', category: 'Extraordinary' },
    { id: 'extra_toxic_bio', name: 'Bio Hazard', bg: 'bg-[#020617]', text: 'text-lime-50', accent: 'bg-lime-400', accentText: 'text-lime-400', colors: ['#84cc16', '#3f6212', '#1a2e05'], animate: true, hex: '#020617', pattern: 'extra_bio', category: 'Extraordinary' },
    { id: 'extra_plasma_flow', name: 'Plasma Flow', bg: 'bg-indigo-950', text: 'text-indigo-50', accent: 'bg-indigo-400', accentText: 'text-indigo-400', colors: ['#4f46e5', '#9333ea', '#db2777'], animate: true, hex: '#1e1b4b', pattern: 'extra_plasma', category: 'Extraordinary' },
    { id: 'extra_crystal_prism', name: 'Crystal Prism', bg: 'bg-slate-900', text: 'text-white', accent: 'bg-sky-400', accentText: 'text-sky-400', colors: ['#7dd3fc', '#f472b6', '#fbbf24'], animate: true, hex: '#0f172a', pattern: 'extra_crystal', category: 'Extraordinary' },
    { id: 'extra_matrix_digital', name: 'Matrix Digital', bg: 'bg-black', text: 'text-green-400', accent: 'bg-green-500', accentText: 'text-green-500', colors: ['#22c55e', '#166534', '#052e16'], animate: true, hex: '#000000', pattern: 'extra_matrix', category: 'Extraordinary' },
    { id: 'extra_abstract_origami', name: 'Origami Fold', bg: 'bg-slate-100', text: 'text-slate-900', accent: 'bg-primary', accentText: 'text-primary', colors: ['#ffffff', '#f1f5f9', '#e2e8f0'], animate: true, hex: '#f8fafc', pattern: 'extra_origami', category: 'Extraordinary' },
    
    // STUDIO / MODERN EXPERIMENTAL (Expanded)
    { id: 'studio_holo_prism', name: 'Holo Prism', bg: 'bg-slate-950', text: 'text-white', accent: 'bg-cyan-400', accentText: 'text-cyan-400', colors: ['#ff0080', '#7928ca', '#0070f3'], animate: true, hex: '#000000', pattern: 'studio_holo', category: 'Studio' },
    { id: 'studio_liquid_aura', name: 'Liquid Aura', bg: 'bg-black', text: 'text-white', accent: 'bg-rose-500', accentText: 'text-rose-500', colors: ['#ee0979', '#ff6a00', '#7a2828'], animate: true, hex: '#000000', pattern: 'studio_liquid', category: 'Studio' },
    { id: 'studio_glass_pro', name: 'Glass Pro', bg: 'bg-white/10', text: 'text-white', accent: 'bg-blue-400', accentText: 'text-blue-400', colors: ['#6366f1', '#a855f7', '#ec4899'], animate: true, hex: '#0f172a', pattern: 'studio_glass', category: 'Studio' },
    { id: 'studio_minimal_zinc', name: 'Modern Zinc', bg: 'bg-zinc-950', text: 'text-zinc-100', accent: 'bg-white', accentText: 'text-white', colors: ['#18181b', '#27272a', '#3f3f46'], animate: false, hex: '#09090b', pattern: 'dots', category: 'Studio' },
    { id: 'studio_neon_sky', name: 'Neon Sky', bg: 'bg-[#000022]', text: 'text-white', accent: 'bg-sky-400', accentText: 'text-sky-400', colors: ['#00d2ff', '#3a7bd5'], animate: true, hex: '#000022', pattern: 'studio_holo', category: 'Studio' },
    { id: 'studio_sunset_vibe', name: 'Sunset Vibe', bg: 'bg-[#1a0f00]', text: 'text-white', accent: 'bg-orange-500', accentText: 'text-orange-500', colors: ['#f83600', '#fe8c00'], animate: true, hex: '#1a0f00', pattern: 'studio_liquid', category: 'Studio' },
    { id: 'studio_midnight_forest', name: 'Midnight Forest', bg: 'bg-[#001a1a]', text: 'text-white', accent: 'bg-emerald-400', accentText: 'text-emerald-400', colors: ['#134e4a', '#065f46'], animate: true, hex: '#001a1a', pattern: 'studio_glass', category: 'Studio' },
    { id: 'studio_royal_gold', name: 'Royal Gold', bg: 'bg-black', text: 'text-amber-100', accent: 'bg-amber-500', accentText: 'text-amber-500', colors: ['#92400e', '#78350f'], animate: false, hex: '#000000', pattern: 'dots', category: 'Studio' },
    { id: 'studio_deep_ocean', name: 'Deep Ocean', bg: 'bg-[#000033]', text: 'text-white', accent: 'bg-blue-400', accentText: 'text-blue-400', colors: ['#1e3a8a', '#1e40af'], animate: true, hex: '#000033', pattern: 'studio_liquid', category: 'Studio' },
    { id: 'studio_pink_candy', name: 'Pink Candy', bg: 'bg-[#1a001a]', text: 'text-white', accent: 'bg-pink-400', accentText: 'text-pink-400', colors: ['#db2777', '#be185d'], animate: true, hex: '#1a001a', pattern: 'studio_holo', category: 'Studio' },
    { id: 'studio_cyber_lime', name: 'Cyber Lime', bg: 'bg-black', text: 'text-white', accent: 'bg-lime-400', accentText: 'text-lime-400', colors: ['#84cc16', '#3f6212'], animate: true, hex: '#000000', pattern: 'studio_liquid', category: 'Studio' },
    { id: 'studio_ghost_white', name: 'Ghost White', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-slate-800', accentText: 'text-slate-800', colors: ['#f8fafc', '#f1f5f9'], animate: false, hex: '#ffffff', pattern: 'grid', category: 'Studio' },
    { id: 'studio_aurora_borealis', name: 'Aurora Sky', bg: 'bg-[#0f172a]', text: 'text-white', accent: 'bg-cyan-300', accentText: 'text-cyan-300', colors: ['#00c9ff', '#92fe9d'], animate: true, hex: '#0f172a', pattern: 'studio_holo', category: 'Studio' },
    { id: 'studio_lavender_mist', name: 'Lavender Mist', bg: 'bg-[#1e1b4b]', text: 'text-white', accent: 'bg-purple-300', accentText: 'text-purple-300', colors: ['#a78bfa', '#c4b5fd'], animate: true, hex: '#1e1b4b', pattern: 'studio_liquid', category: 'Studio' },
    { id: 'studio_carbon_fiber', name: 'Carbon Stealth', bg: 'bg-black', text: 'text-neutral-100', accent: 'bg-neutral-400', accentText: 'text-neutral-400', colors: ['#262626', '#171717'], animate: false, hex: '#000000', pattern: 'grid', category: 'Studio' },
    { id: 'studio_neon_sunset', name: 'Neon Horizon', bg: 'bg-[#2e1065]', text: 'text-white', accent: 'bg-orange-400', accentText: 'text-orange-400', colors: ['#f43f5e', '#fb923c'], animate: true, hex: '#2e1065', pattern: 'studio_holo', category: 'Studio' },
    { id: 'studio_mint_fresh', name: 'Mint Fresh', bg: 'bg-[#064e3b]', text: 'text-white', accent: 'bg-teal-300', accentText: 'text-teal-300', colors: ['#2dd4bf', '#5eead4'], animate: true, hex: '#064e3b', pattern: 'studio_liquid', category: 'Studio' },
    { id: 'studio_silver_chrome', name: 'Silver Chrome', bg: 'bg-zinc-900', text: 'text-white', accent: 'bg-zinc-300', accentText: 'text-zinc-300', colors: ['#d4d4d8', '#71717a'], animate: false, hex: '#18181b', pattern: 'studio_glass', category: 'Studio' },
    { id: 'studio_deep_blood', name: 'Crimson Night', bg: 'bg-[#2d0000]', text: 'text-white', accent: 'bg-red-500', accentText: 'text-red-500', colors: ['#991b1b', '#450a0a'], animate: true, hex: '#2d0000', pattern: 'studio_holo', category: 'Studio' },
    { id: 'studio_arctic_ice', name: 'Arctic Ice', bg: 'bg-[#f0f9ff]', text: 'text-sky-950', accent: 'bg-sky-500', accentText: 'text-sky-600', colors: ['#e0f2fe', '#bae6fd'], animate: false, hex: '#f0f9ff', pattern: 'grid', category: 'Studio' },
    { id: 'studio_obsidian_gold', name: 'Elite Obsidian', bg: 'bg-black', text: 'text-amber-100', accent: 'bg-amber-600', accentText: 'text-amber-500', colors: ['#000', '#1a1a1a'], animate: false, hex: '#000000', pattern: 'luxury', category: 'Studio' },
    { id: 'studio_electric_violet', name: 'Violet Blaze', bg: 'bg-[#1e1b4b]', text: 'text-white', accent: 'bg-violet-400', accentText: 'text-violet-400', colors: ['#7c3aed', '#4c1d95'], animate: true, hex: '#1e1b4b', pattern: 'studio_holo', category: 'Studio' },
]

export default function BusinessCardGenerator({ user, profileData, mode = 'full', selectedTemplateId, orientation = 'portrait', onSelect, onOrientationChange }: BusinessCardGeneratorProps) {
    const { t } = useTranslation()
    const cardRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(500)
    const [internalSelectedTplId, setInternalSelectedTplId] = useState(selectedTemplateId || TEMPLATES[0].id)
    const [qrDataUrl, setQrDataUrl] = useState<string>('')
    const [activeTab, setActiveTab] = useState<'Standard' | 'Premium' | 'Ultimate' | 'Extraordinary' | 'Studio'>('Studio')

    // Customization States
    const [customBg, setCustomBg] = useState<string | null>(null)
    const [customAccent, setCustomAccent] = useState<string | null>(null)
    const [customFont, setCustomFont] = useState<'sans' | 'mono' | 'serif' | 'display'>('sans')
    const [customPattern, setCustomPattern] = useState<string | null>(null)
    const [glassIntensity, setGlassIntensity] = useState(10)

    useEffect(() => {
        if (selectedTemplateId) {
            setInternalSelectedTplId(selectedTemplateId)
            const tpl = TEMPLATES.find(t => t.id === selectedTemplateId)
            if (tpl && tpl.category) setActiveTab(tpl.category as any)
        }
    }, [selectedTemplateId])

    useEffect(() => {
        const obs = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setContainerWidth(entry.contentRect.width)
            }
        })
        if (containerRef.current) obs.observe(containerRef.current)
        return () => obs.disconnect()
    }, [])

    const tp = TEMPLATES.find(t => t.id === internalSelectedTplId) || TEMPLATES[0]
    const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/${user.username}` : ''

    useEffect(() => {
        const generateQr = async () => {
            try {
                const url = await QRCode.toDataURL(profileUrl, {
                    width: 512,
                    margin: 2,
                    color: { dark: '#000000', light: '#ffffff' }
                })
                setQrDataUrl(url)
            } catch (err) {
                console.error('QR Generate Error:', err)
            }
        }
        generateQr()
    }, [profileUrl])

    // ALWAYS portrait: 340x600
    const cardWidth = 340
    const cardHeight = 600
    const cardScale = mode === 'modal' ? 1 : Math.min(1, containerWidth / (cardWidth + 20))

    const [isDownloading, setIsDownloading] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [downloadSuccess, setDownloadSuccess] = useState(false)
    const [shareSuccess, setShareSuccess] = useState(false)

    const handleDownload = async () => {
        if (!cardRef.current || isDownloading) return
        setIsDownloading(true)
        try {
            await new Promise(r => setTimeout(r, 800))
            const dataUrl = await htmlToImage.toJpeg(cardRef.current, {
                quality: 0.98,
                pixelRatio: 3,
                backgroundColor: tp.hex,
                cacheBust: true,
            })
            const link = document.createElement('a')
            link.href = dataUrl
            link.download = `kardly-${user.username}.jpg`
            link.click()
            setDownloadSuccess(true)
            setTimeout(() => setDownloadSuccess(false), 3000)
        } catch (error) {
            console.error('Download error:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    const handleShare = async () => {
        if (!cardRef.current || isSharing) return
        setIsSharing(true)
        try {
            // Generate PNG for better transparency support and compatibility
            const dataUrl = await htmlToImage.toPng(cardRef.current, {
                pixelRatio: 2,
                backgroundColor: tp.hex,
                cacheBust: true,
            })

            // Convert dataUrl to File object manually (safer than fetch for base64)
            const [header, base64Data] = dataUrl.split(',')
            const mime = header.match(/:(.*?);/)?.[1] || 'image/png'
            const binary = atob(base64Data)
            const array = new Uint8Array(binary.length)
            for (let i = 0; i < binary.length; i++) {
                array[i] = binary.charCodeAt(i)
            }
            const blob = new Blob([array], { type: mime })
            const file = new File([blob], `kardly-card.png`, { type: mime })

            // Check if file sharing is supported
            const shareData = {
                files: [file],
                title: user.name,
                text: `${user.name} - Kardly Dijital Kartvizit`,
            }

            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData)
            } else if (navigator.share) {
                // Fallback to link sharing if file sharing is not supported
                await navigator.share({
                    title: user.name,
                    text: `${user.name} - Kardly Dijital Kartvizit`,
                    url: profileUrl
                })
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(profileUrl)
                setShareSuccess(true)
                setTimeout(() => setShareSuccess(false), 2000)
            }
        } catch (error) {
            console.error('Sharing failed', error)
            // Final fallback to link sharing on error
            if (navigator.share) {
                try { await navigator.share({ title: user.name, url: profileUrl }) } catch(e) {}
            }
        } finally {
            setIsSharing(false)
        }
    }

    const locationData = (profileData?.socialLinks as any[])?.find((l: any) => l.platform?.toLowerCase() === 'location')?.url || profileData?.location || ""
    const whatsappData = (profileData?.socialLinks as any[])?.find((l: any) => l.platform?.toLowerCase() === 'whatsapp')?.url || ""

    /* ÔöÇÔöÇÔöÇ CARD CONTENT (always portrait / vertical) ÔöÇÔöÇÔöÇ */
    const CardContent = (
        <div
            ref={cardRef}
            data-card-actual
            className={cn(
                "flex flex-col overflow-hidden relative shadow-2xl transition-all duration-500",
                tp.bg,
                "rounded-[2.5rem]",
                customFont === 'mono' ? 'font-mono' : customFont === 'serif' ? 'font-serif italic' : 'font-sans'
            )}
            style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                backgroundColor: customBg || tp.hex,
                border: (customBg || tp.hex) === '#ffffff' ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.1)'
            }}
        >
            {/* Background Graphics */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {tp.pattern === 'dots' && (
                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `radial-gradient(${tp.hex === '#ffffff' ? '#94a3b8' : '#fff'} 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
                )}
                {tp.pattern === 'grid' && (
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(${tp.hex === '#ffffff' ? '#94a3b8' : '#fff'} 1px, transparent 1px), linear-gradient(90deg, ${tp.hex === '#ffffff' ? '#94a3b8' : '#fff'} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                )}
                {tp.pattern === 'lines' && (
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 40px)` }} />
                )}
                {tp.pattern === 'waves' && (
                    <svg className="absolute bottom-0 left-0 w-full opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill={tp.hex === '#ffffff' ? '#6366f1' : '#fff'} d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,138.7C960,160,1056,224,1152,240C1248,256,1344,224,1392,208L1440,192L1440,320L0,320Z"></path></svg>
                )}
                {tp.pattern === 'luxury' && (
                    <>
                        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full" />
                    </>
                )}
                {tp.pattern === 'elite_wave_layered' && (
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Layer 1: Base Liquid Flow (Animated) */}
                        <svg className="absolute -left-[30%] top-[-20%] w-[160%] h-[140%] opacity-40 blur-[50px] animate-elite-bg" style={{ animationDuration: '25s' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id={`gradBase-${tp.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={tp.colors?.[0] || tp.hex} stopOpacity="0.8" />
                                    <stop offset="100%" stopColor={tp.colors?.[1] || tp.hex} stopOpacity="0.2" />
                                </linearGradient>
                            </defs>
                            <circle cx="20" cy="20" r="60" fill={`url(#gradBase-${tp.id})`} />
                        </svg>

                        {/* Layer 2: Major Bold Wave ( matches the large gold waves in 2nd image) */}
                        <svg className="absolute -left-[50%] top-0 w-[130%] h-full drop-shadow-[25px_0_50px_rgba(0,0,0,0.7)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id={`gradMain-${tp.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={tp.colors?.[0] || tp.hex} />
                                    <stop offset="100%" stopColor={tp.colors?.[1] || tp.colors?.[0] || tp.hex} />
                                </linearGradient>
                            </defs>
                            <path d="M0,0 C70,15 70,85 0,100 L100,100 L100,0 Z" fill={`url(#gradMain-${tp.id})`} />
                        </svg>

                        {/* Layer 3: Secondary Accent Wave with Texture (matches the dotted gold layer) */}
                        <svg className="absolute -left-[40%] top-0 w-[110%] h-full opacity-50 drop-shadow-[5px_0_15px_rgba(0,0,0,0.4)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id={`waveDots-${tp.id}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <circle cx="1.5" cy="1.5" r="0.7" fill="#fff" fillOpacity="0.3" />
                                </pattern>
                            </defs>
                            <path d="M0,0 C60,25 60,75 0,100 L25,100 C80,75 80,25 25,0 Z" fill={tp.colors?.[2] || tp.colors?.[1] || tp.hex} />
                            <path d="M0,0 C60,25 60,75 0,100 L25,100 C80,75 80,25 25,0 Z" fill={`url(#waveDots-${tp.id})`} />
                        </svg>

                        {/* Layer 4: Floating Accent Glow */}
                        <div className="absolute top-1/2 left-[-10%] w-40 h-40 rounded-full blur-[80px] opacity-30 animate-pulse" style={{ backgroundColor: tp.colors?.[0] || tp.hex }} />

                        {/* Subtle noise/grain overlay */}
                        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    </div>
                )}
                {tp.pattern === 'nebula' && (
                    <>
                        <div className="absolute top-[-20%] right-[-20%] w-full h-full bg-purple-600/20 blur-[130px] rounded-full animate-pulse" />
                        <div className="absolute bottom-[-20%] left-[-20%] w-full h-full bg-indigo-600/20 blur-[130px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-indigo-900/20 animate-elite-bg" />
                    </>
                )}
                {tp.pattern === 'elite_spatial' && (
                    <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15)_0%,transparent_70%)] animate-elite-bg" />
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-blue-500/5 blur-[100px] rounded-full" />
                    </>
                )}
                {tp.pattern === 'elite_cyber' && (
                    <>
                        <div className="absolute inset-0 bg-[#0a0a0a]" />
                        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'linear-gradient(#f0f 1px, transparent 1px), linear-gradient(90deg, #f0f 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(192,38,211,0.2)_0%,transparent_70%)] animate-elite-bg" />
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-fuchsia-500/50 shadow-[0_0_20px_#f0f]" />
                    </>
                )}
                {tp.pattern === 'elite_royal' && (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b0b] to-[#0a0a0a]" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
                        <div className="absolute top-[-10%] right-[-10%] w-60 h-60 bg-amber-500/10 blur-[80px] rounded-full animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-amber-900/20 to-transparent" />
                    </>
                )}
                {tp.pattern === 'aurora' && (
                    <>
                        <div className="absolute inset-0 bg-[#050510]" />
                        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[80%] opacity-40 blur-[100px] animate-elite-bg" style={{ background: 'radial-gradient(circle at 30% 30%, #4facfe 0%, transparent 50%), radial-gradient(circle at 70% 60%, #00f2fe 0%, transparent 50%)' }} />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-indigo-500/10 blur-[80px] rounded-full" />
                    </>
                )}
                {tp.pattern === 'mesh' && (
                    <div className="absolute inset-0 opacity-[0.2] blur-[70px] animate-elite-bg" style={{ background: 'radial-gradient(circle at 20% 20%, #f0f 0%, transparent 50%), radial-gradient(circle at 80% 80%, #0ff 0%, transparent 50%), radial-gradient(circle at 50% 50%, #8b5cf6 0%, transparent 60%)' }} />
                )}
                {tp.pattern === 'frosty' && (
                    <>
                        <div className="absolute inset-0 bg-slate-950" />
                        <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-blue-500/20 blur-[110px] rounded-full" />
                        <div className="absolute bottom-[20%] left-[-10%] w-80 h-80 bg-indigo-600/15 blur-[130px] rounded-full" />
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    </>
                )}
                {tp.pattern === 'glass' && (
                    <>
                        <div className="absolute inset-0 bg-[#1e293b]" />
                        <div className="absolute top-[-50px] right-[-50px] w-[250px] h-[250px] bg-blue-500/20 blur-[90px] rounded-full" />
                        <div className="absolute bottom-[-50px] left-[-50px] w-[250px] h-[250px] bg-indigo-500/15 blur-[90px] rounded-full" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/5" />
                    </>
                )}

                {tp.pattern === 'vibe_wave' && (
                    <>
                        <div className="absolute top-0 left-0 w-full h-[40%]" style={{ backgroundColor: (tp as any).waveColor || '#24292e' }} />
                        <svg className="absolute top-[35%] left-0 w-full h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <path fill={(tp as any).waveColor || '#24292e'} d="M0,160L80,181.3C160,203,320,245,480,245.3C640,245,800,203,960,176C1120,149,1280,139,1360,133.3L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
                        </svg>
                    </>
                )}
                {tp.pattern === 'vibe_geo' && (
                    <>
                        <div className="absolute inset-0 bg-[#0a0a0a]" />
                        <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#e67e22]/15 rounded-full blur-[60px]" />
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#e67e22]/10 rounded-full blur-[60px]" />
                    </>
                )}
                {tp.pattern === 'vibe_elegant' && (
                    <>
                        <div className="absolute top-0 left-0 w-full h-6 bg-[#e67e22]" />
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-[#e67e22]" />
                    </>
                )}
                {tp.pattern === 'cyber_pulse' && (
                    <>
                        <div className="absolute inset-0 bg-[#0a0a0f]" />
                        <div className="absolute inset-0 opacity-20 animate-elite-bg" style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        <div className="absolute inset-0 border-[3px] border-cyan-500/30 rounded-[2.5rem]" />
                        <div className="absolute inset-0 border border-cyan-400/10 rounded-[2.5rem] animate-pulse" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.2)_0%,transparent_70%)] animate-pulse" />
                    </>
                )}
                {tp.pattern === 'hud_command' && (
                    <>
                        <div className="absolute inset-0 bg-[#0c0c0c]" />
                        <div className="absolute top-0 left-0 w-full h-full border-[10px] border-emerald-500/5 rounded-[2.5rem]" />
                        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-emerald-500/40 animate-pulse" />
                        <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-emerald-500/40 animate-pulse" />
                        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-emerald-500/40 animate-pulse" />
                        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-emerald-500/40 animate-pulse" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(52,211,153,0.15)_0%,transparent_60%)] animate-elite-bg" />
                    </>
                )}
                {tp.pattern === 'circuitry' && (
                    <>
                        <div className="absolute inset-0 bg-[#050505]" />
                        <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 100h100v100h100v-100h100M50 200v100h150v-50h100" stroke="#f0f" strokeWidth="2" fill="none" className="animate-pulse" />
                            <circle cx="100" cy="100" r="3" fill="#f0f" className="animate-ping" style={{ animationDuration: '3s' }} />
                            <circle cx="200" cy="200" r="3" fill="#f0f" className="animate-ping" style={{ animationDuration: '4s' }} />
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-900/20 via-transparent to-transparent animate-elite-bg" />
                    </>
                )}
                {tp.pattern === 'abstract_flow' && (
                    <>
                        <div className="absolute inset-0 bg-[#0f172a]" />
                        <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-blue-600/20 rounded-full blur-[100px] animate-elite-bg" />
                        <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-indigo-600/20 rounded-full blur-[100px] animate-elite-bg" style={{ animationDelay: '2s' }} />
                    </>
                )}
                {tp.pattern === 'quantum_grid' && (
                    <>
                        <div className="absolute inset-0 bg-[#020617]" />
                        <div className="absolute inset-0 opacity-[0.1] animate-elite-bg" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        <div className="absolute top-0 left-0 w-full h-full shadow-[inset_0_0_100px_rgba(99,102,241,0.2)]" />
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-indigo-500/30 animate-pulse" />
                    </>
                )}
                {tp.pattern === 'holo_shard' && (
                    <>
                        <div className="absolute inset-0 bg-[#0f0f0f]" />
                        <div className="absolute top-[10%] left-[10%] w-40 h-40 bg-purple-500/15 rotate-45 skew-x-12 blur-[40px] animate-elite-bg" />
                        <div className="absolute bottom-[20%] right-[10%] w-32 h-32 bg-blue-500/15 -rotate-12 skew-y-12 blur-[40px] animate-elite-bg" style={{ animationDelay: '3s' }} />
                    </>
                )}
                {tp.pattern === 'prism_shift' && (
                    <>
                        <div className="absolute inset-0 bg-slate-950" />
                        <div className="absolute inset-0 opacity-15 animate-elite-bg" style={{ background: 'linear-gradient(135deg, #f43f5e 0%, transparent 40%), linear-gradient(225deg, #3b82f6 0%, transparent 40%)' }} />
                        <div className="absolute top-0 left-0 w-full h-full border-[1px] border-white/10 rounded-[2.5rem]" />
                    </>
                )}
                {tp.pattern === 'minimal_edge' && (
                    <>
                        <div className="absolute inset-0 bg-black" />
                        <div className="absolute inset-2 border-[1px] border-white/20 rounded-[2rem]" />
                        <div className="absolute top-4 left-4 right-4 h-[1px] bg-white/10 animate-pulse" />
                    </>
                )}
                {tp.pattern === 'data_rain' && (
                    <>
                        <div className="absolute inset-0 bg-[#030712]" />
                        <div className="absolute top-0 left-10 w-[2px] h-20 bg-gradient-to-b from-transparent via-green-500 to-transparent opacity-40 animate-bounce" style={{ animationDuration: '3s' }} />
                        <div className="absolute top-40 right-20 w-[2px] h-32 bg-gradient-to-b from-transparent via-green-500 to-transparent opacity-40 animate-bounce" style={{ animationDuration: '5s' }} />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.1)_0%,transparent_70%)] animate-pulse" />
                    </>
                )}
                {tp.pattern === 'liquid_neon' && (
                    <>
                        <div className="absolute inset-0 bg-slate-950" />
                        <div className="absolute -top-[10%] -left-[10%] w-[120%] h-[40%] bg-amber-500/15 blur-[60px] rounded-full rotate-6 animate-elite-bg" />
                        <div className="absolute top-[30%] -right-[10%] w-60 h-60 bg-blue-500/15 blur-[80px] rounded-full animate-elite-bg" style={{ animationDelay: '4s' }} />
                    </>
                )}

                {/* Extraordinary Patterns (3D & Visual Effects) */}
                {tp.pattern === 'extra_glass_3d' && (
                    <>
                        <div className="absolute inset-0 bg-slate-950" />
                        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-20 blur-[100px] animate-pulse" style={{ background: `radial-gradient(circle, ${tp.colors?.[0]} 0%, transparent 70%)` }} />
                        
                        {/* 3D Embossed Layer 1 */}
                        <svg className="absolute -left-[20%] top-0 w-full h-full opacity-30 drop-shadow-[20px_0_40px_rgba(0,0,0,0.8)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,0 C80,20 80,80 0,100 L100,100 L100,0 Z" fill={tp.colors?.[0] || tp.accent} />
                        </svg>

                        {/* 3D Embossed Layer 2 */}
                        <svg className="absolute -left-[10%] top-0 w-full h-full opacity-20 drop-shadow-[10px_0_20px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,0 C60,30 60,70 0,100 L50,100 C80,70 80,30 50,0 Z" fill={tp.colors?.[1] || "#fff"} />
                        </svg>

                        <div className="absolute top-[20%] right-[10%] w-40 h-40 bg-indigo-500/20 blur-[60px] rounded-full animate-floating" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sky-500/10 to-transparent" />
                    </>
                )}

                {tp.pattern === 'extra_neon_3d' && (
                    <>
                        <div className="absolute inset-0 bg-black" />
                        
                        {/* Perspective Emboss Layer */}
                        <svg className="absolute right-0 top-0 h-full w-1/2 opacity-20 drop-shadow-[-25px_0_50px_rgba(244,63,94,0.6)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M100,0 L20,0 C50,50 50,50 20,100 L100,100 Z" fill={tp.colors?.[0] || "#f43f5e"} />
                        </svg>

                        <div className="absolute inset-0 opacity-40 animate-elite-bg" style={{ backgroundImage: 'linear-gradient(rgba(244,63,94,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,94,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) translateY(-50%)' }} />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-rose-500/20" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-rose-500/20 blur-[80px] rounded-full animate-pulse" />
                    </>
                )}

                {tp.pattern === 'extra_metal_3d' && (
                    <>
                        <div className="absolute inset-0 bg-zinc-900" />
                        
                        {/* Chiseled Edge Emboss */}
                        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)' }} />
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/10" />
                        
                        <div className="absolute inset-0 opacity-[0.15] animate-elite-bg" style={{ background: 'radial-gradient(circle at 20% 30%, #fff 0%, transparent 60%), radial-gradient(circle at 80% 70%, #555 0%, transparent 60%)' }} />
                        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-white/10 via-transparent to-black/30 pointer-events-none shadow-[25px_0_50px_rgba(0,0,0,0.7)]" />
                        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
                    </>
                )}

                {tp.pattern === 'extra_space_3d' && (
                    <>
                        <div className="absolute inset-0 bg-[#020205]" />
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_30px_rgba(79,70,229,0.5)] rotate-[-15deg]" />
                        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full animate-pulse" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full animate-floating" />
                    </>
                )}

                {tp.pattern === 'extra_holo_3d' && (
                    <>
                        <div className="absolute inset-0 bg-[#050510]" />
                        <div className="absolute inset-0 opacity-30 animate-elite-bg" style={{ background: 'conic-gradient(from 180deg at 50% 50%, #22d3ee 0%, #8b5cf6 25%, #d946ef 50%, #22d3ee 75%, #22d3ee 100%)', filter: 'blur(60px)' }} />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,16,0.8)_100%)]" />
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                    </>
                )}

                {tp.pattern === 'extra_magma' && (
                    <>
                        <div className="absolute inset-0 bg-stone-950" />
                        
                        {/* Embossed Magma Layer */}
                        <svg className="absolute left-0 top-0 w-full h-full opacity-50 drop-shadow-[0_0_20px_rgba(234,88,12,0.4)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,20 Q40,50 0,80 L0,100 L100,100 L100,0 L0,0 Z" fill="#1c1917" />
                        </svg>

                        <div className="absolute top-0 left-0 w-full h-full opacity-30 animate-pulse" style={{ background: 'radial-gradient(circle at 30% 20%, #ea580c 0%, transparent 60%), radial-gradient(circle at 70% 80%, #9a3412 0%, transparent 60%)', filter: 'blur(40px)' }} />
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                            <filter id="lava-crack">
                                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" seed="5" />
                                <feDisplacementMap in="SourceGraphic" scale="10" />
                            </filter>
                            <rect width="100" height="100" filter="url(#lava-crack)" fill="none" stroke="#f97316" strokeWidth="0.5" />
                        </svg>
                    </>
                )}

                {tp.pattern === 'extra_glitch' && (
                    <>
                        <div className="absolute inset-0 bg-black" />
                        <div className="absolute inset-0 opacity-15 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500 animate-glitch-line" />
                            <div className="absolute top-1/4 left-0 w-full h-[1px] bg-rose-500 animate-glitch-line" style={{ animationDelay: '1s' }} />
                            <div className="absolute top-2/3 left-0 w-full h-[3px] bg-purple-500 animate-glitch-line" style={{ animationDelay: '2s' }} />
                        </div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-[0.4] mix-blend-overlay" />
                        <div className="absolute -left-[10%] top-[-10%] w-[120%] h-[40%] bg-fuchsia-600/10 blur-[100px] animate-pulse" />
                    </>
                )}

                {tp.pattern === 'extra_void' && (
                    <>
                        <div className="absolute inset-0 bg-black" />
                        
                        {/* Deep Void Emboss */}
                        <svg className="absolute inset-0 w-full h-full opacity-40 drop-shadow-[inset_0_0_50px_rgba(255,255,255,0.2)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
                        </svg>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/5 rounded-full animate-rotate-slow" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 blur-3xl rounded-full animate-floating" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,1)_85%)]" />
                    </>
                )}

                {tp.pattern === 'extra_pearl' && (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-pink-50" />
                        
                        {/* Iridescent Emboss Layers */}
                        <svg className="absolute -left-1/2 top-[-10%] w-[150%] h-[120%] opacity-15 drop-shadow-[20px_20px_40px_rgba(0,0,0,0.1)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,0 C100,10 100,90 0,100 Z" fill="rgba(255,255,255,0.8)" />
                        </svg>

                        <div className="absolute inset-0 opacity-40 animate-elite-bg" style={{ background: 'linear-gradient(45deg, rgba(255,0,255,0.08) 0%, rgba(0,255,255,0.08) 50%, rgba(255,255,0,0.08) 100%)' }} />
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-rotate-slow opacity-25" style={{ backgroundImage: 'conic-gradient(from 0deg at 50% 50%, transparent, rgba(255,255,255,1), transparent)' }} />
                        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(255,255,255,1)]" />
                    </>
                )}

                {tp.pattern === 'extra_bio' && (
                    <>
                        <div className="absolute inset-0 bg-[#020617]" />
                        <div className="absolute inset-0 opacity-20 animate-pulse" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #84cc16 0.5px, transparent 0px)', backgroundSize: '15px 15px' }} />
                        
                        {/* Bio Emboss Membrane */}
                        <div className="absolute inset-8 border border-lime-400/20 rounded-full shadow-[0_0_50px_rgba(132,204,22,0.1),inset_0_0_50px_rgba(132,204,22,0.1)] animate-floating" />
                        
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(132,204,22,0.1)_0%,transparent_70%)]" />
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />
                    </>
                )}

                {tp.pattern === 'extra_plasma' && (
                    <>
                        <div className="absolute inset-0 bg-indigo-950" />
                        
                        {/* Plasma Cavities (Embossed) */}
                        <svg className="absolute -right-1/4 top-0 h-full w-full opacity-30 drop-shadow-[-30px_0_60px_rgba(0,0,0,0.7)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M100,0 C20,30 20,70 100,100 Z" fill={tp.colors?.[1] || "#9333ea"} />
                        </svg>

                        <div className="absolute inset-0 opacity-40 blur-[60px] animate-elite-bg" style={{ background: `radial-gradient(circle at 20% 30%, ${tp.colors?.[0]} 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${tp.colors?.[1]} 0%, transparent 50%), radial-gradient(circle at 50% 50%, ${tp.colors?.[2]} 0%, transparent 50%)` }} />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.15]" />
                    </>
                )}

                {tp.pattern === 'extra_crystal' && (
                    <>
                        <div className="absolute inset-0 bg-slate-950" />
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(45deg, #fff 1px, transparent 1px), linear-gradient(-45deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        
                        {/* Embossed Crystal Layers */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-white/10 rounded-full animate-rotate-slow shadow-[0_0_40px_rgba(255,255,255,0.05)]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-white/5 rounded-full animate-rotate-slow" style={{ animationDirection: 'reverse' }} />
                        
                        <div className="absolute top-[15%] left-[15%] w-32 h-32 bg-sky-500/15 rotate-45 animate-floating blur-2xl" />
                        <div className="absolute bottom-[15%] right-[15%] w-32 h-32 bg-rose-500/15 -rotate-12 animate-floating blur-2xl" style={{ animationDelay: '2s' }} />
                    </>
                )}

                {tp.pattern === 'extra_matrix' && (
                    <>
                        <div className="absolute inset-0 bg-black" />
                        
                        {/* Digital Emboss Frames */}
                        <div className="absolute inset-4 border border-green-500/10 rounded-2xl shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]" />
                        
                        <div className="absolute inset-0 opacity-20 overflow-hidden">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-green-500 to-transparent animate-matrix-rain" style={{ left: `${i * 8.5}%`, animationDelay: `${Math.random() * 4}s`, animationDuration: `${2.5 + Math.random() * 3.5}s` }} />
                            ))}
                        </div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
                    </>
                )}

                {tp.pattern === 'extra_origami' && (
                    <>
                        <div className="absolute inset-0 bg-slate-50" />
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(30deg, #000 1px, transparent 1px), linear-gradient(150deg, #000 1px, transparent 1px), linear-gradient(270deg, #000 1px, transparent 1px)', backgroundSize: '60px 52px' }} />
                        
                        {/* 3D Folded Emboss Layers */}
                        <div className="absolute top-0 right-0 w-2/3 h-full bg-white shadow-[-30px_0_60px_rgba(0,0,0,0.05)] rotate-[-8deg] origin-top-right border-l border-black/[0.02]" />
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-slate-100/40 shadow-[0_-30px_60px_rgba(0,0,0,0.05)] rotate-[3deg] origin-bottom-left border-t border-black/[0.02]" />
                    </>
                )}
                {/* Studio Patterns */}
                {tp.pattern === 'studio_holo' && (
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-cyan-500 opacity-20 animate-elite-bg" />
                        <div className="absolute -inset-[100%] opacity-30 animate-rotate-slow" style={{ background: 'conic-gradient(from 0deg at 50% 50%, transparent, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.1), transparent)' }} />
                        <div className="absolute inset-0 backdrop-blur-[2px]" />
                    </div>
                )}
                {tp.pattern === 'studio_liquid' && (
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-gradient-to-br from-rose-600/30 via-orange-600/20 to-transparent blur-[80px] animate-elite-bg" />
                        <div className="absolute top-[30%] left-[10%] w-60 h-60 bg-primary/20 rounded-full blur-[100px] animate-floating" />
                        <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-rose-500/10 rounded-full blur-[120px] animate-floating" style={{ animationDelay: '2s' }} />
                    </div>
                )}
                {tp.pattern === 'studio_glass' && (
                    <div className="absolute inset-0">
                        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[50%] bg-gradient-to-br from-white/10 to-transparent border-b border-white/5 backdrop-blur-xl" />
                        <div className="absolute bottom-0 left-0 w-full h-[50%] bg-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10" />
                    </div>
                )}
                {/* Custom pattern overlay if set */}
                {customPattern === 'dots' && (
                    <div className="absolute inset-0 opacity-[0.35] z-0" style={{ backgroundImage: `radial-gradient(${customAccent ? 'currentColor' : 'rgba(255,255,255,0.4)'} 1.5px, transparent 1.5px)`, backgroundSize: '16px 16px' }} />
                )}
                {customPattern === 'grid' && (
                    <div className="absolute inset-0 opacity-[0.25] z-0" style={{ backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                )}
            </div>

            {/* Card Inner Content (Portrait) */}
            <div className="flex-1 p-6 flex flex-col relative z-20 items-center text-center justify-between">
                {/* QR Code Top Section */}
                <div className="flex items-center justify-center pt-4 mb-6 relative">
                    <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 animate-pulse" />
                    <div className="p-3.5 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[1.8rem] ring-[8px] ring-white/10 relative z-10 border border-white/50">
                        {qrDataUrl ? (
                            <img src={qrDataUrl} alt="QR Code" className="w-[100px] h-[100px] image-render-crisp" />
                        ) : (
                            <div className="w-[100px] h-[100px] animate-pulse bg-slate-50 rounded-xl flex items-center justify-center">
                                <RefreshCw className="animate-spin text-slate-200" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-center mb-6 relative z-10">
                    <div className={cn(
                        "w-24 h-24 rounded-[1.5rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] mb-5 border-[3px] ring-[10px] ring-white/5",
                        tp.hex === '#ffffff' ? "border-slate-100" : "border-white/20"
                    )}>
                        <img
                            src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=128`}
                            className="w-full h-full object-cover"
                            alt=""
                        />
                    </div>
                    <h1 className={cn(
                        "text-2xl font-black tracking-tighter leading-none uppercase mb-2 drop-shadow-sm",
                        tp.text,
                        customFont === 'mono' ? 'font-mono' : customFont === 'serif' ? 'font-serif' : 'font-sans'
                    )}>{profileData?.displayName || user.name || "KARDLY USER"}</h1>
                    <div className={cn(
                        "px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10",
                        customAccent || tp.accentText,
                        customFont === 'mono' ? 'font-mono' : customFont === 'serif' ? 'font-serif' : 'font-sans'
                    )}>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em]">
                            {profileData?.occupation || user.occupation || "DİJİTAL UZMAN"}
                        </p>
                    </div>
                </div>

                {/* Contact Info Cards */}
                <div className="w-full space-y-2.5 mt-auto">
                    {[
                        { icon: Phone, value: profileData?.phone || user.phone, label: 'TELEFON' },
                        { icon: Mail, value: profileData?.email || user.email, label: 'E-POSTA' },
                        { icon: Globe, value: `kardly.site/${user.username}`, label: 'WEB PROFİL' }
                    ].filter(item => item.value).map((item, idx) => (
                        <div key={idx} className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all",
                            tp.hex === '#ffffff'
                                ? "bg-slate-50 border-slate-100"
                                : tp.category === 'Ultimate'
                                    ? "bg-white/[0.06] border-white/[0.08] backdrop-blur-xl"
                                    : "bg-white/[0.03] border-white/[0.05]"
                        )}>
                            <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                                tp.hex === '#ffffff' ? "bg-indigo-50" : "bg-white/10"
                            )}>
                                <item.icon size={13} className={customAccent || tp.accentText} strokeWidth={2.5} />
                            </div>
                            <div className="text-left min-w-0">
                                <span className={cn("block text-[7px] font-black uppercase tracking-widest opacity-30 mb-0.5", tp.text)}>{item.label}</span>
                                <span className={cn("block text-[10px] font-bold tracking-tight truncate", tp.text)}>{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Branding */}
                <div className="mt-5 opacity-20">
                    <span className={cn("text-[6px] font-black tracking-[0.5em] uppercase", tp.text)}>KARDLY · PREMIUM</span>
                </div>
            </div>
        </div>
    )

    /* ÔöÇÔöÇÔöÇ MODAL MODE (Profile Page) ÔöÇÔöÇÔöÇ */
    if (mode === 'modal') {
        return (
            <div className="w-full flex flex-col items-center">
                <div className="relative" style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}>
                    <div className={cn("absolute inset-4 blur-[80px] opacity-15 rounded-[2.5rem]", tp.accent)} />
                    {CardContent}
                </div>
            </div>
        )
    }

    /* ÔöÇÔöÇÔöÇ SELECTOR MODE (Dashboard) ÔöÇÔöÇÔöÇ */
    return (
        <div className="w-full flex flex-col items-center">
            {mode === 'selector' && (
                <>
                    <div className="w-full mb-12 bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/5 shadow-2xl">
                        <div className="flex flex-col gap-8">
                            {/* Category Tabs */}
                            <div className="max-w-full overflow-x-auto no-scrollbar py-2">
                                <div className="flex bg-slate-950/50 p-1 rounded-full border border-white/5 w-fit mx-auto shadow-inner whitespace-nowrap">
                                    {(['Standard', 'Premium', 'Ultimate', 'Extraordinary', 'Studio'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={cn(
                                                "px-4 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-widest flex items-center gap-2",
                                                activeTab === tab
                                                    ? "bg-primary text-white shadow-xl scale-105"
                                                    : "text-slate-400 hover:text-white"
                                            )}
                                        >
                                            {tab === 'Standard' && <Palette size={14} />}
                                            {tab === 'Premium' && <Star size={14} />}
                                            {tab === 'Ultimate' && <Crown size={14} />}
                                            {tab === 'Extraordinary' && <Zap size={14} />}
                                            {tab === 'Studio' && <Layout size={14} />}
                                            {tab === 'Extraordinary' ? 'Sıradışı' : tab === 'Studio' ? 'Stüdyo' : tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Template Picker */}
                            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 sm:gap-4 justify-center">
                                {TEMPLATES.filter(t => t.category === activeTab).map((tpl) => (
                                    <button
                                        key={tpl.id}
                                        onClick={() => onSelect?.(tpl.id)}
                                        className={cn(
                                            "relative aspect-square rounded-2xl border-2 transition-all p-1.5 overflow-hidden",
                                            internalSelectedTplId === tpl.id
                                                ? "border-primary ring-4 ring-primary/20 scale-110 shadow-xl shadow-primary/20"
                                                : "border-white/5 hover:border-white/10 hover:scale-105"
                                        )}
                                    >
                                        <div className="w-full h-full rounded-xl overflow-hidden relative" style={{
                                            background: tpl.category === 'Ultimate' && tpl.colors
                                                ? `linear-gradient(135deg, ${tpl.colors[0]}, ${tpl.colors[1] || tpl.colors[0]})`
                                                : ((tpl as any).waveColor || tpl.hex)
                                        }}>
                                            {tpl.pattern === 'vibe_wave' && (
                                                <div className="w-full h-[55%]" style={{ backgroundColor: (tpl as any).waveColor || '#24292e' }} />
                                            )}
                                            {tpl.category === 'Ultimate' && (
                                                <>
                                                    <div className="absolute inset-0 opacity-20 animate-pulse bg-white/10" />
                                                    <svg className="absolute -left-[50%] top-0 w-[150%] h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                        <path d="M0,0 C60,10 60,90 0,100 L100,100 L100,0 Z" fill="rgba(0,0,0,0.2)" />
                                                    </svg>
                                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '6px 6px' }} />
                                                </>
                                            )}
                                        </div>
                                        {internalSelectedTplId === tpl.id && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-2xl">
                                                <Check size={20} className="text-white" strokeWidth={5} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Studio Customization Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full mt-4 mb-12 flex flex-col gap-6 bg-slate-950 p-6 sm:p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative Background for Panel */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 blur-[100px] pointer-events-none" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                            {/* 1. Color Control */}
                            <div className="space-y-5">
                                <label className="text-[11px] font-black uppercase tracking-[0.25em] text-white flex items-center gap-3">
                                    <Palette size={16} className="text-primary" /> Renk Paleti
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {['#ffffff', '#000000', '#2563eb', '#dc2626', '#059669', '#7c3aed', '#f59e0b', '#ec4899', '#06b6d4', '#10b981'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setCustomBg(c)}
                                            className={cn(
                                                "w-9 h-9 rounded-full border-2 transition-all shadow-xl",
                                                customBg === c ? "border-primary scale-110 ring-4 ring-primary/30" : "border-white/10 opacity-70 hover:opacity-100 hover:scale-105"
                                            )}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                    <button
                                        onClick={() => { setCustomBg(null); setCustomAccent(null); }}
                                        className="h-9 px-5 bg-white/10 rounded-full text-[10px] font-black text-white hover:bg-primary transition-all uppercase tracking-widest border border-white/10 shadow-lg"
                                    >
                                        Sıfırla
                                    </button>
                                </div>
                            </div>

                            {/* 2. Font Control */}
                            <div className="space-y-5">
                                <label className="text-[11px] font-black uppercase tracking-[0.25em] text-white flex items-center gap-3">
                                    <Type size={16} className="text-primary" /> Tipografi Atölyesi
                                </label>
                                <div className="flex flex-wrap gap-2.5">
                                    {(['sans', 'mono', 'serif'] as const).map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setCustomFont(f)}
                                            className={cn(
                                                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-lg group relative",
                                                customFont === f ? "bg-primary border-primary text-white scale-105 shadow-primary/30" : "bg-white/5 border-white/5 text-slate-300 hover:text-white hover:bg-white/10"
                                            )}
                                        >
                                            <span className="relative z-10">{f === 'sans' ? 'Modern' : f === 'mono' ? 'Teknik' : 'Klasik'}</span>
                                            {customFont === f && <motion.div layoutId="fontTab" className="absolute inset-0 bg-primary rounded-2xl -z-0" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Pattern Layers */}
                            <div className="space-y-5">
                                <label className="text-[11px] font-black uppercase tracking-[0.25em] text-white flex items-center gap-3">
                                    <Zap size={16} className="text-primary" /> Efekt Katmanı
                                </label>
                                <div className="flex flex-wrap gap-2.5">
                                    {( [null, 'dots', 'grid'] as const).map(p => (
                                        <button
                                            key={p || 'none'}
                                            onClick={() => setCustomPattern(p)}
                                            className={cn(
                                                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-lg group relative",
                                                customPattern === p ? "border-primary bg-primary text-white scale-105 shadow-primary/30" : "border-white/5 bg-white/5 text-slate-300 hover:text-white"
                                            )}
                                        >
                                            <span className="relative z-10">{p === 'dots' ? 'Noktalı' : p === 'grid' ? 'Izgara' : 'Yok'}</span>
                                            {customPattern === p && <motion.div layoutId="patternTab" className="absolute inset-0 bg-primary rounded-2xl -z-0" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}

            {/* Card Preview */}
            <div ref={containerRef} className="relative w-full overflow-hidden flex flex-col items-center">
                <div
                    className="relative transition-all duration-700 ease-out origin-top"
                    style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        transform: `scale(${cardScale})`,
                        marginBottom: cardScale < 1 ? `-${(1 - cardScale) * cardHeight}px` : '0px'
                    }}
                >
                    <div className={cn("absolute inset-6 blur-[100px] opacity-10 rounded-[2rem]", tp.accent)} />
                    {CardContent}
                </div>
            </div>

            {/* Download & Share Buttons - Professional Redesign */}
            <div className="w-full max-w-[400px] flex gap-4 mt-16 relative z-50">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-[2.5] relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-rose-500 to-primary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative h-16 bg-slate-950 rounded-2xl flex items-center justify-center gap-3 overflow-hidden border border-white/10 transition-all active:scale-95">
                        {/* Animated Background Shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        
                        {isDownloading ? (
                            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                        ) : downloadSuccess ? (
                            <Check size={20} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        ) : (
                            <Download size={20} className="text-white group-hover:-translate-y-1 transition-transform duration-300" />
                        )}
                        
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-white font-black text-[11px] uppercase tracking-[0.2em]">
                                {downloadSuccess ? 'BAŞARIYLA KAYDEDİLDİ' : 'TASARIMI İNDİR'}
                            </span>
                            <span className="text-white/30 text-[8px] uppercase tracking-widest mt-1 font-medium group-hover:text-white/50 transition-colors">
                                Yüksek Kaliteli Görsel (PNG)
                            </span>
                        </div>
                    </div>
                </button>

                {/* PHYSICAL CARD PURCHASE BUTTON */}
                <button
                    onClick={() => {
                        // Plan: Redirect to checkout/card with design details
                        alert("Fiziksel NFC Kart Sipariş Sistemi Çok Yakında! Tasarımınız Kaydedildi.")
                    }}
                    className="flex-[2.5] relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500 animate-pulse" />
                    <div className="relative h-16 bg-white rounded-2xl flex items-center justify-center gap-3 overflow-hidden transition-all shadow-2xl active:scale-95 border-2 border-transparent">
                        <CreditCard size={22} className="text-orange-600 group-hover:rotate-12 transition-transform" />
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-slate-900 font-black text-[12px] uppercase tracking-[0.1em]">
                                FİZİKSEL KART AL
                            </span>
                            <span className="text-orange-600 text-[9px] font-black uppercase tracking-widest opacity-80">
                                NFC AKILLI KART
                            </span>
                        </div>
                    </div>
                </button>

                <button
                    onClick={handleShare}
                    className="flex-1 relative group"
                >
                    <div className="absolute -inset-1 bg-white/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative h-16 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center transition-all group-hover:bg-white/[0.08] active:scale-90 shadow-2xl">
                        {shareSuccess ? (
                            <Check size={22} className="text-emerald-400" />
                        ) : (
                            <Share2 size={22} className="text-white/70 group-hover:text-white group-hover:rotate-12 transition-all" />
                        )}
                    </div>
                </button>
            </div>

            {/* Local Styles for Elite Background Animations */}
            <style jsx>{`
                @keyframes aurora-flow {
                    0% { background-position: 0% 50%; opacity: 0.4; transform: scale(1); }
                    50% { background-position: 100% 50%; opacity: 0.6; transform: scale(1.1); }
                    100% { background-position: 0% 50%; opacity: 0.4; transform: scale(1); }
                }
                @keyframes floating {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(2px, 5px) rotate(0.5deg); }
                    66% { transform: translate(-3px, 2px) rotate(-0.5deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
                @keyframes rotate-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes glitch-line {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(600px); }
                }
                @keyframes matrix-rain {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(600px); opacity: 0; }
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                .animate-elite-bg {
                    background-size: 200% 200%;
                    animation: aurora-flow 12s ease-in-out infinite;
                }
                .animate-floating {
                    animation: floating 8s ease-in-out infinite;
                }
                .animate-rotate-slow {
                    animation: rotate-slow 20s linear infinite;
                }
                .animate-glitch-line {
                    animation: glitch-line 3s linear infinite;
                }
                .animate-matrix-rain {
                    animation: matrix-rain 3s linear infinite;
                }
            `}</style>
        </div>
    )
}
