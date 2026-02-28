import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "dummy",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy",
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "Email Girişi",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Şifre", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email ve şifre gereklidir.")
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || !user.password) {
                    throw new Error("Kullanıcı bulunamadı veya şifre ayarlanmamış.")
                }

                const bcrypt = await import("bcryptjs")
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    throw new Error("Hatalı şifre.")
                }

                return user
            }
        })
    ],
    callbacks: {
        signIn: async ({ user, account }: any) => {
            if (account?.provider === "credentials") return true // Authorize handles this

            // For Google or other providers, check status in DB
            const dbUser = await prisma.user.findUnique({
                where: { email: user.email }
            })

            if (dbUser && dbUser.isActive === false) {
                return false // Deny access
            }
            return true
        },
        session: async ({ session, token }: any) => {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
        jwt: async ({ token, user }: any) => {
            if (user) {
                token.id = user.id
            }
            return token
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 gün
    },
    cookies: {
        sessionToken: {
            name: `kardly-session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                domain: process.env.NODE_ENV === "production" ? "www.kardly.site" : undefined,
                secure: process.env.NODE_ENV === "production"
            }
        },
        callbackUrl: {
            name: `kardly-callback-url`,
            options: {
                sameSite: 'lax',
                path: '/',
                domain: process.env.NODE_ENV === "production" ? "www.kardly.site" : undefined,
                secure: process.env.NODE_ENV === "production"
            }
        },
        csrfToken: {
            name: `kardly-csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                domain: process.env.NODE_ENV === "production" ? "www.kardly.site" : undefined,
                secure: process.env.NODE_ENV === "production"
            }
        }
    },
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    debug: false, // Üretim ortamında kapalı tutmak header boyutunu azaltır
    secret: process.env.NEXTAUTH_SECRET,
}
