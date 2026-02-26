import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const { hostname, pathname, search } = request.nextUrl

    // 1. www -> non-www redirect (prevents cookie duplication)
    if (hostname === "www.kardly.site") {
        const newUrl = new URL(`https://kardly.site${pathname}${search}`)
        return NextResponse.redirect(newUrl, 301)
    }

    // 2. Check cookie header size - if too large, clear all cookies and redirect to login
    const cookieHeader = request.headers.get("cookie") || ""
    const cookieSize = new TextEncoder().encode(cookieHeader).length

    // If cookies exceed 12KB (well under the 16KB limit), clear them
    if (cookieSize > 12000) {
        const loginUrl = new URL("/login", request.url)
        const response = NextResponse.redirect(loginUrl)

        // Delete all known auth cookies
        const cookiesToClear = [
            "kardly-session-token",
            "kardly-callback-url",
            "kardly-csrf-token",
            "__Secure-next-auth.session-token",
            "__Host-next-auth.csrf-token",
            "next-auth.session-token",
            "next-auth.callback-url",
            "next-auth.csrf-token",
            "__Secure-next-auth.callback-url",
        ]

        for (const name of cookiesToClear) {
            // Clear for all possible domain variations
            response.cookies.set(name, "", { maxAge: 0, path: "/" })
            response.cookies.set(name, "", { maxAge: 0, path: "/", domain: ".kardly.site" })
            response.cookies.set(name, "", { maxAge: 0, path: "/", domain: "kardly.site" })
            response.cookies.set(name, "", { maxAge: 0, path: "/", domain: "www.kardly.site" })
        }

        // Also try to clear any cookie that starts with common prefixes
        const allCookies = request.cookies.getAll()
        for (const cookie of allCookies) {
            response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" })
            response.cookies.set(cookie.name, "", { maxAge: 0, path: "/", domain: ".kardly.site" })
        }

        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - api routes (they handle their own auth)
         * - static files
         * - images
         * - favicon
         */
        "/((?!api|_next/static|_next/image|favicon.ico|icons|sw.js|manifest.json).*)",
    ],
}
