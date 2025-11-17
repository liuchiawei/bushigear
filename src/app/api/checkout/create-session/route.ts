// Checkout Session 作成 API
import { NextRequest, NextResponse } from "next/server";
import { stripe, formatAmountForStripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id
      ? parseInt(String(session.user.id))
      : null;

    const body = await request.json();
    const { items, customer } = body;

    // バリデーション
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "カートが空です" },
        { status: 400 }
      );
    }

    if (
      !customer?.lastName ||
      !customer?.firstName ||
      !customer?.email ||
      !customer?.address
    ) {
      return NextResponse.json(
        { error: "必須項目を入力してください" },
        { status: 400 }
      );
    }

    // 商品情報を取得して在庫を確認
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "一部の商品が見つかりません" },
        { status: 404 }
      );
    }

    // 在庫確認と合計金額計算
    const lineItems: Array<{
      price_data: {
        currency: string;
        product_data: {
          name: string;
          description?: string;
          images?: string[];
        };
        unit_amount: number;
      };
      quantity: number;
    }> = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `商品 ID ${item.productId} が見つかりません` },
          { status: 404 }
        );
      }

      if ((product.stock ?? 0) < item.quantity) {
        return NextResponse.json(
          { error: `${product.name_jp} の在庫が不足しています` },
          { status: 409 }
        );
      }

      lineItems.push({
        price_data: {
          currency: "jpy",
          product_data: {
            name: product.name_jp,
            description: product.brand,
            images: [product.image],
          },
          unit_amount: formatAmountForStripe(product.price),
        },
        quantity: item.quantity,
      });
    }

    // アプリケーションの URL を取得
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Stripe Checkout Session を作成
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?canceled=true`,
      customer_email: customer.email,
      metadata: {
        userId: currentUserId?.toString() || "",
        lastName: customer.lastName,
        firstName: customer.firstName,
        email: customer.email,
        address: customer.address,
        // 商品情報を JSON 文字列として保存
        items: JSON.stringify(items),
      },
      // 特定商取引法に基づく表記ページの URL
      custom_text: {
        terms_of_service_acceptance: {
          message: `[特定商取引法に基づく表記](${appUrl}/legal/tokusho) に同意します。`,
        },
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "チェックアウトセッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}

