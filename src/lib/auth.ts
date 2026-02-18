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
        // TEST İÇİN: Herhangi bir email ile giriş yapmayı sağlar
        CredentialsProvider({
            name: "Test Girişi",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "test@example.com" }
            },
            async authorize(credentials) {
                if (!credentials?.email) return null

                // Kullanıcıyı bul veya oluştur
                const user = await prisma.user.upsert({
                    where: { email: credentials.email },
                    update: {},
                    create: {
                        email: credentials.email,
                        name: credentials.email.split('@')[0],
                    }
                })
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
        strategy: "jwt", // Credentials provider için JWT şart
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === "production"
            }
        },
        callbackUrl: {
            name: `next-auth.callback-url`,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === "production"
            }
        },
        csrfToken: {
            name: `next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === "production"
            }
        },
    }
}
