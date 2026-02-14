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
    // This could be used by dashboard to fetch appointments
    // Security check should be added here (getServerSession)
    return NextResponse.json({ message: "Not implemented yet" })
}
