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

        const { userId, isActive } = await req.json()

        if (!userId) {
            return new NextResponse("User ID is required", { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isActive }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("[ADMIN_USER_TOGGLE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
