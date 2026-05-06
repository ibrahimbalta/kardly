import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ articleId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { articleId } = await params

        // Check if already liked
        const existingLike = await prisma.articleLike.findUnique({
            where: {
                userId_articleId: {
                    userId: session.user.id,
                    articleId
                }
            }
        })

        if (existingLike) {
            // Unlike
            await prisma.articleLike.delete({
                where: { id: existingLike.id }
            })
            return NextResponse.json({ liked: false })
        } else {
            // Like
            await prisma.articleLike.create({
                data: {
                    userId: session.user.id,
                    articleId
                }
            })

            // Get article info to notify author
            const article = await prisma.article.findUnique({
                where: { id: articleId },
                include: { profile: true }
            })

            if (article && article.profile.userId !== session.user.id) {
                await prisma.notification.create({
                    data: {
                        userId: article.profile.userId,
                        type: "LIKE_ARTICLE",
                        content: `${session.user.name || 'Birisi'} "${article.title}" makalenizi beğendi.`,
                        link: `/${article.profile.username}?article=${article.slug}`
                    }
                })
            }

            return NextResponse.json({ liked: true })
        }
    } catch (error) {
        console.error("Like Error:", error)
        return NextResponse.json({ error: "Like action failed" }, { status: 500 })
    }
}
