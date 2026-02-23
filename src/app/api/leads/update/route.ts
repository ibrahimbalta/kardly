import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { id, status } = body

        if (!id || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Verify the lead belongs to the user
        const lead = await prisma.lead.findUnique({
            where: { id },
            include: {
                profile: true
            }
        })

        if (!lead || lead.profile.userId !== session.user.id) {
            return NextResponse.json({ error: "Lead not found or unauthorized" }, { status: 404 })
        }

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json(updatedLead)
    } catch (err) {
        console.error("Lead update error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
