import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 })
        }

        // Verify ownership
        const lead = await prisma.lead.findFirst({
            where: {
                id,
                profile: {
                    userId: session.user.id
                }
            }
        })

        if (!lead) {
            return NextResponse.json({ error: "Lead not found or unauthorized" }, { status: 404 })
        }

        await prisma.lead.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error("Lead delete error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
