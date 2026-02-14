import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const planId = searchParams.get("planId")

    const session = await getServerSession(authOptions)

    if (status === "success" && planId && session?.user?.id) {
        // Update or create subscription in database
        await prisma.subscription.upsert({
            where: { userId: session.user.id },
            update: {
                plan: planId,
                status: "active",
                startDate: new Date(),
            },
            create: {
                userId: session.user.id,
                plan: planId,
                status: "active",
                startDate: new Date(),
            }
        })

        // Redirect to dashboard with success message
        return NextResponse.redirect(new URL("/dashboard?payment=success", req.url))
    }

    return NextResponse.redirect(new URL("/dashboard?payment=failed", req.url))
}
