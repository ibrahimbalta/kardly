import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateProfileData } from "@/services/ai"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        // For development, we might want to allow generation without session
        // but in production, we should enforce it.

        const body = await req.json()
        const { occupation, targetAudience, tone, username: customUsername } = body

        if (!occupation || !targetAudience || !tone) {
            return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 })
        }

        const aiResult = await generateProfileData({ occupation, targetAudience, tone })

        // If user is logged in, we can save/update their profile
        if (session?.user?.id) {
            const finalUsername = customUsername || session.user.name?.toLowerCase().replace(/\s+/g, '') || `user${Math.floor(Math.random() * 1000)}`

            // Check if username is taken by another user
            const existing = await prisma.profile.findFirst({
                where: {
                    username: finalUsername,
                    NOT: { userId: session.user.id }
                }
            })

            if (existing) {
                return NextResponse.json({ error: "Bu kullanıcı adı zaten alınmış." }, { status: 400 })
            }

            await prisma.profile.upsert({
                where: { userId: session.user.id },
                update: {
                    occupation,
                    targetAudience,
                    tone,
                    slogan: aiResult.slogan,
                    bio: aiResult.bio,
                    services: aiResult.services,
                    themeColor: aiResult.themeColor,
                    templateId: aiResult.templateId || "neon_blue",
                    username: finalUsername,
                    slug: finalUsername,
                },
                create: {
                    userId: session.user.id,
                    username: finalUsername,
                    slug: finalUsername,
                    occupation,
                    targetAudience,
                    tone,
                    slogan: aiResult.slogan,
                    bio: aiResult.bio,
                    services: aiResult.services,
                    themeColor: aiResult.themeColor,
                    templateId: aiResult.templateId || "neon_blue",
                }
            })
        }

        return NextResponse.json(aiResult)
    } catch (error: any) {
        console.error("Generate API Error:", error)
        return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
    }
}
