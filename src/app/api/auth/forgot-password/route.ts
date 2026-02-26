import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email adresi gereklidir." }, { status: 400 });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Even if user not found, don't reveal to prevent email enumerations (standard security practice)
        if (!user || user.isActive === false) {
            // But for development/feedback we could make it clearer or just say sent.
            return NextResponse.json({ message: "Eğer bu email adresi kayıtlı ise sıfırlama linki gönderilmiştir." });
        }

        // Create reset token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600 * 1000); // 1 hour from now

        // Check if token already exists for this email
        const existingToken = await prisma.passwordResetToken.findFirst({
            where: { email }
        });

        if (existingToken) {
            await prisma.passwordResetToken.delete({
                where: { id: existingToken.id }
            });
        }

        await prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expires
            }
        });

        // Send email
        await sendPasswordResetEmail(email, token);

        return NextResponse.json({ message: "Sıfırlama linki başarıyla gönderildi." });

    } catch (error) {
        console.error("Forgot password API error:", error);
        return NextResponse.json({ error: "Bir iç sunucu hatası oluştu." }, { status: 500 });
    }
}
