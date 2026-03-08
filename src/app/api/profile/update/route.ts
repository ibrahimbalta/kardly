import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ProfileUpdateSchema } from "@/lib/validations"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()

        // Validate with Zod
        const validation = ProfileUpdateSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })
        }

        const { slogan, bio, phone, socialLinks, themeColor, templateId, tone, services, workingHours, occupation, displayName, image, cvUrl, showAppointmentBtn, youtubeVideoUrl, showVideoAsProfile, isCatalog, paymentLink, paymentType, animationStyle, profileBgImage, businessCardTemplateId, businessCardOrientation, qrColorDark, qrColorLight } = body

        // Update User name & image if provided
        if (displayName || image) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    ...(displayName && { name: displayName }),
                    ...(image && { image: image })
                }
            })
        }

        const updated = await prisma.profile.update({
            where: { userId: session.user.id },
            data: {
                slogan,
                bio,
                phone,
                socialLinks,
                themeColor,
                templateId,
                tone,
                services,
                workingHours,
                occupation,
                cvUrl,
                showAppointmentBtn,
                youtubeVideoUrl,
                showVideoAsProfile,
                isCatalog,
                paymentLink,
                paymentType,
                animationStyle,
                profileBgImage,
                businessCardTemplateId,
                businessCardOrientation,
                qrColorDark,
                qrColorLight
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
