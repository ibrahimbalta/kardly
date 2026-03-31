import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Input validation schema
const blockSchema = z.object({
    type: z.string().max(50),
    content: z.record(z.string(), z.any()),
    isActive: z.boolean().optional().default(true)
})

const blocksSchema = z.array(blockSchema).max(50)

// Basic sanitization: Strip <script> tags from string values in an object
function sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;
    const sanitized: any = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            // Remove <script> tags and suspicious expressions
            sanitized[key] = obj[key].replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                                     .replace(/on\w+="[^"]*"/gim, "") // event handlers
        } else if (typeof obj[key] === 'object') {
            sanitized[key] = sanitizeObject(obj[key]);
        } else {
            sanitized[key] = obj[key];
        }
    }
    return sanitized;
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
            include: { blocks: { orderBy: { order: 'asc' } } }
        })

        return NextResponse.json(profile?.blocks || [])
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blocks" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const result = blocksSchema.safeParse(body.blocks)

        if (!result.success) {
            return NextResponse.json({ error: "Invalid data format or too many blocks (max 50)" }, { status: 400 })
        }

        const blocks = result.data

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id }
        })

        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

        // Simple sync strategy: Delete all and recreate
        await prisma.block.deleteMany({
            where: { profileId: profile.id }
        })

        const created = await prisma.block.createMany({
            data: blocks.map((b: any, index: number) => ({
                profileId: profile.id,
                type: b.type,
                content: sanitizeObject(b.content),
                order: index,
                isActive: b.isActive ?? true
            }))
        })

        return NextResponse.json({ success: true, count: created.count })
    } catch (error) {
        console.error("Blocks sync error:", error)
        return NextResponse.json({ error: "Failed to sync blocks" }, { status: 500 })
    }
}
