import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { name, email, subject, message } = await req.json()

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: "Tüm alanlar zorunludur" }, { status: 400 })
        }

        const contactMessage = await prisma.contactMessage.create({
            data: { name, email, subject, message }
        })

        return NextResponse.json({ success: true, id: contactMessage.id })
    } catch (error) {
        console.error("Contact form error:", error)
        return NextResponse.json({ error: "Mesaj gönderilemedi" }, { status: 500 })
    }
}
