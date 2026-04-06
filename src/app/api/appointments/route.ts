import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { profileId, name, email, phone, scheduledAt, note, timezone: clientTimezone } = body

        if (!profileId || !name || !email || !scheduledAt) {
            return NextResponse.json({ error: "genericError" }, { status: 400 })
        }

        // 1. Basic Sanitization for Note
        const cleanNote = note?.slice(0, 500).replace(/<[^>]*>?/gm, '') || ""

        // Find the profile and user
        const profile = await prisma.profile.findUnique({
            where: { id: profileId },
            include: { user: true }
        })

        if (!profile) {
            return NextResponse.json({ error: "genericError" }, { status: 404 })
        }

        // 2. Check if appointments are enabled
        if (!profile.showAppointmentBtn) {
            return NextResponse.json({ error: "errorDisabled" }, { status: 403 })
        }

        const dateObj = new Date(scheduledAt)
        
        // 3. Prevent past dates
        if (dateObj < new Date()) {
            return NextResponse.json({ error: "errorPastDate" }, { status: 400 })
        }

        // 4. Validate working hours (Server-side safety)
        if (profile.workingHours) {
            const appointmentDate = new Date(dateObj)
            const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' })
            const profileTZ = (profile as any).timezone || "Europe/Istanbul"
            
            const timeString = appointmentDate.toLocaleTimeString('tr-TR', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: false,
                timeZone: profileTZ 
            })

            const hours: any = profile.workingHours

            // Support both Array and Object formats
            if (Array.isArray(hours)) {
                // Scenario: Array of slots (e.g., ["09:00", "10:00"]) - This is what the dashboard currently saves
                if (!hours.includes(timeString)) {
                    return NextResponse.json({ error: "errorWorkingHours" }, { status: 400 })
                }
            } else if (typeof hours === 'object' && hours !== null) {
                // Scenario: Day-based object (e.g., { Monday: { active: true, start: "09:00", end: "17:00" } })
                const dayConfig = hours[dayOfWeek]
                if (!dayConfig || !dayConfig.active) {
                    return NextResponse.json({ error: "errorWorkingHours" }, { status: 400 })
                }
                if (timeString < dayConfig.start || timeString > dayConfig.end) {
                    return NextResponse.json({ error: "errorWorkingHours" }, { status: 400 })
                }
            }
        }

        // 5. Spam prevention (Optional Check: Same email/phone in last 1 hour)
        const recentAppointment = await prisma.appointment.findFirst({
            where: {
                userId: profile.userId,
                OR: [
                    { clientEmail: email },
                    { clientPhone: phone }
                ],
                createdAt: {
                    gte: new Date(Date.now() - 60 * 60 * 1000) // 1 hour
                }
            }
        })

        if (recentAppointment) {
            return NextResponse.json({ error: "errorSpam" }, { status: 429 })
        }

        // Create appointment
        const appointment = await prisma.appointment.create({
            data: {
                userId: profile.userId,
                clientName: name,
                clientEmail: email,
                clientPhone: phone,
                date: dateObj,
                note: cleanNote,
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
            where: { id: profileId }
        })

        const userTimezone = (profile as any)?.timezone || "Europe/Istanbul"

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
