import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import AdminDashboardClient from "./AdminDashboardClient"

export default async function AdminPage() {
    const session = await getServerSession(authOptions)

    // Admin email check
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        redirect("/dashboard")
    }

    // Fetch all global data
    const users = await prisma.user.findMany({
        include: {
            profile: true,
            subscription: true,
        },
        orderBy: { id: 'desc' }
    })

    const payments = await prisma.payment.findMany({
        include: {
            user: true
        },
        orderBy: { createdAt: 'desc' }
    })

    const analyticsSummary = await prisma.analytics.aggregate({
        _count: {
            id: true
        }
    })

    const stats = {
        totalUsers: users.length,
        totalRevenue: payments.filter(p => p.status === 'success').reduce((acc, p) => acc + p.amount, 0),
        totalViews: analyticsSummary._count.id,
        activeSubscriptions: users.filter(u => u.subscription?.status === 'active' && u.subscription?.plan !== 'free').length
    }

    return (
        <AdminDashboardClient
            users={users}
            payments={payments}
            stats={stats}
        />
    )
}
