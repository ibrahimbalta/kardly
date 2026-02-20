import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { profileId, name, phone, email, subject, message } = body

        if (!profileId || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const lead = await prisma.lead.create({
            data: {
                profileId,
                name,
                phone,
                email,
                subject,
                message,
                status: "new"
            }
        })

        return NextResponse.json(lead)
    } catch (err) {
        console.error("Lead creation error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
