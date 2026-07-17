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

        const { username, slogan, bio, phone, socialLinks, themeColor, bioColor, bioFontFamily, bioFontSize, sloganColor, sloganFontFamily, sloganFontSize, templateId, tone, services, workingHours, occupation, displayName, image, cvUrl, showAppointmentBtn, youtubeVideoUrl, showVideoAsProfile, isCatalog, paymentLink, paymentType, animationStyle, profileBgImage, businessCardTemplateId, businessCardOrientation, qrColorDark, qrColorLight, hasAcceptedTerms, showInHub, timezone, buttonLayout, buttonColor, buttonShape } = body

        // Check user subscription to enforce plan limits
        const userWithSub = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { subscription: true, profile: true }
        })
        const plan = userWithSub?.subscription?.plan || "free"
        const isPremium = userWithSub?.subscription?.status === "active" && plan !== "free"

        // 1. Enforce username (subdomain) change limit
        const oldUsername = userWithSub?.profile?.username
        if (username && oldUsername && username.toLowerCase() !== oldUsername.toLowerCase() && !isPremium) {
            return NextResponse.json({
                error: "Alan adı güncelleme Pro & İşletme planlarına özeldir. Lütfen planınızı yükseltin. ⚡"
            }, { status: 403 })
        }

        // 2. Enforce premium templates limit
        const freeTemplates = ["neon_black", "neon_blue", "neon_purple", "minimal_pure", "minimal_graphite", "minimal_glass"]
        if (templateId && !freeTemplates.includes(templateId) && !isPremium) {
            return NextResponse.json({
                error: "Seçtiğiniz şablon Pro & İşletme planlarına özeldir. Lütfen planınızı yükseltin. ⚡"
            }, { status: 403 })
        }

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
                ...(username && { username: username.toLowerCase(), slug: username.toLowerCase() }),
                slogan,
                bio,
                phone,
                socialLinks,
                themeColor,
                bioColor,
                bioFontFamily,
                bioFontSize,
                sloganColor,
                sloganFontFamily,
                sloganFontSize,
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
                qrColorLight,
                hasAcceptedTerms,
                showInHub,
                buttonLayout,
                buttonColor,
                buttonShape,
                timezone
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
