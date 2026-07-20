import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// POST /api/p/lead — Public endpoint for visitors scanning employee QR code to leave contact details
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { employeeId, name, phone, email, subject, message } = body

        if (!employeeId || !name) {
            return NextResponse.json({ error: "İsim alanı zorunludur." }, { status: 400 })
        }

        // Find employee and get their profileId
        const employee = await prisma.enterpriseEmployee.findUnique({
            where: { id: employeeId },
            include: {
                profile: true
            }
        })

        if (!employee) {
            return NextResponse.json({ error: "Personel kaydı bulunamadı." }, { status: 404 })
        }

        // Create a lead linked to the company profile
        const lead = await prisma.lead.create({
            data: {
                profileId: employee.profileId,
                name: name,
                phone: phone || null,
                email: email || null,
                subject: subject || `Personel İletişimi: ${employee.name}`,
                message: message ? `[İlgili Personel: ${employee.name} (${employee.department || 'Genel'})]\n${message}` : `[İlgili Personel: ${employee.name} (${employee.department || 'Genel'})] Personel kartvizitinden iletişime geçildi.`,
                status: "new"
            }
        })

        // Also increment employee read/scan counter
        await prisma.enterpriseEmployee.update({
            where: { id: employeeId },
            data: { reads: { increment: 1 } }
        }).catch(() => {})

        return NextResponse.json({ success: true, leadId: lead.id })
    } catch (error) {
        console.error("POST /api/p/lead error:", error)
        return NextResponse.json({ error: "İletişim talebi gönderilemedi." }, { status: 500 })
    }
}
