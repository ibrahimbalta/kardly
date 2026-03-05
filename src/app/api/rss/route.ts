import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        let feedUrl = searchParams.get('url')

        if (!feedUrl) {
            return NextResponse.json({ error: "URL parametresi gerekli" }, { status: 400 })
        }

        // Decode if needed
        try { feedUrl = decodeURIComponent(feedUrl) } catch { }

        // Add https if missing
        if (!feedUrl.startsWith('http')) feedUrl = `https://${feedUrl}`

        // Auto-convert Medium profile URLs to feed URLs
        if (feedUrl.includes('medium.com/') && !feedUrl.includes('/feed/') && !feedUrl.includes('/feed/@')) {
            feedUrl = feedUrl.replace('medium.com/', 'medium.com/feed/')
        }

        // Auto-convert Substack profile URLs to feed URLs
        if (feedUrl.includes('.substack.com') && !feedUrl.endsWith('/feed') && !feedUrl.includes('/feed/')) {
            feedUrl = feedUrl.replace(/\/$/, '') + '/feed'
        }

        // Fetch the RSS feed from the server side (no CORS issues)
        const response = await fetch(feedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; KardlyBot/1.0)',
                'Accept': 'application/rss+xml, application/xml, text/xml, */*'
            },
            next: { revalidate: 300 } // Cache for 5 minutes
        })

        if (!response.ok) {
            return NextResponse.json({ error: "RSS beslemesi alınamadı", status: response.status }, { status: 502 })
        }

        const xml = await response.text()

        // Parse XML to extract items
        const items = parseRssItems(xml)

        return NextResponse.json({
            status: 'ok',
            items: items.slice(0, 5)
        })
    } catch (error) {
        console.error("RSS proxy error:", error)
        return NextResponse.json({ error: "RSS işlenirken hata oluştu" }, { status: 500 })
    }
}

function parseRssItems(xml: string): any[] {
    const items: any[] = []

    // Try to find <item> tags (RSS 2.0) or <entry> tags (Atom)
    const isAtom = xml.includes('<entry')
    const itemRegex = isAtom
        ? /<entry[\s>]([\s\S]*?)<\/entry>/gi
        : /<item[\s>]([\s\S]*?)<\/item>/gi

    let match
    while ((match = itemRegex.exec(xml)) !== null) {
        const content = match[1]

        const title = extractTag(content, 'title')
        const link = isAtom ? extractAtomLink(content) : extractTag(content, 'link')
        const pubDate = extractTag(content, isAtom ? 'published' : 'pubDate') || extractTag(content, 'updated')
        const author = extractTag(content, isAtom ? 'name' : 'dc:creator') || extractTag(content, 'author')
        const description = extractTag(content, isAtom ? 'summary' : 'description')

        // Try to extract thumbnail from content or media tags
        let thumbnail = ''
        const mediaMatch = content.match(/url="([^"]+\.(jpg|jpeg|png|webp|gif)[^"]*)"/i)
        if (mediaMatch) {
            thumbnail = mediaMatch[1]
        } else {
            const imgMatch = (description || content).match(/<img[^>]+src="([^"]+)"/i)
            if (imgMatch) thumbnail = imgMatch[1]
        }

        // Clean HTML from description for a short summary
        const cleanDesc = (description || '')
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .trim()
            .substring(0, 200)

        if (title) {
            items.push({
                title: title.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim(),
                link,
                pubDate,
                author: author?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() || '',
                thumbnail,
                description: cleanDesc
            })
        }
    }

    return items
}

function extractTag(content: string, tag: string): string {
    // Handle CDATA
    const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i')
    const cdataMatch = content.match(cdataRegex)
    if (cdataMatch) return cdataMatch[1].trim()

    // Handle regular tags
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
    const match = content.match(regex)
    return match ? match[1].trim() : ''
}

function extractAtomLink(content: string): string {
    const match = content.match(/<link[^>]*href="([^"]+)"[^>]*rel="alternate"/i)
        || content.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i)
        || content.match(/<link[^>]*href="([^"]+)"/i)
    return match ? match[1] : ''
}
