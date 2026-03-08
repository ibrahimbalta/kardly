import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { RegisterSchema } from "@/lib/validations"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Zod ile doğrulama yap
        const validation = RegisterSchema.safeParse(body)

        if (!validation.success) {
            const error = validation.error.issues[0].message
            return NextResponse.json({ error }, { status: 400 })
        }

        const { email, password } = validation.data

        // Kullanıcı var mı kontrol et
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: "Bu email adresi zaten kullanımda." }, { status: 400 })
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10)

        // Kullanıcıyı oluştur
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: email.split('@')[0],
            }
        })

        return NextResponse.json({
            message: "Kayıt başarılı.",
            userId: user.id
        }, { status: 201 })
    } catch (error: any) {
        console.error("Register Error:", error)
        return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 })
    }
}
