import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const allowedEmail = process.env.ADMIN_EMAIL || "yanimdaki74@gmail.com"

        if (!session || session.user?.email !== allowedEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { orderId } = await req.json()

        if (!orderId) {
            return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
        }

        // Delete order items first (cascading normally but being explicit)
        await prisma.orderItem.deleteMany({
            where: { orderId }
        })

        const deleted = await prisma.order.delete({
            where: { id: orderId }
        })

        return NextResponse.json(deleted)
    } catch (error) {
        console.error("Order deletion error:", error)
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
    }
}
