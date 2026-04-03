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
            from: `"KARDLY.SİTE" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Şifre Sıfırlama İsteği",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #FF3B6B;">KARDLY.SİTE</h2>
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
export const sendAppointmentConfirmationEmail = async (email: string, clientName: string, date: string, time: string) => {
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
            from: `"KARDLY.SİTE" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Randevunuz Onaylandı! ✅",
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px; background-color: #ffffff; color: #1a1a1a;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <span style="font-size: 24px; font-weight: 900; color: #FF3B6B; letter-spacing: -0.5px;">KARDLY.SİTE</span>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 40px;">
                        <div style="width: 64px; height: 64px; background-color: #ecfdf5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                            <span style="font-size: 32px;">✅</span>
                        </div>
                        <h1 style="font-size: 24px; font-weight: 800; margin: 0; color: #111827;">Randevunuz Onaylandı!</h1>
                        <p style="font-size: 16px; color: #6b7280; margin-top: 8px;">Harika haber! Randevu talebiniz başarıyla onaylandı.</p>
                    </div>

                    <div style="background-color: #f9fafb; border-radius: 20px; padding: 30px; margin-bottom: 30px;">
                        <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-top: 0; margin-bottom: 20px;">Randevu Detayları</h3>
                        
                        <div style="margin-bottom: 15px;">
                            <p style="font-size: 12px; color: #9ca3af; margin: 0; margin-bottom: 4px; text-transform: uppercase;">Danışan</p>
                            <p style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 0;">${clientName}</p>
                        </div>

                        <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 20px;">
                            <div style="margin-bottom: 15px;">
                                <p style="font-size: 12px; color: #9ca3af; margin: 0; margin-bottom: 4px; text-transform: uppercase;">Tarih</p>
                                <p style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 0;">${date}</p>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <p style="font-size: 12px; color: #9ca3af; margin: 0; margin-bottom: 4px; text-transform: uppercase;">Saat</p>
                                <p style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 0;">${time}</p>
                            </div>
                        </div>
                    </div>

                    <div style="text-align: center; border-top: 1px solid #f0f0f0; padding-top: 30px;">
                        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                            Hatırlatma: Randevu saatinde hazır olmanızı rica ederiz.<br>
                            Sorularınız için bizimle iletişime geçebilirsiniz.
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 40px;">
                        <p style="font-size: 12px; color: #9ca3af;">
                            &copy; ${new Date().getFullYear()} KARDLY.SİTE - Tüm hakları saklıdır.
                        </p>
                    </div>
                </div>
            `,
        });
    } else {
        console.warn("SMTP settings are not provided. Email not sent.");
    }
};
