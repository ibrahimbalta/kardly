import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: {
                isActive: true,
                profile: {
                    isNot: null,
                    showInHub: true
                }
            },
            include: {
                profile: true
            },
            orderBy: {
                id: 'desc'
            }
        })
        return NextResponse.json(users)
    } catch (error) {
        console.error("Network Fetch Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
