import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { id, isActive } = body

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        // Check ownership
        const review = await prisma.review.findUnique({
            where: { id },
            include: { profile: true }
        })

        if (!review || review.profile.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const updated = await prisma.review.update({
            where: { id },
            data: { isActive }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Review update error:", error)
        return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }
}
