import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

async function getLikes(userId: number) {
  const likes = await prisma.like.findMany({
    where: { userId },
    include: { product: true },
  });
  return likes;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = Number(session.user.id);
  const likes = await getLikes(userId);
  return NextResponse.json({ likes });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = Number(session.user.id);
  const body = await req.json().catch(() => ({}));
  const productId: number = Number(body.productId);
  if (!productId) {
    return NextResponse.json(
      { message: "Invalid productId" },
      { status: 400 }
    );
  }
  await prisma.like.upsert({
    where: { userId_productId: { userId, productId } },
    update: {},
    create: { userId, productId },
  });
  const likes = await getLikes(userId);
  return NextResponse.json({ likes });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = Number(session.user.id);
  let productId: number | undefined;
  try {
    const body = await req.json();
    productId = body?.productId ? Number(body.productId) : undefined;
  } catch {
    productId = undefined;
  }
  if (!productId) {
    return NextResponse.json(
      { message: "Invalid productId" },
      { status: 400 }
    );
  }
  await prisma.like.delete({
    where: { userId_productId: { userId, productId } },
  }).catch(() => {});
  const likes = await getLikes(userId);
  return NextResponse.json({ likes });
}
