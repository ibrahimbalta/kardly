import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import * as cheerio from "cheerio"
import cloudinary from "@/lib/cloudinary"
import { categorizeLinks } from "@/services/ai"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 })
        }

        const { url } = await req.json()

        if (!url || !url.includes("linktr.ee")) {
            return NextResponse.json({ error: "Geçerli bir Linktree URL'si giriniz" }, { status: 400 })
        }

        // Fetch Linktree HTML
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        })

        if (!response.ok) {
            return NextResponse.json({ error: "Linktree profili bulunamadı veya erişilemedi" }, { status: 404 })
        }

        const html = await response.text()
        const $ = cheerio.load(html)
        const nextData = $("#__NEXT_DATA__").text()

        if (!nextData) {
            return NextResponse.json({ error: "Profil verisi çekilemedi" }, { status: 500 })
        }

        const parsedData = JSON.parse(nextData)
        // Linktree structure can vary slightly between profiles
        const account = parsedData?.props?.pageProps?.account || parsedData?.props?.pageProps?.profile || parsedData?.props?.pageProps
        const linksData = parsedData?.props?.pageProps?.links || account?.links || []

        if (!account && !linksData.length) {
            return NextResponse.json({ error: "Profil verisi ayrıştırılamadı" }, { status: 500 })
        }

        // Extract Profile Image & Info
        const displayName = account?.pageTitle || account?.username || account?.name || ""
        const bio = account?.bio || account?.description || ""
        let profileImageUrl = account?.profilePictureUrl || account?.image || ""

        // Auto-upload profile image to Cloudinary if it exists
        if (profileImageUrl) {
            try {
                const uploadResult = await cloudinary.uploader.upload(profileImageUrl, {
                    folder: "kardly_profiles",
                    resource_type: "image"
                })
                profileImageUrl = uploadResult.secure_url
            } catch (err) {
                console.error("Linktree Image Upload Error:", err)
                // Fallback: keep the original URL if upload fails
            }
        }

        // Extract and Categorize Links
        const rawLinks = linksData.map((l: any) => ({
            title: l.title,
            url: l.url
        })).filter((l: any) => l.title && l.url)

        const categorizedLinks = await categorizeLinks(rawLinks)

        const result = {
            displayName: account?.pageTitle || account?.username || "",
            bio: bio,
            image: profileImageUrl,
            links: categorizedLinks || []
        }

        return NextResponse.json(result)

    } catch (error: any) {
        console.error("Linktree Import API Error:", error)
        return NextResponse.json({ error: "İçe aktarma sırasında bir hata oluştu" }, { status: 500 })
    }
}
