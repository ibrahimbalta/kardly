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
        let urlObj: URL
        try {
            urlObj = new URL(fileUrl)
        } catch {
            return NextResponse.json({ error: "Geçersiz URL formatı", url: fileUrl }, { status: 400 })
        }

        if (!allowedDomains.some(d => urlObj.hostname.includes(d))) {
            // Cloudinary değilse doğrudan yönlendir
            return NextResponse.redirect(fileUrl)
        }

        // Dosyayı Cloudinary'den çek
        const response = await fetch(fileUrl, {
            headers: {
                'Accept': '*/*',
            }
        })

        if (!response.ok) {
            // İlk URL çalışmazsa, versiyon numarasını kaldırarak tekrar dene
            // Cloudinary URL: .../image/upload/v1234567890/folder/file.pdf
            // Versiyonsuz: .../image/upload/folder/file.pdf
            const versionlessUrl = fileUrl.replace(/\/v\d+\//, '/')
            if (versionlessUrl !== fileUrl) {
                const retryResponse = await fetch(versionlessUrl, {
                    headers: { 'Accept': '*/*' }
                })
                if (retryResponse.ok) {
                    const buffer = await retryResponse.arrayBuffer()
                    let contentType = retryResponse.headers.get("content-type") || "application/octet-stream"
                    if (fileUrl.toLowerCase().endsWith(".pdf")) contentType = "application/pdf"
                    
                    return new NextResponse(buffer, {
                        status: 200,
                        headers: {
                            "Content-Type": contentType,
                            "Content-Disposition": "inline",
                            "Cache-Control": "public, max-age=86400",
                        },
                    })
                }
            }
            
            // Her iki URL de başarısız olursa, doğrudan Cloudinary URL'sine yönlendir
            return NextResponse.redirect(fileUrl)
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
        return NextResponse.json({ error: "Dosya yüklenemedi", details: error?.message }, { status: 500 })
    }
}
