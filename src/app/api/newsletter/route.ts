import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: "Geçersiz e-posta adresi." }, { status: 400 })
        }

        const existing = await prisma.newsletter.findUnique({
            where: { email }
        })

        if (existing) {
            return NextResponse.json({ message: "Zaten kayıtlısınız!" }, { status: 200 })
        }

        await prisma.newsletter.create({
            data: { email }
        })

        return NextResponse.json({ message: "Başarıyla kayıt olundu!" }, { status: 200 })
    } catch (error) {
        console.error("Newsletter error:", error)
        return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 })
    }
}
