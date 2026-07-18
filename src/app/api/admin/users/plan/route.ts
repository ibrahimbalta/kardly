import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const allowedEmail = process.env.ADMIN_EMAIL || "yanimdaki74@gmail.com"

        if (!session || session.user?.email !== allowedEmail) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { userId, plan } = await req.json()

        if (!userId || !plan) {
            return new NextResponse("User ID and Plan are required", { status: 400 })
        }

        const cleanPlan = plan.toLowerCase().trim()

        const subscription = await prisma.subscription.upsert({
            where: { userId },
            update: {
                plan: cleanPlan,
                status: "active"
            },
            create: {
                userId,
                plan: cleanPlan,
                status: "active"
            }
        })

        return NextResponse.json({ success: true, subscription })
    } catch (error) {
        console.error("[ADMIN_PLAN_UPDATE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}