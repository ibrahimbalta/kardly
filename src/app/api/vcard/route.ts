import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { generateVCard } from "@/lib/vcard"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")

    if (!username) {
        return NextResponse.json({ error: "Username required" }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({
        where: { username },
        include: { user: true }
    })

    if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const vCard = generateVCard(profile)

    return new NextResponse(vCard, {
        headers: {
            "Content-Type": "text/vcard",
            "Content-Disposition": `attachment; filename="${username}.vcf"`
        }
    })
}
