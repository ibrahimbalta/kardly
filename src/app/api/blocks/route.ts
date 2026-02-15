import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
            include: { blocks: { orderBy: { order: 'asc' } } }
        })

        return NextResponse.json(profile?.blocks || [])
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blocks" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { blocks } = await req.json()
        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id }
        })

        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

        // Simple sync strategy: Delete all and recreate
        // In a real app, you might want a more sophisticated upsert/soft-delete strategy
        await prisma.block.deleteMany({
            where: { profileId: profile.id }
        })

        const created = await prisma.block.createMany({
            data: blocks.map((b: any, index: number) => ({
                profileId: profile.id,
                type: b.type,
                content: b.content,
                order: index,
                isActive: b.isActive ?? true
            }))
        })

        return NextResponse.json({ success: true, count: created.count })
    } catch (error) {
        console.error("Blocks sync error:", error)
        return NextResponse.json({ error: "Failed to sync blocks" }, { status: 500 })
    }
}
