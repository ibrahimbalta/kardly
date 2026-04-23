import HubClient from "./HubClient"
import prisma from "@/lib/prisma"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Business Hub | Kardly",
    description: "Kardly Business Hub ile binlerce profesyonel arasından ihtiyacınız olan ortağı bulun, yeni iş birlikleri geliştirin ve ağınızı büyütün.",
    openGraph: {
        title: "Business Hub | Kardly",
        description: "Profesyonel ağınızı Kardly ile büyütün. Binlerce uzman ve işletme ile tanışın.",
        url: "https://kardly.site/hub",
        images: [{ url: "https://kardly.site/images/og-hub.png" }],
        type: 'website',
        siteName: 'Kardly',
    },
}

async function getInitialNetwork() {
    try {
        // @ts-ignore
        const profiles = await prisma.profile.findMany({
            where: {
                // @ts-ignore
                showInHub: true,
                user: {
                    isActive: true
                }
            },
            include: {
                user: true,
                reviews: {
                    where: { isActive: true },
                    select: { rating: true }
                },
                _count: {
                    select: { analytics: true }
                }
            },
            orderBy: {
                // @ts-ignore
                createdAt: 'desc'
            },
            take: 50 // Initial load
        })

        // Map back to expected format
        // @ts-ignore
        return profiles.map(p => {
            // @ts-ignore
            const { user, reviews, _count, ...profile } = p
            const avgRating = reviews.length > 0 
                ? (reviews.reduce((acc: number, cur: any) => acc + cur.rating, 0) / reviews.length).toFixed(1)
                : "5.0"

            return {
                ...user,
                profile: {
                    ...profile,
                    avgRating,
                    totalViews: _count.analytics || 0
                }
            }
        })
    } catch (error) {
        console.error("Hub Fetch Error:", error)
        return []
    }
}

export default async function HubPage() {
    const initialUsers = await getInitialNetwork()
    return <HubClient initialUsers={initialUsers} />
}
