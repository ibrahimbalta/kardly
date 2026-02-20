import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "yanimdaki74@gmail.com"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user?.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(messages)
    } catch (error) {
        return NextResponse.json({ error: "Mesajlar alınamadı" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user?.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id, isRead } = await req.json()

        await prisma.contactMessage.update({
            where: { id },
            data: { isRead }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user?.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await req.json()

        await prisma.contactMessage.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Silinemedi" }, { status: 500 })
    }
}
