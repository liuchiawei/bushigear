import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag, unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/cache";

async function getCartData(userId: number) {
  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: { product: true },
  });
  const items = cartItems.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return { items, total };
}

// キャッシュ無効化ヘルパー
function invalidateCartCache(userId: number) {
  revalidateTag(CACHE_TAGS.CART(userId));
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
  
  // キャッシュされた関数を作成
  const cachedGetCartData = unstable_cache(
    () => getCartData(userId),
    [`cart-${userId}`],
    {
      revalidate: CACHE_TTL.SHORT, // 60秒
      tags: [CACHE_TAGS.CART(userId)],
    }
  );
  
  const cart = await cachedGetCartData();
  
  // キャッシュヘッダーを設定
  const headers = new Headers();
  headers.set("Cache-Control", "private, s-maxage=60, stale-while-revalidate=120");
  
  return NextResponse.json({ cart }, { headers });
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
  const quantity: number = Number(body.quantity ?? 1);
  if (!productId || quantity <= 0) {
    return NextResponse.json(
      { message: "Invalid productId or quantity" },
      { status: 400 }
    );
  }
  
  // 既存のカートアイテムを取得
  const existing = await prisma.cart.findUnique({
    where: { userId_productId: { userId, productId } },
    include: { product: true },
  });
  
  let updatedItem;
  if (existing) {
    updatedItem = await prisma.cart.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity: existing.quantity + quantity },
      include: { product: true },
    });
  } else {
    updatedItem = await prisma.cart.create({ 
      data: { userId, productId, quantity },
      include: { product: true },
    });
  }
  
  // キャッシュを無効化
  invalidateCartCache(userId);
  
  // 更新されたアイテムのみを返す（フロントエンドで楽観的更新が可能）
  const item = {
    product: updatedItem.product,
    quantity: updatedItem.quantity,
  };
  const total = item.product.price * item.quantity;
  
  return NextResponse.json({ 
    cart: { items: [item], total },
    updatedItem: item,
  });
}

export async function PATCH(req: Request) {
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
  const quantity: number = Number(body.quantity);
  if (!productId || quantity === undefined) {
    return NextResponse.json(
      { message: "Invalid productId or quantity" },
      { status: 400 }
    );
  }
  
  let updatedItem = null;
  if (quantity <= 0) {
    await prisma.cart.delete({
      where: { userId_productId: { userId, productId } },
    }).catch(() => {});
  } else {
    updatedItem = await prisma.cart.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity },
      create: { userId, productId, quantity },
      include: { product: true },
    });
  }
  
  // キャッシュを無効化
  invalidateCartCache(userId);
  
  // 更新されたアイテムのみを返す
  if (updatedItem) {
    const item = {
      product: updatedItem.product,
      quantity: updatedItem.quantity,
    };
    return NextResponse.json({ 
      updatedItem: item,
      deleted: false,
    });
  }
  
  return NextResponse.json({ 
    deleted: true,
    productId,
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
  
  if (productId) {
    await prisma.cart.delete({
      where: { userId_productId: { userId, productId } },
    }).catch(() => {});
  } else {
    await prisma.cart.deleteMany({ where: { userId } });
  }
  
  // キャッシュを無効化
  invalidateCartCache(userId);
  
  return NextResponse.json({ 
    deleted: true,
    productId: productId || null,
  });
}
