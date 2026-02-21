import { NextResponse } from "next/server"
import { generateQRCode } from "@/lib/qr"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")

    if (!username) {
        return NextResponse.json({ error: "Username required" }, { status: 400 })
    }

    const dark = searchParams.get("dark") || "#0f172a"
    const light = searchParams.get("light") || "#ffffff"

    const url = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/${username}`
    const qrCode = await generateQRCode(url, { dark, light })

    return NextResponse.json({ qrCode })
}
