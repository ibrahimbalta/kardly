import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    console.log(`Password reset link for ${email}: ${resetUrl}`);

    // If SMTP settings are provided, send an actual email
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Kardly" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Şifre Sıfırlama İsteği",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #FF3B6B;">Kardly.</h2>
                    <p>Şifrenizi sıfırlamak istediniz.</p>
                    <p>Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #FF3B6B; color: white; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 20px;">Şifremi Sıfırla</a>
                    <p style="margin-top: 20px; color: #666; font-size: 12px;">Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
                </div>
            `,
        });
    } else {
        console.warn("SMTP settings are not provided. Email not sent.");
    }
};
