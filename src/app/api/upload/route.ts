import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Sadece JPG, PNG, WebP ve GIF dosyaları yüklenebilir" }, { status: 400 })
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "Dosya boyutu 5MB'dan küçük olmalıdır" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), "public", "uploads")
        await mkdir(uploadsDir, { recursive: true })

        // Generate unique filename
        const ext = file.name.split(".").pop() || "jpg"
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
        const filePath = path.join(uploadsDir, uniqueName)

        await writeFile(filePath, buffer)

        const url = `/uploads/${uniqueName}`
        return NextResponse.json({ url })
    } catch (error) {
        console.error("Upload Error:", error)
        return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 })
    }
}
