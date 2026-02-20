import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const leads = await prisma.lead.findMany({
            where: {
                profile: {
                    userId: session.user.id
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(leads)
    } catch (err) {
        console.error("Leads fetch error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
