import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import cloudinary from "@/lib/cloudinary"

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
        const allowedTypes = [
            "image/jpeg", 
            "image/png", 
            "image/webp", 
            "image/gif", 
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Sadece JPG, PNG, PDF ve Word dosyaları yüklenebilir" }, { status: 400 })
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "Dosya boyutu 5MB'dan küçük olmalıdır" }, { status: 400 })
        }

        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error("Cloudinary credentials are missing!")
            return NextResponse.json({ error: "Sunucu yapılandırma hatası (Cloudinary)" }, { status: 500 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Convert the buffer to a base64 string
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`

        // Upload to Cloudinary using the base64 string
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: "kardly_uploads",
            resource_type: "auto",
        });

        return NextResponse.json({ url: result.secure_url })
    } catch (error: any) {
        console.error("Upload Error Details:", error)
        return NextResponse.json({
            error: "Yükleme başarısız",
            details: error?.message || "Bilinmeyen hata"
        }, { status: 500 })
    }
}
