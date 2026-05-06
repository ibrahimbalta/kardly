import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { searchParams } = new URL(req.url)
        const otherUserId = searchParams.get("userId")

        if (otherUserId) {
            // Fetch conversation with specific user
            const messages = await prisma.directMessage.findMany({
                where: {
                    OR: [
                        { senderId: session.user.id, receiverId: otherUserId },
                        { senderId: otherUserId, receiverId: session.user.id }
                    ]
                },
                orderBy: { createdAt: "asc" }
            })

            // Mark received messages as read
            await prisma.directMessage.updateMany({
                where: { senderId: otherUserId, receiverId: session.user.id, isRead: false },
                data: { isRead: true }
            })

            return NextResponse.json(messages)
        } else {
            // Fetch all conversations (latest message per user)
            // This is a bit complex in Prisma without raw queries, 
            // but we can fetch unique sender/receivers and then get the latest.
            
            const sentMessages = await prisma.directMessage.findMany({
                where: { senderId: session.user.id },
                include: { receiver: { select: { id: true, name: true, image: true } } },
                orderBy: { createdAt: "desc" }
            })

            const receivedMessages = await prisma.directMessage.findMany({
                where: { receiverId: session.user.id },
                include: { sender: { select: { id: true, name: true, image: true } } },
                orderBy: { createdAt: "desc" }
            })

            // Combine and get unique users with latest message
            const conversationsMap = new Map()
            
            receivedMessages.forEach(msg => {
                const userId = msg.senderId
                if (!conversationsMap.has(userId) || conversationsMap.get(userId).createdAt < msg.createdAt) {
                    conversationsMap.set(userId, {
                        userId,
                        name: msg.sender.name,
                        image: msg.sender.image,
                        lastMessage: msg.content,
                        createdAt: msg.createdAt,
                        unread: !msg.isRead
                    })
                }
            })

            sentMessages.forEach(msg => {
                const userId = msg.receiverId
                if (!conversationsMap.has(userId) || conversationsMap.get(userId).createdAt < msg.createdAt) {
                    conversationsMap.set(userId, {
                        userId,
                        name: msg.receiver.name,
                        image: msg.receiver.image,
                        lastMessage: msg.content,
                        createdAt: msg.createdAt,
                        unread: false
                    })
                }
            })

            const conversations = Array.from(conversationsMap.values()).sort((a, b) => b.createdAt - a.createdAt)
            return NextResponse.json(conversations)
        }
    } catch (error) {
        console.error("Messages Fetch Error:", error)
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { receiverId, content } = body

        if (!receiverId || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

        const message = await prisma.directMessage.create({
            data: {
                senderId: session.user.id,
                receiverId,
                content
            }
        })

        // Notify receiver
        await prisma.notification.create({
            data: {
                userId: receiverId,
                type: "NEW_MESSAGE",
                content: `${session.user.name || 'Birisi'} size bir mesaj gönderdi.`,
                link: `/dashboard/messages?userId=${session.user.id}`
            }
        })

        return NextResponse.json(message)
    } catch (error) {
        console.error("Message Send Error:", error)
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }
}
