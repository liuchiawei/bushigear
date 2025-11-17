import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id ? Number(session.user.id) : null;
    
    // ユーザーがログインしている場合、自分の注文のみを取得（パフォーマンス向上）
    const where = userId ? { userId } : undefined;
    
    const orders = await prisma.order.findMany({
      where,
      include: {
        product: true,
        user: {
          select: {
            id: true,
            email: true,
            lastName: true,
            firstName: true,
            postalCode: true,
            prefecture: true,
            city: true,
            street: true,
            building: true,
            room: true,
            address: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });
    
    // キャッシュヘッダーを設定（ユーザー固有のデータなので短め）
    const headers = new Headers();
    if (userId) {
      headers.set("Cache-Control", "private, s-maxage=60, stale-while-revalidate=120");
    } else {
      headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    }
    
    return Response.json(orders, { headers });
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id
      ? parseInt(String(session.user.id))
      : null;
    const body = await request.json();
    const productId = parseInt(String(body.productId));
    const quantity = parseInt(String(body.quantity));
    const lastName: string | null = body.lastName ? String(body.lastName).trim() || null : null;
    const firstName: string | null = body.firstName ? String(body.firstName).trim() || null : null;
    const email: string | null = body.email ? String(body.email).trim() || null : null;
    const address: string | null = body.address ? String(body.address).trim() || null : null;

    if (!productId || !quantity || quantity <= 0) {
      return new Response("Invalid productId or quantity", { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return new Response("Product not found", { status: 404 });
    if ((product.stock ?? 0) < quantity) {
      return new Response("Insufficient stock", { status: 409 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          productId,
          quantity,
          userId: currentUserId,
          lastName,
          firstName,
          email,
          address,
        },
        include: { product: true },
      });
      await tx.product.update({
        where: { id: productId },
        data: { stock: (product.stock ?? 0) - quantity },
      });
      return order;
    });

    // 注文関連のキャッシュを無効化
    if (currentUserId) {
      revalidateTag(CACHE_TAGS.ORDERS(currentUserId));
    }
    // 商品の在庫が変わったので商品キャッシュも無効化
    revalidateTag(CACHE_TAGS.PRODUCT(productId));
    revalidateTag(CACHE_TAGS.PRODUCTS);

    return Response.json(result, { status: 201 });
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}
