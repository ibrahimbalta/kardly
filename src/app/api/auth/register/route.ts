import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Email ve şifre gereklidir." }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Şifre en az 6 karakter olmalıdır." }, { status: 400 })
        }

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
