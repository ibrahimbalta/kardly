import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch messages or conversation list
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("userId");

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (otherUserId) {
      // Get conversation between current user and other user
      const messages = await prisma.directMessage.findMany({
        where: {
          OR: [
            { senderId: currentUser.id, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: currentUser.id },
          ],
        },
        orderBy: { createdAt: "asc" },
      });

      // Mark as read
      await prisma.directMessage.updateMany({
        where: {
          senderId: otherUserId,
          receiverId: currentUser.id,
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json(messages);
    }

    // Default: Get unique conversation list (last message from each)
    // This is a bit complex in Prisma without raw queries, 
    // so we'll get messages and group them in JS for now or get distinct pairs.
    const conversations = await prisma.directMessage.findMany({
      where: {
        OR: [
          { senderId: currentUser.id },
          { receiverId: currentUser.id },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
    });

    // Simple grouping logic for unique conversations
    const uniqueConversations: any[] = [];
    const processedIds = new Set();

    conversations.forEach(msg => {
      const otherUser = msg.senderId === currentUser.id ? msg.receiver : msg.sender;
      if (!processedIds.has(otherUser.id)) {
        uniqueConversations.push({
          otherUser,
          lastMessage: msg,
          unreadCount: 0, // Would need separate count query
        });
        processedIds.add(otherUser.id);
      }
    });

    return NextResponse.json(uniqueConversations);
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// POST - Send a message
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId, content } = await req.json();
    if (!receiverId || !content) {
      return NextResponse.json({ error: "Receiver and content required" }, { status: 400 });
    }

    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!sender) return NextResponse.json({ error: "Sender not found" }, { status: 404 });

    const message = await prisma.directMessage.create({
      data: {
        senderId: sender.id,
        receiverId,
        content,
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "NEW_MESSAGE",
        content: `${sender.name || "Bir kullanıcı"} sana mesaj gönderdi.`,
        link: `/dashboard?tab=messages`, // Tab we will create
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
