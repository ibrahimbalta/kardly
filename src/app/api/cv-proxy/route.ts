import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const fileUrl = searchParams.get("url")

        if (!fileUrl) {
            return NextResponse.json({ error: "URL parametresi gerekli" }, { status: 400 })
        }

        // Sadece güvenilir domainlerden dosya çekmeye izin ver
        const allowedDomains = ["res.cloudinary.com", "cloudinary.com"]
        const urlObj = new URL(fileUrl)
        if (!allowedDomains.some(d => urlObj.hostname.includes(d))) {
            return NextResponse.json({ error: "Bu domain desteklenmiyor" }, { status: 403 })
        }

        // Dosyayı Cloudinary'den çek
        const response = await fetch(fileUrl)
        if (!response.ok) {
            return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 })
        }

        const buffer = await response.arrayBuffer()

        // Content type belirleme
        let contentType = response.headers.get("content-type") || "application/octet-stream"
        
        // PDF uzantısı varsa content type'ı zorla
        if (fileUrl.toLowerCase().endsWith(".pdf")) {
            contentType = "application/pdf"
        } else if (fileUrl.toLowerCase().endsWith(".doc")) {
            contentType = "application/msword"
        } else if (fileUrl.toLowerCase().endsWith(".docx")) {
            contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": "inline",
                "Cache-Control": "public, max-age=86400",
            },
        })
    } catch (error: any) {
        console.error("CV Proxy Error:", error)
        return NextResponse.json({ error: "Dosya yüklenemedi" }, { status: 500 })
    }
}
