import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const statusUpdates = await prisma.statusUpdate.findMany({
            include: {
                profile: {
                    select: {
                        username: true,
                        occupation: true,
                        userId: true,
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            take: 50
        })

        return NextResponse.json(statusUpdates)
    } catch (error) {
        console.error("Status Fetch Error:", error)
        return NextResponse.json({ error: "Failed to fetch updates" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { content } = body

        if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 })

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id }
        })

        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

        const statusUpdate = await prisma.statusUpdate.create({
            data: {
                profileId: profile.id,
                content
            },
            include: {
                profile: {
                    include: {
                        user: true
                    }
                }
            }
        })

        return NextResponse.json(statusUpdate)
    } catch (error) {
        console.error("Status Create Error:", error)
        return NextResponse.json({ error: "Failed to post update" }, { status: 500 })
    }
}
