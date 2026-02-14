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

    // Calculate stats
    const totalViews = analytics.filter((a: any) => a.type === 'view').length
    const totalClicks = analytics.filter((a: any) => a.type.startsWith('click_')).length
    const clickRate = totalViews > 0 ? (totalClicks / totalViews * 100).toFixed(1) : "0"
    const vCardClicks = analytics.filter((a: any) => a.type === 'click_vcard').length

    const stats = {
        totalViews,
        clickRate: clickRate + "%",
        vCardClicks,
        recentAnalytics: analytics.slice(0, 10)
    }

    // If no profile, handle redirects (Admin goes to /admin, others to /onboarding)
    const isAdmin = session.user?.email === (process.env.ADMIN_EMAIL || "crmanaliz@gmail.com")

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
            stats={stats}
        />
    )
}
