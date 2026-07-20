import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// PATCH /api/enterprise/employees/[id] — update employee
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })
        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

        const existing = await prisma.enterpriseEmployee.findFirst({
            where: { id, profileId: profile.id }
        })
        if (!existing) return NextResponse.json({ error: "Employee not found" }, { status: 404 })

        const body = await req.json()
        const { name, email, phone, role, department, nfcTag, photo, active, reads } = body

        const updated = await prisma.enterpriseEmployee.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email: email || null }),
                ...(phone !== undefined && { phone: phone || null }),
                ...(role !== undefined && { role: role || null }),
                ...(department !== undefined && { department: department || null }),
                ...(nfcTag !== undefined && { nfcTag: nfcTag || null }),
                ...(photo !== undefined && { photo: photo || null }),
                ...(active !== undefined && { active }),
                ...(reads !== undefined && { reads }),
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("PATCH /api/enterprise/employees/[id] error:", error)
        return NextResponse.json({ error: "Failed to update employee" }, { status: 500 })
    }
}

// DELETE /api/enterprise/employees/[id] — delete employee
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })
        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

        const existing = await prisma.enterpriseEmployee.findFirst({
            where: { id, profileId: profile.id }
        })
        if (!existing) return NextResponse.json({ error: "Employee not found" }, { status: 404 })

        await prisma.enterpriseEmployee.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("DELETE /api/enterprise/employees/[id] error:", error)
        return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 })
    }
}
