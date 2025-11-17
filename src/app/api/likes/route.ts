import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

async function getLikes(userId: number) {
  const likes = await prisma.like.findMany({
    where: { userId },
    include: { product: true },
  });
  return likes;
}

// キャッシュ無効化ヘルパー
function invalidateLikesCache(userId: number) {
  revalidateTag(CACHE_TAGS.LIKES(userId));
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
  
  const like = await prisma.like.upsert({
    where: { userId_productId: { userId, productId } },
    update: {},
    create: { userId, productId },
    include: { product: true },
  });
  
  // キャッシュを無効化
  invalidateLikesCache(userId);
  
  // 追加された like のみを返す
  return NextResponse.json({ 
    like: {
      productId: like.productId,
      product: like.product,
    },
    added: true,
  });
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
  
  // キャッシュを無効化
  invalidateLikesCache(userId);
  
  return NextResponse.json({ 
    deleted: true,
    productId,
  });
}
