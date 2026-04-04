import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const allowedEmail = process.env.ADMIN_EMAIL || "yanimdaki74@gmail.com"

        if (!session || session.user?.email !== allowedEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { orderId, status } = await req.json()

        if (!orderId || !status) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
        }

        const updated = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Order update error:", error)
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }
}
