import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id }
    })

    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
    })

    const appointments = await prisma.appointment.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "desc" }
    })

    const products = await prisma.product.findMany({
        where: { profileId: profile?.id || "" },
        orderBy: { createdAt: "desc" }
    })

    const analytics = await prisma.analytics.findMany({
        where: { profileId: profile?.id || "" },
        orderBy: { createdAt: "desc" }
    })

    const reviews = await prisma.review.findMany({
        where: { profileId: profile?.id || "" },
        orderBy: { createdAt: "desc" }
    })

    // Calculate stats
    const totalViews = analytics.filter((a: any) => a.type === 'view').length
    const totalClicks = analytics.filter((a: any) => a.type.startsWith('click_')).length
    const clickRate = totalViews > 0 ? (totalClicks / totalViews * 100).toFixed(1) : "0"
    const vCardClicks = analytics.filter((a: any) => a.type === 'click_vcard').length

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
        recentAnalytics: analytics.slice(0, 50)
    }

    // If no profile, handle redirects (Admin goes to /admin, others to /onboarding)
    const isAdmin = session.user?.email === (process.env.ADMIN_EMAIL || "yanimdaki74@gmail.com")

    if (!profile) {
        if (isAdmin) {
            redirect("/admin")
        } else if (process.env.NODE_ENV !== 'development') {
            redirect("/onboarding")
        }
    }

    return (
        <DashboardClient
            session={session}
            profile={profile}
            subscription={subscription}
            appointments={appointments}
            products={products}
            reviews={reviews}
            stats={stats}
        />
    )
}
