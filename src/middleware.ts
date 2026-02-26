import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const { hostname, pathname, search } = request.nextUrl

    // 1. non-www -> www redirect (SSL cert is on www.kardly.site)
    if (hostname === "kardly.site") {
        const newUrl = new URL(`https://www.kardly.site${pathname}${search}`)
        return NextResponse.redirect(newUrl, 301)
    }

    // 2. Check cookie header size - if too large, clear all cookies and redirect to clear page
    const cookieHeader = request.headers.get("cookie") || ""
    const cookieSize = new TextEncoder().encode(cookieHeader).length

    // If cookies exceed 8KB, clear them aggressively (Vercel limit is 16KB per header)
    if (cookieSize > 8000) {
        // Redirect to the static clear.html page which handles cleanup client-side
        const clearUrl = new URL("/clear.html", request.url)
        const response = NextResponse.redirect(clearUrl)

        // Also try server-side cookie clearing
        const allCookies = request.cookies.getAll()
        for (const cookie of allCookies) {
            response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" })
            response.cookies.set(cookie.name, "", { maxAge: 0, path: "/", domain: ".kardly.site" })
            response.cookies.set(cookie.name, "", { maxAge: 0, path: "/", domain: "www.kardly.site" })
        }

        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match ALL paths except static assets.
         * This ensures cookie checking works everywhere including api routes.
         */
        "/((?!_next/static|_next/image|favicon.ico|icons|sw.js|manifest.json|clear.html).*)",
    ],
}
