import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "yanimdaki74@gmail.com"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.email !== ADMIN_EMAIL) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const settings = await prisma.globalSettings.findUnique({
            where: { id: "main" }
        })
        return NextResponse.json(settings || {})
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.email !== ADMIN_EMAIL) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { adSenseCode, analyticsCode, customCss, customJs } = body

        const settings = await prisma.globalSettings.upsert({
            where: { id: "main" },
            update: {
                adSenseCode,
                analyticsCode,
                customCss,
                customJs
            },
            create: {
                id: "main",
                adSenseCode,
                analyticsCode,
                customCss,
                customJs
            }
        })

        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
