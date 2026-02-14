import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { profileId, type, value } = body

        if (!profileId) return NextResponse.json({ error: "Profile ID required" }, { status: 400 })

        await prisma.analytics.create({
            data: {
                profileId,
                type: type || "click",
                value: value,
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Analytics API Error:", error)
        return NextResponse.json({ error: "Failed to log event" }, { status: 500 })
    }
}
