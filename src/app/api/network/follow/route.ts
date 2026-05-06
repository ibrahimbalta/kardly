import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Check if following or get follower/following counts
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId");

    if (targetUserId) {
      // Check if following specific user
      const follow = await prisma.follow.findFirst({
        where: {
          follower: { email: session.user.email },
          followingId: targetUserId,
        },
      });
      return NextResponse.json({ isFollowing: !!follow });
    }

    // Default: Return counts for the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        _count: {
          select: {
            following: true,
            followers: true,
          },
        },
      },
    });

    return NextResponse.json({
      followingCount: user?._count.following || 0,
      followersCount: user?._count.followers || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// POST - Follow/Unfollow toggle
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId } = await req.json();
    if (!targetUserId) {
      return NextResponse.json({ error: "Target User ID required" }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser || currentUser.id === targetUserId) {
      return NextResponse.json({ error: "Invalid follow action" }, { status: 400 });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });
      return NextResponse.json({ following: false });
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      });

      // Create Notification
      await prisma.notification.create({
        data: {
          userId: targetUserId,
          type: "FOLLOW",
          content: `${currentUser.name || "Bir kullanıcı"} seni takip etmeye başladı.`,
          link: `/dashboard?tab=network`,
        },
      });

      return NextResponse.json({ following: true });
    }
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json({ error: "Failed to process follow" }, { status: 500 });
  }
}
