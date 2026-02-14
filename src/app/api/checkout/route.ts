import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createCheckoutForm } from "@/services/iyzico"
import { PLANS } from "@/config/plans"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 })
        }

        const { planId } = await req.json()
        const plan = PLANS.find(p => p.id === planId)

        if (!plan || plan.price === 0) {
            return NextResponse.json({ error: "Geçersiz plan" }, { status: 400 })
        }

        // Call iyzico service
        const checkout = await createCheckoutForm({
            userId: session.user.id,
            planId: plan.id,
            price: plan.price,
            callbackUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/checkout/callback`
        })

        return NextResponse.json({ url: checkout.paymentPageUrl })
    } catch (error) {
        console.error("Checkout Error:", error)
        return NextResponse.json({ error: "Ödeme başlatılamadı" }, { status: 500 })
    }
}
