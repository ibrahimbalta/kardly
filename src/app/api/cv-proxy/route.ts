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
        console.log("Proxying file:", fileUrl)
        const response = await fetch(fileUrl, {
            headers: {
                'Accept': '*/*',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            }
        })

        if (!response.ok) {
            console.error(`Cloudinary error ${response.status}:`, response.statusText)
            
            // İlk URL çalışmazsa, versiyon numarasını kaldırarak tekrar dene
            const versionlessUrl = fileUrl.replace(/\/v\d+\//, '/')
            if (versionlessUrl !== fileUrl) {
                console.log("Retrying without version:", versionlessUrl)
                const retryResponse = await fetch(versionlessUrl, {
                    headers: { 
                        'Accept': '*/*',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
                    }
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
            
            // Eğer 404 veya 401 ise, bir de 'raw' denemeyi deneyelim (her ihtimale karşı)
            if (fileUrl.includes('/image/upload/') && (response.status === 404 || response.status === 401)) {
                const rawUrl = fileUrl.replace('/image/upload/', '/raw/upload/')
                console.log("Retrying as raw:", rawUrl)
                const rawResponse = await fetch(rawUrl, {
                    headers: { 
                        'Accept': '*/*',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
                    }
                })
                if (rawResponse.ok) {
                    const buffer = await rawResponse.arrayBuffer()
                    return new NextResponse(buffer, {
                        status: 200,
                        headers: {
                            "Content-Type": "application/pdf",
                            "Content-Disposition": "inline",
                        },
                    })
                }
            }

            // Her şeye rağmen başarısız olursa, bir hata mesajı dön ama redirect yapma (kullanıcı hatayı görsün)
            return NextResponse.json({ 
                error: "Dosya Cloudinary tarafından reddedildi", 
                status: response.status,
                url: fileUrl 
            }, { status: response.status })
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
