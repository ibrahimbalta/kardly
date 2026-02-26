import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
        }

        // Find token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        if (!resetToken) {
            return NextResponse.json({ error: "Geçersiz veya süresi dolmuş token." }, { status: 400 });
        }

        // Check if expired
        if (new Date() > resetToken.expires) {
            await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
            return NextResponse.json({ error: "Token süresi dolmuş." }, { status: 400 });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: resetToken.email }
        });

        if (!user) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        // Delete token after successful reset
        await prisma.passwordResetToken.delete({
            where: { id: resetToken.id }
        });

        return NextResponse.json({ message: "Şifreniz başarıyla güncellendi." });

    } catch (error) {
        console.error("Reset password API error:", error);
        return NextResponse.json({ error: "Bir iç sunucu hatası oluştu." }, { status: 500 });
    }
}
