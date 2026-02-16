import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { Globe } from "lucide-react"
import ProfileClient from "./ProfileClient"

export default async function ProfilePage({ params }: any) {
    const { username } = await params

    // Fetch profile from database
    const profile = await prisma.profile.findUnique({
        where: { username },
        include: {
            user: {
                include: {
                    subscription: true
                }
            },
            blocks: {
                where: { isActive: true },
                orderBy: { order: "asc" }
            },
            products: {
                where: { isActive: true },
                orderBy: { createdAt: "desc" }
            },
            reviews: {
                where: { isActive: true },
                orderBy: { createdAt: "desc" }
            }
        }
    })

    // Mock data for initial preview if profile not found (for development)
    if (!profile) {
        if (process.env.NODE_ENV === 'development') {
            return <ProfilePreview username={username} />
        }
        return notFound()
    }

    // Log Analytics (Fire and forget or async)
    // In a real app, this should be handled carefully to not block the request
    const { headers } = await import("next/headers")
    const headerList = await headers()
    const userAgent = headerList.get("user-agent")
    const referrer = headerList.get("referer")

    // Log in background
    prisma.analytics.create({
        data: {
            profileId: profile.id,
            userAgent,
            referrer,
        }
    }).catch((e: any) => console.error("Analytics error:", e))

    return <ProfileClient profile={profile} />
}

function ProfilePreview({ username }: { username: string }) {
    return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 text-center">
            <div className="max-w-md">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Globe className="text-indigo-500 w-10 h-10 animate-pulse" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Profil Bulunamadı</h1>
                <p className="text-white/60 mb-8">
                    Geliştirme aşamasındasın. Eğer veritabanı aktifse <span className="text-indigo-400 font-bold">@{username}</span> adına bir profil oluşturman gerekiyor.
                </p>
                <div className="p-6 glass rounded-2xl border-white/5 text-left mb-8">
                    <h3 className="font-bold text-sm text-indigo-400 uppercase tracking-widest mb-4">Geliştirici Notu:</h3>
                    <ol className="text-sm space-y-3 text-white/50">
                        <li>1. PostgreSQL veritabanını hayata geçir.</li>
                        <li>2. `npx prisma db push` komutunu çalıştır.</li>
                        <li>3. Onboarding akışını tamamla.</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
