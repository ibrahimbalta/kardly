import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { slogan, bio, phone, socialLinks, themeColor, templateId, services, workingHours } = body

        const updated = await prisma.profile.update({
            where: { userId: session.user.id },
            data: {
                slogan,
                bio,
                phone,
                socialLinks,
                themeColor,
                templateId,
                services,
                workingHours
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
