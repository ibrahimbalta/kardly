import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get("host") || ""
    const { pathname, search } = url

    // 1. non-www -> www redirect (For main site stability)
    if (hostname === "kardly.site") {
        return NextResponse.redirect(new URL(`https://www.kardly.site${pathname}${search}`, request.url), 301)
    }

    // 2. Subdomain Routing Logic
    // Detect if we are on a subdomain (e.g., ibrahim.kardly.site)
    // But NOT on www.kardly.site or localhost/preview domains
    const rootDomain = "kardly.site"
    const isSubdomain = hostname.endsWith(`.${rootDomain}`) && hostname !== `www.${rootDomain}`

    if (isSubdomain) {
        const subdomain = hostname.replace(`.${rootDomain}`, "")

        // Prevent recursive rewriting if path already starts with /[subdomain]
        if (pathname.startsWith(`/${subdomain}`)) {
            return NextResponse.next()
        }

        // Rewrite: ibrahim.kardly.site/ -> kardly.site/[username]
        // This keeps the URL in the browser as ibrahim.kardly.site
        return NextResponse.rewrite(new URL(`/${subdomain}${pathname}${search}`, request.url))
    }

    // 3. Cookie Header Size Check (Security & Stability)
    const cookieHeader = request.headers.get("cookie") || ""
    const cookieSize = new TextEncoder().encode(cookieHeader).length

    if (cookieSize > 8000) {
        const clearUrl = new URL("/clear.html", request.url)
        const response = NextResponse.redirect(clearUrl)
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
         * Match ALL paths except static assets.
         */
        "/((?!_next/static|_next/image|favicon.ico|icons|sw.js|manifest.json|clear.html).*)",
    ],
}
