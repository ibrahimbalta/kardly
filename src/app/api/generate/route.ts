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
        const { occupation, targetAudience, tone, username: customUsername, hasAcceptedTerms, importedData } = body

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

            // Map imported links if available - smart routing
            let socialLinks: any[] = []
            if (importedData?.links) {
                const knownPlatforms = ['instagram', 'twitter', 'linkedin', 'youtube', 'facebook', 'whatsapp', 'github', 'behance', 'dribbble']
                
                // Social media links go to dedicated platform slots
                for (const link of importedData.links) {
                    if (knownPlatforms.includes(link.platform)) {
                        socialLinks.push({ platform: link.platform, url: link.url, isHero: false })
                    }
                }
                
                // Non-social links go to customLinks
                const customLinks = importedData.links
                    .filter((l: any) => !knownPlatforms.includes(l.platform))
                    .map((l: any) => ({ title: l.title, url: l.url, isAction: false }))
                
                if (customLinks.length > 0) {
                    socialLinks.push({ platform: 'customLinks', links: customLinks })
                }
            }

            // Update user image and name if imported
            if (importedData?.image || importedData?.displayName) {
                await prisma.user.update({
                    where: { id: session.user.id },
                    data: {
                        ...(importedData.image && { image: importedData.image }),
                        ...(importedData.displayName && { name: importedData.displayName })
                    }
                })
            }
 
            await prisma.profile.upsert({
                where: { userId: session.user.id },
                update: {
                    occupation,
                    targetAudience: importedData ? "Linktree Import" : targetAudience,
                    tone,
                    slogan: aiResult.slogan,
                    bio: importedData?.bio || aiResult.bio,
                    services: aiResult.services,
                    themeColor: aiResult.themeColor,
                    templateId: aiResult.templateId || "neon_blue",
                    username: finalUsername,
                    slug: finalUsername,
                    hasAcceptedTerms: !!hasAcceptedTerms,
                    socialLinks: socialLinks.length > 0 ? socialLinks : undefined
                },
                create: {
                    userId: session.user.id,
                    username: finalUsername,
                    slug: finalUsername,
                    occupation,
                    targetAudience: importedData ? "Linktree Import" : targetAudience,
                    tone,
                    slogan: aiResult.slogan,
                    bio: importedData?.bio || aiResult.bio,
                    services: aiResult.services,
                    themeColor: aiResult.themeColor,
                    templateId: aiResult.templateId || "neon_blue",
                    hasAcceptedTerms: !!hasAcceptedTerms,
                    socialLinks: socialLinks.length > 0 ? socialLinks : undefined
                }
            })
        }

        return NextResponse.json(aiResult)
    } catch (error: any) {
        console.error("Generate API Error:", error)
        return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
    }
}
