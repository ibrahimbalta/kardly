import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/enterprise/employees — list all employees for this user's profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })
        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

        const employees = await prisma.enterpriseEmployee.findMany({
            where: { profileId: profile.id },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(employees)
    } catch (error) {
        console.error("GET /api/enterprise/employees error:", error)
        return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
    }
}

// POST /api/enterprise/employees — create a new employee
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        // Verify enterprise plan
        const userWithSub = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { subscription: true, profile: true }
        })
        const plan = userWithSub?.subscription?.plan || "free"
        if (plan !== "enterprise") {
            return NextResponse.json({ error: "Bu özellik yalnızca Enterprise planına sahip işletmelere özeldir." }, { status: 403 })
        }

        const profile = userWithSub?.profile
        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

        const body = await req.json()
        const { name, email, phone, role, department, nfcTag, photo, active } = body

        if (!name) return NextResponse.json({ error: "İsim zorunludur" }, { status: 400 })

        const employee = await prisma.enterpriseEmployee.create({
            data: {
                profileId: profile.id,
                name,
                email: email || null,
                phone: phone || null,
                role: role || null,
                department: department || null,
                nfcTag: nfcTag || null,
                photo: photo || null,
                active: active ?? true,
                reads: 0
            }
        })

        return NextResponse.json(employee)
    } catch (error) {
        console.error("POST /api/enterprise/employees error:", error)
        return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
    }
}
