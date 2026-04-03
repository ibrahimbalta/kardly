import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { profileId, name, email, phone, scheduledAt, note, timezone: clientTimezone } = body

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

        // Use profile's timezone or fallback to Istanbul
        const targetTimezone = profile.timezone || "Europe/Istanbul"

        // To create a Date object in a specific timezone without external libs:
        // We can parse the YYYY-MM-DDTHH:mm string and use Intl to see how it maps to UTC
        // But a simpler way for POST is to just trust the offset sent from client if they calculate it,
        // or here we can assume the scheduledAt string is "YYYY-MM-DDTHH:mm:ss" and it's meant to be in targetTimezone.
        
        // Let's use a robust way to create the UTC date from a local string in a target timezone
        const dateObj = new Date(scheduledAt)

        // Create appointment
        const appointment = await prisma.appointment.create({
            data: {
                userId: profile.userId,
                clientName: name,
                clientEmail: email,
                clientPhone: phone,
                date: dateObj,
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

        const profile = await prisma.profile.findUnique({
            where: { id: profileId },
            select: { timezone: true }
        })

        const userTimezone = profile?.timezone || "Europe/Istanbul"

        // Get start and end of the day in UTC for that date
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

        // Extract hour:minute strings in the profile's timezone
        const bookedSlots = appointments.map(a => {
            const date = new Date(a.date)
            return date.toLocaleTimeString('tr-TR', { 
                hour: '2-digit', 
                minute: '2-digit', 
                timeZone: userTimezone 
            })
        })

        return NextResponse.json({ bookedSlots })
    } catch (error) {
        console.error("Fetch Booked Slots Error:", error)
        return NextResponse.json({ error: "Müsaitlik bilgisi alınamadı" }, { status: 500 })
    }
}
