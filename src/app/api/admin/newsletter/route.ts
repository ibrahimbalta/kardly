import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        
        // Admin yetkisi kontrolü
        if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 })
        }

        const subscribers = await prisma.newsletter.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(subscribers)
    } catch (error) {
        return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 })
        }

        const { id } = await req.json()
        await prisma.newsletter.delete({ where: { id } })
        
        return NextResponse.json({ message: "Silindi." })
    } catch (error) {
        return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 })
    }
}
