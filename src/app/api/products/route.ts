import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 })
        }

        const body = await req.json()
        const { name, description, price, image, link } = body

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id }
        })

        if (!profile) {
            return NextResponse.json({ error: "Profil bulunamadı" }, { status: 404 })
        }

        const product = await prisma.product.create({
            data: {
                profileId: profile.id,
                name,
                description,
                price: price ? parseFloat(price) || 0 : 0,
                image,
                link
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("Product Create Error:", error)
        return NextResponse.json({ error: "Ürün oluşturulamadı" }, { status: 500 })
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
        const { name, description, price, image, link } = body

        const updated = await prisma.product.update({
            where: { id, profile: { userId: session.user.id } },
            data: {
                name,
                description,
                price: price ? parseFloat(price) || 0 : 0,
                image,
                link
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Product Update Error:", error)
        return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Auth required" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    await prisma.product.deleteMany({
        where: { id, profile: { userId: session.user.id } }
    })

    return NextResponse.json({ success: true })
}
