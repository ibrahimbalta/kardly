import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "yanimdaki74@gmail.com"

// Public GET - only published posts
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const slug = searchParams.get('slug')
        const admin = searchParams.get('admin')

        if (slug) {
            const post = await prisma.blogPost.findUnique({ where: { slug } })
            if (!post || (!post.isPublished && admin !== 'true')) {
                return NextResponse.json({ error: "Yazı bulunamadı" }, { status: 404 })
            }
            return NextResponse.json(post)
        }

        if (admin === 'true') {
            const session = await getServerSession(authOptions)
            if (!session || session.user?.email !== ADMIN_EMAIL) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            }
            const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
            return NextResponse.json(posts)
        }

        const posts = await prisma.blogPost.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(posts)
    } catch (error) {
        return NextResponse.json({ error: "Blog yazıları alınamadı" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user?.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { title, slug, excerpt, content, coverImage, isPublished } = await req.json()

        if (!title || !slug || !content) {
            return NextResponse.json({ error: "Başlık, slug ve içerik zorunludur" }, { status: 400 })
        }

        const post = await prisma.blogPost.create({
            data: { title, slug, excerpt, content, coverImage, isPublished: isPublished || false }
        })

        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ error: "Yazı oluşturulamadı" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user?.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id, title, slug, excerpt, content, coverImage, isPublished } = await req.json()

        const post = await prisma.blogPost.update({
            where: { id },
            data: { title, slug, excerpt, content, coverImage, isPublished }
        })

        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ error: "Yazı güncellenemedi" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user?.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await req.json()

        await prisma.blogPost.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Yazı silinemedi" }, { status: 500 })
    }
}
