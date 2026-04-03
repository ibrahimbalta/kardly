import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sendAppointmentConfirmationEmail } from "@/lib/mail"

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

        // If confirmed, send email
        if (status === 'confirmed' && appointment.clientEmail) {
            try {
                // Sunucu saati ne olursa olsun Türkiye saatine (UTC+3) göre formatla
                const dateStr = new Date(appointment.date).toLocaleDateString('tr-TR', { timeZone: 'Europe/Istanbul' })
                const timeStr = new Date(appointment.date).toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZone: 'Europe/Istanbul' 
                })
                await sendAppointmentConfirmationEmail(
                    appointment.clientEmail,
                    appointment.clientName,
                    dateStr,
                    timeStr
                )
            } catch (mailError) {
                console.error("Failed to send confirmation email:", mailError)
            }
        }

        return NextResponse.json(appointment)
    } catch (error) {
        console.error("Appointment Update Error:", error)
        return NextResponse.json({ error: "Girdi güncellenemedi" }, { status: 500 })
    }
}
