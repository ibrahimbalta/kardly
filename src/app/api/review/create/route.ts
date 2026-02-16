import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { profileId, name, title, content, rating, image } = body

        if (!profileId || !name || !content) {
            return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 })
        }

        const review = await prisma.review.create({
            data: {
                profileId,
                name,
                title,
                content,
                rating: Number(rating) || 5,
                image: image || `https://i.pravatar.cc/150?u=${Math.random()}`,
                isActive: false // Yönetici onayına düşmesi için varsayılan false olabilir, 
                // ama kullanıcı hemen görmek istiyorsa true da yapabiliriz.
                // Kullanıcı "uygunsuz yorumlar olabilir" dediği için varsayılan false (onay bekliyor) daha mantıklı.
            }
        })

        return NextResponse.json(review)
    } catch (error) {
        console.error("Review creation error:", error)
        return NextResponse.json({ error: "Yorum gönderilemedi" }, { status: 500 })
    }
}
