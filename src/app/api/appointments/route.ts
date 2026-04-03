import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { profileId, name, email, phone, scheduledAt, note } = body

        if (!profileId || !name || !email || !scheduledAt) {
            return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 })
        }

        // Find the user associated with this profile
        const profile = await prisma.profile.findUnique({
            where: { id: profileId }
        })

        if (!profile) {
            return NextResponse.json({ error: "Profil bulunamadı" }, { status: 404 })
        }

        // Create appointment
        const appointment = await prisma.appointment.create({
            data: {
                userId: profile.userId,
                clientName: name,
                clientEmail: email,
                clientPhone: phone,
                date: new Date(scheduledAt),
                note: note,
                status: "pending"
            }
        })

        return NextResponse.json(appointment)
    } catch (error) {
        console.error("Appointment API Error:", error)
        return NextResponse.json({ error: "Randevu oluşturulamadı" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const profileId = searchParams.get("profileId")
        const date = searchParams.get("date")

        if (!profileId || !date) {
            return NextResponse.json({ error: "Eksik parametre" }, { status: 400 })
        }

        // Get start and end of the day in UTC
        // We'll compare dates carefully. Appointment date in DB is UTC.
        // If user picks 2026-04-05, we want all appointments on that day.
        const dayStart = new Date(date)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(date)
        dayEnd.setHours(23, 59, 59, 999)

        const appointments = await prisma.appointment.findMany({
            where: {
                user: {
                    profile: {
                        id: profileId
                    }
                },
                date: {
                    gte: dayStart,
                    lte: dayEnd
                },
                status: {
                    not: "cancelled"
                }
            },
            select: {
                date: true
            }
        })

        // Extract hour:minute strings in TRT (UTC+3)
        const bookedSlots = appointments.map(a => {
            const date = new Date(a.date)
            // Force return in TRT for comparison
            return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' })
        })

        return NextResponse.json({ bookedSlots })
    } catch (error) {
        console.error("Fetch Booked Slots Error:", error)
        return NextResponse.json({ error: "Müsaitlik bilgisi alınamadı" }, { status: 500 })
    }
}
