import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { slogan, bio, phone, socialLinks, themeColor, templateId, tone, services, workingHours, occupation, displayName, image, cvUrl, showAppointmentBtn, youtubeVideoUrl, showVideoAsProfile, isCatalog, paymentLink, paymentType, animationStyle, profileBgImage } = body

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
                profileBgImage
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
