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
                user: true
            },
            orderBy: {
                id: 'desc'
            }
        })

        // Map back to expected format: Array of users with profile included
        // @ts-ignore
        const users = profiles.map(p => {
            // @ts-ignore
            const { user, ...profile } = p
            return {
                ...user,
                profile
            }
        })
        return NextResponse.json(users)
    } catch (error) {
        console.error("Network Fetch Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
