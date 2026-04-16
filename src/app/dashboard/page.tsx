import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import DashboardClient from "./DashboardClient"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    try {
        const resolvedSearchParams = await searchParams;
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            const params = new URLSearchParams()
            Object.entries(resolvedSearchParams).forEach(([key, value]) => {
                if (value) params.set(key, String(value))
            })
            const queryString = params.toString()
            const callbackUrl = `/dashboard${queryString ? `?${queryString}` : ""}`
            redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                profile: true,
                subscription: true
            }
        })

        if (!user || user.isActive === false) {
            redirect("/login?error=account_disabled")
        }

        const profile = user.profile
        const subscription = user.subscription

        // If no profile, handle redirects (Admin goes to /admin, others to /onboarding)
        const isAdmin = session.user?.email === (process.env.ADMIN_EMAIL || "yanimdaki74@gmail.com")

        if (!profile) {
            if (isAdmin) {
                redirect("/admin")
            } else {
                redirect("/onboarding")
            }
        }

        const [appointments, products, analytics, reviews, leads] = await Promise.all([
            prisma.appointment.findMany({
                where: { userId: session.user.id },
                orderBy: { date: "desc" }
            }),
            prisma.product.findMany({
                where: { profileId: profile.id },
                orderBy: { createdAt: "desc" }
            }),
            prisma.analytics.findMany({
                where: { profileId: profile.id },
                orderBy: { createdAt: "desc" }
            }),
            prisma.review.findMany({
                where: { profileId: profile.id },
                orderBy: { createdAt: "desc" }
            }),
            prisma.lead.findMany({
                where: { profileId: profile.id },
                orderBy: { createdAt: "desc" }
            })
        ])

        // Calculate stats
        const totalViews = analytics.filter((a: any) => a.type === 'view').length
        const totalClicks = analytics.filter((a: any) => a.type.startsWith('click_')).length
        const clickRate = totalViews > 0 ? (totalClicks / totalViews * 100).toFixed(1) : "0"
        const vCardClicks = analytics.filter((a: any) => a.type === 'click_vcard').length

        // Channel Performance (Referrer) Stats
        const instagramCount = analytics.filter((a: any) => a.type === 'view' && a.referrer?.toLowerCase()?.includes('instagram')).length
        const whatsappCount = analytics.filter((a: any) => a.type === 'view' && (a.referrer?.toLowerCase()?.includes('whatsapp') || a.referrer?.toLowerCase()?.includes('wa.me'))).length
        const directCount = analytics.filter((a: any) => a.type === 'view' && (!a.referrer || a.referrer === '')).length
        const otherCount = totalViews - (instagramCount + whatsappCount + directCount)

        const stats = {
            totalViews,
            clickRate: clickRate + "%",
            vCardClicks,
            cvClicks: analytics.filter((a: any) => a.type === 'click_cv').length,
            projectClicks: analytics.filter((a: any) => a.type === 'click_product').length,
            waClicks: analytics.filter((a: any) => a.type === 'click_whatsapp').length,
            phoneClicks: analytics.filter((a: any) => a.type === 'click_phone').length,
            emailClicks: analytics.filter((a: any) => a.type === 'click_email').length,
            shareClicks: analytics.filter((a: any) => a.type === 'click_share').length,
            appointmentClicks: analytics.filter((a: any) => a.type === 'click_appointment').length,
            websiteClicks: analytics.filter((a: any) => a.type === 'click_website').length,
            locationClicks: analytics.filter((a: any) => a.type === 'click_location').length,
            reviewCount: reviews.length,
            channelStats: {
                instagram: instagramCount,
                whatsapp: whatsappCount,
                direct: directCount,
                others: Math.max(0, otherCount)
            },
            recentAnalytics: analytics.slice(0, 50)
        }

        // Serialization fix using JSON.parse(JSON.stringify())
        // This ensures complex objects like Dates or BigInts are safely passed to the Client Component
        const serializedData = JSON.parse(JSON.stringify({
            session,
            profile,
            subscription,
            appointments,
            products,
            reviews,
            leads,
            stats
        }))

        return (
            <DashboardClient
                session={serializedData.session}
                profile={serializedData.profile}
                subscription={serializedData.subscription}
                appointments={serializedData.appointments}
                products={serializedData.products}
                reviews={serializedData.reviews}
                leads={serializedData.leads}
                stats={serializedData.stats}
            />
        )
    } catch (error) {
        console.error("Dashboard error:", error)
        // Check if error is a redirect, if so, re-throw it (Next.js handles redirects via errors)
        if (error instanceof Error && (error.message.includes('NEXT_REDIRECT') || (error as any).digest?.includes('NEXT_REDIRECT'))) {
            throw error;
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Sistem Hatası</h1>
                    <p className="text-slate-600 mb-8">Dashboard yüklenirken bir sorun oluştu. Lütfen sayfayı yenilemeyi deneyin.</p>
                    <a
                        href="/dashboard"
                        className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-indigo-200 text-center"
                    >
                        Sayfayı Yenile
                    </a>
                    <p className="mt-4 text-xs text-slate-400 font-mono">Hata: {error instanceof Error ? error.message : "Unknown error"}</p>
                </div>
            </div>
        )
    }
}

