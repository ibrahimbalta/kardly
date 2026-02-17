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
        const { id, status } = body

        if (!id || !status) {
            return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 })
        }

        const appointment = await prisma.appointment.update({
            where: {
                id: id,
                userId: (session.user as any).id
            },
            data: { status }
        })

        return NextResponse.json(appointment)
    } catch (error) {
        console.error("Appointment Update Error:", error)
        return NextResponse.json({ error: "Girdi güncellenemedi" }, { status: 500 })
    }
}
