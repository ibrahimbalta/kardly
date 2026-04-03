import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
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
            }
        })

        // Map back to expected format: Array of users with profile included + metrics
        // @ts-ignore
        const users = profiles.map(p => {
            // @ts-ignore
            const { user, reviews, _count, ...profile } = p
            
            // Calculate average rating
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

        return NextResponse.json(users)
    } catch (error) {
        console.error("Network Fetch Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
