import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ articleId: string }> }
) {
    try {
        const { articleId } = await params
        const comments = await prisma.articleComment.findMany({
            where: { articleId, isActive: true },
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json(comments)
    } catch (error) {
        console.error("Comments Fetch Error:", error)
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ articleId: string }> }
) {
    try {
        const { articleId } = await params
        const body = await req.json()
        const { name, content } = body

        if (!name || !content) {
            return NextResponse.json({ error: "Name and content are required" }, { status: 400 })
        }

        const comment = await prisma.articleComment.create({
            data: {
                articleId,
                name,
                content,
                isActive: true
            }
        })

        return NextResponse.json(comment)
    } catch (error) {
        console.error("Comment Create Error:", error)
        return NextResponse.json({ error: "Failed to post comment" }, { status: 500 })
    }
}
