import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ isFollowing: false, isOwnProfile: false })

        const { searchParams } = new URL(req.url)
        const targetUserId = searchParams.get("userId")

        if (!targetUserId) return NextResponse.json({ error: "User ID required" }, { status: 400 })

        if (targetUserId === session.user.id) {
            return NextResponse.json({ isFollowing: false, isOwnProfile: true })
        }

        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: targetUserId
                }
            }
        })

        return NextResponse.json({ isFollowing: !!follow, isOwnProfile: false })
    } catch (error) {
        return NextResponse.json({ error: "Failed to check follow status" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { followingId } = body // The ID of the USER to follow

        if (!followingId) return NextResponse.json({ error: "Following ID required" }, { status: 400 })
        if (followingId === session.user.id) return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 })

        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId
                }
            }
        })

        if (existingFollow) {
            // Unfollow
            await prisma.follow.delete({
                where: { id: existingFollow.id }
            })
            return NextResponse.json({ followed: false })
        } else {
            // Follow
            await prisma.follow.create({
                data: {
                    followerId: session.user.id,
                    followingId
                }
            })

            // Create notification for the person being followed
            await prisma.notification.create({
                data: {
                    userId: followingId,
                    type: "FOLLOW",
                    content: `${session.user.name || 'Birisi'} sizi takip etmeye başladı.`,
                    link: `/${session.user.email?.split('@')[0]}` // Assuming username or profile link
                }
            })

            return NextResponse.json({ followed: true })
        }
    } catch (error) {
        console.error("Follow Error:", error)
        return NextResponse.json({ error: "Follow action failed" }, { status: 500 })
    }
}
