import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET - Tüm aktif ilanları getir (public hub için) veya kullanıcının ilanlarını getir
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const mine = searchParams.get("mine")

        if (mine === "true") {
            const session = await getServerSession(authOptions)
            if (!session?.user?.email) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            }

            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                include: { profile: true }
            })

            if (!user?.profile) {
                return NextResponse.json([])
            }

            const ads = await prisma.hubAd.findMany({
                where: { profileId: user.profile.id },
                orderBy: { createdAt: "desc" },
                include: {
                    profile: {
                        select: {
                            username: true,
                            occupation: true,
                            userId: true,
                        }
                    }
                }
            })

            return NextResponse.json(ads)
        }

        // Public: tüm aktif ilanlar
        const ads = await prisma.hubAd.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
            take: 20,
            include: {
                profile: {
                    select: {
                        username: true,
                        occupation: true,
                        userId: true,
                    }
                }
            }
        })

        return NextResponse.json(ads)
    } catch (err) {
        console.error("Hub ads GET error:", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}

// POST - Yeni ilan oluştur
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { profile: true }
        })

        if (!user?.profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }

        const body = await req.json()
        const { title, description, budget, category, tags } = body

        if (!title || !description) {
            return NextResponse.json({ error: "Title and description required" }, { status: 400 })
        }

        const ad = await prisma.hubAd.create({
            data: {
                profileId: user.profile.id,
                title,
                description,
                budget: budget || null,
                category: category || "software",
                tags: tags || null,
            },
            include: {
                profile: {
                    select: {
                        username: true,
                        occupation: true,
                        userId: true,
                    }
                }
            }
        })

        return NextResponse.json(ad)
    } catch (err) {
        console.error("Hub ads POST error:", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}

// DELETE - İlan sil
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { profile: true }
        })

        if (!user?.profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }

        // Sadece kendi ilanını silebilir
        const ad = await prisma.hubAd.findFirst({
            where: { id, profileId: user.profile.id }
        })

        if (!ad) {
            return NextResponse.json({ error: "Ad not found" }, { status: 404 })
        }

        await prisma.hubAd.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error("Hub ads DELETE error:", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
