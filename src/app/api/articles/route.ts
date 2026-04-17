import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id }
        })

        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

        const articles = await prisma.article.findMany({
            where: { profileId: profile.id },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(articles)
    } catch (error) {
        console.error("Articles Fetch Error:", error)
        return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { title, content, excerpt, coverImage, isActive } = body

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id }
        })

        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "")

        const article = await prisma.article.create({
            data: {
                profileId: profile.id,
                title,
                content,
                excerpt,
                coverImage,
                slug: `${slug}-${Date.now().toString().slice(-4)}`, // Ensure uniqueness
                isActive: isActive !== undefined ? isActive : true
            }
        })

        return NextResponse.json(article)
    } catch (error) {
        console.error("Article Create Error:", error)
        return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        const body = await req.json()
        const { title, content, excerpt, coverImage, isActive } = body

        const updated = await prisma.article.update({
            where: { id, profile: { userId: session.user.id } },
            data: {
                title,
                content,
                excerpt,
                coverImage,
                isActive: isActive !== undefined ? isActive : true
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Article Update Error:", error)
        return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        await prisma.article.deleteMany({
            where: { id, profile: { userId: session.user.id } }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Article Delete Error:", error)
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}
