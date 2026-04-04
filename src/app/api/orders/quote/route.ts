import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        // @ts-ignore
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
        }

        const body = await req.json()
        const {
            shippingName,
            shippingEmail,
            shippingPhone,
            shippingAddress,
            shippingCity,
            shippingDistrict,
            message,
            design // { tpl, orient, bg, acc, txt, font, patt }
        } = body

        if (!shippingName || !shippingEmail || !shippingPhone || !design) {
            return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 })
        }

        // Create the order as a quote request
        const order = await prisma.order.create({
            data: {
                // @ts-ignore
                userId: session.user.id,
                status: "quote_requested",
                totalAmount: 0, // Quote doesn't have a final amount yet
                currency: "TRY",
                shippingName,
                shippingEmail,
                shippingPhone,
                shippingAddress: shippingAddress || "",
                shippingCity: shippingCity || "",
                shippingDistrict: shippingDistrict || "",
                items: {
                    create: {
                        productType: "nfc_card",
                        quantity: 1,
                        price: 0,
                        templateId: design.tpl,
                        orientation: design.orient,
                        bgColor: design.bg,
                        accentColor: design.acc,
                        textColor: design.txt,
                        fontFamily: design.font,
                        pattern: design.patt
                    }
                }
            }
        })

        return NextResponse.json({ success: true, orderId: order.id })
    } catch (error) {
        console.error("[QUOTE_REQUEST_ERROR]", error)
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
    }
}
