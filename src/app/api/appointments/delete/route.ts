import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
        }

        const body = await req.json()
        const { id } = body

        if (!id) {
            return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 })
        }

        await prisma.appointment.delete({
            where: {
                id: id,
                userId: (session.user as any).id
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Appointment Delete Error:", error)
        return NextResponse.json({ error: "Randevu silinemedi" }, { status: 500 })
    }
}
