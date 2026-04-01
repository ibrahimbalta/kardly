import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const position = searchParams.get("position");

  try {
    const ads = await prisma.advertisement.findMany({
      where: {
        isActive: true,
        ...(position ? { position } : {}),
      },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(ads);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is admin (Assuming user email is ibrahimbalta@icloud.com based on repo)
  if (!session || session.user?.email !== "ibrahimbalta@icloud.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const ad = await prisma.advertisement.create({ data });
    return NextResponse.json(ad);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.email !== "ibrahimbalta@icloud.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...data } = await req.json();
    const ad = await prisma.advertisement.update({
      where: { id },
      data,
    });
    return NextResponse.json(ad);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update ad" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.email !== "ibrahimbalta@icloud.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await prisma.advertisement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 });
  }
}
