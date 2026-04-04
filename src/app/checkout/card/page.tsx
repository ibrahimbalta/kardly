import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import CheckoutClient from "./CheckoutClient"

export const metadata = {
  title: "Fiziksel Kart Teklifi Al | Kardly",
  description: "Özel tasarım NFC kartınız için hemen fiyat teklifi alın.",
}

export default async function CheckoutPage() {
    const session = await getServerSession(authOptions)
    
    if (!session) {
        redirect("/login?callbackUrl=/checkout/card")
    }

    const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id }
    })

    if (!profile) {
        redirect("/dashboard")
    }

    // Pass the profile data and user info to client
    return (
        <main className="min-h-screen bg-slate-50 pt-20 pb-12">
            <CheckoutClient 
                user={session.user as any} 
                profileData={profile} 
            />
        </main>
    )
}
