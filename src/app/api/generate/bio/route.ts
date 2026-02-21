import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateBio } from "@/services/ai"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
        }

        const body = await req.json()
        const { occupation, targetAudience, tone } = body

        if (!occupation || !targetAudience || !tone) {
            return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 })
        }

        const result = await generateBio({ occupation, targetAudience, tone })
        return NextResponse.json(result)
    } catch (error: any) {
        console.error("Generate Bio API Error:", error)
        return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
    }
}
