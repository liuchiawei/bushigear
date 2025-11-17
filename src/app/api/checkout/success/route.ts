// 支払い成功時の処理 API
import { NextRequest, NextResponse } from "next/server";
import { getCheckoutSession, isSessionCompleted } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "セッション ID が指定されていません" },
        { status: 400 }
      );
    }

    // Stripe Checkout Session を取得
    const session = await getCheckoutSession(sessionId);

    // セッションが完了しているか確認
    if (!isSessionCompleted(session)) {
      return NextResponse.json(
        { error: "支払いが完了していません" },
        { status: 400 }
      );
    }

    // 既に注文が作成されているか確認
    const existingOrder = await prisma.order.findFirst({
      where: { checkoutSessionId: sessionId },
    });

    if (existingOrder) {
      // 既に注文が存在する場合はその情報を返す
      const orders = await prisma.order.findMany({
        where: { checkoutSessionId: sessionId },
        include: { product: true },
      });

      return NextResponse.json({
        success: true,
        orders,
        sessionId,
      });
    }

    // メタデータから注文情報を取得
    const metadata = session.metadata;
    if (!metadata) {
      return NextResponse.json(
        { error: "セッションメタデータが見つかりません" },
        { status: 400 }
      );
    }

    const userId = metadata.userId ? parseInt(metadata.userId) : null;
    const items = JSON.parse(metadata.items || "[]");

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "注文情報が無効です" },
        { status: 400 }
      );
    }

    // 商品情報を取得
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // トランザクションで注文を作成
    const orders = await prisma.$transaction(async (tx) => {
      const createdOrders = [];

      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          throw new Error(`商品 ID ${item.productId} が見つかりません`);
        }

        // 在庫を再度確認
        if ((product.stock ?? 0) < item.quantity) {
          throw new Error(`${product.name_jp} の在庫が不足しています`);
        }

        const total = product.price * item.quantity;

        // 注文を作成
        const order = await tx.order.create({
          data: {
            userId,
            productId: item.productId,
            quantity: item.quantity,
            lastName: metadata.lastName || null,
            firstName: metadata.firstName || null,
            email: metadata.email || null,
            address: metadata.address || null,
            checkoutSessionId: sessionId,
            paymentStatus: "succeeded",
            total,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : session.customer?.id || null,
          },
          include: { product: true },
        });

        createdOrders.push(order);

        // 在庫を更新
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: (product.stock ?? 0) - item.quantity },
        });
      }

      return createdOrders;
    });

    // キャッシュを無効化
    if (userId) {
      revalidateTag(CACHE_TAGS.ORDERS(userId));
    }
    for (const productId of productIds) {
      revalidateTag(CACHE_TAGS.PRODUCT(productId));
    }
    revalidateTag(CACHE_TAGS.PRODUCTS);

    return NextResponse.json({
      success: true,
      orders,
      sessionId,
    });
  } catch (error: any) {
    console.error("Error processing checkout success:", error);
    return NextResponse.json(
      { error: error.message || "注文処理に失敗しました" },
      { status: 500 }
    );
  }
}

