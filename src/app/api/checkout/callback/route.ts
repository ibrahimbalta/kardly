import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const planId = searchParams.get("planId")
    const token = searchParams.get("token")

    const session = await getServerSession(authOptions)

    // IMPORTANT: In a real scenario, you must verify the 'token' with Iyzico API here.
    // Without verification, anyone can still craft a URL with a fake token.
    if (status === "success" && planId && session?.user?.id && token) {
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
