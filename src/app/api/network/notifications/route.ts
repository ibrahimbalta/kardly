import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const notifications = await prisma.notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 20
        })

        const unreadCount = await prisma.notification.count({
            where: { userId: session.user.id, isRead: false }
        })

        return NextResponse.json({ notifications, unreadCount })
    } catch (error) {
        console.error("Notifications Fetch Error:", error)
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (id) {
            await prisma.notification.update({
                where: { id, userId: session.user.id },
                data: { isRead: true }
            })
        } else {
            await prisma.notification.updateMany({
                where: { userId: session.user.id, isRead: false },
                data: { isRead: true }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Notifications Update Error:", error)
        return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
    }
}
