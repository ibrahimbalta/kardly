import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const allowedEmail = process.env.ADMIN_EMAIL || "yanimdaki74@gmail.com"

        if (!session || session.user?.email !== allowedEmail) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { userId } = await req.json()

        if (!userId) {
            return new NextResponse("User ID is required", { status: 400 })
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        // Delete user (cascade will handle relations if prisma is setup correctly)
        // User model in schema.prisma has onDelete: Cascade in relational models
        await prisma.user.delete({
            where: { id: userId }
        })

        return NextResponse.json({ success: true, message: "User deleted successfully" })
    } catch (error) {
        console.error("[ADMIN_USER_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
